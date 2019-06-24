////////////////////////////////////////////////////
// express
const express = require("express");
const app = express();
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// socket.io
const server = require("http").Server(app);
// 'origins' prevents csrf kind attack, you define which url and port to listen to
const io = require("socket.io")(server, { origins: "localhost:8080" });
////////////////////////////////////////////////////

const compression = require("compression");
const db = require("./utils/db");
const bc = require("./utils/bc");
const s3 = require("./utils/s3");

const getNews = require("./utils/news");

const csurf = require("csurf");

const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const https = require("https");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    },
    onError: function(err) {
        console.log("multer error", err);
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/////////////////////////////////////////////////////////////
// SOCKET IO SETTINGS
const cookieSessionMiddleware = cookieSession({
    secret: "this is my crazy secret text",
    maxAge: 1000 * 60 * 60 * 24 * 14 // 2 weeks
});

app.use(cookieSessionMiddleware);
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
/////////////////////////////////////////////////////////////

app.use(compression());

app.use(express.static(__dirname + "/public"));

app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

/////////////////////////////////////////////////////////////
//
// ROUTES
//
//////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////////////////////////////////////
// REGISTER
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/register", async (req, res) => {
    console.log("/register req.body", req.body);

    let { first, last, email, password1 } = req.body;
    // if something is missing, go back to "/"
    if (!first || !last || !email || !password1) {
        console.log("is missing?");

        return res.redirect("/");
    }
    // otherwise add user
    try {
        console.log("nothing is empty", first, last, email, password1);

        let hashedPw = await bc.hashPassword(password1);
        let rslt = await db.addUser(first, last, email, hashedPw);
        req.session.userId = rslt.rows[0].id;
        console.log(req.session.userId);

        res.json({ success: true });
    } catch (err) {
        console.log("error in adding user", err);
        res.json({ error: "Something went wrong!" });
    }
}); // register ends

/////////////////////////////////////////////////////////////
// LOGIN
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/login", async (req, res) => {
    console.log("/login req.body", req.body);

    let { email, password } = req.body;
    // if something is missing, go back to "/"
    if (!email || !password) {
        res.redirect("/");
    }
    // otherwise grab user data from db
    let pwQuery = await db.getUserPwd(email);
    //check if there is a row with this email
    if (pwQuery.rows.length) {
        let userId = pwQuery.rows[0].id;
        let pwCheck = await bc.checkPassword(
            password,
            pwQuery.rows[0].password
        );
        // if password is correct set session id, else drop an error
        if (pwCheck) {
            req.session.userId = userId;
            res.json({ success: true });
        } else {
            res.json({ error: "Email or password is not correct" });
        }
    } else {
        res.json({
            error: "Something went wrong!"
        });
    }
}); // login ends

/////////////////////////////////////////////////////////////
// LOGOUT
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/logout", (req, res) => {
    console.log("/logout POST req.body", req.session);
    if (req.body.wantToLogout) {
        req.session = null;

        res.redirect("/");
    } else {
        res.json("Something went wrong with logout");
    }
});

/////////////////////////////////////////////////////////////
// GET USER DATA
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get("/getuserdata", (req, res) => {
    db.getUserData(req.session.userId)
        .then(rslt => {
            if (!rslt.rows[0].imageurl) {
                rslt.rows[0].imageurl = "./user.svg";
            }
            res.json(rslt.rows[0]);
        })
        .catch(err => {
            console.log("/getuserdata query error: ", err);
        });
});

/////////////////////////////////////////////////////////////
// CHANGE USER IMAGE
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/changeuserimage", uploader.single("file"), s3.upload, function(
    req,
    res
) {
    console.log("/changeuserimage POST", req.body);
    let imageurl =
        "https://s3.amazonaws.com/danielvarga-salt/" + req.file.filename;
    console.log(
        "/changeuserimage POST req.file.filename, imageurl, req.session: ",
        req.file.filename,
        imageurl,
        req.session
    );

    db.changeUserImage(req.session.userId, imageurl)
        .then(rslt => {
            console.log("/changeuserimage result", rslt);
            res.json({
                status: "success",
                url: imageurl
            });
        })
        .catch(err => {
            console.log(err);
        });
});

/////////////////////////////////////////////////////////////
// AUDIO RECORDED
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/audio-recorded", (req, res) => {
    console.log("/audio-recorded", req.body);
    res.json("audio arrived");
});

/////////////////////////////////////////////////////////////
// NEWS
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get("/get-news", (req, res) => {
    getNews.getNews("Metallica", (err, rslt) => {
        if (err) {
            console.log("getNews error", err);
        }
        console.log("getNews result", rslt);
    });
    console.log("/news");
});

/////////////////////////////////////////////////////////////
// FOURSQUARE
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get("/foursquare", (req, res) => {
    console.log("foursquare");
    res.json("foursquare arrived");
});

////////////////////////////////////////////////////////////
// SOCKET

io.on("connection", async socket => {
    console.log("new socket connection", socket.request.session);
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    try {
        socket.on("newLesson", lesson => {
            console.log("newLesson", lesson);
        });
    } catch (err) {
        console.log("socket error", err);
    }

    socket.on("disconnect", async () => {
        // await db.deleteOffline(socket.id, socket.request.session.userId);
        // let rslt = await db.getOnlineFriends();

        // console.log("onlineusers after deleting: ", rslt.rows);
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });
}); //socket ends

app.get("/welcome", (req, res) => {
    req.session.userId
        ? res.redirect("/")
        : res.sendFile(__dirname + "/index.html");
});

app.get("*", (req, res) => {
    !req.session.userId
        ? res.redirect("/welcome")
        : res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
    console.log("Server is listening on port 8080");
});

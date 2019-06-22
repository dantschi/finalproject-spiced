////////////////////////////////////////////////////
// express
const express = require('express');
const app = express();
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// socket.io
const server = require("http").Server(app);
// 'origins' prevents csrf kind attack, you define which url and port to listen to
const io = require("socket.io")(server, { origins: "localhost:8080" });
////////////////////////////////////////////////////


const compression = require('compression');
const db = require("./utils/db");
const bc = require("./utils/bc");
const s3 = require("./utils/s3");

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


if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

/////////////////////////////////////////////////////////////
//
// ROUTES
//
//////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////////////////////////////////////
// REGISTER
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/register", async (req, res) =>{
    let {fn, ln, em, pw} = req.body;
    // if something is missing, go back to "/"
    if(!fn || !ln || !em || !pw) {
        return res.redirect("/");
    }
    // otherwise add user
    try {
        let hashedPw = await bc.hashPassword(pw);
        let rslt = await db.addUser(fn.trim(), ln.trim(), em.trim(), hashedPw);
        req.session.userId = rslt.rows[0].id
        res.json({success:true})
    } catch(err) {
        console.log("error in adding user", err);
        res.json({error: "Something went wrong!"})
    }
}); // register ends

/////////////////////////////////////////////////////////////
// LOGIN
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/login", async (req, res) =>{
    let {em, pw} = req.body;
    // if something is missing, go back to "/"
    if (!em || !pw) {
        res.redirect("/");
    }
    // otherwise grab user data from db
    let pwQuery = await db.getUserPwd(em);
    //check if there is a row with this email
    if (pwQuery.rows.length) {
        let userId = pwQuery.rows[0].id
        let pwCheck = await bc.checkPassword(pw,pwQuery.rows[0].pw)
        // if password is correct set session id, else drop an error
        if (pwCheck){
            req.session.userId = userId;
            res.json({success:true});
        } else {
            res.json({error: "Email or password is not correct"});
        }
    } else {
        res.json({
            error: "Something went wrong!"
        })
    }

}) // login ends














app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080, function() {
    console.log("Server is listening on port 8080");
});

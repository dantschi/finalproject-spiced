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
const god = require("./utils/getogdetails");

const csurf = require("csurf");

const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const https = require("https");

/////////////////////////////////////////////////////////////
// MULTER
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            console.log("file originalname", file.originalname);
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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

    let { first, last, emailReg, password1 } = req.body;
    // if something is missing, go back to "/"
    if (!first || !last || !emailReg || !password1) {
        console.log("is missing?");

        return res.redirect("/");
    }
    // otherwise add user
    try {
        console.log("nothing is empty", first, last, emailReg, password1);

        let hashedPw = await bc.hashPassword(password1);
        let rslt = await db.addUser(first, last, emailReg, hashedPw);
        req.session.userId = rslt.rows[0].id;
        await db.addProfile(req.session.userId);
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

    let { emailLogin, password } = req.body;
    // if something is missing, go back to "/"
    if (!emailLogin || !password) {
        res.redirect("/");
    }
    // otherwise grab user data from db
    let pwQuery = await db.getUserPwd(emailLogin);
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
                rslt.rows[0].imageurl = "/user.svg";
            }
            res.json(rslt.rows[0]);
        })
        .catch(err => {
            console.log("/getuserdata query error: ", err);
        });
});

/////////////////////////////////////////////////////////////
// ADD LESSON WITH AUDIO
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post(
    "/add-lesson-with-audio",
    uploader.single("rec"),
    s3.upload,
    async function(req, res) {
        console.log("req.body", req.body);
        let {
            goal,
            title,
            externalUrl,
            desc,
            challenge,
            categories
        } = req.body;
        let audioUrl =
            "https://s3.amazonaws.com/danielvarga-salt/" + req.file.filename;
        try {
            let rslt = await db.addLesson(
                req.session.userId,
                title,
                desc,
                externalUrl,
                challenge,
                goal,
                categories,
                audioUrl
            );

            console.log("/add-lesson-with success", rslt);
            res.json(rslt);
        } catch (err) {
            console.log("/add-lesson-with error", err);
        }
    }
);

/////////////////////////////////////////////////////////////
// ADD LESSON WITHOUT AUDIO
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/add-lesson-without-audio", async (req, res) => {
    console.log("req.body", req.body);
    let {
        goal,
        title,
        externalUrl,
        description,
        challenge,
        categories
    } = req.body;

    try {
        let rslt = await db.addLesson(
            req.session.userId,
            title,
            description,
            externalUrl,
            challenge,
            goal,
            categories
        );

        console.log("/add-lesson-without success", rslt);
        res.json(rslt);
    } catch (err) {
        console.log("/add-lesson-without error", err);
    }
});

/////////////////////////////////////////////////////////////
// CHANGE USER IMAGE
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post(
    "/changeuserdata-with-image",
    uploader.single("file"),
    s3.upload,
    function(req, res) {
        console.log("/changeuserimage POST", req.file);
        let { location, genres, bands, instruments, description } = req.body;
        let imageurl = (this.imageurl =
            "https://s3.amazonaws.com/danielvarga-salt/" + req.file.filename);
        console.log(
            "/changeuserimage POST req.file.filename, imageurl, req.session: ",
            req.file.filename,
            this.imageurl,
            req.session
        );

        Promise.all([
            db.changeUserImage(req.session.userId, this.imageurl),
            db.changeUserProfile(
                req.session.userId,
                location,
                genres,
                bands,
                instruments,
                description
            )
        ])

            .then(rslt => {
                console.log("/changeuserdata result", rslt);
                res.json({
                    status: "success",
                    url: imageurl
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
);

/////////////////////////////////////////////////////////////
// CHANGE USER DATA
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/change-user-data", (req, res) => {
    let { location, genres, bands, instruments, description } = req.body;
    console.log("/change-user-data", req.body);
    db.changeUserProfile(
        req.session.userId,
        location,
        genres,
        bands,
        instruments,
        description
    )
        .then(rslt => {
            console.log("changeUserData result", rslt);
            res.json(rslt.rows[0]);
        })
        .catch(err => {
            console.log("changeUserData error", err);
        });
});

/////////////////////////////////////////////////////////////
// GET LESSONS
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get("/get-lessons", (req, res) => {
    console.log("/get-lessons request");
    db.getLessons()
        .then(rslt => {
            res.json(rslt.rows);
        })
        .catch(err => {
            console.log("/get-lessons error", err);
        });
});

/////////////////////////////////////////////////////////////
// GET LESSON DATA
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get("/get-lesson-data/:id", async (req, res) => {
    console.log("/get-lesson-data params", req.params, req.session);
    // let tempRes = await db.getThisStartedDetails(
    //     req.params.id,
    //     req.session.userId
    // );

    // db.getLessonStarters(req.params.is);
    // db.getLessonData(req.params.id);
    // db.getLessonDataTest(req.params.id, req.session.userId)
    //     .then(rslt => {
    //         console.log("test result", rslt);
    //         res.json(rslt.rows[0]);
    //     })
    //     .catch(err => {
    //         console.log("test error", err);
    //     });

    Promise.all([
        db.getLessonStarters(req.params.id),
        db.getLessonData(req.params.id, req.session.userId)
    ])
        .then(rslt => {
            console.log("lesson data", rslt[1].rows[0]);
            res.json([rslt[0].rows, rslt[1].rows]);
            // if (rslt[1].rows[0].external_url.startsWith("https://")) {
            //     god.getOgDetails(
            //         rslt[1].rows[0].external_url,
            //         (err, result) => {
            //             if (err) {
            //                 console.log("omg error", err);
            //                 res.json(
            //                     rslt[1].rows[0].external_url,
            //                     rslt[1].rows
            //                 );
            //             }
            //             console.log(
            //                 "omg result",
            //                 result,
            //                 typeof rslt[1].rows[0]
            //             );
            //             rslt[1].rows[0].external_url = result;
            //             res.json([rslt[0].rows[0], rslt[1].rows]);
            //         }
            //     );
            // } else {
            //     res.json([rslt[0].rows[0], rslt[1].rows]);
            // }
        })
        .catch(err => {
            console.log("lesson data error", err);
        });
});

/////////////////////////////////////////////////////////////
// START LESSON AND DETAILS
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/start-lesson", (req, res) => {
    console.log("/start-lesson req.body", req.body);
    db.startLesson(req.body.lessonId, req.session.userId)
        .then(rslt => {
            console.log("/start-lesson query result", rslt.rows[0]);
            res.json(rslt.rows[0]);
        })
        .catch(err => {
            console.log("/start-lesson query error", err);
        });
});

/////////////////////////////////////////////////////////////
// SUBMIT LESSON WITHOUT AUDIO
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post("/submit-lesson-without-audio", (req, res) => {
    console.log("/submit-lesson-without-audio", req.body);
    db.submitAnswer(
        req.session.userId,
        req.body.parent_lesson_id,
        req.body.answer,
        null
    )
        .then(rslt => {
            console.log(rslt);
            res.json(rslt);
        })
        .catch(err => {
            console.log("submit-lesson-without-audio query result", err);
        });
});

/////////////////////////////////////////////////////////////
// SUBMIT LESSON WITH AUDIO
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.post(
    "/submit-lesson-with-audio",
    uploader.single("rec"),
    s3.upload,
    async function(req, res) {
        console.log("/submit-lesson-with-audio", req.body, req.params);

        let audioUrl =
            "https://s3.amazonaws.com/danielvarga-salt/" + req.file.filename;

        db.submitAnswer(
            req.session.userId,
            req.body.parent_lesson_id,
            req.body.answer,
            audioUrl
        )
            .then(rslt => {
                console.log(rslt);
                res.json(rslt.rows[0]);
            })
            .catch(err => {
                console.log("submit-lesson-with-audio query result", err);
            });

        // db.submitWithAudio(req.session.userId, req.body.answer, req.body.)
        //     .then(rslt => {
        //         console.log(rslt);
        //         res.json(rslt);
        //     })
        //     .catch(err => {
        //         console.log("submit-lesson-without-audio query result", err);
        //     });
    }
);

/////////////////////////////////////////////////////////////
// GET STARTED LESSONS
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get("/get-started-lessons", (req, res) => {
    console.log("/get-started-lessons");
    db.getStartedLessons(req.session.userId)
        .then(rslt => {
            console.log("/get-started-lessons query result", rslt.rows);
            res.json(rslt.rows);
        })
        .catch(err => {
            console.log("/get-started-lessons query error", err);
        });
});

/////////////////////////////////////////////////////////////
// GET LESSONS CREATED BY YOURSELF
////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get("/get-your-created-lessons", (req, res) => {
    console.log("/get-your-created-lessons");
    db.getYourCreatedLessons(req.session.userId)
        .then(rslt => {
            console.log("/get-your-created-lessons", rslt);
            res.json(rslt.rows);
        })
        .catch(err => {
            console.log("getYourCreatedLessons error: ", err);
        });
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
        socket.on("newNote", async note => {
            console.log("newNote", note);
            let rslt = await db.addNote(note.note, note.parent_id);
            socket.emit("addNoteResult", rslt);
        });
        socket.on("acceptAnswer", async ans => {
            console.log("accept answer details", ans);
            let rslt = await db.acceptAnswer(ans.user_id, ans.lesson_parent_id);
            console.log("accept answer query result", rslt);
            socket.emit("answerAccepted", rslt.rows[0]);
        });

        socket.on("tryAgain", async ans => {
            console.log("tryAgain details", ans);
            let rslt = await db.tryAgain(ans.user_id, ans.lesson_parent_id);
            console.log("tryAgain query result", rslt);
            socket.emit("answerSentBack", rslt.rows[0]);
        });

        socket.on("newLesson", async lesson => {
            console.log("newLesson details", lesson);
        });
        // socket.on("newLesson", async lesson => {
        //     console.log("newLesson", lesson);
        //     let {
        //         title,
        //         externalUrl,
        //         description,
        //         challenge,
        //         goal,
        //         categories
        //     } = lesson;
        //     let rslt = await db.addLesson(
        //         socket.request.session.userId,
        //         title,
        //         description,
        //         externalUrl,
        //         challenge,
        //         goal,
        //         categories
        //     );
        //     console.log("addLesson result:", rslt);
        //
        //     io.sockets.emit("newLesson", rslt.rows[0]);
        // });
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

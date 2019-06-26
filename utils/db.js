const spicedPg = require("spiced-pg");
const { username, pwd } = require("./secret.json");

const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:${username}:${pwd}@localhost:5432/finalproject`;

const db = spicedPg(dbUrl);

module.exports.addUser = function addUser(fn, ln, em, pw) {
    console.log("query fires", fn, ln, em, pw);

    return db.query(
        `
        INSERT INTO users(first, last, email, password)
        VALUES ($1,$2,$3,$4)
        RETURNING id;
        `,
        [fn, ln, em, pw]
    );
};

module.exports.getUserPwd = function getUserPwd(em) {
    return db.query(
        `
        SELECT id, password FROM users WHERE email = $1;
        `,
        [em]
    );
};

module.exports.getUserData = function getUserData(id) {
    return db.query(
        `
    SELECT users.id, users.first, users.last, users.imageurl,
    user_profiles.location, user_profiles.genres, user_profiles.bands,
    user_profiles.instruments, user_profiles.description
    FROM users
    LEFT JOIN user_profiles ON users.id = user_profiles.user_id
    WHERE users.id = $1;
    `,
        [id]
    );
};

module.exports.changeUserImage = function changeUserImage(id, url) {
    return db.query(
        `
        UPDATE users
        SET imageurl = $2
        WHERE id=$1
        `,
        [id, url]
    );
};

module.exports.changeUserProfile = function changeUserProfile(
    id,
    loc,
    genres,
    bands,
    instruments,
    description
) {
    return db.query(
        `
        UPDATE user_profiles
        SET
        location=$2, genres=$3, bands=$4,
        instruments=$5, description=$6
        WHERE id=$1
        RETURNING *;
        `,
        [id, loc, genres, bands, instruments, description]
    );
};

module.exports.getLessonStarters = function getLessonStarters(id) {
    return db.query(
        `
        SELECT
        started_lessons.id AS "started_lesson_id",
        started_lessons.text_answer, started_lessons.audio_answer,
        started_lessons.completed,
        users.id AS "user_id", users.first,users.last,users.imageurl
        FROM started_lessons
        LEFT JOIN users on started_lessons.user_id = users.id
        WHERE started_lessons.parent_lesson_id = $1

        `,
        [id]
    );
};

// module.exports.changeUserData = function changeUserData(obj) {
//     return db.query(
//         `
//         UPDATE user_profiles SET
//
//         `[obj]
//     );
// };

module.exports.addLesson = function addLesson(
    id,
    title,
    desc,
    exturl,
    ch,
    goal,
    categories,
    record_url
) {
    console.log("addLesson challenge in db", ch);
    return db.query(
        `
        INSERT INTO lessons(user_id, title, description,
            external_url, challenge, goal, categories,recording_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
        `,
        [id, title, desc, exturl, ch, goal, categories, record_url || null]
    );
};

module.exports.getLessons = function getLessons() {
    return db.query(
        `
        SELECT lessons.id, lessons.external_url, lessons.title,
        lessons.challenge, lessons.goal, lessons.description,
        lessons.categories, lessons.created_at, lessons.user_id,
        users.first AS "creator_first", users.last AS "creator_last",
        users.imageurl AS "creator_img"
        from lessons
        LEFT JOIN users on users.id=lessons.user_id
        ORDER BY id DESC;
        `,
        []
    );
};

module.exports.getLessonData = function getLessonData(id) {
    return db.query(
        `
        SELECT lessons.id AS "parent_id", lessons.external_url, lessons.title,
        lessons.challenge, lessons.goal, lessons.description,
        lessons.categories, lessons.created_at, lessons.user_id AS "creator_id",
        lessons.recording_url,
        users.first AS "creator_first", users.last AS "creator_last",
        users.imageurl AS "creator_img",
        started_lessons.id AS "started_lesson_id", started_lessons.completed AS "completed"
        from lessons
        LEFT JOIN users on users.id=lessons.user_id
        LEFT JOIN started_lessons on started_lessons.parent_lesson_id=lessons.id
        WHERE lessons.id=$1;
        `,
        [id]
    );
};

module.exports.addNote = function addNote(note, lesson_id) {
    return db.query(
        `
        UPDATE started_lessons
        SET notes=$1
        WHERE id=$2
        `,
        [note, lesson_id]
    );
};

module.exports.getThisStartedDetails = function getThisStartedDetails(
    lid,
    uid
) {
    return db.query(
        `
        SELECT * FROM started_lessons
        WHERE parent_lesson_id=$1 AND user_id=$2;
        `,
        [lid, uid]
    );
};

// module.exports.getStartedLessonData = function getStartedLessonData(uid, lid) {
//     return db.query(
//         `
//
//         `,
//         [uid, lid]
//     );
// };

module.exports.startLesson = function startLesson(id, uid) {
    return db.query(
        `
        INSERT INTO started_lessons(parent_lesson_id, user_id)
        VALUES ($1,$2)
        RETURNING *;

        `,
        [id, uid]
    );
};

module.exports.getStartedLessons = function getStartedLessons(uid) {
    return db.query(
        `
        SELECT * from started_lessons
        WHERE user_id=$1;
        `,
        [uid]
    );
};

module.exports.getYourCreatedLessons = function getYourCreatedLessons(uid) {
    return db.query(
        `
        SELECT * from lessons
        WHERE user_id=$1;
        `,
        [uid]
    );
};

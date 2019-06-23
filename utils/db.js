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
    SELECT users.id, users.first, users.last,
    user_profiles.location, user_profiles.genres, user_profiles.bands,
    user_profiles.instruments, user_profiles.imageurl, user_profiles.description
    FROM users
    LEFT JOIN user_profiles ON users.id = user_profiles.user_id
    WHERE users.id = $1;
    `,
        [id]
    );
};

module.exports.changeUserInfo = function changeUserInfo(id, url) {
    return db.query(
        `
        INSERT INTO user_profiles(user_id, imageurl)
        VALUES($1,$2)
        RETURNING *;
        `,
        [id, url]
    );
};

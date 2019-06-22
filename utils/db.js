const spicedPg = require("spiced-pg");
const { username, pwd } = require("./secret.json");

const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:${username}:${pwd}@localhost:5432/finalproject`;

    const db = spicedPg(dbUrl);

module.exports.addUser = function addUser(fn, ln, em, pw) {
    console.log("query fires", fn, ln, em, pw );
    
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
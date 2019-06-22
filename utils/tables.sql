CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fn VARCHAR(255) NOT NULL,
    ln VARCHAR(255) NOT NULL,
    em VARCHAR(255) NOT NULL UNIQUE,
    pw VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    city VARCHAR(255),
    url VARCHAR,
    user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE ON DELETE CASCADE
);

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    message TEXT,
    user_id INTEGER REFERENCES users(id)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE privatechat (
    id SERIAL PRIMARY KEY,
    message TEXT,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallposts (
    id SERIAL PRIMARY KEY,
    message TEXT,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

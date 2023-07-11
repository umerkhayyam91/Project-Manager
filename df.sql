create table users(
    user_uid uuid primary key,
    name varchar(255),
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL
);


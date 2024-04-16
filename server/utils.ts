import mysql from 'mysql2/promise'
import bluebird from 'bluebird'
import login from "~/server/login";

export const connection = mysql.createConnection({
    host: login.host,
    port: login.port,
    user: login.user,
    password: login.password,
    database: login.database,
    Promise: bluebird
})

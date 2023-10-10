/* eslint-disable */

///////////////////////////////////////////////
// This is to show a complete test application;
///////////////////////////////////////////////

const promise = require("bluebird"); // or any other Promise/A+ compatible library;
const dbConfig = require("../db-config.json"); // db connection details

const initOptions = {
  promiseLib: promise, // overriding the default (ES6 Promise);
};

// const pgp = require('pg-promise');
const pgp = require("pg-promise")(initOptions);
// See also: http://vitaly-t.github.io/pg-promise/module-pg-promise.html

// Database connection details;
// const cn = {
// 	host: '192.168.11.246', // 'localhost' is the default;
// 	port: 5432, // 5432 is the default;
// 	database: 'doc_system',
// 	user: 'postgres',
// 	password: '123456',

// 	// to auto-exit on idle, without having to shut-down the pool;
// 	// see https://github.com/vitaly-t/pg-promise#library-de-initialization
// 	allowExitOnIdle: true
// };
// You can check for all default values in:
// https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/defaults.js

const db = pgp(dbConfig); // database instance;

module.exports = { pgp, db };

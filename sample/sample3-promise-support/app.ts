import "reflect-metadata";
import * as express from "express";
import "./BlogController";
import {bootstrap} from "../../src"; // this can be require("./BlogController") actually

let app = express(); // create express server
bootstrap({
    expressApp: app
}); // register controllers routes in our express application
// controllerRunner.isLogErrorsEnabled = true; // enable error logging of exception error into console
// controllerRunner.isStackTraceEnabled = true; // enable adding of stack trace to response message

app.listen(3001); // run express app

console.log("Express server is running on port 3001. Open http://localhost:3001/blogs/");
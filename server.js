import express from 'express'
import socketio from 'socket.io'
import path from "path";

// import bodyParser from 'body-parser'
// import path from 'path'
// import http from 'http'
// import socketio from 'socket.io'

const PORT = 5000;

import express from 'express'
import socketio from 'socket.io'
import path from "path";
let app = express()

app.use(express.static(__dirname + '/public'));
app.get("/", (req, res) => {
    res.sendFile("./index.html");
  });

const server = app.listen(6004,()=>{
console.log("listenin port 8080")
});

const io = socketio(server);

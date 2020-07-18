import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'

import {addUser,removeUser,getUsers} from './user'

const PORT = 5000;
let app = express()

const server = http.createServer(app);
const io = socketio(server);
let routers = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Serve public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routers);

routers.get('/', function (req, res) {
    res.sendFile('index.html');
})

const users = {};

io.on('connection', socket => {
    socket.on('join', ({name,room,email,mobile},callback) => {
		const{error,user} = addUser({id: socket.id, name, room ,email,mobile});
    if(error) return callback(error);
    callback();	
	});
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", getUsers());
    socket.on('disconnect', () => {
        delete users[socket.id];
    })
    

    socket.on("callUser", (data) => {
        console.log("allUsers",data)
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
    // 	  socket.on('disconnect',()=>{
// 		const user = removeUser(socket.id);
// 	  })
});





//     socket.on("acceptCall", (data) => {
//         io.to(data.to).emit('callAccepted', data.signal);
//     })

// 	  socket.on('disconnect',()=>{
// 		const user = removeUser(socket.id);
// 	  })
// });
// })

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})


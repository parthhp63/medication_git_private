const http=require('http');
const express = require('express');

const app = express();
require("dotenv").config();
const path = require('path');
const cookieParser = require('cookie-parser');
const remainder=require("./controller/remainder");
const report=require('./controller/report');

const PORT = process.env.PORT || 3002; 
// const server = http.createServer(app);
const cors = require('cors');
app.get('/chat',(req,res)=>{
    res.render('./sections/chatapp.ejs')
    })
    
    app.use(cookieParser()); 
    const web = require("./routes/web");
    
    app.use(express.urlencoded({extended: false }));
    app.use(express.json());
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
app.use('/socket', express.static(path.join(__dirname, "node_modules/socket.io/client-dist")));
app.use("/", web);


const server = app.listen(PORT, () => {
console.log(`server is running at port '${PORT}'`);
});

const socketIo = require("socket.io");
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    socket.on('result_request', (output) => {
        io.sockets.emit('logout_response', {});
    });	
});



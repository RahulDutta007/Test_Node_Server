const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('./config/db')
const path = require('path')
const errorHandler = require('./middleware/error')

//group specific
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = "S3d6y13F";
const user = "testmedi";
//end group specific

const app = express()
var httpServer = require("http").createServer(app);
var io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST","PUT","DELETE","PATCH"]
    }
});
//Load env vars
dotenv.config({path: './config/config.env'})
// MongoDB connection
connectDB()

app.use((req, res, next ) => {
    res.header("Access-Control-Allow-Origin","*") // we can put a specific webpage or website instead of * to allow access to apis
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,token") // we can also give * as the second parameter string
    if(req.method === "OPTIONS")
    {
        res.header("Access-Control-Allow-Methods","PUT, POST, GET, PATCH, DELETE")
        return res.status(200).json({})
    }
    next() // if we dont put next here, this will block any incoming request and expecting to get OPTIONS here
})

//app.use(express.static(path.join(__dirname, '../WebClient/build')));

app.use(express.json())
// app.get('/',(req, res) =>{
//     res.json({success:true})
// })
app.use('/uploads',express.static('uploads'))

module.exports = {
    getIOInstance: () => io
}

// user Section
app.use("/api/v1/user", require('./api/routes/user'))

app.use(errorHandler)

const PORT = process.env.PORT || 4003;

const server = httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.italic.bold)
    io.on("connection", function (socket) {
        console.log("new socket user" + socket.id);
        socket.on("approval",  message => {
            socket.broadcast.emit("messageSent", message);
            console.log(message);
        });
    });
});

// const server = httpServer.listen(PORT, ()=>{
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.italic.bold)
// })

// var getIOInstance = function () {
//     return io;
// };

process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`.red)
    server.close(()=>process.exit(1))
})


// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../WebClient/build', 'index.html'));
// });

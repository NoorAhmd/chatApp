const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server) // server has to be http server (not express!)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')
    socket.on('sendMessage', (message, callback) => {
        io.emit('message', message)
        callback()

    })
    socket.on('location', (address) => {
        io.emit('message', `https://www.google.com/maps?q=${address.lat},${address.long}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})
server.listen(port, () => {
    console.log("Server is running on port: ", port);
})
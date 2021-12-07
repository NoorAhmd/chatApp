const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server) // server has to be http server (not express!)
const { generateMessage } = require('./utils/messages')
const { addUser, removeUser, getUsersInRoom, getUser } = require('./utils/users')

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome'))
        socket.broadcast.to(room).emit('message', generateMessage(`${user.username} has joined!`))

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        io.to('anka').emit('message', generateMessage(message))
        callback()
    })
    socket.on('location', (address, callback) => {
        io.emit('location-message', generateMessage(`https://www.google.com/maps?q=${address.lat},${address.long}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
        }
    })
})
server.listen(port, () => {
    console.log("Server is running on port: ", port);
})
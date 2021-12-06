const socket = io()
socket.on('message', (message) => {
    console.log(message);
})

const $messageForm = document.querySelector('#message-form')
const $messageInputForm = document.querySelector('#message-form')

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, () => {
        console.log('The message was delivered!');
    })
})

document.querySelector('#location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const address = { lat: position.coords.latitude, long: position.coords.longitude }
        socket.emit('location', address)
    })
})


const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')


const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: message.createdAt
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('location-message', (url) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        url
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, () => {
        console.log('The message was delivered!')
        $messageFormButton.removeAttribute('disabled', 'disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const address = { lat: position.coords.latitude, long: position.coords.longitude }
        socket.emit('location', address, () => {
            console.log("location shared!");
            $locationButton.removeAttribute('disabled', 'disabled')
        })
    })
})


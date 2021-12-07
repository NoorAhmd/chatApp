function generateMessage(text) {
    return {
        text,
        createdAt: new Date().getTime().toLocaleString()
    }
}

module.exports = {
    generateMessage
}


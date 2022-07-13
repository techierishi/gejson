const Toastify = require('toastify-js')

function getSettings() {
    const ghToken = localStorage.getItem("ghToken")
    const ghName = localStorage.getItem("ghName")
    const ghEmail = localStorage.getItem("ghEmail")
    const ghCommitMessage = localStorage.getItem("ghCommitMessage") || 'Commit from chrome extension!'
    const settings = { ghToken, ghName, ghEmail, ghCommitMessage }

    if (!(ghToken && ghName && ghEmail)) {
        Toastify({
            text: "Error: Please save settings...",
            duration: 3000,
            gravity: "bottom",
            position: "right"
        }).showToast();
    }

    return settings
}


export {
    getSettings
}
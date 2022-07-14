const Toastify = require('toastify-js')

function checkSettings(settings){
    return (settings?.ghToken && settings?.ghName && settings?.ghEmail)
}
function getSettings(domain) {
    const settings = JSON.parse(localStorage.getItem(domain))
    console.log('gjEdior:: getSettings', settings)
    if (!checkSettings(settings)) {
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
    checkSettings,
    getSettings
}
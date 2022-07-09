const leftEditor = document.getElementById('editor')
const rightViewer = document.getElementById('viewer')
const STORE_KEY = 'easy-json-editor'
const BASE_URL = 'https://api.github.com/repos'

let jsonViewer = null
let json = {}
let pathDetails = {}
let settings = {}

document.getElementById("saveSettings").addEventListener("click", saveSettings)
document.getElementById("saveJSON").addEventListener("click", saveJSON)


function saveSettings() {
    const ghTokenEl = document.getElementById("ghToken")
    const ghTokenVal = ghTokenEl.value
    localStorage.setItem("ghToken", ghTokenVal)

    const ghNameEl = document.getElementById("ghName")
    const ghNameVal = ghNameEl.value
    localStorage.setItem("ghName", ghNameVal)

    const ghEmailEl = document.getElementById("ghEmail")
    const ghEmailVal = ghEmailEl.value
    localStorage.setItem("ghEmail", ghEmailVal)

    const ghCommitMessageEl = document.getElementById("ghCommitMessage")
    const ghCommitMessageVal = ghCommitMessageEl.value
    localStorage.setItem("ghCommitMessage", ghCommitMessageVal)

    Toastify({
        text: "Settings Saved...",
        duration: 3000,
        gravity: "bottom",
        position: "right"
    }).showToast();

    setTimeout(()=>{
        window.location.reload();
    }, 1000);
    
}

function fillSettings() {
    const {ghToken, ghName, ghEmail, ghCommitMessage} = settings
    if (ghToken) {
        const ghTokenEl = document.getElementById("ghToken")
        ghTokenEl.value = ghToken
    }

    if (ghName) {
        const ghNameEl = document.getElementById("ghName")
        ghNameEl.value = ghName
    }

    if (ghEmail) {
        const ghEmailEl = document.getElementById("ghEmail")
        ghEmailEl.value = ghEmail
    }

    if (ghCommitMessage) {
        const ghCommitMessageEl = document.getElementById("ghCommitMessage")
        ghCommitMessageEl.value = ghCommitMessage
    }
}

async function saveJSON() {
    console.log("Saving JSON...")
    getSettings()

    Toastify({
        text: "Saving...",
        duration: 3000,
        gravity: "bottom",
        position: "right"
    }).showToast();

    const {ghToken, ghName, ghEmail, ghCommitMessage} = settings

    const jsonToSave = jsonViewer?.get()
    console.log('jsonToSave', jsonToSave)
    const b64Data = btoa(JSON.stringify(jsonToSave, null, 2))

    try {
        await fetch(`${BASE_URL}/${pathDetails.org}/${pathDetails.repo}/contents/${pathDetails.filePath}`, {
            body: `{ 
                "message": "${ghCommitMessage}", 
                "committer": { "name": "${ghName}", "email": "${ghEmail}" }, 
                "sha": "${pathDetails.sha}", 
                "content": "${b64Data}" }
            `,
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `token ${ghToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "PUT"
        });
    } catch (error) {
        Toastify({
            text: `Error: ${error.message} `,
            duration: 3000,
            gravity: "bottom",
            position: "right"
        }).showToast();
    }

    Toastify({
        text: "Saved...",
        duration: 3000,
        gravity: "bottom",
        position: "right"
    }).showToast();
}

function getSettings() {
    const ghToken = localStorage.getItem("ghToken")
    const ghName = localStorage.getItem("ghName")
    const ghEmail = localStorage.getItem("ghEmail")
    const ghCommitMessage = localStorage.getItem("ghCommitMessage")
    settings = { ghToken, ghName, ghEmail, ghCommitMessage }

    if (!ghToken) {
        Toastify({
            text: "Error: Please save settings...",
            duration: 3000,
            gravity: "bottom",
            position: "right"
        }).showToast();
    }

    return settings
}

async function loadEditor() {
    try {
        getSettings();
        fillSettings();

        let params = (new URL(document.location)).searchParams
        let rawUrl = params.get("rawUrl")
        let splitPath = rawUrl.split('/');
        const filePathArr = splitPath.slice(5, splitPath.length + 1)
        const filePath = filePathArr.join('/')
        pathDetails = {
            org: splitPath[1],
            repo: splitPath[2],
            filePath
        }
        const getFileRes = await fetch(`${BASE_URL}/${pathDetails.org}/${pathDetails.repo}/contents/${pathDetails.filePath}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `token ${settings?.ghToken}`
            }
        })
        const fileRes = await getFileRes.json()
        pathDetails.sha = fileRes.sha
        json = JSON.parse(atob(fileRes?.content))

    } catch (error) {
        json = {}
        Toastify({
            text: `Error: ${error.message} `,
            duration: 3000,
            gravity: "bottom",
            position: "right"
        }).showToast();
    }
    const viewerOptions = {
        mode: 'view',
    }
    const editorOptions = {
        mode: 'tree',
        modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
        onModeChange: function (newMode, oldMode) {
            console.log('Mode switched from', oldMode, 'to', newMode)
        },
        onChangeText: function (jsonString) {
            localStorage.setItem(STORE_KEY, jsonString)
            jsonViewer.updateText(jsonString)
        }
    }
    new JSONEditor(leftEditor, editorOptions, json)
    jsonViewer = new JSONEditor(rightViewer, viewerOptions, json)

    document.getElementById('editor-loader').remove()
}

document.addEventListener('DOMContentLoaded', loadEditor, false)

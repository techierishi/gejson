const leftEditor = document.getElementById('editor')
const rightViewer = document.getElementById('viewer')
const STORE_KEY = 'easy-json-editor'
const BASE_URL = {
    "github.com": 'https://api.github.com/repos',
    "github.ibm.com": 'https://github.ibm.com/api/v3/repos'
}

let jsonViewer = null
let json = {}
let pathDetails = {}
let settings = {}
let ghHost = 'github.com'
let rawPath = null

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

    setTimeout(() => {
        window.location.reload();
    }, 1000);

}

function fillSettings() {
    const { ghToken, ghName, ghEmail, ghCommitMessage } = settings
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
    console.log("ghJsonEditor: Saving JSON...")
    getSettings()

    Toastify({
        text: "Saving...",
        duration: 3000,
        gravity: "bottom",
        position: "right"
    }).showToast();

    const { ghToken, ghName, ghEmail, ghCommitMessage } = settings

    const jsonToSave = jsonViewer?.get()
    const b64Data = btoa(JSON.stringify(jsonToSave, null, 2))

    try {
        const apiUrl = `${BASE_URL[ghHost]}/${pathDetails.org}/${pathDetails.repo}/contents/${pathDetails.filePath}`;
        console.log('ghJsonEditor: saveJSON.apiUrl', apiUrl)
        await fetch(apiUrl, {
            body: `{ 
                "message": "${ghCommitMessage}", 
                "committer": { "name": "${ghName}", "email": "${ghEmail}" }, 
                "sha": "${pathDetails.sha}", 
                "branch": "${pathDetails.branch}",
                "content": "${b64Data}" 
            }`,
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
    const ghCommitMessage = localStorage.getItem("ghCommitMessage") || 'Commit from chrome extension!'
    settings = { ghToken, ghName, ghEmail, ghCommitMessage }

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

async function loadEditor() {
    let stringJson = null
    try {
        const apiUrl = `${BASE_URL[ghHost]}/${pathDetails.org}/${pathDetails.repo}/contents/${pathDetails.filePath}?ref=${pathDetails.branch}`
        console.log('ghJsonEditor: loadEditor.apiUrl', apiUrl)
        const getFileRes = await fetch(apiUrl, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `token ${settings?.ghToken}`
            }
        })
        const fileRes = await getFileRes.json()
        pathDetails.sha = fileRes.sha
        stringJson = atob(fileRes?.content)
        json = JSON.parse(stringJson)

    } catch (error) {
        try {
            stringJson = stringJson.replace(/(\r\n|\n|\r)/gm, "");
            stringJson = 
            json = stringJson
        } catch (_error) {
            json = {}
        }
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
        mode: 'code',
        modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
        onModeChange: function (newMode, oldMode) {
            console.log('ghJsonEditor: Mode switched from', oldMode, 'to', newMode)
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

function init() {
    getSettings();
    fillSettings();

    let params = (new URL(document.location)).searchParams
    rawPath = params.get("rawPath")
    ghHost = params.get("ghHost")

    console.log('ghJsonEditor: rawPath, ghHost', rawPath, ghHost)
    let splitPath = rawPath.split('/');
    const filePathArr = splitPath.slice(5, splitPath.length + 1)
    const filePath = filePathArr.join('/')
    pathDetails = {
        org: splitPath[1],
        repo: splitPath[2],
        branch: splitPath[4],
        filePath
    }

    loadEditor()
}

document.addEventListener('DOMContentLoaded', init, false)

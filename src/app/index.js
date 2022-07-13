
import { html } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks';
import { Modal } from './modal'
import { STORE_KEY, BASE_URL } from '../util/config'
import { getSettings } from '../util'
const Toastify = require('toastify-js')
const JSONEditor = require('jsoneditor')
const dJSON = require('dirty-json');
require('./loader')

const App = function (props) {
    let jsonViewer = null
    const { pathDetails } = props;
    const [settings, setSettings] = useState(null)
    const [json, setJson] = useState(null)
    const [loader, showLoader] = useState(false)

    const loadEditor = async () => {
        let stringJson = null
        try {
            showLoader(true)
            const apiUrl = `${BASE_URL[pathDetails.ghHost]}/${pathDetails.org}/${pathDetails.repo}/contents/${pathDetails.filePath}?ref=${pathDetails.branch}`
            console.log('ghJsonEditor: loadEditor.apiUrl', apiUrl)
            const getFileRes = await fetch(apiUrl, {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `token ${settings?.ghToken}`
                }
            })
            const fileRes = await getFileRes.json()
            showLoader(false)
            pathDetails.sha = fileRes.sha
            stringJson = atob(fileRes?.content)
            setJson(JSON.parse(stringJson))

        } catch (error) {
            showLoader(false)
            console.log('loadEditor.error', error);
            try {
                // Try fixing the JSON
                setJson(dJSON.parse(stringJson))
            } catch (_error) {
                setJson({})
            }
            Toastify({
                text: `Error: ${error.message} `,
                duration: 3000,
                gravity: "bottom",
                position: "right"
            }).showToast();
        }

        const leftEditor = document.getElementById('editor')
        const rightViewer = document.getElementById('viewer')

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


    const saveJSON = async () => {
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
            const apiUrl = `${BASE_URL[pathDetails.ghHost]}/${pathDetails.org}/${pathDetails.repo}/contents/${pathDetails.filePath}`;
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

            Toastify({
                text: "Saved...",
                duration: 3000,
                gravity: "bottom",
                position: "right"
            }).showToast();

        } catch (error) {
            Toastify({
                text: `Error: ${error.message} `,
                duration: 3000,
                gravity: "bottom",
                position: "right"
            }).showToast();
        }

    }

    useEffect(() => {
        const settings = getSettings();
        setSettings(settings);
        loadEditor()

    }, [])

    const showSettingsModal = () => {
        MicroModal.show('modal-settings');
    }
    const renderModal = () => {
        console.log('renderModal settings', settings);

        return settings && html`<${Modal} settings=${settings} />`
    }

    const renderLoader = () => {
        if (loader) {
            return html`<loader-component id="editor-loader"> </loader-component>`
        }
    }

    return html`
            <div class="header">
                <div class="action">
                    <label class="btn" onclick=${showSettingsModal}>Settings</label>
                    <label class="btn" onclick=${saveJSON}>Save</label>
                </div>
                <div class="modal">
                    ${renderModal()}
                </div>
            </div>
            ${renderLoader()}
            <div class="container">
                <div id="editor" style="width:50%"></div>
                <div id="viewer" style="width:50%"></div>
            </div>`
}

export { App }

import { html } from 'htm/preact'
import { useEffect, useState } from 'preact/hooks'
import { Modal } from './modal'
import { STORE_KEY, BASE_URL } from '../util/config'

import '../res/style.css'

const Toastify = require('toastify-js')
const JSONEditor = require('jsoneditor')
const dJSON = require('dirty-json')
require('./loader')

let jsonViewer = null
let json = null

const App = function (props) {


    const { pathDetails, settings } = props
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
            json = JSON.parse(stringJson)

        } catch (error) {
            showLoader(false)
            console.log('loadEditor.error', error)
            try {
                // Try fixing the JSON
                json = dJSON.parse(stringJson)
            } catch (_error) {
                json = {}
            }
            Toastify({
                text: `Error: ${error.message} `,
                duration: 3000,
                gravity: "bottom",
                position: "right"
            }).showToast()
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
                try {
                    localStorage.setItem(STORE_KEY, jsonString)
                    jsonViewer.updateText(jsonString)
                } catch (err) {
                    console.log('onChangeText.error', err)
                }

            }
        }
        new JSONEditor(leftEditor, editorOptions, json)
        jsonViewer = new JSONEditor(rightViewer, viewerOptions, json)
    }

    const saveJSON = async () => {
        console.log("ghJsonEditor: Saving JSON...")
        Toastify({
            text: "Saving...",
            duration: 3000,
            gravity: "bottom",
            position: "right"
        }).showToast()

        const { ghToken, ghName, ghEmail, ghCommitMessage } = settings

        const jsonToSave = jsonViewer?.get()
        const b64Data = btoa(JSON.stringify(jsonToSave, null, 2))

        try {
            const apiUrl = `${BASE_URL[pathDetails.ghHost]}/${pathDetails.org}/${pathDetails.repo}/contents/${pathDetails.filePath}`
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
            })

            Toastify({
                text: "Saved...",
                duration: 3000,
                gravity: "bottom",
                position: "right"
            }).showToast()

        } catch (error) {
            Toastify({
                text: `Error: ${error.message} `,
                duration: 3000,
                gravity: "bottom",
                position: "right"
            }).showToast()
        }

    }

    useEffect(() => {
        loadEditor()

    }, [])

    const showSettingsModal = () => {
        const $trigger = document.querySelector('.js-modal-trigger')
        const modal = $trigger.dataset.target
        const $target = document.getElementById(modal)
        $target.classList.add('is-active')
    }

    const renderModal = () => {
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
            
                    <label class="button is-primary js-modal-trigger" data-target="modal-settings" onclick=${showSettingsModal}>
                        Settings</label>
                    <label class="button is-primary ml-3" onclick=${saveJSON}>Save</label>
                </div>
            
            </div>
            ${renderLoader()}
            <div class="editor-container">
                <div id="editor" style="width:50%"></div>
                <div id="viewer" style="width:50%"></div>
            </div>
            
            <div class="popups">
                ${renderModal()}
            </div>`
}

export { App }
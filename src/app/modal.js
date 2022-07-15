
import { html } from 'htm/preact'
import { useEffect, useState } from 'preact/hooks'
const Toastify = require('toastify-js')
require('./eye-svg')

const COMMIT_MESSAGE = 'Commit from Github JSON editor!'

/* This code in transition phase from Vanilla JS to VDom */
const Modal = function (props) {

    const { pathDetails } = props

    const [tokenInputType, setTokenInputType] = useState("password")
    const [settings, setSettings] = useState({
        ghToken: props?.settings?.ghToken || '',
        ghName: props?.settings?.ghName || '',
        ghEmail: props?.settings?.ghEmail || '',
        ghCommitMessage: props?.settings?.ghCommitMessage || COMMIT_MESSAGE
    })

    const saveSettings = () => {
        const { ghHost } = pathDetails
        localStorage.setItem(ghHost, JSON.stringify(settings))

        Toastify({
            text: "Settings Saved...",
            duration: 3000,
            gravity: "bottom",
            position: "right"
        }).showToast()

        setTimeout(() => {
            window.location.reload()
        }, 1000)

    }

    const closeModal = () => {
        document.querySelector('.modal').classList.remove('is-active');
    }

    const eyeClick = () => {
        setTokenInputType((tokenInputType === "password" ? "text" : "password"))
    }
    return html`
    <div class="modal" id="modal-settings">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Settings</p>
                <button class="delete" aria-label="close" onclick=${closeModal}></button>
            </header>
            <section class="modal-card-body">
    
                <div class="field">
                    <label class="label">Token</label>
    
                    <div class="control has-icons-right">
                        <div class="token-wrapper">
                            <input class="input eye-input" id="ghToken" type=${tokenInputType} placeholder="Gihub Token"
                                value=${settings.ghToken} onchange=${(e) => {
                                setSettings({ ...settings, ghToken: e.target.value })
                                }} />

                            <button class="button eye-btn" onclick=${eyeClick}>
                                <span class="icon is-small">
                                <eye-svg ></eye-svg>
                                </span>
                            </button>
                            
                        </div>
                    </div>
    
                    <a href="https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                        target="_blank" rel="noopener noreferrer">How to create token?</a>
                </div>
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input class="input" id="ghName" type="text" placeholder="Name" value=${settings.ghName}
                            onchange=${(e) => {
                            setSettings({ ...settings, ghName: e.target.value })
                        }} />
                    </div>
                </div>
    
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" id="ghEmail" type="text" placeholder="Email" value=${settings.ghEmail}
                            onchange=${(e) => {
                            setSettings({ ...settings, ghEmail: e.target.value })
                        }}
                        />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Commit Message</label>
                    <div class="control">
                        <input class="input" id="ghCommitMessage" type="text" placeholder="Commit Message"
                            value=${settings.ghCommitMessage} onchange=${(e) => {
                            setSettings({ ...settings, ghCommitMessage: e.target.value || COMMIT_MESSAGE })
                        }}
                        />
                    </div>
                </div>
    
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" onclick=${saveSettings}>Save changes</button>
            </footer>
        </div>
    </div>
`

}

export { Modal }

import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks'
const Toastify = require('toastify-js')

/* This code in transition phase from Vanilla JS to VDom */
const Modal = function (props) {

    const { settings, pathDetails } = props

    const fillSettings = (settings) => {
        const { ghToken, ghName, ghEmail, ghCommitMessage } = settings || {}
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
            ghCommitMessageEl.value = ghCommitMessage || 'Commit from Github JSON editor!'
        }
    }

    const saveSettings = () => {
        const { ghHost } = pathDetails
        const ghTokenEl = document.getElementById("ghToken")
        const ghToken = ghTokenEl.value

        const ghNameEl = document.getElementById("ghName")
        const ghName = ghNameEl.value

        const ghEmailEl = document.getElementById("ghEmail")
        const ghEmail = ghEmailEl.value

        const ghCommitMessageEl = document.getElementById("ghCommitMessage")
        const ghCommitMessage = ghCommitMessageEl.value

        const settings = { ghToken, ghName, ghEmail, ghCommitMessage }

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

    useEffect(() => {
        fillSettings(settings)
    })

    return html`
    <div class="modal" id="modal-settings">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Modal title</p>
                <button class="delete" aria-label="close" onclick=${closeModal}></button>
            </header>
            <section class="modal-card-body">
    
                <div class="field">
                    <label class="label">Token</label>
                    <div class="control has-icons-right">
                        <input class="input" id="ghToken" type="password" placeholder="Gihub Token" />
    
                        <span class="icon is-right">
                            <i class="fas fa-check"></i>
                        </span>
                    </div>
                    <a href="https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                        target="_blank" rel="noopener noreferrer">How to create token?</a>
                </div>
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input class="input" id="ghName" type="text" placeholder="Name" />
                    </div>
                </div>
    
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" id="ghEmail" type="text" placeholder="Email" />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Commit Message</label>
                    <div class="control">
                        <input class="input" id="ghCommitMessage" type="text" placeholder="Commit Message" />
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
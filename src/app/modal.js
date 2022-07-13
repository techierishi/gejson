
import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks'
const Toastify = require('toastify-js')

const Modal = function (props) {

    const { settings } = props

    const fillSettings = (settings) => {
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

    const saveSettings = () => {
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
                    <div class="control">
                        <input class="input" id="ghToken" type="password" placeholder="Gihub Token" />
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
                <button class="button">Cancel</button>
            </footer>
        </div>
    </div>
`

}

export { Modal }
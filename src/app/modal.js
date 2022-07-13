
import { html } from 'htm/preact';
import { useEffect } from 'preact/hooks';
const Toastify = require('toastify-js')

const Modal = function (props) {

    const { settings } = props

    console.log('Modal settings', settings);

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
        }).showToast();

        setTimeout(() => {
            window.location.reload();
        }, 1000);

    }

    useEffect(() => {
        fillSettings(settings)
    });

    return html` 
    <div class="micromodal-slide modal" id="modal-settings" aria-hidden="false">
    <div class="modal__overlay" tabindex="-1" data-custom-close="">
        <div class="modal__container w-40-ns w-90" role="dialog" aria-modal="true" aria-labelledby="modal-2-title">
            <header class="modal__header">
                <h3 class="modal__title" id="modal-2-title"> 🔒 Login </h3> <button class="modal__close"
                    aria-label="Close modal" data-custom-close=""></button>
            </header>
            <p>
                <input type="text" id="ghToken" name="ghToken" placeholder="Github Token" required="" />
                <a href="https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                    target="_blank" rel="noopener noreferrer">How to create token?</a>
            </p>
            <p>
                <input type="text" id="ghName" name="ghName" placeholder="User name" required="" />
            </p>
            <p>
                <input type="text" id="ghEmail" name="ghEmail" placeholder="User email" required="" />
            </p>
            <p>
                <input type="text" id="ghCommitMessage" name="ghCommitMessage" placeholder="Commit message"
                    required="" />
            </p>
            <p>
                <button class="btn" onclick=${saveSettings}> Save </button>
            </p>
        </div>
    </div>
</div>`

}

export { Modal }
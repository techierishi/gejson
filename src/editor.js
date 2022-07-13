import { html, render } from 'htm/preact';
const { App } = require('./app')
import MicroModal from 'micromodal';


function init() {
    let params = (new URL(document.location)).searchParams
    const rawPath = params.get("rawPath")
    const ghHost = params.get("ghHost")

    console.log('ghJsonEditor: rawPath, ghHost', rawPath, ghHost)
    let splitPath = rawPath.split('/');
    const filePathArr = splitPath.slice(5, splitPath.length + 1)
    const filePath = filePathArr.join('/')
    const pathDetails = {
        org: splitPath[1],
        repo: splitPath[2],
        branch: splitPath[4],
        filePath,
        rawPath,
        ghHost
    }

    render(html`<${App} pathDetails=${pathDetails} />`, document.querySelector('.app'));

    MicroModal.init();

}

document.addEventListener('DOMContentLoaded', () => {
    init()
}, false)

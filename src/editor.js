import { html, render } from 'htm/preact';
import { getSettings } from './util';
const { App } = require('./app')

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
    const settings = getSettings()

    render(html`<${App} pathDetails=${pathDetails} settings=${settings} />`, document.querySelector('.app'));
}

document.addEventListener('DOMContentLoaded', () => {
    init()
}, false)

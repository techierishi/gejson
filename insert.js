

(function () {

    function createGeJsonButton() {
        const button = document.createElement("button")

        button.innerText = "Edit JSON"
        button['id'] = 'gejson-button'
        button['data-name'] = 'gejson-button'
        button.classList.add("btn")
        button.classList.add("d-none")
        button.classList.add("d-md-inline-block")
        button.classList.add("ml-2")
        button.onclick = function () {

            const rawPath = document
                ?.getElementById('raw-url')
                ?.getAttribute('href')
            const ghHost = location.host;
            console.log('ghJsonEditor: rawPath, ghHost', rawPath, ghHost)

            if (rawPath) {
                chrome.runtime.sendMessage({
                    message: 'ediJSONClicked', data: {
                        ghHost,
                        rawPath
                    }
                }, () => { })
            }
        }

        const boxHeader = document.body.querySelector('.breadcrumb')
        boxHeader?.appendChild(button)
    }


    const geJsonButton = document.getElementById('gejson-button')
    if (geJsonButton) {
        return false
    }
    createGeJsonButton()

})()



(function () {

    function createGeJsonButton() {
        const button = document.createElement("button")

        button.innerText = "Edit JSON"
        button['id'] = 'gejson-button'
        button['data-name'] = 'gejson-button'
        button.classList.add("btn");
        button.classList.add("d-none");
        button.classList.add("d-md-inline-block");
        button.classList.add("ml-2");
        button.onclick = function () {
            console.log('clicked!')

            const rawUrl = document
                ?.getElementById('raw-url')
                ?.getAttribute('data-permalink-href');
            if (rawUrl) {
                chrome.runtime.sendMessage({ message: 'ediJSONClicked', data: { rawUrl } }, () => { });
            }
        }

        const boxHeader = document.body.querySelector('.breadcrumb');
        console.log('boxHeader', boxHeader)
        boxHeader?.appendChild(button)
    }

    setInterval(()=>{
        const geJsonButton = document.getElementById('gejson-button');
        if(geJsonButton){
            return false
        }
        createGeJsonButton();
    }, 2000)
    
    

})()

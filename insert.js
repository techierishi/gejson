

(function () {
    var button = document.createElement("button")

    button.innerText = "Edit JSON"
    button['id'] = 'inserted'
    button['data-name'] = 'name1'
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
})()

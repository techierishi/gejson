chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: 'thanks.html'
        });
    }
});


chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        url: 'editor.html'
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'ediJSONClicked') {
        chrome.tabs.create({
            active: true,
            url: `editor.html?ghHost=${request.data.ghHost}&&rawPath=${request.data.rawPath}`
        }, null);
    }
});
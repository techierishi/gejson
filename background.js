chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: 'thanks.html'
        });
    }
});


chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        url: 'main.html'
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'ediJSONClicked') {
        chrome.tabs.create({
            active: true,
            url: `main.html?rawUrl=${request.data.rawUrl}`
        }, null);
    }
});
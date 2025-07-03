chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "elementSelected") {
        const scrapedData = request.data;
        console.log("Scraped data received in background:", scrapedData);

        chrome.storage.local.set({ lastScrapedContent: scrapedData }, function() {
            console.log('Data saved to storage');
        });

        chrome.runtime.sendMessage({ action: "displayScrapedContent", data: scrapedData });
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (info.status === 'complete' && tab.active) {
        // TODO: add some logic here if needed
    }
});

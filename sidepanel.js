document.getElementById('activateScraper').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
        chrome.tabs.sendMessage(tab.id, { action: "startSelection" });
        console.log("Message 'startSelection' sent to content script.");
    } catch (e) {
        console.error("Failed to inject content script or send message:", e);
    }
});

document.getElementById('clearContent').addEventListener('click', () => {
    const scrapedContentDiv = document.getElementById('scrapedContent');
    if (scrapedContentDiv) {
        scrapedContentDiv.innerHTML = '<p>Selected content will appear here.</p>';
        chrome.storage.local.remove('lastScrapedContent'); // Очищаємо і з сховища
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayScrapedContent") {
        console.log("Received scraped content:", request.data);
        const scrapedContentDiv = document.getElementById('scrapedContent');
        if (scrapedContentDiv) {
            scrapedContentDiv.innerHTML = request.data;
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['lastScrapedContent'], function(result) {
        const scrapedContentDiv = document.getElementById('scrapedContent');
        if (scrapedContentDiv && result.lastScrapedContent) {
            scrapedContentDiv.textContent = result.lastScrapedContent;
        }
    });
});

let isSelectionMode = false;
let selectedElementData = null;

function highlightElement(event) {
    if (isSelectionMode) {
        const currentHighlighted = document.querySelector('.scraper-highlight');
        if (currentHighlighted) {
            currentHighlighted.classList.remove('scraper-highlight');
        }
        event.target.classList.add('scraper-highlight');
    }
}

function handleElementClick(event) {
    if (isSelectionMode) {
        event.preventDefault();
        event.stopPropagation();

        const currentHighlighted = document.querySelector('.scraper-highlight');
        if (currentHighlighted) {
            currentHighlighted.classList.remove('scraper-highlight');
        }

        const clickedElement = event.target;
        selectedElementData = clickedElement.innerHTML;

        console.log("Selected element data:", selectedElementData);

        chrome.runtime.sendMessage({
            action: "elementSelected",
            data: selectedElementData
        });

        disableSelectionMode();
    }
}

function enableSelectionMode() {
    if (!isSelectionMode) {
        isSelectionMode = true;
        document.body.style.cursor = 'crosshair';
        document.addEventListener('mouseover', highlightElement);
        document.addEventListener('click', handleElementClick, true);
        console.log("Scraper selection mode activated.");

        const style = document.createElement('style');
        style.id = 'scraper-highlight-style';
        style.textContent = `
            .scraper-highlight {
                outline: 2px solid #007bff !important;
                background-color: rgba(0, 123, 255, 0.2) !important;
                cursor: crosshair !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function disableSelectionMode() {
    if (isSelectionMode) {
        isSelectionMode = false;
        document.body.style.cursor = 'default';
        document.removeEventListener('mouseover', highlightElement);
        document.removeEventListener('click', handleElementClick, true);

        const style = document.getElementById('scraper-highlight-style');
        if (style) {
            style.remove();
        }
        console.log("Scraper selection mode deactivated.");
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startSelection") {
        enableSelectionMode();
    }
    if (request.action === "stopSelection") {
        disableSelectionMode();
    }
});


if (typeof chrome !== 'undefined' && chrome.runtime) {
}
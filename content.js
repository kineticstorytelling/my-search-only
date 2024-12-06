// Function to check if we're on homepage
function isHomePage() {
    return window.location.pathname === '/' || window.location.pathname === '/index';
}

// Function to create overlay
function createOverlay() {
    const overlayHTML = `
        <div class="search-container">
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap" rel="stylesheet">
            <img src="${chrome.runtime.getURL('my-search-only.png')}" alt="My Search Only" class="logo">
            <p class="tagline">Find the content you need without the distractions</p>
            <input type="text" class="search-box" id="searchInput" placeholder="Search YouTube...">
            <br>
            <button class="search-button" id="searchButton">Search</button>
        </div>
    `;

    const overlayDiv = document.createElement('div');
    overlayDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .search-container {
            width: 80%;
            max-width: 800px;
            text-align: center;
        }
        .logo {
            width: 200px;
            margin-bottom: 20px;
            border-radius: 15px;
        }
        .tagline {
            color: #ffffff;
            font-size: 24px;
            margin-bottom: 30px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
        }
        .search-box {
            width: 100%;
            height: 60px;
            font-size: 24px;
            padding: 10px 20px;
            border: none;
            border-radius: 30px;
            outline: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        .search-box:focus {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .search-button {
            margin-top: 20px;
            padding: 12px 40px;
            font-size: 18px;
            background-color: #ff0000;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .search-button:hover {
            background-color: #cc0000;
            transform: translateY(-2px);
        }
    `;

    overlayDiv.innerHTML = overlayHTML;
    document.head.appendChild(styleElement);
    document.body.appendChild(overlayDiv);

    // Add event listeners
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function performSearch() {
        const query = encodeURIComponent(searchInput.value.trim());
        if (query) {
            window.location.href = `https://www.youtube.com/results?search_query=${query}`;
        }
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Focus on search input
    searchInput.focus();
}

// Function to inject overlay
function injectOverlay() {
    if (isHomePage()) {
        // Remove existing overlay if any
        const existingOverlay = document.querySelector('.search-container')?.parentElement;
        if (existingOverlay) {
            existingOverlay.remove();
        }
        createOverlay();
    }
}

// Function to hide non-search content
function hideNonSearchContent() {
    if (window.location.pathname === '/results') {
        // Hide non-search content on search results page
        const related = document.querySelector('#related');
        const secondary = document.querySelector('#secondary');
        if (related) related.style.display = 'none';
        if (secondary) secondary.style.display = 'none';
    }
}

// Watch for URL changes
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        setTimeout(() => {
            injectOverlay();
            hideNonSearchContent();
        }, 500);
    }
});

// Start observing
observer.observe(document, { subtree: true, childList: true });

// Initial run
setTimeout(() => {
    injectOverlay();
    hideNonSearchContent();
}, 1000);

// Handle dynamic content loading
document.addEventListener('yt-navigate-finish', hideNonSearchContent);

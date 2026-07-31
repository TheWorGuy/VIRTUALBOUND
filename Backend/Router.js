// Constants
const MAX_INDEX = 224; // 0–224 allowed in normal flow
// const SECRET_INDICES = [225, 226, 227, 228, 229, 230, 231, 232]; // secret pages
const CHAT_INDICES = [85, 91, 94, 95, 96, 97, 99];
const INTERACT_INDICES = [5, 16, 30, 40, 49, 64, 106, 111, 151]; 
const IMAGE_TYPES = ["png", "jpg", "jpeg", "gif"];
const VIDEO_TYPES = ["mp4", "webm", "mov"];
const STYLE_SPLIT = 25; // index at which style changes from VR to web
const DEBUG_MODE = true;
const DEFAULT_DELAY = 50; // default delay for text animation
const STILL_START = 195;
const STILL_END = 198;

// Globals
let currPage = 0; // current page 
let pagesData = [];
let initialized = false;
let secret = false;
let keyboardInitialized = false;

// get the json!!!
async function initRouter() {
    if (initialized) return;

    const res = await fetch("./Backend/Pages.json");
    pagesData = await res.json();

    const saved = localStorage.getItem("currPage");
    currPage = saved ? parseInt(saved) : 0;

    initialized = true;

    initKeyboardNavigation();
}

// getters
function getCurrentPage() {
    return currPage;
}

function getPageData(index = currPage) {
    return pagesData[index];
}

function getPageType(index) {
    if (INTERACT_INDICES.includes(index)) return "interactable";
    if (index === 77) return "fly";
    return "comic";
}

function getCurrentPageType() {
    const path = window.location.pathname;

    if (path.includes("Interactable")) return "interactable";
    if (path.includes("FlyMinigame")) return "fly";

    if (path.includes("VRShipPages")) return "vrship";
    if (path.includes("VRBeachPages")) return "vrbeach";
    if (path.includes("WebPages")) return "web";

    return "comic";
}

// setters
function setCurrPage(thePage) {
    currPage = thePage;
}

function goToPage(index) {
    if (index < 0 || index >= pagesData.length) return;

    const newType = getPageType(index);
    const currentType = getCurrentPageType();

    let newRenderType = newType;
    if (newType === "comic") {
        if (index < STYLE_SPLIT) {
            newRenderType = "vrship";
        } else if (index >= 213 && index <= 219) {
            newRenderType = "vrbeach";
        } else {
            newRenderType = "web";
        }
    } 

    currPage = index;
    localStorage.setItem("currPage", index);

    unlockPage(index);

    // SAME PAGE TYPE, no reload
    if (newRenderType === currentType) {
        if (newType === "comic" && typeof showPage === "function") {
            showPage(index);
        } else if (newType === "interactable") {
            if (typeof loadPage === "function") {
                currInteract = index;
                currPage = index;
                localStorage.setItem("currPage", index);
                loadPage();
            } else {
                // defer until interactable is initialized
                window.addEventListener("DOMContentLoaded", () => {
                    currInteract = index;
                    currPage = index;
                    localStorage.setItem("currPage", index);
                    loadPage();
                });
            }
        }
        return;
    }

    // DIFFERENT PAGE TYPE, navigate
    switch (newRenderType) { 
        case "interactable":
            window.location.replace("Interactable.html");
            break;
        case "fly":
            window.location.replace("FlyMinigame.html");
            break;
        case "vrship":
            window.location.replace("VRShipPages.html");
            break;
        case "vrbeach":
            window.location.replace("VRBeachPages.html");
            break;
        case "web":
            window.location.replace("WebPages.html");
            break;
    }
} 

function unlockPage(index) {
    let unlocked = JSON.parse(localStorage.getItem("unlockedPages")) || [0];

    if (!unlocked.includes(index)) {
        unlocked.push(index);
        localStorage.setItem("unlockedPages", JSON.stringify(unlocked));
    }
}

// used in interactable pages to build hitboxes over media 
function buildHitbox({ top, left, width, height, onEnter, onLeave, onClick, mediaContainer }) {
    const hitbox = document.createElement("div");
    hitbox.classList.add("hitbox");
    hitbox.style.position = "absolute";
    hitbox.style.top = top;
    hitbox.style.left = left;
    hitbox.style.width = width;
    hitbox.style.height = height;
    hitbox.style.zIndex = "20";
    hitbox.style.cursor = "pointer";
    if (DEBUG_MODE) {
        hitbox.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
    }
    hitbox.addEventListener("mouseenter", () => {
        isHovering = true;
        onEnter();
    });
    hitbox.addEventListener("mouseleave", () => {
        isHovering = false;
        onLeave();
    });
    if (onClick) {
        hitbox.addEventListener("mousedown", onClick);
    }
    mediaContainer.appendChild(hitbox);
    return hitbox;
}

// used in ace attorney pages to build hitboxes over media in replacement of putting text in comic text box
function buildTextBox({ top = "65%", left = "6%", width = "90%", height = "30%", mediaContainer }) {
    const textbox = document.createElement("div");
    textbox.classList.add("textbox");
    textbox.style.top = top;
    textbox.style.left = left;
    textbox.style.width = width;
    textbox.style.height = height;
    if (DEBUG_MODE) textbox.style.cursor = "pointer";
    
    const textElement = document.createElement("p");
    textElement.classList.add("text-attorney"); // change this style to match the regular comic text style
    textElement.classList.add("ye");

    textbox.appendChild(textElement);

    mediaContainer.appendChild(textbox);

    return textbox;
}

let typingInterval = null;
let isTyping = false;
let currentSpans = [];

function animateText(mediaContainer, textbox, textElement, text, speed = DEFAULT_DELAY) {

    let currPage = getCurrentPage()
    if (currPage >= STILL_START && currPage <= STILL_END) {
        stopMediaAnimation(mediaContainer);
    }

    if (typingInterval) {
        clearInterval(typingInterval);
    }

    textElement.innerHTML = ""; // Clear existing text

    const spans = [];

    for (const char of text) {

        const span = document.createElement("span");

        span.textContent = char;

        span.style.visibility = "hidden"; // Hide the character initially

        textElement.appendChild(span);

        spans.push(span);

    }

    let index = 0;
    isTyping = true;

    typingInterval = setInterval(() => {

        if (index >= spans.length) {
            clearInterval(typingInterval);

            isTyping = false;

            textbox.style.cursor = "default";
            mediaContainer.style.cursor = "default";

            stopMediaAnimation(mediaContainer);

            return;
        }

        spans[index].style.visibility = "visible"; // Show the character

        index++;

    }, speed);

    currentSpans = spans; // Store the spans for potential further manipulation
    return spans;
}

function finishAttorneyText(mediaContainer) {

    if (!isTyping) return;

    clearInterval(typingInterval);

    currentSpans.forEach(span => {
        span.style.visibility = "visible";
    });

    isTyping = false;

    stopMediaAnimation(mediaContainer);
    
}

function stopMediaAnimation(mediaContainer) {
    const video = mediaContainer.querySelector("video");

    if (!video) return;

    // Don't pause defendant_1.MOV
    if (video.currentSrc.toLowerCase().includes("defendant_1.mov")) {
        return;
    }

    video.loop = false;

    video.pause();

    video.currentTime = 0;

    video.addEventListener(
        "seeked",
        () => video.pause(),
        { once : true }
    );
}

function initKeyboardNavigation() {

    if (keyboardInitialized) return;
    keyboardInitialized = true;

    document.addEventListener("keydown", (e) => {

        // don't interfere with typing into inputs later
        if (
            e.target.tagName === "INPUT" ||
            e.target.tagName === "TEXTAREA" ||
            e.target.isContentEditable
        ) return;
        
        switch (e.key) {
            case "ArrowLeft":
                const prev = document.getElementById("previous");

                if (prev && prev.offsetParent !== null) {
                    prev.click();
                }

                break;

            case "ArrowRight":
                const next = document.getElementById("next");

                if (next && next.offsetParent !== null) {
                    next.click();
                }

                break;
        }

    });

}

function displayPageNumber(textContainer) {
    let pageNum = getCurrentPage();
    let pageType = getCurrentPageType();

    // insert the page number in the div with the text class, aka textContainer in PageHandler.js
    // the page number should appear in the bottom right corner
    // make it scalable like how the textbox text was done in the ace attorney thing
    // colors change based on page type
}
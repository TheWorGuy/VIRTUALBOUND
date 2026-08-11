// PageHandler.js

// declare all media types that can be displayed
const FIRST_PAGE = 0;
const SPECIAL_TEXT = {
    "John the Banana": 226,
    "Rose the Grape": 226,
    "onyx": 227,
    "You know what that means": 225,
    "oil": 229,
    "DAMNIT": 230,
};
const SPEAKERS = {
    "Captain Kracker :": "or",
    "Captain Pavo :": "pavo-pu",
    "??? :": "gray-ye",
    "KimiwimiUwU :": "ye",
    "Token :": "ka",
    "Matsune Hiku? :": "aq",
};
const PROFILES = {
    "KimiwimiUwU": {
        img: "./Images/kimiko_pfp.PNG",
        class: "ye"
    },
    "xXDyedFeatherXx": {
        img: "./Images/nyle_pfp.PNG",
        class: "pu"
    },
    "Token": {
        img: "./Images/karmine_pfp.PNG",
        class: "ka"
    }
};
const ATTORNEY_START = 174;
const ATTORNEY_END = 198;
const ATTORNEY_EXCEPTION = 181;

// gather elements
const textContainer = document.querySelector(".text");
const prev = document.getElementById("previous");
const next = document.getElementById("next");

// gather elements for ChitChatTime
const img = document.querySelector(".img");
const containerParent = document.querySelector(".container");
const mediaCCT = document.querySelector(".media-container");

// Globals
let textParagraph = document.getElementById("comic-text");
let mediaContainer;
let mediaParent;

document.addEventListener("DOMContentLoaded", init); // wait for router...

async function init() {
    await initRouter();

    const currPage = getCurrentPage();

    // GUARD 
    const expectedType = getPageType(currPage);
    const currentType = getCurrentPageType?.(); // safe call

    let expectedRenderType = expectedType;
    if (expectedType === "comic") {
        if (currPage < STYLE_SPLIT) {
            expectedRenderType = "vrship";
        } else if (currPage >= 213 && currPage <= 219) {
            expectedRenderType = "vrbeach";
        } else {
            expectedRenderType = "web";
        }
    }

    if (expectedRenderType !== currentType) {
        goToPage(currPage);
        return;
    }

    // normal setup
    mediaContainer = document.getElementById("comic-media");
    mediaParent = mediaContainer?.parentElement;

    showPage(currPage);
    displayPageNumber();
}

function showPage(pageNum) {
    const page = getPageData(pageNum);
    if (!page) return;

    const file = page.media;
    
    removeHitboxes(); // remove any existing hitboxes
    resetTextContainer(); 
    textContainer.classList.remove("text-biscord");

    // get da div
    mediaParent = mediaContainer?.parentElement;
    
    const mediaElement = renderMedia(file);

    // render text area
    if (isChitChatTimePage(pageNum)) {
        
        textContainer.classList.add("text-biscord");
        renderBiscord(mediaElement, page);
        mediaContainer.style.cursor = "default"; // reset cursor for biscord pages

    } else if (isAttorneyPage(pageNum)) {
        renderAttorney(pageNum);
        if (DEBUG_MODE) mediaContainer.style.cursor = "pointer"; // set cursor for attorney pages
    } else {
        renderDialogueText(page.text, pageNum);
        mediaContainer.style.cursor = "default"; // reset cursor for normal pages
    }

    console.log("Index " + pageNum + " loaded.");

    updateNavigation(); 

    preloadNextPage();
}

function renderMedia(theFile) {
    const ext = theFile.split(".").pop().toLowerCase();
    let element;

    if (mediaContainer) { // clear media first
        mediaContainer.innerHTML = "";
    }

    // is it an image or a video? :3c hmmm
    if (IMAGE_TYPES.includes(ext)) {
        element = document.createElement("img");
        element.src = theFile;
    } else if (VIDEO_TYPES.includes(ext)) {
        element = document.createElement("video");
        element.src = theFile;
        element.autoplay = true;
        element.loop = true;
        element.muted = false;
        element.playsInline = true;
        element.preload = "auto";
    } else { // if neither... GET OUT
        console.warn("Unsupported media type:", ext);
        return;
    }

    // set them attributessss
    element.id = "comic-media";
    element.classList.add("img");

    mediaContainer.innerHTML = "";
    mediaContainer.appendChild(element);

    return element;
}


function renderDialogueText(theText, pageNum) {
    textParagraph.innerHTML = "";
    if (!theText) return;

    const lines = theText.split("\n");

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let matchedClass = null;

        // detect speaker
        for (const speaker in SPEAKERS) {
            if (trimmed.startsWith(speaker)) {
                matchedClass = SPEAKERS[speaker];
                break;
            }
        }

        const p = document.createElement("p");

        if (matchedClass) p.classList.add(matchedClass);
        
        appendSpecialText(p, trimmed, pageNum);

        textParagraph.appendChild(p);
    });
}

function appendSpecialText(container, theText, pageNum) {
    if (!theText) return;

    const regex = new RegExp(`(${Object.keys(SPECIAL_TEXT).join("|")})`);
    const parts = theText.split(regex);

    parts.forEach(part => {
        if (SPECIAL_TEXT[part] !== undefined) {
            const el = document.createElement("a");
            el.className = "special";

            if (pageNum < STYLE_SPLIT) el.classList.add("vr-special");
        
            el.textContent = part;

            el.addEventListener("click", () => {
                goToPage(SPECIAL_TEXT[part]);
            });

            container.appendChild(el);
        } else if (part) {
            container.appendChild(document.createTextNode(part));
        }
    });
}

function isSpecialText(theText) {
    if (!theText) return false;
    return SPECIAL_TEXT.some(special => theText.includes(special));
}

function pantherJumpscare() {
    console.log("Panther jumpscare triggered!");

    // create overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "9999"; 
    overlay.style.margin = "0";
    overlay.style.padding = "0";
    overlay.style.overflow = "hidden";

    // create image
    const img = document.createElement("img");
    img.src = "./Images/panther.png";

    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.width = "100vw";
    img.style.height = "100vh";
    img.style.objectFit = "cover";
    img.style.zIndex = "21";

    overlay.appendChild(img);

    // create audio
    const audio = new Audio("./SoundEffects/panther.mp3");
    audio.play();  

    // add overlay to body
    document.body.appendChild(overlay);

    // when audio is done, remove overlay and go to next page
    audio.addEventListener("ended", () => {
        document.body.removeChild(overlay);
        goToPage(74);
    });
}

function nextPage() {
    const curr = getCurrentPage();
    const nav = INTERACTABLE_NAV[curr];

    if (curr === 73) {
        pantherJumpscare();
        return;
    }

    if (nav) {
        if (nav.next === null) {
            // next button disabled, do nothing
            console.log("Next button disabled at index", curr);
            return;
        }
        goToPage(nav.next);
    } else {
        // fallback for normal sequential pages
        goToPage(curr + 1);
    }
}

function prevPage() {
    const curr = getCurrentPage();
    const nav = INTERACTABLE_NAV[curr];

    if (nav) {
        if (nav.prev === null) {
            // prev button disabled, do nothing
            console.log("Previous button disabled at index", curr);
            return;
        }
        goToPage(nav.prev);
    } else {
        // fallback for normal sequential pages
        goToPage(curr - 1);
    }
}

function preloadNextPage() {
    const curr = getCurrentPage();
    const nextPageData = getPageData(curr + 1);
    if (!nextPageData) return;

    const nextMedia = nextPageData.media;
    const ext = nextMedia.split(".").pop().toLowerCase();

    if (IMAGE_TYPES.includes(ext)) {
        const img = new Image();
        img.src = nextMedia;
    }

    if (VIDEO_TYPES.includes(ext)) {
        const video = document.createElement("video");
        video.src = nextMedia;
    }
}

function updateNavigation() {
    const curr = getCurrentPage();

    if (curr === FIRST_PAGE) {
        prev.style.display = "none";
    } else {
        prev.style.display = "inline"
    }

    if (curr === MAX_INDEX) {
        next.style.display = "none";
    } else {
        next.style.display = "inline";
    }

}

function resetTextContainer() {
    textContainer.innerHTML = `
        <p id="comic-text"></p>
    `;

    // Update the global reference
    textParagraph = document.getElementById("comic-text");
}

function removeHitboxes() {
    document.querySelectorAll(".hitbox").forEach(hitbox => hitbox.remove());
}

// Additional Page Type Functions
function isChitChatTimePage(pageNum) { // returns true or false if the page is a ChitChatTime page
    return CHAT_INDICES.includes(pageNum);
}

function isAttorneyPage(pageNum) {
    return (pageNum >= ATTORNEY_START && pageNum <= ATTORNEY_END && pageNum !== ATTORNEY_EXCEPTION);
}

function renderBiscord(element, page = getPageData()) {
    // clear chat
    textContainer.innerHTML = "";

    // get chat
    const lines = (page.text || "")
        .split("\n")
        .filter(line => line.trim() !== "");

    // group consecutive messages by same speaker
    const grouped = [];

    lines.forEach(line => {
        const [name, ...rest] = line.split(" : ");
        const message = rest.join(" : ").trim();

        if (!PROFILES[name]) return;

        const lastGroup = grouped[grouped.length - 1];

        if (lastGroup && lastGroup.name === name) {
            // same speaker, append message
            lastGroup.messages.push(message);
        } else {
            // new speaker, create new group
            grouped.push({
                name: name,
                messages: [message]
            });
        }
    });

    // render grouped messages
    grouped.forEach(group => {
        const profile = PROFILES[group.name];

        const combinedMessage = group.messages
            .map(msg => msg.replace(/\n/g, "<br>"))
            .join("<br>");

        const chatHTML = `
            <div class="biscord-body">
                <img src="${profile.img}" class="pfp">
                <p class="top ${profile.class}">${group.name}</p>
                <p class="bot">${combinedMessage}</p>
            </div>
        `;
        textContainer.insertAdjacentHTML("beforeend", chatHTML);
    });
    loadIndex94Hitbox() // check if we need to load the index 94 hitbox for easter egg
}

function loadIndex94Hitbox() {
    if (getCurrentPage() !== 94) return;

    const video = mediaContainer.querySelector("video");

    if (!video) return;

    let shouldReverse = false;
    let isReversed = false;

    // disable native looping to control loop boundary
    video.loop = false;

    // handle manual looping + optional swap
    video.addEventListener("ended", () => {
        if (shouldReverse) {
            isReversed = !isReversed;
            shouldReverse = false;

            const newSrc = isReversed
                ? "./Images/95b.mov" // reversed version
                : getPageData().media; // original

            video.src = newSrc;

            // ensure seamless playback
            video.currentTime = 0;
            video.play();
        } else {
            // normal loop
            video.currentTime = 0;
            video.play();
        }
    });

    buildHitbox({
        top: "68%",
        left: "5%",
        width: "17%",
        height: "25%",
        onEnter: () => {},
        onLeave: () => {},
        onClick: () => {
            // queue reversal for next loop boundary
            shouldReverse = true;
        }, 
        mediaContainer: mediaContainer
    });
}

function renderAttorney(pageNum = getCurrentPage()) {
    
    const page = getPageData(pageNum);

    buildTextBox({
        mediaContainer: mediaContainer,
    });

    const textbox = document.querySelector(".textbox");

    currentSpans = animateText(mediaContainer, textbox, 
        document.querySelector(".text-attorney"), page.text);

    mediaContainer.onclick = () => {

        if (!isTyping || !DEBUG_MODE) return;
        finishAttorneyText(mediaContainer);
        mediaContainer.style.cursor = "default";
        textbox.style.cursor = "default";

    };
}

const INTERACTABLE_NAV = {
    // index 5
    5: { next: 6, prev: 4 }, // interact 
    6: { next: 7, prev: 5 },
    7: { next: 8, prev: 6 },
    8: { next: 9, prev: 7 },
    9: { next: 10, prev: 8 },
    10: { next: 5, prev: 9 }, 
    11: { next: 12, prev: 5 },
    12: { next: 13, prev: 11 },
    13: { next: 5, prev: 12 },
    14: { next: 15, prev: 5 }, // end

    16: { next: 20, prev: 15 },
    17: { next: 16, prev: 16 }, // cannon
    18: { next: 16, prev: 16 }, // sword
    19: { next: 16, prev: 16 }, // fruits
    20: { next: 21, prev: 16 },

    // index 30
    30: { next: 41, prev: 29 }, // interact 
    31: { next: 32, prev: 30 },  // bed
    32: { next: 33, prev: 31 },
    33: { next: 34, prev: 32 },
    34: { next: 30, prev: 33 },
    35: { next: 36, prev: 30 }, // shelf
    36: { next: 37, prev: 35 },
    37: { next: 30, prev: 36 },
    38: { next: 39, prev: 30 }, // records
    39: { next: 40, prev: 38 },
    40: { next: 30, prev: 39 },
    41: { next: 42, prev: 30 }, // end

    // index 49
    49: { next: 57, prev: 48 }, // interact 
    50: { next: 51, prev: 49 },
    51: { next: 52, prev: 50 },
    52: { next: 53, prev: 51 },
    53: { next: 49, prev: 52 },
    54: { next: 55, prev: 49 },
    55: { next: 49, prev: 54 },
    56: { next: 49, prev: 49 },
    57: { next: 58, prev: 49 }, // end

    // index 64
    64: { next: null, prev: 63 }, // interact 
    65: { next: 74, prev: 64 },
    66: { next: 74, prev: 64 },
    67: { next: 74, prev: 64 },
    68: { next: 74, prev: 64 },
    69: { next: 74, prev: 64 },
    70: { next: 74, prev: 64 },
    71: { next: 74, prev: 64 },
    72: { next: 74, prev: 64 },
    73: { next: 74, prev: 64 },
    74: { next: 75, prev: 64 }, // end

    // fly minigame = 77
    78: { next: 80, prev: 77 }, // miss
    79: { next: 80, prev: 77 }, // hit
    80: { next: 81, prev: 77 }, // end

    // index 111
    111: { next: 150, prev: 110 }, // interact 
    112: { next: 113, prev: 111 }, // crack
    113: { next: 114, prev: 112 },
    114: { next: 115, prev: 113 },
    115: { next: 116, prev: 114 },
    116: { next: 117, prev: 115 },
    117: { next: 118, prev: 116 },
    118: { next: 119, prev: 117 },
    119: { next: 120, prev: 118 },
    120: { next: 121, prev: 119 },
    121: { next: 122, prev: 120 },
    122: { next: 123, prev: 121 },
    123: { next: 124, prev: 122 },
    124: { next: 125, prev: 123 },
    125: { next: 111, prev: 124 },
    126: { next: 127, prev: 111 }, // plushpile
    127: { next: 128, prev: 126 },
    128: { next: 129, prev: 127 },
    129: { next: 130, prev: 128 },
    130: { next: 131, prev: 129 },
    131: { next: 132, prev: 130 },
    132: { next: 133, prev: 131 },
    133: { next: 134, prev: 132 },
    134: { next: 135, prev: 133 },
    135: { next: 136, prev: 134 },
    136: { next: 137, prev: 135 },
    137: { next: 111, prev: 136 },
    138: { next: 139, prev: 111 }, // posters
    139: { next: 140, prev: 138 },
    140: { next: 141, prev: 139 },
    141: { next: 142, prev: 140 },
    142: { next: 143, prev: 141 },
    143: { next: 144, prev: 142 },
    144: { next: 145, prev: 143 },
    145: { next: 146, prev: 144 },
    146: { next: 111, prev: 145 },
    147: { next: 111, prev: 111 }, // wallet
    148: { next: 111, prev: 111 }, // note
    149: { next: 111, prev: 111 }, // kimiko
    150: { next: 151, prev: 111 }, // end

    // index 151
    151: { next: 169, prev: 150 }, // interact 
    152: { next: 153, prev: 151 }, // plush
    153: { next: 154, prev: 152 },
    154: { next: 155, prev: 153 },
    155: { next: 156, prev: 154 },
    156: { next: 151, prev: 155 },
    157: { next: 158, prev: 151 }, // rat
    158: { next: 159, prev: 157 },
    159: { next: 160, prev: 158 },
    160: { next: 161, prev: 159 },
    161: { next: 151, prev: 160 },
    162: { next: 163, prev: 151 }, // poster
    163: { next: 164, prev: 162 },
    164: { next: 165, prev: 163 },
    165: { next: 166, prev: 164 },
    166: { next: 167, prev: 165 },
    167: { next: 168, prev: 166 },
    168: { next: 151, prev: 167 },
    169: { next: 170, prev: 151 }, // end

    225: { next: 93, prev: 92 }, // fish special page
    226: { next: 16, prev: 19 }, // homestuck special page
    227: { next: 74, prev: 70 }, // onix special page
    228: { next: 30, prev: 40 }, // banana 
    229: { next: 74, prev: 68 }, // oil 

    230: { next: 88, prev: 87 }, // dubai chocowate (intended index numbers)

};
// Elements
const biscordContainer = document.querySelector(".text-biscord");
const img = document.querySelector(".img");
const containerParent = document.querySelector(".container");
const mediaCCT = document.querySelector(".media-container");

// Profile mapping
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

async function initChat() {
    await initRouter(); 
    renderPage();
}

initChat(); // init

// Render page
function renderPage() {
    const pageNum = getCurrentPage();
    const page = getPageData();

    console.log("Index " + pageNum + " loaded.");

    const file = page.media;
    const ext = file.split(".").pop().toLowerCase();

    let element; // add media element to page
    if (IMAGE_TYPES.includes(ext)) {
        element = document.createElement("img");
        element.src = file;
    } else if (VIDEO_TYPES.includes(ext)) {
        element = document.createElement("video");
        element.src = file;
        element.autoplay = true;
        element.loop = true;
        element.muted = true; // needed for autoplay
        element.playsInline = true;
    } else {
        console.warn("Unsupported media type:", ext);
        return;
    }
    element.classList.add("img");

    renderBiscord(element, page); // render biscord chat in text area
}

// Navigation - not needed for PageHandler.js, but kept for ChitChatTime.js 
function nextPageCC() {
    goToPage(getCurrentPage() + 1);
}

function prevPageCC() {
    goToPage(getCurrentPage() - 1);
}

function renderBiscord(element, page = getPageData()) {
    // ChitChatTime Exclusive

    // remove existing media (img or video)
    if (mediaCCT) {
        mediaCCT.innerHTML = "";
        mediaCCT.appendChild(element);
    }
    // clear chat
    biscordContainer.innerHTML = "";

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
        biscordContainer.insertAdjacentHTML("beforeend", chatHTML);
    });
    loadIndex94Hitbox() // check if we need to load the index 94 hitbox for easter egg
}

// Easter Egg for index 94
function loadIndex94Hitbox() {
    if (getCurrentPage() !== 94) return;

    const video = mediaCCT.querySelector("video");
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
        mediaContainer: mediaCCT
    });
}
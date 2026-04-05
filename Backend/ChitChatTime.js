// Elements
const container = document.querySelector(".text-biscord");
const img = document.querySelector(".img");
const containerParent = document.querySelector(".container");
const mediaContainer = document.querySelector(".media-container");

// Profile mapping
const profiles = {
    "KimiwimiUwU": {
        img: "./Images/kimiko_pfp.PNG",
        class: "ye"
    },
    "xXDyedFeatherXx": {
        img: "./Images/nyle_pfp.PNG",
        class: "pu"
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

    // remove existing media (img or video)
    if (mediaContainer) {
        mediaContainer.innerHTML = "";
        mediaContainer.appendChild(element);
    }
    // clear chat
    container.innerHTML = "";

    // get chat
    const lines = (page.text || "")
        .split("\n")
        .filter(line => line.trim() !== "");

    // group consecutive messages by same speaker
    const grouped = [];

    lines.forEach(line => {
        const [name, ...rest] = line.split(" : ");
        const message = rest.join(" : ").trim();

        if (!profiles[name]) return;

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
        const profile = profiles[group.name];

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
        container.insertAdjacentHTML("beforeend", chatHTML);
    });
    loadIndex94Hitbox()
}

// Navigation
function nextPageCC() {
    goToPage(getCurrentPage() + 1);
}

function prevPageCC() {
    goToPage(getCurrentPage() - 1);
}

function buildHitbox({ top, left, width, height, onEnter, onLeave, onClick }) {
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
        }
    });
}
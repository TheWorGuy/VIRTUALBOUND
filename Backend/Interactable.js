// Interactable.js
// Globals
let currInteract = INTERACT_INDICES[0];
let isHovering = false;
let blinkOn= true;
let blinkInterval = null;
let outlineImages = [];
let nextIndex;
let currID = 0; // for Kimiko IDs
let isSliding = false;
let idImage = null;
let left_btn = null;
let right_btn = null;
let exit_btn = null;
let tint = null;

console.log(currInteract);

document.addEventListener("DOMContentLoaded", initInteract);

async function initInteract() {
    await initRouter();

    const currPage = getCurrentPage();
    currInteract = currPage;

    console.log("Index " + currInteract + " loaded.");

    loadPage();
    displayPageNumber();
}

// gather elements
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const interactArea = document.querySelector(".interact-area");
const interactText = document.getElementById("interact-text");
const interactBG = document.querySelector(".interact-bg");

const background = document.querySelector(".background");
const header = document.querySelector(".header");
const buttons = document.querySelectorAll(".button");
const textBox = document.querySelector(".text");
const swit = document.querySelector(".switch");

const BANANA_PAGE = 228;
const ID_LETTERS = [
        "a","b","c","d","e",
        "f","g","h","i","j"
    ];
const ID_MIN = 0;
const ID_MAX = ID_LETTERS.length - 1;
const TIMEOUT = 450;

// Function
function nextPageIn() { // goes to next page depending on current page
    goToPage(nextIndex);
}
function prevPageIn() {
    const curr = getCurrentPage();

    const prev = curr - 1;

    if (prev !== undefined) {
        goToPage(prev);
    } else {
        console.warn("No previous mapping for interact page:", curr);
    }
}

function loadPage() {
    // this is where this script decides which page to load 
    switch (currInteract) {
        case 5: 
            loadInteract5(); 
            nextIndex = 14;
            break;
        case 16:
            loadInteract16();
            nextIndex = 20;
            break;
        case 30: 
            loadInteract30(); 
            nextIndex = 41;
            break;
        case 40:
            loadInteract40();
            nextIndex = 30;
            break;
        case 49: 
            loadInteract49(); 
            nextIndex = 57;
            break;
        case 106:
            loadInteract106();
            nextIndex = 107;
            break;
        case 64: 
            loadInteract64(); 
            break;
        case 111: 
            loadInteract111(); 
            nextIndex = 150;
            break;
        case 151: 
            loadInteract151(); 
            nextIndex = 169;
            break;

    }
}
function purpleBoatSelect() {
    console.log("ourple");
    goToPage(6);
}
function orangeBoatSelect() {
    console.log("orange");
    goToPage(11);
}
function cannonSelect() {
    console.log("cannon");
    goToPage(17);
}
function swordSelect() {
    console.log("sword");
    goToPage(18);
}
function fruitsSelect() {
    console.log("fruits");
    goToPage(19);
}
function bedSelect() {
    console.log("bed");
    goToPage(31);
}
function recordsSelect() {
    console.log("records");
    goToPage(38);
}
function shelfSelect() {
    console.log("shelf");
    goToPage(35);
}
function toasterSelect() {
    console.log("toaster");
    goToPage(56);
}
function coffeeSelect() {
    console.log("coffee");
    goToPage(50);
}
function fruitBowlSelect() {
    console.log("fruit bowl");
    goToPage(54);
}

function crackwallSelect() {
    console.log("crackwall");
    goToPage(112);
}

function plushpileSelect() {
    console.log("plushpile");
    goToPage(126);
}

function postersSelect() {
    console.log("posters");
    goToPage(138);
}

function walletSelect() {
    console.log("wallet");
    goToPage(147);
}

function noteSelect() {
    console.log("note");
    goToPage(148);
}

function kimikoSelect() {
    console.log("kimiko");
    goToPage(149);
}

function plushSelect() {
    console.log("plush");
    goToPage(152);
}

function ratSelect() {
    console.log("rat");
    goToPage(157);
}

function posterSelect() {
    console.log("poster");
    goToPage(162);
}

function setVRStyle() { // DO NOT DELETE
    // this should only happen in index 5
    background.src = "./Images/vr_ship_background.png";
    header.classList.add("vr-ship-header");
    buttons.forEach(el => { el.classList.add('button-vr-ship', 'vr-ship-a'); });
    textBox.classList.add("text-vr-ship"); 
    swit.classList.add("switch-vr-ship"); 
    previous.className = "vr-ship-a"; 
    next.className = "vr-ship-a";
}

function resetInteract() {
    // stop blinking loop
    if (blinkInterval) {
        clearInterval(blinkInterval);
        blinkInterval = null;
    }

    // remove ONLY dynamic elements
    const elementsToRemove = interactArea.querySelectorAll(
        ".interact-parts, .hitbox"
    );

    elementsToRemove.forEach(elem => elem.remove());

    if (interactText) { // reset text
        interactText.innerText = "";
    }

    // reset globals
    outlineImages = [];
    isHovering = false;
    blinkOn = true;
    next.hidden = false;
    currID = 0;
}

function startBlinking() {
    if (blinkInterval) return;

    blinkInterval = setInterval(() => {
        if (!isHovering) {
            blinkOn = !blinkOn;

            outlineImages.forEach(img => {
                img.style.opacity = blinkOn ? "1" : "0";
            });
        }
    }, 750); // ms
}

// load interactable pages
function loadInteract5() {
    setVRStyle();
    resetInteract();
    
    currInteract = 5;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_6_img/6_background.PNG";

    const purpleBoat = document.createElement("img");
    purpleBoat.src = "./Images/id_6_img/6_purple_boat.PNG";
    purpleBoat.classList.add("interact-parts", "boat");

    const orangeBoat = document.createElement("img");
    orangeBoat.src = "./Images/id_6_img/6_orange_boat.PNG";
    orangeBoat.classList.add("interact-parts", "boat");

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_6_img/6_foreground.PNG";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(purpleBoat);
    interactArea.appendChild(orangeBoat);
    interactArea.appendChild(foreground);

    purpleBoat.style.opacity = "0";
    outlineImages.push(purpleBoat);

    orangeBoat.style.opacity = "0";
    outlineImages.push(orangeBoat);

    // hitbox for purple boat
    buildHitbox({
        top: "40%",
        left: "4%",
        width: "43%",
        height: "50%",
        onEnter: () => purpleBoat.style.opacity = "1",
        onLeave: () => purpleBoat.style.opacity = "0",
        onClick: () => purpleBoatSelect(),
        mediaContainer: interactArea
    });

    // hitbox for orange boat
    buildHitbox({
        top: "7.5%",
        left: "50.5%",
        width: "49%",
        height: "72.5%",
        onEnter: () => orangeBoat.style.opacity = "1",
        onLeave: () => orangeBoat.style.opacity = "0",
        onClick: () => orangeBoatSelect(),
        mediaContainer: interactArea
    });

    startBlinking();
} 

function loadInteract16() {
    setVRStyle();
    resetInteract();
    
    currInteract = 16;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_17_img/17_background.png";

    const cannon = document.createElement("img");
    cannon.src = "./Images/id_17_img/17_cannon.png";
    cannon.classList.add("interact-parts", "think");

    const sword = document.createElement("img");
    sword.src = "./Images/id_17_img/17_sword.png";
    sword.classList.add("interact-parts", "think");

    const fruits = document.createElement("img");
    fruits.src = "./Images/id_17_img/17_fruits.png";
    fruits.classList.add("interact-parts", "think");

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_17_img/17_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(cannon);
    interactArea.appendChild(sword);
    interactArea.appendChild(fruits);
    interactArea.appendChild(foreground);

    cannon.style.opacity = "0"; // initial
    outlineImages.push(cannon);

    sword.style.opacity = "0";
    outlineImages.push(sword);

    fruits.style.opacity = "0";
    outlineImages.push(fruits);

    // hitbox for think
    buildHitbox({ 
        top: "13%",
        left: "13%",
        width: "23%",
        height: "28%",
        onEnter: () => cannon.style.opacity = "1",
        onLeave: () => cannon.style.opacity = "0",
        onClick: () => cannonSelect(),
        mediaContainer: interactArea
    });

    buildHitbox({ 
        top: "5%",
        left: "41%",
        width: "23%",
        height: "28%",
        onEnter: () => sword.style.opacity = "1",
        onLeave: () => sword.style.opacity = "0",
        onClick: () => swordSelect(),
        mediaContainer: interactArea
    });

    buildHitbox({ 
        top: "15%",
        left: "69%",
        width: "23%",
        height: "28%",
        onEnter: () => fruits.style.opacity = "1",
        onLeave: () => fruits.style.opacity = "0",
        onClick: () => fruitsSelect(),
        mediaContainer: interactArea
    });

    startBlinking();
}

function loadInteract30() {
    resetInteract();
    
    currInteract = 30;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_31_img/31_background.PNG";

    const bed = document.createElement("img");
    bed.src = "./Images/id_31_img/31_bed.PNG";
    bed.classList.add("interact-parts", "bedroom");

    const records = document.createElement("img");
    records.src = "./Images/id_31_img/31_records.PNG";
    records.classList.add("interact-parts", "bedroom");

    const shelf = document.createElement("img");
    shelf.src = "./Images/id_31_img/31_shelf.PNG";
    shelf.classList.add("interact-parts", "bedroom");

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_31_img/31_foreground.PNG";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(bed);
    interactArea.appendChild(records);
    interactArea.appendChild(shelf);
    interactArea.appendChild(foreground);

    bed.style.opacity = "0"; // initial
    outlineImages.push(bed);

    records.style.opacity = "0";
    outlineImages.push(records);

    shelf.style.opacity = "0";
    outlineImages.push(shelf);

    // hitbox for bed
    buildHitbox({ // lower hitbox
        top: "56%",
        left: "2.5%",
        width: "35%",
        height: "20%",
        onEnter: () => bed.style.opacity = "1",
        onLeave: () => bed.style.opacity = "0",
        onClick: () => bedSelect(),
        mediaContainer: interactArea
    });
    buildHitbox({ // upper hitbox
        top: "45%",
        left: "2.5%",
        width: "20%",
        height: "11%",
        onEnter: () => bed.style.opacity = "1",
        onLeave: () => bed.style.opacity = "0",
        onClick: () => bedSelect(),
        mediaContainer: interactArea
    });

    // hitbox for records
    buildHitbox({
        top: "43.5%",
        left: "25%",
        width: "10%",
        height: "12.5%",
        onEnter: () => records.style.opacity = "1",
        onLeave: () => records.style.opacity = "0",
        onClick: () => recordsSelect(),
        mediaContainer: interactArea
    });

    // hitbox for shelf
    buildHitbox({
        top: "38%",
        left: "35%",
        width: "35%",
        height: "18%",
        onEnter: () => shelf.style.opacity = "1",
        onLeave: () => shelf.style.opacity = "0",
        onClick: () => shelfSelect(),
        mediaContainer: interactArea
    });
    buildHitbox({
        top: "20%",
        left: "30%",
        width: "45%",
        height: "18%",
        onEnter: () => shelf.style.opacity = "1",
        onLeave: () => shelf.style.opacity = "0",
        onClick: () => shelfSelect(),
        mediaContainer: interactArea
    });

    startBlinking();
}

function loadInteract40() { 
    resetInteract();
    
    currInteract = 40;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/41.png";

    buildHitbox({
        top: "50%",
        left: "42%",
        width: "25%",
        height: "18%",
        onEnter: () => {},
        onLeave: () => {},
        onClick: () => loadFunny(),
        mediaContainer: interactArea
    });
}

function loadFunny() {
    goToPage(BANANA_PAGE);
}

function loadInteract49() {
    resetInteract();

    currInteract = 49;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_50_img/50_background.PNG";

    const toaster = document.createElement("img");
    toaster.src = "./Images/id_50_img/50_clearlyyouownatoaster.PNG";
    toaster.classList.add("interact-parts", "kitchen");

    const coffee = document.createElement("img");
    coffee.src = "./Images/id_50_img/50_coffee.PNG";
    coffee.classList.add("interact-parts", "kitchen");

    const fruitBowl = document.createElement("img");
    fruitBowl.src = "./Images/id_50_img/50_fruit_bowl.PNG";
    fruitBowl.classList.add("interact-parts", "kitchen");

    interactArea.appendChild(toaster);
    interactArea.appendChild(coffee);
    interactArea.appendChild(fruitBowl);

    toaster.style.opacity = "0"; // initial
    outlineImages.push(toaster);

    coffee.style.opacity = "0";
    outlineImages.push(coffee);

    fruitBowl.style.opacity = "0";
    outlineImages.push(fruitBowl);

    // toaster hitbox
    buildHitbox({ 
        top: "58%",
        left: "64%",
        width: "15%",
        height: "16%",
        onEnter: () => toaster.style.opacity = "1",
        onLeave: () => toaster.style.opacity = "0",
        onClick: () => toasterSelect(),
        mediaContainer: interactArea
    });

    // coffee hitbox
    buildHitbox({ 
        top: "38%",
        left: "61%",
        width: "12%",
        height: "15%",
        onEnter: () => coffee.style.opacity = "1",
        onLeave: () => coffee.style.opacity = "0",
        onClick: () => coffeeSelect(),
        mediaContainer: interactArea
    });

    // fruitBowl hitbox
    buildHitbox({ 
        top: "50%",
        left: "15%",
        width: "17%",
        height: "17%",
        onEnter: () => fruitBowl.style.opacity = "1",
        onLeave: () => fruitBowl.style.opacity = "0",
        onClick: () => fruitBowlSelect(),
        mediaContainer: interactArea
    });

    startBlinking();
}

function loadInteract111() {
    resetInteract();
    
    currInteract = 111;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_111_img/111_background.PNG";

    const crackwall = document.createElement("img");
    crackwall.src = "./Images/id_111_img/111_crackwall.png";
    crackwall.classList.add("interact-parts", "kimikohouse");

    const plushpile = document.createElement("img");
    plushpile.src = "./Images/id_111_img/111_plushpile.png";
    plushpile.classList.add("interact-parts", "kimikohouse");

    const posters = document.createElement("img");
    posters.src = "./Images/id_111_img/111_posters.png";
    posters.classList.add("interact-parts", "kimikohouse");

    const wallet = document.createElement("img");
    wallet.src = "./Images/id_111_img/111_wallet.png";
    wallet.classList.add("interact-parts", "kimikohouse");

    const note = document.createElement("img");
    note.src = "./Images/id_111_img/111_note.png";
    note.classList.add("interact-parts", "kimikohouse");

    const kimiko = document.createElement("img");
    kimiko.src = "./Images/id_111_img/111_kimiko.png";
    kimiko.classList.add("interact-parts", "kimikohouse");

    interactArea.appendChild(crackwall);
    interactArea.appendChild(plushpile);
    interactArea.appendChild(posters);
    interactArea.appendChild(wallet);
    interactArea.appendChild(note);
    interactArea.appendChild(kimiko);

    crackwall.style.opacity = "0"; // initial
    outlineImages.push(crackwall);

    plushpile.style.opacity = "0";
    outlineImages.push(plushpile);

    posters.style.opacity = "0";
    outlineImages.push(posters);

    posters.style.opacity = "0";
    outlineImages.push(wallet);

    posters.style.opacity = "0";
    outlineImages.push(note);

    posters.style.opacity = "0";
    outlineImages.push(kimiko);

    // hitbox for crackwall
    buildHitbox({
        top: "44%",
        left: "33%",
        width: "7%",
        height: "12%",
        onEnter: () => crackwall.style.opacity = "1",
        onLeave: () => crackwall.style.opacity = "0",
        onClick: () => crackwallSelect(),
        mediaContainer: interactArea
    });

    // hitbox for plushpile
    buildHitbox({ // lower hitbox
        top: "51%",
        left: "1%",
        width: "30%",
        height: "20%",
        onEnter: () => plushpile.style.opacity = "1",
        onLeave: () => plushpile.style.opacity = "0",
        onClick: () => plushpileSelect(),
        mediaContainer: interactArea
    });

    buildHitbox({ // upper hitbox
        top: "34%",
        left: "5%",
        width: "20%",
        height: "17%",
        onEnter: () => plushpile.style.opacity = "1",
        onLeave: () => plushpile.style.opacity = "0",
        onClick: () => plushpileSelect(),
        mediaContainer: interactArea
    });

    // hitbox for posters
    buildHitbox({
        top: "27%",
        left: "76%",
        width: "20%",
        height: "25%",
        onEnter: () => posters.style.opacity = "1",
        onLeave: () => posters.style.opacity = "0",
        onClick: () => postersSelect(),
        mediaContainer: interactArea
    });

    // hitbox for wallet
    buildHitbox({
        top: "63%",
        left: "37%",
        width: "7%",
        height: "7%",
        onEnter: () => wallet.style.opacity = "1",
        onLeave: () => wallet.style.opacity = "0",
        onClick: () => walletSelect(),
        mediaContainer: interactArea
    });

    // hitbox for note
    buildHitbox({
        top: "52%",
        left: "63%",
        width: "7%",
        height: "7%",
        onEnter: () => note.style.opacity = "1",
        onLeave: () => note.style.opacity = "0",
        onClick: () => noteSelect(),
        mediaContainer: interactArea
    });

    // hitbox for kimiko
    buildHitbox({
        top: "36%",
        left: "44%",
        width: "17%",
        height: "30%",
        onEnter: () => kimiko.style.opacity = "1",
        onLeave: () => kimiko.style.opacity = "0",
        onClick: () => kimikoSelect(),
        mediaContainer: interactArea
    });

    startBlinking();
}

function loadInteract151() {
    resetInteract();
    
    currInteract = 151;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_151_img/151_background.PNG";

    const plush = document.createElement("img");
    plush.src = "./Images/id_151_img/151_plush.PNG";
    plush.classList.add("interact-parts", "suspects");

    const rat = document.createElement("img");
    rat.src = "./Images/id_151_img/151_rat.PNG";
    rat.classList.add("interact-parts", "suspects");

    const poster = document.createElement("img");
    poster.src = "./Images/id_151_img/151_poster.PNG";
    poster.classList.add("interact-parts", "suspects");

    interactArea.appendChild(plush);
    interactArea.appendChild(rat);
    interactArea.appendChild(poster);

    plush.style.opacity = "0"; // initial
    outlineImages.push(plush);

    rat.style.opacity = "0";
    outlineImages.push(rat);

    poster.style.opacity = "0";
    outlineImages.push(poster);

    // hitbox for plush
    buildHitbox({
        top: "40%",
        left: "3.5%",
        width: "30%",
        height: "35%",
        onEnter: () => plush.style.opacity = "1",
        onLeave: () => plush.style.opacity = "0",
        onClick: () => plushSelect(),
        mediaContainer: interactArea
    });

    // hitbox for rat
    buildHitbox({
        top: "47%",
        left: "35%",
        width: "30%",
        height: "35%",
        onEnter: () => rat.style.opacity = "1",
        onLeave: () => rat.style.opacity = "0",
        onClick: () => ratSelect(),
        mediaContainer: interactArea
    });

    // hitbox for poster
    buildHitbox({
        top: "40%",
        left: "67%",
        width: "30%",
        height: "35%",
        onEnter: () => poster.style.opacity = "1",
        onLeave: () => poster.style.opacity = "0",
        onClick: () => posterSelect(),
        mediaContainer: interactArea
    });

    startBlinking();
}

function loadInteract64() {
    resetInteract();

    currInteract = 64;
    next.hidden = true;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    const sweaters = [];
    const sweaterConfigs = [
        { letter: "a", top: "20%", left: "0%", width: "15%", height: "75%" },
        { letter: "b", top: "20%", left: "15%", width: "14%", height: "75%" },
        { letter: "c", top: "20%", left: "29%", width: "9%", height: "75%" },
        { letter: "d", top: "20%", left: "38%", width: "12.5%", height: "75%" },
        { letter: "e", top: "20%", left: "50.5%", width: "14%", height: "75%" },
        { letter: "f", top: "20%", left: "64.5%", width: "13%", height: "75%" },
        { letter: "g", top: "20%", left: "77.5%", width: "11.5%", height: "75%" },
        { letter: "h", top: "20%", left: "89%", width: "11%", height: "75%" }
    ];

    const basePath = "./Images/id_65_img/65"; // can be a - h 
    const fileType = ".png" // append after specifier

    interactBG.src = "./Images/id_65_img/65_background.png";

    // iteration for all 8 sweater images, all will have the sweater class
    sweaterConfigs.forEach((config, i) => {
        const sweater = document.createElement("img");
        sweater.src = `${basePath}${config.letter}${fileType}`;
        sweater.classList.add("interact-parts", "sweater");
        sweater.style.opacity = "0";

        sweater.dataset.choice = config.letter;

        interactArea.appendChild(sweater);
        outlineImages.push(sweater);
        sweaters.push(sweater);

        buildHitbox({
            top: config.top,
            left: config.left,
            width: config.width,
            height: config.height,
            onEnter: () => sweater.style.opacity = "1",
            onLeave: () => sweater.style.opacity = "0",
            onClick: () => handleSweaterClick(config.letter),
            mediaContainer: interactArea
        });
    });

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_65_img/65_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(foreground);

    startBlinking();
}

function handleSweaterClick(theEvent) { // implement later

    switch(theEvent) {
        case "a": 
            // go to index 65 (different html)
            console.log("Selection A");
            goToPage(65);
            break;
        case "b": 
            // go to index 66 (different html)
            console.log("Selection B");
            goToPage(66);
            break;
        case "c": 
            // go to index 67 (different html) 
            console.log("Selection C");
            goToPage(67);
            break;
        case "d": 
            // go to index 68 (different html)
            console.log("Selection D");
            goToPage(68);
            break;
        case "e": 
            // go to index 69 (different html)
            console.log("Selection E");
            goToPage(69);
            break;
        case "f": 
            // go to index 70 (different html)
            console.log("Selection F");
            goToPage(70);
            break;
        case "g": 
            // go to index 71 (different html)
            console.log("Selection G");
            goToPage(71);
            break;
        case "h": 
            // go to index 72 (different html)
            console.log("Selection H");
            goToPage(72);
            break;
    }
}

// Kimiko IDs Section
function loadInteract106() {
    resetInteract();
    
    currInteract = 106;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/107.PNG";

    const ids = document.createElement("img");
    ids.src = "./Images/id_106_img/106_ids.png";
    ids.classList.add("interact-parts", "suspects");

    interactArea.appendChild(ids);

    ids.style.opacity = "0"; // initial
    outlineImages.push(ids);

    // hitbox for plush
    buildHitbox({
        top: "62%",
        left: "39%",
        width: "15.5%",
        height: "7%",
        onEnter: () => ids.style.opacity = "1",
        onLeave: () => ids.style.opacity = "0",
        onClick: () => idSelect(),
        mediaContainer: interactArea
    });

    startBlinking();
}

function idSelect() {
    console.log("ids selected! activate overlay!");

    left_btn = document.createElement("img");
    right_btn = document.createElement("img");
    exit_btn = document.createElement("img");
    tint = document.createElement("div");
    idImage = document.createElement("img");

    left_btn.src = "./Images/id_106_img/106_left.png";
    right_btn.src = "./Images/id_106_img/106_right.png";
    exit_btn.src = "./Images/id_106_img/106_exit.png";

    left_btn.classList.add("id-button", "left-btn", "hidden");
    right_btn.classList.add("id-button", "right-btn", "hidden");
    exit_btn.classList.add("id-button", "exit-btn", "hidden");
    tint.classList.add("id-tint");

    interactArea.appendChild(tint);
    interactArea.appendChild(left_btn);
    interactArea.appendChild(right_btn);
    interactArea.appendChild(exit_btn);

    idImage.classList.add("id-image", "hidden");
    interactArea.appendChild(idImage);

    requestAnimationFrame(() => {

        tint.style.opacity = "1";

        left_btn.classList.remove("hidden");
        right_btn.classList.remove("hidden");
        exit_btn.classList.remove("hidden");

        idImage.classList.remove("hidden");
        idImage.classList.add("center");

    });
    
    idImage.src = `./Images/id_106_img/106_id_${ID_LETTERS[currID]}.png`;

    left_btn.onclick = () => {
        if (currID > ID_MIN)
            slideTo(currID - 1, "left");
    };

    right_btn.onclick = () => {
        if (currID < ID_MAX)
            slideTo(currID + 1, "right");
    };

    exit_btn.onclick = () => {

        tint.style.opacity = "0";
        left_btn.classList.add("hidden");
        right_btn.classList.add("hidden");
        exit_btn.classList.add("hidden");
        idImage.classList.add("hidden");

        setTimeout(() => {

            tint.remove();
            idImage.remove();
            left_btn.remove();
            right_btn.remove();
            exit_btn.remove();

        }, TIMEOUT);

    };

    idImage.classList.add("id-image", "center");
    interactArea.appendChild(idImage);

    updateButtons();
}

function slideTo(newIndex, direction) {

    if (isSliding) return;
    isSliding = true;

    const oldImage = idImage;

    const newImage = document.createElement("img");
    newImage.className = "id-image";

    newImage.src =
        `./Images/id_106_img/106_id_${ID_LETTERS[newIndex]}.png`;

    // Start just outside the center
    if (direction === "right")
        newImage.classList.add("right");
    else
        newImage.classList.add("left");

    interactArea.appendChild(newImage);

    newImage.offsetHeight;

    requestAnimationFrame(() => {

        // Old image leaves
        oldImage.classList.remove("center");

        if (direction === "right")
            oldImage.classList.add("left");
        else
            oldImage.classList.add("right");

        // New image enters
        newImage.classList.remove(direction === "right" ? "right" : "left");
        newImage.classList.add("center");
    });

    setTimeout(() => {

        oldImage.remove();

        idImage = newImage;
        currID = newIndex;

        updateButtons();

        isSliding = false;

    }, TIMEOUT);
}

function updateButtons() {
    if (currID === ID_MIN) left_btn.classList.add("disabled");
    else left_btn.classList.remove("disabled");

    if (currID === ID_MAX) right_btn.classList.add("disabled");
    else right_btn.classList.remove("disabled");
}
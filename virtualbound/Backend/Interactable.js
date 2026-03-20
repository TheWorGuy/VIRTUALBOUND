// access Pages.json
// grab text of various indices

// Constants
const DEBUG_MODE = true;
const INTERACT_PAGES = [5, 30, 49, 64];

// Globals
let currInteract = INTERACT_PAGES[0];

console.log(currInteract);

// gather elements
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const interactArea = document.querySelector(".interact-area");
const interactText = document.getElementById("interact-text");
const interactBG = document.querySelector(".interact-bg");


// initial conditions 
next.hidden = true;
//previous.hidden = true;

loadInteract64();

// Function
function nextPageIn() { // goes to next page depending on current page

}
function prevPageIn() {

}

function buildHitbox({ top, left, width, height, onEnter, onLeave }) {
    const hitbox = document.createElement("div");

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

    hitbox.addEventListener("mouseenter", onEnter);
    hitbox.addEventListener("mouseleave", onLeave);

    interactArea.appendChild(hitbox);

    return hitbox;
}

// load interactable pages
function loadInteract5() {
    currInteract = 5;

    interactBG.src = "./Images/id_6_img/6_background.png";

    const purpleBoat = document.createElement("img");
    purpleBoat.src = "./Images/id_6_img/6_purple_boat.png";
    purpleBoat.classList.add("interact-parts", "boat");

    const orangeBoat = document.createElement("img");
    orangeBoat.src = "./Images/id_6_img/6_orange_boat.png";
    orangeBoat.classList.add("interact-parts", "boat");

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_6_img/6_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(purpleBoat);
    interactArea.appendChild(orangeBoat);
    interactArea.appendChild(foreground);

    purpleBoat.style.opacity = "0"; // initial
    orangeBoat.style.opacity = "0";

    // hitbox for purple boat
    buildHitbox({
        top: "40%",
        left: "4%",
        width: "43%",
        height: "50%",
        onEnter: () => purpleBoat.style.opacity = "1",
        onLeave: () => purpleBoat.style.opacity = "0"
    });

    // hitbox for orange boat
    buildHitbox({
        top: "7.5%",
        left: "50.5%",
        width: "49%",
        height: "72.5%",
        onEnter: () => orangeBoat.style.opacity = "1",
        onLeave: () => orangeBoat.style.opacity = "0"
    });
}

function loadInteract30() {
    currInteract = 30;

    interactBG.src = "./Images/id_31_img/31_background.png";

    const bed = document.createElement("img");
    bed.src = "./Images/id_31_img/31_bed.png";
    bed.classList.add("interact-parts", "bedroom");

    const records = document.createElement("img");
    records.src = "./Images/id_31_img/31_records.png";
    records.classList.add("interact-parts", "bedroom");

    const shelf = document.createElement("img");
    shelf.src = "./Images/id_31_img/31_shelf.png";
    shelf.classList.add("interact-parts", "bedroom");

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_31_img/31_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(bed);
    interactArea.appendChild(records);
    interactArea.appendChild(shelf);
    interactArea.appendChild(foreground);

    bed.style.opacity = "0"; // initial
    records.style.opacity = "0";
    shelf.style.opacity = "0";

    // hitbox for bed
    buildHitbox({ // lower hitbox
        top: "56%",
        left: "2.5%",
        width: "35%",
        height: "20%",
        onEnter: () => bed.style.opacity = "1",
        onLeave: () => bed.style.opacity = "0"
    });
    buildHitbox({ // upper hitbox
        top: "45%",
        left: "2.5%",
        width: "20%",
        height: "11%",
        onEnter: () => bed.style.opacity = "1",
        onLeave: () => bed.style.opacity = "0"
    });

    // hitbox for records
    buildHitbox({
        top: "43.5%",
        left: "25%",
        width: "10%",
        height: "12.5%",
        onEnter: () => records.style.opacity = "1",
        onLeave: () => records.style.opacity = "0"
    });

    // hitbox for shelf
    buildHitbox({
        top: "38%",
        left: "35%",
        width: "35%",
        height: "18%",
        onEnter: () => shelf.style.opacity = "1",
        onLeave: () => shelf.style.opacity = "0"
    });
    buildHitbox({
        top: "20%",
        left: "30%",
        width: "45%",
        height: "18%",
        onEnter: () => shelf.style.opacity = "1",
        onLeave: () => shelf.style.opacity = "0"
    });
}

function loadInteract49() {
    currInteract = 49;
    interactBG.src = "./Images/id_50_img/50_background.png";

    const toaster = document.createElement("img");
    toaster.src = "./Images/id_50_img/50_clearlyyouownatoaster.png";
    toaster.classList.add("interact-parts", "kitchen");

    const coffee = document.createElement("img");
    coffee.src = "./Images/id_50_img/50_coffee.png";
    coffee.classList.add("interact-parts", "kitchen");

    const fruitBowl = document.createElement("img");
    fruitBowl.src = "./Images/id_50_img/50_fruit_bowl.png";
    fruitBowl.classList.add("interact-parts", "kitchen");

    interactArea.appendChild(toaster);
    interactArea.appendChild(coffee);
    interactArea.appendChild(fruitBowl);

    toaster.style.opacity = "0"; // initial - CHANGE TO CONSTANTLY FLASHING
    coffee.style.opacity = "0";
    fruitBowl.style.opacity = "0";

    // toaster hitbox
    buildHitbox({ 
        top: "58%",
        left: "64%",
        width: "15%",
        height: "16%",
        onEnter: () => toaster.style.opacity = "1",
        onLeave: () => toaster.style.opacity = "0"
    });

    // coffee hitbox
    buildHitbox({ 
        top: "38%",
        left: "61%",
        width: "12%",
        height: "15%",
        onEnter: () => coffee.style.opacity = "1",
        onLeave: () => coffee.style.opacity = "0"
    });

    // fruitBowl hitbox
    buildHitbox({ 
        top: "50%",
        left: "15%",
        width: "17%",
        height: "17%",
        onEnter: () => fruitBowl.style.opacity = "1",
        onLeave: () => fruitBowl.style.opacity = "0"
    });

}

function loadInteract64() {
    currInteract = 64;

    const sweaters = [];

    let basePath = "./Images/id_65_img/65"; // can be a - h 
    let fileType = ".png" // append after specifier

    interactBG.src = "./Images/id_65_img/65_background.png";

    // iterate through 65a to 65h by editing the sweaterPaths string
    const sweaterA = document.createElement("img");
    sweaterA.src = "./Images/id_65_img/65a.png";
    sweaterA.classList.add("interact-parts", "sweater");

    // iteration for all 8 sweater images, all will have the sweater class
    for (let i = 0; i < 8; i++) {
        const letter = String.fromCharCode(97+i); // a to h

        const sweater = document.createElement("img");
        sweater.src = `${basePath}${letter}${fileType}`; 
        sweater.classList.add("interact-parts", "sweater");
        sweater.style.opacity = "0";

        sweater.dataset.choice = letter;
        sweater.dataset.index = i;

        sweater.addEventListener("mousedown", handleSweaterClick); // this seems to be for the image, we need to reorient this to be for each hitbox rather than the image

        interactArea.appendChild(sweater);
        sweaters.push(sweater);

        // buildHitbox({
        //     top: `${10 + i * 8}%`, // adjust positioning per sweater
        //     left: "30%",
        //     width: "20%",
        //     height: "8%",
        //     onEnter: () => sweater.style.opacity = "1",
        //     onLeave: () => sweater.style.opacity = "0"
        // });
    }

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_65_img/65_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(foreground);
}

function handleSweaterClick(theEvent) { // implement later
    const choice = theEvent.currentTarget.dataset.choice;

    switch(choice) {
        case a: 
            // go to index 65 (different html)
            break;
        case b: 
            // go to index 66 (different html)
            break;
        case c: 
            // go to index 67 (different html) 
            break;
        case d: 
            // go to index 68 (different html)
            break;
        case e: 
            // go to index 69 (different html)
            break;
        case f: 
            // go to ndex 70 (different html)
            break;
        case g: 
            // go to index 71 (different html)
            break;
        case h: 
            // go to index 72 (different html)
            break;
    }
}
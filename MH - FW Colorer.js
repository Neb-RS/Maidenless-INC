// ==UserScript==
// @name         MouseHunt - FW Warpath map colour coder
// @author       tsitu & Leppy & in59te & Warden Slayer
// @namespace    https://greasyfork.org/en/users/967077-maidenless
// @version      1.1.0
// @description  Color codes mice on warpath maps according to type.
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

const displayMinLuck = false; // Will display minluck for the group of mouse iff true.
const displayAR = false; // Will display the AR for each uncaught mouse iff true.
const displayHunterCheese = false; // Will display which group of mouse the hunter if attempting iff true.
let assignBaitChange = false; // Avoid the bait change event being registered more than once.

// If the chest name contains any of hte following as a substring, enable the colour coder.
const chestKeywords = [
    "Warpath",
];

// name, AR
const wave1Mice = [
    ["Desert Archer", "0%"],
    ["Vanguard", "0%"],
    ["Desert Soldier", "0%"],
];
const wave2Mice = [
    ["Flame Archer", "0%"],
    ["Sentinel", "0%"],
    ["Flame Warrior", "0%"],
    ["Sand Cavalry", "0%"],
    ["Inferno Mage", "0%"],
];
const wave3Mice = [
    ["Crimson Ranger", "0%"],
    ["Crimson Watch", "0%"],
    ["Crimson Titan", "0%"],
    ["Sandwing Cavalry", "0%"],
    ["Magmarage", "0%"],
    ["Flame Ordnance", "0%"],
];
const wave4Mice = [
    ["Theurgy Warden", "0%"],
    ["Warmonger", "0%"],
];
const specialMice = [
    ["Crimson Commander", "0%"],
    ["Caravan Guard", "0%"],
];
const gargaMice = [
    ["Gargantuamouse", "0%"],
];

// group name, mice, minimum luck, bait, bait ID, color
const miceGroups = [
    ["W1", wave1Mice, 0, "", 114, "#0BE496"], // brown-ish
    ["W2", wave2Mice, 0, "", 114, "#5D9FCE"], // red
    ["W3", wave3Mice, 0, "", 114, "#F06A60"], // green
    ["W4", wave4Mice, 0, "", 114, "#CD87FF"], // light purple
    ["Special", specialMice, 0, "", 114, "#FFF935"], // teal-ish
    ["Garga", gargaMice, 0, "", 114, "#5AE031"], //
];

class Mouse {
    constructor(name, AR) {
        this.name = name;
        this.AR = AR;
    }
}

class MiceGroup {
    constructor(name, minluck, cheese, baitId, color) {
        this.name = name;
        this.mice = [];
        this.minluck = minluck;
        this.cheese = cheese;
        this.baitId = baitId;
        this.color = color;
        this.count = 0;
    }

    add(mouse) {
        this.mice.push(mouse);
    }

    hasMouse(name) {
        for (let i = 0; i < this.mice.length; i++) {
            if (this.mice[i].name == name) {
                return true;
            }
        }
        return false;
    }

    getAR(name) {
        for (let i = 0; i < this.mice.length; i++) {
            if (this.mice[i].name == name) {
                return this.mice[i].AR;
            }
        }
        return "0.00%";
    }
}

let allMiceGroups = []; // This contains all info about the various group of mice.
let miceNameDict = {}; // If displayAR == true, we are forced to modify the <span> element's text to mouse name + AR, so we need to be able to go back to the original mouse name.

function initialise() {
    // Avoid initialising more than once as the script can be called multiple times by other plug-in.
    if (allMiceGroups.length > 0) {
        return;
    }

    // Populate allMiceGroups from miceGroups
    for (let i = 0; i < miceGroups.length; i++) {
        let miceGroup = new MiceGroup(
            miceGroups[i][0],
            miceGroups[i][2],
            miceGroups[i][3],
            miceGroups[i][4],
            miceGroups[i][5]
        );
        for (let j = 0; j < miceGroups[i][1].length; j++) {
            miceGroup.add(new Mouse(miceGroups[i][1][j][0], miceGroups[i][1][j][1]));
        }
        allMiceGroups.push(miceGroup);
    }
}

function addAr(mouseSpan, mouseName, miceGroup) {
    const mouseNameWithAr = mouseName + " (" + miceGroup.getAR(mouseName) + ")";
    //console.log("checking " + mouseNameWithAr + " in dict: " + (mouseNameWithAr in miceNameDict));
    if (!(mouseNameWithAr in miceNameDict)) {
        miceNameDict[mouseNameWithAr] = mouseName;
    }
    mouseSpan.querySelector(".treasureMapView-goals-group-goal-name").querySelector("span").firstChild .textContent = mouseNameWithAr;
}

const defaultColor = miceGroups[0][5];
const hunterColor = [defaultColor, defaultColor, defaultColor, defaultColor, defaultColor];
var numHunters = 0;

function getCheeseColor(cheese) {
    for (let i = 0; i < allMiceGroups.length; i++) {
        if (allMiceGroups[i].cheese == cheese) {
            return allMiceGroups[i].color;
        }
    }
    return defaultColor; // return the default color if no matching cheese.
}

function hunterColorize() {
    document.querySelectorAll(".treasureMapRootView-subTab:not(.active)")[0].click(); //swap between Goals and Hunters
    let hunters = document.querySelectorAll(".treasureMapView-componentContainer");
    const list_of_cheese = [];
    for (let i = 0; i < hunters.length; i++) {
        list_of_cheese.push(hunters[i].children[2].title);
    }
    //console.log(list_of_cheese);
    numHunters = hunters.length;
    document.querySelectorAll(".treasureMapRootView-subTab:not(.active)")[0].click();

    for (let i = 0; i < numHunters; i++) {
        hunterColor[i] = getCheeseColor(list_of_cheese[i]);
    }
    //console.log(hunterColor);
}

function colorize() {
    const greyColor = "#949494";

    const isChecked =
          localStorage.getItem("highlightPref") === "uncaught-only" ? true : false;
    const isCheckedStr = isChecked ? "checked" : "";

    if (
        document.querySelectorAll(".treasureMapView-goals-group-goal").length === 0
    ) {
        return;
    }

    for (let i = 0; i < allMiceGroups.length; i++) {
        allMiceGroups[i].count = 0;
    }

    /*
    for (const key of Object.keys(miceNameDict)) {
        console.log(key + ": " + miceNameDict[key])
    }
    */

    document.querySelectorAll(".treasureMapView-goals-group-goal").forEach(el => {
        let mouseName = el.querySelector(".treasureMapView-goals-group-goal-name").querySelector("span").firstChild .textContent;
        // Fix up the mouse name if we added AR info in.
        if (mouseName in miceNameDict) {
            mouseName = miceNameDict[mouseName];
        }
        //console.log(mouseName);

        for (let i = 0; i < allMiceGroups.length; i++) {
            if (allMiceGroups[i].hasMouse(mouseName)) {
                el.style.backgroundColor = allMiceGroups[i].color;
                if (el.className.indexOf(" complete ") < 0) {
                    allMiceGroups[i].count++;
                    if (displayAR) {
                        addAr(el, mouseName, allMiceGroups[i]);
                    }
                } else {
                    if (isChecked) el.style.backgroundColor = "white";
                }
            }
        }
    });

    /*
    for (let i = 0; i < allMiceGroups.length; i++) {
        console.log(allMiceGroups[i].name + " " + allMiceGroups[i].cheese + " " + allMiceGroups[i].count);
    }*/

    // Remove existing tsitu-map-div related elements before proceeding
    document.querySelectorAll(".tsitu-map-div").forEach(el => el.remove());

    const masterDiv = document.createElement("div");
    masterDiv.className = "tsitu-map-div";
    masterDiv.style =
        "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
    const spanStyle =
          "; width: auto; padding: 5px; font-weight: bold; font-size: 12.75px; text-shadow: 0px 0px 11px white";

    const spans = [];

    for (let i = 0; i < allMiceGroups.length; i++) {
        const newSpan = document.createElement("span");
        newSpan.classList.add(allMiceGroups[i].name + "Span");
        if (allMiceGroups[i].count > 0) {
            newSpan.style = "background-color: " + allMiceGroups[i].color + spanStyle;
        }
        else {
            newSpan.style = "background-color: " + greyColor + spanStyle;
        }
        newSpan.innerHTML = allMiceGroups[i].name;
        if (displayMinLuck) {
            newSpan.innerHTML = newSpan.innerHTML + " (" + allMiceGroups[i].minluck + ")";
        }
        newSpan.innerHTML = newSpan.innerHTML + "<br>" + allMiceGroups[i].count;
        spans.push(newSpan);
    }

    // Highlight uncaught only feature
    const highlightLabel = document.createElement("label");
    highlightLabel.htmlFor = "tsitu-highlight-box";
    highlightLabel.innerText = "Highlight uncaught mice only";

    const highlightBox = document.createElement("input");
    highlightBox.type = "checkbox";
    highlightBox.name = "tsitu-highlight-box";
    highlightBox.style.verticalAlign = "middle";
    highlightBox.checked = isChecked;
    highlightBox.addEventListener("click", function () {
        if (highlightBox.checked) {
            localStorage.setItem("highlightPref", "uncaught-only");
        } else {
            localStorage.setItem("highlightPref", "all");
        }
        if (displayHunterCheese) {
            hunterColorize();
        }
        colorize();
    });

    const highlightDiv = document.createElement("div");
    highlightDiv.className = "tsitu-map-div";
    highlightDiv.style = "float: right; position: relative; z-index: 1";
    highlightDiv.appendChild(highlightBox);
    highlightDiv.appendChild(highlightLabel);

    // Assemble masterDiv
    for (let i = 0; i < spans.length; i++) {
        masterDiv.appendChild(spans[i]);
    }

    // Inject into DOM
    const insertEl = document.querySelector(
        ".treasureMapView-leftBlock .treasureMapView-block-content"
    );
    if (
        insertEl &&
        document.querySelector(
            ".treasureMapRootView-header-navigation-item.tasks.active" // On "Active Maps"
        )
    ) {
        insertEl.insertAdjacentElement("afterbegin", highlightDiv);
        insertEl.insertAdjacentElement("afterbegin", masterDiv);
    }

    var canvas = [];
    var div = document.getElementsByClassName("treasureMapView-hunter-wrapper mousehuntTooltipParent");

    if (displayHunterCheese) {
        for (var i=0; i<div.length; i++){
            canvas[i] = document.createElement('canvas');
            canvas[i].id = "hunter-canvas";
            canvas[i].style = "; bottom: 0px; left: 0px; position: absolute; width: 15px; height: 15px; background: " + hunterColor[i] + "; border: 1px solid black";
            div[i].appendChild(canvas[i]);
        }
    }

    // "Goals" button
    document.querySelector("[data-type='show_goals']").onclick = function () {
        colorize();
    };

    if (assignBaitChange) {
        // Avoid assigning the event more than once.
        assignBaitChange = false;
        for (let i = 0; i < allMiceGroups.length; i++) {
            //Warden added this (waves)
            $(document).on('click', '.' + allMiceGroups[i].name + 'Span', function() {
                hg.utils.TrapControl.setBait(allMiceGroups[i].baitId).go();
            });
        }
    }
}

// Listen to XHRs, opening a map always at least triggers board.php
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
        const chestEl = document.querySelector(
            ".treasureMapView-mapMenu-rewardName"
        );

        if (chestEl) {
            const chestName = chestEl.textContent;
            if (
                chestName && chestKeywords.some(v => chestName.includes(v))
            ) {
                initialise();
                if (displayHunterCheese) {
                    hunterColorize();
                }
                colorize();
            }
        }
    });
    originalOpen.apply(this, arguments);
};

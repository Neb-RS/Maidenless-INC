// ==UserScript==
// @name FLRT Tool
// @version 0.0.4
// @description Free Leech Return Tradebles
// @author Maidenless
// @match https://www.mousehuntgame.com/*
// @match https://apps.facebook.com/mousehunt/*
// @icon https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant none
// @namespace https://greasyfork.org/users/748165
// ==/UserScript==

//Inject touchpoint
$(document).ready(function() {
    addTouchPoint();
});

function addTouchPoint() {
    if ($('.Mi-flrt').length == 0) {
        const injectLocation =  $(".inventory .treasure_chests") ;
        const flrtTP = document.createElement('li');
        flrtTP.classList.add('flrt_tool');
        const flrtBtn = document.createElement('a');
        flrtBtn.innerText = "FLRT Tool";
        flrtBtn.onclick = function () {
            //Render the flrt tool box
            render();
        };

        //Icon
        const icon = document.createElement("div");
        icon.className = "icon";
        flrtBtn.appendChild(icon);
        flrtTP.appendChild(flrtBtn);
        $(flrtTP).insertAfter(injectLocation);
    }
}

//Rendering the tool box
function render(){
    document
    .querySelectorAll("flrt-tool-box")
    .forEach(el =>el.remove())

    const div = document.createElement("div");
    div.id = "flrt-tool-box"
    div.style.backgroundColor = "#F5F5F5";
    div.style.position = "fixed";
    div.style.zIndex = "9999";
    div.style.left = "35vw";
    div.style.top = "20vh";
    div.style.border = "solid 3px #696969";
    div.style.borderRadius = "20px";
    div.style.padding = "10px";
    div.style.textAlign = "center";
    div.style.fontSize = "12px"

    //Header (close button)----------------------------------------------------------------------
    const toolHeader = document.createElement("div");
    toolHeader.className = "flrt-tool-header";
    toolHeader.textContent = "FLRT Tool"
    toolHeader.style.height = "21px";
    toolHeader.style.textAlign = "Left";
    toolHeader.style.marginLeft = "17px";
    toolHeader.style.fontWeight = "bold";
    toolHeader.style.cursor = "FLRT Tool Menu"

    //Close button
    const closeButton = document.createElement("button", {
        id: "close-button"
    });
    closeButton.textContent = "x"
    closeButton.style.marginLeft = "5px"
    closeButton.style.cursor = "pointer"
    closeButton.onclick = function () {
        document.body.removeChild(div); 
    }

    toolHeader.appendChild(closeButton);
    div.appendChild(toolHeader);


    //Content (Map + Hunter Id OR Friend Id)---------------------------------------------------------
    const toolContent = document.createElement("div");
    toolContent.id = "flrt-tool-content"

    //Content Table
    const contentTable = document.createElement("table");
    contentTable.id = "flrt-tool-table";
    table.style.textAlign = "left";
    table.style.borderSpacing = "1em 0";

    //Content 1 : Map
    const map_row = document.createElement("tr");
    const map_td1 = document.createElement("td");
    map_td1.style.textAlign = "right";
    const map_td2 = document.createElement("td");

    const map_label = document.createElement("label");
    map_label.innerText = "Map: ";
    map_td1.appendChild(map_label);

    //Map functions
    var treasureChestsList = {}
    //Gets list of treasure chests
    console.log("Accessing all treasure chests in Inventory")
    postReq("https://www.mousehuntgame.com/managers/ajax/pages/page.php",
    `sn=Hitgrab&hg_is_ajax=1&page_class=Inventory&page_arguments%5Btab%5D=special&page_arguments%5Bsub_tab%5D=all&page_arguments%5Btag%5D=treasure_chests&last_read_journal_entry_id=${LastReadJournalEntryId}&uh=${user.unique_hash}`
    ). then(res =>{
        try{
            var response = JSON.parse(res.responseText);
            //Treasure chests directory
            treasureChestsList = response.page.tabs[4].subtags[0].tags[8].items
            //Loops all treasure chests in inventory
            for (var i=0; i<treasureChestsList.length; i++){
                var chestName = treasureChestsList[i].name;
                var chestType = treasureChestsList[i].chestType
                treasureChestsList[chestName] = chestType;
            }
        } catch (error){
            console.log(error)
        }
    })
    //Renders all treasure chests as OPTION type
    const map_select = document.createElement("select");
    map_select.style.wifth = "103px";
    for (let mapName in treasureChestsList){
        var option = document.createElement("OPTION");
        option.innerText = mapName;
        map_select.appendChild(option); 
    }

    //Resume map appendment 
    map_td2.appendChild(map_select);
    map_row.appendChild(map_td1);
    map_row.appendChild(map_td2);
    contentTable.appendChild(map_row);
    toolContent.appendChild(contentTable);
    div.appendChild(toolContent);
}

function postReq(url, form) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          resolve(this);
        }
      };
      xhr.onerror = function () {
        reject(this);
      };
      xhr.send(form);
    });
}

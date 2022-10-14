// ==UserScript==
// @name FLRT Tool
// @version 1.0.2
// @description Free Leech Return Tradables
// @author Maidenless
// @match https://www.mousehuntgame.com/*
// @match https://apps.facebook.com/mousehunt/*
// @resource     https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @icon https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace https://greasyfork.org/users/748165
// ==/UserScript==

//Inject touchpoint
$(document).ready(function(){
    addTouchPoint()
});

//Universal ley-value pairs for multiple operations
//Chest Name : Chest Type
var treasureChestsPair = {};
//Friend Data Directory
var friendData;
//Friend Name : Friend Snuid
var friendList = {};
//id to perform operation on
var sendSnuid;
var sendHID;
//chest to open
var chestSelected;
//item from chests
var itemAll = [];

function addTouchPoint() {
    if ($('.Mi-flrt').length == 0) {
        const injectLocation = $(".inventory .treasure_chests") ;
        const flrtTP = document.createElement('li');
        flrtTP.classList.add('flrt_tool');
        const flrtBtn = document.createElement('a');
        flrtBtn.innerText = "FLRT Tool";
        flrtBtn.onclick = async () =>{

            //Gets all the treasure chests in inventory
            var promise = await getTreasureLists();
            render (promise);
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
function render(treasureChestsList){

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

    //Close button
    const btnDiv = document.createElement("div");
    const closeButton = document.createElement("button", {
        id: "close-button"
    });
    closeButton.textContent = "x"
    closeButton.style.marginLeft = "5px"
    closeButton.style.cursor = "pointer"
    closeButton.onclick = function () {
        document.body.removeChild(div); 
    }
    btnDiv.appendChild(closeButton);
    div.appendChild(btnDiv);


    //Header ----------------------------------------------------------------------
    const toolHeader = document.createElement("div");
    toolHeader.className = "flrt-tool-header";
    toolHeader.textContent = "FLRT Tool"
    toolHeader.style.height = "21px";
    toolHeader.style.textAlign = "Left";
    toolHeader.style.marginLeft = "17px";
    toolHeader.style.fontWeight = "bold";
    toolHeader.style.cursor = "FLRT Tool Menu"

    div.appendChild(toolHeader);


    //Content (Map + Hunter Id OR Friend Id)---------------------------------------------------------
    const toolContent = document.createElement("div");
    toolContent.id = "flrt-tool-content"

    //Content Table
    const contentTable = document.createElement("table");
    contentTable.id = "flrt-tool-table";
    contentTable.style.textAlign = "left";
    contentTable.style.borderSpacing = "1em 0";

                                            //Content 1 : Map
    const map_row = document.createElement("tr");
    const map_td1 = document.createElement("td");
    map_td1.style.textAlign = "right";
    const map_td2 = document.createElement("td");

    const map_label = document.createElement("label");
    map_label.innerText = "Chest: ";
    map_td1.appendChild(map_label);

    //Map functions
    //Renders all treasure chests as OPTION type
    const map_select = document.createElement("select");
    map_select.style.width = "169px";
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

                                        //Content 2: Hunter Id and Friend ID
    //Hunter Id*****************************
    const hid_row = document.createElement("tr");
    const hid_td1 = document.createElement("td");
    const hid_td2 = document.createElement("td");

    const hid_radio = document.createElement("input");
    hid_radio.type = "radio";
    hid_radio.name = "mi-hunter-friend";
    hid_radio.id = "mi-hunter-radio";
    hid_radio.style.verticalAlign = "middle";
    hid_radio.style.marginTop = "-2px";
    hid_radio.checked = true;
    //Processes friend list from server if clicked on the radio button
    hid_radio.onchange = function(){
        processRadio()
    }
    hid_td1.appendChild(hid_radio);
    const hid_label = document.createElement("label");
    hid_label.innerHTML = "Hunter ID: ";
    hid_label.htmlFor = "mi-radio-friend"
    hid_td1.appendChild(hid_label);

    const hid_input = document.createElement("input");
    hid_input.type = "text";
    hid_input.id = "chro-hid-input"
    //hid_input.size = "10";
    hid_input.style.placeholder = "12131415"
    hid_td2.appendChild(hid_input);

    //Appendment for HID
    hid_row.appendChild(hid_td1);
    hid_row.appendChild(hid_td2);
    contentTable.appendChild(hid_row);

    //Friend ID********************
    const friend_row = document.createElement("tr");
    const friend_td1 = document.createElement("td");
    friend_td1.style.textAlign = "right"
    const friend_td2 = document.createElement("td");

    const friend_radio = document.createElement("input");
    friend_radio.type = "radio";
    friend_radio.name = "mi-hunter-friend";
    friend_radio.id = "mi-friend-radio";
    friend_radio.style.verticalAlign = "middle";
    friend_radio.style.marginTop = "-2px";
    friend_radio.style.position = "relative";
    friend_radio.style.right = "17.5px";
    friend_radio.onchange = function(){
        processRadio();
    }
    friend_td1.appendChild(friend_radio);

    const friend_label = document.createElement('label');
    friend_label.innerHTML = "Friend:";
    friend_label.htmlFor = "mi-radio-friend";
    friend_td1.appendChild(friend_label);
    
    const friend_input = document.createElement("input");
    friend_input.type = "text";
    friend_input.id = "friend-input-id";
    friend_input.disabled = true;
    //friend_input.size ="10"
    friend_td2.appendChild(friend_input);

    //Appendment for Friend ID
    friend_row.appendChild(friend_td1);
    friend_row.appendChild(friend_td2);
    contentTable.appendChild(friend_row);

    //Radio function
    async function processRadio() {
        //Allows only 1 radio to be clicked
        if (hid_radio.checked) {
            hid_input.disabled = false;
            friend_input.disabled = true;
            friend_input.value = ""
        } else if (friend_radio.checked) {
            hid_input.disabled = true;
            friend_input.disabled = false;
            hid_input.value = ""
            //Gets the friend ID from server
            var list = await getFriendID();
            $("#friend-input-id").autocomplete({
                source: Object.keys(list),
                open: function(){
                    setTimeout(function () {
                        $('.ui-autocomplete').css('z-index', 99999999999999);
                    }, 0);
                }
            });
        }
    }
    toolContent.appendChild(contentTable);

                                    //Content 3: Confirm button
    const contentAction = document.createElement("div");
    contentAction.className = "mi-action-div";

    //Confirm button
    const cfmBtn = document.createElement("button");
    cfmBtn.id = "mi-cfm-btn";
    cfmBtn.textContent = "Open Chest";
    cfmBtn.style.cursor = "pointer";
    cfmBtn.style.marginTop = "10px";
    //ID that the items will be sent to + map that will be opened
    cfmBtn.onclick = async function(){
        if (hid_input.disabled){
            sendSnuid = friendList[friend_input.value];
            sendHID = friendData[sendSnuid].user_id;
        } else {
            sendHID = hid_input.value
        }
        console.log("Entered Hunter ID is " + sendHID)
        chestSelected = treasureChestsPair[map_select.value];
        //Open the chest and record the contents
        await openChest(chestSelected)
        .then(async res =>{
            //Check which item is tradable
            tradability = await checkTradable(res)
            .then(async res=>{
                createLootTable(res);
            })
        })
    }
    contentAction.appendChild(cfmBtn);

    toolContent.appendChild(contentAction);


    //Final appendments--------------------------------------------------------------
    div.appendChild(toolContent);
    document.body.appendChild(div);
    dragElement(div,toolHeader);
}

//Gets Friend IDs from server
function getFriendID(){
    console.log("Getting Friend ID")
    return new Promise((resolve, reject) => {
        postReq("https://www.mousehuntgame.com/managers/ajax/users/userData.php",
                `sn=Hitgrab&hg_is_ajax=1&uh=${user.unique_hash}&get_friends=true`
               ).then(res=>{
            try{
                var data = JSON.parse(res.responseText);
                if(data.user_data){
                    friendData = data.user_data;
                    console.log(friendData)
                    var snuidList = Object.keys(data.user_data);
                    //Loop through snuid lists
                    for (var i=0;i<snuidList.length;i++){
                        var name = friendData[snuidList[i]].name;
                        friendList[name] = snuidList[i];
                    }
                    console.log("Obtained friend snuid and names")
                }
                console.log("FriendList generated")
                console.log(friendList);
                resolve(friendList);
            } catch(error){
                alert("Error getting friends! Please contact Chromatical on Discord");
                console.log(error)
            }
        })
    })
}


//Gets the List of Treasure Chests from inventory
function getTreasureLists(){
    return new Promise((resolve,reject) =>{
        console.log("Accessing all treasure chests in Inventory");
        postReq ("https://www.mousehuntgame.com/managers/ajax/pages/page.php",
        `spostReqn=Hitgrab&hg_is_ajax=1&page_class=Inventory&page_arguments%5Btab%5D=special&page_arguments%5Bsub_tab%5D=all&page_arguments%5Btag%5D=treasure_chests&last_read_journal_entry_id=${lastReadJournalEntryId}&uh=${user.unique_hash}`
        ). then(res =>{
            try{
                 var response = JSON.parse(res.responseText);
                 //subtab directory 
                 const subDirect = response.page.tabs[4].subtabs[0].tags
                 var treasureChestIndex = subDirect.findIndex(item=> item.name == "Treasure Chests");
                 //Treasure chests directory
                 var treasureChestsList = subDirect[treasureChestIndex].items
                     //var treasureChestsList = response.page.tabs[4].subtabs[0].tags[8].items
                 //Remove last element that is a CSS formatting
                 treasureChestsList.pop();
                 //Loops all treasure chests in inventory
                //var treasureChestsPair ={};
                for (var i=0; i<treasureChestsList.length; i++){
                    var chestName = treasureChestsList[i].name;
                    var chestType = treasureChestsList[i].type;
                    treasureChestsPair[chestName] = chestType;
                }
                console.log(treasureChestsPair);
                console.log("Obtained treasure chests data");
                resolve (treasureChestsPair);
            } catch (error){
                console.log(error)
            }   
        })
    })
}

//Opens Chests
function openChest(chest){
    return new Promise((resolve,reject)=>{
        console.log("Opening chest")
        itemAll = [];
        postReq("https://www.mousehuntgame.com/managers/ajax/users/useconvertible.php",
        `sn=Hitgrab&hg_is_ajax=1&item_type=${chest}&item_qty=1&uh=${user.unique_hash}`
        ).then(res =>{
            try{
                var response = JSON.parse(res.responseText);
                var itemData = response.convertible_open.items
                //loop through item
                for (var i=0;i<itemData.length;i++){
                    itemAll.push(itemData[i])
                }
                console.log("Chest contents recorded")
                console.log(itemAll)
                resolve(itemAll);
            } catch (error){
                console.log(error);
            }
        })   
    })
}

//Checks whether items are tradable or not and adds a property value isTradable
function checkTradable(itemAll){
    console.log("Checking tradbility of contents")
    return new Promise(async (resolve,reject)=>{
        for (var i=0;i<itemAll.length;i++){
            await postReq("https://www.mousehuntgame.com/managers/ajax/users/userInventory.php",
            `sn=Hitgrab&hg_is_ajax=1&item_types%5B%5D=${itemAll[i].type}&action=get_items&uh=${user.unique_hash}`)
            .then(res=>{
                try{
                    var response = JSON.parse(res.responseText);
                    //Adds property value isTradable
                    if (response.items[0].is_givable == true || response.items[0].is_tradable == true){
                        itemAll[i].isTradable = true;
                    } else {
                        itemAll[i].isTradable = false;
                    }
                } catch (error){
                    console.log(error);
                };
            })
        }
        console.log(itemAll);
        console.log("Property isTradable added to tradable items")
        resolve(itemAll);
    })
}

//Creates two tables, one tradable one untradable
function createLootTable(itemAll){
    //Remove any existing tables
    console.log("Creating loot table")
    document
    .querySelectorAll("#mi-loot-table-div")
    .forEach(el=>el.remove())

    const lootTableDiv = document.createElement("div");
    lootTableDiv.id = ("mi-loot-table-div");
    lootTableDiv.style.backgroundColor = "#F5F5F5";
    lootTableDiv.style.position = "fixed";
    lootTableDiv.style.zIndex = "9999";
    lootTableDiv.style.left = "18vw";
    lootTableDiv.style.top = "20vh";
    lootTableDiv.style.border = "solid 2px #696969";
    lootTableDiv.style.borderRadius = "20px";
    lootTableDiv.style.padding = "10px";
    lootTableDiv.style.textAlign = "center";
    lootTableDiv.style.fontSize = "12px";

    //Close button
    const closeHeader = document.createElement("div");
    const closeButton = document.createElement("button", {
        id: "close-button"
    });
    closeButton.textContent = "x"
    closeButton.style.marginLeft = "5px"
    closeButton.style.cursor = "pointer"
    closeButton.onclick = function () {
        document.body.removeChild(lootTableDiv); 
    }
    //Append close button
    closeHeader.appendChild(closeButton);
    lootTableDiv.appendChild(closeHeader);
    
    //Tradable Division----------------------------------------------
    const tradeDiv = document.createElement("div");
    const tradeHeader = document.createElement("div")
    tradeHeader.innerText = "Tradables"
    tradeHeader.style.fontWeight = "bold";
    tradeHeader.style.paddingTop = "4px";

    //append
    tradeDiv.appendChild(tradeHeader);

    //Table for tradables
    const tableTradable = document.createElement("table");
    tableTradable.id = "tradable-table"
    tableTradable.style.borderSpacing = "1em 6px";
    tableTradable.style.borderCollapse = "collapse";
    //Heading 1: Checkbox
    const tradableItemCheckbox = document.createElement("th");
    tradableItemCheckbox.name = "tradable-table-tem-checkbox";
    //Heading 1: Items
    const tradableItemHeading = document.createElement("th");
    tradableItemHeading.id = "tradable-table-item-heading";
    tradableItemHeading.innerText = "Item"
    tradableItemHeading.style.fontWeight = "bold";
    tradableItemHeading.style.textAlign = "centre";
    tradableItemHeading.style.backgroundColor = "#eaeef0";
    tradableItemHeading.style.padding = "3px";
    tradableItemHeading.style.paddingTop = "3px";
    tradableItemHeading.style.paddingBottom = "3px";
    tradableItemHeading.style.border = "0.5px solid #696969";
    tradableItemHeading.style.width = "100px";
    tradableItemHeading.style.textAlign = "center"
    //Heading 2: Quantity
    const tradableItemQuantity = document.createElement("th")
    tradableItemQuantity.id = "tradable-table-quantity-heading";
    tradableItemQuantity.innerText = "Quantity"
    tradableItemQuantity.style.fontWeight = "bold";
    tradableItemQuantity.style.textAlign = "centre";
    tradableItemQuantity.style.backgroundColor = "#eaeef0";
    tradableItemQuantity.style.padding = "3px";
    tradableItemQuantity.style.paddingTop = "3px";
    tradableItemQuantity.style.paddingBottom = "3px";
    tradableItemQuantity.style.border = "0.5px solid #696969";
    //Append
    tableTradable.appendChild(tradableItemCheckbox);
    tableTradable.appendChild(tradableItemHeading);
    tableTradable.appendChild(tradableItemQuantity);

    //Body for Tradables
    const tradableTableBody = document.createElement("tbody");
    //j for css purposes
    var j = 0
    //Body Data - Loop items which has 'isTradable' property from LootAll
    for (var i=0;i<itemAll.length;i++){
        if (itemAll[i].isTradable == true){
            var tableRow = document.createElement("tr");
            tableRow.id = "tradable-table-row-" + j
            //Checkbox
            const itemCheckBoxTd = document.createElement("td");
            const itemCheckBox = document.createElement("input");
            itemCheckBox.type = "checkbox";
            itemCheckBox.className = "mi-tradable-item";
            itemCheckBox.name = "mi-tradable-item" + j;       
            itemCheckBox.style.verticalAlign = "middle";
            itemCheckBox.style.marginTop = "-2px";
            itemCheckBox.checked = true;
            itemCheckBoxTd.appendChild(itemCheckBox);
            //Data - Label
            const itemDataTd = document.createElement("td");
            var itemData = document.createElement("label")
            itemData.innerHTML = itemAll[i].name
            itemData.htmlFor = "mi-tradable-item" + j  
            itemDataTd.style.textAlign = "center";
            itemDataTd.style.border = "0.5px solid #696969"
            itemDataTd.style.padding = "3px";
            itemDataTd.appendChild(itemData);
            //Quantity
            var itemQuantity = document.createElement("td");
            itemQuantity.innerText = itemAll[i].quantity;
            itemQuantity.style.textAlign = "center";
            itemQuantity.style.border = "0.5px solid #696969"
            itemQuantity.style.padding = "3px";
            //CSS 
            if (j%2 == 0){
                tableRow.style.backgroundColor = "white"
            }
            //Append
            tableRow.appendChild(itemCheckBoxTd);
            tableRow.appendChild(itemDataTd);
            tableRow.appendChild(itemQuantity);

            tradableTableBody.appendChild(tableRow);

            j++;
        }
    }

    //Final append for tradables
    tableTradable.appendChild(tradableTableBody)
    tradeDiv.appendChild(tableTradable);
    lootTableDiv.appendChild(tradeDiv);


    //Untradebles---------------------------------------
    const untradeDiv = document.createElement("div");
    untradeDiv.style.paddingTop = "10px"
    const untradeHeader = tradeHeader.cloneNode();
    untradeHeader.innerText = "Untradables"
    //append
    untradeDiv.appendChild(untradeHeader); 

    //Table for untradables
    const tableUntradable = tableTradable.cloneNode();
    tableUntradable.id = "untradable-table"
    tableUntradable.style.marginLeft = "20px"

    //Instead of 3 table headings, only 2 because no need checkbox
    //Item
    const untradableItemHeading = tradableItemHeading.cloneNode()
    untradableItemHeading.innerText = "Item";
    untradableItemHeading.id = "untradable-table-item-heading";
    //Quantity
    const untradableItemQuantity = tradableItemQuantity.cloneNode();
    untradableItemQuantity.innerText = "Quantity";
    untradableItemQuantity.id = "untradable-table-quantity-heading";
    //Append 
    tableUntradable.appendChild(untradableItemHeading);
    tableUntradable.appendChild(untradableItemQuantity);

    //Body for Tradables
    const untradableTableBody = document.createElement("tbody");
    //j for css purposes
    j = 0
    //Body Data - Loop items which has 'isTradable' property == null from LootAll
    for (var i=0;i<itemAll.length;i++){
        if (itemAll[i].isTradable == false){
            var tableRow = document.createElement("tr");
            tableRow.id = "untradable-table-row-" + j
            //Data
            var itemData = document.createElement("td")
            itemData.innerText = itemAll[i].name;
            itemData.style.textAlign = "right";
            itemData.style.border = "0.5px solid #696969"
            itemData.style.padding = "3px";
            itemData.style.textAlign = "center";
            //Quantity
            var itemQuantity = document.createElement("td");
            itemQuantity.innerText = itemAll[i].quantity;
            itemQuantity.style.textAlign = "right";
            itemQuantity.style.border = "0.5px solid #696969"
            itemQuantity.style.padding = "3px";
            itemQuantity.style.textAlign = "center";
            //CSS 
            if (j%2 == 0){
                tableRow.style.backgroundColor = "white"
            }
            //Append
            tableRow.appendChild(itemData);
            tableRow.appendChild(itemQuantity);
            untradableTableBody.appendChild(tableRow);

            j++;
        }

    }
    //Final append for Untradables
    tableUntradable.appendChild(untradableTableBody)
    untradeDiv.appendChild(tableUntradable);
    lootTableDiv.appendChild(untradeDiv);

    //Confirm button
    const cfmBtn = document.createElement("button");
    cfmBtn.id = "mi-item-cfm-btn";
    cfmBtn.textContent = "Send Selected Items";
    cfmBtn.style.cursor = "pointer";
    cfmBtn.style.marginTop = "10px";
    //Generates the intended recipient's profile
    cfmBtn.onclick = async function(){
        //Creates a List that lists down items that are checked
        var checkList = [];
        //Gets the list of tradables which are checked
        var toCheckList = $(".mi-tradable-item")
        for (var i=0;i<toCheckList.length;i++){
            if (toCheckList[i].checked == true){
                //Adds Item to List
                var item = $(".mi-tradable-item")[i].parentNode.nextSibling.firstChild.innerText
                checkList.push(item);
            }
        }
        console.log("Recorded items are checked")
        console.log(checkList);
        //Creates a new Division to confirm sending
        createConfirmBox(checkList);
    }
    //Append
    lootTableDiv.appendChild(cfmBtn);

    //Final Append
    document.body.appendChild(lootTableDiv);
    dragElement(lootTableDiv,tradeDiv);
}

//Confirm Box after clicking "Send Selected Items"
async function createConfirmBox(checkList){
    //Generate Recipient Profile
    await getProfile(sendHID)
    .then(res =>{

        //Create Div 
        const sendDiv = document.createElement("div");
        sendDiv.id = ("mi-send-div");
        sendDiv.style.backgroundColor = "#F5F5F5";
        sendDiv.style.position = "fixed";
        sendDiv.style.zIndex = "9999";
        sendDiv.style.left = "18vw";
        sendDiv.style.top = "20vh";
        sendDiv.style.border = "solid 2px #696969";
        sendDiv.style.borderRadius = "20px";
        sendDiv.style.padding = "10px";
        sendDiv.style.textAlign = "center";
        sendDiv.style.fontSize = "12px";

        //Close button
        const buttonDiv = document.createElement("div");
        const closeButton = document.createElement("button", {
            id: "close-button"
        });
        closeButton.textContent = "x"
        closeButton.style.marginLeft = "5px"
        closeButton.style.cursor = "pointer"
        closeButton.onclick = function () {
            document.body.removeChild(sendDiv); 
        }
        buttonDiv.appendChild(closeButton)
        sendDiv.appendChild(buttonDiv);

        //Image of recipient
        const image = document.createElement("img");
        image.style.width = "40px";
        image.style.height = "40px";
        image.src = res.profile_pic;
        image.style.paddingTop = "10px";
        //Append
        sendDiv.appendChild(image);
    
        //Create another table LOL
        const profileTable = document.createElement("table");
        profileTable.style.borderSpacing = "1em 2px"

        //Row 1: Name
        const nameRow = document.createElement("tr");
        const nameTitle = document.createElement("td");
        nameTitle.innerText = "Name:";
        nameTitle.style.textAlign = "right";
        const nameData = document.createElement("td");
        nameData.innerText = res.name;
        nameRow.appendChild(nameTitle);
        nameRow.appendChild(nameData);
        profileTable.appendChild(nameRow);

        //Row 2: Title
        const rankRow = document.createElement("tr");
        const rankTitle = document.createElement("td");
        rankTitle.innerText = "Title:";
        rankTitle.style.textAlign = "right";
        const rankData = document.createElement("td");
        rankData.innerText = res.rank;
        rankRow.appendChild(rankTitle);
        rankRow.appendChild(rankData);
        profileTable.appendChild(rankRow);
        
        //Row 3: Location
        const locationRow = document.createElement("tr");
        const locationTitle = document.createElement("td");
        locationTitle.innerText = "Location:";
        locationTitle.style.textAlign = "right";
        const locationData = document.createElement("td");
        locationData.innerText = res.location;
        locationRow.appendChild(locationTitle);
        locationRow.appendChild(locationData);
        profileTable.appendChild(locationRow);

        sendDiv.appendChild(profileTable);

        //Confirm button
        const cfmBtn = document.createElement("button");
        cfmBtn.id = "mi-item-cfm-btn";
        cfmBtn.textContent = "Confirm";
        cfmBtn.style.cursor = "pointer";
        cfmBtn.style.marginTop = "10px";
        cfmBtn.onclick =async function(){
            await sendItems(checkList)
            .then(res =>{
                $("#mi-loot-table-div")[0].remove();
                sendDiv.remove();
                alert("All Items Sent!");
            })
        } 

        sendDiv.appendChild(cfmBtn);

        //Append
        document.body.appendChild(sendDiv);
        dragElement(sendDiv,buttonDiv)
    })

}

function getProfile(sendHID){
    console.log("Finding Recipient Profile")
    return new Promise((resolve,reject)=>{
        postReq("https://www.mousehuntgame.com/managers/ajax/pages/friends.php",
        `sn=Hitgrab&hg_is_ajax=1&action=community_search_by_id&user_id=${sendHID}&uh=${user.unique_hash}`
        ).then(async res =>{
            try{
                var response = JSON.parse(res.responseText);
                if (response){
                    sendSnuid = response.friend.sn_user_id;
                    console.log("SNUID obtained from HID is " + sendSnuid);
                    await postReq("https://www.mousehuntgame.com/managers/ajax/pages/page.php",
                    `sn=Hitgrab&hg_is_ajax=1&page_class=HunterProfile&page_arguments%5Bsnuid%5D=${sendSnuid}&last_read_journal_entry_id=${lastReadJournalEntryId}&uh=${user.unique_hash}`
                     ).then(res =>{
                         try{
                            var response = JSON.parse(res.responseText);
                            if (response){
                                //Gets recipeint data
                                var user_page = response.page.tabs.profile.subtabs[0];
                                var user_name = user_page.name;
                                var user_id = user_page.user_id;
                                var user_rank = user_page.title_name;
                                var user_gold = user_page.gold_formatted; 
                                var user_location = user_page.environment_name;
                                var user_profile_pic = user_page.profile_pic;

                                var recipient_data = {}
                                recipient_data.name = user_name;
                                recipient_data.id = user_id;
                                recipient_data.rank = user_rank;
                                recipient_data.gold = user_gold;
                                recipient_data.location = user_location;
                                recipient_data.profile_pic = user_profile_pic;

                                console.log("Generating Recipient Data")
                                console.log(recipient_data);
                                resolve(recipient_data)
                            }  
                        } catch (error){
                            console.log(error)
                        }
                    })
                    resolve(sendSnuid)
                }
            } catch (error){
                console.log(error)
            }
        })
    })
}

function sendItems(checkList){
    console.log("Sending items")
    return new Promise(async (resolve,reject)=>{
        for (var i=0;i<checkList.length;i++){
            var index = itemAll.findIndex(item => item.name === checkList[i])
            var item_quantity = itemAll[index].quantity
            var item_type = itemAll[index].type;
            await postReq("https://www.mousehuntgame.com/managers/ajax/users/supplytransfer.php",
            `sn=Hitgrab&hg_is_ajax=1&receiver=${sendSnuid}&uh=${user.unique_hash}&item=${item_type}&item_quantity=${item_quantity}`
            ).then(res =>{
                try{
                    var response = JSON.parse(res.responseText);
                    if (response.success == "1"){
                        console.log("Sent +" + item_quantity + ' ' + checkList[i]);
                    } else {
                        console.log("Failed to send " + checkList[i])
                    }
                } catch (error) {
                    console.log(error);
                }
            })
        }
        resolve()
    })
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

function dragElement(elmnt,dragEl) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    /*if (elmnt.firstElementChild) {
      // if present, the header is where you move the DIV from:
     elmnt.firstElementChild.onmousedown = dragMouseDown;
    } else {*/
      // otherwise, move the DIV from anywhere inside the DIV:
      dragEl.onmousedown = dragMouseDown;
    //}
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
}
// ==UserScript==
// @name MH - Quick Travel Tool 2
// @version 0.0.1
// @description Travel in a few clicks!
// @author Maidenless
// @match https://www.mousehuntgame.com/*
// @match https://apps.facebook.com/mousehunt/*
// @resource     https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @icon https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace https://greasyfork.org/users/748165
// ==/UserScript==

$(document).ready(function(){
    addTouchPoint()
})
//Universal variable
var location_data;

function addTouchPoint() {
    if ($('.Mi-quick travel').length == 0) {
        const injectLocation = $(".travel")[0] ;
        const travelChild = document.createElement("ul")
        const travelTP = document.createElement('li');
        travelTP.classList.add('quick-travel-tool');
        const travelBtn = document.createElement('a');
        travelBtn.innerText = "Quick Travel 2";
        travelBtn.onclick = async () =>{
            //Gets all the travel locations
            await getLocation()
            .then(res=>{
                render(res);
            })
        };

        //Icon
        const icon = document.createElement("div");
        icon.className = "icon";
        icon.src = ('https://www.mousehuntgame.com/images/ui/hud/menu/travel.png?asset_cache_version=2')
        travelBtn.appendChild(icon);
        travelTP.appendChild(travelBtn);
        travelChild.appendChild(travelTP);
        injectLocation.insertAdjacentElement("beforeend",travelChild);
    }
}

function render(location_data){
    const div = document.createElement("div");
    div.id = "quick-travel-tool-box"
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

    //Header
    const toolHeader = document.createElement("div");
    toolHeader.className = "flrt-tool-header";
    toolHeader.textContent = "Quick Travel Tool"
    toolHeader.style.height = "21px";
    toolHeader.style.textAlign = "Left";
    toolHeader.style.marginLeft = "17px";
    toolHeader.style.fontWeight = "bold";
    toolHeader.style.cursor = "Quick Travel Tool"
    div.appendChild(toolHeader);

    //Body
    const toolBody = document.createElement("div");
    toolBody.id = "quick-travel-tool-body"

    //Table
    //Row 1: Location pick
    const table1 = document.createElement("table");
    const t1r1 = document.createElement("tr");
    const t1r1_td1 = document.createElement("td");
    //Radop
    const t1r1_radio = document.createElement("input");
    t1r1_radio.type = "radio";
    t1r1_radio.name = "location-radio";
    t1r1_radio.id = "location-radio";
    t1r1_radio.style.verticalAlign = "middle";
    t1r1_radio.style.marginTop = "-2px";
    t1r1_radio.checked = true;
    t1r1_radio.onchange = function(){
        processRadio();
    }
    t1r1_td1.appendChild(t1r1_radio);
    //Label
    const t1r1_label = document.createElement("label");
    t1r1_label.innerText = "Location:"
    t1r1_label.htmlFor = ("location-radio");
    t1r1_td1.appendChild(t1r1_label);
    t1r1.appendChild(t1r1_td1);
    //Datalist
    const t1r1_td2 = document.createElement("td");
    const t1r1_input = document.createElement("datalist")
    t1r1_input.id = "location-list";
    for (var i=0; i<location_data.length;i++){
        const locationOption = document.createElement("option");
        locationOption.value = location_data[i].name;
        t1r1_input.appendChild(locationOption);
    }
    t1r1_td2.appendChild(t1r1_input);
    t1r1.appendChild(t1r1_td2)
    table1.appendChild(t1r1);
    
    //Row 2: Region pick
    const t1r2 = document.createElement("tr");
    const t1r2_td1 = document.createElement("td");
    //Radio
    const t1r2_radio = document.createElement("input");
    t1r2_radio.type = "radio";
    t1r2_radio.name = "location-radio";
    t1r2_radio.id = "location-radio";
    t1r2_radio.style.verticalAlign = "middle";
    t1r2_radio.style.marginTop = "-2px";
    t1r2_radio.checked = false;
    t1r2_radio.onchange = function(){
        processRadio();
    }
    t1r2_td1.appendChild(t1r2_radio);
    //Label
    const t1r2_label = document.createElement("label");
    t1r2_label.innerText = "Region:"
    t1r2_label.htmlFor = ("location-radio");
    t1r2_td1.appendChild(t1r2_label);
    t1r2.appendChild(t1r2_td1);
    //Datalist
    const t1r2_td2 = document.createElement("td");
    const t1r2_input = document.createElement("datalist")
    t1r2_input.className = "mi-region"
    t1r1_td2.appendChild(t1r2_input);
    t1r2.appendChild(t1r1_td2);
    table1.appendChild(t1r2);


    //Radio function
    async function processRadio() {
        //Allows only 1 radio to be clicked
        if (t1r1_radio.checked) {
            t1r1_td1.disabled = false;
            t1r2_input.disabled = true;
            t1r2_input.value = ""
        } else if (t1r2_radio.checked) {
            t1r1_td1.disabled = true;
            t1r2_input.disabled = false;
            t1r1_input.value = ""
            
            //Shows location regions
            var regionInjectionLocation = $(".mi-region")[0]
            for (var i=0;i<location_data[0].regions.length;i++){
                var location_region = document.createElement("option");
                location_region.innerText = location_data[0].regions[i].name
                regionInjectionLocation.appendChild(location_region);
            }
        }

    }



    //Final append
    toolBody.appendChild(table1);
    div.appendChild(toolBody);
    document.body.appendChild(div)


}

//Gets the data of location
function getLocation(){
    console.log("Getting loction data");
    return new Promise((resolve,reject)=>{
        postReq("https://www.mousehuntgame.com/managers/ajax/pages/page.php",
        `sn=Hitgrab&hg_is_ajax=1&page_class=Travel&last_read_journal_entry_id=${lastReadJournalEntryId}&uh=${user.unique_hash}`)
        .then(res=>{
            try{
                var data = JSON.parse(res.responseText);
                if (!data){
                return
                } else {
                    var location = data.page.tabs[0];
                    location_data = location;
                    resolve(location_data);
                }
            } catch (error){
                console.log(error)
            }
        })
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
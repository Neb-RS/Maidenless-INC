// ==UserScript==
// @name         MH - Uncaught Mice Display
// @version      1.0.4
// @description  Shows uncaught mice at any location
// @author       MI
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @namespace https://greasyfork.org/users/748165
// ==/UserScript==

$(document).ready(function(){
  if($(".campPage-trap-armedItemContainer")[0]){
     typeof $("#mi-uncaught-box")[0] == "object"? null : uncaughtBoxRender()
  }
})

//Renders the box
function uncaughtBoxRender(){
  var locationWrapper = $(".mousehuntHud-environmentIconWrapper")[0]

  //Box styles
  var uncaughtBtn = document.createElement("button");
  uncaughtBtn.className = "mi-uncaught-box";
  uncaughtBtn.style.position = "absolute";
  uncaughtBtn.style.width = "17px";
  uncaughtBtn.style.height = "17px";
  uncaughtBtn.style.borderRadius = "4px";
  uncaughtBtn.style.left = "1px";
  uncaughtBtn.style.bottom = "3px";
  uncaughtBtn.style.background = "#e5dac0";
  uncaughtBtn.style.borderColor = "#9f9171";

  //Button function --- 
  //Firstly calls for the locaiton informations
  uncaughtBtn.onclick = function(){
    console.log("Requesting Information of Location Mice from Server");
    postReq("https://www.mousehuntgame.com/managers/ajax/pages/page.php",
    `sn=Hitgrab&hg_is_ajax=1&page_class=HunterProfile&page_arguments%5Btab%5D=mice&page_arguments%5Bsub_tab%5D=location&last_read_journal_entry_id=${lastReadJournalEntryId}&uh=${user.unique_hash}`
    ). then(res =>{
      try{
        var response = JSON.parse(res.responseText);
        if (response){
          var miceListCategory = {}
          miceListCategory = response.page.tabs.mice.subtabs[1].mouseList.categories;
          console.log(miceList);
        }
      } catch (error){
        console.log(error)
      }
    })
  },
  

  locationWrapper.insertAdjacentElement("afterend",uncaughtBtn)

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
// ==UserScript==
// @name         Fresh Test
// @version      2.0.2
// @description  See and change charms on your bwrift HUD!
// @author       Chromatical
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @namespace https://greasyfork.org/users/748165
// ==/UserScript==

(function() {
    if (user.environment_name)
      render()
})();

//Adds a listener when you join a map
$(document).ajaxComplete(async(event,xhr,options) => {
    if (options.url == "https://www.mousehuntgame.com/managers/ajax/board/board.php"){
      //Checks for current map Id to compare with the saved map Id
      var currentMapId = user.quests.QuestRelicHunter.default_map_id
      var unparsedMapId = localStorage.getItem("Inc-map-id");
      var testMapId = JSON.parse(unparsedMapId);
      //Injection location
      var injectLocation = $(".treasureMapView-mapMenu-rewardName")[0].innerText
      //Newer if map newer
      if(testMapId != 0 && typeof(testMapId) !== undefined){
       if (currentMapId > testMapId){
          alert ("Map is Fresh")
       } else {
          injectLocation = injectLocation + " (Older)"
         alert ("Map is Not Fresh")
        }
      localStorage.setItem("Inc-map-id",0)
    }}
})

//Renders a box that says "Fresh Test"
function render(){
    const box = document.createElement("button");
    box.id = "freshtest";
    box.innerText = "Fresh Test";
    box.style.top = "389px";
    box.style.left = "690px";
    box.style.position = "absolute";
    box.onclick= function(){
      //Checks whether you have a map opened; rejects operation if there is one
      let myPromise = new Promise((resolve,reject) =>{
        user.quests.QuestRelicHunter.default_map_id == null? resolve(this) : reject (this)
      }).then(
        result => buyMap(),
        error => alert("User must not be in any maps for the freshness script to run")
      )
    };
    document.body.appendChild(box);
}

//Buys a map when you click on it
function buyMap(){
  //Buys a Gwania map
  postReq("https://www.mousehuntgame.com/managers/ajax/purchases/itempurchase.php",
          `sn=Hitgrab&hg_is_ajax=1&type=gnawnia_scroll_case_convertible&quantity=1&buy=1&is_kings_cart_item=0&environment_type=harbour&uh=${user.unique_hash}`
         ).then(function(){
    try {
      //Opens a Gwania map
      postReq("https://www.mousehuntgame.com/managers/ajax/users/useconvertible.php",
             `sn=Hitgrab&hg_is_ajax=1&item_type=gnawnia_scroll_case_convertible&item_qty=1&uh=${user.unique_hash}`
             ).then(res=>{
        try{
            var response = JSON.parse(res.responseText);
          //Parses the Map Id
          if(response){
            var unparsedTestMapId = JSON.parse(response.treasure_map);
            var TestMapId = unparsedTestMapId.map_id;
            //Sets the current ID to test
            localStorage.setItem("Inc-map-id",TestMapId);
            //Toss map after saving ID
            postReq("https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php",
                    `sn=Hitgrab&hg_is_ajax=1&action=discard&map_id=${TestMapId}&uh=${user.unique_hash}&last_read_journal_entry_id=${lastReadJournalEntryId}`
          ).then(function(){
              //Sets the comparison Id in local storage
              localStorage.setItem("IncMapId",TestMapId);
            alert("Current Map Id = "+ TestMapId +". Ready to check map freshness.")
          })}
        }catch (error){
          alert ("map open error");
          console.log(error);
        }
      })
    } catch (error){
      alert("Purchase unsuccessful!")
      console.log(error)
    }
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
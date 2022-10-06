// ==UserScript==
// @name         MH - Uncaught Mice Dispaly
// @version      1.0.2
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
  var locationWrapper = $("mousehuntHud-environmentIconWrapper")[0]

  //Box styles
  var uncaughtBtn = document.createElement("button");
  uncaughtBtn.style.backgroundSize = "30px"
  uncaughtBtn.className = "mi-uncaught-box";
  uncaughtBtn.style.position = "absolute";
  uncaughtBtn.style.width = "30px";
  uncaughtBtn.style.height = "30px";
  uncaughtBtn.style.borderRadius = "5px";

  locationWrapper.insertAdjacentElement("afterend",uncaughtBtn)




}
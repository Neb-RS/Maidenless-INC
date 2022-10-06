// ==UserScript==
// @name         MH - Uncaught Mice Dispaly
// @version      1.0.3
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

  locationWrapper.insertAdjacentElement("afterend",uncaughtBtn)




}
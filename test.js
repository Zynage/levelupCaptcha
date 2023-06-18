// ==UserScript==
// @name         Gen
// @version      1.0
// @match        https://zynage.github.io/levelupCaptcha/slow/*
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// ==/UserScript==
(function() {
  'use strict';




  
  function init(){
    hideCaptcha();
    var socket = new WebSocket("ws://localhost:8080/");
    socket.onopen = function () {
      console.log("Conexión establecida");
    
    
      setInterval(() => {
          const urlParams = new URLSearchParams(window.location.search);
              if (urlParams.has("token") && urlParams.get("token") !== "")
              {
                  //socket.send(urlParams.get("host") + "&" + urlParams.get("userAgent") + "&" + urlParams.get("token"));
                  socket.send("@captcha#"+ urlParams.get("token") +"#"+ urlParams.get("userAgent"));
                  console.log("@captcha#"+ urlParams.get("token") +"#"+ urlParams.get("userAgent"))
                  
                  hideCaptcha();

                  var url = new URL(window.location.href);
                  var urlParams2 = new URLSearchParams(url.search);
                  urlParams2.delete("token");
                  urlParams2.delete("userAgent")
                  urlParams2.delete("host")
                  var newUrl = url.origin + url.pathname + "?" + urlParams2.toString();
                  history.replaceState(null, "", newUrl);

                  location.reload();
              }
        }, 3000);
    
    };
    socket.onmessage = function (event) {
      console.log("Mensaje del servidor:", event.data);
    
      if(event.data == "@getCaptcha") {
        showCaptcha();
        console.log("Mostrando captcha para resolver.")
      }
    };
  }
  
  
  function showCaptcha() {
    var iframe = document.getElementsByClassName('h-captcha')[0];
    iframe.style.display = "block";
  }
  function hideCaptcha() {
    var iframe = document.getElementsByClassName('h-captcha')[0];
    iframe.style.display = "none";
  }
  
  var text = document.body.innerHTML;
  var text2 = text.split('\n')[0];
  
  if (text2.includes('502')) window.location.href = "https://zynage.github.io/levelupCaptcha/slow/";
  
  init();

})();



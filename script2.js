// ==UserScript==
// @name         BungeePort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Puente de conexión...
// @author       You
// @match        https://www.habbo.es/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=habbo.es
// @grant        GM_addElement
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(function () {
  "use strict";
  let interv;
  let inHome;
  let toast;
  let barrier;

  if (window.location == "https://www.habbo.es/settings/email") {
    setTimeout(() => {
      let newEmail = GM_getValue("newEmail");
      let email = GM_getValue("email");
      let pass = GM_getValue("pass");
      console.log("Inicia el cambio de email...", email);
      ChangeEmail(newEmail, pass);
    }, 2000);
  }

  function ChangeEmail(email, password) {

    $("#password-current").focus().val(password);
    var element = document.getElementById("password-current");
    var event = new Event("change", { bubbles: true });
    element.dispatchEvent(event);

    setTimeout(() => {
      $("#email-address").focus().val(email);
      var element = document.getElementById("email-address");
      var event = new Event("change", { bubbles: true });
      element.dispatchEvent(event);
    }, 250);

    interv = setInterval(() => {
      if (getAttr()) {
        console.log("Captcha resuelto!");
        $(".form__submit").trigger("click");
        hideCaptcha();
        clearInterval(interv);

        toast = setInterval(() => {
          if (checkToast()) {
            console.log("Email de verificación enviado...");
            socket.send("@emailChanged");
            clearInterval(toast);
          } else {
            console.log("Email de verif no enviado...");
          }
        }, 1000);
      } else {
        console.log("Captcha no resuelto...");
      }
    }, 1000);

  }

  var socket = new WebSocket("ws://localhost:8080/");
  socket.onopen = function () {
    console.log("Conexión establecida");
  };

  socket.onmessage = function (event) {
    console.log("Mensaje del servidor:", event.data);
    if (event.data.includes("@login")) {
      let credentiales = event.data.split("#")[1];
      console.log("ress", event.data);
      login(credentiales);
    }
    if (event.data.includes("@newEmail")) {
      let newEmail = event.data.split("#")[1];
      GM_setValue("newEmail", newEmail);
      window.location = "https://www.habbo.es/settings/email";
    }
    if (event.data.includes("@logout")) {
      console.log("Deslogeando la cuenta...");
      fetch("https://www.habbo.es/api/public/authentication/logout", {
        "referrer": "https://www.habbo.es/",
        "body": null,
        "method": "POST",
        "credentials": "include"
      });

      window.location = "https://www.habbo.es";
    }
  };

  socket.onerror = function (error) {
    console.error("Error:", error);
  };
  socket.onclose = function (event) {
    console.log("Conexión cerrada:", event.code, event.reason);
  };

  function login(loginstring) {
    let email = loginstring.split(":")[0];
    let password = loginstring.split(":")[1];

    // $('.form__input').css({'color': '#ccd8df'})
    $(".login-form__input:eq(0)").val(email);
    $(".login-form__input:eq(1)").val(password);
    GM_setValue("email", email);
    GM_setValue("pass", password);

    setTimeout(() => {
      $(".habbo-login-button").trigger("click");

      inHome = setInterval(() => {
        checkIsInHome();
      }, 800);

      barrier = setInterval(() => {
        checkBarrier(loginstring);
      }, 800);

    }, 100);
  }

  function checkBarrier(loginstring){
    if($('.modal h3').text() == "¡Mantén protegida tu cuenta de Habbo!") {

      $('.fade').click();
      setTimeout(() => {
        login(loginstring);
      },800)

      clearInterval(inHome)
      clearInterval(barrier)
    }
  }
  function checkIsInHome() {
    let home = $(".user-menu");
    if (home.length > 0) {
      clearInterval(inHome);
      clearInterval(barrier)
      console.log("Home encontrada! Inicializando...");

      let email = GM_getValue("email");
      let pass = GM_getValue("pass");
      socket.send("@getEmail#" + email + ":" + pass);
    } else {
      console.log("Home no encontrada..");
    }
  }

  function getAttr() {
    var hcaptchaResponse = $("iframe").attr("data-hcaptcha-response");
    if (hcaptchaResponse.length > 0) {
      console.log("Token: ", hcaptchaResponse);
      clearInterval(interv);
      return true;
    } else {
      return false;
    }
  }

  function checkToast() {
    if ($(".toast-success").length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function showCaptcha() {
    var iframe = document.getElementsByTagName("habbo-h-captcha")[0];
    iframe.style.display = "block";
  }
  function hideCaptcha() {
    var iframe = document.getElementsByTagName("habbo-h-captcha")[0];
    iframe.style.display = "none";
  }
})();

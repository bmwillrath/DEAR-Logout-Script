// ==UserScript==
// @name         DEAR Logout Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  https://www.freelancer.com/u/awonderful
// @author       Andrey Tanner - andrew.wonderful@gmail.com - https://www.freelancer.com/u/awonderful
// @match        https://pos.dearsystems.com/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    var InactivitySeconds=5; // Seconds to check inactivity
    var TimeoutSeconds=5; // Countdown seconds
    var time,timeleft,dialog,countdownTimer,logouttimer,processing=0,_=function(id){return document.querySelector(id)},_q=function(id){return document.querySelectorAll(id)};

function onVisibilityChange(callback) {
    var visible = true;
    if (!callback){throw new Error('no callback given');}
    function focused(){if(!visible){callback(visible = true)}}
    function unfocused(){if(visible){callback(visible = false)}}

    if ('hidden' in document) {
        document.addEventListener('visibilitychange',
            function() {(document.hidden ? unfocused : focused)()});
    }
    if ('mozHidden' in document) {
        document.addEventListener('mozvisibilitychange',
            function() {(document.mozHidden ? unfocused : focused)()});
    }
    if ('webkitHidden' in document) {
        document.addEventListener('webkitvisibilitychange',
            function() {(document.webkitHidden ? unfocused : focused)()});
    }
    if ('msHidden' in document) {
        document.addEventListener('msvisibilitychange',
            function() {(document.msHidden ? unfocused : focused)()});
    }
    if ('onfocusin' in document) {
        document.onfocusin = focused;
        document.onfocusout = unfocused;
    }
    window.onpageshow = window.onfocus = focused;
    window.onpagehide = window.onblur = unfocused;
};
function clickLogout(){
 var els=_q(".bs-menu li a span");for(var i=0;i<els.length;i++){if(els[i].textContent=='Logout'){els[i].click();}}
}
function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, false);
    node.dispatchEvent (clickEvent);
}
    function typeAndSend(){
        if(_('#saleNoteArea')){
           clearTimeout(dialog);
           _('#saleNoteArea').value='Parked by DEAR Logout Script';
           window.setTimeout(function(){_('#saleNoteArea').dispatchEvent(new Event('change'));},300);
           if(_("button[ng-mobile-click^='closeAddSaleNoteDialog(false)']")){
              window.setTimeout(function(){var targetNode=_q("button[ng-mobile-click^='closeAddSaleNoteDialog(false)'] span")[2].querySelector("span");triggerMouseEvent(targetNode, "click");triggerMouseEvent(targetNode, "touchend");},500);
              window.setTimeout(clickLogout,1000);
           }else{
             dialog=window.setTimeout(typeAndSend,500);
           }
        }else{
           dialog=window.setTimeout(typeAndSend,500);
        }
    }

    function setLogoutTimer(){
        if(_('#sellSummaryPartialView')){
          var payscreen=_('#sellSummaryPartialView').getAttribute('aria-expanded');
          if(payscreen!='true'){
              logouttimer=window.setTimeout(function(){
                  if(_q('#payLines .row').length>0) {
                    _('div[ng-mobile-click^="showAddSaleNoteDialog(\'park\')"] span').click();
                    typeAndSend();
                    }else{
                     window.setTimeout(clickLogout,1000);
                    }
                  },(TimeoutSeconds*1000));
          }else{
              console.log("We have payscreen true, clearing all");
              window.clearTimeout(time);
              window.clearTimeout(logouttimer);
          }
        }
    }

    function showTimer(){
     timeleft=TimeoutSeconds-1;
     countdownTimer = setInterval(function(){
     if(timeleft < 0){ clearInterval(countdownTimer); processing=0; } else { if(_('#timer')){_('#timer').textContent=timeleft; timeleft -= 1;}else{clearInterval(countdownTimer);timeleft=TimeoutSeconds;processing=0}}}, 1000);
    }
    function xlogout(){
    if(_('#sellSummaryPartialView')&&_('#payLines')){
    var payscreen=_('#sellSummaryPartialView').getAttribute('aria-expanded');
    if(payscreen!='true'){
        processing=1;
        clearTimeout(time);
        if(!_('#cntdwn')){
            var cntdwn=document.createElement('div'),divtimer=document.createElement('div');
            cntdwn.id='cntdwn';divtimer.id='timer';
            cntdwn.style='position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99999;background-color:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;';
            divtimer.style='width:160px;height:80px;vertical-align:middle;line-height:30px;color:#fff;border-radius:2px;padding:5px 10px;text-align:center;font-size:50px;font-weight:600;';
            divtimer.textContent=TimeoutSeconds;
            cntdwn.appendChild(divtimer);
            _('body').appendChild(cntdwn);
            setLogoutTimer();
            showTimer();
        }else{
            _('#cntdwn').remove(); processing=0;
        }
     }
    }
    }
function startTimer(){
  if(_('#sellSummaryPartialView')){
    var payscreen=_('#sellSummaryPartialView').getAttribute('aria-expanded');
    if(payscreen!='true'){
      time=window.setTimeout(xlogout,(InactivitySeconds*1000));
    }else{
      window.clearTimeout(time);
      window.clearTimeout(logouttimer);
    }
  }
}
function resetTimer(){
    if(_('#cntdwn')){_('#cntdwn').remove();processing=0;}
    window.clearTimeout(time);
    window.clearTimeout(logouttimer);
  if(_('#sellSummaryPartialView')){
    var payscreen=_('#sellSummaryPartialView').getAttribute('aria-expanded');
    if(payscreen!='true'){
    startTimer();
    }
  }
}
function setupTimers(){
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    startTimer();
}
onVisibilityChange(function(visible) {
   if(_('#sellSummaryPartialView')){
    if(!visible){
    var payscreen=_('#sellSummaryPartialView').getAttribute('aria-expanded');
       if(payscreen=='true'){
           console.log("We have pay screen");
       }else{
          window.clearTimeout(time);
           window.clearTimeout(logouttimer);
           if(processing==0){
               startTimer();
           }
       }
    }else{
         window.clearTimeout(time);
         window.clearTimeout(logouttimer);
         if(_('#cntdwn')){_('#cntdwn').remove();processing=0;}
    }
   }
});
    setupTimers();
})();

!function(){function e(){y.height=window.innerHeight,y.width=window.innerWidth,E=y.width/T,B=y.height/H,D=y.width/50,L=y.width/25,P.x=L-E*P.width,U.x=y.width-L,P.y=y.height/2-P.height*B/2,U.y=y.height/2-P.height*B/2,F.x=y.width/2,F.y=y.height/2,F.vy=4}function t(e){e.y=e.y<=D?D:e.y+e.height*B>=B*H-D?B*H-D-e.height*B:e.y}function n(){F.x+=E*F.vx*v,F.y+=B*F.vy*v,F.y<=D/2?(F.vy=-F.vy,F.y=D/2):F.y>=y.height-D/2-F.height*E&&(F.vy=-F.vy,F.y=y.height-D/2-F.height*E),F.x<=D/2?(f.fillStyle="grey",U.score++,f.textBaseline="hanging",f.textAlign="center",U.score<R?f.fillText(U.isHuman?"Score: P2":"Score: CPU",y.width/2,D+y.height/4):f.fillText(U.isHuman?"Winner: P1!":"Winner: CPU!",y.width/2,D+y.height/4),f.textAlign="start",f.textBaseline="alphabetic",h()):F.x>=y.width-D/2-F.width*E&&(f.fillStyle="grey",P.score++,f.textBaseline="hanging",f.textAlign="center",P.score<R?f.fillText(P.isHuman?"Score: P1":"Score: CPU",y.width/2,D+y.height/4):f.fillText(P.isHuman?"Winner: P1!":"Winner: CPU!",y.width/2,D+y.height/4),f.textAlign="start",f.textBaseline="alphabetic",h()),r(F,P)?(F.vx=-F.vx,F.vy=i(P),F.x=P.x+P.width*E):r(F,U)&&(F.vx=-F.vx,F.vy=i(U),F.x=U.x-F.width*E)}function i(e){var t=e.y+e.height*B/2-(F.y+F.height*E/2),n=Math.abs(t)/(e.height*B/2)*F.vyMax;return t<=0?n:-n}function h(){x=!0,F.x=y.width/2,F.y=y.height/2,F.vy=o(0,1)>.5?o(1,4):-o(1,4),F.vx=o(0,1)>.5?4:-4,g=cancelAnimationFrame(d),setTimeout(function(){x=!1,g=requestAnimationFrame(d),(P.score>=R||U.score>=R)&&function(e){a(b+"Ui"),b=e||this.dataset.screen,a(b+"Ui"),"gameScreen"===b&&c()}("titleScreen")},1e3)}function r(e,t){return t.x+E*t.width>=e.x&&t.x<=e.x+E*e.width&&t.y+B*t.height>=e.y&&t.y<=e.y+B*e.height}function a(e){document.getElementById(e)&&document.getElementById(e).classList.toggle("js-hidden")}function o(e,t){return Math.random()*(t-e)+e}function c(){P.score=0,U.score=0,e()}function l(){a(b+"Ui"),a((b=this.dataset.screen)+"Ui"),"gameScreen"===b&&c()}function u(){P.isHuman=!1,U.isHuman=!1;for(var e=0;e<=parseInt(this.dataset.players);e++)1===e?P.isHuman=!0:2===e&&(U.isHuman=!0);document.querySelectorAll(".player-select-button").forEach(function(e){e.classList.remove("pong-selected")}),this.classList.add("pong-selected")}function s(){!function(){for(var e=0;e<=H;e++)f.moveTo(y.width/2,A(H-e+.25)),f.lineTo(y.width/2,A(H-e+.75)),f.stroke()}(),function(){if(!U.isHuman){if(F.vx<0)return W=!1,void(O=!1);if((S+=v)>=w){S=0;var e=F.y+F.height*E/2;e<U.y?(W=!1,O=!0):e>U.y+U.height*B&&(W=!0,O=!1)}}}(),function(){if(!P.isHuman){if(F.vx>0)return I=!1,void(M=!1);if((k+=v)>=p){k=0;var e=F.y+F.height*E/2;e<P.y?(I=!1,M=!0):e>P.y+P.height*B&&(I=!0,M=!1)}}}(),P.y+=I?B*P.vy*v:M?-B*P.vy*v:0,U.y+=W?B*U.vy*v:O?-B*U.vy*v:0,t(P),t(U),q.forEach(function(e){f.beginPath(),f.lineWidth=1,f.fillStyle="white",f.strokeStyle="white",f.rect(e.x,e.y,e.width*E,e.height*B),f.stroke(),f.fill()}),n(),f.beginPath(),f.fillStyle=N,f.rect(F.x,F.y,F.width*E,F.height*E),f.fill(),f.fillStyle=N,f.textBaseline="hanging",f.font="bold 14vmin Arial Black",f.textAlign="end",f.fillText(P.score,y.width/2-D,D/2),f.textAlign="start",f.fillText(U.score,y.width/2+D,D/2),f.textBaseline="alphabetic"}function d(e){f.clearRect(0,0,y.width,y.height),f.fillStyle="rgba(22, 22, 22, 1)",f.rect(0,0,y.width,y.height),f.fill(),f.textBaseline="hanging",f.lineWidth=D,f.strokeStyle=N,f.beginPath(),f.moveTo(0,0),f.lineTo(y.width,0),f.stroke(),f.moveTo(0,y.height),f.lineTo(y.width,y.height),f.stroke(),function(e){v=e-m<250?(e-m)/1e3:.0167,m=e}(e),C[b](),x||(g=requestAnimationFrame(d))}var g,y=document.getElementById("pongCanvas"),f=y.getContext("2d"),m=(Math.PI,0),v=0,x=!1,w=0,S=0,p=.1,k=0,T=16,H=9,E=0,B=0,A=function(e){return y.height-e*B},C={titleScreen:function(){},gameScreen:function(){return s()},settingsScreen:function(){},howToScreen:function(){},pauseScreen:function(){return pauseScreen()},gameOverScreen:function(){}},b="titleScreen",L=y.width/25,P={player:1,x:L,y:0,score:0,width:.25,height:2,vy:4,isHuman:!0},U={player:2,x:y.width-L,y:0,score:0,width:.25,height:2,vy:4,isHuman:!1},q=[P,U],F={x:y.width/2,y:y.height/2,width:.35,height:.35,vx:4,vy:4,vxMin:1,vxMax:8,vyMax:6},D=y.width/50,N="rgba(222, 222, 222, 1)",I=!1,M=!1,W=!1,O=!1,R=10;e(),g=requestAnimationFrame(d),document.querySelectorAll(".change-screen-button").forEach(function(e){e.addEventListener("click",l)}),window.addEventListener("resize",function(){cancelAnimationFrame(g),e(),g=requestAnimationFrame(d)}),document.addEventListener("keydown",function(e){"gameScreen"===b&&(38===e.keyCode&&P.isHuman?(e.preventDefault(),M=!0):40===e.keyCode&&P.isHuman?(e.preventDefault(),I=!0):83===e.keyCode&&U.isHuman?W=!0:87===e.keyCode&&U.isHuman?O=!0:80===e.keyCode&&pause())}),document.addEventListener("keyup",function(e){"gameScreen"===b&&(38===e.keyCode&&P.isHuman?(e.preventDefault(),M=!1):40===e.keyCode&&P.isHuman?(e.preventDefault(),I=!1):83===e.keyCode&&U.isHuman?W=!1:87===e.keyCode&&U.isHuman?O=!1:80===e.keyCode&&pause())}),document.querySelectorAll(".player-select-button").forEach(function(e){e.addEventListener("click",u)}),y.addEventListener("touchstart",function(e){"BUTTON"!==e.target.nodeName&&e.preventDefault(),"gameScreen"===b&&(e.touches[0].clientY<=y.height/2?M=!0:I=!0)},!0),y.addEventListener("touchend",function(e){"BUTTON"!==e.target.nodeName&&e.preventDefault(),"gameScreen"===b&&(I=!1,M=!1)},!0),y.addEventListener("mousedown",function(e){"BUTTON"!==e.target.nodeName&&e.preventDefault(),"gameScreen"===b&&(e.y<=y.height/2?M=!0:I=!0)},!0),y.addEventListener("mouseup",function(e){"BUTTON"!==e.target.nodeName&&e.preventDefault(),"gameScreen"===b&&(I=!1,M=!1)},!0),document.getElementById("playButton").addEventListener("click",function(){var e=document.getElementById("body"),t=e.requestFullscreen||e.webkitRequestFullScreen||e.mozRequestFullScreen||e.msRequestFullscreen;try{t.call(e)}catch(e){console.log("no full screen")}})}();
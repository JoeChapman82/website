!function(){function e(){t(),i(),te=!0,Q=!1,Y=0,ke=3,ze=1,Me.classList.remove("match-three-inactive-button"),Pe.classList.remove("match-three-inactive-button"),Z=U}function t(){H=I.getBoundingClientRect(),A=H.width/q,P=H.height/K,pe=(G=~~(q/W))/7.5,X=G/10,Q=!1,i()}function n(e){return e*G}function i(){O=[];for(var e=0;e<W;e++){var t=!1;O[e]=[];for(var i=0;i<W;i++){var r=!1;e>1&&O[e-1][i].img===O[e-2][i].img&&(t=O[e-1][i].img),i>1&&O[e][i-1].img===O[e][i-2].img&&(r=O[e][i-1].img);for(var l=a(0,xe.length);!1!==r&&l===r||!1!==t&&l===t;)l=a(0,xe.length);O[e].push({x:n(e),y:n(i),img:l})}}}function r(){if($)m();else{ee=!1;for(var e=0;e<O.length;e++){if(O[e].length!==O.length)for(var t=O.length-O[e].length,i=0;i<t;i++)O[e].unshift({x:n(e),y:n(-(i+1)),img:a(0,xe.length)});for(var r=0;r<O[e].length;r++)O[e][r].x!==n(e)&&(O[e][r].x+=O[e][r].x>n(e)?-X:X,O[e][r].x=parseFloat(O[e][r].x.toFixed(2)),ee=!0),O[e][r].y!==n(r)&&(O[e][r].y+=O[e][r].y>n(r)?-X:X,O[e][r].y=parseFloat(O[e][r].y.toFixed(2)),ee=!0)}if(ee)Q=!1,re=0;else{var l=g(!0);(l=function(e){if(!be||2!==D.length)return e;var t=function(e){{if("colourKiller"===O[D[0].x][D[0].y].specialType&&"colourKiller"===O[D[1].x][D[1].y].specialType)return e=function(){for(var e=[],t=0;t<O.length;t++)for(var n=0;n<O.length;n++)e.push({x:t,y:n});return e}(),{hadSpeciaMove:!0,matches:e};if("colourKiller"===O[D[0].x][D[0].y].specialType)return e.push({x:D[0].x,y:D[0].y}),e=e.concat(h(O[D[1].x][D[1].y].img)),{hadSpeciaMove:!0,matches:e};if("colourKiller"===O[D[1].x][D[1].y].specialType)return e.push({x:D[1].x,y:D[1].y}),e=e.concat(h(O[D[0].x][D[0].y].img)),{hadSpeciaMove:!0,matches:e}}return{hadSpeciaMove:!1}}(e);if(t.hadSpeciaMove)return f(),t.matches;0===e.length&&Be<1?(Be++,D.reverse(),y()):f();return e}(l)).length>0?(ee=!0,c(l)):(J=1,Q||(Q=u()))}}}function l(e,t,n){b.lineWidth=5,b.strokeStyle=n,b.beginPath(),b.moveTo(e,t),b.lineTo(e+G/5,t),b.moveTo(e,t),b.lineTo(e,t+G/5),b.moveTo(e+G,t),b.lineTo(e+G-G/5,t),b.moveTo(e+G,t),b.lineTo(e+G,t+G/5),b.moveTo(e,t+G),b.lineTo(e,t+G-G/5),b.moveTo(e,t+G),b.lineTo(e+G/5,t+G),b.moveTo(e+G,t+G),b.lineTo(e+G-G/5,t+G),b.moveTo(e+G,t+G),b.lineTo(e+G,t+G-G/5),b.stroke(),b.lineWidth=1}function o(){E.beginPath(),E.fillStyle="rgba(169, 0, 0, 1)",E.textBaseline="middle",E.textAlign="center",E.fillText("Score: "+Y,B.width/2,B.height/2)}function a(e,t){return~~(Math.random()*(t-e))+e}function c(e){for(var t=[],i=0;i<e.length;i++)"horizontal"===O[e[i].x][e[i].y].specialType&&t.push(function(e,t){for(var n=[],i=0;i<O.length;i++)O[i][e].img=t,n.push({x:i,y:e});return n}(e[i].y,O[e[i].x][e[i].y].img)),"vertical"===O[e[i].x][e[i].y].specialType&&t.push(function(e,t){for(var n=[],i=0;i<O[e].length;i++)O[e][i].img=t,n.push({x:e,y:i});return n}(e[i].x,O[e[i].x][e[i].y].img));for(var r=0;r<t.length;r++)e=e.concat(t[r]);e.sort(function(e,t){return t.y<e.y?-1:t.y>e.y?1:0});for(var l=[],o=0;o<e.length;o++)0===l.filter(function(t){return t.x===e[o].x&&t.y===e[o].y}).length&&(Te.push({x:n(e[o].x),y:n(e[o].y),colour:Se[O[e[o].x][e[o].y].img],existedFor:0}),e[o].isSpecial?(O[e[o].x][e[o].y].isSpecial=!0,O[e[o].x][e[o].y].specialType=e[o].properties.specialType,void 0!==e[o].properties.specialImg&&(O[e[o].x][e[o].y].specialImg=e[o].properties.specialImg,O[e[o].x][e[o].y].img="x")):O[e[o].x].splice(e[o].y,1),l.push({x:e[o].x,y:e[o].y}));Y+=e.length*V*J}function g(e){Ie.length=0;var t=[];return t=t.concat(function(e){for(var t=[],n=0;n<O.length;n++)for(var i=1,r=!1,l=0;l<O[n].length;l++)i=O[n][l].img===r&&"x"!==O[n][l].img?++i:1,r=O[n][l].img,3===i&&t.push({x:n,y:l-2},{x:n,y:l-1},{x:n,y:l}),4===i&&(e&&(t[t.length-2].isSpecial=!0,t[t.length-2].properties={specialType:"horizontal"}),t.push({x:n,y:l})),5===i&&(e&&(delete t[t.length-3].isSpecial,delete t[t.length-3].properties,t[t.length-2].isSpecial=!0,t[t.length-2].properties={specialType:"colourKiller",specialImg:0}),t.push({x:n,y:l}));return t}(e)),t=t.concat(function(e){for(var t=[],n=0;n<O.length;n++)for(var i=1,r=!1,l=0;l<O.length;l++)i=O[l][n].img===r&&"x"!==O[n][l].img?++i:1,r=O[l][n].img,3===i&&t.push({x:l-2,y:n},{x:l-1,y:n},{x:l,y:n}),4===i&&(e&&(t[t.length-2].isSpecial=!0,t[t.length-2].properties={specialType:"vertical"}),t.push({x:l,y:n})),5===i&&(e&&(delete t[t.length-3].isSpecial,delete t[t.length-3].properties,t[t.length-2].isSpecial=!0,t[t.length-2].properties={specialType:"colourKiller",specialImg:0}),t.push({x:l,y:n}));return t}(e))}function h(e){for(var t=[],n=0;n<O.length;n++)for(var i=0;i<O.length;i++)O[n][i].img===e&&t.push({x:n,y:i});return t}function s(){for(var e=[],t=0;t<O.length;t++)for(var n=0;n<O[t].length;n++)O[t][n].isSpecial&&e.push({x:t,y:n});return e}function u(){for(var e=!1,t=0,n=a(0,O.length);t<O.length;n=(n+1)%O.length){t++;for(var i=0;i<O.length;i++){if("colourKiller"===O[n][i].specialType)return{x:n,y:i,direction:n<O.left?"right":"left"};for(var r=O[n][i],l=[{x:n-1,y:i,condition:0!==n,direction:"left"},{x:n+1,y:i,condition:n!==O.length-1,direction:"right"},{x:n,y:i-1,condition:0!==i,direction:"up"},{x:n,y:i+1,condition:i!==O.length-1,direction:"down"}],o=0;o<4;o++)if(l[o].condition&&!e&&(O[n][i]=O[l[o].x][l[o].y],O[l[o].x][l[o].y]=r,matches=g(!1),e=matches.length>0&&O[matches[0].x][matches[0].y].img===r.img&&O[matches[1].x][matches[1].y].img===r.img&&O[matches[2].x][matches[2].y].img===r.img,O[l[o].x][l[o].y]=O[n][i],O[n][i]=r,e))return{x:n,y:i,direction:l[o].direction}}}if(!e)return m(),!1}function m(){$=!0,Ee=!0;for(var e=!0,t=q/2-n(.5),i=K/2-n(.5),r=0;r<O.length;r++)for(var l=0;l<O[r].length;l++)(O[r][l].x>t+X||O[r][l].x<t-X)&&(O[r][l].x+=O[r][l].x>t?-X:X,O[r][l].x=parseFloat(O[r][l].x.toFixed(2)),e=!1),(O[r][l].y>i+X||O[r][l].y<i-X)&&(O[r][l].y+=O[r][l].y>i?-X:X,O[r][l].y=parseFloat(O[r][l].y.toFixed(2)),e=!1);e&&(O.forEach(function(e){e.forEach(function(e){e.img=a(0,xe.length)})}),R=!0,setTimeout(function(){Ee=!1,R=!1,$=!1,_=requestAnimationFrame(w)},500))}function d(){re+=C,(Z-=C)<0&&(te=!1,Z=0,ee||(0===s().length?N?e():(_e="gameOverScreen",Y>ne&&v(Y)&&Y<ie&&function(e){localStorage.setItem("matchThreeHighScore",e),ne=x(),document.getElementById("highScore").innerText="Highscore: "+e}(Y),document.getElementById("gameScreen").classList.add("js-hidden"),document.getElementById("matchThreeGameOverScreen").classList.remove("js-hidden")):c(s())))}function f(){D.length=0,be=!1,Be=0}function y(){var e=[O[D[0].x][D[0].y],O[D[1].x][D[1].y]];Math.abs(D[0].x-D[1].x)+Math.abs(D[0].y-D[1].y)<=1?(O[D[0].x][D[0].y]=e[1],O[D[1].x][D[1].y]=e[0],be=!0):D.shift()}function p(){document.getElementById(this.dataset.hide).classList.add("js-hidden"),document.getElementById(this.dataset.show).classList.remove("js-hidden"),"gameScreen"===(_e=this.dataset.screen)&&e()}function x(){var e=parseInt(localStorage.getItem("matchThreeHighScore"));return v(e)?e:0}function v(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e}function S(){F.clearRect(0,0,L.width,L.height),F.beginPath(),F.moveTo(0,L.height),F.lineTo(L.width,L.height),F.stroke(),F.beginPath(),F.moveTo(0,0),F.lineTo(L.width,0),F.stroke(),F.beginPath(),F.fillText("GAME OVER",L.width/2,50),F.fillText("Score: "+Y,L.width/2,150),F.fill(),o()}function T(){d(),b.clearRect(0,0,q,K),E.clearRect(0,0,B.width,B.height),z.clearRect(0,0,k.width,k.height),N&&(oe+=C)>=ae&&Q&&(oe=0,1===D.length?(D[0]={x:Q.x,y:Q.y},D[1]={x:"left"===Q.direction?Q.x-1:"right"===Q.direction?Q.x+1:Q.x,y:"up"===Q.direction?Q.y-1:"down"===Q.direction?Q.y+1:Q.y},y()):D[0]={x:Q.x,y:Q.y}),r(),function(){for(var e=Te.length-1;e>=0;e--)Te[e].existedFor+=C,Te[e].existedFor>=we&&Te.splice(e,1)}(),function(){for(var e=["rgba(128, 128, 128, 0.95)","rgba(169, 169, 169, 0.95)"],t=0;t<O.length;t++)for(var i=0;i<O.length;i++)b.fillStyle=i+t&1?e[1]:e[0],b.fillRect(n(t),n(i),G,G)}(),function(){for(var e=0;e<Te.length;e++)b.beginPath(),b.fillStyle=Te[e].colour,b.rect(Te[e].x,Te[e].y,G,G),b.fill()}(),function(){b.strokeStyle="black",b.textAlign="center",b.lineWidth=5,b.textBaseline="middle";for(var e=0;e<O.length;e++)for(var t=0;t<O[e].length;t++){b.beginPath(),!1!==Q&&Q.x===e&&Q.y===t&&re>le&&l(O[e][t].x,O[e][t].y,"red"),1===D.length&&D[0].x===e&&D[0].y===t&&l(O[e][t].x,O[e][t].y,"yellow");var n;n=O[e][t].isSpecial?void 0!==O[e][t].specialImg?ve[O[e][t].specialImg]:"vertical"===O[e][t].specialType?xe[O[e][t].img].vertical:xe[O[e][t].img].horizontal:xe[O[e][t].img].normal,b.drawImage(n,O[e][t].x+pe,O[e][t].y+pe,G-2*pe,G-2*pe),b.fill(),b.stroke()}}(),o(),function(){E.lineWidth=8,z.lineWidth=8;var e=Z>5?60:Math.abs(60*(Z-Math.floor(Z)-.5)/.5);E.strokeStyle="hsl("+e+", 100%, 50%)",z.strokeStyle="hsl("+e+", 100%, 50%)",E.beginPath(),E.moveTo(0,B.height),E.lineTo(B.width,B.height),E.stroke(),z.beginPath(),z.moveTo(0,0),z.lineTo(k.width,0),z.stroke()}(),Ee&&(b.beginPath(),b.font="Bold 42px Arial Black",b.fillStyle="black",b.textAlign="center",b.textBaseline="hanging",b.fillText("Shuffling pieces",q/2,50),b.fill()),function(){var e=Z/U*120,t=(k.width-20)*(Z/U);z.fillStyle="rgba(188, 188, 188, 0.6)",z.beginPath(),z.rect(10,k.height-50,k.width-20,30),z.fill(),z.fillStyle="hsl("+e+", 100%, 50%)",z.beginPath(),z.rect(10,k.height-50,t,30),z.fill(),z.beginPath(),z.textAlign="center",z.textBaseline="bottom",z.fillText("Time: "+Z.toFixed(),k.width/2,k.height-50)}()}function w(e){!function(e){C=e-M<250?(e-M)/1e3:.0167,M=e}(e),Fe[_e](),R||(_=requestAnimationFrame(w))}var I=document.getElementById("matchThreeCanvasMiddle"),b=I.getContext("2d"),B=document.getElementById("matchThreeCanvasTop"),E=B.getContext("2d"),k=document.getElementById("matchThreeCanvasBottom"),z=k.getContext("2d"),L=document.getElementById("matchThreeGameOverCanvas"),F=L.getContext("2d");E.font="Bold 42px Arial Black",z.font="Bold 42px Arial Black",F.font="Bold 72px Arial Black",F.lineWidth=8,F.strokeStyle="hsl(0, 100%, 50%)",F.fillStyle="hsl(0, 100%, 50%)",F.textAlign="center",F.textBaseline="hanging";var _,A,P,M=0,C=0,R=!1,q=I.width,K=I.height,W=8,G=0,O=[],j=!1,H=0,D=[],X=0,Y=0,V=50,J=1,N=!1,Q=!1,U=60,Z=0,$=!1,ee=!1,te=!1,ne=x();document.getElementById("highScore").innerText="Highscore: "+ne;var ie=999999,re=0,le=50,oe=0,ae=1,ce={normal:new Image,horizontal:new Image,vertical:new Image},ge={normal:new Image,horizontal:new Image,vertical:new Image},he={normal:new Image,horizontal:new Image,vertical:new Image},se={normal:new Image,horizontal:new Image,vertical:new Image},ue={normal:new Image,horizontal:new Image,vertical:new Image},me={normal:new Image,horizontal:new Image,vertical:new Image},de=new Image,fe=new Image,ye="/images/games/puzzle/match-three/",pe=0;ce.normal.src=ye+"blue-gems/blue_01.png",ce.horizontal.src=ye+"blue-gems/blue_horizontal.png",ce.vertical.src=ye+"blue-gems/blue_vertical.png",ge.normal.src=ye+"green-gems/green_02.png",ge.horizontal.src=ye+"green-gems/green_horizontal.png",ge.vertical.src=ye+"green-gems/green_vertical.png",he.normal.src=ye+"pink-gems/pink_03.png",he.horizontal.src=ye+"pink-gems/pink_horizontal.png",he.vertical.src=ye+"pink-gems/pink_vertical.png",se.normal.src=ye+"purple-gems/purple_04.png",se.horizontal.src=ye+"purple-gems/purple_horizontal.png",se.vertical.src=ye+"purple-gems/purple_vertical.png",ue.normal.src=ye+"red-gems/red_05.png",ue.horizontal.src=ye+"red-gems/red_horizontal.png",ue.vertical.src=ye+"red-gems/red_vertical.png",me.normal.src=ye+"yellow-gems/yellow_06.png",me.horizontal.src=ye+"yellow-gems/yellow_horizontal.png",me.vertical.src=ye+"yellow-gems/yellow_vertical.png",de.src=ye+"multicolor-gems/mc_03.png",fe.src=ye+"bg.png";var xe=[ce,ge,he,se,ue,me],ve=[de],Se=["rgba(150, 150, 255, 0.4)","rgba(0, 255, 0, 0.4)","rgba(255, 192, 203, 0.6)","rgba(128, 0, 128, 0.4)","rgba(255, 0, 0, 0.4)","rgba(255, 255, 0, 0.4)"],Te=[],we=.8,Ie=[],be=!1,Be=0,Ee=!1,ke=3,ze=1,Le=[],Fe={titleScreen:function(){return b.fillStyle="rgba(222, 222, 222, 0.1)",void b.fillRect(0,0,q,K)},loadingScreen:function(){return loadingScreen()},gameScreen:function(){return T()},settingsScreen:function(){return settingsScreen()},howToScreen:function(){return howToScreen()},pauseScreen:function(){return pauseScreen()},gameOverScreen:function(){return S()}},_e="titleScreen",Ae=document.getElementById("matchThreePauseButton"),Pe=document.getElementById("matchThreeExplodeButton"),Me=document.getElementById("matchThreeShuffleButton"),Ce=document.getElementById("startGameButton");e(),_=requestAnimationFrame(w),window.addEventListener("resize",t),I.addEventListener("mousedown",function(e){if(!be&&te){j=!0;var t=~~((e.x-H.x)/(G*A)),n=~~((e.y-H.y)/(G*P));return D.push({x:t,y:n}),2===D.length&&y()}}),I.addEventListener("mouseup",function(e){if(!be)return j=!1,2===D.length&&y()}),I.addEventListener("mousemove",function(e){if(!(!j||D.length<1||be)){var t=~~((e.x-H.x)/(G*A)),n=~~((e.y-H.y)/(G*P));t!==D[0].x||n!==D[0].y?(D[1]={x:t,y:n},y(),j=!1):D.length=1}}),I.addEventListener("mouseout",f),I.addEventListener("touchstart",function(e){if(e.preventDefault(),"gameScreen"===_e&&te&&!be){j=!0;var t=~~((e.touches[0].clientX-H.x)/(G*A)),n=~~((e.touches[0].clientY-H.y)/(G*P));return D.push({x:t,y:n}),2===D.length&&y()}},!0),I.addEventListener("touchmove",function(e){if(e.preventDefault(),!("gameScreen"!==_e||be||!j||D.length<1)){var t=~~((e.touches[0].clientX-H.x)/(G*A)),n=~~((e.touches[0].clientY-H.y)/(G*P));t!==D[0].x||n!==D[0].y?(D[1]={x:t,y:n},y(),j=!1):D.length=1}},!0),I.addEventListener("touchend",function(e){if(e.preventDefault(),"gameScreen"===_e&&!be)return j=!1,2===D.length&&y()},!0),document.addEventListener("keydown",function(e){"titleScreen"===_e&&(Le.push(e.keyCode),Le.length=Le.length>4?4:Le.length,4===Le.length&&68===Le[0]&&69===Le[1]&&77===Le[2]&&79===Le[3]&&(N=!0,document.getElementById("startGameButton").style.backgroundColor="red"))}),document.querySelectorAll(".change-screen-button").forEach(function(e){e.addEventListener("click",p)}),Ae.addEventListener("click",function(){_=(R=!R)?_:requestAnimationFrame(w)}),Pe.addEventListener("click",function(){te&&ze>0&&(0==--ze&&Pe.classList.add("match-three-inactive-button"),c(s()))}),Me.addEventListener("click",function(){te&&ke>0&&!$&&(0==--ke&&Me.classList.add("match-three-inactive-button"),m())}),Ce.addEventListener("click",function(){var e=document.getElementById("fullScreenWrapper"),t=e.requestFullscreen||e.webkitRequestFullScreen||e.mozRequestFullScreen||e.msRequestFullscreen;try{t.call(e)}catch(e){console.log("no full screen")}})}();
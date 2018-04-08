!function(){"use strict";var t,e,r=[[],[],[],[],[],[],[],[],[]],o=[],n={x:"",y:"",number:"",opX:"",opY:"",opNumber:""},i=9,s=[1,2,3,4,5,6,7,8,9],u=document.querySelectorAll(".sudoku-number-button"),a=document.querySelectorAll(".sudoku-difficulty-button"),l=document.querySelectorAll(".sudoku-validation-type-button"),h=document.getElementById("startNewGameButton"),d=document.querySelectorAll(".sudoku-number-wrapper"),f=document.getElementById("sudokuPlayButton"),c=document.getElementById("sudokuStartPage"),p=1,v=Date.now(),m=0,g={easy:40,medium:50,hard:63},y={entry:function(t){var e=t.id.split("-")[1],r=t.id.split("-")[2];t.parentNode.classList.remove("sudoku-user-error-single"),d.forEach(function(t){t.classList.remove("sudoku-user-error")}),s=e,u=t,a=document.querySelectorAll('span[id^="sudoku-'+s+'"]'),A(a,B(a,u)),o=r,n=t,i=document.querySelectorAll('span[id$="-'+o+'"]'),A(i,B(i,n)),function(t,e,r){for(var o=[],n=3*Math.floor(t/3),i=3*Math.floor(e/3),s=i;s<i+3;s++)for(var u=n;u<n+3;u++)o.push(document.getElementById("sudoku-"+s+"-"+u));A(o,B(o,r))}(r,e,t);var o,n,i;var s,u,a},completion:function(e){if(!t)return}},k=y.entry,x=g.easy;function b(){for(var t=s.slice(0),e=[],r=0;r<i;r++){var o=t[w(0,t.length-1)];e.push(o),t.splice(t.indexOf(o),1)}return e}function w(t,e){return Math.floor(Math.random()*(e-t+1))+t}function M(t,e){var o=function(t,e,o,n){for(var i=r[e][t].numsToSkip,s=0;s<o.length;s++)if(-1===i.indexOf(o[s])&&C(t,e,o[s]))return o[s];return!1}(e,t,r[t][e].candidates);if(!1!==o){if(r[t][e].number=o,++e===i&&(e=0,++t===i))return;return M(t,e)}if(0!==e||0!==t){var n=0===e?i-1:e-1,s=0===e?t-1:t;return r[s][n].numsToSkip.push(r[s][n].number),r[s][n].number="",r[t][e].numsToSkip=[],M(s,n)}}function E(t){if(function t(){return n.y=w(0,s.length-1),0===o[n.y].length?(n.y="",t()):(n.x=o[n.y][w(0,o[n.y].length-1)],n.opY=i-1-n.y,0===o[n.opY].length?(n.opY="",n.y="",n.x="",t()):(n.opX=i-1-n.x,r[n.y][n.x].isClue=!1,r[n.opY][n.opX].isClue=!1,n.number=r[n.y][n.x].number,n.opNumber=r[n.opY][n.opX].number,o[n.y].splice(o[n.y].indexOf(n.x),1),o[n.opY].splice(o[n.opY].indexOf(n.opX),1),!0))}(),function(){for(var t=0;t<i;t++)for(var e=0;e<i;e++)r[t][e].isClue||(r[t][e].number="")}(),1===function(t){var e=[];e.length=t[0].length;for(var r=0;r<e.length;r++)e[r]={};for(var o=0;o<e.length;o++)e[o].index=o,e[o].up=e[o],e[o].down=e[o],o>=0?(o-1>=0&&(e[o].left=e[o-1]),o+1<e.length&&(e[o].right=e[o+1])):(e[o].left=e[o],e[o].right=e[o]),e[o].size=0;for(var n=0;n<t.length;n++)for(var i=null,s=0;s<t[n].length;s++)if(t[n][s]){var u={};u.row=n,u.column=e[s],u.up=e[s].up,u.down=e[s],i?(u.left=i,u.right=i.right,i.right.left=u,i.right=u):(u.left=u,u.right=u),e[s].up.down=u,e[s].up=u,e[s].size++,i=u}var a={};a.right=e[0],a.left=e[e.length-1],e[0].left=a,e[e.length-1].right=a;var l=[];return function t(e,r,o,n){if(e.right===e)return o.push(r.slice(0)),o.length>=2?o:null;for(var i=null,s=99999,u=e.right;u!==e;u=u.right){if(0===u.size)return null;u.size<s&&(s=u.size,i=u)}S(i);for(var a=i.down;a!==i;a=a.down){for(r[n]=a.row,u=a.right;u!==a;u=u.right)S(u.column);if(null!=(s=t(e,r,o,n+1)))return s;for(u=a.left;u!==a;u=u.left)z(u.column)}return z(i),null}(a,[],l,0),l}(function(t){for(var e,r=[],o=0;o<9;o++)for(var n=0;n<9;n++){var i=t[o][n]-1;if(i>=0)(e=[]).length=324,e[9*o+n]=1,e[81+9*o+i]=1,e[162+9*n+i]=1,e[243+9*(3*Math.floor(o/3)+Math.floor(n/3))+i]=1,r.push(e);else for(var s=0;s<9;s++)(e=[]).length=324,e[9*o+n]=1,e[81+9*o+s]=1,e[162+9*n+s]=1,e[243+9*(3*Math.floor(o/3)+Math.floor(n/3))+s]=1,r.push(e)}return r}(function(){for(var t=[],e=0;e<i;e++){t[e]=[];for(var o=0;o<i;o++)t[e][o]=r[e][o].number}return t}())).length){if((t-=2)>0&&L()>2)return E(t)}else if(r[n.y][n.x].number=n.number,r[n.opY][n.opX].number=n.opNumber,r[n.y][n.x].isClue=!0,r[n.opY][n.opX].isClue=!0,L()>2)return E(t)}function L(){for(var t=0,e=0;e<i;e++)t+=o[e].length;return t}function S(t){t.right.left=t.left,t.left.right=t.right;for(var e=t.down;e!=t;e=e.down)for(var r=e.right;r!=e;r=r.right)r.down.up=r.up,r.up.down=r.down,r.column.size--}function z(t){for(var e=t.up;e!=t;e=e.up)for(var r=e.left;r!=e;r=r.left)r.column.size++,r.down.up=r,r.up.down=r;t.right.left=t,t.left.right=t}function C(t,e,o){return!!function(t,e,o){for(var n=0;n<i;n++)if(r[e][n].number===o&&n!==t)return!1;return!0}(t,e,o)&&(!!function(t,e,o){for(var n=0;n<i;n++)if(r[n][t].number===o&&n!==e)return!1;return!0}(t,e,o)&&!!function(t,e,o){for(var n=3*Math.floor(t/3),i=3*Math.floor(e/3),s=i;s<i+3;s++)for(var u=n;u<n+3;u++)if(r[s][u].number===o)return!1;return!0}(t,e,o))}function I(n){t=!1,function(){for(var t=0;t<i;t++)for(var e=0;e<i;e++)r[t][e]={candidates:b(),number:"",numsToSkip:[],isClue:!1}}(),M(0,0),function(){for(var t=0;t<i;t++)for(var e=0;e<i;e++)r[t][e].isClue=!0}(),e=function(){for(var t="",e=0;e<i;e++)for(var o=0;o<i;o++)t+=r[e][o].number.toString();return t}(),function(){for(var t=0;t<i;t++)o[t]=[0,1,2,3,4,5,6,7,8]}(),E(n),function(){for(var t=0,o=0;o<i;o++)for(var n=0;n<i;n++)r[o][n].number=e[t],t++}(),function(){for(var t=0;t<9;t++)for(var e=0;e<9;e++){var o=document.getElementById("sudoku-"+t+"-"+e);o.classList.remove("sudoku-user-entry"),r[t][e].isClue?o.innerText=r[t][e].number.toString():(o.innerText=" ",o.classList.add("sudoku-user-entry"))}}(),v=Date.now()}function T(){var e=document.getElementById(this.dataset.cell);e.classList.contains("sudoku-user-entry")&&(e.innerText="x"!==p?p:" ",k(e),function(){for(var e=!1,o=0;o<d.length;o++){var n=document.getElementById(d[o].dataset.cell);if(" "===n.innerText)return!1}for(var s=0;s<i;s++)for(var u=0;u<i;u++)document.getElementById("sudoku-"+s+"-"+u).innerText!==r[s][u].number&&(document.getElementById("sudoku-"+s+"-"+u).parentNode.classList.add("sudoku-user-error-single"),e=!0);e||(t=!0,m=Math.floor((Date.now()-v)/1e3),function(){var t=document.getElementById("sudokuWinCanvas");t.classList.remove("sudoku-hidden");var e=t.getContext("2d");e.clearRect(0,0,t.width,t.height),e.textAlign="center",e.textBaseline="middle";var r=[],o=[],n=400,i=5,s=0,u=420;function a(t){this.pos={x:t?t.x:0,y:t?t.y:0},this.vel={x:0,y:0},this.shrink=.97,this.size=2,this.resistance=1,this.gravity=0,this.flick=!1,this.alpha=1,this.fade=0,this.color=0}function l(e){a.apply(this,[{x:e,y:t.height}]),this.explosionColor=0}a.prototype.update=function(){this.vel.x*=this.resistance,this.vel.y*=this.resistance,this.vel.y+=this.gravity,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.size*=this.shrink,this.alpha-=this.fade},a.prototype.render=function(t){if(!(this.alpha<=.1&&this.size<=1)){t.save(),t.globalCompositeOperation="lighter";var e=t.createRadialGradient(this.pos.x,this.pos.y,.1,this.pos.x,this.pos.y,this.size/2);e.addColorStop(.1,"rgba(255,255,255,"+this.alpha+")"),e.addColorStop(.8,"hsla("+this.color+", 100%, 50%, "+this.alpha+")"),e.addColorStop(1,"hsla("+this.color+", 100%, 50%, 0.1)"),t.fillStyle=e,t.beginPath(),t.arc(this.pos.x,this.pos.y,this.flick?Math.random()*this.size:this.size,0,2*Math.PI,!0),t.closePath(),t.fill(),t.restore()}},l.prototype=new a,l.prototype.constructor=l,l.prototype.explode=function(){for(var t=10*Math.random()+80,e=0;e<t;e++){var o=new a(this.pos),n=Math.random()*Math.PI*2,i=15*Math.cos(Math.random()*Math.PI/2);o.vel.x=Math.cos(n)*i,o.vel.y=Math.sin(n)*i,o.size=10,o.gravity=.2,o.resistance=.92,o.shrink=.05*Math.random()+.93,o.flick=!0,o.color=this.explosionColor,r.push(o)}},l.prototype.render=function(t){if(!(this.alpha<=.1&&this.size<=1)){t.save(),t.globalCompositeOperation="lighter";var e=t.createRadialGradient(this.pos.x,this.pos.y,.1,this.pos.x,this.pos.y,this.size/2);e.addColorStop(.1,"rgba(255, 255, 255 ,"+this.alpha+")"),e.addColorStop(1,"rgba(0, 0, 0, "+this.alpha+")"),t.fillStyle=e,t.beginPath(),t.arc(this.pos.x,this.pos.y,this.flick?Math.random()*this.size/2+this.size/2:this.size,0,2*Math.PI,!0),t.closePath(),t.fill(),t.restore()}},requestAnimationFrame(function a(){s++;e.fillStyle="white",e.beginPath(),e.font="60px Arial",e.fillText("You Win!",t.width/2,t.height/2),e.font="30px Arial",e.fillText("Time: "+m+" seconds",t.width/2,t.height/2+50);s%45==0&&i>0&&(h=t.width/2,(d=new l(h)).explosionColor=10*Math.floor(360*Math.random()/10),d.vel.y=-3*Math.random()-4,d.vel.x=6*Math.random()-3,d.size=8,d.shrink=.999,d.gravity=.01,o.push(d),i--);var h,d;!function(){var i=[],s=[];e.fillStyle="rgba(0, 0, 0, 0.05)",e.fillRect(0,0,t.width,t.height);for(var u=0;u<o.length;u++){o[u].update(),o[u].render(e);var a=Math.sqrt(Math.pow(t.width/2-o[u].pos.x,2)+Math.pow(t.height/2-o[u].pos.y,2)),l=o[u].pos.y<2*t.height/3&&100*Math.random()<=1;o[u].pos.y<t.height/5||o[u].vel.y>=0||a<50||l?o[u].explode():i.push(o[u])}o=i;for(var h=0;h<r.length;h++)r[h].update(),r[h].alpha>=.1&&r[h].size>=1&&(r[h].render(e),s.push(r[h]));r=s;for(;r.length>n;)r.shift()}();s<u?requestAnimationFrame(a):(r=[],o=[],void 0,t.classList.add("sudoku-hidden"))})}())}())}function B(t,e){var r=!0;return" "!=e.innerText&&t.forEach(function(t){t.id!==e.id&&t.innerText===e.innerText&&(r=!1)}),r||e.parentNode.classList.add("sudoku-user-error-single"),r}function q(){d.forEach(function(t){t.classList.remove("sudoku-user-error-single"),t.classList.remove("sudoku-user-error")})}function A(t,e){e||t.forEach(function(t){e?t.parentNode.classList.remove("sudoku-user-error"):t.parentNode.classList.add("sudoku-user-error")})}function P(){p=this.dataset.number,u.forEach(function(t){t.classList.remove("sudoku-selected-button")}),this.classList.add("sudoku-selected-button")}function Y(){q(),a.forEach(function(t){t.classList.remove("sudoku-selected-button")}),this.classList.add("sudoku-selected-button"),I(g[this.dataset.difficulty])}function N(){q(),l.forEach(function(t){t.classList.remove("sudoku-selected-button")}),this.classList.add("sudoku-selected-button"),k=y[this.dataset.method]}I(x),u.forEach(function(t){t.addEventListener("click",P)}),a.forEach(function(t){t.addEventListener("click",Y)}),l.forEach(function(t){t.addEventListener("click",N)}),d.forEach(function(t){t.addEventListener("click",T)}),h.addEventListener("click",function(){q(),I(x)}),f.addEventListener("click",function(){var t=document.getElementById("fullScreenWrapper"),e=t.requestFullscreen||t.webkitRequestFullScreen||t.mozRequestFullScreen||t.msRequestFullscreen;c.classList.add("sudoku-hidden");try{e.call(t)}catch(t){console.log("no full screen")}})}();
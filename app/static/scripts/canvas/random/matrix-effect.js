!function(){function t(){for(var t=0;t<p;t++)c[t]=a()}function i(t,i){var n=t.split(",");return n[3]=i+")",n.toString()}function n(t,i){return Math.floor(Math.random()*(i-t))+t}function a(){var t=n(0,y.length);return{position:n(-100,h.height/s*.66),chars:[e()],size:n(d,s),speed:n(4,10),primaryColour:y[t],secondaryColour:M[t],fadeRate:u[n(0,u.length)]}}function e(){return f[Math.floor(Math.random()*f.length)]}function r(t){console.log((t-g)/1e3),g=t,function(){for(var t=0;t<c.length;t++)animation%c[t].speed==0&&(c[t].chars.unshift(e()),c[t].chars.length=Math.min(c[t].chars.length,w),c[t].position++,c[t].position*c[t].size>h.height+c[t].size/c[t].fadeRate?c[t]=a():c[t].chars.forEach(function(i,a){c[t].chars[a]=n(0,100)>97?e():i}))}(),animation%2==0&&(l.clearRect(0,0,h.width,h.height),l.fillStyle=v,l.fillRect(0,0,h.width,h.height),c.forEach(function(t,n){for(var a=1,e=t.position,r=0;r<t.chars.length;r++)e>=0&&e<h.height+s&&(o?(l.fillStyle=r>m-1?i(t.secondaryColour,a):i(t.primaryColour,a-r*t.fadeRate*8),l.fillText(t.chars[r],n*s,e*s)):(l.font=t.size+"px arial",l.fillStyle=r>m-1?i(t.secondaryColour,a):i(t.primaryColour,a-r*t.fadeRate*8),l.fillText(t.chars[r],Math.floor(n/2)*s,e*s))),e-=1,a-=t.fadeRate})),animation=requestAnimationFrame(r)}var o=navigator.userAgent.toLowerCase().indexOf("firefox")>-1,h=document.getElementById("canvas1"),l=h.getContext("2d");h.width=window.innerWidth,h.height=window.innerHeight;var c=[],f="アイウエオガギグゲゴサザジズゼゾダヂツデドナニヌネノハバパヒビピフブプベホボポマミムメモヨリヰヲヸヹヺ".split(""),s=18,d=10,g=0,u=[.02,.025,.03,.05],m=1,w=Math.ceil(50+m),p=o?Math.ceil(h.width/s):2*Math.ceil(h.width/s),v="rgba(0, 0, 0, 1)",y=["rgba(255, 255, 255, 1)","rgba(215, 215, 215, 1)","rgba(175, 175, 175, 1)","rgba(135, 135, 135, 1)"],M=["rgba(123, 250, 126, 1)","rgba(83, 210, 86, 1)","rgba(43, 170, 46, 1)","rgba(3, 130, 6, 1)"];l.font="16px arial",window.addEventListener("resize",function(){cancelAnimationFrame(animation),h.width=window.innerWidth,h.height=window.innerHeight,p=Math.ceil(h.width/s),t(),animation=requestAnimationFrame(r)}),t(),animation=requestAnimationFrame(r)}();
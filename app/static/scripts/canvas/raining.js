function setup(t){t.height=window.innerHeight,t.width=window.innerWidth,bgCanvas.height=window.innerHeight,bgCanvas.width=window.innerWidth,columns=t.width/fontSize,raindrops=[];for(var a=0;a<columns;a++)raindrops[a]=100*-Math.random()}function drawCentralText(){var t=canvas.width>500?72:Math.floor(canvas.width/message.length);isIncreasing=(centralTextOpacity+=isIncreasing?5e-4:-5e-4)>.05||centralTextOpacity<0?!isIncreasing:isIncreasing,ctx.textAlign="center",ctx.fillStyle="rgba(104, 104, 104,"+centralTextOpacity+")",ctx.font=t+"px comic-sans",ctx.fillText(message,canvas.width/2,canvas.height/2),ctx.textAlign="start"}function drawRain(){ctx.fillStyle="rgba(0, 0, 0, 0.01)",ctx.fillRect(0,0,canvas.width,canvas.height),ctx.fillStyle="blue",ctx.font=fontSize+"px arial";for(var t=0;t<raindrops.length;t++){var a=binary[Math.floor(Math.random()*binary.length)];ctx.fillText(a,t*fontSize,raindrops[t]*fontSize),raindrops[t]*fontSize>canvas.height&&Math.random()>.97&&(raindrops[t]=0),raindrops[t]++}}function handleFlash(){if(isFlashing){if(flashTimer+=deltaTime,isFlashIncreasing=flashTimer<flashDuration/2,flashTimer>flashDuration){flashTimer=0,isFlashing=!isFlashing;for(var t=0;t<boltAmount;t++)createBolt()}}else isFlashing=Math.random()>.995}function drawFlash(){isFlashing?(bgCtx.fillStyle=isFlashIncreasing?"rgba(220,220,220, 1)":"rgba(0, 0, 0, 0.1)",bgCtx.fillRect(0,0,canvas.width,canvas.height)):(bgCtx.fillStyle="rgba(0, 0, 0, 1)",bgCtx.fillRect(0,0,canvas.width,canvas.height))}function drawLightning(){bolts.forEach(function(t){0===t.forks.length&&(t.x+=10,t.y+=lightningSpeed),bgCtx.beginPath(),bgCtx.moveTo(t.startX,t.startY),bgCtx.lineTo(t.x,t.y),bgCtx.lineWidth=t.weight,bgCtx.strokeStyle="#FFFF99",bgCtx.stroke(),bgCtx.closePath(),t.hasForked||(t.forks.push(createFork(t.x,t.y,t.weight)),t.hasForked=!0),t.forks.forEach(function(a,e){a[0].y>bgCanvas.height||a[1].y>bgCanvas.height?bolts.splice(bolts.indexOf(t),1):(!a[0].hasForked&&(a[0].y>t.maxForkHeight*(e+1)||a[1].y>t.maxForkHeight*(e+1))&&(a[0].hasForked=!0,a[1].hasForked=!0,t.forks.push(createFork(a[0].x,a[0].y,a[0].weight)),t.forks.push(createFork(a[1].x,a[1].y,a[1].weight))),a[0].hasForked||(a[0].x+=a[0].xv,a[0].y+=lightningSpeed,a[1].x-=a[0].xv,a[1].y+=lightningSpeed),bgCtx.beginPath(),bgCtx.moveTo(a[0].startX,a[0].startY),bgCtx.lineTo(a[0].x,a[0].y),bgCtx.lineWidth=t.forkWeight,bgCtx.strokeStyle="#FFFF99",bgCtx.stroke(),bgCtx.closePath(),bgCtx.beginPath(),bgCtx.moveTo(a[1].startX,a[1].startY),bgCtx.lineTo(a[1].x,a[1].y),bgCtx.lineWidth=a[0].weight,bgCtx.strokeStyle="#FFFF99",bgCtx.stroke(),bgCtx.closePath())})})}function createFork(t,a,e){return[{startX:t,startY:a,x:t,y:a,xv:randomNumber(3,70),weight:e-1,hasForked:!1},{startX:t,startY:a,x:t,y:a,xv:randomNumber(3,30),weight:e-1,hasForked:!1}]}function createBolt(){var t=Math.random()*(bgCanvas.width-bgCanvas.width/10)+bgCanvas.width/10,a={startX:t,startY:0,x:t,y:0,forks:[],maxForks:5,maxForkHeight:bgCanvas.height/5,weight:5,hasForked:!1};bolts.push(a)}function randomNumber(t,a){return Math.random()*(a-t)+t}function setDeltaTime(t){deltaTime=(t-lastTime)/1e3,lastTime=t}function draw(t){setDeltaTime(t),handleFlash(),drawFlash(),drawLightning(),drawRain(),drawCentralText(),animation=requestAnimationFrame(draw)}var columns,raindrops,canvas=document.getElementById("rainCanvas"),ctx=canvas.getContext("2d"),bgCanvas=document.getElementById("lightningCanvas"),bgCtx=bgCanvas.getContext("2d"),centralTextOpacity=5e-4,isIncreasing=!0,binary=["0","1"],bolts=[],fontSize=6,message="Coming soon",lastTime=0,deltaTime=0,isFlashing=!1,boltAmount=10,flashTimer=0,flashDuration=.5,isFlashIncreasing=!0,lightningSpeed=100;window.addEventListener("resize",function(){cancelAnimationFrame(animation),setup(canvas),animation=requestAnimationFrame(draw)}),setup(canvas),animation=requestAnimationFrame(draw);
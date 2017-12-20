function setDeltaTime(e){deltaTime=(e-lastTime)/1e3,lastTime=e}function setup(){canvas.height=window.innerHeight,canvas.width=window.innerWidth,circle={min:50,max:canvas.height/2-repetitions*canvas.height/20,current:50,increasing:!0,increment:1,innerDifference:5,colours:[]},hasDefaultSettings&&(document.getElementById("backgroundColour").value=backgroundColour,document.getElementById("foregroundColour").value=primaryColour,document.getElementById("repetitions").value=repetitions.toString());for(var e=0;e<repetitions;e++)circle.colours.push(primaryColour,primaryColour);circle.colours.push(primaryColour),document.body.style.backgroundColor=backgroundColour}function clearCanvas(){ctx.clearRect(0,0,canvas.width,canvas.height)}function renderBackground(){ctx.fillStyle=backgroundColour,ctx.rect(0,0,canvas.width,canvas.height),ctx.fill()}function renderConcentricCircles(){ctx.globalCompositeOperation="xor",circle.current+=circle.increasing?circle.increment:-circle.increment;for(var e=0;e<circle.colours.length;e++){ctx.fillStyle=circle.colours[e];for(var n=0;25*n<canvas.width+25;n++)ctx.beginPath(),ctx.arc(25*n,canvas.height/2,circle.current-circle.innerDifference*e,0,twoPi),ctx.fill()}ctx.globalCompositeOperation="source-over",circle.increasing=circle.current>circle.min&&circle.current<circle.max?circle.increasing:!circle.increasing}function applyUserInput(){hasDefaultSettings=!1;("range"===this.type?isAcceptedRange(this.value):isValidHexValue(this.value))?(backgroundColour=document.getElementById("backgroundColour").value,primaryColour=document.getElementById("foregroundColour").value,repetitions=parseInt(document.getElementById("repetitions").value),setup()):this.value="range"===this.type?"1":"#000000"}function isAcceptedRange(e){return!isNaN(parseInt(e)&&e>=0&&e<=4)}function isValidHexValue(e){var n=new RegExp(/^[a-f0-9]+$/);return"#"===e.charAt(0)&&n.test(e.substring(1))&&7===e.length}function render(e){setDeltaTime(e),clearCanvas(),renderBackground(),renderConcentricCircles(),animation=requestAnimationFrame(render)}var time,lastTime,deltaTime,circle,animation,canvas=document.getElementById("canvas1"),ctx=canvas.getContext("2d"),twoPi=2*Math.PI,controls=document.querySelectorAll(".random-canvas-input"),hasDefaultSettings=!0,backgroundColour="#161616",primaryColour="#005000",repetitions=0;window.addEventListener("resize",function(){cancelAnimationFrame(animation),setup(),animation=requestAnimationFrame(render)}),setup(),animation=requestAnimationFrame(render),controls.forEach(function(e){e.addEventListener("change",applyUserInput)}),document.getElementById("closeButton").addEventListener("click",function(){document.getElementById("canvasControls").classList.add("js-hidden"),document.getElementById("openButton").classList.remove("js-hidden")}),document.getElementById("openButton").addEventListener("click",function(){document.getElementById("canvasControls").classList.remove("js-hidden"),document.getElementById("openButton").classList.add("js-hidden")});
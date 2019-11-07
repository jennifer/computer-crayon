renderMtnRange();

document.querySelectorAll("li").forEach(function(el){
  el.addEventListener('click', function() {
    const colorDiv = document.querySelector(".colors");
    while (colorDiv.firstChild) {
      colorDiv.removeChild(colorDiv.firstChild);
    }
    if (this.className.includes("mtn")) {
      renderMtnRange();
    }
    else if (this.className.includes("dark")) {
      renderDarkMode();
    }
    else if (this.className.includes("old")) {
      renderOldInternet();
    }
  });
});

function renderMtnRange() {
  const colors = ["#6f9a8d", "#1f6650", "#a49ba3", "#736c72"];
  let lineWidth = 2;
  let style = document.createElement('style');
  style.innerHTML = `
    body {
      background-color: #ebe9de;
      background-image: url("images/mountains.png");
      background-size: 100% auto;
      background-position: center bottom;
      background-repeat: no-repeat;
    }
    .text {
      font-family: auto;
      color: #444;
    }
    .nav-item:hover, li:hover {
      background-color: rgba(0,0,0,0.1); 
    }
    ul {
      background-color: rgba(0,0,0,0.1);
    }
    @media (max-width: 480px) {
      body {
        background-position: center 95%;
      }
    }
  `;
  document.head.appendChild(style);
  renderPage(colors, lineWidth);
}

function renderDarkMode() {
  const colors = ["#50ce43", "#01a5ea", "#a057af", "#f7286f"];
  let lineWidth = 4;
  let style = document.createElement('style');
  style.innerHTML = `
    body {
      background-color: #1c1d1e;
      background-image: none;
    }
  .text {
    font-family: auto;
    color: #fff
  }
  .nav-item:hover, li:hover {
    background-color: rgba(255,255,255,0.2);
  }
  ul {
    background-color: rgba(255,255,255,0.2);
  }
  `;
  document.head.appendChild(style);
  renderPage(colors, lineWidth);
}

function renderOldInternet() {
  const colors = ["lime", "fuchsia", "aqua", "yellow"];
  let lineWidth = 10;
  let style = document.createElement('style');
  style.innerHTML = `
    body {
      background-image: 
      url("https://web.archive.org/web/20000828132336/http://www.geocities.com:80/Heartland/Oaks/6810/catwalkingani.gif"),
      url("https://web.archive.org/web/20090728135727/http://www.geocities.com/mycatmaomao/x-hikashi8.gif"),
      url("images/geocities.png");
      background-size: auto, auto 50px, auto;
      background-repeat: no-repeat, no-repeat, repeat;
      background-position: 20px 60px, left 98%, center; 
    }
    .text {
      color: yellow;
      font-family: "Comic Sans MS", "Comic Sans", cursive;
    }
    .nav-item:hover, li:hover {
      background-color: black;
    }
    ul {
      background-color: transparent;
    }
    @media (max-width: 1300px) {
      body {
        background-position: 20px 60px, left 94%, center;
      }
    }
  `;
  document.head.appendChild(style);
  renderPage(colors, lineWidth);
}

function renderPage(colors, lineWidth) {
  let x, y, isPainting
  const canvas = document.querySelector('canvas')
  const context = canvas.getContext('2d')
  const colorDiv = document.querySelector(".colors")
  
  colors.forEach(color => {
    const button = document.createElement("button")
    button.classList.add("color")
    button.style.backgroundColor = color
    colorDiv.appendChild(button)
    button.addEventListener('click', () => context.strokeStyle = color)
  })

  const setSize = () => {
    // set dimensions on the canvas
    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height', window.innerHeight)
    context.strokeStyle = colors[0]
    context.lineJoin = "round"
    context.lineWidth = lineWidth
  }

  setSize()

  window.addEventListener("resize", setSize)

  function getCoordinates(event) {
    // check to see if mobile or desktop
    if (["touchstart", "touchmove"].includes(event.type)) {
      // touch coordinates
      event.preventDefault();
      // document.body.addEventListener('touchmove', preventDefault, { passive: false });
      // document.body.removeEventListener('touchmove', preventDefault);
      return [event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop]
    } else {
      // click events 
      return [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop]
    }
  }

  function startPaint (e) {
    // change the old coordinates to the new ones
    isPainting = true
    let coordinates = getCoordinates(e)
    x = coordinates[0]
    y = coordinates[1]
  }

  canvas.addEventListener('touchstart', startPaint)
  canvas.addEventListener('mousedown', startPaint)

  function drawLine(firstX, firstY, secondX, secondY) {
    context.beginPath()
    context.moveTo(secondX, secondY)
    context.lineTo(firstX, firstY)
    context.closePath()
    context.stroke()
  }

  function paint(e) {
    if (isPainting) {
      let [newX, newY] = getCoordinates(e)
      drawLine(x, y, newX, newY)
      x = newX
      y = newY
    }
  }

  canvas.addEventListener('touchmove', paint)
  canvas.addEventListener('mousemove', paint)

  function exit() {
    isPainting = false
  }

  
  let clear = document.getElementsByClassName("clear");
  clear[0].addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, false);  

  canvas.addEventListener('touchend', exit)
  canvas.addEventListener('mouseup', exit)
  canvas.addEventListener('mouseleave', exit)
}


// function handleMouseMove(e) {

//   // calc where the mouse is on the canvas
//   mouseX = parseInt(e.clientX - offsetX);
//   mouseY = parseInt(e.clientY - offsetY);

//   // if the mouse is being dragged (mouse button is down)
//   // then keep drawing a polyline to this new mouse position
//   if (isMouseDown) {

//       // extend the polyline
//       ctx.lineTo(mouseX, mouseY);
//       ctx.stroke();

//       // save this x/y because we might be drawing from here
//       // on the next mousemove
//       lastX = mouseX;
//       lastY = mouseY;

//       // Command pattern stuff: Save the mouse position and 
//       // the size/color of the brush to the "undo" array
//       points.push({
//           x: mouseX,
//           y: mouseY,
//           size: brushSize,
//           color: brushColor,
//           mode: "draw"
//       });
//   }
// }

// function undoLastPoint() {

//   // remove the last drawn point from the drawing array
//   var lastPoint=points.pop();

//   // add the "undone" point to a separate redo array
//   redoStack.unshift(lastPoint);

//   // redraw all the remaining points
//   redrawAll();
// }
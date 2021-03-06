import setUpDropZone from "./dropzone";
import SpriteBorder from "./spriteborder";
import Point from "./point";
import { getEl, saveToFile } from "./utils";
import Animation from "./animation";
import { bindSelectedBorder } from "./binding";

const canvas = getEl("canvas")
const ctx = canvas.getContext("2d");
const pCanvas = getEl("player-canvas")
const pctx = pCanvas.getContext("2d");
const spriteBorders = [];

function init() {
  
}
init();

let sheetCanvas = new OffscreenCanvas(canvas.width, canvas.height);
let sheetctx = sheetCanvas.getContext('2d'); 

var padding = 0;
var padding2 = padding * 2;
var canvasBottom = 0;
function addSheet(file) {
  let spriteImg = new Image();
  spriteImg.src = URL.createObjectURL(file);
  
  spriteImg.addEventListener("load", function() {
    let topPad = padding;
    let botPad = padding;
    let w = Math.max(canvas.width, spriteImg.width + padding2);
    let h = canvasBottom + spriteImg.height + topPad;
    sizeCanvasTo(sheetCanvas, sheetctx, w, h + botPad)
    sheetctx.drawImage(spriteImg, padding, canvasBottom + padding);
    canvasBottom += spriteImg.height + topPad;

    canvas.width = sheetCanvas.width;
    canvas.height = sheetCanvas.height;
    mainDraw();
  });
}

function sizeCanvasTo(canvas, ctx, w, h) {
  let tempcanvas = document.createElement('canvas');
  let tempctx = tempcanvas.getContext('2d');
  tempcanvas.width = canvas.width; 
  tempcanvas.height = canvas.height;
  tempctx.drawImage(canvas, 0, 0);
  canvas.width = w; 
  canvas.height = h;
  ctx.drawImage(tempcanvas, 0, 0);
}

function mainDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(sheetCanvas, 0, 0);
  for (let sb of spriteBorders) {
    sb.draw(ctx, sb == selectedBorder);
  }
  updateFramedataDisplay();
}

export function qredraw() {
  setTimeout(() => mainDraw(), 0);
}

var animation = null;

const nl = "&#10;";
const framedataBox = getEl("framedata-box");
let frameSelectors = [
  Animation.getLinearFrameSelector,
  Animation.getLoopingFrameSelector,
  Animation.getReversingFrameSelector
];

function updateFramedataDisplay() {
  let str = "";
  let frames = [];

  for (let sb of spriteBorders) {
    //TODO: use string builder? maybe.
    str += sb.toString() + "," + nl;
    frames.push(sb.toFlatObj());
  }
  framedataBox.innerHTML = str;
  
  const animationDur = Number(durInput.value);
  const frameSelector = frameSelectors[framesDropdown.value](animationDur, frames.length);
  animation = new Animation(sheetCanvas, frames, frameSelector);
}

// player canvas
var playerx=100, playery=100;
function playerDraw() {
  if (animation && playerx && playery) {
    pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    animation.draw(pctx, playerx, playery, flipBox.checked, Number(scaleInput.value));
  }
  requestAnimationFrame(playerDraw);
}
requestAnimationFrame(playerDraw);


// event listeners
var cursor = new Point(null, null);
var resizingBorder = null;
var movingBorder = null;
var selectedBorder = null;

pCanvas.addEventListener("mousedown", e => {
  e.preventDefault();
  playerx = e.pageX - pCanvas.offsetLeft;
  playery = e.pageY - pCanvas.offsetTop;
  animation.play();
});

canvas.addEventListener("contextmenu", e => {
  e.preventDefault();
  ctxmenu.style.left = e.pageX + "px";
  ctxmenu.style.top = e.pageY + "px";
  cursor.x = e.pageX - canvas.offsetLeft
  cursor.y = e.pageY - canvas.offsetTop
  ctxmenu.style.display = "block";
  for (let sb of spriteBorders) {
    if (sb.contains(cursor.x, cursor.y)) {
      selectedBorder = sb;
      bindSelectedBorder(sb);
      qredraw();
      break;
    }
  }

});

canvas.addEventListener("mousedown", e => {
  e.preventDefault();
  if (ctxmenu.style.display == "block") return;
  
  ctxmenu.style.display = "none";
  cursor.x = e.pageX - canvas.offsetLeft
  cursor.y = e.pageY - canvas.offsetTop
  let canvasX = e.pageX - canvas.offsetLeft;
  let canvasY = e.pageY - canvas.offsetTop;
  for (let sb of spriteBorders) {
    if (sb.cornerContains(canvasX, canvasY)) {
      selectedBorder = sb;
      resizingBorder = sb;
      qredraw();
      break;
    } else if (sb.contains(canvasX, canvasY)) {
      selectedBorder = sb;
      movingBorder = sb;
      qredraw();
      break;
    }
  }
  bindSelectedBorder(selectedBorder);
});

canvas.addEventListener("mousemove", e => {
  if (ctxmenu.style.display == "block") return;

  let lastCursor = cursor.makeCopy();
  cursor.x = e.pageX - canvas.offsetLeft;
  cursor.y = e.pageY - canvas.offsetTop;
  let dx = cursor.x - lastCursor.x;
  let dy = cursor.y - lastCursor.y;
  if (resizingBorder != null) {
    resizingBorder.w += dx;
    resizingBorder.h += dy;
    qredraw();
  } else if (movingBorder != null) {
    // could be better...
    movingBorder.x += dx;
    movingBorder.y += dy;
    qredraw();
  }
});

canvas.addEventListener("mouseup", e => {
  if (ctxmenu.style.display == "block") return;
  
  cursor.x = e.pageX - canvas.offsetLeft
  cursor.y = e.pageY - canvas.offsetTop

  resizingBorder = null;
  movingBorder = null;
  selectedBorder = null;
  for (let sb of spriteBorders) {
    if (sb.contains(cursor.x, cursor.y)) {
      selectedBorder = sb;
    }
  }
  bindSelectedBorder(selectedBorder);
  qredraw();
});

ctxmenu.addEventListener("contextmenu", e => {
  e.preventDefault();
  ctxmenu.style.display = "none";
});

window.addEventListener("click", e => {
  ctxmenu.style.display = "none";
});


// controls
const framesDropdown = getEl("frames-dropdown");
framesDropdown.addEventListener("change", () => {
  qredraw();
});

const durInput = getEl("dur-input");
durInput.addEventListener("change", () => {
  getEl("dur-span").innerText = durInput.value;
  qredraw();
});

const scaleInput = getEl("scale-input");
scaleInput.addEventListener("change", () => {
  qredraw();
});

const flipBox = getEl("flip-checkbox");
flipBox.addEventListener("click", () => {
  qredraw();
});

const playBtn = getEl("play-btn");
playBtn.addEventListener("click", () => {
  qredraw();
});

const saveBtn = getEl("save-sheet-btn");
saveBtn.addEventListener("click", () => {
  sheetCanvas.convertToBlob({ type: "image/png" })
    .then(blob => saveToFile(blob, "spritesheet"));
});

const paddingCheckbox = getEl("padding-input");
function paddingChanged() {
  if (paddingCheckbox.checked) padding = 10;
  else padding = 0;
  padding2 = padding * 2;
}
paddingCheckbox.addEventListener("change", paddingChanged)
paddingChanged();

const backColorChooser = getEl("back-color");
const useChecker = getEl("checkerboard-checkbox");
function backColorChanged() {
  let c = backColorChooser.value;
  backColorChooser.disabled = false;
  if (useChecker.checked) {
    c = "";
    backColorChooser.disabled = true;
  }
  pCanvas.style.background = c;
  canvas.style.background = c;
}
backColorChanged()
backColorChooser.addEventListener("change", backColorChanged);
useChecker.addEventListener("change", backColorChanged);

const fileInput = getEl("file-input")
fileInput.onchange = function(e) {
  addFiles(fileInput.files);
}
setUpDropZone(e => {
  addFiles(e.dataTransfer.files)
});

function addFiles(files) {
  for (let f of files) {
    addSheet(f);
  }
}

const clipboardBtn = getEl("clipboard-btn");
clipboardBtn.addEventListener("click", function() {
  framedataBox.select();
  document.execCommand('copy');
})

//context menu controls
var spriteCounter = 0;
const newSpriteBtn = getEl("new-sprite-opt");
newSpriteBtn.addEventListener("click", e => {
  selectedBorder = new SpriteBorder(spriteCounter++, cursor.x, cursor.y)
  spriteBorders.push(selectedBorder);
  bindSelectedBorder(selectedBorder);
  mainDraw();
});

const setAnchorBtn = getEl("set-anchor-opt");
setAnchorBtn.addEventListener("click", e => {
  selectedBorder.ax = cursor.x;
  selectedBorder.ay = cursor.y;
  bindSelectedBorder(selectedBorder)
  mainDraw();
});

const removeBtn = getEl("remove-sprite-opt");
removeBtn.addEventListener("click", e => {
  for (let i = 0; i < spriteBorders.length; i++) {
    let sb = spriteBorders[i];
    if (sb.contains(cursor.x, cursor.y)) {
      spriteBorders.splice(i, 1);
      qredraw();
      return;
    }
  }
});

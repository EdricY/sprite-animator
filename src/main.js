import setUpDropZone from "./dropzone";
import SpriteBorder from "./spriteborder";
import Point from "./point";
import { saveToFile } from "./utils"

const getEl = x => document.getElementById(x)
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

function qredraw() {
  setTimeout(mainDraw, 0);
}

const nl = "&#10;";
const framedataBox = getEl("framedata-box");
function updateFramedataDisplay() {
  //TODO: populate with the different animations (only? also?)
  let str = "";
  for (let sb of spriteBorders) {
    //TODO: use string builder? maybe.
    str += sb.toString() + "," + nl;
  }
  framedataBox.innerHTML = str;
}

// event listeners
var cursor = new Point(null, null);
var resizingBorder = null;
var movingBorder = null;
var selectedBorder = null;

canvas.addEventListener("contextmenu", e => {
  e.preventDefault();
  ctxmenu.style.left = e.pageX + "px";
  ctxmenu.style.top = e.pageY + "px";
  cursor.x = e.pageX - canvas.offsetLeft
  cursor.y = e.pageY - canvas.offsetTop
  ctxmenu.style.display = "block";
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

window.addEventListener("mouseup", e => {
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

const backColorChooser = getEl("back-color")
function backColorChanged() {
  let c = backColorChooser.value
  pCanvas.style.backgroundColor = c;
  canvas.style.backgroundColor = c;
}
backColorChanged()
backColorChooser.addEventListener("change", backColorChanged);

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
  spriteBorders.push(new SpriteBorder(spriteCounter++, cursor.x, cursor.y));
  mainDraw();
});

const setAnchorBtn = getEl("set-anchor-opt");
setAnchorBtn.addEventListener("click", e => {
  // TODO
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

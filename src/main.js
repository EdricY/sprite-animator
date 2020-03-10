import setUpDropZone from "./dropzone";
import SpriteBorder from "./spriteborder";
import Point from "./point";

const getEl = x => document.getElementById(x)
const canvas = getEl("canvas")
const ctx = canvas.getContext("2d");
const pCanvas = getEl("player-canvas")
const pctx = pCanvas.getContext("2d");

function init() {
  
}
init();

let sheetCanvas = new OffscreenCanvas(canvas.width, canvas.height);
let sheetctx = sheetCanvas.getContext('2d'); 

const fileInput = getEl("file-input")
fileInput.onchange = function(e) {
  addFiles(e.target.files);
}
setUpDropZone(e => {
  addFiles(e.dataTransfer.files)
});

function addFiles(files) {
  for (let f of files) {
    addSheet(f);
  }
}

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
    sizeCanvasTo(sheetCanvas, w, h + botPad)
    sheetctx.drawImage(spriteImg, padding, canvasBottom + padding);
    canvasBottom += spriteImg.height + topPad;

    canvas.width = sheetCanvas.width;
    canvas.height = sheetCanvas.height;
    mainDraw();
  })
}

function sizeCanvasTo(canvas, w, h) {
  let tempcanvas = document.createElement('canvas');
  let tempctx = tempcanvas.getContext('2d');
  tempcanvas.width = canvas.width; 
  tempcanvas.height = canvas.height;
  tempctx.drawImage(canvas, 0, 0);
  canvas.width = w; 
  canvas.height = h;
  ctx.drawImage(tempcanvas, 0, 0);
}

const paddingCheckbox = getEl("padding-input");
function paddingChanged(e) {
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

var cursor = new Point(null, null);
canvas.addEventListener("contextmenu", e => {
  e.preventDefault();
  ctxmenu.style.left = e.pageX + "px";
  ctxmenu.style.top = e.pageY + "px";
  cursor.x = e.pageX - canvas.offsetLeft
  cursor.y = e.pageY - canvas.offsetTop
  ctxmenu.style.display = "block";
});

window.addEventListener("click", e => {
  e.preventDefault();
  ctxmenu.style.display = "none";
});

const newSpriteBtn = getEl("new-sprite-opt");
newSpriteBtn.addEventListener("click", e => {
  spriteBorders.push(new SpriteBorder(spriteBorders.length, cursor.x, cursor.y));
  mainDraw();
});

var spriteBorders = [];

function mainDraw() {
  ctx.drawImage(sheetCanvas, 0, 0);
  for (let sb of spriteBorders) {
    sb.draw(ctx, false);
  }
}



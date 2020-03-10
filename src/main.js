import setUpDropZone from "./dropzone";

const getEl = x => document.getElementById(x)
const canvas = getEl("canvas")
const ctx = canvas.getContext("2d");
const pCanvas = getEl("player-canvas")
const pctx = pCanvas.getContext("2d");

function init() {
  
}
init();


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
    sizeCanvasTo(canvas, w, h + botPad)
    ctx.drawImage(spriteImg, padding, canvasBottom + padding);
    canvasBottom += spriteImg.height + topPad;
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

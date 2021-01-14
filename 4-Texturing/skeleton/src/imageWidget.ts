import { createWindow, Window } from './lib/window';

export default class ImageWidget{
  Container: HTMLElement
  Img: HTMLImageElement
  DrawingCanvas: HTMLCanvasElement
  flag: boolean
  currX: number
  currY: number
  drawingDisabled: boolean

  constructor(parent: HTMLElement | Window) {
    parent.style.justifyContent = "center";
    parent.style.alignItems = "center";

    this.Container = createWindow("imgContainer");
    this.Container.style.width = "60%";
    this.Container.style.paddingBottom = "60%";
    parent.appendChild(this.Container);

    this.Img = document.createElement('img');
    this.Img.style.position = "absolute";
    this.Img.style.top = "0";
    this.Img.style.left = "0";
    this.Img.style.width = "100%";
    this.Img.style.height = "100%";
    this.Container.appendChild(this.Img);

    this.DrawingCanvas = document.createElement('canvas');
    this.DrawingCanvas.style.position = "absolute";
    this.DrawingCanvas.style.top = "0";
    this.DrawingCanvas.style.left = "0";
    this.DrawingCanvas.width = 1024;
    this.DrawingCanvas.height = 1024;
    this.DrawingCanvas.style.width = "100%";
    this.DrawingCanvas.style.height = "100%";
    this.Container.appendChild(this.DrawingCanvas);

    // DrawingCanvas
    this.flag = false;
    this.currX = 0;
    this.currY = 0;
    this.drawingDisabled = true;
    this.DrawingCanvas.addEventListener("mousemove", (e) => this.findxy('move', e), false);
    this.DrawingCanvas.addEventListener("mousedown", (e) => this.findxy('down', e), false);
    this.DrawingCanvas.addEventListener("mouseup", (e) => this.findxy('up', e), false);
    this.DrawingCanvas.addEventListener("mouseout", (e) => this.findxy('out', e), false);

  }

  draw(prevX: number, prevY: number, currX: number, currY: number) {
    let ctx = this.DrawingCanvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(this.currX-1, this.currY-1, 2, 2);
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(currX, currY);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.closePath();
    }
  }

  findxy(res: string, e: MouseEvent) {
    if (this.drawingDisabled){
      return
    }
    // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
    function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }
    if (res == 'down') {
      let ctx = this.DrawingCanvas.getContext("2d");
      this.currX = getMousePos(this.DrawingCanvas,e).x;
      this.currY = getMousePos(this.DrawingCanvas,e).y;

      this.flag = true;
      if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(this.currX-1, this.currY-1, 2, 2);
        ctx.closePath();
        var event = new CustomEvent('updated');
        this.DrawingCanvas.dispatchEvent(event);
      }
    } else if (res == 'up' || res == "out") {
      this.flag = false;
    } else if (res == 'move') {
      if (this.flag) {
        let prevX = this.currX;
        let prevY = this.currY;
        this.currX = getMousePos(this.DrawingCanvas,e).x;
        this.currY = getMousePos(this.DrawingCanvas,e).y;
        this.draw(prevX, prevY, this.currX, this.currY);
        var event = new CustomEvent('updated');
        this.DrawingCanvas.dispatchEvent(event);
      }
    }
  }

  clearDrawing() {
    let ctx = this.DrawingCanvas.getContext("2d");
    if (ctx){
      ctx.clearRect(0, 0, this.DrawingCanvas.width, this.DrawingCanvas.height);
      var event = new CustomEvent('updated');
      this.DrawingCanvas.dispatchEvent(event);
    }
  }

  enableDrawing() {
    this.drawingDisabled = false
  }

  disableDrawing() {
    this.drawingDisabled = true
  }

  setImage(source_path: string){
    this.Img.src = source_path;
  }

  getDrawingCanvas(){
    return this.DrawingCanvas;
  }
}

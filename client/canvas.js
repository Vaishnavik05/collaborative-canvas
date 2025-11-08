class Canvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.currentTool = 'pen';
    this.currentColor = '#000000';
    this.currentSize = 5;
    this.lastX = 0;
    this.lastY = 0;
    this.localStrokes = [];
    this.currentStroke = null;
    this.setupCanvas();
    this.setupEventListeners();
  }

  setupCanvas() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.setupCanvas());
  }

  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
    this.currentStroke = {
      lines: [],
      tool: this.currentTool,
      color: this.currentColor,
      size: this.currentSize
    };
    return true;
  }

  draw(e) {
    if (!this.isDrawing) return null;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const drawData = {
      x0: this.lastX,
      y0: this.lastY,
      x1: x,
      y1: y,
      color: this.currentColor,
      size: this.currentSize,
      tool: this.currentTool
    };
    this.drawLine(drawData);
    if (this.currentStroke) this.currentStroke.lines.push(drawData);
    this.lastX = x;
    this.lastY = y;
    return drawData;
  }

  stopDrawing() {
    if (this.isDrawing && this.currentStroke && this.currentStroke.lines.length > 0) {
      this.localStrokes.push(this.currentStroke);
      this.currentStroke = null;
      this.isDrawing = false;
      return true;
    }
    this.isDrawing = false;
    return false;
  }

  drawLine(data) {
    this.ctx.beginPath();
    this.ctx.moveTo(data.x0, data.y0);
    this.ctx.lineTo(data.x1, data.y1);
    if (data.tool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = data.color;
    }
    this.ctx.lineWidth = data.size;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.globalCompositeOperation = 'source-over';
  }

  drawStroke(stroke) {
    if (stroke && stroke.lines) {
      stroke.lines.forEach(line => this.drawLine(line));
    }
  }

  drawRemoteLine(data) {
    this.drawLine(data);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.localStrokes = [];
  }

  redrawAllStrokes(strokes) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    strokes.forEach(stroke => this.drawStroke(stroke));
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  setColor(color) {
    this.currentColor = color;
  }

  setSize(size) {
    this.currentSize = size;
  }

  getMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
}
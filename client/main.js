let canvas;
let wsClient;

document.addEventListener('DOMContentLoaded', () => {
  const canvasElement = document.getElementById('drawing-canvas');
  canvas = new Canvas(canvasElement);
  window.canvas = canvas;

  wsClient = new WebSocketClient();

  const userColor = generateRandomColor();
  wsClient.joinRoom({
    name: `User-${Math.floor(Math.random() * 1000)}`,
    color: userColor
  });

  setupToolbar();
  setupDrawingEvents();
});

function setupToolbar() {
  const toolButtons = document.querySelectorAll('.tool-btn');
  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.getAttribute('data-tool');
      canvas.setTool(tool);
      toolButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const colorPicker = document.getElementById('color-picker');
      if (tool === 'eraser') {
        colorPicker.disabled = true;
        colorPicker.style.opacity = '0.5';
      } else {
        colorPicker.disabled = false;
        colorPicker.style.opacity = '1';
      }
    });
  });

  document.getElementById('color-picker').addEventListener('change', (e) => {
    canvas.setColor(e.target.value);
  });

  const sizeSlider = document.getElementById('size-slider');
  const sizeValue = document.getElementById('size-value');
  sizeSlider.addEventListener('input', (e) => {
    const size = e.target.value;
    canvas.setSize(parseInt(size));
    sizeValue.textContent = size;
  });

  document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Clear the entire canvas for all users?')) {
      canvas.clearCanvas();
      wsClient.clearCanvas();
    }
  });

  document.getElementById('undo-btn').addEventListener('click', () => {
    wsClient.undo();
  });

  document.getElementById('redo-btn').addEventListener('click', () => {
    wsClient.redo();
  });
}

function setupDrawingEvents() {
  const canvasElement = document.getElementById('drawing-canvas');

  canvasElement.addEventListener('mousedown', (e) => {
    if (canvas.startDrawing(e)) wsClient.startDrawing();
  });

  canvasElement.addEventListener('mousemove', (e) => {
    const pos = canvas.getMousePosition(e);
    wsClient.sendCursorPosition(pos.x, pos.y);
    document.getElementById('coordinates').textContent = `X: ${Math.floor(pos.x)}, Y: ${Math.floor(pos.y)}`;
    if (canvas.isDrawing) {
      const drawData = canvas.draw(e);
      if (drawData) wsClient.sendDrawing(drawData);
    }
  });

  canvasElement.addEventListener('mouseup', () => {
    if (canvas.stopDrawing()) wsClient.endDrawing();
  });

  canvasElement.addEventListener('mouseout', () => {
    if (canvas.stopDrawing()) wsClient.endDrawing();
  });

  canvasElement.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvasElement.dispatchEvent(mouseEvent);
  });

  canvasElement.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvasElement.dispatchEvent(mouseEvent);
  });

  canvasElement.addEventListener('touchend', (e) => {
    e.preventDefault();
    canvasElement.dispatchEvent(new MouseEvent('mouseup', {}));
  });
}

function generateRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  return colors[Math.floor(Math.random() * colors.length)];
}
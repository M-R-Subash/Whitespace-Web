// Drawing utility functions
export class DrawingUtils {
  static drawLine(ctx, start, end, color, brushSize) {
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  static drawRectangle(ctx, start, end, color, brushSize) {
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = 'source-over';
    
    const width = end.x - start.x;
    const height = end.y - start.y;
    
    ctx.strokeRect(start.x, start.y, width, height);
  }

  static drawCircle(ctx, center, end, color, brushSize) {
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = 'source-over';
    
    const radius = Math.sqrt(
      Math.pow(end.x - center.x, 2) + Math.pow(end.y - center.y, 2)
    );
    
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  static drawLineTool(ctx, start, end, color, brushSize) {
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'source-over';
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  static erase(ctx, start, end, brushSize) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    ctx.globalCompositeOperation = 'source-over';
  }

  static getDistance(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  static smoothPoints(points, tolerance = 0.5) {
    if (points.length < 3) return points;
    
    const smoothed = [points[0]];
    
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const current = points[i];
      const next = points[i + 1];
      
      const smoothedPoint = {
        x: (prev.x + current.x + next.x) / 3,
        y: (prev.y + current.y + next.y) / 3
      };
      
      smoothed.push(smoothedPoint);
    }
    
    smoothed.push(points[points.length - 1]);
    return smoothed;
  }

  static createDrawingData(points, tool, color, brushSize, userId) {
    return {
      id: `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: tool,
      points: tool === 'pen' || tool === 'eraser' ? this.smoothPoints(points) : points,
      color: tool === 'eraser' ? '#ffffff' : color,
      brushSize,
      userId,
      timestamp: Date.now()
    };
  }

  static redrawCanvas(canvas, drawings) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set default composite operation
    ctx.globalCompositeOperation = 'source-over';
    
    drawings.forEach(drawing => {
      this.drawFromData(ctx, drawing);
    });
  }

  static drawFromData(ctx, drawing) {
    const { type, points, color, brushSize } = drawing;
    
    if (points.length < 1) return;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
    
    if (type === 'rectangle' && points.length >= 2) {
      const start = points[0];
      const end = points[points.length - 1];
      this.drawRectangle(ctx, start, end, color, brushSize);
    } else if (type === 'circle' && points.length >= 2) {
      const start = points[0];
      const end = points[points.length - 1];
      this.drawCircle(ctx, start, end, color, brushSize);
    } else if (type === 'line' && points.length >= 2) {
      const start = points[0];
      const end = points[points.length - 1];
      this.drawLineTool(ctx, start, end, color, brushSize);
    } else if (type === 'eraser') {
      // For eraser, we need to handle it differently during redraw
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      
      if (points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    } else {
      // For pen
      ctx.strokeStyle = color;
      ctx.globalCompositeOperation = 'source-over';
      
      if (points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
      }
    }
  }
}
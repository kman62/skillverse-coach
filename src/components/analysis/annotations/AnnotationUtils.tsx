
import { Results } from '@mediapipe/pose';

// Draw stance analysis annotations
export const drawStanceAnalysis = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number
) => {
  // Draw stance guide lines
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'; // green
  ctx.lineWidth = 2;
  
  // Foot position indicators
  const footY = height * 0.85;
  ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
  ctx.beginPath();
  ctx.ellipse(width * 0.4, footY, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(width * 0.6, footY, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Body alignment line
  ctx.beginPath();
  ctx.moveTo(width * 0.5, height * 0.3);
  ctx.lineTo(width * 0.5, height * 0.8);
  ctx.stroke();
  
  // Label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(20, 50, 150, 30);
  ctx.fillStyle = 'rgba(34, 197, 94, 1)';
  ctx.font = '14px sans-serif';
  ctx.fillText('STANCE ANALYSIS', 35, 70);
};

// Draw movement analysis annotations
export const drawMovementAnalysis = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number,
  time: number
) => {
  // Draw movement trajectory
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)'; // yellow
  ctx.lineWidth = 3;
  
  // Oscillation based on time for animation effect
  const oscillation = Math.sin(time * 5) * 20;
  
  // Movement arc
  ctx.beginPath();
  ctx.moveTo(width * 0.3, height * 0.6);
  ctx.quadraticCurveTo(
    width * 0.5, 
    height * 0.3 + oscillation, 
    width * 0.7, 
    height * 0.6
  );
  ctx.stroke();
  
  // Direction arrow
  const arrowSize = 15;
  const arrowX = width * 0.6;
  const arrowY = height * 0.5 + oscillation;
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
  ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize);
  ctx.closePath();
  ctx.fillStyle = 'rgba(234, 179, 8, 0.8)';
  ctx.fill();
  
  // Label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(20, 50, 180, 30);
  ctx.fillStyle = 'rgba(234, 179, 8, 1)';
  ctx.font = '14px sans-serif';
  ctx.fillText('MOVEMENT ANALYSIS', 35, 70);
};

// Draw completion analysis annotations
export const drawCompletionAnalysis = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number
) => {
  // Draw form completion indicators
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)'; // purple
  ctx.lineWidth = 2;
  
  // Form completion zone
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.4);
  ctx.bezierCurveTo(
    width * 0.3, height * 0.2,
    width * 0.7, height * 0.2,
    width * 0.8, height * 0.4
  );
  ctx.lineTo(width * 0.7, height * 0.7);
  ctx.lineTo(width * 0.3, height * 0.7);
  ctx.closePath();
  ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
  ctx.fill();
  ctx.stroke();
  
  // Checkmark for good completion
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.9)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width * 0.4, height * 0.5);
  ctx.lineTo(width * 0.45, height * 0.6);
  ctx.lineTo(width * 0.6, height * 0.4);
  ctx.stroke();
  
  // Label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(20, 50, 200, 30);
  ctx.fillStyle = 'rgba(168, 85, 247, 1)';
  ctx.font = '14px sans-serif';
  ctx.fillText('COMPLETION ANALYSIS', 35, 70);
};

// Draw score indicator
export const drawScore = (
  ctx: CanvasRenderingContext2D, 
  score: number,
  width: number, 
  height: number
) => {
  // Draw score in top right corner
  const scoreX = width - 70;
  const scoreY = 30;
  const scoreRadius = 25;
  
  // Score background
  ctx.beginPath();
  ctx.arc(scoreX, scoreY, scoreRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fill();
  
  // Score border - color based on score
  let borderColor = 'rgba(239, 68, 68, 0.9)'; // red
  if (score >= 70) borderColor = 'rgba(234, 179, 8, 0.9)'; // yellow
  if (score >= 85) borderColor = 'rgba(34, 197, 94, 0.9)'; // green
  
  ctx.beginPath();
  ctx.arc(scoreX, scoreY, scoreRadius, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Score text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(score.toString(), scoreX, scoreY);
};

// Draw all analysis annotations
export const drawAnalysisAnnotations = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number,
  currentTime: number,
  totalDuration: number,
  analysisResult: any
) => {
  // Only draw if we have analysis results
  if (!analysisResult) return;
  
  // Calculate progress through video
  const progress = totalDuration ? currentTime / totalDuration : 0;
  
  // Frame around the video
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  // Draw different annotations based on video time
  if (progress < 0.33) {
    drawStanceAnalysis(ctx, width, height);
  } else if (progress < 0.66) {
    drawMovementAnalysis(ctx, width, height, currentTime);
  } else {
    drawCompletionAnalysis(ctx, width, height);
  }
  
  // Always show score
  const score = analysisResult.score || 75;
  drawScore(ctx, score, width, height);
};

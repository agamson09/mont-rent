import * as THREE from 'three';

// Helper to create procedural wood grain texture
export function createWoodTexture(baseColorHex: string, darkGrainHex: string): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, 512, 512);

    // Draw wood grain lines
    ctx.strokeStyle = darkGrainHex;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.18;

    for (let i = 0; i < 512; i += 6) {
      ctx.beginPath();
      ctx.moveTo(0, i + Math.sin(i * 0.05) * 4);
      for (let x = 0; x < 512; x += 30) {
        ctx.lineTo(x, i + Math.sin((x + i) * 0.04) * 5);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Helper to create procedural screen texture (VS Code / Terminal / Figma)
export function createScreenTexture(variant: 'vscode' | 'dual' | 'ultrawide' | 'superwide'): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark editor background
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, 1024, 512);

    // Top title bar with window buttons
    ctx.fillStyle = '#161B22';
    ctx.fillRect(0, 0, 1024, 40);

    // Window controls
    ctx.fillStyle = '#FF5F56';
    ctx.beginPath();
    ctx.arc(25, 20, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFBD2E';
    ctx.beginPath();
    ctx.arc(50, 20, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#27C93F';
    ctx.beginPath();
    ctx.arc(75, 20, 8, 0, Math.PI * 2);
    ctx.fill();

    // Editor tab text
    ctx.fillStyle = '#C9D1D9';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('workspace.tsx — DreamDesk Monis.rent', 110, 26);

    // Code lines
    ctx.font = '15px monospace';
    const lines = [
      { text: 'import { BaliNomadStudio } from "@/monis";', color: '#FF7B72' },
      { text: 'import { StandingDesk, ErgoChair } from "@/gear";', color: '#FFA657' },
      { text: '', color: '#FFF' },
      { text: 'export const setup = () => {', color: '#D2A8FF' },
      { text: '  const villa = "Canggu Batu Bolong 🌴";', color: '#7EE787' },
      { text: '  const internet = "1 Gbps Fiber Ready ⚡";', color: '#7EE787' },
      { text: '  const desk = new StandingDesk({ wood: "Teak" });', color: '#79C0FF' },
      { text: '  const chair = new ErgoChair({ mesh: "Aero" });', color: '#79C0FF' },
      { text: '  return rentWorkspace({ desk, chair, delivery: "Next-Day" });', color: '#FFA657' },
      { text: '};', color: '#D2A8FF' },
      { text: '', color: '#FFF' },
      { text: '// Status: 100% Focused in Bali. Ready to Rent!', color: '#8B949E' },
    ];

    let y = 80;
    lines.forEach((line) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 35, y);
      y += 28;
    });

    // Terminal bottom drawer
    ctx.fillStyle = '#010409';
    ctx.fillRect(0, 420, 1024, 92);
    ctx.strokeStyle = '#30363D';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 420, 1024, 92);

    ctx.fillStyle = '#3FB950';
    ctx.font = '14px monospace';
    ctx.fillText('➜ dreamdesk git:(main) ✔ Turbopack ready in 140ms — Enjoy Bali!', 25, 460);
    ctx.fillText('➜ rent-status: confirmed • delivery: tomorrow 10:00 AM WITA', 25, 490);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Helper to create villa hardwood floor texture
export function createFloorTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#B07D4C';
    ctx.fillRect(0, 0, 1024, 1024);

    // Plank seams
    const plankHeight = 128;
    ctx.strokeStyle = '#5A381B';
    ctx.lineWidth = 3;

    for (let y = 0; y < 1024; y += plankHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();

      // Vertical plank staggered joints
      const offset = (y / plankHeight) % 2 === 0 ? 0 : 256;
      for (let x = offset; x < 1024; x += 512) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + plankHeight);
        ctx.stroke();
      }
    }

    // Subtle grain variation
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 200; i++) {
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 300, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

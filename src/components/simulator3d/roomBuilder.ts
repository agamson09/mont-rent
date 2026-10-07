import * as THREE from 'three';
import { createFloorTexture } from './materials';

export function buildRoom3D(
  backdrop: 'villa-pool' | 'rice-terrace' | 'minimal-studio',
  lightingMode: 'day' | 'sunset' | 'night'
): THREE.Group {
  const roomGroup = new THREE.Group();
  roomGroup.name = 'RoomRoot';

  // 1. Villa Hardwood Floor
  const floorTex = createFloorTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.5,
    metalness: 0.05,
  });

  const floorGeo = new THREE.PlaneGeometry(8, 8);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  roomGroup.add(floor);

  // 2. Rear Villa Wall
  const wallColors = {
    day: 0xf3eeea,
    sunset: 0xf1d6c5,
    night: 0x1e293b,
  };

  const wallMat = new THREE.MeshStandardMaterial({
    color: wallColors[lightingMode],
    roughness: 0.9,
    metalness: 0.0,
  });

  const wallGeo = new THREE.PlaneGeometry(8, 4.5);
  const backWall = new THREE.Mesh(wallGeo, wallMat);
  backWall.position.set(0, 2.25, -1.35);
  backWall.receiveShadow = true;
  roomGroup.add(backWall);

  // Skirting Board
  const skirtingGeo = new THREE.BoxGeometry(8, 0.12, 0.02);
  const skirtingMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
  const skirting = new THREE.Mesh(skirtingGeo, skirtingMat);
  skirting.position.set(0, 0.06, -1.34);
  roomGroup.add(skirting);

  // 3. Large Arched Villa Window / Panoramic Glass Opening
  const windowFrameGeo = new THREE.BoxGeometry(3.6, 2.4, 0.04);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const windowFrame = new THREE.Mesh(windowFrameGeo, frameMat);
  windowFrame.position.set(0, 1.9, -1.32);
  roomGroup.add(windowFrame);

  // Outer Window Sill
  const sillGeo = new THREE.BoxGeometry(3.8, 0.05, 0.12);
  const sill = new THREE.Mesh(sillGeo, frameMat);
  sill.position.set(0, 0.7, -1.3);
  roomGroup.add(sill);

  // Window Pane Picture / View Texture
  const viewCanvas = document.createElement('canvas');
  viewCanvas.width = 1024;
  viewCanvas.height = 512;
  const ctx = viewCanvas.getContext('2d');

  if (ctx) {
    if (backdrop === 'villa-pool') {
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
      if (lightingMode === 'sunset') {
        skyGrad.addColorStop(0, '#f97316');
        skyGrad.addColorStop(1, '#ec4899');
      } else if (lightingMode === 'night') {
        skyGrad.addColorStop(0, '#090d16');
        skyGrad.addColorStop(1, '#1e1b4b');
      } else {
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(1, '#e0f2fe');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1024, 300);

      // Turquoise Pool Water
      ctx.fillStyle = lightingMode === 'night' ? '#0c4a6e' : '#0284c7';
      ctx.fillRect(0, 300, 1024, 212);

      // Pool ripples
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.4;
      for (let y = 320; y < 512; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(250, y - 8, 500, y + 8, 1024, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Tropical palms on horizon
      ctx.fillStyle = lightingMode === 'night' ? '#022c22' : '#047857';
      ctx.beginPath();
      ctx.arc(200, 300, 160, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(820, 300, 190, Math.PI, 0);
      ctx.fill();
    } else if (backdrop === 'rice-terrace') {
      // Lush cascading green hills
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 200);
      skyGrad.addColorStop(0, lightingMode === 'sunset' ? '#ea580c' : '#7dd3fc');
      skyGrad.addColorStop(1, lightingMode === 'sunset' ? '#fde047' : '#ecfccb');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Green terrace layers
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(0, 220);
      ctx.bezierCurveTo(300, 190, 700, 240, 1024, 210);
      ctx.lineTo(1024, 512);
      ctx.lineTo(0, 512);
      ctx.fill();

      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(0, 280);
      ctx.bezierCurveTo(400, 250, 800, 310, 1024, 270);
      ctx.lineTo(1024, 512);
      ctx.lineTo(0, 512);
      ctx.fill();
    } else {
      // Minimalist Loft
      ctx.fillStyle = lightingMode === 'night' ? '#0f172a' : '#e2e8f0';
      ctx.fillRect(0, 0, 1024, 512);
    }
  }

  const viewTex = new THREE.CanvasTexture(viewCanvas);
  const viewMat = new THREE.MeshBasicMaterial({ map: viewTex });
  const viewGeo = new THREE.PlaneGeometry(3.5, 2.3);
  const viewMesh = new THREE.Mesh(viewGeo, viewMat);
  viewMesh.position.set(0, 1.9, -1.31);
  roomGroup.add(viewMesh);

  // Window mullions / dividing bars
  const mullionMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.3, 0.03), mullionMat);
  vMullion.position.set(0, 1.9, -1.3);
  roomGroup.add(vMullion);

  const hMullion = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.04, 0.03), mullionMat);
  hMullion.position.set(0, 1.9, -1.3);
  roomGroup.add(hMullion);

  return roomGroup;
}

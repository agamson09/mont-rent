import * as THREE from 'three';
import { createFloorTexture } from './materials';

export function buildRoom3D(
  backdrop: 'villa-pool' | 'rice-terrace' | 'minimal-studio',
  lightingMode: 'day' | 'sunset' | 'night'
): THREE.Group {
  const roomGroup = new THREE.Group();
  roomGroup.name = 'RoomRoot';

  // 1. Villa Hardwood Floor (Large 10m x 10m)
  const floorTex = createFloorTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.45,
    metalness: 0.08,
  });

  const floorGeo = new THREE.PlaneGeometry(10, 10);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  roomGroup.add(floor);

  // 2. Wall Colors & Materials
  const wallColors = {
    day: 0xfaf6f0, // Warm Balinese limestone plaster
    sunset: 0xf5ded0, // Golden hour amber reflection
    night: 0x1a2234, // Night ambient dark slate
  };

  const wallMat = new THREE.MeshStandardMaterial({
    color: wallColors[lightingMode],
    roughness: 0.85,
    metalness: 0.0,
  });

  const skirtingMat = new THREE.MeshStandardMaterial({ color: 0x3d2010, roughness: 0.6 });

  // 3. Side Walls (Enclosing the room so there is no awkward black void)
  // Left Wall
  const leftWallGeo = new THREE.PlaneGeometry(8, 4.5);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
  leftWall.position.set(-3.2, 2.25, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  roomGroup.add(leftWall);

  const leftSkirting = new THREE.Mesh(new THREE.BoxGeometry(8, 0.12, 0.02), skirtingMat);
  leftSkirting.position.set(-3.19, 0.06, 0);
  leftSkirting.rotation.y = Math.PI / 2;
  roomGroup.add(leftSkirting);

  // Right Wall
  const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
  rightWall.position.set(3.2, 2.25, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  roomGroup.add(rightWall);

  const rightSkirting = new THREE.Mesh(new THREE.BoxGeometry(8, 0.12, 0.02), skirtingMat);
  rightSkirting.position.set(3.19, 0.06, 0);
  rightSkirting.rotation.y = -Math.PI / 2;
  roomGroup.add(rightSkirting);

  // 4. Rear Wall WITH A TRUE HOLLOW WINDOW OPENING (Width: 3.2m, Height: 2.1m)
  // Window opening spans from X: -1.6 to +1.6, and Y: 0.85 to 2.95 at Z = -1.35
  const wallZ = -1.35;

  // A. Left Wall Segment
  const leftSegGeo = new THREE.PlaneGeometry(1.6, 4.5);
  const leftSeg = new THREE.Mesh(leftSegGeo, wallMat);
  leftSeg.position.set(-2.4, 2.25, wallZ);
  leftSeg.receiveShadow = true;
  roomGroup.add(leftSeg);

  // B. Right Wall Segment
  const rightSegGeo = new THREE.PlaneGeometry(1.6, 4.5);
  const rightSeg = new THREE.Mesh(rightSegGeo, wallMat);
  rightSeg.position.set(2.4, 2.25, wallZ);
  rightSeg.receiveShadow = true;
  roomGroup.add(rightSeg);

  // C. Bottom Wall Segment (below window sill)
  const bottomSegGeo = new THREE.PlaneGeometry(3.2, 0.85);
  const bottomSeg = new THREE.Mesh(bottomSegGeo, wallMat);
  bottomSeg.position.set(0, 0.425, wallZ);
  bottomSeg.receiveShadow = true;
  roomGroup.add(bottomSeg);

  // D. Top Wall Segment (above window header)
  const topSegGeo = new THREE.PlaneGeometry(3.2, 1.55);
  const topSeg = new THREE.Mesh(topSegGeo, wallMat);
  topSeg.position.set(0, 3.725, wallZ);
  topSeg.receiveShadow = true;
  roomGroup.add(topSeg);

  // Rear Skirting
  const rearSkirtingL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.02), skirtingMat);
  rearSkirtingL.position.set(-2.4, 0.06, wallZ + 0.01);
  roomGroup.add(rearSkirtingL);

  const rearSkirtingR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.02), skirtingMat);
  rearSkirtingR.position.set(2.4, 0.06, wallZ + 0.01);
  roomGroup.add(rearSkirtingR);

  // 5. Open Architectural Window Frame (Surrounding the opening)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 });
  const frameZ = wallZ + 0.02;

  // Top Frame Beam
  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.08, 0.06), frameMat);
  topFrame.position.set(0, 2.95, frameZ);
  roomGroup.add(topFrame);

  // Bottom Window Sill (Deep wooden/stone sill)
  const sill = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.16), frameMat);
  sill.position.set(0, 0.85, frameZ + 0.04);
  sill.receiveShadow = true;
  roomGroup.add(sill);

  // Left Frame Post
  const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.06), frameMat);
  leftPost.position.set(-1.6, 1.9, frameZ);
  roomGroup.add(leftPost);

  // Right Frame Post
  const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.06), frameMat);
  rightPost.position.set(1.6, 1.9, frameZ);
  roomGroup.add(rightPost);

  // Center Vertical Mullion
  const centerMullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.1, 0.04), frameMat);
  centerMullion.position.set(0, 1.9, frameZ);
  roomGroup.add(centerMullion);

  // Center Horizontal Mullion
  const hMullion = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.04, 0.04), frameMat);
  hMullion.position.set(0, 1.9, frameZ);
  roomGroup.add(hMullion);

  // 6. OUTDOOR SCENERY PLANE (Placed at Z = -1.45, behind the opening)
  const sceneryCanvas = document.createElement('canvas');
  sceneryCanvas.width = 1024;
  sceneryCanvas.height = 640;
  const ctx = sceneryCanvas.getContext('2d');

  if (ctx) {
    if (backdrop === 'villa-pool') {
      // --- VILLA POOL & PALMS ---
      // Tropical Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 380);
      if (lightingMode === 'sunset') {
        skyGrad.addColorStop(0, '#7c2d12');
        skyGrad.addColorStop(0.3, '#ea580c');
        skyGrad.addColorStop(0.7, '#f97316');
        skyGrad.addColorStop(1, '#fed7aa');
      } else if (lightingMode === 'night') {
        skyGrad.addColorStop(0, '#030712');
        skyGrad.addColorStop(0.5, '#0f172a');
        skyGrad.addColorStop(1, '#1e1b4b');
      } else {
        // Bright Bali Cyan Day
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.5, '#38bdf8');
        skyGrad.addColorStop(1, '#bae6fd');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1024, 380);

      // Tropical Sun / Moon
      if (lightingMode === 'day') {
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(260, 140, 55, 0, Math.PI * 2);
        ctx.fill();
      } else if (lightingMode === 'sunset') {
        ctx.fillStyle = '#FDBA74';
        ctx.beginPath();
        ctx.arc(512, 280, 65, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Starry night with moon
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.arc(780, 100, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(770, 95, 33, 0, Math.PI * 2);
        ctx.fill();
      }

      // Distant Bali Volcano (Mount Agung) Silhouette
      ctx.fillStyle = lightingMode === 'night' ? '#090d16' : lightingMode === 'sunset' ? '#9a3412' : '#0369a1';
      ctx.beginPath();
      ctx.moveTo(100, 380);
      ctx.lineTo(400, 220);
      ctx.lineTo(650, 380);
      ctx.fill();

      // Lush Tropical Palm Trees & Villa Frangipani Canopy
      ctx.fillStyle = lightingMode === 'night' ? '#022c22' : lightingMode === 'sunset' ? '#14532d' : '#047857';
      // Left Palm Groves
      ctx.beginPath();
      ctx.arc(120, 380, 180, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(280, 380, 160, Math.PI, 0);
      ctx.fill();
      // Right Palm Groves
      ctx.beginPath();
      ctx.arc(880, 380, 200, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(740, 380, 150, Math.PI, 0);
      ctx.fill();

      // Crystalline Turquoise Villa Pool Water
      ctx.fillStyle = lightingMode === 'night' ? '#0c4a6e' : '#0284c7';
      ctx.fillRect(0, 380, 1024, 260);

      // Pool Water Caustics / Sun Reflections
      ctx.strokeStyle = lightingMode === 'night' ? '#38bdf8' : '#e0f2fe';
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.55;
      for (let y = 410; y < 640; y += 38) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(260, y - 12, 540, y + 12, 1024, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Wooden Pool Deck Rim at Bottom
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 600, 1024, 40);
    } else if (backdrop === 'rice-terrace') {
      // --- UBUD RICE TERRACES ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 280);
      if (lightingMode === 'sunset') {
        skyGrad.addColorStop(0, '#c2410c');
        skyGrad.addColorStop(1, '#fed7aa');
      } else if (lightingMode === 'night') {
        skyGrad.addColorStop(0, '#030712');
        skyGrad.addColorStop(1, '#064e3b');
      } else {
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(1, '#dcfce7');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1024, 280);

      // Layered Cascading Green Rice Terraces
      const terraceColors = lightingMode === 'night'
        ? ['#064e3b', '#047857', '#065f46', '#022c22']
        : lightingMode === 'sunset'
        ? ['#854d0e', '#65a30d', '#4d7c0f', '#365314']
        : ['#10b981', '#059669', '#047857', '#065f46'];

      // Terrace 1
      ctx.fillStyle = terraceColors[0];
      ctx.beginPath();
      ctx.moveTo(0, 260);
      ctx.bezierCurveTo(300, 220, 700, 270, 1024, 240);
      ctx.lineTo(1024, 640);
      ctx.lineTo(0, 640);
      ctx.fill();

      // Terrace 2
      ctx.fillStyle = terraceColors[1];
      ctx.beginPath();
      ctx.moveTo(0, 330);
      ctx.bezierCurveTo(400, 290, 800, 350, 1024, 310);
      ctx.lineTo(1024, 640);
      ctx.lineTo(0, 640);
      ctx.fill();

      // Terrace 3
      ctx.fillStyle = terraceColors[2];
      ctx.beginPath();
      ctx.moveTo(0, 420);
      ctx.bezierCurveTo(350, 380, 750, 440, 1024, 400);
      ctx.lineTo(1024, 640);
      ctx.lineTo(0, 640);
      ctx.fill();

      // Terrace 4
      ctx.fillStyle = terraceColors[3];
      ctx.beginPath();
      ctx.moveTo(0, 510);
      ctx.bezierCurveTo(450, 470, 850, 530, 1024, 490);
      ctx.lineTo(1024, 640);
      ctx.lineTo(0, 640);
      ctx.fill();

      // Tall Coconut Palms
      ctx.strokeStyle = '#271a10';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(180, 520);
      ctx.lineTo(190, 280);
      ctx.moveTo(820, 540);
      ctx.lineTo(810, 260);
      ctx.stroke();

      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(190, 270, 55, 0, Math.PI * 2);
      ctx.arc(810, 250, 65, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // --- CANGGU MODERN LOFT ---
      ctx.fillStyle = lightingMode === 'night' ? '#0a0f1d' : lightingMode === 'sunset' ? '#431407' : '#f1f5f9';
      ctx.fillRect(0, 0, 1024, 640);

      // Architectural grid windows & coastal horizon
      ctx.fillStyle = lightingMode === 'sunset' ? '#ea580c' : '#38bdf8';
      ctx.fillRect(0, 300, 1024, 180);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 480, 1024, 160);
    }
  }

  const sceneryTexture = new THREE.CanvasTexture(sceneryCanvas);
  sceneryTexture.needsUpdate = true;

  const sceneryMat = new THREE.MeshBasicMaterial({
    map: sceneryTexture,
    depthTest: true,
  });

  const sceneryGeo = new THREE.PlaneGeometry(4.8, 3.0);
  const sceneryMesh = new THREE.Mesh(sceneryGeo, sceneryMat);
  sceneryMesh.position.set(0, 1.9, wallZ - 0.08); // Securely positioned behind the open window
  roomGroup.add(sceneryMesh);

  return roomGroup;
}

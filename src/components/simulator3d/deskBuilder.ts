import * as THREE from 'three';
import { createWoodTexture } from './materials';

export interface DeskMeshGroup extends THREE.Group {
  updateHeight?: (height: number) => void;
}

export function buildDesk3D(deskId: string, height: number = 0.74): DeskMeshGroup {
  const deskGroup = new THREE.Group() as DeskMeshGroup;
  deskGroup.name = 'DeskRoot';
  deskGroup.userData = { type: 'desk', id: deskId };

  // Material & dimension configs
  let width = 1.4;
  let depth = 0.7;
  const thickness = 0.035;

  let topMaterial: THREE.Material;
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.7,
  });

  if (deskId === 'desk-minimalist-white') {
    width = 1.25;
    depth = 0.65;
    topMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.05,
    });
    legMaterial.color.setHex(0xe2e8f0);
  } else if (deskId === 'desk-artisan-walnut') {
    width = 1.6;
    depth = 0.8;
    const walnutTex = createWoodTexture('#3D2619', '#1C0F08');
    topMaterial = new THREE.MeshStandardMaterial({
      map: walnutTex,
      roughness: 0.35,
      metalness: 0.1,
    });
    legMaterial.color.setHex(0x0f172a);
  } else if (deskId === 'desk-bamboo-compact') {
    width = 1.1;
    depth = 0.6;
    const bambooTex = createWoodTexture('#D4B07B', '#A8824C');
    topMaterial = new THREE.MeshStandardMaterial({
      map: bambooTex,
      roughness: 0.4,
      metalness: 0.05,
    });
    legMaterial.color.setHex(0xb58d54);
  } else {
    // Default: Bali Teak Smart Standing Desk
    width = 1.45;
    depth = 0.72;
    const teakTex = createWoodTexture('#C98244', '#784318');
    topMaterial = new THREE.MeshStandardMaterial({
      map: teakTex,
      roughness: 0.3,
      metalness: 0.1,
    });
  }

  // --- MOVING TOP ASSEMBLY (Tabletop + Keypad + Accessories Mount) ---
  const topAssembly = new THREE.Group();
  topAssembly.name = 'DeskTopAssembly';
  topAssembly.position.y = height;

  // 1. Tabletop slab
  const topGeo = new THREE.BoxGeometry(width, thickness, depth);
  const topMesh = new THREE.Mesh(topGeo, topMaterial);
  topMesh.position.y = thickness / 2;
  topMesh.castShadow = true;
  topMesh.receiveShadow = true;
  topMesh.userData = { type: 'desk', id: deskId };
  topAssembly.add(topMesh);

  // 2. Bevel edge trim (front and back)
  const edgeGeo = new THREE.BoxGeometry(width, 0.008, 0.005);
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
  const frontEdge = new THREE.Mesh(edgeGeo, edgeMat);
  frontEdge.position.set(0, thickness / 2, depth / 2 + 0.002);
  topAssembly.add(frontEdge);

  // 3. Digital Height Controller Keypad (for standing desk)
  if (deskId === 'desk-standing-teak') {
    const keypadGeo = new THREE.BoxGeometry(0.12, 0.02, 0.04);
    const keypadMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });
    const keypad = new THREE.Mesh(keypadGeo, keypadMat);
    keypad.position.set(width / 2 - 0.15, -0.01, depth / 2 + 0.01);
    topAssembly.add(keypad);

    // Tiny glowing LED display
    const ledGeo = new THREE.PlaneGeometry(0.04, 0.012);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(width / 2 - 0.15, -0.01, depth / 2 + 0.031);
    topAssembly.add(led);
  }

  // 4. Under-desk Cable Management Tray
  const trayGeo = new THREE.BoxGeometry(width * 0.6, 0.05, 0.15);
  const trayMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
  const tray = new THREE.Mesh(trayGeo, trayMat);
  tray.position.set(0, -0.035, -depth * 0.15);
  tray.castShadow = true;
  topAssembly.add(tray);

  deskGroup.add(topAssembly);

  // --- LEGS & FLOOR BASES ---
  const legSpacingX = width * 0.36;
  const outerLegGeo = new THREE.BoxGeometry(0.07, 0.45, 0.07);
  const innerLegGeo = new THREE.BoxGeometry(0.06, 0.55, 0.06);
  const footGeo = new THREE.BoxGeometry(0.08, 0.03, depth * 0.85);

  // Left Leg Assembly
  const leftOuterLeg = new THREE.Mesh(outerLegGeo, legMaterial);
  leftOuterLeg.position.set(-legSpacingX, 0.225, 0);
  leftOuterLeg.castShadow = true;
  leftOuterLeg.receiveShadow = true;
  deskGroup.add(leftOuterLeg);

  const leftInnerLeg = new THREE.Mesh(innerLegGeo, legMaterial);
  leftInnerLeg.name = 'LeftInnerLeg';
  leftInnerLeg.position.set(-legSpacingX, height - 0.28, 0);
  leftInnerLeg.castShadow = true;
  deskGroup.add(leftInnerLeg);

  const leftFoot = new THREE.Mesh(footGeo, legMaterial);
  leftFoot.position.set(-legSpacingX, 0.015, 0);
  leftFoot.castShadow = true;
  leftFoot.receiveShadow = true;
  deskGroup.add(leftFoot);

  // Right Leg Assembly
  const rightOuterLeg = new THREE.Mesh(outerLegGeo, legMaterial);
  rightOuterLeg.position.set(legSpacingX, 0.225, 0);
  rightOuterLeg.castShadow = true;
  rightOuterLeg.receiveShadow = true;
  deskGroup.add(rightOuterLeg);

  const rightInnerLeg = new THREE.Mesh(innerLegGeo, legMaterial);
  rightInnerLeg.name = 'RightInnerLeg';
  rightInnerLeg.position.set(legSpacingX, height - 0.28, 0);
  rightInnerLeg.castShadow = true;
  deskGroup.add(rightInnerLeg);

  const rightFoot = new THREE.Mesh(footGeo, legMaterial);
  rightFoot.position.set(legSpacingX, 0.015, 0);
  rightFoot.castShadow = true;
  rightFoot.receiveShadow = true;
  deskGroup.add(rightFoot);

  // Cross Support Beam (just below tabletop)
  const crossBeamGeo = new THREE.BoxGeometry(legSpacingX * 2, 0.04, 0.04);
  const crossBeam = new THREE.Mesh(crossBeamGeo, legMaterial);
  crossBeam.position.set(0, -0.03, 0);
  topAssembly.add(crossBeam);

  // Height update callback
  deskGroup.updateHeight = (newHeight: number) => {
    topAssembly.position.y = newHeight;
    leftInnerLeg.position.y = newHeight - 0.28;
    rightInnerLeg.position.y = newHeight - 0.28;
  };

  return deskGroup;
}

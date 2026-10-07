import {
  Scene,
  Vector3,
  Color3,
  MeshBuilder,
  PBRMaterial,
  StandardMaterial,
  DynamicTexture,
  Texture,
  ShadowGenerator,
  SpotLight,
  PointLight,
  TransformNode,
  Mesh,
  SceneLoader,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

// Helper to create VS Code dynamic texture for monitor screen
export function createBabylonScreenTexture(scene: Scene): DynamicTexture {
  const dynamicTexture = new DynamicTexture('screenTexture', { width: 1024, height: 512 }, scene, false);
  const ctx = dynamicTexture.getContext() as CanvasRenderingContext2D;

  if (ctx) {
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, 1024, 512);

    // Title bar
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

    // Tab text
    ctx.fillStyle = '#C9D1D9';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('workspace.tsx — DreamDesk Monis.rent (Babylon.js PBR)', 110, 26);

    // Code lines
    ctx.font = '15px monospace';
    const lines = [
      { text: 'import { BaliNomadStudio } from "@/monis";', color: '#FF7B72' },
      { text: 'import { PBRRenderer, SoftShadows } from "@/babylon";', color: '#FFA657' },
      { text: '', color: '#FFF' },
      { text: 'export const setup = () => {', color: '#D2A8FF' },
      { text: '  const villa = "Canggu Batu Bolong 🌴";', color: '#7EE787' },
      { text: '  const engine = "Babylon.js Hyper-Realistic PBR ✨";', color: '#7EE787' },
      { text: '  const desk = new StandingDesk({ wood: "Teak", motors: 2 });', color: '#79C0FF' },
      { text: '  const chair = new ErgoChair({ mesh: "AeroPro" });', color: '#79C0FF' },
      { text: '  return rentWorkspace({ desk, chair, delivery: "Next-Day" });', color: '#FFA657' },
      { text: '};', color: '#D2A8FF' },
      { text: '', color: '#FFF' },
      { text: '// Ready to Rent: 100% Focused in Bali. Enjoy the vibe!', color: '#8B949E' },
    ];

    let y = 80;
    lines.forEach((line) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 35, y);
      y += 28;
    });

    // Terminal bar
    ctx.fillStyle = '#010409';
    ctx.fillRect(0, 420, 1024, 92);
    ctx.strokeStyle = '#30363D';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 420, 1024, 92);

    ctx.fillStyle = '#3FB950';
    ctx.font = '14px monospace';
    ctx.fillText('➜ dreamdesk babylon:(main) ✔ Engine 60FPS PBR Active — Bali Villa', 25, 460);
    ctx.fillText('➜ rent-status: confirmed • next-day white-glove setup', 25, 490);
  }

  dynamicTexture.update();
  return dynamicTexture;
}

// 1. BUILD ROOM (PBR Floor, Enclosed Walls, Hollow Window, Photorealistic Scenery)
export function buildBabylonRoom(
  scene: Scene,
  backdrop: 'villa-pool' | 'rice-terrace' | 'minimal-studio',
  lightingMode: 'day' | 'sunset' | 'night'
): TransformNode {
  const roomNode = new TransformNode('RoomRoot', scene);

  // Hardwood Balinese Teak Floor with PBR
  const floor = MeshBuilder.CreateBox('Floor', { width: 6.4, height: 0.04, depth: 7.2 }, scene);
  floor.position.set(0, -0.02, 0.6);
  floor.receiveShadows = true;
  floor.parent = roomNode;

  const floorMat = new PBRMaterial('FloorPBR', scene);
  floorMat.albedoColor = new Color3(0.52, 0.36, 0.22);
  floorMat.roughness = 0.38;
  floorMat.metallic = 0.04;
  floorMat.backFaceCulling = false;
  floor.material = floorMat;

  // Wall Colors according to ambient time of day
  const wallColors = {
    day: new Color3(0.96, 0.95, 0.92),
    sunset: new Color3(0.95, 0.82, 0.72),
    night: new Color3(0.18, 0.22, 0.32),
  };

  const wallMat = new PBRMaterial('WallPBR', scene);
  wallMat.albedoColor = wallColors[lightingMode];
  wallMat.roughness = 0.85;
  wallMat.metallic = 0.0;

  // Enclosed Side Box Walls (Left & Right)
  const leftWall = MeshBuilder.CreateBox('LeftWall', { width: 0.12, height: 4.2, depth: 6.4 }, scene);
  leftWall.position.set(-3.2, 2.1, 0.6);
  leftWall.receiveShadows = true;
  leftWall.material = wallMat;
  leftWall.parent = roomNode;

  const rightWall = MeshBuilder.CreateBox('RightWall', { width: 0.12, height: 4.2, depth: 6.4 }, scene);
  rightWall.position.set(3.2, 2.1, 0.6);
  rightWall.receiveShadows = true;
  rightWall.material = wallMat;
  rightWall.parent = roomNode;

  // Rear Wall Segments around Window Opening (Width 3.4m, Height 2.1m at Z = -1.45)
  const wallZ = -1.45;

  const leftSeg = MeshBuilder.CreateBox('RearWallL', { width: 1.5, height: 4.2, depth: 0.12 }, scene);
  leftSeg.position.set(-2.45, 2.1, wallZ);
  leftSeg.receiveShadows = true;
  leftSeg.material = wallMat;
  leftSeg.parent = roomNode;

  const rightSeg = MeshBuilder.CreateBox('RearWallR', { width: 1.5, height: 4.2, depth: 0.12 }, scene);
  rightSeg.position.set(2.45, 2.1, wallZ);
  rightSeg.receiveShadows = true;
  rightSeg.material = wallMat;
  rightSeg.parent = roomNode;

  const bottomSeg = MeshBuilder.CreateBox('RearWallB', { width: 3.4, height: 0.82, depth: 0.12 }, scene);
  bottomSeg.position.set(0, 0.41, wallZ);
  bottomSeg.receiveShadows = true;
  bottomSeg.material = wallMat;
  bottomSeg.parent = roomNode;

  const topSeg = MeshBuilder.CreateBox('RearWallT', { width: 3.4, height: 1.28, depth: 0.12 }, scene);
  topSeg.position.set(0, 3.56, wallZ);
  topSeg.receiveShadows = true;
  topSeg.material = wallMat;
  topSeg.parent = roomNode;

  // Window Frame (Open Hollow Frame with white lacquer finish)
  const frameMat = new PBRMaterial('FramePBR', scene);
  frameMat.albedoColor = new Color3(0.96, 0.96, 0.98);
  frameMat.roughness = 0.25;

  const frameZ = wallZ + 0.04;

  const topFrame = MeshBuilder.CreateBox('TopFrame', { width: 3.5, height: 0.08, depth: 0.08 }, scene);
  topFrame.position.set(0, 2.92, frameZ);
  topFrame.material = frameMat;
  topFrame.metadata = { type: 'backdrops' };
  topFrame.parent = roomNode;

  const sill = MeshBuilder.CreateBox('WindowSill', { width: 3.6, height: 0.08, depth: 0.18 }, scene);
  sill.position.set(0, 0.82, frameZ + 0.05);
  sill.material = frameMat;
  sill.receiveShadows = true;
  sill.metadata = { type: 'backdrops' };
  sill.parent = roomNode;

  const leftPost = MeshBuilder.CreateBox('LeftPost', { width: 0.08, height: 2.1, depth: 0.08 }, scene);
  leftPost.position.set(-1.7, 1.87, frameZ);
  leftPost.material = frameMat;
  leftPost.metadata = { type: 'backdrops' };
  leftPost.parent = roomNode;

  const rightPost = MeshBuilder.CreateBox('RightPost', { width: 0.08, height: 2.1, depth: 0.08 }, scene);
  rightPost.position.set(1.7, 1.87, frameZ);
  rightPost.material = frameMat;
  rightPost.metadata = { type: 'backdrops' };
  rightPost.parent = roomNode;

  const vMullion = MeshBuilder.CreateBox('VMullion', { width: 0.04, height: 2.1, depth: 0.05 }, scene);
  vMullion.position.set(0, 1.87, frameZ);
  vMullion.material = frameMat;
  vMullion.metadata = { type: 'backdrops' };
  vMullion.parent = roomNode;

  const hMullion = MeshBuilder.CreateBox('HMullion', { width: 3.4, height: 0.04, depth: 0.05 }, scene);
  hMullion.position.set(0, 1.87, frameZ);
  hMullion.material = frameMat;
  hMullion.metadata = { type: 'backdrops' };
  hMullion.parent = roomNode;

  // Photorealistic Outdoor Scenery Texture
  const imageMap = {
    'villa-pool': '/textures/villa-pool.jpg',
    'rice-terrace': '/textures/rice-terrace.jpg',
    'minimal-studio': '/textures/minimal-studio.jpg',
  };

  const sceneryPlane = MeshBuilder.CreatePlane('SceneryPlane', { width: 5.4, height: 2.7 }, scene);
  sceneryPlane.position.set(0, 1.87, wallZ - 0.08);

  const sceneryMat = new StandardMaterial('SceneryMat', scene);
  const texture = new Texture(imageMap[backdrop] || imageMap['villa-pool'], scene);
  texture.level = lightingMode === 'night' ? 0.25 : lightingMode === 'sunset' ? 0.85 : 1.0;
  sceneryMat.emissiveTexture = texture;
  sceneryMat.diffuseTexture = texture;
  sceneryMat.emissiveColor =
    lightingMode === 'sunset'
      ? new Color3(1.0, 0.75, 0.5)
      : lightingMode === 'night'
      ? new Color3(0.28, 0.35, 0.5)
      : new Color3(1.0, 1.0, 1.0);
  sceneryMat.disableLighting = true;
  sceneryMat.backFaceCulling = false;
  sceneryPlane.material = sceneryMat;
  sceneryPlane.metadata = { type: 'backdrops' };
  sceneryPlane.parent = roomNode;

  return roomNode;
}

// 2. BUILD DESK (PBR Teak/Walnut/White/Bamboo + Motorized Lift)
export function buildBabylonDesk(
  scene: Scene,
  deskId: string,
  height: number = 0.74,
  shadowGen: ShadowGenerator
): { deskNode: TransformNode; topAssembly: TransformNode } {
  const deskNode = new TransformNode('DeskRoot', scene);
  deskNode.metadata = { type: 'desks', id: deskId };

  let width = 1.45;
  let depth = 0.72;
  const thickness = 0.035;

  const topMat = new PBRMaterial('DeskTopPBR', scene);
  const legMat = new PBRMaterial('DeskLegPBR', scene);
  legMat.albedoColor = new Color3(0.12, 0.16, 0.22);
  legMat.roughness = 0.35;
  legMat.metallic = 0.8;

  if (deskId === 'desk-minimalist-white') {
    width = 1.25;
    depth = 0.65;
    topMat.albedoColor = new Color3(0.96, 0.97, 0.98);
    topMat.roughness = 0.25;
    legMat.albedoColor = new Color3(0.88, 0.9, 0.94);
  } else if (deskId === 'desk-artisan-walnut') {
    width = 1.6;
    depth = 0.8;
    topMat.albedoColor = new Color3(0.26, 0.17, 0.11);
    topMat.roughness = 0.35;
    topMat.metallic = 0.1;
  } else if (deskId === 'desk-bamboo-compact') {
    width = 1.1;
    depth = 0.6;
    topMat.albedoColor = new Color3(0.82, 0.68, 0.48);
    topMat.roughness = 0.4;
  } else {
    // Bali Teak Smart Standing Desk
    topMat.albedoColor = new Color3(0.78, 0.51, 0.27);
    topMat.roughness = 0.3;
    topMat.metallic = 0.12;
  }

  // Top Moving Assembly
  const topAssembly = new TransformNode('DeskTopAssembly', scene);
  topAssembly.position.y = height;
  topAssembly.parent = deskNode;

  // Desktop Slab
  const topSlab = MeshBuilder.CreateBox('DesktopSlab', { width, height: thickness, depth }, scene);
  topSlab.position.y = thickness / 2;
  topSlab.material = topMat;
  topSlab.receiveShadows = true;
  shadowGen.addShadowCaster(topSlab);
  topSlab.parent = topAssembly;
  topSlab.metadata = { type: 'desks', id: deskId };

  // Front Chamfer Bevel
  const edgeTrim = MeshBuilder.CreateBox('EdgeTrim', { width, height: 0.008, depth: 0.006 }, scene);
  edgeTrim.position.set(0, thickness / 2, depth / 2 + 0.002);
  const trimMat = new PBRMaterial('TrimMat', scene);
  trimMat.albedoColor = new Color3(0.55, 0.6, 0.68);
  trimMat.metallic = 0.9;
  trimMat.roughness = 0.2;
  edgeTrim.material = trimMat;
  edgeTrim.parent = topAssembly;

  // LED Height Keypad
  if (deskId === 'desk-standing-teak') {
    const keypad = MeshBuilder.CreateBox('Keypad', { width: 0.12, height: 0.02, depth: 0.04 }, scene);
    keypad.position.set(width / 2 - 0.15, -0.01, depth / 2 + 0.01);
    const kpMat = new PBRMaterial('KeypadMat', scene);
    kpMat.albedoColor = new Color3(0.04, 0.04, 0.05);
    keypad.material = kpMat;
    keypad.parent = topAssembly;

    // Glowing LED text indicator
    const led = MeshBuilder.CreatePlane('KeypadLED', { width: 0.04, height: 0.012 }, scene);
    led.position.set(width / 2 - 0.15, -0.01, depth / 2 + 0.031);
    const ledMat = new StandardMaterial('LEDMat', scene);
    ledMat.emissiveColor = new Color3(0.2, 0.9, 0.5);
    ledMat.disableLighting = true;
    led.material = ledMat;
    led.parent = topAssembly;
  }

  // Telescopic Legs & Feet
  const legSpacingX = width * 0.36;

  // Outer Leg Columns
  const leftOuter = MeshBuilder.CreateBox('LeftOuterLeg', { width: 0.07, height: 0.45, depth: 0.07 }, scene);
  leftOuter.position.set(-legSpacingX, 0.225, 0);
  leftOuter.material = legMat;
  shadowGen.addShadowCaster(leftOuter);
  leftOuter.parent = deskNode;

  const rightOuter = MeshBuilder.CreateBox('RightOuterLeg', { width: 0.07, height: 0.45, depth: 0.07 }, scene);
  rightOuter.position.set(legSpacingX, 0.225, 0);
  rightOuter.material = legMat;
  shadowGen.addShadowCaster(rightOuter);
  rightOuter.parent = deskNode;

  // Floor Feet
  const leftFoot = MeshBuilder.CreateBox('LeftFoot', { width: 0.08, height: 0.03, depth: depth * 0.85 }, scene);
  leftFoot.position.set(-legSpacingX, 0.015, 0);
  leftFoot.material = legMat;
  shadowGen.addShadowCaster(leftFoot);
  leftFoot.parent = deskNode;

  const rightFoot = MeshBuilder.CreateBox('RightFoot', { width: 0.08, height: 0.03, depth: depth * 0.85 }, scene);
  rightFoot.position.set(legSpacingX, 0.015, 0);
  rightFoot.material = legMat;
  shadowGen.addShadowCaster(rightFoot);
  rightFoot.parent = deskNode;

  // Inner Sliding Columns attached to top assembly (Long stroke sleeve)
  const leftInner = MeshBuilder.CreateBox('LeftInnerLeg', { width: 0.06, height: 0.75, depth: 0.06 }, scene);
  leftInner.position.set(-legSpacingX, -0.38, 0);
  leftInner.material = legMat;
  leftInner.parent = topAssembly;

  const rightInner = MeshBuilder.CreateBox('RightInnerLeg', { width: 0.06, height: 0.75, depth: 0.06 }, scene);
  rightInner.position.set(legSpacingX, -0.38, 0);
  rightInner.material = legMat;
  rightInner.parent = topAssembly;

  return { deskNode, topAssembly };
}

// 3. BUILD CHAIR (Facing the desk and monitors correctly!)
export async function buildBabylonChair(
  scene: Scene,
  chairId: string,
  shadowGen: ShadowGenerator
): Promise<TransformNode> {
  const chairNode = new TransformNode('ChairRoot', scene);
  chairNode.position.set(0.12, 0, 0.72);
  chairNode.rotation.y = Math.PI - 0.22; // Natural inviting 3/4 angle facing the desk
  chairNode.metadata = { type: 'chairs', id: chairId };

  // Load High-End Photorealistic GLB Model for Nordic Chair
  if (chairId === 'chair-scandi-swivel') {
    try {
      const result = await SceneLoader.ImportMeshAsync('', '/models/', 'sheen_chair.glb', scene);
      const rootMesh = result.meshes[0];
      rootMesh.parent = chairNode;
      rootMesh.position.set(0, 0, 0);
      rootMesh.rotationQuaternion = null;
      rootMesh.rotation.y = Math.PI;
      rootMesh.scaling.setAll(0.95);
      result.meshes.forEach((m) => {
        m.receiveShadows = true;
        shadowGen.addShadowCaster(m);
        m.metadata = { type: 'chairs', id: chairId };
      });
      return chairNode;
    } catch (err) {
      console.warn('Failed to load sheen_chair.glb, falling back to procedural:', err);
    }
  }

  // Load High-End Photorealistic GLB Model for Executive Chair
  if (chairId === 'chair-executive-leather') {
    try {
      const result = await SceneLoader.ImportMeshAsync('', '/models/', 'executive_chair.glb', scene);
      const rootMesh = result.meshes[0];
      rootMesh.parent = chairNode;
      rootMesh.position.set(0, 0, 0);
      rootMesh.rotationQuaternion = null;
      rootMesh.rotation.y = Math.PI;
      rootMesh.scaling.setAll(0.95);
      result.meshes.forEach((m) => {
        m.receiveShadows = true;
        shadowGen.addShadowCaster(m);
        m.metadata = { type: 'chairs', id: chairId };
      });
      return chairNode;
    } catch (err) {
      console.warn('Failed to load executive_chair.glb, falling back to procedural:', err);
    }
  }

  const blackMat = new PBRMaterial('ChairPlastic', scene);
  blackMat.albedoColor = new Color3(0.12, 0.15, 0.2);
  blackMat.roughness = 0.45;

  const chromeMat = new PBRMaterial('ChairChrome', scene);
  chromeMat.albedoColor = new Color3(0.9, 0.92, 0.95);
  chromeMat.metallic = 0.95;
  chromeMat.roughness = 0.15;

  // 5-Star Wheel Base
  const hub = MeshBuilder.CreateCylinder('ChairHub', { diameter: 0.08, height: 0.04 }, scene);
  hub.position.y = 0.06;
  hub.material = blackMat;
  hub.parent = chairNode;

  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const leg = MeshBuilder.CreateBox(`ChairLeg${i}`, { width: 0.035, height: 0.025, depth: 0.28 }, scene);
    leg.position.set(Math.sin(angle) * 0.14, 0.045, Math.cos(angle) * 0.14);
    leg.rotation.y = angle;
    leg.material = blackMat;
    shadowGen.addShadowCaster(leg);
    leg.parent = chairNode;

    const wheel = MeshBuilder.CreateCylinder(`Wheel${i}`, { diameter: 0.044, height: 0.02 }, scene);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(Math.sin(angle) * 0.27, 0.022, Math.cos(angle) * 0.27);
    wheel.material = blackMat;
    wheel.parent = chairNode;
  }

  // Gas Lift Cylinder
  const cyl = MeshBuilder.CreateCylinder('LiftCylinder', { diameter: 0.045, height: 0.38 }, scene);
  cyl.position.y = 0.24;
  cyl.material = chromeMat;
  shadowGen.addShadowCaster(cyl);
  cyl.parent = chairNode;

  if (chairId === 'chair-executive-leather') {
    // Executive Leather
    const leatherMat = new PBRMaterial('LeatherPBR', scene);
    leatherMat.albedoColor = new Color3(0.08, 0.1, 0.14);
    leatherMat.roughness = 0.35;

    const seat = MeshBuilder.CreateBox('ExecSeat', { width: 0.5, height: 0.09, depth: 0.48 }, scene);
    seat.position.set(0, 0.44, -0.04);
    seat.material = leatherMat;
    seat.receiveShadows = true;
    shadowGen.addShadowCaster(seat);
    seat.parent = chairNode;
    seat.metadata = { type: 'chairs', id: chairId };

    const back = MeshBuilder.CreateBox('ExecBack', { width: 0.48, height: 0.65, depth: 0.08 }, scene);
    back.position.set(0, 0.76, -0.24);
    back.rotation.x = -0.06;
    back.material = leatherMat;
    shadowGen.addShadowCaster(back);
    back.parent = chairNode;
    back.metadata = { type: 'chairs', id: chairId };
  } else if (chairId === 'chair-active-stool') {
    // Active Stool
    const saddleMat = new PBRMaterial('SaddlePBR', scene);
    saddleMat.albedoColor = new Color3(0.05, 0.58, 0.53);
    saddleMat.roughness = 0.45;

    const saddle = MeshBuilder.CreateCylinder('Saddle', { diameter: 0.36, height: 0.08 }, scene);
    saddle.position.set(0, 0.58, 0);
    saddle.material = saddleMat;
    shadowGen.addShadowCaster(saddle);
    saddle.parent = chairNode;
    saddle.metadata = { type: 'chairs', id: chairId };
  } else {
    // ErgoPro Aero-Mesh Bali Edition
    const meshMat = new PBRMaterial('MeshPBR', scene);
    meshMat.albedoColor = new Color3(0.18, 0.22, 0.3);
    meshMat.roughness = 0.7;

    const seat = MeshBuilder.CreateBox('MeshSeat', { width: 0.48, height: 0.06, depth: 0.46 }, scene);
    seat.position.set(0, 0.44, -0.04);
    seat.material = meshMat;
    seat.receiveShadows = true;
    shadowGen.addShadowCaster(seat);
    seat.parent = chairNode;
    seat.metadata = { type: 'chairs', id: chairId };

    const back = MeshBuilder.CreateBox('MeshBack', { width: 0.44, height: 0.5, depth: 0.025 }, scene);
    back.position.set(0, 0.72, -0.22);
    back.rotation.x = -0.08;
    back.material = meshMat;
    shadowGen.addShadowCaster(back);
    back.parent = chairNode;
    back.metadata = { type: 'chairs', id: chairId };

    // Dynamic Lumbar Band
    const lumbar = MeshBuilder.CreateBox('Lumbar', { width: 0.36, height: 0.08, depth: 0.04 }, scene);
    lumbar.position.set(0, 0.6, -0.2);
    const lumMat = new PBRMaterial('LumbarMat', scene);
    lumMat.albedoColor = new Color3(0.06, 0.72, 0.5);
    lumMat.roughness = 0.3;
    lumbar.material = lumMat;
    lumbar.parent = chairNode;

    // Headrest
    const headrest = MeshBuilder.CreateBox('Headrest', { width: 0.24, height: 0.1, depth: 0.06 }, scene);
    headrest.position.set(0, 1.04, -0.24);
    headrest.material = blackMat;
    headrest.parent = chairNode;

    // Ergonomic 3D Adjustable Armrests
    for (const side of [-1, 1]) {
      const armPost = MeshBuilder.CreateCylinder(`ArmPost_${side}`, { diameter: 0.024, height: 0.22 }, scene);
      armPost.position.set(side * 0.26, 0.52, -0.05);
      armPost.material = blackMat;
      armPost.parent = chairNode;

      const armPad = MeshBuilder.CreateBox(`ArmPad_${side}`, { width: 0.07, height: 0.025, depth: 0.22 }, scene);
      armPad.position.set(side * 0.26, 0.63, -0.04);
      armPad.material = blackMat;
      armPad.parent = chairNode;
    }
  }

  return chairNode;
}

// 4. BUILD MONITORS (Single, Dual, Curved 34", Superwide 49")
export function buildBabylonMonitors(
  scene: Scene,
  monitorId: string,
  deskSurfaceY: number = 0.775,
  shadowGen: ShadowGenerator
): TransformNode {
  const monNode = new TransformNode('MonitorRoot', scene);
  monNode.position.set(0, deskSurfaceY, -0.24);
  monNode.metadata = { type: 'monitors', id: monitorId };

  const bezelMat = new PBRMaterial('BezelPBR', scene);
  bezelMat.albedoColor = new Color3(0.08, 0.1, 0.14);
  bezelMat.roughness = 0.35;
  bezelMat.metallic = 0.7;

  const screenTex = createBabylonScreenTexture(scene);
  const screenMat = new StandardMaterial('ScreenMat', scene);
  screenMat.emissiveTexture = screenTex;
  screenMat.diffuseTexture = screenTex;
  screenMat.emissiveColor = new Color3(1.0, 1.0, 1.0);
  screenMat.disableLighting = true;

  if (monitorId === 'monitor-dual-27') {
    // Dual 27" on gas spring arm
    const clamp = MeshBuilder.CreateBox('ArmClamp', { width: 0.12, height: 0.06, depth: 0.08 }, scene);
    clamp.position.y = 0.03;
    clamp.material = bezelMat;
    clamp.parent = monNode;

    const pole = MeshBuilder.CreateCylinder('ArmPole', { diameter: 0.05, height: 0.42 }, scene);
    pole.position.y = 0.22;
    pole.material = bezelMat;
    pole.parent = monNode;

    // Left 27"
    const leftPanel = MeshBuilder.CreateBox('LeftBezel', { width: 0.58, height: 0.36, depth: 0.02 }, scene);
    leftPanel.position.set(-0.31, 0.34, 0.04);
    leftPanel.rotation.y = 0.2;
    leftPanel.material = bezelMat;
    shadowGen.addShadowCaster(leftPanel);
    leftPanel.parent = monNode;

    const leftScreen = MeshBuilder.CreatePlane('LeftScreen', { width: 0.56, height: 0.34 }, scene);
    leftScreen.position.set(-0.31, 0.34, 0.051);
    leftScreen.rotation.y = 0.2;
    leftScreen.material = screenMat;
    leftScreen.parent = monNode;

    // Right 27"
    const rightPanel = MeshBuilder.CreateBox('RightBezel', { width: 0.58, height: 0.36, depth: 0.02 }, scene);
    rightPanel.position.set(0.31, 0.34, 0.04);
    rightPanel.rotation.y = -0.2;
    rightPanel.material = bezelMat;
    shadowGen.addShadowCaster(rightPanel);
    rightPanel.parent = monNode;

    const rightScreen = MeshBuilder.CreatePlane('RightScreen', { width: 0.56, height: 0.34 }, scene);
    rightScreen.position.set(0.31, 0.34, 0.051);
    rightScreen.rotation.y = -0.2;
    rightScreen.material = screenMat;
    rightScreen.parent = monNode;
  } else if (monitorId === 'monitor-ultrawide-34') {
    // Curved 34" Ultrawide (21:9)
    const base = MeshBuilder.CreateBox('UWBase', { width: 0.34, height: 0.012, depth: 0.22 }, scene);
    base.position.y = 0.006;
    base.material = bezelMat;
    base.parent = monNode;

    const pole = MeshBuilder.CreateBox('UWPole', { width: 0.06, height: 0.36, depth: 0.04 }, scene);
    pole.position.set(0, 0.18, -0.06);
    pole.material = bezelMat;
    pole.parent = monNode;

    // 3 Curved Facets
    const centerPanel = MeshBuilder.CreateBox('UWCenter', { width: 0.44, height: 0.36, depth: 0.02 }, scene);
    centerPanel.position.set(0, 0.32, 0);
    centerPanel.material = bezelMat;
    shadowGen.addShadowCaster(centerPanel);
    centerPanel.parent = monNode;

    const centerScr = MeshBuilder.CreatePlane('UWScreenC', { width: 0.43, height: 0.34 }, scene);
    centerScr.position.set(0, 0.32, 0.011);
    centerScr.material = screenMat;
    centerScr.parent = monNode;

    const leftWing = MeshBuilder.CreateBox('UWLeftWing', { width: 0.22, height: 0.36, depth: 0.02 }, scene);
    leftWing.position.set(-0.32, 0.32, 0.025);
    leftWing.rotation.y = 0.22;
    leftWing.material = bezelMat;
    leftWing.parent = monNode;

    const rightWing = MeshBuilder.CreateBox('UWRightWing', { width: 0.22, height: 0.36, depth: 0.02 }, scene);
    rightWing.position.set(0.32, 0.32, 0.025);
    rightWing.rotation.y = -0.22;
    rightWing.material = bezelMat;
    rightWing.parent = monNode;
  } else if (monitorId === 'monitor-superwide-49') {
    // 49" Superwide Cockpit
    const base = MeshBuilder.CreateBox('SWBase', { width: 0.48, height: 0.015, depth: 0.24 }, scene);
    base.position.y = 0.0075;
    base.material = bezelMat;
    base.parent = monNode;

    const centerPanel = MeshBuilder.CreateBox('SWCenter', { width: 0.54, height: 0.35, depth: 0.02 }, scene);
    centerPanel.position.set(0, 0.33, 0);
    centerPanel.material = bezelMat;
    shadowGen.addShadowCaster(centerPanel);
    centerPanel.parent = monNode;

    const centerScr = MeshBuilder.CreatePlane('SWScreenC', { width: 0.53, height: 0.33 }, scene);
    centerScr.position.set(0, 0.33, 0.011);
    centerScr.material = screenMat;
    centerScr.parent = monNode;

    const leftWing = MeshBuilder.CreateBox('SWLeft', { width: 0.32, height: 0.35, depth: 0.02 }, scene);
    leftWing.position.set(-0.42, 0.33, 0.045);
    leftWing.rotation.y = 0.32;
    leftWing.material = bezelMat;
    leftWing.parent = monNode;

    const rightWing = MeshBuilder.CreateBox('SWRight', { width: 0.32, height: 0.35, depth: 0.02 }, scene);
    rightWing.position.set(0.42, 0.33, 0.045);
    rightWing.rotation.y = -0.32;
    rightWing.material = bezelMat;
    rightWing.parent = monNode;
  } else {
    // Single 27" Dell UltraSharp 4K
    const base = MeshBuilder.CreateBox('SBase', { width: 0.24, height: 0.012, depth: 0.2 }, scene);
    base.position.y = 0.006;
    base.material = bezelMat;
    base.parent = monNode;

    const pole = MeshBuilder.CreateBox('SPole', { width: 0.05, height: 0.38, depth: 0.035 }, scene);
    pole.position.set(0, 0.2, -0.04);
    pole.material = bezelMat;
    pole.parent = monNode;

    const panel = MeshBuilder.CreateBox('SPanel', { width: 0.62, height: 0.37, depth: 0.02 }, scene);
    panel.position.set(0, 0.32, 0);
    panel.material = bezelMat;
    shadowGen.addShadowCaster(panel);
    panel.parent = monNode;

    const screen = MeshBuilder.CreatePlane('SScreen', { width: 0.6, height: 0.35 }, scene);
    screen.position.set(0, 0.32, 0.011);
    screen.material = screenMat;
    screen.parent = monNode;
  }

  return monNode;
}

// 5. BUILD DEDICATED LIGHTING (ScreenBar, Brass Lamp, Sunset RGB Strip with Neon Bloom)
export async function buildBabylonLighting(
  scene: Scene,
  lightingId: string | null,
  deskSurfaceY: number = 0.775,
  shadowGen: ShadowGenerator
): Promise<TransformNode> {
  const lightNode = new TransformNode('LightingRoot', scene);
  lightNode.metadata = { type: 'lighting', id: lightingId };

  if (!lightingId) return lightNode;

  if (lightingId === 'light-screenbar') {
    // BenQ ScreenBar Halo
    const bar = MeshBuilder.CreateCylinder('ScreenBar', { diameter: 0.024, height: 0.46 }, scene);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, deskSurfaceY + 0.52, -0.22);
    const barMat = new PBRMaterial('BarMat', scene);
    barMat.albedoColor = new Color3(0.06, 0.06, 0.07);
    barMat.metallic = 0.9;
    bar.material = barMat;
    bar.parent = lightNode;

    // Glowing LED Diffuser
    const led = MeshBuilder.CreatePlane('BarLED', { width: 0.42, height: 0.015 }, scene);
    led.rotation.x = Math.PI / 2;
    led.position.set(0, deskSurfaceY + 0.508, -0.22);
    const ledMat = new StandardMaterial('LEDMat', scene);
    ledMat.emissiveColor = new Color3(1, 0.98, 0.9);
    ledMat.disableLighting = true;
    led.material = ledMat;
    led.parent = lightNode;

    // Task Spotlight
    const spot = new SpotLight(
      'ScreenBarSpot',
      new Vector3(0, deskSurfaceY + 0.51, -0.2),
      new Vector3(0, -1, 0.5),
      Math.PI / 3.0,
      1.5,
      scene
    );
    spot.diffuse = new Color3(1, 0.98, 0.9);
    spot.intensity = 18;
    shadowGen.addShadowCaster(bar);
    spot.parent = lightNode;
  } else if (lightingId === 'light-brass-architect') {
    // Try loading Photorealistic PBR Desk Lamp GLB
    let loadedLamp = false;
    try {
      const lampRes = await SceneLoader.ImportMeshAsync('', '/models/', 'desk_lamp.glb', scene);
      const rootMesh = lampRes.meshes[0];
      rootMesh.parent = lightNode;
      rootMesh.position.set(-0.52, deskSurfaceY, -0.15);
      rootMesh.rotationQuaternion = null;
      rootMesh.rotation.y = Math.PI / 3.5;
      rootMesh.scaling.setAll(0.24);
      lampRes.meshes.forEach((m) => {
        m.receiveShadows = true;
        shadowGen.addShadowCaster(m);
        m.metadata = { type: 'lighting', id: lightingId };
      });

      const spot = new SpotLight(
        'DeskLampSpot',
        new Vector3(-0.46, deskSurfaceY + 0.42, -0.08),
        new Vector3(0.5, -1, 0.35),
        Math.PI / 2.6,
        2.0,
        scene
      );
      spot.diffuse = new Color3(1, 0.88, 0.55);
      spot.intensity = 26;
      spot.parent = lightNode;
      loadedLamp = true;
    } catch (e) {
      console.warn('Failed to load desk_lamp.glb, using procedural fallback:', e);
    }

    if (!loadedLamp) {
      // Brass Task Lamp Procedural
      const lampPos = new Vector3(-0.54, deskSurfaceY, -0.16);

      const brassMat = new PBRMaterial('BrassMat', scene);
      brassMat.albedoColor = new Color3(0.85, 0.55, 0.12);
      brassMat.metallic = 0.92;
      brassMat.roughness = 0.15;

      const base = MeshBuilder.CreateCylinder('BrassBase', { diameter: 0.13, height: 0.018 }, scene);
      base.position.set(lampPos.x, lampPos.y + 0.009, lampPos.z);
      base.material = brassMat;
      base.parent = lightNode;

      const arm1 = MeshBuilder.CreateCylinder('BrassArm1', { diameter: 0.012, height: 0.32 }, scene);
      arm1.position.set(lampPos.x + 0.04, lampPos.y + 0.16, lampPos.z);
      arm1.rotation.z = -0.32;
      arm1.material = brassMat;
      arm1.parent = lightNode;

      const arm2 = MeshBuilder.CreateCylinder('BrassArm2', { diameter: 0.012, height: 0.32 }, scene);
      arm2.position.set(lampPos.x + 0.16, lampPos.y + 0.38, lampPos.z + 0.04);
      arm2.rotation.z = 0.48;
      arm2.material = brassMat;
      arm2.parent = lightNode;

      const shade = MeshBuilder.CreateCylinder('BrassShade', { diameterTop: 0.02, diameterBottom: 0.12, height: 0.11 }, scene);
      shade.position.set(lampPos.x + 0.26, lampPos.y + 0.46, lampPos.z + 0.06);
      shade.rotation.z = Math.PI / 1.38;
      shade.material = brassMat;
      shade.parent = lightNode;

      // Glowing warm bulb
      const bulb = MeshBuilder.CreateSphere('BrassBulb', { diameter: 0.04 }, scene);
      bulb.position.set(lampPos.x + 0.24, lampPos.y + 0.44, lampPos.z + 0.06);
      const bulbMat = new StandardMaterial('BulbMat', scene);
      bulbMat.emissiveColor = new Color3(1, 0.92, 0.6);
      bulbMat.disableLighting = true;
      bulb.material = bulbMat;
      bulb.parent = lightNode;

      const spot = new SpotLight(
        'BrassSpot',
        new Vector3(lampPos.x + 0.24, lampPos.y + 0.44, lampPos.z + 0.06),
        new Vector3(0.5, -1, 0.4),
        Math.PI / 2.8,
        1.8,
        scene
      );
      spot.diffuse = new Color3(1, 0.88, 0.5);
      spot.intensity = 22;
      spot.parent = lightNode;
    }
  } else if (lightingId === 'light-sunset-rgb') {
    // Bali Sunset Ambient LED Strip with Real Bloom!
    const ledStrip = MeshBuilder.CreateBox('SunsetLEDStrip', { width: 1.36, height: 0.015, depth: 0.015 }, scene);
    ledStrip.position.set(0, deskSurfaceY - 0.005, -0.34);
    const stripMat = new StandardMaterial('SunsetNeonMat', scene);
    stripMat.emissiveColor = new Color3(1, 0.34, 0.13); // Glowing sunset orange
    stripMat.disableLighting = true;
    ledStrip.material = stripMat;
    ledStrip.parent = lightNode;

    // Sunset Atmosphere Wash Lights
    const centerPoint = new PointLight('SunsetCenterLight', new Vector3(0, deskSurfaceY + 0.15, -0.45), scene);
    centerPoint.diffuse = new Color3(1, 0.42, 0.21);
    centerPoint.intensity = 18;
    centerPoint.range = 4.0;
    centerPoint.parent = lightNode;

    const leftPoint = new PointLight('SunsetLeftLight', new Vector3(-0.48, deskSurfaceY + 0.08, -0.45), scene);
    leftPoint.diffuse = new Color3(0.96, 0.25, 0.37);
    leftPoint.intensity = 14;
    leftPoint.range = 3.5;
    leftPoint.parent = lightNode;

    const rightPoint = new PointLight('SunsetRightLight', new Vector3(0.48, deskSurfaceY + 0.08, -0.45), scene);
    rightPoint.diffuse = new Color3(0.98, 0.62, 0.1);
    rightPoint.intensity = 14;
    rightPoint.range = 3.5;
    rightPoint.parent = lightNode;
  }

  return lightNode;
}

// 6. BUILD PERIPHERALS & LIFESTYLE & PLANTS
export async function buildBabylonAccessories(
  scene: Scene,
  peripheralsId: string | null,
  plantId: string | null,
  lifestyleIds: string[],
  deskSurfaceY: number = 0.775,
  shadowGen: ShadowGenerator
): Promise<{ deskAccNode: TransformNode; floorAccNode: TransformNode }> {
  // Desk Surface Accessories (elevate with motorized desk)
  const deskAccNode = new TransformNode('DeskAccessoriesRoot', scene);
  deskAccNode.position.y = deskSurfaceY;

  // Floor Accessories (stay on floor permanently)
  const floorAccNode = new TransformNode('FloorAccessoriesRoot', scene);
  floorAccNode.position.y = 0;

  // Real GLB Nomad Vacuum Insulated Water Bottle on Desk
  try {
    const bottleRes = await SceneLoader.ImportMeshAsync('', '/models/', 'water_bottle.glb', scene);
    const bottleRoot = bottleRes.meshes[0];
    bottleRoot.parent = deskAccNode;
    bottleRoot.position.set(-0.48, 0.13, 0.12);
    bottleRoot.rotationQuaternion = null;
    bottleRoot.scaling.setAll(0.85);
    bottleRes.meshes.forEach((m) => {
      m.receiveShadows = true;
      shadowGen.addShadowCaster(m);
      m.metadata = { type: 'peripherals' };
    });
  } catch (e) {
    // optional prop
  }

  // A. Desk Mat & Peripherals
  const mat = MeshBuilder.CreateBox('DeskMat', { width: 0.75, height: 0.004, depth: 0.34 }, scene);
  mat.position.set(0, 0.002, 0.06);
  mat.receiveShadows = true;
  const matMat = new PBRMaterial('MatMat', scene);
  matMat.albedoColor = new Color3(0.12, 0.12, 0.14);
  matMat.roughness = 0.85;
  mat.material = matMat;
  mat.metadata = { type: 'peripherals' };
  mat.parent = deskAccNode;

  // Mechanical Keyboard
  const kb = MeshBuilder.CreateBox('Keyboard', { width: 0.31, height: 0.014, depth: 0.13 }, scene);
  kb.position.set(-0.06, 0.011, 0.08);
  const kbMat = new PBRMaterial('KBMat', scene);
  kbMat.albedoColor = new Color3(0.05, 0.05, 0.07);
  kbMat.roughness = 0.5;
  kb.material = kbMat;
  kb.metadata = { type: 'peripherals' };
  shadowGen.addShadowCaster(kb);
  kb.parent = deskAccNode;

  // Mouse
  const mouse = MeshBuilder.CreateBox('Mouse', { width: 0.06, height: 0.03, depth: 0.1 }, scene);
  mouse.position.set(0.22, 0.019, 0.08);
  mouse.material = kbMat;
  mouse.metadata = { type: 'peripherals' };
  shadowGen.addShadowCaster(mouse);
  mouse.parent = deskAccNode;

  // B. Coffee Machine & Cup (On Desk Back-Right Corner)
  if (lifestyleIds.includes('lifestyle-coffee-station')) {
    const coffeeBody = MeshBuilder.CreateBox('EspressoMachine', { width: 0.14, height: 0.22, depth: 0.22 }, scene);
    coffeeBody.position.set(0.56, 0.11, -0.16);
    const redMat = new PBRMaterial('CoffeeRed', scene);
    redMat.albedoColor = new Color3(0.75, 0.07, 0.24);
    redMat.roughness = 0.25;
    redMat.metallic = 0.6;
    coffeeBody.material = redMat;
    coffeeBody.metadata = { type: 'lifestyle' };
    shadowGen.addShadowCaster(coffeeBody);
    coffeeBody.parent = deskAccNode;

    const cup = MeshBuilder.CreateCylinder('CoffeeCup', { diameter: 0.04, height: 0.035 }, scene);
    cup.position.set(0.56, 0.038, -0.04);
    const cupMat = new PBRMaterial('CupMat', scene);
    cupMat.albedoColor = new Color3(1, 1, 1);
    cup.material = cupMat;
    cup.metadata = { type: 'lifestyle' };
    cup.parent = deskAccNode;
  }

  // C. Scooter Gear & Vintage Helmet (On Desk Front-Right Corner - No Collision!)
  if (lifestyleIds.includes('lifestyle-scooter-gear')) {
    const helmet = MeshBuilder.CreateSphere('ScooterHelmet', { diameter: 0.16, segments: 16 }, scene);
    helmet.position.set(0.56, 0.07, 0.20);
    const helmetMat = new PBRMaterial('HelmetMat', scene);
    helmetMat.albedoColor = new Color3(0.06, 0.08, 0.12);
    helmetMat.roughness = 0.35;
    helmetMat.metallic = 0.3;
    helmet.material = helmetMat;
    helmet.metadata = { type: 'lifestyle', id: 'lifestyle-scooter-gear' };
    shadowGen.addShadowCaster(helmet);
    helmet.parent = deskAccNode;

    // Amber / gold retro visor
    const visor = MeshBuilder.CreateTorus('HelmetVisor', { diameter: 0.15, thickness: 0.012, tessellation: 24 }, scene);
    visor.rotation.x = Math.PI / 2.3;
    visor.position.set(0.56, 0.045, 0.22);
    const visorMat = new PBRMaterial('VisorMat', scene);
    visorMat.albedoColor = new Color3(0.95, 0.62, 0.08);
    visorMat.roughness = 0.15;
    visorMat.metallic = 0.8;
    visor.material = visorMat;
    visor.metadata = { type: 'lifestyle', id: 'lifestyle-scooter-gear' };
    visor.parent = deskAccNode;
  }

  // D. Surfboard propped against right wall (On Floor)
  if (lifestyleIds.includes('lifestyle-surfboard')) {
    const board = MeshBuilder.CreateBox('Surfboard', { width: 0.38, height: 1.65, depth: 0.04 }, scene);
    board.position.set(1.4, 0.82, -0.35);
    board.rotation.y = -0.35;
    board.rotation.x = -0.16;
    const boardMat = new PBRMaterial('BoardMat', scene);
    boardMat.albedoColor = new Color3(0.01, 0.52, 0.78); // Ocean cyan
    boardMat.roughness = 0.25;
    boardMat.metallic = 0.15;
    board.material = boardMat;
    board.metadata = { type: 'lifestyle' };
    shadowGen.addShadowCaster(board);
    board.parent = floorAccNode;
  }

  // E. Linen Bean Bag (On Floor)
  if (lifestyleIds.includes('lifestyle-beanbag')) {
    const beanbag = MeshBuilder.CreateSphere('Beanbag', { diameter: 0.76, segments: 20 }, scene);
    beanbag.scaling.set(1.15, 0.55, 1.15);
    beanbag.position.set(-1.25, 0.19, 0.75);
    const linenMat = new PBRMaterial('LinenMat', scene);
    linenMat.albedoColor = new Color3(0.84, 0.81, 0.75);
    linenMat.roughness = 0.9;
    beanbag.material = linenMat;
    beanbag.receiveShadows = true;
    beanbag.metadata = { type: 'lifestyle' };
    shadowGen.addShadowCaster(beanbag);
    beanbag.parent = floorAccNode;
  }

  // F. Botanical Greenery: Photorealistic PBR Potted Plant (On Floor)
  if (plantId === 'plant-monstera') {
    let loadedPlant = false;
    try {
      const plantRes = await SceneLoader.ImportMeshAsync('', '/models/', 'plant_potted.glb', scene);
      const plantRoot = plantRes.meshes[0];
      plantRoot.parent = floorAccNode;
      plantRoot.position.set(-1.18, 0, 0.35);
      plantRoot.rotationQuaternion = null;
      plantRoot.scaling.setAll(1.05);
      plantRes.meshes.forEach((m) => {
        m.receiveShadows = true;
        shadowGen.addShadowCaster(m);
        m.metadata = { type: 'plants', id: 'plant-monstera' };
      });
      loadedPlant = true;
    } catch (e) {
      console.warn('Failed to load plant_potted.glb, using procedural fallback:', e);
    }

    if (!loadedPlant) {
      const pot = MeshBuilder.CreateCylinder('TerracottaPot', { diameterTop: 0.36, diameterBottom: 0.26, height: 0.32 }, scene);
      pot.position.set(-1.15, 0.16, 0.3);
      const potMat = new PBRMaterial('PotMat', scene);
      potMat.albedoColor = new Color3(0.7, 0.33, 0.04);
      potMat.roughness = 0.8;
      pot.material = potMat;
      pot.metadata = { type: 'plants' };
      shadowGen.addShadowCaster(pot);
      pot.parent = floorAccNode;

      const leafMat = new PBRMaterial('LeafMat', scene);
      leafMat.albedoColor = new Color3(0.02, 0.59, 0.41);
      leafMat.roughness = 0.35;

      for (let i = 0; i < 5; i++) {
        const leaf = MeshBuilder.CreateDisc(`Leaf${i}`, { radius: 0.28, tessellation: 16 }, scene);
        leaf.position.set(-1.15 + Math.sin(i) * 0.15, 0.45 + i * 0.08, 0.3 + Math.cos(i) * 0.15);
        leaf.rotation.x = Math.PI / 3.5;
        leaf.rotation.y = (i * Math.PI) / 2.5;
        leaf.material = leafMat;
        leaf.metadata = { type: 'plants' };
        leaf.parent = floorAccNode;
      }
    }
  }

  return { deskAccNode, floorAccNode };
}

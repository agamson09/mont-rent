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
  const wallZ = -1.35;

  // Left Wall Segment
  const leftSegGeo = new THREE.PlaneGeometry(1.6, 4.5);
  const leftSeg = new THREE.Mesh(leftSegGeo, wallMat);
  leftSeg.position.set(-2.4, 2.25, wallZ);
  leftSeg.receiveShadow = true;
  roomGroup.add(leftSeg);

  // Right Wall Segment
  const rightSegGeo = new THREE.PlaneGeometry(1.6, 4.5);
  const rightSeg = new THREE.Mesh(rightSegGeo, wallMat);
  rightSeg.position.set(2.4, 2.25, wallZ);
  rightSeg.receiveShadow = true;
  roomGroup.add(rightSeg);

  // Bottom Wall Segment (below window sill)
  const bottomSegGeo = new THREE.PlaneGeometry(3.2, 0.85);
  const bottomSeg = new THREE.Mesh(bottomSegGeo, wallMat);
  bottomSeg.position.set(0, 0.425, wallZ);
  bottomSeg.receiveShadow = true;
  roomGroup.add(bottomSeg);

  // Top Wall Segment (above window header)
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
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
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

  // 6. OUTDOOR PHOTOREALISTIC SCENERY PLANE
  const imageMap = {
    'villa-pool': '/textures/villa-pool.jpg',
    'rice-terrace': '/textures/rice-terrace.jpg',
    'minimal-studio': '/textures/minimal-studio.jpg',
  };

  const textureUrl = imageMap[backdrop] || imageMap['villa-pool'];
  const textureLoader = new THREE.TextureLoader();
  const sceneryTexture = textureLoader.load(textureUrl);
  sceneryTexture.colorSpace = THREE.SRGBColorSpace;

  const tintColors = {
    day: 0xffffff,
    sunset: 0xfdba74,
    night: 0x475569, // Soft moonlit twilight
  };

  const sceneryMat = new THREE.MeshBasicMaterial({
    map: sceneryTexture,
    color: tintColors[lightingMode],
    depthTest: true,
  });

  const sceneryGeo = new THREE.PlaneGeometry(4.8, 2.8);
  const sceneryMesh = new THREE.Mesh(sceneryGeo, sceneryMat);
  sceneryMesh.position.set(0, 1.9, wallZ - 0.06); // Positioned directly behind the window opening
  roomGroup.add(sceneryMesh);

  return roomGroup;
}

import * as THREE from 'three';

export function buildPeripherals3D(
  peripheralsId: string | null,
  deskSurfaceY: number = 0.775,
  lightingId: string | null = null
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PeripheralsRoot';
  group.userData = { type: 'peripherals', id: peripheralsId };

  if (!peripheralsId && !lightingId) return group;

  // 1. Desk Mat (Always provides comfortable grounding on desk)
  const matWidth = 0.75;
  const matDepth = 0.34;
  const matThickness = 0.004;

  const matColor =
    peripheralsId === 'peripherals-deskmat-wool'
      ? 0x27272a // Charcoal Wool Felt
      : peripheralsId === 'peripherals-apple-studio'
      ? 0x334155 // Sleek Slate
      : 0x18181b; // Matte Dark

  const matGeo = new THREE.BoxGeometry(matWidth, matThickness, matDepth);
  const matMaterial = new THREE.MeshStandardMaterial({ color: matColor, roughness: 0.85, metalness: 0.05 });
  const matMesh = new THREE.Mesh(matGeo, matMaterial);
  matMesh.position.set(0, deskSurfaceY + matThickness / 2, 0.06);
  matMesh.receiveShadow = true;
  group.add(matMesh);

  // 2. Keyboard & Mouse Setup
  if (peripheralsId === 'peripherals-pro-bundle' || peripheralsId === null) {
    // Logitech MX Mechanical Mini Keyboard
    const kbGeo = new THREE.BoxGeometry(0.31, 0.014, 0.13);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5, metalness: 0.3 });
    const kbMesh = new THREE.Mesh(kbGeo, kbMat);
    kbMesh.position.set(-0.06, deskSurfaceY + matThickness + 0.007, 0.08);
    kbMesh.castShadow = true;
    group.add(kbMesh);

    // Keycaps Row Grid
    const keyRowsGeo = new THREE.BoxGeometry(0.29, 0.006, 0.11);
    const keyRowsMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.6 });
    const keyRows = new THREE.Mesh(keyRowsGeo, keyRowsMat);
    keyRows.position.set(-0.06, deskSurfaceY + matThickness + 0.016, 0.08);
    group.add(keyRows);

    // Logitech MX Master 3S Mouse
    const mouseGeo = new THREE.BoxGeometry(0.06, 0.03, 0.1);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.2 });
    const mouseMesh = new THREE.Mesh(mouseGeo, mouseMat);
    mouseMesh.position.set(0.22, deskSurfaceY + matThickness + 0.015, 0.08);
    mouseMesh.castShadow = true;
    group.add(mouseMesh);

    // Metal scroll wheel
    const wheelGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.015, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.1 });
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0.22, deskSurfaceY + matThickness + 0.032, 0.06);
    group.add(wheel);
  } else if (peripheralsId === 'peripherals-apple-studio') {
    // Apple Magic Keyboard Space Gray
    const appleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.7 });
    const kbGeo = new THREE.BoxGeometry(0.28, 0.008, 0.115);
    const kbMesh = new THREE.Mesh(kbGeo, appleMat);
    kbMesh.position.set(-0.08, deskSurfaceY + matThickness + 0.004, 0.08);
    kbMesh.castShadow = true;
    group.add(kbMesh);

    // Apple Magic Trackpad
    const trackpadGeo = new THREE.BoxGeometry(0.13, 0.007, 0.115);
    const trackpadMesh = new THREE.Mesh(trackpadGeo, appleMat);
    trackpadMesh.position.set(0.18, deskSurfaceY + matThickness + 0.0035, 0.08);
    trackpadMesh.castShadow = true;
    group.add(trackpadMesh);
  }

  return group;
}

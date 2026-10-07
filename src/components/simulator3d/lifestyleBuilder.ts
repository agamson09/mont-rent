import * as THREE from 'three';

export function buildLifestyle3D(
  lifestyleIds: string[],
  deskSurfaceY: number = 0.775
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'LifestyleRoot';
  group.userData = { type: 'lifestyle' };

  // --- 1. COFFEE STATION (DE'LONGHI ESPRESSO MACHINE ON DESK RIGHT) ---
  if (lifestyleIds.includes('lifestyle-coffee-station')) {
    const coffeeGroup = new THREE.Group();
    coffeeGroup.position.set(0.56, deskSurfaceY, -0.16); // Back right corner of desk surface

    const redMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.3, metalness: 0.6 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.95 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });

    // Machine Main Body
    const bodyGeo = new THREE.BoxGeometry(0.14, 0.22, 0.22);
    const body = new THREE.Mesh(bodyGeo, redMat);
    body.position.y = 0.11;
    body.castShadow = true;
    coffeeGroup.add(body);

    // Cup Warming Tray Top
    const trayGeo = new THREE.BoxGeometry(0.13, 0.015, 0.16);
    const tray = new THREE.Mesh(trayGeo, chromeMat);
    tray.position.set(0, 0.225, 0);
    coffeeGroup.add(tray);

    // Metal Drip Tray at Bottom Front
    const dripGeo = new THREE.BoxGeometry(0.13, 0.02, 0.08);
    const drip = new THREE.Mesh(dripGeo, chromeMat);
    drip.position.set(0, 0.01, 0.13);
    coffeeGroup.add(drip);

    // Portafilter Handle
    const filterGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8);
    const filter = new THREE.Mesh(filterGeo, blackMat);
    filter.rotation.x = Math.PI / 2;
    filter.position.set(-0.02, 0.12, 0.16);
    filter.castShadow = true;
    coffeeGroup.add(filter);

    // Tiny Ceramic Espresso Cup
    const cupGeo = new THREE.CylinderGeometry(0.022, 0.016, 0.035, 16);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.set(0, 0.038, 0.12);
    cup.castShadow = true;
    coffeeGroup.add(cup);

    // Crema liquid
    const cremaGeo = new THREE.CircleGeometry(0.018, 16);
    const cremaMat = new THREE.MeshBasicMaterial({ color: 0x78350f });
    const crema = new THREE.Mesh(cremaGeo, cremaMat);
    crema.rotation.x = -Math.PI / 2;
    crema.position.set(0, 0.055, 0.12);
    coffeeGroup.add(crema);

    group.add(coffeeGroup);
  }

  // --- 2. SURFBOARD (PROPPED AGAINST WALL ON FAR RIGHT) ---
  if (lifestyleIds.includes('lifestyle-surfboard')) {
    const boardGroup = new THREE.Group();
    // Leaning in the right back corner
    boardGroup.position.set(1.3, 0, -0.42);
    boardGroup.rotation.y = -0.35;
    boardGroup.rotation.x = -0.16; // leaning back against wall

    // Surfboard Mesh
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Bali ocean cyan
      roughness: 0.25,
      metalness: 0.15,
    });

    const boardGeo = new THREE.BoxGeometry(0.38, 1.65, 0.04);
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 0.82;
    board.scale.set(1, 1, 0.5); // thin profile
    board.castShadow = true;
    board.receiveShadow = true;
    boardGroup.add(board);

    // Wooden Stringer Stripe down the middle
    const stringerGeo = new THREE.BoxGeometry(0.015, 1.66, 0.042);
    const stringerMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 });
    const stringer = new THREE.Mesh(stringerGeo, stringerMat);
    stringer.position.y = 0.82;
    boardGroup.add(stringer);

    // Twin Fins at Tail
    const finMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const finGeo = new THREE.BoxGeometry(0.01, 0.09, 0.06);

    const leftFin = new THREE.Mesh(finGeo, finMat);
    leftFin.position.set(-0.12, 0.12, -0.04);
    boardGroup.add(leftFin);

    const rightFin = new THREE.Mesh(finGeo, finMat);
    rightFin.position.set(0.12, 0.12, -0.04);
    boardGroup.add(rightFin);

    group.add(boardGroup);
  }

  // --- 3. OVERSIZED LINEN BEAN BAG (FLOOR LEFT) ---
  if (lifestyleIds.includes('lifestyle-beanbag')) {
    const beanbagGroup = new THREE.Group();
    beanbagGroup.position.set(-1.1, 0, 0.7); // Floor front-left

    const linenMat = new THREE.MeshStandardMaterial({
      color: 0xd6cebe, // Sun-bleached sand
      roughness: 0.9,
      metalness: 0.05,
    });

    // Flattened squircle bean bag
    const bagGeo = new THREE.SphereGeometry(0.38, 24, 16);
    const bag = new THREE.Mesh(bagGeo, linenMat);
    bag.scale.set(1.15, 0.55, 1.15); // squished pouf
    bag.position.y = 0.19;
    bag.castShadow = true;
    bag.receiveShadow = true;
    beanbagGroup.add(bag);

    group.add(beanbagGroup);
  }

  // --- 4. SCOOTER GEAR & HELMET (CANGGU NMAX/VESPA GEAR) ---
  if (lifestyleIds.includes('lifestyle-scooter-gear')) {
    const helmetGroup = new THREE.Group();
    helmetGroup.position.set(0.55, deskSurfaceY, 0.22); // Front right corner of desk

    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.4 });
    const helmetGeo = new THREE.SphereGeometry(0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.3);
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.rotation.x = Math.PI;
    helmet.position.y = 0.07;
    helmet.castShadow = true;
    helmetGroup.add(helmet);

    // Chrome Visor Trim
    const visorGeo = new THREE.TorusGeometry(0.075, 0.006, 8, 24, Math.PI);
    const visorMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.1, metalness: 0.8 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = Math.PI / 2.3;
    visor.position.set(0, 0.04, 0.02);
    helmetGroup.add(visor);

    group.add(helmetGroup);
  }

  return group;
}

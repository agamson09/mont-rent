import * as THREE from 'three';

export function buildPlant3D(plantId: string | null, deskSurfaceY: number = 0.775): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PlantRoot';
  group.userData = { type: 'plants', id: plantId };

  if (!plantId) return group;

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    roughness: 0.35,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  // --- OPTION 1: TROPICAL MONSTERA DELICIOSA (BALI CERAMIC POT) ---
  if (plantId === 'plant-monstera') {
    const plantAssembly = new THREE.Group();
    plantAssembly.position.set(-1.0, 0, 0.25); // Sits on floor to the left

    // Terracotta Pot
    const potMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75, metalness: 0.05 });
    const potGeo = new THREE.CylinderGeometry(0.18, 0.13, 0.32, 24);
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.y = 0.16;
    pot.castShadow = true;
    pot.receiveShadow = true;
    plantAssembly.add(pot);

    // Pot Rim
    const rimGeo = new THREE.CylinderGeometry(0.19, 0.18, 0.04, 24);
    const rim = new THREE.Mesh(rimGeo, potMat);
    rim.position.y = 0.32;
    rim.castShadow = true;
    plantAssembly.add(rim);

    // Soil
    const soilGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.02, 24);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x271a10, roughness: 0.9 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = 0.31;
    plantAssembly.add(soil);

    // Monstera Stems & Leaves branching outwards
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.5 });
    const leafAngles = [
      { rx: 0.3, rz: -0.4, scale: 0.28, height: 0.45 },
      { rx: -0.2, rz: -0.6, scale: 0.32, height: 0.55 },
      { rx: 0.1, rz: 0.3, scale: 0.3, height: 0.5 },
      { rx: -0.3, rz: 0.2, scale: 0.26, height: 0.42 },
      { rx: 0.0, rz: -0.2, scale: 0.34, height: 0.62 },
    ];

    leafAngles.forEach((leaf) => {
      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.008, 0.012, leaf.height, 8);
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(leaf.rz * 0.2, 0.32 + leaf.height / 2, leaf.rx * 0.2);
      stem.rotation.x = leaf.rx;
      stem.rotation.z = leaf.rz;
      stem.castShadow = true;
      plantAssembly.add(stem);

      // Heart/Oval Leaf Plane
      const leafGeo = new THREE.CircleGeometry(leaf.scale, 16);
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.position.set(leaf.rz * 0.45, 0.32 + leaf.height + 0.05, leaf.rx * 0.45);
      leafMesh.rotation.x = leaf.rx + Math.PI / 4;
      leafMesh.rotation.z = leaf.rz;
      leafMesh.castShadow = true;
      plantAssembly.add(leafMesh);
    });

    group.add(plantAssembly);
  }

  // --- OPTION 2: FIDDLE LEAF FIG TREE (WOVEN SEAGRASS BASKET) ---
  else if (plantId === 'plant-fiddle-fig') {
    const treeAssembly = new THREE.Group();
    treeAssembly.position.set(1.05, 0, 0.15); // Sits on floor to the right

    // Woven Seagrass Basket
    const basketMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 });
    const basketGeo = new THREE.CylinderGeometry(0.19, 0.16, 0.34, 24);
    const basket = new THREE.Mesh(basketGeo, basketMat);
    basket.position.y = 0.17;
    basket.castShadow = true;
    basket.receiveShadow = true;
    treeAssembly.add(basket);

    // Woody Trunk
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a381b, roughness: 0.9 });
    const trunkGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.9, 10);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.65;
    trunk.castShadow = true;
    treeAssembly.add(trunk);

    // Broad Fiddle Fig Leaves
    for (let i = 0; i < 7; i++) {
      const angle = (i * Math.PI * 2) / 4 + i * 0.4;
      const h = 0.45 + i * 0.11;
      const leafGeo = new THREE.BoxGeometry(0.18, 0.28, 0.005);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(Math.sin(angle) * 0.14, h, Math.cos(angle) * 0.14);
      leaf.rotation.y = angle;
      leaf.rotation.x = 0.35;
      leaf.castShadow = true;
      treeAssembly.add(leaf);
    }

    group.add(treeAssembly);
  }

  // --- OPTION 3: DESKTOP SUCCULENT TRIO ---
  else if (plantId === 'plant-desktop-bonsai') {
    const bonsaiGroup = new THREE.Group();
    bonsaiGroup.position.set(0.52, deskSurfaceY, -0.15); // Corner of desk

    // Concrete Desktop Planter
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75, metalness: 0.1 });
    const planterGeo = new THREE.BoxGeometry(0.2, 0.04, 0.08);
    const planter = new THREE.Mesh(planterGeo, concreteMat);
    planter.position.y = 0.02;
    planter.castShadow = true;
    bonsaiGroup.add(planter);

    // 3 Succulents
    const succMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    for (let i = -1; i <= 1; i++) {
      const succGeo = new THREE.ConeGeometry(0.025, 0.05, 8);
      const succ = new THREE.Mesh(succGeo, succMat);
      succ.position.set(i * 0.06, 0.055, 0);
      succ.castShadow = true;
      bonsaiGroup.add(succ);
    }

    group.add(bonsaiGroup);
  }

  return group;
}

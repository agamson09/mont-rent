import * as THREE from 'three';

export function buildChair3D(chairId: string): THREE.Group {
  const chairGroup = new THREE.Group();
  chairGroup.name = 'ChairRoot';
  chairGroup.position.set(0, 0, 0.52); // Positioned in front of the desk
  chairGroup.userData = { type: 'chair', id: chairId };

  // Shared Materials
  const blackPlasticMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.9 });
  const darkFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0.1 });

  // --- MODEL 1: ERGOPRO AERO-MESH (BALI EDITION) ---
  if (chairId === 'chair-ergopro-mesh' || !chairId) {
    // 1. 5-Star Wheel Base
    const baseGroup = new THREE.Group();
    const hubGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.04, 16);
    const hub = new THREE.Mesh(hubGeo, blackPlasticMat);
    hub.position.y = 0.06;
    baseGroup.add(hub);

    // 5 Legs with Castor Wheels
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const legGeo = new THREE.BoxGeometry(0.035, 0.025, 0.28);
      const leg = new THREE.Mesh(legGeo, blackPlasticMat);
      leg.position.set(Math.sin(angle) * 0.14, 0.045, Math.cos(angle) * 0.14);
      leg.rotation.y = angle;
      leg.castShadow = true;
      baseGroup.add(leg);

      // Wheel
      const wheelGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.02, 12);
      const wheel = new THREE.Mesh(wheelGeo, darkFrameMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(Math.sin(angle) * 0.27, 0.022, Math.cos(angle) * 0.27);
      wheel.castShadow = true;
      baseGroup.add(wheel);
    }
    chairGroup.add(baseGroup);

    // 2. Gas Lift Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.38, 16);
    const cylinder = new THREE.Mesh(cylinderGeo, chromeMat);
    cylinder.position.y = 0.24;
    cylinder.castShadow = true;
    chairGroup.add(cylinder);

    // 3. Seat Pan (Waterfall Ergonomic Curve)
    const seatGeo = new THREE.BoxGeometry(0.48, 0.06, 0.46);
    const meshSeatMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.1,
    });
    const seat = new THREE.Mesh(seatGeo, meshSeatMat);
    seat.position.set(0, 0.44, -0.04);
    seat.castShadow = true;
    seat.receiveShadow = true;
    seat.userData = { type: 'chair', id: chairId };
    chairGroup.add(seat);

    // 4. Backrest Frame & Aero-Mesh
    const backGroup = new THREE.Group();
    backGroup.position.set(0, 0.7, -0.22);
    backGroup.rotation.x = -0.08; // subtle ergonomic recline

    // Back Spine Rib
    const spineGeo = new THREE.BoxGeometry(0.06, 0.5, 0.03);
    const spine = new THREE.Mesh(spineGeo, darkFrameMat);
    spine.castShadow = true;
    backGroup.add(spine);

    // Mesh Canvas Frame
    const backFrameGeo = new THREE.BoxGeometry(0.44, 0.48, 0.025);
    const meshBackMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8,
      metalness: 0.05,
      transparent: true,
      opacity: 0.92,
    });
    const backMesh = new THREE.Mesh(backFrameGeo, meshBackMat);
    backMesh.castShadow = true;
    backMesh.userData = { type: 'chair', id: chairId };
    backGroup.add(backMesh);

    // Dynamic Lumbar Support Band
    const lumbarGeo = new THREE.BoxGeometry(0.36, 0.08, 0.04);
    const lumbarMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4, metalness: 0.3 });
    const lumbar = new THREE.Mesh(lumbarGeo, lumbarMat);
    lumbar.position.set(0, -0.12, 0.02);
    lumbar.castShadow = true;
    backGroup.add(lumbar);

    // Ergonomic Headrest
    const headrestGeo = new THREE.BoxGeometry(0.24, 0.1, 0.06);
    const headrest = new THREE.Mesh(headrestGeo, blackPlasticMat);
    headrest.position.set(0, 0.32, 0.02);
    headrest.castShadow = true;
    backGroup.add(headrest);

    chairGroup.add(backGroup);

    // 5. 4D Armrests
    const armGeo = new THREE.BoxGeometry(0.08, 0.025, 0.22);
    const armPoleGeo = new THREE.BoxGeometry(0.03, 0.2, 0.03);

    // Left Armrest
    const leftArmPole = new THREE.Mesh(armPoleGeo, blackPlasticMat);
    leftArmPole.position.set(-0.25, 0.52, -0.05);
    chairGroup.add(leftArmPole);
    const leftArmPad = new THREE.Mesh(armGeo, darkFrameMat);
    leftArmPad.position.set(-0.25, 0.62, -0.05);
    leftArmPad.castShadow = true;
    chairGroup.add(leftArmPad);

    // Right Armrest
    const rightArmPole = new THREE.Mesh(armPoleGeo, blackPlasticMat);
    rightArmPole.position.set(0.25, 0.52, -0.05);
    chairGroup.add(rightArmPole);
    const rightArmPad = new THREE.Mesh(armGeo, darkFrameMat);
    rightArmPad.position.set(0.25, 0.62, -0.05);
    rightArmPad.castShadow = true;
    chairGroup.add(rightArmPad);
  }

  // --- MODEL 2: HIGH-BACK EXECUTIVE LEATHER ---
  else if (chairId === 'chair-executive-leather') {
    // Chrome Base
    const baseGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const legGeo = new THREE.BoxGeometry(0.03, 0.02, 0.28);
      const leg = new THREE.Mesh(legGeo, chromeMat);
      leg.position.set(Math.sin(angle) * 0.14, 0.045, Math.cos(angle) * 0.14);
      leg.rotation.y = angle;
      leg.castShadow = true;
      baseGroup.add(leg);

      const wheelGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.02, 12);
      const wheel = new THREE.Mesh(wheelGeo, darkFrameMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(Math.sin(angle) * 0.27, 0.022, Math.cos(angle) * 0.27);
      baseGroup.add(wheel);
    }
    chairGroup.add(baseGroup);

    // Chrome Lift Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.38, 16);
    const cylinder = new THREE.Mesh(cylinderGeo, chromeMat);
    cylinder.position.y = 0.24;
    chairGroup.add(cylinder);

    // Plush Padded Leather Seat
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.15 });
    const seatGeo = new THREE.BoxGeometry(0.5, 0.09, 0.48);
    const seat = new THREE.Mesh(seatGeo, leatherMat);
    seat.position.set(0, 0.44, -0.04);
    seat.castShadow = true;
    seat.receiveShadow = true;
    seat.userData = { type: 'chair', id: chairId };
    chairGroup.add(seat);

    // High Backrest with Pleats
    const backGeo = new THREE.BoxGeometry(0.48, 0.65, 0.08);
    const back = new THREE.Mesh(backGeo, leatherMat);
    back.position.set(0, 0.76, -0.24);
    back.rotation.x = -0.06;
    back.castShadow = true;
    back.userData = { type: 'chair', id: chairId };
    chairGroup.add(back);

    // Integrated Pillow Cushion
    const pillowGeo = new THREE.BoxGeometry(0.32, 0.15, 0.06);
    const pillow = new THREE.Mesh(pillowGeo, leatherMat);
    pillow.position.set(0, 1.02, -0.22);
    pillow.castShadow = true;
    chairGroup.add(pillow);

    // Chrome Loop Armrests
    const leftLoopGeo = new THREE.TorusGeometry(0.12, 0.015, 12, 24, Math.PI);
    const leftArm = new THREE.Mesh(leftLoopGeo, chromeMat);
    leftArm.rotation.y = Math.PI / 2;
    leftArm.position.set(-0.26, 0.56, -0.08);
    chairGroup.add(leftArm);

    const rightArm = new THREE.Mesh(leftLoopGeo, chromeMat);
    rightArm.rotation.y = Math.PI / 2;
    rightArm.position.set(0.26, 0.56, -0.08);
    chairGroup.add(rightArm);
  }

  // --- MODEL 3: ACTIVE CORE BALANCE STOOL ---
  else if (chairId === 'chair-active-stool') {
    // Weighted Rocker Dome Base
    const domeGeo = new THREE.SphereGeometry(0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, darkFrameMat);
    dome.rotation.x = Math.PI;
    dome.position.y = 0.08;
    dome.scale.set(1, 0.4, 1);
    dome.castShadow = true;
    chairGroup.add(dome);

    // Tall Gas Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.52, 16);
    const cylinder = new THREE.Mesh(cylinderGeo, chromeMat);
    cylinder.position.y = 0.32;
    cylinder.castShadow = true;
    chairGroup.add(cylinder);

    // Teal Saddle Cushion
    const saddleGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.08, 24);
    const saddleMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.5, metalness: 0.1 });
    const saddle = new THREE.Mesh(saddleGeo, saddleMat);
    saddle.position.set(0, 0.6, 0);
    saddle.castShadow = true;
    saddle.userData = { type: 'chair', id: chairId };
    chairGroup.add(saddle);

    // Height Adjustment Ring Handle
    const ringGeo = new THREE.TorusGeometry(0.12, 0.01, 12, 24);
    const ring = new THREE.Mesh(ringGeo, blackPlasticMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.52;
    chairGroup.add(ring);
  }

  // --- MODEL 4: NORDIC SCANDI SWIVEL ---
  else if (chairId === 'chair-scandi-swivel') {
    // 4 Splayed Oak Legs
    const oakMat = new THREE.MeshStandardMaterial({ color: 0xb07d4c, roughness: 0.4 });
    const legLength = 0.45;

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4 + Math.PI / 4;
      const legGeo = new THREE.CylinderGeometry(0.015, 0.01, legLength, 12);
      const leg = new THREE.Mesh(legGeo, oakMat);
      leg.position.set(Math.sin(angle) * 0.16, 0.22, Math.cos(angle) * 0.16);
      leg.rotation.z = Math.cos(angle) * 0.22;
      leg.rotation.x = -Math.sin(angle) * 0.22;
      leg.castShadow = true;
      chairGroup.add(leg);
    }

    // Fabric Shell Bucket Seat
    const linenMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const seatGeo = new THREE.BoxGeometry(0.46, 0.06, 0.44);
    const seat = new THREE.Mesh(seatGeo, linenMat);
    seat.position.set(0, 0.44, -0.02);
    seat.castShadow = true;
    seat.userData = { type: 'chair', id: chairId };
    chairGroup.add(seat);

    const backGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.4, 16, 1, true, 0, Math.PI);
    const back = new THREE.Mesh(backGeo, linenMat);
    back.position.set(0, 0.62, -0.16);
    back.rotation.y = Math.PI / 2;
    back.castShadow = true;
    back.userData = { type: 'chair', id: chairId };
    chairGroup.add(back);
  }

  return chairGroup;
}

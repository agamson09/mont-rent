import * as THREE from 'three';

export function buildLighting3D(
  lightingId: string | null,
  deskSurfaceY: number = 0.775,
  scene: THREE.Scene
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'LightingRoot';
  group.userData = { type: 'lighting', id: lightingId };

  if (!lightingId) return group;

  // --- MODEL 1: BENQ WIT SCREENBAR HALO LIGHTBAR ---
  if (lightingId === 'light-screenbar') {
    const screenbarGroup = new THREE.Group();
    // Clamped atop the central monitor bezel
    screenbarGroup.position.set(0, deskSurfaceY + 0.52, -0.22);

    const barMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.85,
      roughness: 0.2,
    });

    // Horizontal Tube
    const barGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.46, 16);
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.rotation.z = Math.PI / 2;
    screenbarGroup.add(bar);

    // Monitor Clamp Bracket
    const clampGeo = new THREE.BoxGeometry(0.045, 0.05, 0.04);
    const clamp = new THREE.Mesh(clampGeo, barMat);
    clamp.position.set(0, -0.02, -0.02);
    screenbarGroup.add(clamp);

    // Glowing LED Diffuser (Intense emissive warm white)
    const ledGeo = new THREE.PlaneGeometry(0.42, 0.012);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.rotation.x = Math.PI / 2;
    led.position.y = -0.012;
    screenbarGroup.add(led);

    // Powerful 3D Downward Task Spotlight
    const spot = new THREE.SpotLight(0xfffbeb, 18, 2.4, Math.PI / 3.2, 0.45, 1.0);
    spot.position.set(0, deskSurfaceY + 0.51, -0.2);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    spot.shadow.bias = -0.0005;

    // Target placed directly on the keyboard & desk mat
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, deskSurfaceY, 0.06);
    scene.add(spotTarget);
    spot.target = spotTarget;
    screenbarGroup.add(spot);

    // Ambient fill pointlight for subtle soft illumination
    const softFill = new THREE.PointLight(0xfffbeb, 4.0, 1.4);
    softFill.position.set(0, deskSurfaceY + 0.35, -0.1);
    screenbarGroup.add(softFill);

    group.add(screenbarGroup);
  }

  // --- MODEL 2: WARM BRASS ARCHITECTURAL ANGLE LAMP ---
  else if (lightingId === 'light-brass-architect') {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.54, deskSurfaceY, -0.16); // Left corner of desk

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.15,
      metalness: 0.88,
    });

    // Weighted Brass Base
    const baseGeo = new THREE.CylinderGeometry(0.065, 0.07, 0.018, 24);
    const base = new THREE.Mesh(baseGeo, brassMat);
    base.position.y = 0.009;
    base.castShadow = true;
    lampGroup.add(base);

    // Articulated Arm 1 (Lower)
    const arm1Geo = new THREE.CylinderGeometry(0.006, 0.006, 0.32, 12);
    const arm1 = new THREE.Mesh(arm1Geo, brassMat);
    arm1.position.set(0.04, 0.16, 0);
    arm1.rotation.z = -0.32;
    arm1.castShadow = true;
    lampGroup.add(arm1);

    // Joint Knob
    const jointGeo = new THREE.SphereGeometry(0.012, 12, 12);
    const joint = new THREE.Mesh(jointGeo, brassMat);
    joint.position.set(0.08, 0.3, 0);
    lampGroup.add(joint);

    // Articulated Arm 2 (Upper)
    const arm2 = new THREE.Mesh(arm1Geo, brassMat);
    arm2.position.set(0.16, 0.38, 0.04);
    arm2.rotation.z = 0.48;
    arm2.castShadow = true;
    lampGroup.add(arm2);

    // Brass Shade Cone
    const shadeGeo = new THREE.ConeGeometry(0.065, 0.11, 20);
    const shade = new THREE.Mesh(shadeGeo, brassMat);
    shade.position.set(0.26, 0.46, 0.06);
    shade.rotation.z = Math.PI / 1.38;
    shade.castShadow = true;
    lampGroup.add(shade);

    // Glowing 2700K Warm Bulb
    const bulbGeo = new THREE.SphereGeometry(0.02, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0.24, 0.44, 0.06);
    lampGroup.add(bulb);

    // Warm Golden SpotLight
    const spot = new THREE.SpotLight(0xfef08a, 20, 2.6, Math.PI / 3.0, 0.4, 1.0);
    spot.position.set(-0.3, deskSurfaceY + 0.44, -0.1);
    spot.castShadow = true;
    spot.shadow.bias = -0.0005;

    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(-0.1, deskSurfaceY, 0.05);
    scene.add(spotTarget);
    spot.target = spotTarget;
    lampGroup.add(spot);

    group.add(lampGroup);
  }

  // --- MODEL 3: BALI SUNSET AMBIENT LED STRIP (THE EXACT SCREENSHOT ITEM!) ---
  else if (lightingId === 'light-sunset-rgb') {
    const ledGroup = new THREE.Group();
    // Mounted along the rear edge of the desk top
    ledGroup.position.set(0, deskSurfaceY, -0.34);

    // 1. Diffused Silicone LED Strip along Desk Back Edge
    const stripGeo = new THREE.BoxGeometry(1.36, 0.015, 0.015);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xff5722 }); // Vibrant sunset orange
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.y = -0.005;
    ledGroup.add(strip);

    // 2. Vertical LED Backlight Strip behind Central Monitor
    const vStripGeo = new THREE.BoxGeometry(0.015, 0.35, 0.015);
    const vStripMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e }); // Rose sunset glow
    const vStrip = new THREE.Mesh(vStripGeo, vStripMat);
    vStrip.position.set(0, 0.25, 0.1);
    ledGroup.add(vStrip);

    // 3. Multi-point Warm Sunset Atmosphere Lights shining onto the rear wall
    // Center Warm Orange PointLight
    const centerPoint = new THREE.PointLight(0xff6b35, 20, 4.0, 1.0);
    centerPoint.position.set(0, 0.15, -0.12);
    ledGroup.add(centerPoint);

    // Left Rose/Pink Sunset PointLight
    const leftPoint = new THREE.PointLight(0xf43f5e, 16, 3.5, 1.0);
    leftPoint.position.set(-0.48, 0.08, -0.12);
    ledGroup.add(leftPoint);

    // Right Golden Amber Sunset PointLight
    const rightPoint = new THREE.PointLight(0xf59e0b, 16, 3.5, 1.0);
    rightPoint.position.set(0.48, 0.08, -0.12);
    ledGroup.add(rightPoint);

    // Upward Wall Wash SpotLight
    const wallWash = new THREE.SpotLight(0xff7043, 26, 4.5, Math.PI / 2.2, 0.5, 1.0);
    wallWash.position.set(0, 0.05, 0);
    const wallWashTarget = new THREE.Object3D();
    wallWashTarget.position.set(0, deskSurfaceY + 0.9, -1.35); // Target on the rear wall
    scene.add(wallWashTarget);
    wallWash.target = wallWashTarget;
    ledGroup.add(wallWash);

    group.add(ledGroup);
  }

  return group;
}

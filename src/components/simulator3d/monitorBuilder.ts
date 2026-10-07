import * as THREE from 'three';
import { createScreenTexture } from './materials';

export function buildMonitor3D(
  monitorId: string,
  deskSurfaceY: number = 0.775,
  lightingId: string | null = null
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'MonitorRoot';
  group.userData = { type: 'monitors', id: monitorId };

  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.6 });
  const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 });
  const screenTex = createScreenTexture('vscode');
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });

  // --- MODEL 1: SINGLE 27" 4K DELL ULTRASHARP ---
  if (monitorId === 'monitor-single-27' || !monitorId) {
    const monitorAssembly = new THREE.Group();
    monitorAssembly.position.set(0, deskSurfaceY, -0.22); // Sits towards back of desk

    // 1. Stand Base on Desk
    const baseGeo = new THREE.BoxGeometry(0.24, 0.012, 0.2);
    const base = new THREE.Mesh(baseGeo, standMat);
    base.position.y = 0.006;
    base.castShadow = true;
    base.receiveShadow = true;
    monitorAssembly.add(base);

    // 2. Vertical Arm Column
    const poleGeo = new THREE.BoxGeometry(0.05, 0.38, 0.035);
    const pole = new THREE.Mesh(poleGeo, standMat);
    pole.position.set(0, 0.2, -0.04);
    pole.castShadow = true;
    monitorAssembly.add(pole);

    // 3. 27" Display Panel
    const panelWidth = 0.62;
    const panelHeight = 0.37;
    const panelDepth = 0.02;

    const bezelGeo = new THREE.BoxGeometry(panelWidth, panelHeight, panelDepth);
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 0.32, 0);
    bezel.castShadow = true;
    bezel.userData = { type: 'monitors', id: monitorId };
    monitorAssembly.add(bezel);

    // Glowing Screen Surface
    const screenGeo = new THREE.PlaneGeometry(panelWidth - 0.02, panelHeight - 0.025);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.32, 0.011);
    screen.userData = { type: 'monitors', id: monitorId };
    monitorAssembly.add(screen);

    group.add(monitorAssembly);
  }

  // --- MODEL 2: DUAL 27" 4K DISPLAYS ON HEAVY-DUTY ARM ---
  else if (monitorId === 'monitor-dual-27') {
    const monitorAssembly = new THREE.Group();
    monitorAssembly.position.set(0, deskSurfaceY, -0.26);

    // Desk Clamp Base
    const clampGeo = new THREE.BoxGeometry(0.12, 0.06, 0.08);
    const clamp = new THREE.Mesh(clampGeo, standMat);
    clamp.position.y = 0.03;
    clamp.castShadow = true;
    monitorAssembly.add(clamp);

    // Center Pole
    const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.42, 16);
    const pole = new THREE.Mesh(poleGeo, standMat);
    pole.position.set(0, 0.22, 0);
    pole.castShadow = true;
    monitorAssembly.add(pole);

    const panelWidth = 0.58;
    const panelHeight = 0.36;

    // Left Display (Rotated inwards 12 degrees)
    const leftGroup = new THREE.Group();
    leftGroup.position.set(-0.31, 0.34, 0.04);
    leftGroup.rotation.y = 0.2; // ~12 degrees inward
    const leftBezel = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, panelHeight, 0.02), bezelMat);
    leftBezel.castShadow = true;
    leftBezel.userData = { type: 'monitors', id: monitorId };
    leftGroup.add(leftBezel);
    const leftScreen = new THREE.Mesh(new THREE.PlaneGeometry(panelWidth - 0.02, panelHeight - 0.025), screenMat);
    leftScreen.position.z = 0.011;
    leftScreen.userData = { type: 'monitors', id: monitorId };
    leftGroup.add(leftScreen);
    monitorAssembly.add(leftGroup);

    // Right Display (Rotated inwards -12 degrees)
    const rightGroup = new THREE.Group();
    rightGroup.position.set(0.31, 0.34, 0.04);
    rightGroup.rotation.y = -0.2;
    const rightBezel = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, panelHeight, 0.02), bezelMat);
    rightBezel.castShadow = true;
    rightBezel.userData = { type: 'monitors', id: monitorId };
    rightGroup.add(rightBezel);
    const rightScreen = new THREE.Mesh(new THREE.PlaneGeometry(panelWidth - 0.02, panelHeight - 0.025), screenMat);
    rightScreen.position.z = 0.011;
    rightScreen.userData = { type: 'monitors', id: monitorId };
    rightGroup.add(rightScreen);
    monitorAssembly.add(rightGroup);

    group.add(monitorAssembly);
  }

  // --- MODEL 3: 34" CURVED WQHD ULTRAWIDE ---
  else if (monitorId === 'monitor-ultrawide-34') {
    const monitorAssembly = new THREE.Group();
    monitorAssembly.position.set(0, deskSurfaceY, -0.24);

    // V-shaped Stand Base
    const baseGeo = new THREE.BoxGeometry(0.34, 0.01, 0.22);
    const base = new THREE.Mesh(baseGeo, standMat);
    base.position.y = 0.005;
    base.castShadow = true;
    monitorAssembly.add(base);

    // Stand Arm
    const poleGeo = new THREE.BoxGeometry(0.06, 0.36, 0.04);
    const pole = new THREE.Mesh(poleGeo, standMat);
    pole.position.set(0, 0.18, -0.06);
    pole.castShadow = true;
    monitorAssembly.add(pole);

    // 34" Curved Bezel (Modeled with 3 faceted angled panels for realistic curve)
    const centerWidth = 0.44;
    const wingWidth = 0.22;
    const panelHeight = 0.36;

    const curveAssembly = new THREE.Group();
    curveAssembly.position.set(0, 0.32, 0);

    // Center Panel
    const centerBezel = new THREE.Mesh(new THREE.BoxGeometry(centerWidth, panelHeight, 0.02), bezelMat);
    centerBezel.castShadow = true;
    centerBezel.userData = { type: 'monitors', id: monitorId };
    curveAssembly.add(centerBezel);
    const centerScreen = new THREE.Mesh(new THREE.PlaneGeometry(centerWidth - 0.01, panelHeight - 0.02), screenMat);
    centerScreen.position.z = 0.011;
    centerScreen.userData = { type: 'monitors', id: monitorId };
    curveAssembly.add(centerScreen);

    // Left Wing (Curved forward)
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(wingWidth, panelHeight, 0.02), bezelMat);
    leftWing.position.set(-centerWidth / 2 - wingWidth / 2 + 0.01, 0, 0.025);
    leftWing.rotation.y = 0.22;
    leftWing.castShadow = true;
    curveAssembly.add(leftWing);

    // Right Wing (Curved forward)
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(wingWidth, panelHeight, 0.02), bezelMat);
    rightWing.position.set(centerWidth / 2 + wingWidth / 2 - 0.01, 0, 0.025);
    rightWing.rotation.y = -0.22;
    rightWing.castShadow = true;
    curveAssembly.add(rightWing);

    monitorAssembly.add(curveAssembly);
    group.add(monitorAssembly);
  }

  // --- MODEL 4: 49" SUPER-ULTRAWIDE (32:9) ---
  else if (monitorId === 'monitor-superwide-49') {
    const monitorAssembly = new THREE.Group();
    monitorAssembly.position.set(0, deskSurfaceY, -0.24);

    // Heavy Duty Wide Stand Base
    const baseGeo = new THREE.BoxGeometry(0.48, 0.015, 0.24);
    const base = new THREE.Mesh(baseGeo, standMat);
    base.position.y = 0.007;
    base.castShadow = true;
    monitorAssembly.add(base);

    const poleGeo = new THREE.BoxGeometry(0.08, 0.38, 0.06);
    const pole = new THREE.Mesh(poleGeo, standMat);
    pole.position.set(0, 0.19, -0.06);
    pole.castShadow = true;
    monitorAssembly.add(pole);

    // Panoramic 49" Curved Cockpit
    const curveAssembly = new THREE.Group();
    curveAssembly.position.set(0, 0.33, 0);

    const centerWidth = 0.54;
    const wingWidth = 0.32;
    const panelHeight = 0.35;

    // Center Panel
    const centerBezel = new THREE.Mesh(new THREE.BoxGeometry(centerWidth, panelHeight, 0.02), bezelMat);
    centerBezel.castShadow = true;
    centerBezel.userData = { type: 'monitors', id: monitorId };
    curveAssembly.add(centerBezel);
    const centerScreen = new THREE.Mesh(new THREE.PlaneGeometry(centerWidth - 0.01, panelHeight - 0.02), screenMat);
    centerScreen.position.z = 0.011;
    centerScreen.userData = { type: 'monitors', id: monitorId };
    curveAssembly.add(centerScreen);

    // Left Wing
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(wingWidth, panelHeight, 0.02), bezelMat);
    leftWing.position.set(-centerWidth / 2 - wingWidth / 2 + 0.02, 0, 0.045);
    leftWing.rotation.y = 0.32;
    leftWing.castShadow = true;
    curveAssembly.add(leftWing);

    // Right Wing
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(wingWidth, panelHeight, 0.02), bezelMat);
    rightWing.position.set(centerWidth / 2 + wingWidth / 2 - 0.02, 0, 0.045);
    rightWing.rotation.y = -0.32;
    rightWing.castShadow = true;
    curveAssembly.add(rightWing);

    monitorAssembly.add(curveAssembly);
    group.add(monitorAssembly);
  }

  // --- SCREENBAR LIGHTBAR CLAMPED ATOP MONITOR ---
  if (lightingId === 'light-screenbar') {
    const lightbarGroup = new THREE.Group();
    lightbarGroup.position.set(0, deskSurfaceY + 0.52, -0.21);

    // Horizontal Bar
    const barGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.44, 16);
    const barMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.8, roughness: 0.3 });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.rotation.z = Math.PI / 2;
    lightbarGroup.add(bar);

    // Clamp bracket
    const clampGeo = new THREE.BoxGeometry(0.04, 0.05, 0.04);
    const clamp = new THREE.Mesh(clampGeo, barMat);
    clamp.position.set(0, -0.02, -0.02);
    lightbarGroup.add(clamp);

    // Emissive glowing light slit
    const slitGeo = new THREE.PlaneGeometry(0.4, 0.008);
    const slitMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const slit = new THREE.Mesh(slitGeo, slitMat);
    slit.rotation.x = Math.PI / 2;
    slit.position.y = -0.012;
    lightbarGroup.add(slit);

    // Actual 3D SpotLight pointing down onto desk
    const spot = new THREE.SpotLight(0xfef08a, 4, 1.5, Math.PI / 4, 0.5, 1);
    spot.position.set(0, -0.015, 0);
    spot.target.position.set(0, deskSurfaceY, 0.05);
    spot.castShadow = true;
    lightbarGroup.add(spot);
    lightbarGroup.add(spot.target);

    group.add(lightbarGroup);
  }

  return group;
}

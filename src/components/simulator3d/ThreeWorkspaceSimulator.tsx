'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { buildDesk3D, DeskMeshGroup } from './deskBuilder';
import { buildChair3D } from './chairBuilder';
import { buildMonitor3D } from './monitorBuilder';
import { buildPeripherals3D } from './peripheralsBuilder';
import { buildPlant3D } from './plantBuilder';
import { buildLifestyle3D } from './lifestyleBuilder';
import { buildRoom3D } from './roomBuilder';
import { PRESETS } from '@/data/presets';
import { 
  Sun, 
  Sunset, 
  Moon, 
  Sparkles, 
  RefreshCw, 
  Maximize2, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Camera,
  Compass
} from 'lucide-react';

export const ThreeWorkspaceSimulator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    deskId,
    chairId,
    monitorId,
    lightingId,
    plantId,
    peripheralsId,
    lifestyleIds,
    backdrop,
    lightingMode,
    activePresetId,
    setBackdrop,
    setLightingMode,
    setActiveTab,
    resetWorkspace,
  } = useWorkspaceStore();

  const [isStanding, setIsStanding] = useState(false);
  const currentPreset = PRESETS.find((p) => p.id === activePresetId);

  // References to live Three.js scene instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const deskGroupRef = useRef<DeskMeshGroup | null>(null);
  const dynamicMountRef = useRef<THREE.Group | null>(null); // Items attached to desk surface
  const targetDeskHeightRef = useRef<number>(0.74);
  const currentDeskHeightRef = useRef<number>(0.74);

  // Camera Target Lerp State
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Height toggle
  const toggleStandingHeight = () => {
    const nextStanding = !isStanding;
    setIsStanding(nextStanding);
    targetDeskHeightRef.current = nextStanding ? 1.06 : 0.74;
  };

  // Camera angle preset handler
  const setCameraPreset = (preset: 'isometric' | 'eye' | 'top' | 'wide') => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;

    switch (preset) {
      case 'isometric':
        targetCamPosRef.current = new THREE.Vector3(1.9, 1.6, 2.3);
        targetLookAtRef.current = new THREE.Vector3(0, 0.75, 0);
        break;
      case 'eye':
        targetCamPosRef.current = new THREE.Vector3(0, 0.95, 1.45);
        targetLookAtRef.current = new THREE.Vector3(0, 0.85, -0.2);
        break;
      case 'top':
        targetCamPosRef.current = new THREE.Vector3(0, 2.5, 0.6);
        targetLookAtRef.current = new THREE.Vector3(0, 0.75, 0);
        break;
      case 'wide':
        targetCamPosRef.current = new THREE.Vector3(2.4, 2.1, 3.2);
        targetLookAtRef.current = new THREE.Vector3(0, 0.7, 0);
        break;
    }
  };

  // 1. Initialize Scene, Camera, Renderer, OrbitControls, and Lights
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- SCENE ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // --- CAMERA ---
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 30);
    camera.position.set(1.9, 1.6, 2.3); // Default Isometric 45°
    cameraRef.current = camera;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Append canvas to container
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- ORBIT CONTROLS ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera clipping through floor
    controls.minDistance = 1.5;
    controls.maxDistance = 6.5;
    controls.target.set(0, 0.75, 0);
    controlsRef.current = controls;

    // --- LIGHTS ---
    // 1. Hemisphere Light (Sky & Floor bounce)
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x78350f, 0.7);
    hemiLight.name = 'HemiLight';
    scene.add(hemiLight);

    // 2. Bali Directional Sunlight
    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.2);
    sunLight.name = 'SunLight';
    sunLight.position.set(2.8, 3.8, 1.8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 12;
    sunLight.shadow.camera.left = -2.5;
    sunLight.shadow.camera.right = 2.5;
    sunLight.shadow.camera.top = 2.5;
    sunLight.shadow.camera.bottom = -2.5;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // 3. Ambient Fill Light
    const fillLight = new THREE.AmbientLight(0xffffff, 0.5);
    fillLight.name = 'FillLight';
    scene.add(fillLight);

    // --- RAYCASTER FOR INTERACTIVE CLICK-TO-SELECT ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Find ancestor with userData
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj) {
          if (obj.userData && obj.userData.type) {
            setActiveTab(obj.userData.type);
            break;
          }
          obj = obj.parent;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // --- RESIZE LISTENER ---
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // --- ANIMATION RENDER LOOP ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth desk height lerp
      const targetHeight = targetDeskHeightRef.current;
      const currentHeight = currentDeskHeightRef.current;
      if (Math.abs(targetHeight - currentHeight) > 0.002) {
        const nextHeight = currentHeight + (targetHeight - currentHeight) * 0.08;
        currentDeskHeightRef.current = nextHeight;
        if (deskGroupRef.current && deskGroupRef.current.updateHeight) {
          deskGroupRef.current.updateHeight(nextHeight);
        }
        if (dynamicMountRef.current) {
          dynamicMountRef.current.position.y = nextHeight - 0.74;
        }
      }

      // Smooth camera position lerp
      if (targetCamPosRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.08);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.02) {
          targetCamPosRef.current = null;
        }
      }

      // Smooth camera lookAt / target lerp
      if (targetLookAtRef.current) {
        controls.target.lerp(targetLookAtRef.current, 0.08);
        if (controls.target.distanceTo(targetLookAtRef.current) < 0.02) {
          targetLookAtRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  // 2. Reactively Rebuild & Update 3D Meshes When Selections Change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing furniture & room meshes
    const objectsToRemove = scene.children.filter(
      (child) =>
        child.name === 'RoomRoot' ||
        child.name === 'DeskRoot' ||
        child.name === 'ChairRoot' ||
        child.name === 'DynamicDeskMount' ||
        child.name === 'PlantRoot' ||
        child.name === 'LifestyleRoot'
    );
    objectsToRemove.forEach((obj) => scene.remove(obj));

    // A. Room Environment (Floor & Villa Wall View)
    const roomMesh = buildRoom3D(backdrop, lightingMode);
    scene.add(roomMesh);

    // B. Desk Model
    const currentHeight = currentDeskHeightRef.current;
    const deskMesh = buildDesk3D(deskId, currentHeight);
    deskGroupRef.current = deskMesh;
    scene.add(deskMesh);

    // C. Chair Model (Stands firmly on the floor)
    const chairMesh = buildChair3D(chairId);
    scene.add(chairMesh);

    // D. Dynamic Desk Mount Assembly (Monitors, Peripherals, and Desktop Items)
    // Moves up and down with motorized standing desk height!
    const dynamicMount = new THREE.Group();
    dynamicMount.name = 'DynamicDeskMount';
    dynamicMount.position.y = currentHeight - 0.74;
    dynamicMountRef.current = dynamicMount;

    // Desktop items sit at Y = 0.775 (height + thickness)
    const deskSurfaceY = 0.775;

    // Monitors
    const monitorMesh = buildMonitor3D(monitorId, deskSurfaceY, lightingId);
    dynamicMount.add(monitorMesh);

    // Peripherals (Keyboard, mouse, desk mat, task lamp)
    const peripheralsMesh = buildPeripherals3D(peripheralsId, deskSurfaceY, lightingId);
    dynamicMount.add(peripheralsMesh);

    // Desktop / Lifestyle Items (Coffee machine, scooter gear on desk)
    const lifestyleMesh = buildLifestyle3D(lifestyleIds, deskSurfaceY);
    dynamicMount.add(lifestyleMesh);

    scene.add(dynamicMount);

    // E. Plants (Floor monstera, tree, or desktop succulents)
    const plantMesh = buildPlant3D(plantId, deskSurfaceY);
    scene.add(plantMesh);

    // F. Update Light Intensities Based on Day / Sunset / Night mode
    const sunLight = scene.getObjectByName('SunLight') as THREE.DirectionalLight;
    const hemiLight = scene.getObjectByName('HemiLight') as THREE.HemisphereLight;

    if (sunLight && hemiLight) {
      if (lightingMode === 'sunset') {
        sunLight.color.setHex(0xf97316);
        sunLight.intensity = 1.8;
        sunLight.position.set(3.5, 2.0, 1.2);
        hemiLight.color.setHex(0xfdba74);
        hemiLight.groundColor.setHex(0x7c2d12);
        hemiLight.intensity = 0.55;
      } else if (lightingMode === 'night') {
        sunLight.color.setHex(0x60a5fa);
        sunLight.intensity = 0.4;
        sunLight.position.set(-2.0, 3.5, -1.0);
        hemiLight.color.setHex(0x1e1b4b);
        hemiLight.groundColor.setHex(0x0f172a);
        hemiLight.intensity = 0.3;
      } else {
        // Day mode
        sunLight.color.setHex(0xfef08a);
        sunLight.intensity = 2.4;
        sunLight.position.set(2.8, 3.8, 1.8);
        hemiLight.color.setHex(0xfffbeb);
        hemiLight.groundColor.setHex(0x78350f);
        hemiLight.intensity = 0.7;
      }
    }
  }, [
    deskId,
    chairId,
    monitorId,
    lightingId,
    plantId,
    peripheralsId,
    lifestyleIds,
    backdrop,
    lightingMode,
  ]);

  return (
    <div className="relative w-full h-[540px] sm:h-[640px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* --- TOP TOOLBAR (ATMOSPHERE & PRESET INDICATOR) --- */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Active Preset or Monis Badge */}
        <div className="flex items-center gap-2">
          {currentPreset ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-emerald-500/60 text-xs font-semibold text-emerald-300 shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preset: <strong>{currentPreset.name}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-xs font-semibold text-slate-300 shadow-xl">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              <span>3D Workspace Simulator • 360° Orbit</span>
            </div>
          )}
        </div>

        {/* Right: Environment, Lighting, and Reset */}
        <div className="flex items-center gap-2">
          {/* Villa Backdrop Selector */}
          <div className="flex items-center bg-slate-900/85 backdrop-blur-md rounded-full border border-slate-700/70 p-1 shadow-xl text-xs">
            <button
              onClick={() => setBackdrop('villa-pool')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                backdrop === 'villa-pool'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pool
            </button>
            <button
              onClick={() => setBackdrop('rice-terrace')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                backdrop === 'rice-terrace'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ubud Terrace
            </button>
            <button
              onClick={() => setBackdrop('minimal-studio')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                backdrop === 'minimal-studio'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Loft
            </button>
          </div>

          {/* Time of Day Lighting Mode */}
          <div className="flex items-center bg-slate-900/85 backdrop-blur-md rounded-full border border-slate-700/70 p-1 shadow-xl">
            <button
              onClick={() => setLightingMode('day')}
              title="Day Sunlight"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'day' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('sunset')}
              title="Sunset Golden Hour"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'sunset' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('night')}
              title="Night Focus Mode"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'night' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={resetWorkspace}
            title="Reset Workspace"
            className="p-2 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-slate-400 hover:text-white transition-all cursor-pointer shadow-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* --- BOTTOM FLOATING CONTROLS (CAMERA PRESETS & MOTORIZED DESK ELEVATION) --- */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Quick Camera Angles */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/70 shadow-xl">
          <div className="flex items-center gap-1 px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Camera:</span>
          </div>
          <button
            onClick={() => setCameraPreset('isometric')}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            📐 45° Studio
          </button>
          <button
            onClick={() => setCameraPreset('eye')}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            👁️ Front View
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            🖥️ Top Desk
          </button>
          <button
            onClick={() => setCameraPreset('wide')}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer hidden sm:inline-block"
          >
            🏄 Full Room
          </button>
        </div>

        {/* Right: Motorized Standing Desk Elevation Simulator */}
        {deskId === 'desk-standing-teak' && (
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-emerald-500/50 shadow-xl">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                MOTORIZED ELEVATION
              </span>
              <span className="text-xs font-bold text-white">
                {isStanding ? '106 cm (Standing)' : '74 cm (Sitting)'}
              </span>
            </div>
            <button
              onClick={toggleStandingHeight}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/20"
            >
              {isStanding ? (
                <>
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>Lower Desk</span>
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Raise to Stand</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* --- INSTRUCTION OVERLAY HINT (Fade out on interaction) --- */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-xs text-[11px] text-slate-300 border border-white/10">
        <span>🖱️ Drag to rotate 3D • Scroll to zoom • Click furniture to customize</span>
      </div>
    </div>
  );
};

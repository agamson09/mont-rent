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
import { PRODUCTS } from '@/data/products';
import { PRESETS } from '@/data/presets';
import { CategoryId } from '@/types/workspace';
import { 
  Sun, 
  Sunset, 
  Moon, 
  Sparkles, 
  RefreshCw, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Palmtree,
  Armchair,
  Layout,
  Monitor,
  Lamp,
  Flower2,
  Keyboard
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
    currency,
    durationType,
    setDesk,
    setChair,
    setMonitor,
    setLighting,
    setPlant,
    setPeripherals,
    toggleLifestyle,
    setBackdrop,
    setLightingMode,
    setActiveTab,
    resetWorkspace,
  } = useWorkspaceStore();

  const [isStanding, setIsStanding] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<CategoryId>('chairs');
  const [isQuickPanelOpen, setIsQuickPanelOpen] = useState(true);

  const currentPreset = PRESETS.find((p) => p.id === activePresetId);

  // References to live Three.js scene instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const deskGroupRef = useRef<DeskMeshGroup | null>(null);
  const dynamicMountRef = useRef<THREE.Group | null>(null);
  const targetDeskHeightRef = useRef<number>(0.74);
  const currentDeskHeightRef = useRef<number>(0.74);

  // Camera Target Lerp State
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Standing Desk Elevation toggle
  const toggleStandingHeight = () => {
    const nextStanding = !isStanding;
    setIsStanding(nextStanding);
    targetDeskHeightRef.current = nextStanding ? 1.06 : 0.74;
  };

  // Camera angle preset handler
  const setCameraPreset = (preset: 'isometric' | 'eye' | 'top' | 'wide') => {
    if (!controlsRef.current || !cameraRef.current) return;
    switch (preset) {
      case 'isometric':
        targetCamPosRef.current = new THREE.Vector3(1.8, 1.5, 2.2);
        targetLookAtRef.current = new THREE.Vector3(0, 0.75, 0);
        break;
      case 'eye':
        targetCamPosRef.current = new THREE.Vector3(0, 0.95, 1.4);
        targetLookAtRef.current = new THREE.Vector3(0, 0.85, -0.2);
        break;
      case 'top':
        targetCamPosRef.current = new THREE.Vector3(0, 2.4, 0.6);
        targetLookAtRef.current = new THREE.Vector3(0, 0.75, 0);
        break;
      case 'wide':
        targetCamPosRef.current = new THREE.Vector3(2.3, 1.9, 3.1);
        targetLookAtRef.current = new THREE.Vector3(0, 0.7, 0);
        break;
    }
  };

  // --- CAROUSEL NAVIGATION: PREVIOUS & NEXT ITEM DIRECTLY IN 3D ---
  const currentCategoryProducts = PRODUCTS.filter((p) => p.category === selectedSlot);

  const getActiveItemId = () => {
    switch (selectedSlot) {
      case 'desks': return deskId;
      case 'chairs': return chairId;
      case 'monitors': return monitorId;
      case 'lighting': return lightingId;
      case 'plants': return plantId;
      case 'peripherals': return peripheralsId;
      case 'lifestyle': return lifestyleIds[0] || null;
      default: return null;
    }
  };

  const handleCycleItem = (direction: 'prev' | 'next') => {
    if (currentCategoryProducts.length === 0) return;
    const currentId = getActiveItemId();
    const currentIndex = currentCategoryProducts.findIndex((p) => p.id === currentId);

    let nextIndex = 0;
    if (direction === 'prev') {
      nextIndex = currentIndex <= 0 ? currentCategoryProducts.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex >= currentCategoryProducts.length - 1 ? 0 : currentIndex + 1;
    }

    const nextItem = currentCategoryProducts[nextIndex];
    if (!nextItem) return;

    switch (selectedSlot) {
      case 'desks': setDesk(nextItem.id); break;
      case 'chairs': setChair(nextItem.id); break;
      case 'monitors': setMonitor(nextItem.id); break;
      case 'lighting': setLighting(nextItem.id); break;
      case 'plants': setPlant(nextItem.id); break;
      case 'peripherals': setPeripherals(nextItem.id); break;
      case 'lifestyle': toggleLifestyle(nextItem.id); break;
    }
  };

  const handleSelectItem = (itemId: string) => {
    switch (selectedSlot) {
      case 'desks': setDesk(itemId); break;
      case 'chairs': setChair(itemId); break;
      case 'monitors': setMonitor(itemId); break;
      case 'lighting': setLighting(itemId); break;
      case 'plants': setPlant(itemId); break;
      case 'peripherals': setPeripherals(itemId); break;
      case 'lifestyle': toggleLifestyle(itemId); break;
    }
  };

  const isCurrentEquipped = (itemId: string) => {
    switch (selectedSlot) {
      case 'desks': return deskId === itemId;
      case 'chairs': return chairId === itemId;
      case 'monitors': return monitorId === itemId;
      case 'lighting': return lightingId === itemId;
      case 'plants': return plantId === itemId;
      case 'peripherals': return peripheralsId === itemId;
      case 'lifestyle': return lifestyleIds.includes(itemId);
      default: return false;
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
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 30);
    camera.position.set(1.8, 1.5, 2.2); // Default Isometric 45°
    cameraRef.current = camera;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- ORBIT CONTROLS ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera clipping through floor
    controls.minDistance = 1.4;
    controls.maxDistance = 5.5;
    controls.target.set(0, 0.75, 0);
    controlsRef.current = controls;

    // --- LIGHTS ---
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x78350f, 0.85);
    hemiLight.name = 'HemiLight';
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.4);
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

    const fillLight = new THREE.AmbientLight(0xffffff, 0.55);
    fillLight.name = 'FillLight';
    scene.add(fillLight);

    // --- RAYCASTER FOR 3D CLICK SELECTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj) {
          if (obj.userData && obj.userData.type) {
            const type = obj.userData.type as CategoryId;
            setSelectedSlot(type);
            setActiveTab(type);
            setIsQuickPanelOpen(true);
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

      // Smooth camera lookAt lerp
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

  // 2. Reactively Rebuild 3D Meshes when items or atmosphere change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const objectsToRemove = scene.children.filter(
      (child) =>
        child.name === 'RoomRoot' ||
        child.name === 'DeskRoot' ||
        child.name === 'ChairRoot' ||
        child.name === 'DynamicDeskMount' ||
        child.name === 'PlantRoot'
    );
    objectsToRemove.forEach((obj) => scene.remove(obj));

    // A. Room Environment (Now with true window opening & high-res scenery!)
    const roomMesh = buildRoom3D(backdrop, lightingMode);
    scene.add(roomMesh);

    // B. Desk Model
    const currentHeight = currentDeskHeightRef.current;
    const deskMesh = buildDesk3D(deskId, currentHeight);
    deskGroupRef.current = deskMesh;
    scene.add(deskMesh);

    // C. Chair Model (Facing the desk and monitors!)
    const chairMesh = buildChair3D(chairId);
    scene.add(chairMesh);

    // D. Dynamic Desk Mount Assembly (Monitors, Peripherals, and Lifestyle on desk)
    const dynamicMount = new THREE.Group();
    dynamicMount.name = 'DynamicDeskMount';
    dynamicMount.position.y = currentHeight - 0.74;
    dynamicMountRef.current = dynamicMount;

    const deskSurfaceY = 0.775;

    // Monitors
    const monitorMesh = buildMonitor3D(monitorId, deskSurfaceY, lightingId);
    dynamicMount.add(monitorMesh);

    // Peripherals
    const peripheralsMesh = buildPeripherals3D(peripheralsId, deskSurfaceY, lightingId);
    dynamicMount.add(peripheralsMesh);

    // Desktop & Lifestyle Items (Coffee machine on desk, Surfboard propped against wall, Bean bag)
    const lifestyleMesh = buildLifestyle3D(lifestyleIds, deskSurfaceY);
    dynamicMount.add(lifestyleMesh);

    scene.add(dynamicMount);

    // E. Plants (Floor Monstera, tree, or succulents)
    const plantMesh = buildPlant3D(plantId, deskSurfaceY);
    scene.add(plantMesh);

    // F. Atmosphere Lighting Adjustments
    const sunLight = scene.getObjectByName('SunLight') as THREE.DirectionalLight;
    const hemiLight = scene.getObjectByName('HemiLight') as THREE.HemisphereLight;

    if (sunLight && hemiLight) {
      if (lightingMode === 'sunset') {
        sunLight.color.setHex(0xf97316);
        sunLight.intensity = 2.0;
        sunLight.position.set(3.5, 2.0, 1.2);
        hemiLight.color.setHex(0xfdba74);
        hemiLight.groundColor.setHex(0x7c2d12);
        hemiLight.intensity = 0.65;
      } else if (lightingMode === 'night') {
        sunLight.color.setHex(0x60a5fa);
        sunLight.intensity = 0.45;
        sunLight.position.set(-2.0, 3.5, -1.0);
        hemiLight.color.setHex(0x1e1b4b);
        hemiLight.groundColor.setHex(0x0f172a);
        hemiLight.intensity = 0.35;
      } else {
        sunLight.color.setHex(0xfef08a);
        sunLight.intensity = 2.5;
        sunLight.position.set(2.8, 3.8, 1.8);
        hemiLight.color.setHex(0xfffbeb);
        hemiLight.groundColor.setHex(0x78350f);
        hemiLight.intensity = 0.85;
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

  const activeItemObj = PRODUCTS.find((p) => p.id === getActiveItemId());

  return (
    <div className="relative w-full h-[580px] sm:h-[660px] lg:h-[720px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0A0E17] select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* --- TOP PERSISTENT TOOLBAR: BALI SCENERY & LIGHTING TOGGLES --- */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Active Preset Badge or Status */}
        <div className="flex items-center gap-2">
          {currentPreset ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-500/70 text-xs font-bold text-emerald-300 shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preset: <strong>{currentPreset.name}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-xl">
              <Palmtree className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bali Villa Studio • 360° View</span>
            </div>
          )}
        </div>

        {/* Right: Villa Scenery & Time of Day Controls */}
        <div className="flex items-center gap-2">
          {/* Villa View Backdrop Selector */}
          <div className="flex items-center bg-slate-950/90 backdrop-blur-md rounded-full border border-slate-700/80 p-1 shadow-xl text-xs">
            <button
              onClick={() => setBackdrop('villa-pool')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                backdrop === 'villa-pool'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Villa Pool 🏊‍♂️
            </button>
            <button
              onClick={() => setBackdrop('rice-terrace')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                backdrop === 'rice-terrace'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ubud Rice Terrace 🌾
            </button>
            <button
              onClick={() => setBackdrop('minimal-studio')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                backdrop === 'minimal-studio'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Canggu Loft 🏙️
            </button>
          </div>

          {/* Time of Day Lighting Mode */}
          <div className="flex items-center bg-slate-950/90 backdrop-blur-md rounded-full border border-slate-700/80 p-1 shadow-xl">
            <button
              onClick={() => setLightingMode('day')}
              title="Bright Day Sunlight"
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

          {/* Reset Workspace */}
          <button
            onClick={resetWorkspace}
            title="Reset Workspace"
            className="p-2 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-slate-400 hover:text-white transition-all cursor-pointer shadow-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* --- FLOATING 3D QUICK-CUSTOMIZER (WITH ◀ AND ▶ ARROWS!) --- */}
      {isQuickPanelOpen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-25 w-[94%] max-w-xl pointer-events-auto animate-in fade-in zoom-in-95">
          <div className="bg-slate-950/92 backdrop-blur-xl rounded-2xl border border-emerald-500/40 p-3 shadow-2xl">
            {/* Category Slot Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {[
                  { id: 'chairs', label: 'Chairs', icon: <Armchair className="w-3 h-3" /> },
                  { id: 'desks', label: 'Desks', icon: <Layout className="w-3 h-3" /> },
                  { id: 'monitors', label: 'Displays', icon: <Monitor className="w-3 h-3" /> },
                  { id: 'lighting', label: 'Lighting', icon: <Lamp className="w-3 h-3" /> },
                  { id: 'plants', label: 'Flora', icon: <Flower2 className="w-3 h-3" /> },
                  { id: 'lifestyle', label: 'Lifestyle', icon: <Palmtree className="w-3 h-3" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedSlot(tab.id as CategoryId);
                      setActiveTab(tab.id as CategoryId);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedSlot === tab.id
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsQuickPanelOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer ml-2"
                title="Hide 3D quick selector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Carousel with ◀ / ▶ Arrows */}
            <div className="mt-2.5 flex items-center justify-between gap-3">
              {/* Previous Arrow */}
              <button
                onClick={() => handleCycleItem('prev')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-800 transition-all cursor-pointer shadow-md shrink-0"
                title="Previous 3D model"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Active Item Title & Quick Info */}
              <div className="flex-1 text-center min-w-0">
                <div className="text-xs font-black text-white truncate flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activeItemObj?.name || 'Select an item'}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                  {activeItemObj?.tagline || ''} •{' '}
                  <strong className="text-emerald-400">
                    {currency === 'USD'
                      ? `$${durationType === 'weekly' ? activeItemObj?.priceWeeklyUSD : activeItemObj?.priceMonthlyUSD}`
                      : `Rp ${(durationType === 'weekly' ? activeItemObj?.priceWeeklyIDR : activeItemObj?.priceMonthlyIDR)?.toLocaleString('id-ID')}`}
                    /{durationType === 'weekly' ? 'wk' : 'mo'}
                  </strong>
                </div>
              </div>

              {/* Next Arrow */}
              <button
                onClick={() => handleCycleItem('next')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-800 transition-all cursor-pointer shadow-md shrink-0"
                title="Next 3D model"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Chips for direct 1-click model swap */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-none">
              {currentCategoryProducts.map((p) => {
                const equipped = isCurrentEquipped(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectItem(p.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      equipped
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {equipped && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                    <span>{p.slotName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Button to reopen quick panel if closed */}
      {!isQuickPanelOpen && (
        <button
          onClick={() => setIsQuickPanelOpen(true)}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/50 text-xs font-bold text-emerald-300 shadow-xl cursor-pointer hover:bg-slate-900"
        >
          ⚡ Open 3D Item Switcher
        </button>
      )}

      {/* --- BOTTOM FLOATING BAR: CAMERA ANGLES & MOTORIZED DESK ELEVATION --- */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Quick Camera Presets */}
        <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-xl">
          <div className="flex items-center gap-1 px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Camera:</span>
          </div>
          <button
            onClick={() => setCameraPreset('isometric')}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            📐 45° Studio
          </button>
          <button
            onClick={() => setCameraPreset('eye')}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            👁️ Front View
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            🖥️ Top Desk
          </button>
          <button
            onClick={() => setCameraPreset('wide')}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer hidden sm:inline-block"
          >
            🏄 Full Room
          </button>
        </div>

        {/* Right: Motorized Standing Desk Elevation Simulator */}
        {deskId === 'desk-standing-teak' && (
          <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-emerald-500/50 shadow-xl">
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
    </div>
  );
};

'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Engine,
  Scene,
  Vector3,
  Color3,
  Color4,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  GlowLayer,
  TransformNode,
} from '@babylonjs/core';
import { useWorkspaceStore } from '@/store/workspaceStore';
import {
  buildBabylonRoom,
  buildBabylonDesk,
  buildBabylonChair,
  buildBabylonMonitors,
  buildBabylonLighting,
  buildBabylonAccessories,
} from './babylonSceneBuilder';
import { PRODUCTS } from '@/data/products';
import { PRESETS } from '@/data/presets';
import { CategoryId } from '@/types/workspace';
import {
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ArrowUpCircle,
  ArrowDownCircle,
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
  Keyboard,
  Sliders,
  Eye,
} from 'lucide-react';

type ConfigurableSlot = CategoryId | 'backdrops';

const BACKDROPS = [
  { id: 'villa-pool', name: 'Canggu Villa Pool', subtitle: 'Mount Agung & Infinity Pool' },
  { id: 'rice-terrace', name: 'Ubud Rice Terrace', subtitle: 'Cascading Tegallalang Palms' },
  { id: 'minimal-studio', name: 'Canggu Sunset Loft', subtitle: 'Indian Ocean Golden Hour' },
] as const;

export const BabylonWorkspaceSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  } = useWorkspaceStore();

  const [isStanding, setIsStanding] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ConfigurableSlot>('chairs');
  const [isQuickPanelOpen, setIsQuickPanelOpen] = useState(true);

  // Babylon Engine & Scene refs
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const shadowGenRef = useRef<ShadowGenerator | null>(null);
  const glowLayerRef = useRef<GlowLayer | null>(null);

  // Mesh Hierarchy refs
  const roomNodeRef = useRef<TransformNode | null>(null);
  const deskResultRef = useRef<{ deskNode: TransformNode; topAssembly: TransformNode } | null>(null);
  const chairNodeRef = useRef<TransformNode | null>(null);
  const monNodeRef = useRef<TransformNode | null>(null);
  const lightingNodeRef = useRef<TransformNode | null>(null);
  const deskAccNodeRef = useRef<TransformNode | null>(null);
  const floorAccNodeRef = useRef<TransformNode | null>(null);

  // Smooth Height Lerp
  const targetDeskHeightRef = useRef<number>(0.74);
  const currentDeskHeightRef = useRef<number>(0.74);

  // Camera Target Lerp
  const targetCameraPosRef = useRef<Vector3 | null>(null);
  const targetCameraTargetRef = useRef<Vector3 | null>(null);

  // Toggle Motorized Standing Desk (74cm ⇄ 106cm)
  const toggleStandingHeight = () => {
    const nextStanding = !isStanding;
    setIsStanding(nextStanding);
    targetDeskHeightRef.current = nextStanding ? 1.06 : 0.74;
  };

  // Camera Presets
  const setCameraPreset = (preset: 'isometric' | 'eye' | 'top' | 'wide') => {
    switch (preset) {
      case 'isometric':
        targetCameraPosRef.current = new Vector3(2.35, 1.62, 2.75);
        targetCameraTargetRef.current = new Vector3(0, 0.74, -0.1);
        break;
      case 'eye':
        targetCameraPosRef.current = new Vector3(0.12, 0.98, 1.45);
        targetCameraTargetRef.current = new Vector3(0, 0.88, -0.2);
        break;
      case 'top':
        targetCameraPosRef.current = new Vector3(0.01, 3.4, 0.45);
        targetCameraTargetRef.current = new Vector3(0, 0.74, -0.05);
        break;
      case 'wide':
        targetCameraPosRef.current = new Vector3(2.6, 1.85, 3.2);
        targetCameraTargetRef.current = new Vector3(0, 0.74, -0.1);
        break;
    }
  };

  // --- CAROUSEL NAVIGATION: CYCLE PREVIOUS & NEXT ITEM ---
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
      case 'backdrops': return backdrop;
      default: return null;
    }
  };

  const handleCycleItem = (direction: 'prev' | 'next') => {
    if (selectedSlot === 'backdrops') {
      const currentIndex = BACKDROPS.findIndex((b) => b.id === backdrop);
      let nextIndex = 0;
      if (direction === 'prev') {
        nextIndex = currentIndex <= 0 ? BACKDROPS.length - 1 : currentIndex - 1;
      } else {
        nextIndex = currentIndex >= BACKDROPS.length - 1 ? 0 : currentIndex + 1;
      }
      setBackdrop(BACKDROPS[nextIndex].id);
      return;
    }

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
    if (selectedSlot === 'backdrops') {
      setBackdrop(itemId as 'villa-pool' | 'rice-terrace' | 'minimal-studio');
      return;
    }
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
    if (selectedSlot === 'backdrops') return backdrop === itemId;
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

  // 1. Initialize Babylon Engine, Scene, Camera, Lights, and Build Initial Workspace
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create Babylon Engine with antialiasing and high performance WebGL
    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      powerPreference: 'high-performance',
    });
    engineRef.current = engine;

    // Create Scene
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.04, 0.06, 0.09, 1.0); // Rich deep obsidian
    sceneRef.current = scene;

    // ArcRotate Camera: positioned in +X, +Z quadrant, perfectly framing the whole setup
    const camera = new ArcRotateCamera(
      'MainCamera',
      Math.PI / 2.6, // ~69° horizontal: slightly right of center
      Math.PI / 2.7, // ~66° vertical: elevated overview
      3.8,           // radius: frames hardwood floor, full desk, chair, monitors, and window
      new Vector3(0, 0.74, -0.1),
      scene
    );
    camera.setPosition(new Vector3(2.35, 1.62, 2.75));
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 1.4;
    camera.upperRadiusLimit = 5.2;
    camera.lowerBetaLimit = 0.2;
    camera.upperBetaLimit = Math.PI / 2 - 0.05; // Prevent floor clipping
    camera.lowerAlphaLimit = 0.15; // Prevent camera from orbiting behind rear wall
    camera.upperAlphaLimit = Math.PI - 0.15;
    camera.wheelPrecision = 40;
    camera.pinchPrecision = 40;
    camera.inertia = 0.85;
    cameraRef.current = camera;

    // Ambient Hemispheric Light (Warm Balinese skylight)
    const hemiLight = new HemisphericLight('HemiLight', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.75;
    hemiLight.groundColor = new Color3(0.18, 0.14, 0.1);
    hemiLight.diffuse = new Color3(1.0, 0.98, 0.92);

    // Directional Sunlight pouring in from the window
    const sunLight = new DirectionalLight('SunLight', new Vector3(0.6, -1.8, 1.2), scene);
    sunLight.position = new Vector3(-1.2, 3.6, -1.8);
    sunLight.intensity = 2.2;
    sunLight.diffuse = new Color3(1.0, 0.95, 0.86);

    // High Precision Soft Shadow Generator
    const shadowGen = new ShadowGenerator(2048, sunLight);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 32;
    shadowGen.darkness = 0.35;
    shadowGenRef.current = shadowGen;

    // Native GlowLayer for Photorealistic Neon Strip & Screen Bloom
    const glowLayer = new GlowLayer('GlowLayer', scene, {
      mainTextureRatio: 0.5,
      blurKernelSize: 32,
    });
    glowLayer.intensity = 0.85;
    glowLayerRef.current = glowLayer;

    // BUILD INITIAL WORKSPACE SCENE DIRECTLY ON MOUNT
    roomNodeRef.current = buildBabylonRoom(scene, backdrop, lightingMode);
    deskResultRef.current = buildBabylonDesk(scene, deskId, 0.74, shadowGen);
    chairNodeRef.current = buildBabylonChair(scene, chairId, shadowGen);
    monNodeRef.current = buildBabylonMonitors(scene, monitorId, 0.775, shadowGen);
    lightingNodeRef.current = buildBabylonLighting(scene, lightingId, 0.775, shadowGen);
    
    const accResult = buildBabylonAccessories(scene, peripheralsId, plantId, lifestyleIds, 0.775, shadowGen);
    deskAccNodeRef.current = accResult.deskAccNode;
    floorAccNodeRef.current = accResult.floorAccNode;

    // --- RAYCASTING FOR 3D OBJECT CLICK SELECTION ---
    scene.onPointerDown = (evt, pickResult) => {
      if (pickResult.hit && pickResult.pickedMesh) {
        let current: any = pickResult.pickedMesh;
        let detectedSlot: ConfigurableSlot | null = null;

        while (current) {
          if (current.metadata?.type) {
            detectedSlot = current.metadata.type as ConfigurableSlot;
            break;
          }
          const name = current.name || '';
          if (name.includes('Desk') || name.includes('Leg') || name.includes('Top') || name.includes('Trim')) detectedSlot = 'desks';
          else if (name.includes('Chair') || name.includes('Seat') || name.includes('Back') || name.includes('Caster') || name.includes('Wheel') || name.includes('Armrest')) detectedSlot = 'chairs';
          else if (name.includes('Monitor') || name.includes('Screen') || name.includes('Bezel') || name.includes('Arm') || name.includes('UW') || name.includes('SW')) detectedSlot = 'monitors';
          else if (name.includes('Light') || name.includes('Bar') || name.includes('Brass') || name.includes('LED') || name.includes('Bulb') || name.includes('Shade')) detectedSlot = 'lighting';
          else if (name.includes('Keyboard') || name.includes('Mouse') || name.includes('Mat')) detectedSlot = 'peripherals';
          else if (name.includes('Coffee') || name.includes('Cup') || name.includes('Espresso') || name.includes('Surfboard') || name.includes('Beanbag')) detectedSlot = 'lifestyle';
          else if (name.includes('Pot') || name.includes('Leaf') || name.includes('Plant')) detectedSlot = 'plants';
          else if (name.includes('Scenery') || name.includes('Frame') || name.includes('Sill') || name.includes('Mullion') || name.includes('Post')) detectedSlot = 'backdrops';

          if (detectedSlot) break;
          current = current.parent;
        }

        if (detectedSlot) {
          setSelectedSlot(detectedSlot);
          if (detectedSlot !== 'backdrops') {
            setActiveTab(detectedSlot);
          }
          setIsQuickPanelOpen(true);
        }
      }
    };

    // --- RENDER LOOP WITH ELEVATION & CAMERA LERP ---
    engine.runRenderLoop(() => {
      // 1. Smooth Motorized Desk Height Elevation Lerp
      const targetHeight = targetDeskHeightRef.current;
      const currentHeight = currentDeskHeightRef.current;
      const diffH = targetHeight - currentHeight;

      if (Math.abs(diffH) > 0.001) {
        currentDeskHeightRef.current += diffH * 0.08;
        const curY = currentDeskHeightRef.current;

        // Desktop assembly smoothly moves to curY
        if (deskResultRef.current?.topAssembly) {
          deskResultRef.current.topAssembly.position.y = curY;
        }
        // Monitors rest on top of desktop slab (+0.035m slab thickness)
        if (monNodeRef.current) {
          monNodeRef.current.position.y = curY + 0.035;
        }
        // Task lighting moves with desktop
        if (lightingNodeRef.current) {
          lightingNodeRef.current.position.y = curY + 0.035;
        }
        // Desk peripherals (keyboard, mouse, espresso machine) move with desktop
        if (deskAccNodeRef.current) {
          deskAccNodeRef.current.position.y = curY + 0.035;
        }
        // NOTE: floorAccNode (plant pot, surfboard, beanbag) & chairNode stay on the floor!
      }

      // 2. Smooth Camera Target Lerp
      if (targetCameraPosRef.current && camera) {
        camera.position = Vector3.Lerp(camera.position, targetCameraPosRef.current, 0.08);
        if (targetCameraTargetRef.current) {
          camera.setTarget(Vector3.Lerp(camera.target, targetCameraTargetRef.current, 0.08));
        }

        if (Vector3.Distance(camera.position, targetCameraPosRef.current) < 0.02) {
          targetCameraPosRef.current = null;
          targetCameraTargetRef.current = null;
        }
      }

      scene.render();
    });

    // Handle Window Resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Rebuild Room & Backdrop when backdrop or lightingMode changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (roomNodeRef.current) {
      roomNodeRef.current.dispose();
    }

    roomNodeRef.current = buildBabylonRoom(scene, backdrop, lightingMode);
  }, [backdrop, lightingMode]);

  // 3. Rebuild Desk
  useEffect(() => {
    const scene = sceneRef.current;
    const shadowGen = shadowGenRef.current;
    if (!scene || !shadowGen) return;

    if (deskResultRef.current?.deskNode) {
      deskResultRef.current.deskNode.dispose();
    }

    const curY = currentDeskHeightRef.current;
    const deskRes = buildBabylonDesk(scene, deskId, curY, shadowGen);
    deskResultRef.current = deskRes;
  }, [deskId]);

  // 4. Rebuild Chair
  useEffect(() => {
    const scene = sceneRef.current;
    const shadowGen = shadowGenRef.current;
    if (!scene || !shadowGen) return;

    if (chairNodeRef.current) {
      chairNodeRef.current.dispose();
    }

    chairNodeRef.current = buildBabylonChair(scene, chairId, shadowGen);
  }, [chairId]);

  // 5. Rebuild Monitors
  useEffect(() => {
    const scene = sceneRef.current;
    const shadowGen = shadowGenRef.current;
    if (!scene || !shadowGen) return;

    if (monNodeRef.current) {
      monNodeRef.current.dispose();
    }

    const curY = currentDeskHeightRef.current;
    const monNode = buildBabylonMonitors(scene, monitorId, curY + 0.035, shadowGen);
    monNodeRef.current = monNode;
  }, [monitorId]);

  // 6. Rebuild Lighting
  useEffect(() => {
    const scene = sceneRef.current;
    const shadowGen = shadowGenRef.current;
    if (!scene || !shadowGen) return;

    if (lightingNodeRef.current) {
      lightingNodeRef.current.dispose();
    }

    const curY = currentDeskHeightRef.current;
    const lightNode = buildBabylonLighting(scene, lightingId, curY + 0.035, shadowGen);
    lightingNodeRef.current = lightNode;
  }, [lightingId]);

  // 7. Rebuild Accessories
  useEffect(() => {
    const scene = sceneRef.current;
    const shadowGen = shadowGenRef.current;
    if (!scene || !shadowGen) return;

    if (deskAccNodeRef.current) {
      deskAccNodeRef.current.dispose();
    }
    if (floorAccNodeRef.current) {
      floorAccNodeRef.current.dispose();
    }

    const curY = currentDeskHeightRef.current;
    const accResult = buildBabylonAccessories(scene, peripheralsId, plantId, lifestyleIds, curY + 0.035, shadowGen);
    deskAccNodeRef.current = accResult.deskAccNode;
    floorAccNodeRef.current = accResult.floorAccNode;
  }, [peripheralsId, plantId, lifestyleIds]);

  // Selected item data
  const currentActiveId = getActiveItemId();
  const currentActiveProduct = PRODUCTS.find((p) => p.id === currentActiveId);
  const currentActiveBackdrop = BACKDROPS.find((b) => b.id === backdrop);

  const getSlotName = () => {
    switch (selectedSlot) {
      case 'desks': return 'Standing Desk Top';
      case 'chairs': return 'Ergonomic Chair';
      case 'monitors': return 'Displays & Arms';
      case 'lighting': return 'Workspace Lighting';
      case 'plants': return 'Botanical Greenery';
      case 'peripherals': return 'Mechanical Keyboard & Mat';
      case 'lifestyle': return 'Bali Lifestyle Add-ons';
      case 'backdrops': return 'Window Scenery View';
      default: return 'Equipment';
    }
  };

  const getSlotIcon = () => {
    switch (selectedSlot) {
      case 'desks': return <Layout className="w-3.5 h-3.5 text-emerald-400" />;
      case 'chairs': return <Armchair className="w-3.5 h-3.5 text-emerald-400" />;
      case 'monitors': return <Monitor className="w-3.5 h-3.5 text-emerald-400" />;
      case 'lighting': return <Lamp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'plants': return <Flower2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'peripherals': return <Keyboard className="w-3.5 h-3.5 text-emerald-400" />;
      case 'lifestyle': return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'backdrops': return <Palmtree className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] bg-[#070A0F] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col group select-none">
      {/* BABYLON.JS RENDER CANVAS */}
      <canvas
        ref={canvasRef}
        className="w-full h-full flex-1 touch-none outline-none block"
      />

      {/* TOP FLOATING CONTROLS BAR */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-4 flex items-center justify-between pointer-events-none z-10 gap-2">
        {/* Left Badge: Engine Indicator & Preset */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-white text-xs font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200">Babylon.js 3D PBR</span>
          </div>

          {activePresetId && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <span>{PRESETS.find((p) => p.id === activePresetId)?.name}</span>
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Motorized Height Lift Toggle */}
          <button
            onClick={toggleStandingHeight}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg backdrop-blur-md cursor-pointer border ${
              isStanding
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                : 'bg-slate-950/90 text-slate-200 border-slate-700 hover:border-emerald-500/60 hover:text-white'
            }`}
            title="Elevate or lower motorized standing desk (74cm to 106cm)"
          >
            {isStanding ? (
              <>
                <ArrowDownCircle className="w-3.5 h-3.5 text-slate-950" />
                <span>Lower (74cm)</span>
              </>
            ) : (
              <>
                <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stand (106cm)</span>
              </>
            )}
          </button>

          {/* Camera Angles Menu */}
          <div className="flex items-center bg-slate-950/90 backdrop-blur-md rounded-full p-0.5 border border-slate-700/80 shadow-lg">
            <button
              onClick={() => setCameraPreset('isometric')}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-all cursor-pointer"
              title="Isometric 45° Overview"
            >
              Iso
            </button>
            <button
              onClick={() => setCameraPreset('eye')}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-all cursor-pointer"
              title="Eye Level (Sitting View)"
            >
              Eye
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-all cursor-pointer"
              title="Top Down Blueprint"
            >
              Top
            </button>
            <button
              onClick={() => setCameraPreset('wide')}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-all cursor-pointer"
              title="Bali Room Panorama"
            >
              Wide
            </button>
          </div>

          {/* Lighting Mode Pill */}
          <div className="flex items-center bg-slate-950/90 backdrop-blur-md rounded-full p-0.5 border border-slate-700/80 shadow-lg">
            <button
              onClick={() => setLightingMode('day')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'day'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tropical Daylight"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('sunset')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'sunset'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bali Golden Hour Sunset"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('night')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'night'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Cyber Ambient Glow"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D HELPER BADGE */}
      <div className="absolute top-14 left-4 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[11px] text-slate-300 shadow-md">
        <Eye className="w-3 h-3 text-emerald-400" />
        <span>Click any 3D furniture to customize • Drag to rotate camera</span>
      </div>

      {/* BOTTOM COMPACT QUICK-CUSTOMIZER (WITH ◀ AND ▶ ARROWS) */}
      {isQuickPanelOpen && (
        <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 z-20 pointer-events-none flex flex-col items-center">
          <div className="w-full max-w-xl pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 sm:p-3 text-white transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Slot Header Tabs & Close */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  {getSlotIcon()}
                </span>
                <span className="text-xs font-bold text-white">
                  {getSlotName()}
                </span>
              </div>

              {/* Category Quick Chips */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-[210px] sm:max-w-xs no-scrollbar">
                {(['chairs', 'desks', 'monitors', 'lighting', 'plants', 'lifestyle', 'backdrops'] as ConfigurableSlot[]).map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize whitespace-nowrap cursor-pointer transition-all ${
                      selectedSlot === slot
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {slot === 'backdrops' ? 'Scenery' : slot === 'lifestyle' ? 'Add-ons' : slot}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsQuickPanelOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                title="Minimize customizer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* MAIN CAROUSEL WITH ◀ AND ▶ ARROWS */}
            <div className="flex items-center justify-between gap-2">
              {/* Left Arrow Button */}
              <button
                onClick={() => handleCycleItem('prev')}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-emerald-400 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                title="Previous Model (◀)"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Active Item Title & Price */}
              <div className="flex-1 min-w-0 text-center px-2">
                {selectedSlot === 'backdrops' ? (
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                      {currentActiveBackdrop?.name || 'Outdoor Scenery'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {currentActiveBackdrop?.subtitle}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {currentActiveProduct?.name || 'Selected Equipment'}
                      </span>
                      {currentActiveProduct?.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          {currentActiveProduct.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      {currentActiveProduct ? (
                        currency === 'USD'
                          ? `$${currentActiveProduct.priceMonthlyUSD}/mo • $${currentActiveProduct.priceWeeklyUSD}/wk`
                          : `Rp ${(currentActiveProduct.priceMonthlyIDR / 1000).toLocaleString('id-ID')}k/bln`
                      ) : (
                        'Included in workspace'
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={() => handleCycleItem('next')}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-emerald-400 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                title="Next Model (▶)"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* HORIZONTAL OPTION CHIPS (1-Click instant switch) */}
            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {selectedSlot === 'backdrops' ? (
                BACKDROPS.map((b) => {
                  const isEquipped = backdrop === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleSelectItem(b.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                        isEquipped
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-xs'
                          : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {isEquipped && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{b.name}</span>
                    </button>
                  );
                })
              ) : (
                currentCategoryProducts.map((p) => {
                  const isEquipped = isCurrentEquipped(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectItem(p.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                        isEquipped
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-xs'
                          : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {isEquipped && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {currency === 'USD' ? `$${p.priceMonthlyUSD}` : `${Math.round(p.priceMonthlyIDR / 1000)}k`}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK PANEL RE-OPEN BUTTON (If minimized) */}
      {!isQuickPanelOpen && (
        <button
          onClick={() => setIsQuickPanelOpen(true)}
          className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 text-white text-xs font-bold shadow-xl hover:border-emerald-500 transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Open 3D Customizer</span>
        </button>
      )}
    </div>
  );
};

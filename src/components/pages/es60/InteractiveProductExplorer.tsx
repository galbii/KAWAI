"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  Info, 
  Volume2, 
  Headphones, 
  Keyboard, 
  Settings, 
  RotateCw, 
  ZoomIn, 
  ZoomOut,
  PlayCircle,
  X,
  Speaker,
  Mic,
  Cable,
  Music,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Hotspot {
  id: string;
  x: number; // Percentage position
  y: number; // Percentage position
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'sound' | 'features' | 'connectivity' | 'design';
  audioSample?: string;
  detailImage?: string;
  specifications?: Array<{ label: string; value: string }>;
}

interface ProductExplorerProps {
  isActive: boolean;
  onInteraction?: (hotspotId: string) => void;
  showHotspots?: boolean;
  allowRotation?: boolean;
  className?: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'speakers',
    x: 25,
    y: 40,
    title: 'Premium Speakers',
    description: 'High-quality stereo speakers with enhanced bass response for room-filling sound.',
    icon: <Speaker className="w-4 h-4" />,
    category: 'sound',
    specifications: [
      { label: 'Output Power', value: '11W × 2' },
      { label: 'Frequency Response', value: '20Hz - 20kHz' },
      { label: 'Speakers', value: '12cm × 2' }
    ]
  },
  {
    id: 'keyboard',
    x: 50,
    y: 65,
    title: 'Responsive Hammer Compact II',
    description: 'Kawai\'s premium weighted action provides authentic piano touch and response.',
    icon: <Keyboard className="w-4 h-4" />,
    category: 'features',
    audioSample: '/audio/es60-touch-demo.mp3',
    specifications: [
      { label: 'Action Type', value: 'Responsive Hammer Compact II' },
      { label: 'Key Weight', value: 'Graded hammer weighting' },
      { label: 'Touch Sensitivity', value: '4 levels + fixed' }
    ]
  },
  {
    id: 'headphones',
    x: 15,
    y: 25,
    title: 'Dual Headphone Outputs',
    description: 'Two headphone jacks for silent practice or teacher-student lessons.',
    icon: <Headphones className="w-4 h-4" />,
    category: 'connectivity',
    specifications: [
      { label: 'Outputs', value: '2 × 1/4" stereo jacks' },
      { label: 'Volume Control', value: 'Independent adjustment' },
      { label: 'Auto Speaker Off', value: 'When headphones connected' }
    ]
  },
  {
    id: 'controls',
    x: 80,
    y: 30,
    title: 'Intuitive Controls',
    description: 'Easy-to-use buttons and display for quick sound selection and settings.',
    icon: <Settings className="w-4 h-4" />,
    category: 'features',
    specifications: [
      { label: 'Display', value: 'LCD with sound names' },
      { label: 'Sound Selection', value: 'One-touch buttons' },
      { label: 'Transpose', value: '±12 semitones' }
    ]
  },
  {
    id: 'connectivity',
    x: 75,
    y: 70,
    title: 'Modern Connectivity',
    description: 'USB-MIDI, line outputs, and sustain pedal input for complete musical setup.',
    icon: <Cable className="w-4 h-4" />,
    category: 'connectivity',
    specifications: [
      { label: 'USB', value: 'Type B for MIDI' },
      { label: 'Line Out', value: 'L/MONO, R outputs' },
      { label: 'Sustain Pedal', value: 'Included F-10H' }
    ]
  },
  {
    id: 'sound-engine',
    x: 50,
    y: 20,
    title: 'Shigeru Kawai SK-EX Samples',
    description: 'Premium concert grand samples with 192-note polyphony for unlimited expression.',
    icon: <Music className="w-4 h-4" />,
    category: 'sound',
    audioSample: '/audio/es60-skex-demo.mp3',
    specifications: [
      { label: 'Sound Source', value: 'Shigeru Kawai SK-EX' },
      { label: 'Polyphony', value: '192 notes' },
      { label: 'Total Sounds', value: '15 high-quality voices' }
    ]
  }
];

export function InteractiveProductExplorer({ 
  isActive, 
  onInteraction,
  showHotspots = true,
  allowRotation = true,
  className = '' 
}: ProductExplorerProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showAllHotspots, setShowAllHotspots] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const [view360Active, setView360Active] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-show hotspots after a delay
  useEffect(() => {
    if (isActive && showHotspots) {
      const timer = setTimeout(() => {
        setShowAllHotspots(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isActive, showHotspots]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot.id);
    onInteraction?.(hotspot.id);
    
    // Play audio sample if available
    if (hotspot.audioSample && audioRef.current) {
      audioRef.current.src = hotspot.audioSample;
      audioRef.current.play();
      setAudioPlaying(hotspot.id);
    }
  };

  const handleCloseHotspot = () => {
    setSelectedHotspot(null);
    setAudioPlaying(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (allowRotation && view360Active) {
      const deltaX = info.delta.x;
      setRotation(prev => prev + deltaX * 0.5);
    }
  }, [allowRotation, view360Active]);

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const resetView = () => {
    setRotation(0);
    setZoom(1);
  };

  const selectedHotspotData = HOTSPOTS.find(h => h.id === selectedHotspot);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} ref={containerRef}>
      {/* Audio element */}
      <audio ref={audioRef} className="hidden" onEnded={() => setAudioPlaying(null)} />

      {/* Main Product View */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ 
          transform: `rotate(${rotation}deg) scale(${zoom})`,
          transformOrigin: 'center'
        }}
        drag={view360Active}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {/* ES60 Piano Illustration */}
        <div className="relative w-[600px] h-[300px] max-w-full max-h-full">
          {/* Piano Body */}
          <div 
            className="w-full h-full bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-lg border-2 border-red-500/30 shadow-2xl"
            style={{
              backgroundImage: `
                linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%),
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
              boxShadow: `
                0 20px 40px rgba(0,0,0,0.3),
                inset 0 1px 0 rgba(255,255,255,0.1),
                0 0 0 1px rgba(225, 25, 34, 0.2)
              `
            }}
          >
            {/* Keyboard Area */}
            <div className="absolute bottom-4 left-8 right-8 h-16 bg-gradient-to-b from-gray-100 to-white rounded shadow-inner">
              {/* Black keys pattern */}
              <div className="absolute top-0 left-0 right-0 h-10 flex">
                {[...Array(36)].map((_, i) => {
                  const isBlack = [1, 3, 6, 8, 10].includes(i % 12);
                  if (!isBlack) return null;
                  return (
                    <div
                      key={i}
                      className="w-3 h-full bg-gray-900 border-r border-gray-700"
                      style={{ 
                        marginLeft: `${2.8 * (i % 12 === 1 ? 1 : i % 12 === 3 ? 2 : i % 12 === 6 ? 4 : i % 12 === 8 ? 5 : 6)}%`
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Control Panel */}
            <div className="absolute top-4 right-8 w-32 h-20 bg-gray-800 rounded border border-gray-600">
              <div className="p-2">
                <div className="w-full h-4 bg-green-900 rounded mb-2 flex items-center justify-center">
                  <span className="text-green-400 text-xs font-mono">ES60</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-700 rounded-sm" />
                  ))}
                </div>
              </div>
            </div>

            {/* Speaker Grilles */}
            <div className="absolute top-8 left-8 w-20 h-20 rounded border border-gray-600">
              <div className="grid grid-cols-6 grid-rows-6 gap-0.5 p-2 h-full">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-gray-700 rounded-full" />
                ))}
              </div>
            </div>
            <div className="absolute top-8 right-48 w-20 h-20 rounded border border-gray-600">
              <div className="grid grid-cols-6 grid-rows-6 gap-0.5 p-2 h-full">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-gray-700 rounded-full" />
                ))}
              </div>
            </div>

            {/* Brand Logo */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <span className="text-red-500 font-bold text-xl tracking-wider">KAWAI</span>
            </div>

            {/* Interactive Hotspots */}
            <AnimatePresence>
              {showHotspots && showAllHotspots && HOTSPOTS.map((hotspot) => (
                <motion.button
                  key={hotspot.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: selectedHotspot === hotspot.id ? 360 : 0
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    delay: Math.random() * 0.5,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                    selectedHotspot === hotspot.id
                      ? 'bg-red-500 border-red-300 scale-110 shadow-lg'
                      : hotspot.category === 'sound'
                      ? 'bg-blue-500/80 border-blue-300 hover:bg-blue-500 hover:scale-110'
                      : hotspot.category === 'features'
                      ? 'bg-green-500/80 border-green-300 hover:bg-green-500 hover:scale-110'
                      : hotspot.category === 'connectivity'
                      ? 'bg-purple-500/80 border-purple-300 hover:bg-purple-500 hover:scale-110'
                      : 'bg-yellow-500/80 border-yellow-300 hover:bg-yellow-500 hover:scale-110'
                  }`}
                  style={{ 
                    left: `${hotspot.x}%`, 
                    top: `${hotspot.y}%` 
                  }}
                  onClick={() => handleHotspotClick(hotspot)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {hotspot.icon}
                  
                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-current opacity-75"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Button
          onClick={() => setView360Active(!view360Active)}
          size="sm"
          variant={view360Active ? "default" : "outline"}
          className={`w-10 h-10 rounded-full ${
            view360Active 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
          }`}
          title="Toggle 360° view (drag to rotate)"
        >
          <RotateCw className="w-4 h-4" />
        </Button>

        <Button
          onClick={zoomIn}
          size="sm"
          variant="outline"
          className="w-10 h-10 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <Button
          onClick={zoomOut}
          size="sm"
          variant="outline"
          className="w-10 h-10 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <Button
          onClick={resetView}
          size="sm"
          variant="outline"
          className="w-10 h-10 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20"
          title="Reset view"
        >
          <Monitor className="w-4 h-4" />
        </Button>
      </div>

      {/* Hotspot Details Panel */}
      <AnimatePresence>
        {selectedHotspotData && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 left-4 bottom-4 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 z-30 overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedHotspotData.category === 'sound' ? 'bg-blue-500' :
                  selectedHotspotData.category === 'features' ? 'bg-green-500' :
                  selectedHotspotData.category === 'connectivity' ? 'bg-purple-500' : 'bg-yellow-500'
                }`}>
                  {selectedHotspotData.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {selectedHotspotData.title}
                  </h3>
                  <span className={`text-xs uppercase tracking-wider ${
                    selectedHotspotData.category === 'sound' ? 'text-blue-400' :
                    selectedHotspotData.category === 'features' ? 'text-green-400' :
                    selectedHotspotData.category === 'connectivity' ? 'text-purple-400' : 'text-yellow-400'
                  }`}>
                    {selectedHotspotData.category}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleCloseHotspot}
                size="sm"
                variant="ghost"
                className="w-8 h-8 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-6">
              {selectedHotspotData.description}
            </p>

            {/* Audio Sample */}
            {selectedHotspotData.audioSample && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Audio Sample</span>
                </div>
                <Button
                  onClick={() => {
                    if (audioRef.current) {
                      if (audioPlaying === selectedHotspotData.id) {
                        audioRef.current.pause();
                        setAudioPlaying(null);
                      } else {
                        audioRef.current.src = selectedHotspotData.audioSample!;
                        audioRef.current.play();
                        setAudioPlaying(selectedHotspotData.id);
                      }
                    }
                  }}
                  size="sm"
                  className={`w-full ${
                    audioPlaying === selectedHotspotData.id
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {audioPlaying === selectedHotspotData.id ? 'Playing...' : 'Play Sample'}
                </Button>
              </div>
            )}

            {/* Specifications */}
            {selectedHotspotData.specifications && (
              <div>
                <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Specifications
                </h4>
                <div className="space-y-2">
                  {selectedHotspotData.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/60 text-sm">{spec.label}</span>
                      <span className="text-white text-sm font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {view360Active && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 z-20"
        >
          <p className="text-white/80 text-sm">
            Drag to rotate • Click hotspots to explore
          </p>
        </motion.div>
      )}

      {/* Category Legend */}
      {showAllHotspots && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-20"
        >
          <h4 className="text-white font-medium text-sm mb-3">Explore Features</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-blue-400">Sound Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-green-400">Features</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-purple-400">Connectivity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-yellow-400">Design</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default InteractiveProductExplorer;
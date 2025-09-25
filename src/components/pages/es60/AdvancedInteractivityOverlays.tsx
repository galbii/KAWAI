"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Zap, 
  DollarSign, 
  Award, 
  Users, 
  Star, 
  ArrowRight, 
  ArrowLeft,
  Sliders,
  ArrowLeftRight,
  TrendingUp,
  Music,
  Headphones,
  Piano,
  Info,
  X,
  Download,
  Share2,
  Heart,
  Bookmark,
  Calculator,
  CreditCard,
  Calendar,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ComparisonItem {
  id: string;
  name: string;
  price: number;
  image: string;
  features: string[];
  rating: number;
  reviews: number;
  category: 'competitor' | 'kawai' | 'premium';
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  verified: boolean;
}

interface AdvancedOverlayProps {
  currentScene: number;
  isActive: boolean;
  onInteraction?: (action: string, data?: any) => void;
}

const COMPARISON_ITEMS: ComparisonItem[] = [
  {
    id: 'es60',
    name: 'Kawai ES60',
    price: 499,
    image: '/images/es60-comparison.jpg',
    features: [
      'Shigeru Kawai SK-EX samples',
      'Responsive Hammer Compact II',
      '192-note polyphony',
      'Dual headphone outputs',
      '15 premium sounds',
      '24 lbs portable'
    ],
    rating: 4.8,
    reviews: 127,
    category: 'kawai'
  },
  {
    id: 'competitor-a',
    name: 'Roland FP-30X',
    price: 729,
    image: '/images/competitor-a.jpg',
    features: [
      'SuperNATURAL Piano',
      'PHA-4 Standard action',
      '256-note polyphony',
      'Single headphone output',
      '35 sounds',
      '31 lbs'
    ],
    rating: 4.5,
    reviews: 89,
    category: 'competitor'
  },
  {
    id: 'competitor-b',
    name: 'Yamaha P-125a',
    price: 649,
    image: '/images/competitor-b.jpg',
    features: [
      'CFX Concert Grand samples',
      'GHS weighted action',
      '192-note polyphony',
      'Single headphone output',
      '24 sounds',
      '26 lbs'
    ],
    rating: 4.6,
    reviews: 156,
    category: 'competitor'
  },
  {
    id: 'premium',
    name: 'Kawai CA701',
    price: 2899,
    image: '/images/kawai-ca701.jpg',
    features: [
      'Shigeru Kawai SK-EX samples',
      'Grand Feel Compact action',
      '256-note polyphony',
      'Dual headphone outputs',
      '40+ premium sounds',
      'Cabinet design'
    ],
    rating: 4.9,
    reviews: 73,
    category: 'premium'
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Piano Teacher, 15+ years',
    content: 'The ES60 delivers concert grand quality at an unbelievable price. My students love the authentic touch response.',
    rating: 5,
    verified: true
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Touring Musician',
    content: 'Perfect for live performances. The sound rivals pianos costing thousands more. Incredibly portable too.',
    rating: 5,
    verified: true
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'Home Player',
    content: 'Finally, a digital piano that sounds like the grand piano I learned on. The dual headphone feature is perfect for practice.',
    rating: 4,
    verified: true
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Music Student',
    content: 'As a college student, the ES60 fits my budget and apartment perfectly. The weighted keys feel incredibly realistic.',
    rating: 5,
    verified: true
  }
];

export function AdvancedInteractivityOverlays({ 
  currentScene, 
  isActive, 
  onInteraction 
}: AdvancedOverlayProps) {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [comparisonSliderValue, setComparisonSliderValue] = useState(50);
  const [selectedComparison, setSelectedComparison] = useState('competitor-a');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showFinancingCalculator, setShowFinancingCalculator] = useState(false);
  const [financingParams, setFinancingParams] = useState({
    price: 499,
    downPayment: 99,
    months: 12,
    interestRate: 0
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });

  // Auto-cycle testimonials
  useEffect(() => {
    if (activeOverlay === 'testimonials') {
      const interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
      }, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [activeOverlay]);

  // Scene-specific overlay triggers
  useEffect(() => {
    if (!isActive) return;

    switch (currentScene) {
      case 2: // Transformation scene
        setTimeout(() => setActiveOverlay('comparison'), 3000);
        break;
      case 3: // Experience scene
        setTimeout(() => setActiveOverlay('audio-comparison'), 2000);
        break;
      case 4: // Finale scene
        setTimeout(() => setActiveOverlay('social-proof'), 1000);
        break;
    }
  }, [currentScene, isActive]);

  const closeOverlay = () => {
    setActiveOverlay(null);
    onInteraction?.('overlay_closed', { overlay: activeOverlay });
  };

  const calculateMonthlyPayment = () => {
    const principal = financingParams.price - financingParams.downPayment;
    const monthlyRate = financingParams.interestRate / 100 / 12;
    
    if (monthlyRate === 0) {
      return principal / financingParams.months;
    }
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, financingParams.months)) / 
           (Math.pow(1 + monthlyRate, financingParams.months) - 1);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-30">
      {/* Value Comparison Slider Overlay */}
      <AnimatePresence>
        {activeOverlay === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 left-4 right-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                Value Comparison
              </h3>
              <Button
                onClick={closeOverlay}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Comparison selector */}
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {COMPARISON_ITEMS.filter(item => item.id !== 'es60').map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedComparison(item.id)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedComparison === item.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison slider */}
            <div className="relative">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-white/70">ES60</span>
                <span className="text-sm text-white/70">
                  {COMPARISON_ITEMS.find(item => item.id === selectedComparison)?.name}
                </span>
              </div>
              
              <div className="relative h-2 bg-white/20 rounded-full mb-4">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-red-500 rounded-full"
                  style={{ width: `${comparisonSliderValue}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comparisonSliderValue}
                  onChange={(e) => setComparisonSliderValue(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-2 border-red-500 transform -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${comparisonSliderValue}%` }}
                />
              </div>

              {/* Feature comparison */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-red-400 font-semibold mb-2">Kawai ES60 - $499</h4>
                  <ul className="space-y-1">
                    {COMPARISON_ITEMS[0]?.features?.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-white/80 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {feature}
                      </li>
                    )) || []}
                  </ul>
                </div>
                <div>
                  {(() => {
                    const competitor = COMPARISON_ITEMS.find(item => item.id === selectedComparison);
                    return competitor ? (
                      <>
                        <h4 className="text-blue-400 font-semibold mb-2">
                          {competitor.name} - ${competitor.price}
                        </h4>
                        <ul className="space-y-1">
                          {competitor.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-white/60 flex items-center gap-2">
                              <div className="w-3 h-3 border border-white/40 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Value proposition */}
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-semibold text-sm">
                  💰 Save ${COMPARISON_ITEMS.find(item => item.id === selectedComparison)?.price! - 499} 
                  with same Shigeru Kawai SK-EX sound quality
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Comparison Overlay */}
      <AnimatePresence>
        {activeOverlay === 'audio-comparison' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/95 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 pointer-events-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Music className="w-6 h-6 text-purple-400" />
                  Audio Comparison
                </h3>
                <Button
                  onClick={closeOverlay}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-white/80 mb-6">
                Experience the difference between SK-EX concert grand samples and standard digital piano sounds.
              </p>

              <div className="space-y-4">
                <AudioComparisonPlayer
                  title="Shigeru Kawai SK-EX (ES60)"
                  audioUrl="/audio/es60-skex-sample.mp3"
                  icon={<Award className="w-5 h-5 text-yellow-400" />}
                  isSelected={true}
                />
                
                <AudioComparisonPlayer
                  title="Standard Digital Piano"
                  audioUrl="/audio/standard-piano-sample.mp3"
                  icon={<Piano className="w-5 h-5 text-gray-400" />}
                  isSelected={false}
                />
              </div>

              <div className="mt-6 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <p className="text-purple-400 text-sm">
                  <Headphones className="w-4 h-4 inline mr-2" />
                  Best experienced with headphones
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Proof & Testimonials Overlay */}
      <AnimatePresence>
        {activeOverlay === 'social-proof' && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 bottom-4 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 pointer-events-auto overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Customer Stories
              </h3>
              <Button
                onClick={closeOverlay}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Testimonial carousel */}
            <div className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (TESTIMONIALS[currentTestimonial]?.rating || 0) ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                    {TESTIMONIALS[currentTestimonial]?.verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>

                  <p className="text-white/80 text-sm mb-3 leading-relaxed">
                    "{TESTIMONIALS[currentTestimonial]?.content || ''}"
                  </p>

                  <div className="text-xs">
                    <p className="text-white font-medium">
                      {TESTIMONIALS[currentTestimonial]?.name || ''}
                    </p>
                    <p className="text-white/60">
                      {TESTIMONIALS[currentTestimonial]?.role || ''}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial navigation */}
              <div className="flex justify-center gap-2 mt-4">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Trust signals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-medium">4.8/5</span>
                </div>
                <span className="text-white/60 text-xs">127 reviews</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">95+ Years</span>
                </div>
                <span className="text-white/60 text-xs">Piano heritage</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm font-medium">#1 Value</span>
                </div>
                <span className="text-white/60 text-xs">In price range</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => setShowFinancingCalculator(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Financing
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10"
                size="sm"
                asChild
              >
                <Link href="/contact?product=es60&action=demo">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Demo
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Financing Calculator Modal */}
      <AnimatePresence>
        {showFinancingCalculator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 pointer-events-auto"
            onClick={() => setShowFinancingCalculator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-500" />
                  Financing Calculator
                </h3>
                <Button
                  onClick={() => setShowFinancingCalculator(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Piano Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={financingParams.price}
                      onChange={(e) => setFinancingParams(prev => ({ ...prev, price: parseInt(e.target.value) || 499 }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Down Payment
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={financingParams.downPayment}
                      onChange={(e) => setFinancingParams(prev => ({ ...prev, downPayment: parseInt(e.target.value) || 0 }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Term (months)
                  </label>
                  <select
                    value={financingParams.months}
                    onChange={(e) => setFinancingParams(prev => ({ ...prev, months: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                    <option value={18}>18 months</option>
                    <option value={24}>24 months</option>
                  </select>
                </div>

                {/* Results */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">Monthly Payment</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      ${calculateMonthlyPayment().toFixed(0)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      0% APR • No credit check required
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowFinancingCalculator(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    asChild
                  >
                    <Link href="/contact?product=es60&action=financing">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Apply Now
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene-specific interaction hints */}
      <AnimatePresence>
        {isActive && currentScene === 2 && !activeOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-32 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg pointer-events-auto cursor-pointer"
            onClick={() => setActiveOverlay('comparison')}
          >
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              <span className="text-sm font-medium">Compare Value</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Audio comparison player component
function AudioComparisonPlayer({ 
  title, 
  audioUrl, 
  icon, 
  isSelected 
}: {
  title: string;
  audioUrl: string;
  icon: React.ReactNode;
  isSelected: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`p-4 rounded-lg border transition-all ${
      isSelected 
        ? 'bg-purple-500/20 border-purple-500/50' 
        : 'bg-white/5 border-white/20'
    }`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h4 className="text-white font-medium text-sm">{title}</h4>
            {isSelected && (
              <p className="text-purple-400 text-xs">Concert grand quality</p>
            )}
          </div>
        </div>
        
        <Button
          onClick={togglePlay}
          size="sm"
          variant="ghost"
          className={`w-10 h-10 rounded-full ${
            isSelected ? 'bg-purple-500 hover:bg-purple-600' : 'bg-white/10 hover:bg-white/20'
          } text-white`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </Button>
      </div>
    </div>
  );
}

export default AdvancedInteractivityOverlays;
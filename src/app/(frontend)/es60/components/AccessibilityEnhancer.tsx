"use client";

import React, { useState, useEffect, useContext, createContext } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Contrast, 
  Type, 
  Pause, 
  Play,
  SkipForward,
  Info,
  Settings,
  Moon,
  Sun,
  Zap,
  ZapOff,
  Monitor,
  Smartphone,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  audioDescriptions: boolean;
  keyboardNavigation: boolean;
  screenReaderMode: boolean;
  autoplay: boolean;
  captions: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  theme: 'dark' | 'light' | 'auto';
}

interface UserPreferences {
  volume: number;
  playbackSpeed: number;
  preferredDevice: 'desktop' | 'tablet' | 'mobile';
  bookmarks: Array<{
    scene: number;
    timestamp: number;
    title: string;
    note?: string;
  }>;
  completedScenes: number[];
  lastPosition: {
    scene: number;
    timestamp: number;
  };
  customHotkeys: Record<string, string>;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  preferences: UserPreferences;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  announce: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  audioDescriptions: false,
  keyboardNavigation: true,
  screenReaderMode: false,
  autoplay: false,
  captions: false,
  colorBlindMode: 'none',
  fontSize: 'medium',
  theme: 'auto'
};

const defaultPreferences: UserPreferences = {
  volume: 0.8,
  playbackSpeed: 1,
  preferredDevice: 'desktop',
  bookmarks: [],
  completedScenes: [],
  lastPosition: { scene: 0, timestamp: 0 },
  customHotkeys: {}
};

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('kawai-accessibility-settings');
      const savedPreferences = localStorage.getItem('kawai-user-preferences');
      
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
      
      if (savedPreferences) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(savedPreferences) });
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kawai-accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('kawai-user-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }, [preferences]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--motion-duration', '0.01ms');
      root.classList.add('reduced-motion');
    } else {
      root.style.removeProperty('--motion-duration');
      root.classList.remove('reduced-motion');
    }

    // Color blind filters
    const colorBlindFilters = {
      protanopia: 'url(#protanopia)',
      deuteranopia: 'url(#deuteranopia)',
      tritanopia: 'url(#tritanopia)',
      none: 'none'
    };
    
    root.style.filter = colorBlindFilters[settings.colorBlindMode];

    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px'
    };
    root.style.fontSize = fontSizes[settings.fontSize];

    // Theme
    if (settings.theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else if (settings.theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      }
    }
  }, [settings]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const announce = (message: string) => {
    // Create a live region for screen reader announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after a delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      preferences,
      updateSettings,
      updatePreferences,
      announce
    }}>
      {children}
      {/* Color blind filter definitions */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const { settings, preferences, updateSettings, updatePreferences, announce } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'accessibility' | 'preferences' | 'help'>('accessibility');

  const handleSettingChange = (key: keyof AccessibilitySettings, value: any) => {
    updateSettings({ [key]: value });
    announce(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    updatePreferences({ [key]: value });
    announce(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Accessibility & Preferences
                </h2>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close accessibility panel"
                >
                  ×
                </Button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-1 mt-4">
                {[
                  { id: 'accessibility', label: 'Accessibility', icon: Eye },
                  { id: 'preferences', label: 'Preferences', icon: Settings },
                  { id: 'help', label: 'Help', icon: Info }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {activeTab === 'accessibility' && (
                <AccessibilityTab 
                  settings={settings} 
                  onSettingChange={handleSettingChange} 
                />
              )}
              
              {activeTab === 'preferences' && (
                <PreferencesTab 
                  preferences={preferences} 
                  onPreferenceChange={handlePreferenceChange} 
                />
              )}
              
              {activeTab === 'help' && (
                <HelpTab />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AccessibilityTab({ 
  settings, 
  onSettingChange 
}: { 
  settings: AccessibilitySettings; 
  onSettingChange: (key: keyof AccessibilitySettings, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Visual Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Visual Settings
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            label="High Contrast Mode"
            description="Increase contrast for better visibility"
            checked={settings.highContrast}
            onChange={(checked) => onSettingChange('highContrast', checked)}
            icon={<Contrast className="w-4 h-4" />}
          />
          
          <ToggleSetting
            label="Large Text"
            description="Increase text size throughout the experience"
            checked={settings.largeText}
            onChange={(checked) => onSettingChange('largeText', checked)}
            icon={<Type className="w-4 h-4" />}
          />
          
          <ToggleSetting
            label="Reduced Motion"
            description="Minimize animations and transitions"
            checked={settings.reducedMotion}
            onChange={(checked) => onSettingChange('reducedMotion', checked)}
            icon={settings.reducedMotion ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          />

          <SelectSetting
            label="Color Blind Support"
            description="Apply color filters for color vision deficiency"
            value={settings.colorBlindMode}
            onChange={(value) => onSettingChange('colorBlindMode', value)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'protanopia', label: 'Protanopia (Red-blind)' },
              { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
              { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' }
            ]}
          />

          <SelectSetting
            label="Font Size"
            description="Choose your preferred text size"
            value={settings.fontSize}
            onChange={(value) => onSettingChange('fontSize', value)}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
              { value: 'xl', label: 'Extra Large' }
            ]}
          />

          <SelectSetting
            label="Theme"
            description="Choose your preferred color theme"
            value={settings.theme}
            onChange={(value) => onSettingChange('theme', value)}
            options={[
              { value: 'auto', label: 'Auto (System)' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' }
            ]}
            icon={settings.theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Audio Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Audio Settings
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Audio Descriptions"
            description="Enable spoken descriptions of visual elements"
            checked={settings.audioDescriptions}
            onChange={(checked) => onSettingChange('audioDescriptions', checked)}
            icon={<Headphones className="w-4 h-4" />}
          />
          
          <ToggleSetting
            label="Captions"
            description="Display text captions for audio content"
            checked={settings.captions}
            onChange={(checked) => onSettingChange('captions', checked)}
            icon={<Type className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Navigation Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Navigation Settings
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Keyboard Navigation"
            description="Enable keyboard shortcuts and navigation"
            checked={settings.keyboardNavigation}
            onChange={(checked) => onSettingChange('keyboardNavigation', checked)}
            icon={<Monitor className="w-4 h-4" />}
          />
          
          <ToggleSetting
            label="Screen Reader Mode"
            description="Optimize for screen reader compatibility"
            checked={settings.screenReaderMode}
            onChange={(checked) => onSettingChange('screenReaderMode', checked)}
            icon={<Eye className="w-4 h-4" />}
          />
          
          <ToggleSetting
            label="Auto-play"
            description="Automatically advance through scenes"
            checked={settings.autoplay}
            onChange={(checked) => onSettingChange('autoplay', checked)}
            icon={settings.autoplay ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
}

function PreferencesTab({ 
  preferences, 
  onPreferenceChange 
}: { 
  preferences: UserPreferences; 
  onPreferenceChange: (key: keyof UserPreferences, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Playback Preferences</h3>
        <div className="space-y-4">
          <RangeSetting
            label="Volume"
            description="Adjust the overall volume level"
            value={preferences.volume}
            onChange={(value) => onPreferenceChange('volume', value)}
            min={0}
            max={1}
            step={0.1}
            format={(value) => `${Math.round(value * 100)}%`}
          />
          
          <SelectSetting
            label="Preferred Device"
            description="Optimize experience for your device type"
            value={preferences.preferredDevice}
            onChange={(value) => onPreferenceChange('preferredDevice', value)}
            options={[
              { value: 'desktop', label: 'Desktop' },
              { value: 'tablet', label: 'Tablet' },
              { value: 'mobile', label: 'Mobile' }
            ]}
            icon={preferences.preferredDevice === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bookmarks</h3>
        {preferences.bookmarks.length > 0 ? (
          <div className="space-y-2">
            {preferences.bookmarks.map((bookmark, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{bookmark.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scene {bookmark.scene + 1} • {Math.round(bookmark.timestamp)}%
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newBookmarks = preferences.bookmarks.filter((_, i) => i !== index);
                    onPreferenceChange('bookmarks', newBookmarks);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No bookmarks saved yet. Use the bookmark button during playback to save moments.</p>
        )}
      </div>
    </div>
  );
}

function HelpTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'Space / K', action: 'Play/Pause' },
            { key: '← →', action: 'Previous/Next Scene' },
            { key: 'M', action: 'Toggle Audio' },
            { key: 'F', action: 'Fullscreen' },
            { key: 'B', action: 'Bookmark Moment' },
            { key: 'R', action: 'Reset Experience' },
            { key: '1-5', action: 'Jump to Scene' },
            { key: 'Esc', action: 'Close Panels' }
          ].map((shortcut) => (
            <div key={shortcut.key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono text-sm">
                {shortcut.key}
              </kbd>
              <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.action}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accessibility Features</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Screen reader compatible with ARIA labels and announcements</li>
          <li>• High contrast mode for improved visibility</li>
          <li>• Reduced motion options for users sensitive to animation</li>
          <li>• Color blind support with specialized filters</li>
          <li>• Keyboard navigation for mouse-free operation</li>
          <li>• Audio descriptions for visual content</li>
          <li>• Customizable text size and color themes</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Getting Help</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          If you need assistance with accessibility features or have feedback, please contact our support team.
        </p>
        <Button variant="outline" size="sm">
          Contact Support
        </Button>
      </div>
    </div>
  );
}

// Helper components
function ToggleSetting({ 
  label, 
  description, 
  checked, 
  onChange, 
  icon 
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </label>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`ml-4 w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        aria-pressed={checked}
        role="switch"
      >
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
}

function SelectSetting({ 
  label, 
  description, 
  value, 
  onChange, 
  options, 
  icon 
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function RangeSetting({ 
  label, 
  description, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  format 
}: {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {format(value)}
        </span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}
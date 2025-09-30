'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle, 
  XCircle, 
  Star, 
  Music, 
  Headphones, 
  Weight, 
  Zap,
  Volume2,
  Settings,
  Award,
  TrendingUp
} from 'lucide-react';

interface Specification {
  category: string;
  items: Array<{
    label: string;
    value: string;
    benefit?: string;
    highlight?: boolean;
  }>;
}

interface CompetitorModel {
  name: string;
  price: string;
  keyAction: string;
  sound: string;
  polyphony: string;
  weight: string;
  headphones: string;
  overall: 'winner' | 'good' | 'poor';
}

export function ES60Specifications() {
  const [activeTab, setActiveTab] = useState<'specs' | 'comparison'>('specs');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const specifications: Specification[] = [
    {
      category: 'Sound Engine',
      items: [
        {
          label: 'Piano Samples',
          value: 'Shigeru Kawai SK-EX Concert Grand',
          benefit: 'Same premium sound as $2,000+ models',
          highlight: true
        },
        {
          label: 'Total Sounds',
          value: '17 Carefully Curated Voices',
          benefit: 'Quality over quantity - essential sounds for learning'
        },
        {
          label: 'Polyphony',
          value: '192 Notes Maximum',
          benefit: 'No note dropouts, even with sustain pedal',
          highlight: true
        },
        {
          label: 'Harmonic Imaging',
          value: 'Advanced Harmonic Imaging Technology',
          benefit: 'Smooth dynamic transitions for expressive playing'
        }
      ]
    },
    {
      category: 'Key Action',
      items: [
        {
          label: 'Key Type',
          value: '88 Full-Size Weighted Keys',
          benefit: 'Authentic piano feel and technique development',
          highlight: true
        },
        {
          label: 'Action System',
          value: 'Responsive Hammer Lite (RHL)',
          benefit: 'Graded weighting - 57g down-weight on middle C'
        },
        {
          label: 'Touch Sensitivity',
          value: 'Graded Weight Distribution',
          benefit: 'Heavier in bass, lighter in treble - just like acoustic pianos'
        },
        {
          label: 'Key Surface',
          value: 'Textured White Keys',
          benefit: 'Improved grip and control during extended practice'
        }
      ]
    },
    {
      category: 'Audio System',
      items: [
        {
          label: 'Built-in Speakers',
          value: 'Dual 10W Upward-Facing',
          benefit: 'Rich, room-filling sound projection'
        },
        {
          label: 'Headphone Outputs',
          value: '2 x 1/4" Stereo Jacks',
          benefit: 'Perfect for lessons and private practice',
          highlight: true
        },
        {
          label: 'Line Outputs',
          value: '2 x 1/4" Stereo (Professional)',
          benefit: 'Connect to external speakers or recording equipment',
          highlight: true
        },
        {
          label: 'Sustain Pedal',
          value: 'Included (Half-Damper Support)',
          benefit: 'Professional pedal techniques'
        }
      ]
    },
    {
      category: 'Connectivity',
      items: [
        {
          label: 'USB Connection',
          value: 'USB to Host',
          benefit: 'MIDI connectivity for computers and apps'
        },
        {
          label: 'PianoRemote App',
          value: 'iOS & Android Compatible',
          benefit: 'Control all piano settings from your smartphone',
          highlight: true
        },
        {
          label: 'MIDI',
          value: 'Full MIDI Implementation via USB',
          benefit: 'Compatible with DAWs and music software'
        }
      ]
    },
    {
      category: 'Physical Design',
      items: [
        {
          label: 'Weight',
          value: '24.25 lbs (11 kg)',
          benefit: 'Ultra-portable for lessons and moving',
          highlight: true
        },
        {
          label: 'Dimensions',
          value: '51.6" W x 11.6" D x 5.9" H',
          benefit: 'Compact footprint, fits anywhere'
        },
        {
          label: 'Stand',
          value: 'Optional (Not Included)',
          benefit: 'Compatible with Kawai furniture-style stands'
        },
        {
          label: 'Power Supply',
          value: 'AC Adapter (Included)',
          benefit: 'No batteries needed, always ready'
        },
        {
          label: 'Color',
          value: 'Matte Black Finish',
          benefit: 'Professional appearance'
        }
      ]
    }
  ];

  const competitors: CompetitorModel[] = [
    {
      name: 'Kawai ES60',
      price: '$499',
      keyAction: 'Responsive Hammer Lite',
      sound: 'Shigeru Kawai SK-EX',
      polyphony: '192 notes',
      weight: '24.25 lbs',
      headphones: 'Dual outputs',
      overall: 'winner'
    },
    {
      name: 'Yamaha P-225',
      price: '$699',
      keyAction: 'GHS (basic weighted)',
      sound: 'GHS sampled piano',
      polyphony: '192 notes',
      weight: '26 lbs',
      headphones: 'Single output',
      overall: 'good'
    },
    {
      name: 'Roland FP-30X',
      price: '$749',
      keyAction: 'PHA-4 Standard',
      sound: 'SuperNATURAL Piano',
      polyphony: '256 notes',
      weight: '33.7 lbs',
      headphones: 'Single output',
      overall: 'good'
    },
    {
      name: 'Korg B2',
      price: '$429',
      keyAction: 'NH (Natural Weighted)',
      sound: 'German grand piano',
      polyphony: '120 notes',
      weight: '21 lbs',
      headphones: 'Single output',
      overall: 'poor'
    }
  ];

  const getComparisonIcon = (modelName: string, es60Value: string, competitorValue: string) => {
    if (modelName === 'Kawai ES60') {
      return <CheckCircle className="w-5 h-5" style={{ color: '#9CAF88' }} />;
    }
    
    // Define what's better for each category
    const comparisons = {
      price: (es60: string, competitor: string) => {
        const es60Price = parseInt(es60.replace('$', ''));
        const compPrice = parseInt(competitor.replace('$', ''));
        return es60Price < compPrice;
      },
      weight: (es60: string, competitor: string) => {
        const es60Weight = parseFloat(es60.split(' ')[0] || '0');
        const compWeight = parseFloat(competitor.split(' ')[0] || '0');
        return es60Weight < compWeight;
      }
    };

    // Special cases for better comparison
    if (competitorValue.includes('Shigeru Kawai') || 
        competitorValue.includes('Dual outputs') ||
        competitorValue.includes('Responsive Hammer Lite')) {
      return <CheckCircle className="w-5 h-5" style={{ color: '#9CAF88' }} />;
    }
    
    if (competitorValue.includes('Single output') || 
        competitorValue.includes('120 notes') ||
        competitorValue.includes('basic weighted')) {
      return <XCircle className="w-5 h-5" style={{ color: '#8B7355' }} />;
    }

    return <CheckCircle className="w-5 h-5" style={{ color: '#6B645C' }} />;
  };

  const handleDownload = (type: 'spec-sheet' | 'quick-reference') => {
    // In a real implementation, this would trigger a PDF download
    console.log(`Downloading ${type}...`);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `kawai-es60-${type}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-20" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#3C3530' }}>
            ES60 Digital Piano Specifications
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: '#6B645C' }}>
            Professional specifications with 88 weighted keys, concert grand sound, and exceptional portability
          </p>

          {/* Tab Navigation */}
          <div className="inline-flex rounded-xl p-1" style={{ backgroundColor: '#F5F2ED' }}>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'specs' 
                  ? 'shadow-lg' 
                  : 'hover:opacity-70'
              }`}
              style={{
                backgroundColor: activeTab === 'specs' ? '#E11922' : 'transparent',
                color: activeTab === 'specs' ? '#FAF8F5' : '#6B645C'
              }}
            >
              <Settings className="w-5 h-5 inline-block mr-2" />
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'comparison' 
                  ? 'shadow-lg' 
                  : 'hover:opacity-70'
              }`}
              style={{
                backgroundColor: activeTab === 'comparison' ? '#E11922' : 'transparent',
                color: activeTab === 'comparison' ? '#FAF8F5' : '#6B645C'
              }}
            >
              <TrendingUp className="w-5 h-5 inline-block mr-2" />
              Comparison
            </button>
          </div>
        </div>

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <div className={`transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid lg:grid-cols-2 gap-8">
              {specifications.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className="rounded-2xl p-8 shadow-lg"
                  style={{ 
                    backgroundColor: '#F5F2ED',
                    transitionDelay: `${categoryIndex * 100}ms`
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#3C3530' }}>
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={`p-4 rounded-xl ${
                          item.highlight ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: '#FAF8F5',
                          borderColor: item.highlight ? '#E11922' : 'transparent'
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold" style={{ color: '#3C3530' }}>
                            {item.label}
                          </span>
                          {item.highlight && (
                            <Star className="w-5 h-5" style={{ color: '#E11922' }} />
                          )}
                        </div>
                        <div className="font-bold text-lg mb-1" style={{ color: '#5D4E37' }}>
                          {item.value}
                        </div>
                        {item.benefit && (
                          <div className="text-sm" style={{ color: '#6B645C' }}>
                            {item.benefit}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Why It Matters Section */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-12" style={{ color: '#3C3530' }}>
                Why These Specifications Matter
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
                    style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
                  >
                    <Music className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-3" style={{ color: '#3C3530' }}>
                    Concert Grand Sound
                  </h4>
                  <p style={{ color: '#6B645C' }}>
                    Shigeru Kawai SK-EX concert grand samples with Harmonic Imaging provide authentic tonal transitions used by professional pianists worldwide.
                  </p>
                </div>
                <div className="text-center p-6">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
                    style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
                  >
                    <Weight className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-3" style={{ color: '#3C3530' }}>
                    Ultra-Portable Design
                  </h4>
                  <p style={{ color: '#6B645C' }}>
                    At just 24.25 lbs, the ES60 is perfect for lessons, performances, or apartment living. Move it easily between rooms without compromise.
                  </p>
                </div>
                <div className="text-center p-6">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
                    style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
                  >
                    <Zap className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-3" style={{ color: '#3C3530' }}>
                    Full Connectivity
                  </h4>
                  <p style={{ color: '#6B645C' }}>
                    PianoRemote app control, dual headphone outputs for lessons, and professional line outputs for recording make the ES60 incredibly versatile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className={`transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#F5F2ED' }}>
                <thead>
                  <tr style={{ backgroundColor: '#8B7355' }}>
                    <th className="p-4 text-left font-bold" style={{ color: '#FAF8F5' }}>Model</th>
                    <th className="p-4 text-center font-bold" style={{ color: '#FAF8F5' }}>Price</th>
                    <th className="p-4 text-center font-bold" style={{ color: '#FAF8F5' }}>Key Action</th>
                    <th className="p-4 text-center font-bold" style={{ color: '#FAF8F5' }}>Sound Engine</th>
                    <th className="p-4 text-center font-bold" style={{ color: '#FAF8F5' }}>Polyphony</th>
                    <th className="p-4 text-center font-bold" style={{ color: '#FAF8F5' }}>Weight</th>
                    <th className="p-4 text-center font-bold" style={{ color: '#FAF8F5' }}>Headphones</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((model, index) => (
                    <tr 
                      key={index}
                      className={`border-b ${
                        model.name === 'Kawai ES60' ? 'ring-2' : ''
                      }`}
                      style={{
                        backgroundColor: model.name === 'Kawai ES60' ? '#FAF8F5' : '#F5F2ED',
                        borderColor: model.name === 'Kawai ES60' ? '#E11922' : 'transparent'
                      }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getComparisonIcon(model.name, '', '')}
                          <span className="font-bold" style={{ color: '#3C3530' }}>
                            {model.name}
                          </span>
                          {model.name === 'Kawai ES60' && (
                            <Award className="w-5 h-5" style={{ color: '#E11922' }} />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center font-semibold" style={{ color: '#5D4E37' }}>
                        {model.price}
                      </td>
                      <td className="p-4 text-center" style={{ color: '#6B645C' }}>
                        {model.keyAction}
                      </td>
                      <td className="p-4 text-center" style={{ color: '#6B645C' }}>
                        {model.sound}
                      </td>
                      <td className="p-4 text-center" style={{ color: '#6B645C' }}>
                        {model.polyphony}
                      </td>
                      <td className="p-4 text-center" style={{ color: '#6B645C' }}>
                        {model.weight}
                      </td>
                      <td className="p-4 text-center" style={{ color: '#6B645C' }}>
                        {model.headphones}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Comparison Summary */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div
                className="p-6 rounded-2xl text-center border-2"
                style={{ backgroundColor: '#9CAF88', color: '#3C3530', borderColor: '#E11922' }}
              >
                <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#E11922' }} />
                <h4 className="text-xl font-bold mb-2">Best Value</h4>
                <p className="font-semibold">$200-250 less than comparable models</p>
              </div>
              <div 
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
              >
                <Star className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Superior Sound</h4>
                <p className="font-semibold">Shigeru Kawai concert grand samples</p>
              </div>
              <div 
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
              >
                <Headphones className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Lesson Ready</h4>
                <p className="font-semibold">Only model with dual headphone outputs</p>
              </div>
            </div>
          </div>
        )}

        {/* Download Section */}
        <div className={`mt-16 text-center transition-all duration-700 ease-out delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3C3530' }}>
            Get Detailed Information
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleDownload('spec-sheet')}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#E11922', color: '#FAF8F5' }}
            >
              <Download className="w-5 h-5" />
              Download Full Spec Sheet
            </button>
            <button
              onClick={() => handleDownload('quick-reference')}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg border-2"
              style={{
                borderColor: '#E11922',
                color: '#E11922',
                backgroundColor: 'transparent'
              }}
            >
              <Download className="w-5 h-5" />
              Quick Reference Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
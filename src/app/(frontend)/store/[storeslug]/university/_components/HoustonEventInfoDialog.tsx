'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HoustonEventInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HoustonEventInfoDialog({ isOpen, onClose }: HoustonEventInfoDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dallasArea: '',
    pianoInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track event info request - removed

      // Simulate form submission (replace with your actual form handler)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dallasArea: '',
      pianoInterest: ''
    });
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={resetAndClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-kawai-red">Thank You!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6 space-y-4">
            <div className="text-4xl">🎹</div>
            <h3 className="text-lg font-semibold">Event Information Sent!</h3>
            <p className="text-gray-600">
              You&apos;ll receive exclusive Houston event details and special offers within 24 hours.
            </p>
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              <strong>Next Step:</strong> Check your email for VIP access details and priority booking information.
            </p>
            <Button onClick={resetAndClose} className="bg-kawai-red hover:bg-kawai-red/90">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-kawai-red">Houston Piano Event Information</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">TCU</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Exclusive Houston Showcase</h3>
                <p className="text-sm text-amber-700">
                  May 28–31, 2026 • TCU Partnership Event<br />
                  <span className="text-xs">2900 W Lowden St, Fort Worth TX 76109<br />Boschini Music Center – TCU Campus</span>
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Houston Area</label>
              <select
                name="dallasArea"
                value={formData.dallasArea}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
              >
                <option value="">Select your area</option>
                <option value="river-oaks">River Oaks</option>
                <option value="memorial">Memorial</option>
                <option value="uptown">Uptown</option>
                <option value="the-woodlands">The Woodlands</option>
                <option value="katy">Katy</option>
                <option value="plano">Plano</option>
                <option value="frisco">Frisco</option>
                <option value="allen">Allen</option>
                <option value="other">Other Houston Area</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Piano Interest</label>
              <select
                name="pianoInterest"
                value={formData.pianoInterest}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
              >
                <option value="">What interests you most?</option>
                <option value="grand-piano">Grand Pianos</option>
                <option value="upright-piano">Upright Pianos</option>
                <option value="digital-piano">Digital Pianos</option>
                <option value="student-piano">Student/Beginner Piano</option>
                <option value="professional-piano">Professional Performance Piano</option>
                <option value="exploring-options">Just exploring options</option>
              </select>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">You&apos;ll receive:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Exclusive pricing information</li>
                <li>• VIP appointment priority</li>
                <li>• Special Houston area offers</li>
                <li>• Event schedule and location details</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-kawai-red hover:bg-kawai-red/90"
            >
              {isSubmitting ? 'Sending...' : 'Send Event Information'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
/**
 * Refactored Email Form for DualConversion
 *
 * This demonstrates how to replace the complex email capture form
 * in DualConversion.tsx with the modular ConstantContactForm component.
 *
 * BEFORE: 150+ lines of mixed form logic and Constant Contact integration
 * AFTER: 30 lines of clean, reusable component usage
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ConstantContactForm, getSignatureFormConfig } from './ConstantContactForm';

interface RefactoredEmailFormProps {
  onComplete: (type: 'email', data: Record<string, unknown>) => void;
  assessmentResults: any;
  location: string;
  onBack: () => void;
}

/**
 * Refactored email form using modular components
 * Replaces lines 297-439 in the original DualConversion component
 */
export const RefactoredEmailForm: React.FC<RefactoredEmailFormProps> = ({
  onComplete,
  assessmentResults,
  location,
  onBack
}) => {
  return (
    <motion.div
      key="digital-form"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <ConstantContactForm
        constantContactConfig={{
          targetList: 'SHOWROOM KAWAI',
          createListIfMissing: true,
          showAuthPrompts: true
        }}
        formConfig={getSignatureFormConfig()}
        onSuccess={(data) => {
          // Call the original onComplete callback with the expected format
          onComplete('email', {
            ...data,
            conversionType: 'digital',
            assessmentResults,
            location
          });
        }}
        onError={(error) => {
          // Handle errors gracefully - form continues to work
          console.error('Heritage collection signup error:', error);
        }}
        additionalData={{
          assessmentResults,
          location,
          formType: 'signature-experience'
        }}
      />

      {/* Back button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
};

/**
 * HOW TO INTEGRATE INTO DUALCONVERSION:
 *
 * 1. Import the component:
 *    import { RefactoredEmailForm } from '@/components/forms/RefactoredEmailForm';
 *
 * 2. Replace the entire selectedPath === 'digital' section with:
 *    {selectedPath === 'digital' && (
 *      <RefactoredEmailForm
 *        onComplete={onComplete}
 *        assessmentResults={assessmentResults}
 *        location={location}
 *        onBack={() => setSelectedPath(null)}
 *      />
 *    )}
 *
 * 3. Remove these imports (no longer needed):
 *    - useConstantContact
 *    - ensureShowroomKawaiList
 *    - formatSignatureContact
 *    - SignatureContactData
 *
 * 4. Remove these state variables (no longer needed):
 *    - constantContactError
 *    - constantContactSuccess
 *    - All Constant Contact integration logic from handleEmailSubmit
 *
 * RESULT: DualConversion.tsx goes from 600+ lines to ~400 lines
 * with much cleaner separation of concerns!
 */

export default RefactoredEmailForm;
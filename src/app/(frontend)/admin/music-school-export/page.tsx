'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConstantContactAuth } from '@/hooks/useConstantContactAuth';

interface ExportStats {
  totalContacts: number;
  exportedAt: string;
  listName: string;
  listId: string;
}

export default function MusicSchoolExportPage() {
  // Proactive authentication check with auto-redirect
  const { isAuthenticated, isChecking, needsReauth, redirectToAuth } = useConstantContactAuth({
    autoRedirect: true, // Automatically redirect if auth is needed
    checkOnMount: true  // Check on page load
  });

  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState<ExportStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Handle successful authentication callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth_success') === 'true') {
        setAuthSuccess(true);
        // Clean up URL without reloading page
        window.history.replaceState({}, '', window.location.pathname);
        // Auto-hide success message after 5 seconds
        setTimeout(() => setAuthSuccess(false), 5000);
      }
    }
  }, []);

  const handleExportJSON = async () => {
    setIsExporting(true);
    setError(null);
    setStats(null);

    try {
      const response = await fetch('/api/music-school/export-contacts?format=json');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Export failed');
      }

      setStats(data.summary);

      // Download JSON file
      const blob = new Blob([JSON.stringify(data.data.contacts, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kpm-dallas-contacts-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    setError(null);
    setStats(null);

    try {
      const response = await fetch('/api/music-school/export-contacts?format=csv');

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Download CSV file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kpm-dallas-contacts-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Get stats from JSON endpoint
      const statsResponse = await fetch('/api/music-school/export-contacts?format=json');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.summary);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-kawai-red mx-auto mb-4" />
          <p className="text-lg text-kawai-black/70">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Show re-auth message if needed (backup in case auto-redirect fails)
  if (needsReauth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-semibold text-kawai-black mb-3">
            Authentication Required
          </h2>
          <p className="text-kawai-black/70 mb-6">
            Please re-authenticate with Constant Contact to access this page.
          </p>
          <button
            onClick={() => redirectToAuth()}
            className="bg-gradient-to-r from-kawai-red to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Authenticate Now
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif text-kawai-black mb-4">
            KPM DALLAS Contact Export
          </h1>
          <p className="text-lg text-kawai-black/70">
            Export all music school enrollment data from Constant Contact
          </p>
        </motion.div>

        {/* Authentication Success Message */}
        {authSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <div className="font-semibold text-green-900">Authentication Successful!</div>
                <div className="text-sm text-green-700">
                  You can now export contacts from Constant Contact.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Export Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-kawai-black mb-3">
              Export Options
            </h2>
            <p className="text-kawai-black/60">
              Choose your preferred format to download all student enrollment data.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="group relative overflow-hidden bg-gradient-to-r from-kawai-red to-red-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="relative z-10">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-bold text-lg mb-1">Export as CSV</div>
                <div className="text-sm opacity-90">
                  Excel-compatible spreadsheet format
                </div>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>

            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="relative z-10">
                <div className="text-3xl mb-2">📄</div>
                <div className="font-bold text-lg mb-1">Export as JSON</div>
                <div className="text-sm opacity-90">
                  Developer-friendly data format
                </div>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>

          {/* Loading State */}
          {isExporting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Exporting contacts...</div>
                  <div className="text-sm text-blue-700">
                    Fetching data from Constant Contact
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {stats && !isExporting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">✅</div>
                <div className="flex-1">
                  <div className="font-bold text-green-900 text-lg mb-2">
                    Export Successful!
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-green-800">Total Contacts:</span>
                      <div className="text-2xl font-bold text-green-900">{stats.totalContacts}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-green-800">List:</span>
                      <div className="text-green-900">{stats.listName}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold text-green-800">Exported At:</span>
                      <div className="text-green-900">
                        {new Date(stats.exportedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">❌</div>
                <div>
                  <div className="font-bold text-red-900 text-lg mb-1">Export Failed</div>
                  <div className="text-red-700">{error}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">ℹ️ Export Information</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Data Source:</span>
                <span>Constant Contact "KPM DALLAS" list</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Includes:</span>
                <span>All student enrollment data + guardian contact info</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Fields:</span>
                <span>Student info, musical background, lesson preferences, contact details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Download:</span>
                <span>File downloads automatically after export completes</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Data Fields Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-semibold text-kawai-black mb-6">
            Exported Data Fields
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-kawai-black mb-3">Guardian/Contact Info</h3>
              <ul className="space-y-1 text-sm text-kawai-black/70">
                <li>• Contact ID</li>
                <li>• Email Address</li>
                <li>• First Name</li>
                <li>• Last Name</li>
                <li>• Phone Number</li>
                <li>• Created/Updated Dates</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-kawai-black mb-3">Student Information</h3>
              <ul className="space-y-1 text-sm text-kawai-black/70">
                <li>• Student First Name</li>
                <li>• Student Last Name</li>
                <li>• Birth Year</li>
                <li>• Gender</li>
                <li>• School Grade (optional)</li>
                <li>• Current School (optional)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-kawai-black mb-3">Musical Background</h3>
              <ul className="space-y-1 text-sm text-kawai-black/70">
                <li>• Instrument of Interest</li>
                <li>• Length of Previous Study</li>
                <li>• Lesson Type Preference</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-kawai-black mb-3">Lesson Preferences</h3>
              <ul className="space-y-1 text-sm text-kawai-black/70">
                <li>• Price Range Preference</li>
                <li>• Preferred Lesson Time</li>
                <li>• Additional Notes (optional)</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block text-kawai-black/60 hover:text-kawai-black transition-colors"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

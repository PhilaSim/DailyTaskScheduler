import React, { useState } from 'react';
import { User, Settings } from '../types';
import { storage } from '../utils/storage';
import { ArrowLeft, Mail, Palette, RotateCcw, Shield } from 'lucide-react';

interface SettingsPageProps {
  user: User;
  onNavigate: (page: 'dashboard' | 'settings') => void;
  onReset: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onNavigate, onReset }) => {
  const [settings, setSettings] = useState<Settings>(storage.getSettings());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.setSettings(newSettings);
  };

  const handleReset = () => {
    storage.clearAll();
    onReset();
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6f7ff]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-[#30363d] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#c2d9e8]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#e6f7ff]">Settings</h1>
              <p className="text-[#c2d9e8] text-sm">
                Customize your productivity experience
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* User Profile */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#e6f7ff] mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-[#00e0ff]" />
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#c2d9e8] text-sm mb-1">First Name</label>
              <div className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6f7ff]">
                {user.firstName}
              </div>
            </div>
            <div>
              <label className="block text-[#c2d9e8] text-sm mb-1">Surname</label>
              <div className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6f7ff]">
                {user.surname}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#c2d9e8] text-sm mb-1">Email Address</label>
              <div className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6f7ff]">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#e6f7ff] mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-[#00e0ff]" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#e6f7ff] font-medium">Daily Email Reminders</h3>
                <p className="text-[#c2d9e8] text-sm">
                  Receive your optimized schedule via email every morning at 7:00 AM
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailReminders}
                  onChange={(e) => updateSetting('emailReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#30363d] peer-focus:outline-none peer-focus:ring-4 
                             peer-focus:ring-[#00e0ff]/25 rounded-full peer 
                             peer-checked:after:translate-x-full peer-checked:after:border-white 
                             after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                             after:bg-white after:border-gray-300 after:border after:rounded-full 
                             after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00e0ff]">
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#e6f7ff] mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-[#00e0ff]" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#e6f7ff] font-medium">Theme</h3>
                <p className="text-[#c2d9e8] text-sm">
                  Dark-Neon theme is currently active (Premium Edition)
                </p>
              </div>
              <div className="px-4 py-2 bg-[#00e0ff]/20 border border-[#00e0ff] 
                           rounded-lg text-[#00e0ff] text-sm font-medium">
                Dark Neon
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#161b22] border border-[#ff6b6b]/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#ff6b6b] mb-4 flex items-center">
            <RotateCcw className="w-5 h-5 mr-2" />
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#e6f7ff] font-medium">Reset Application</h3>
                <p className="text-[#c2d9e8] text-sm">
                  This will clear all your data and return you to the sign-in page
                </p>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-[#ff6b6b]/20 border border-[#ff6b6b] 
                         rounded-lg text-[#ff6b6b] hover:bg-[#ff6b6b]/30 
                         transition-all duration-200 text-sm font-medium"
              >
                🔄 Reset App
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#e6f7ff] mb-4">
              Confirm Reset
            </h3>
            <p className="text-[#c2d9e8] mb-6">
              Are you sure you want to reset the application? This will permanently delete:
            </p>
            <ul className="text-[#c2d9e8] text-sm space-y-1 mb-6">
              <li>• Your profile information</li>
              <li>• All saved schedules</li>
              <li>• Task completion history</li>
              <li>• All preferences and settings</li>
            </ul>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-[#30363d] text-[#e6f7ff] 
                         rounded-lg hover:bg-[#40464d] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-[#ff6b6b] text-white 
                         rounded-lg hover:bg-[#ff5252] transition-colors"
              >
                Reset App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

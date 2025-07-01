import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface SignInPageProps {
  onSignIn: (user: User) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onSignIn }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate loading delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
      firstName: formData.firstName.trim(),
      surname: formData.surname.trim(),
      email: formData.email.trim()
    };

    storage.setUser(user);
    onSignIn(user);
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#e6f7ff] mb-2">
            👋 Welcome to Daily Task Scheduler
          </h1>
          <p className="text-[#c2d9e8] text-lg">
            Your AI-powered productivity companion
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-[#e6f7ff] font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg 
                         text-[#e6f7ff] placeholder-[#7d8590] focus:outline-none focus:ring-2 
                         focus:ring-[#00e0ff] focus:border-[#00e0ff] transition-all"
                placeholder="Enter your first name"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-[#ff6b6b] text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Surname */}
            <div>
              <label htmlFor="surname" className="block text-[#e6f7ff] font-medium mb-2">
                Surname
              </label>
              <input
                type="text"
                id="surname"
                value={formData.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg 
                         text-[#e6f7ff] placeholder-[#7d8590] focus:outline-none focus:ring-2 
                         focus:ring-[#00e0ff] focus:border-[#00e0ff] transition-all"
                placeholder="Enter your surname"
                disabled={isLoading}
              />
              {errors.surname && (
                <p className="text-[#ff6b6b] text-sm mt-1">{errors.surname}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[#e6f7ff] font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg 
                         text-[#e6f7ff] placeholder-[#7d8590] focus:outline-none focus:ring-2 
                         focus:ring-[#00e0ff] focus:border-[#00e0ff] transition-all"
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-[#ff6b6b] text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#00e0ff] to-[#ff6bff] 
                       text-[#0d1117] font-bold rounded-lg hover:shadow-lg 
                       hover:shadow-[#00e0ff]/20 transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       animate-pulse hover:animate-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#0d1117] border-t-transparent 
                                rounded-full animate-spin mr-2"></div>
                  Entering...
                </div>
              ) : (
                'Enter My Productivity Hub'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[#7d8590] text-sm">
            ⚡️ Powered by Gen AI • Dark-Neon Edition
          </p>
        </div>
      </div>
    </div>
  );
};
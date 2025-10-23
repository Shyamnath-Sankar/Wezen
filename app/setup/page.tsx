'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('customer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/');
      return;
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (existingUser) {
      if (existingUser.role === 'customer') {
        router.push('/home');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const { error } = await supabase.from('users').insert({
        id: session.user.id,
        email: session.user.email,
        full_name: fullName,
        phone: phone,
        role: role,
        avatar_url: session.user.user_metadata.avatar_url,
      });

      if (error) throw error;

      if (role === 'customer') {
        router.push('/home');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error setting up profile:', error);
      alert('Error setting up profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-6">Complete Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <div className="space-y-3">
              {(['customer', 'vendor', 'shop', 'homemaker'] as UserRole[]).map((r) => (
                <label
                  key={r}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    role === r
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="ml-3 font-medium capitalize">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

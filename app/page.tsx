'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Store, TrendingUp, Users } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userData) {
        if (userData.role === 'customer') {
          router.push('/home');
        } else {
          router.push('/dashboard');
        }
        return;
      }
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-primary-600 to-blue-700">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-500 via-primary-600 to-blue-700">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl">
            <ShoppingBag className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
            Wezen
          </h1>
          <p className="text-xl text-blue-100 mb-2">Your Local Marketplace</p>
          <p className="text-sm text-blue-200">Discover & Shop Nearby</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-12 w-full max-w-lg">
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-2">
              <Store className="w-8 h-8 text-white mx-auto" />
            </div>
            <p className="text-xs text-white font-medium">Local Shops</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-2">
              <Users className="w-8 h-8 text-white mx-auto" />
            </div>
            <p className="text-xs text-white font-medium">Homemakers</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-2">
              <TrendingUp className="w-8 h-8 text-white mx-auto" />
            </div>
            <p className="text-xs text-white font-medium">Fresh Deals</p>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Sign in to start shopping
            </p>

            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-xl px-6 py-4 text-gray-700 font-semibold hover:bg-gray-50 hover:border-primary-500 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC04"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-sm text-blue-100">
          Connect with local vendors, shops, and homemakers in your area
        </p>
      </div>
    </div>
  );
}

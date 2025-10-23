'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { getUserLocation, Coordinates } from '@/lib/location';
import { Loader2, MapPin, Search, LogOut, ShoppingBag, Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const router = useRouter();

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const location = await getUserLocation();
      setUserLocation(location);
      await loadProducts(location);
    } catch (error) {
      console.error('Error initializing page:', error);
      alert('Please enable location access to see nearby products');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (location: Coordinates) => {
    try {
      const { data, error } = await supabase.rpc('get_nearby_products', {
        user_lat: location.latitude,
        user_lon: location.longitude,
        max_distance_km: 10,
      });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-primary-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-600">Loading nearby products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-blue-600 shadow-lg sticky top-0 z-50">
        <div className="px-4 py-4 safe-top">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                <ShoppingBag className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Wezen</h1>
                {userLocation && (
                  <div className="flex items-center gap-1 text-xs text-blue-100">
                    <MapPin className="w-3 h-3" />
                    <span>Within 10 km</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl shadow-md focus:ring-2 focus:ring-white/50 focus:outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Categories - Horizontal Scroll */}
      <div className="bg-white sticky top-[136px] md:top-[140px] z-40 border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <SlidersHorizontal className="w-5 h-5 text-gray-500 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                  category === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="px-3 py-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-center px-8">
              {searchQuery ? 'Try a different search term' : 'Check back later for new products'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

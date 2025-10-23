'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Product, Shop } from '@/lib/types';
import { Loader2, Plus, LogOut, TrendingUp, Eye, Package, Store } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [shop, setShop] = useState<Shop | null>(null);
  const [stats, setStats] = useState({
    totalVisits: 0,
    productVisits: 0,
    shopVisits: 0,
  });
  const router = useRouter();

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!userData || userData.role === 'customer') {
        router.push('/home');
        return;
      }

      setUser(userData);
      await loadProducts(userData.id);
      
      if (userData.role === 'shop') {
        await loadShop(userData.id);
      }

      await loadStats(userData.id, userData.role);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (userId: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    setProducts(data || []);
  };

  const loadShop = async (userId: string) => {
    const { data } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', userId)
      .single();

    setShop(data);
  };

  const loadStats = async (userId: string, role: string) => {
    if (role === 'shop') {
      const { data: shopData } = await supabase
        .from('shops')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (shopData) {
        const { count: shopVisits } = await supabase
          .from('visits')
          .select('*', { count: 'exact', head: true })
          .eq('visited_type', 'shop')
          .eq('visited_id', shopData.id);

        setStats(prev => ({ ...prev, shopVisits: shopVisits || 0 }));
      }
    }

    const { data: productIds } = await supabase
      .from('products')
      .select('id')
      .eq('seller_id', userId);

    if (productIds && productIds.length > 0) {
      const ids = productIds.map(p => p.id);
      const { count: productVisits } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .eq('visited_type', 'product')
        .in('visited_id', ids);

      const totalVisits = (stats.shopVisits || 0) + (productVisits || 0);
      setStats(prev => ({
        ...prev,
        productVisits: productVisits || 0,
        totalVisits,
      }));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-primary-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-blue-600 shadow-lg">
        <div className="px-4 py-5 safe-top">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-blue-100 capitalize flex items-center gap-2">
                <Store className="w-4 h-4" />
                {user?.role} Account
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
          <div className="bg-gradient-to-br from-blue-500 to-primary-600 rounded-2xl p-5 shadow-lg text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Total Visits</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalVisits}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 shadow-lg text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Products</span>
            </div>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>

          {user?.role === 'shop' && (
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 shadow-lg text-white col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Shop Visits</span>
              </div>
              <p className="text-3xl font-bold">{stats.shopVisits}</p>
            </div>
          )}
        </div>

        {/* Shop Setup Alert */}
        {user?.role === 'shop' && !shop && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 mb-5 shadow-lg text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Store className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Setup Your Shop</h3>
                <p className="text-sm text-white/90 mb-3">
                  Create your shop profile to attract more customers
                </p>
                <Link
                  href="/dashboard/shop/setup"
                  className="inline-block bg-white text-orange-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md"
                >
                  Create Shop Now
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-600" />
              My Products
            </h2>
            <Link
              href="/dashboard/products/add"
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-5">Start adding products to your inventory</p>
              <Link
                href="/dashboard/products/add"
                className="inline-block bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

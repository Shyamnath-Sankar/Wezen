'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shop, Product } from '@/lib/types';
import { Loader2, ArrowLeft, MapPin, Phone, Store as StoreIcon, Package } from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

export default function ShopPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadShop();
    trackVisit();
  }, [params.id]);

  const trackVisit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('visits').insert({
        visitor_id: session.user.id,
        visited_type: 'shop',
        visited_id: params.id,
      });
    }
  };

  const loadShop = async () => {
    try {
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('id', params.id)
        .single();

      if (shopError) throw shopError;
      setShop(shopData);

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', params.id)
        .eq('is_active', true);

      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading shop:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-600">Loading shop...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <StoreIcon className="w-20 h-20 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Shop not found</h2>
        <button
          onClick={() => router.back()}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center gap-3 safe-top">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Shop Details</h1>
        </div>
      </header>

      <main>
        {/* Shop Banner */}
        <div className="bg-white">
          {shop.image_url ? (
            <div className="relative h-56 md:h-72 bg-gradient-to-br from-primary-100 to-blue-100">
              <Image
                src={shop.image_url}
                alt={shop.shop_name}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="relative h-56 md:h-72 bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <StoreIcon className="w-12 h-12 text-primary-600" />
              </div>
            </div>
          )}

          {/* Shop Info */}
          <div className="px-4 py-5">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{shop.shop_name}</h2>

            {shop.description && (
              <p className="text-gray-700 mb-4 leading-relaxed">{shop.description}</p>
            )}

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-600" />
                <span className="flex-1">{shop.address}</span>
              </div>
              {shop.phone && (
                <a 
                  href={`tel:${shop.phone}`} 
                  className="flex items-center gap-3 text-primary-600 font-medium"
                >
                  <Phone className="w-5 h-5" />
                  {shop.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mt-2 bg-white px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-600" />
              Products ({products.length})
            </h3>
          </div>
          
          {products.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h4>
              <p className="text-gray-500">This shop hasn't listed any products</p>
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

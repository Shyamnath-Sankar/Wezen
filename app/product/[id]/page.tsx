'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Product, User } from '@/lib/types';
import { Loader2, ArrowLeft, MapPin, Phone, User as UserIcon, Share2, Heart, ShoppingCart, Store, Package } from 'lucide-react';
import Image from 'next/image';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadProduct();
    trackVisit();
  }, [params.id]);

  const trackVisit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('visits').insert({
        visitor_id: session.user.id,
        visited_type: 'product',
        visited_id: params.id,
      });
    }
  };

  const loadProduct = async () => {
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      const { data: sellerData } = await supabase
        .from('users')
        .select('*')
        .eq('id', productData.seller_id)
        .single();

      setSeller(sellerData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/');
      return;
    }

    alert('Order functionality will be implemented. Contact seller directly for now.');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Package className="w-20 h-20 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
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
        <div className="px-4 py-3 flex items-center justify-between safe-top">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Product Details</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="pb-28">
        {/* Image Gallery */}
        <div className="bg-white">
          <div className="relative aspect-square max-h-[500px] bg-gradient-to-br from-gray-100 to-gray-200">
            {product.image_urls && product.image_urls.length > 0 ? (
              <Image
                src={product.image_urls[currentImageIndex]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {product.image_urls && product.image_urls.length > 1 && (
            <div className="px-4 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
              {product.image_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-200'
                  }`}
                >
                  <Image src={url} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-white mt-2 px-4 py-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full capitalize">
                  {product.category}
                </span>
                {product.stock_quantity !== null && (
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.stock_quantity > 0 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-3xl font-bold text-gray-900">₹{Math.floor(product.price)}</span>
            {product.price % 1 !== 0 && (
              <span className="text-xl text-gray-600">.{(product.price % 1).toFixed(2).slice(2)}</span>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>

        {/* Seller Info */}
        {seller && (
          <div className="bg-white mt-2 px-4 py-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Seller Information</h3>
            <div className="flex items-center gap-4">
              {seller.avatar_url ? (
                <Image
                  src={seller.avatar_url}
                  alt={seller.full_name || 'Seller'}
                  width={56}
                  height={56}
                  className="rounded-full ring-2 ring-gray-100"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center ring-2 ring-gray-100">
                  <UserIcon className="w-7 h-7 text-primary-600" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{seller.full_name}</p>
                <p className="text-sm text-gray-600 capitalize mb-1">{seller.role}</p>
                {seller.phone && (
                  <a href={`tel:${seller.phone}`} className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                    <Phone className="w-4 h-4" />
                    {seller.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 safe-bottom shadow-2xl">
        <button
          onClick={handleOrder}
          className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Contact Seller
        </button>
      </div>
    </div>
  );
}

'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Store } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 active:scale-95"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
        {product.image_urls && product.image_urls.length > 0 ? (
          <Image
            src={product.image_urls[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-gray-300" />
            </div>
          </div>
        )}
        {product.distance_km && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {product.distance_km.toFixed(1)} km
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-baseline justify-between mt-2">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toFixed(0)}
            </span>
            {product.price % 1 !== 0 && (
              <span className="text-sm text-gray-600">.{(product.price % 1).toFixed(2).slice(2)}</span>
            )}
          </div>
          {product.stock_quantity !== null && product.stock_quantity > 0 && (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          )}
        </div>

        {product.seller_type === 'shop' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/shop/${product.shop_id}`);
            }}
            className="mt-2 w-full text-xs text-primary-600 font-medium py-1.5 px-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Store className="w-3 h-3" />
            Visit Shop
          </button>
        )}
      </div>
    </div>
  );
}

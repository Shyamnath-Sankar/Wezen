'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getUserLocation } from '@/lib/location';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';

export default function ShopSetupPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    description: '',
    address: '',
    phone: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (userId: string): Promise<string | null> => {
    if (!image) return null;

    const fileExt = image.name.split('.').pop();
    const fileName = `shops/${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, image);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
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

      const location = await getUserLocation();
      const imageUrl = await uploadImage(session.user.id);

      const { error } = await supabase.from('shops').insert({
        user_id: session.user.id,
        shop_name: formData.shopName,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        location: `POINT(${location.longitude} ${location.latitude})`,
        image_url: imageUrl,
        is_active: true,
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating shop:', error);
      alert('Error creating shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center gap-4 safe-top">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Setup Your Shop</h1>
        </div>
      </header>

      <main className="px-4 py-5 pb-safe">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
          {/* Shop Name */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Shop Name *
            </label>
            <input
              type="text"
              required
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="e.g., Fresh Foods Mart"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
              placeholder="Tell customers about your shop..."
            />
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Address *
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
              placeholder="Enter your shop address"
            />
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="Enter contact number"
            />
          </div>

          {/* Shop Image */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Shop Image
            </label>
            {imagePreview ? (
              <div className="relative w-full h-56 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm mb-3">
                <img src={imagePreview} alt="Shop preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview('');
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Upload shop image</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating shop...
              </>
            ) : (
              'Create Shop'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

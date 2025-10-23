'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getUserLocation } from '@/lib/location';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [shopId, setShopId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/');
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userData) {
      setUserRole(userData.role);

      if (userData.role === 'shop') {
        const { data: shopData } = await supabase
          .from('shops')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        setShopId(shopData?.id || null);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async (userId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
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

      setUploading(true);
      const imageUrls = await uploadImages(session.user.id);
      setUploading(false);

      const { error } = await supabase.from('products').insert({
        seller_id: session.user.id,
        seller_type: userRole,
        shop_id: shopId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_urls: imageUrls,
        stock_quantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : null,
        location: `POINT(${location.longitude} ${location.latitude})`,
        is_active: true,
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
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
          <h1 className="text-lg font-semibold text-gray-900">Add Product</h1>
        </div>
      </header>

      <main className="px-4 py-5 pb-safe">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
          {/* Product Name */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="e.g., Fresh Mango Juice"
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
              placeholder="Tell customers about your product..."
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="0.00"
              />
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            >
              <option value="">Select a category</option>
              <option value="food">Food</option>
              <option value="beverages">Beverages</option>
              <option value="groceries">Groceries</option>
              <option value="bakery">Bakery</option>
              <option value="snacks">Snacks</option>
              <option value="homemade">Homemade</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Product Images (Max 5)
            </label>
            <div className="space-y-4">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all active:scale-90"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Upload images</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95"
          >
            {loading || uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {uploading ? 'Uploading images...' : 'Adding product...'}
              </>
            ) : (
              'Add Product'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

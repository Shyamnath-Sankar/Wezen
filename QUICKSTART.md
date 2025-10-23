# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Your Supabase Credentials

You mentioned you'll provide Supabase credentials. Once you have them:

1. Open `.env.local` file
2. Replace the placeholders:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

### 3. Setup Database

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy everything from `supabase-schema.sql`
4. Paste and run it in SQL Editor

### 4. Create Storage Bucket

1. In Supabase Dashboard → Storage
2. Create new bucket: `product-images`
3. Make it **public**
4. Run these policies in SQL Editor:

```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND auth.uid() = owner);
```

### 5. Setup Google OAuth

1. Get your Supabase callback URL from: Settings → API → Project URL
   - It will be: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

2. In Supabase Dashboard:
   - Authentication → Providers → Google
   - Enable it
   - Add your Google OAuth credentials

3. In Google Cloud Console:
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

### 6. Run the App

```bash
npm run dev
```

Open http://localhost:3000

## ✅ Testing

1. **Sign In**: Click "Sign in with Google"
2. **Setup Profile**: Choose your role (Customer/Vendor/Shop/Homemaker)
3. **Grant Location**: Allow location access when prompted
4. **Test Features**:
   - As Customer: Browse products
   - As Vendor/Shop/Homemaker: Access dashboard, add products

## 📱 Mobile Testing

Test on mobile by:
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open `http://YOUR-IP:3000` on your phone
3. Make sure phone is on same network

## 🐛 Troubleshooting

**Can't sign in?**
- Check Google OAuth is configured correctly
- Verify redirect URL matches exactly

**No products showing?**
- Allow location permission in browser
- Check PostGIS extension is enabled: `CREATE EXTENSION IF NOT EXISTS postgis;`

**Images not uploading?**
- Verify storage bucket `product-images` exists and is public
- Check storage policies are set correctly

## 📦 What's Included

- ✅ Google Authentication
- ✅ 4 User Types (Customer, Vendor, Shop, Homemaker)
- ✅ Location-based product discovery (10km radius)
- ✅ Product listings with images
- ✅ Shop pages for shop owners
- ✅ Visit tracking dashboard
- ✅ Mobile-optimized design
- ✅ Image upload to Supabase Storage

## 🎯 Next Steps After Setup

1. **Add Test Data**: Create a shop and add some products
2. **Test Different Roles**: Sign in with different Google accounts
3. **Check Mobile**: Test on actual mobile device
4. **Review Analytics**: Check visit counts in dashboard

## 📚 Full Documentation

- See `README.md` for complete feature list
- See `SETUP_GUIDE.md` for detailed setup instructions
- See `supabase-schema.sql` for database structure

## 💡 Tips

- Use Chrome DevTools mobile view for testing
- PostGIS queries work best with indexed location data
- Images are automatically optimized by Next.js
- All pages are server-side rendered for better SEO

Enjoy building with Wezen! 🎉

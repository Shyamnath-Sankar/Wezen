# Wezen Setup Guide

Complete step-by-step guide to set up Wezen marketplace.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Google Cloud Platform account (for OAuth)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd wezen
npm install
```

### Step 2: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - Project name: `wezen`
   - Database password: (generate strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### Step 3: Setup Google OAuth

#### 3.1 Create Google OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: Wezen
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
6. Application type: Web application
7. Name: Wezen Auth
8. Authorized redirect URIs: Add your Supabase callback URL:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   (Get YOUR-PROJECT-REF from Supabase Dashboard > Settings > API > Project URL)
9. Click "Create"
10. Copy the Client ID and Client Secret

#### 3.2 Configure Google OAuth in Supabase

1. In Supabase Dashboard, go to "Authentication" > "Providers"
2. Find "Google" and enable it
3. Paste:
   - Client ID: (from Google Console)
   - Client Secret: (from Google Console)
4. Click "Save"

### Step 4: Setup Database

#### 4.1 Enable PostGIS Extension

1. In Supabase Dashboard, go to "SQL Editor"
2. Click "New Query"
3. Run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

#### 4.2 Run Schema Migration

1. Open `supabase-schema.sql` file
2. Copy all contents
3. In Supabase SQL Editor, paste and run the entire script
4. Verify all tables are created in "Database" > "Tables"

### Step 5: Setup Storage

#### 5.1 Create Storage Bucket

1. Go to "Storage" in Supabase Dashboard
2. Click "Create a new bucket"
3. Bucket name: `product-images`
4. Public bucket: **Yes** (toggle on)
5. File size limit: `5242880` (5MB)
6. Allowed MIME types: `image/jpeg,image/png,image/webp`
7. Click "Create bucket"

#### 5.2 Configure Storage Policies

1. Click on `product-images` bucket
2. Go to "Policies" tab
3. Click "New Policy" > "For full customization"
4. Add these three policies:

**Policy 1: Upload Images**
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

**Policy 2: View Images**
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

**Policy 3: Delete Images**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid() = owner);
```

### Step 6: Configure Environment Variables

1. In Supabase Dashboard, go to "Settings" > "API"
2. Copy:
   - Project URL
   - anon/public key

3. Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 7: Test the Application

1. Start development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Test the flow:
   - Click "Sign in with Google"
   - Authorize the application
   - Complete profile setup
   - Select a role (Customer, Vendor, Shop, or Homemaker)

### Step 8: Configure Redirect URLs for Production

When deploying to production:

1. In Google Cloud Console:
   - Add production URL to Authorized redirect URIs:
     ```
     https://your-domain.com/auth/callback
     ```

2. In Supabase Dashboard > Authentication > URL Configuration:
   - Add production site URL
   - Add redirect URLs

## Testing Checklist

- [ ] Google sign-in works
- [ ] Profile setup page loads
- [ ] Location permission is requested
- [ ] Customer can view nearby products
- [ ] Vendors/Shops/Homemakers can access dashboard
- [ ] Products can be added with images
- [ ] Shop owners can create shop page
- [ ] Visit tracking works
- [ ] Product detail page displays correctly
- [ ] Shop detail page displays correctly

## Common Issues

### Issue: "Invalid redirect URL"
**Solution**: Check that callback URL in Google Console matches Supabase project URL exactly

### Issue: "PostGIS functions not found"
**Solution**: Run `CREATE EXTENSION IF NOT EXISTS postgis;` in SQL Editor

### Issue: "Images not uploading"
**Solution**: Verify storage bucket is public and policies are correctly set

### Issue: "Location permission denied"
**Solution**: Enable location in browser settings and use HTTPS in production

### Issue: "Products not showing"
**Solution**: Check that location is being captured and PostGIS functions are working

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Environment Configuration

- Update Google OAuth redirect URLs
- Update Supabase redirect URLs
- Enable HTTPS for location services
- Configure domain in Supabase

## Security Checklist

- [ ] Row Level Security enabled on all tables
- [ ] Storage policies configured
- [ ] Environment variables not committed to Git
- [ ] HTTPS enabled in production
- [ ] OAuth redirect URLs properly configured
- [ ] API keys kept secure

## Next Steps

1. Add custom domain
2. Set up email notifications
3. Implement order management
4. Add payment gateway
5. Enable push notifications
6. Add analytics tracking

## Support

For issues:
1. Check console for errors
2. Verify Supabase connection
3. Check browser permissions
4. Review Supabase logs

## Monitoring

Monitor in Supabase Dashboard:
- Database queries in "SQL Editor" > "Query Performance"
- Storage usage in "Storage"
- Auth events in "Authentication" > "Users"
- API usage in "Settings" > "API"

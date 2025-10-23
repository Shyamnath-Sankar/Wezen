# Wezen - Local Store Marketplace

A mobile-optimized marketplace connecting customers with local vendors, shops, and homemakers within a 10km radius.

## Features

### User Types

1. **Vendors** - Mobile sellers who list products directly without a dedicated shop page
2. **Shops** - Businesses with dedicated shop pages and product listings
3. **Homemakers** - Home-based sellers with self-delivery options
4. **Customers** - Users who browse and purchase products using Google authentication

### Key Features

- **Location-Based Discovery**: Products displayed within 10km radius using PostGIS
- **Google Authentication**: Secure login via Supabase Auth
- **Dashboard Analytics**: Visit count tracking for shops and homemakers
- **Mobile-First Design**: Fully optimized for mobile users
- **Image Storage**: Product and shop images via Supabase Storage
- **Separate Shop Pages**: Shops have dedicated pages showing all their products

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL with PostGIS)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth (Google OAuth)
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

#### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

#### 2.2 Enable Google Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`

#### 2.3 Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL commands

#### 2.4 Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Create a new bucket named `product-images`
3. Make it **public**
4. Set file size limit to **5MB**
5. In **Policies**, add these policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow public read access
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid() = owner);
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from:
- Supabase Dashboard > **Settings** > **API**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
wezen/
├── app/
│   ├── auth/callback/       # OAuth callback handler
│   ├── dashboard/           # Seller dashboard
│   │   ├── products/add/    # Add product page
│   │   └── shop/setup/      # Shop setup page
│   ├── home/                # Customer home page
│   ├── product/[id]/        # Product detail page
│   ├── setup/               # User profile setup
│   ├── shop/[id]/           # Shop detail page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Login page
│   └── globals.css          # Global styles
├── components/
│   ├── ProductCard.tsx      # Product card component
│   └── ui/                  # UI components
├── lib/
│   ├── location.ts          # Location utilities
│   ├── supabase.ts          # Supabase client
│   └── types.ts             # TypeScript types
├── public/                  # Static assets
├── supabase-schema.sql      # Database schema
├── .env.example             # Environment variables template
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

## Database Schema

### Tables

- **users** - User profiles extending Supabase auth
- **shops** - Shop information for shop owners
- **products** - Product listings from all seller types
- **delivery_options** - Delivery settings for homemakers
- **orders** - Order records
- **visits** - Visit tracking for analytics

### Functions

- `get_nearby_products(lat, lon, distance)` - Get products within radius
- `get_nearby_shops(lat, lon, distance)` - Get shops within radius

## User Flow

### Customer Flow

1. Sign in with Google
2. Complete profile setup
3. Grant location permission
4. Browse products within 10km
5. View product details
6. Visit shop pages (for shop products)
7. Contact sellers

### Seller Flow (Vendor/Shop/Homemaker)

1. Sign in with Google
2. Complete profile setup (select role)
3. **(Shop only)** Setup shop profile
4. Add products
5. View dashboard analytics
6. Track visits and engagement

## Mobile Optimization

- Responsive grid layouts (2 columns on mobile, 4 on desktop)
- Touch-friendly buttons and inputs
- Optimized images with Next.js Image
- Sticky headers for easy navigation
- Bottom fixed action buttons
- Smooth scrolling and transitions

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only manage their own content
- Public read access for active listings
- Authenticated uploads to storage
- OAuth-based authentication

## Future Enhancements

- Real-time order management
- In-app messaging between buyers and sellers
- Payment integration
- Rating and review system
- Push notifications
- Advanced search and filters
- Multi-language support

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
# Wezen

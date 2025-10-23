# Wezen User Flows

## 🔄 Complete User Journey Maps

### 1. Customer Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        CUSTOMER FLOW                             │
└─────────────────────────────────────────────────────────────────┘

START → Landing Page (/)
         │
         ├─→ Click "Sign in with Google"
         │
         ├─→ Google OAuth Screen
         │    └─→ Authorize App
         │
         ├─→ First Time User?
         │    │
         │    YES → Profile Setup (/setup)
         │           │
         │           ├─→ Enter Name
         │           ├─→ Enter Phone
         │           └─→ Select Role: "Customer"
         │
         ├─→ Home Page (/home)
         │    │
         │    ├─→ Grant Location Permission
         │    │    └─→ Browser asks for location
         │    │         └─→ Allow
         │    │
         │    ├─→ View Products (within 10km)
         │    │    │
         │    │    ├─→ Search by name
         │    │    ├─→ Filter by category
         │    │    └─→ See distance to each product
         │    │
         │    └─→ Click on Product
         │         │
         │         └─→ Product Detail (/product/[id])
         │              │
         │              ├─→ View Images (swipe gallery)
         │              ├─→ Read Description
         │              ├─→ See Price
         │              ├─→ View Seller Info
         │              │    ├─→ Name
         │              │    ├─→ Phone
         │              │    └─→ Type (vendor/shop/homemaker)
         │              │
         │              ├─→ For Shop Products:
         │              │    └─→ "Visit Shop" button
         │              │         └─→ Shop Page (/shop/[id])
         │              │              │
         │              │              ├─→ View Shop Details
         │              │              ├─→ See All Products
         │              │              └─→ Contact Info
         │              │
         │              └─→ "Contact Seller" button
         │                   └─→ Call/Message seller
         │
         └─→ Logout
              └─→ Back to Landing Page
```

### 2. Vendor Journey (Mobile Seller)

```
┌─────────────────────────────────────────────────────────────────┐
│                        VENDOR FLOW                               │
└─────────────────────────────────────────────────────────────────┘

START → Landing Page (/)
         │
         ├─→ Sign in with Google
         │
         ├─→ Profile Setup (/setup)
         │    │
         │    ├─→ Enter Name
         │    ├─→ Enter Phone
         │    └─→ Select Role: "Vendor"
         │
         ├─→ Dashboard (/dashboard)
         │    │
         │    ├─→ View Stats:
         │    │    ├─→ Total Visits
         │    │    ├─→ Product Count
         │    │    └─→ Product Visits
         │    │
         │    ├─→ Click "Add Product"
         │    │    │
         │    │    └─→ Add Product Page (/dashboard/products/add)
         │    │         │
         │    │         ├─→ Enter Product Name *
         │    │         ├─→ Enter Description
         │    │         ├─→ Enter Price *
         │    │         ├─→ Enter Stock Quantity
         │    │         ├─→ Select Category *
         │    │         ├─→ Upload Images (up to 5)
         │    │         │    ├─→ Select files
         │    │         │    ├─→ Preview images
         │    │         │    └─→ Remove if needed
         │    │         │
         │    │         ├─→ Grant Location Permission
         │    │         │    └─→ Captures current location
         │    │         │
         │    │         └─→ Submit
         │    │              └─→ Back to Dashboard
         │    │
         │    └─→ View My Products
         │         └─→ Grid of product cards
         │
         └─→ Logout
```

### 3. Shop Owner Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                         SHOP FLOW                                │
└─────────────────────────────────────────────────────────────────┘

START → Landing Page (/)
         │
         ├─→ Sign in with Google
         │
         ├─→ Profile Setup (/setup)
         │    │
         │    ├─→ Enter Name
         │    ├─→ Enter Phone
         │    └─→ Select Role: "Shop"
         │
         ├─→ Dashboard (/dashboard)
         │    │
         │    ├─→ No Shop Yet?
         │    │    │
         │    │    └─→ Yellow Banner: "Setup Your Shop"
         │    │         │
         │    │         └─→ Shop Setup (/dashboard/shop/setup)
         │    │              │
         │    │              ├─→ Enter Shop Name *
         │    │              ├─→ Enter Description
         │    │              ├─→ Enter Address *
         │    │              ├─→ Enter Phone *
         │    │              ├─→ Upload Shop Image
         │    │              ├─→ Grant Location Permission
         │    │              └─→ Submit
         │    │                   └─→ Back to Dashboard
         │    │
         │    ├─→ View Stats:
         │    │    ├─→ Total Visits
         │    │    ├─→ Product Count
         │    │    ├─→ Shop Visits
         │    │    └─→ Product Visits
         │    │
         │    ├─→ Click "Add Product"
         │    │    │
         │    │    └─→ Add Product Page
         │    │         │
         │    │         ├─→ Product Name *
         │    │         ├─→ Description
         │    │         ├─→ Price *
         │    │         ├─→ Stock Quantity
         │    │         ├─→ Category *
         │    │         ├─→ Upload Images
         │    │         ├─→ Auto-links to Shop
         │    │         └─→ Submit
         │    │
         │    └─→ View My Products
         │         │
         │         └─→ Each product shows "Visit Shop" link
         │              └─→ Links to Shop Page
         │
         └─→ Customers Can Visit:
              │
              └─→ Shop Page (/shop/[shop-id])
                   │
                   ├─→ Shop Banner Image
                   ├─→ Shop Name & Description
                   ├─→ Address & Phone
                   └─→ All Shop Products Grid
```

### 4. Homemaker Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      HOMEMAKER FLOW                              │
└─────────────────────────────────────────────────────────────────┘

START → Landing Page (/)
         │
         ├─→ Sign in with Google
         │
         ├─→ Profile Setup (/setup)
         │    │
         │    ├─→ Enter Name
         │    ├─→ Enter Phone
         │    └─→ Select Role: "Homemaker"
         │
         ├─→ Dashboard (/dashboard)
         │    │
         │    ├─→ View Stats:
         │    │    ├─→ Total Visits
         │    │    ├─→ Product Count
         │    │    └─→ Product Visits
         │    │
         │    ├─→ Click "Add Product"
         │    │    │
         │    │    └─→ Add Product Page
         │    │         │
         │    │         ├─→ Product Details
         │    │         │    ├─→ Name *
         │    │         │    ├─→ Description
         │    │         │    ├─→ Price *
         │    │         │    ├─→ Category *
         │    │         │    └─→ Images
         │    │         │
         │    │         ├─→ Delivery Options (Optional)
         │    │         │    ├─→ Max Delivery Distance
         │    │         │    ├─→ Delivery Fee
         │    │         │    └─→ Estimated Time
         │    │         │
         │    │         └─→ Submit
         │    │
         │    └─→ View My Products
         │         └─→ Shows "Self-Delivery Available"
         │
         └─→ Customers See:
              └─→ Product with delivery badge
                   └─→ "Homemaker - Self Delivery"
```

## 🔄 Cross-Role Interactions

### Product Discovery Flow

```
Customer Location (10km radius)
         │
         ├─→ PostGIS Query
         │    └─→ ST_DWithin(location, user_location, 10000)
         │
         ├─→ Returns Products:
         │    │
         │    ├─→ Vendor Products (no shop link)
         │    ├─→ Shop Products (with "Visit Shop")
         │    └─→ Homemaker Products (with delivery icon)
         │
         └─→ Sorted by Distance
              └─→ Displayed in Grid (2 cols mobile, 4 desktop)
```

### Visit Tracking Flow

```
User Visits Product/Shop
         │
         ├─→ Track Visit in Database
         │    │
         │    ├─→ visitor_id (if logged in)
         │    ├─→ visited_type ('product' or 'shop')
         │    ├─→ visited_id (product/shop ID)
         │    └─→ timestamp
         │
         └─→ Dashboard Updates
              │
              ├─→ Seller sees increment
              └─→ Real-time (on page refresh)
```

## 📱 Mobile-Specific Flows

### Location Permission Flow

```
App Needs Location
         │
         ├─→ navigator.geolocation.getCurrentPosition()
         │
         ├─→ Browser Shows Permission Dialog
         │    │
         │    ├─→ User Clicks "Allow"
         │    │    └─→ Location Captured
         │    │         └─→ Products Load
         │    │
         │    └─→ User Clicks "Block"
         │         └─→ Error Message
         │              └─→ "Please enable location"
         │
         └─→ HTTPS Required in Production
```

### Image Upload Flow (Mobile)

```
User Clicks "Upload Images"
         │
         ├─→ Mobile Photo Picker Opens
         │    │
         │    ├─→ Camera
         │    └─→ Gallery
         │
         ├─→ User Selects Image(s)
         │
         ├─→ Preview Shown
         │    └─→ Can remove before upload
         │
         ├─→ On Submit:
         │    │
         │    ├─→ Compress if needed
         │    ├─→ Upload to Supabase Storage
         │    └─→ Get Public URL
         │
         └─→ URLs Saved to Database
```

## 🎯 Key Decision Points

### Role Selection Impact

```
User Selects Role at Setup
         │
         ├─→ "Customer"
         │    └─→ Redirects to /home
         │         └─→ Browse products
         │
         ├─→ "Vendor"
         │    └─→ Redirects to /dashboard
         │         └─→ No shop page option
         │
         ├─→ "Shop"
         │    └─→ Redirects to /dashboard
         │         └─→ Shop setup prompt
         │         └─→ Products link to shop
         │
         └─→ "Homemaker"
              └─→ Redirects to /dashboard
                   └─→ Delivery options available
```

### Shop vs No Shop Flow

```
Product Listing
         │
         ├─→ Has shop_id?
         │    │
         │    YES → Shows "Visit Shop" button
         │    │      └─→ Links to /shop/[id]
         │    │
         │    NO → No shop link
         │         └─→ Direct seller contact only
         │
         └─→ Seller Type Badge
              ├─→ "Vendor" (no shop)
              ├─→ "Shop" (has shop page)
              └─→ "Homemaker" (delivery options)
```

## 📊 State Management

### Authentication States

```
Not Authenticated
    ↓
Landing Page (/)
    ↓
Google OAuth
    ↓
Authenticated
    ↓
Has Profile? ──NO──→ Setup Page (/setup)
    │                      ↓
   YES                 Complete Profile
    │                      ↓
    ↓                      ↓
Check Role ←───────────────┘
    │
    ├─→ Customer → /home
    └─→ Other → /dashboard
```

## 🔍 Search & Filter Flow

```
Customer on Home Page
         │
         ├─→ Search Bar
         │    └─→ Type query
         │         └─→ Filter products by name/description
         │
         ├─→ Category Tabs
         │    └─→ Click category
         │         └─→ Filter products by category
         │
         └─→ Both Combined
              └─→ Search + Category filter
                   └─→ Real-time results
```

## 🎨 UI State Flows

### Loading States

```
Page Load
    ↓
Show Loader (Spinner)
    ↓
Fetch Data
    ↓
Data Loaded? ──NO──→ Show Error
    │                     ↓
   YES                Retry Option
    ↓
Hide Loader
    ↓
Show Content
```

### Form Submission

```
User Fills Form
    ↓
Click Submit
    ↓
Validate Fields ──FAIL──→ Show Errors
    │                          ↓
   PASS                   Keep Form Open
    ↓
Show Loading
    ↓
Upload Images (if any)
    ↓
Save to Database
    ↓
Success? ──NO──→ Show Error Alert
    │                  ↓
   YES             Stay on Page
    ↓
Redirect to Dashboard
```

---

## 💡 Tips for Developers

1. **Follow the flows** when implementing features
2. **Test each path** including error states
3. **Consider mobile UX** at every step
4. **Handle permissions** gracefully
5. **Provide clear feedback** at each stage
6. **Test offline scenarios**
7. **Validate at each step**

These flows represent the complete user experience in Wezen!

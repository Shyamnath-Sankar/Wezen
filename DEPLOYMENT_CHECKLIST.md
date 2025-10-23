# Wezen Deployment Checklist

## 📋 Pre-Deployment Setup

### ✅ Step 1: Install Dependencies
```bash
npm install
```
- [ ] All dependencies installed without errors
- [ ] No vulnerability warnings

### ✅ Step 2: Supabase Configuration

#### Database Setup
- [ ] Supabase project created
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] PostGIS extension enabled
- [ ] Schema from `supabase-schema.sql` executed successfully
- [ ] All tables created (users, shops, products, delivery_options, orders, visits)
- [ ] All functions created (get_nearby_products, get_nearby_shops)
- [ ] All policies created
- [ ] All triggers created

#### Storage Setup
- [ ] Storage bucket `product-images` created
- [ ] Bucket set to public
- [ ] Upload policy created
- [ ] View policy created
- [ ] Delete policy created
- [ ] File size limit set to 5MB
- [ ] MIME types configured (image/jpeg, image/png, image/webp)

#### Authentication Setup
- [ ] Google OAuth configured in Supabase
- [ ] Google OAuth credentials added
- [ ] Redirect URL configured
- [ ] Test authentication works

### ✅ Step 3: Google OAuth Configuration

- [ ] Google Cloud Project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Authorized redirect URI added: `https://[PROJECT-REF].supabase.co/auth/v1/callback`
- [ ] Client ID copied
- [ ] Client Secret copied

### ✅ Step 4: Environment Variables

- [ ] `.env.local` file created
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set correctly
- [ ] Environment variables verified

### ✅ Step 5: Local Testing

#### Build Test
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors

#### Development Server Test
```bash
npm run dev
```
- [ ] Server starts on http://localhost:3000
- [ ] Login page loads
- [ ] Google sign-in button appears

#### Feature Testing
- [ ] Google authentication works
- [ ] Profile setup page accessible
- [ ] Can select user role
- [ ] Location permission requested
- [ ] Customer home page loads
- [ ] Products displayed (if any exist)
- [ ] Dashboard accessible for sellers
- [ ] Can add products
- [ ] Images upload successfully
- [ ] Shop setup works (for shop users)
- [ ] Product detail page works
- [ ] Shop detail page works
- [ ] Visit tracking increments

#### Mobile Testing
- [ ] Tested in Chrome DevTools mobile view
- [ ] Tested on actual mobile device (Android/iOS)
- [ ] All buttons touch-friendly
- [ ] Forms work on mobile
- [ ] Images load properly
- [ ] Navigation works

## 🚀 Production Deployment

### Option 1: Vercel Deployment

#### Prepare for Vercel
- [ ] Code pushed to GitHub
- [ ] Repository is public or Vercel has access

#### Deploy to Vercel
1. [ ] Import project in Vercel
2. [ ] Framework preset: Next.js detected
3. [ ] Root directory: `./`
4. [ ] Build command: `npm run build`
5. [ ] Output directory: `.next`

#### Configure Environment Variables
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Variables added to all environments

#### Update OAuth Redirect URLs
- [ ] Get Vercel production URL
- [ ] Add to Google OAuth: `https://your-domain.vercel.app/auth/callback`
- [ ] Add to Supabase Auth: `https://your-domain.vercel.app`

#### Deploy
- [ ] Deploy button clicked
- [ ] Build successful
- [ ] Deployment successful
- [ ] Site URL accessible

### Option 2: Other Hosting

#### General Steps
- [ ] Build the project: `npm run build`
- [ ] Configure environment variables on host
- [ ] Update OAuth redirect URLs
- [ ] Deploy built files
- [ ] Verify deployment

## 🔒 Security Checklist

### Database Security
- [ ] RLS enabled on all tables
- [ ] Policies tested and working
- [ ] No sensitive data exposed
- [ ] Test with different user roles

### Authentication Security
- [ ] OAuth redirect URLs verified
- [ ] No API keys in source code
- [ ] Environment variables secure
- [ ] Session management working

### Storage Security
- [ ] Bucket policies correct
- [ ] File upload size limits enforced
- [ ] MIME types restricted
- [ ] Public access only for intended files

### General Security
- [ ] HTTPS enabled in production
- [ ] No console.log with sensitive data
- [ ] Error messages don't expose internals
- [ ] CORS properly configured

## 📱 Post-Deployment Testing

### Functional Testing
- [ ] Sign in with Google works
- [ ] Profile creation works
- [ ] Location permission works
- [ ] Products load correctly
- [ ] Images display properly
- [ ] Dashboard accessible
- [ ] Can add products
- [ ] Can create shop (shop users)
- [ ] Visit tracking works
- [ ] All navigation works

### Performance Testing
- [ ] Page load times acceptable
- [ ] Images load quickly
- [ ] No console errors
- [ ] Mobile performance good
- [ ] Location queries fast

### Cross-Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Edge

### Device Testing
- [ ] Desktop (various screen sizes)
- [ ] Tablet
- [ ] Mobile (iOS)
- [ ] Mobile (Android)

## 🔍 Monitoring Setup

### Supabase Monitoring
- [ ] Check Database health
- [ ] Monitor API usage
- [ ] Review auth logs
- [ ] Check storage usage

### Application Monitoring
- [ ] Setup error tracking (optional: Sentry)
- [ ] Monitor performance (optional: Vercel Analytics)
- [ ] Track user activity
- [ ] Monitor API responses

## 📊 Analytics Setup (Optional)

- [ ] Google Analytics configured
- [ ] Custom events tracked
- [ ] Conversion tracking setup
- [ ] User flow monitoring

## 📝 Documentation

- [ ] README.md updated with production URLs
- [ ] Setup guide verified
- [ ] API documentation (if applicable)
- [ ] User guide created (optional)

## 🎓 Training & Handoff

### For Administrators
- [ ] How to add users manually
- [ ] How to manage products
- [ ] How to moderate content
- [ ] How to read analytics

### For Users
- [ ] User guide provided
- [ ] Demo video created (optional)
- [ ] FAQ document created
- [ ] Support contact provided

## 🐛 Troubleshooting Guide

### Common Issues

**Issue: Can't sign in**
- [ ] Check Google OAuth configuration
- [ ] Verify redirect URLs match exactly
- [ ] Check Supabase auth logs

**Issue: Location not working**
- [ ] Ensure HTTPS in production
- [ ] Check browser permissions
- [ ] Verify PostGIS enabled

**Issue: Images not uploading**
- [ ] Check storage bucket exists
- [ ] Verify bucket is public
- [ ] Check storage policies
- [ ] Review file size limits

**Issue: No products showing**
- [ ] Check location permission granted
- [ ] Verify PostGIS functions work
- [ ] Check product data exists
- [ ] Review console for errors

## 🎉 Launch Checklist

### Pre-Launch
- [ ] All features tested
- [ ] Mobile experience verified
- [ ] Security reviewed
- [ ] Performance optimized
- [ ] Documentation complete

### Launch Day
- [ ] Final build deployed
- [ ] All URLs updated
- [ ] Monitoring active
- [ ] Support ready
- [ ] Announcement prepared

### Post-Launch
- [ ] Monitor for errors
- [ ] Gather user feedback
- [ ] Track analytics
- [ ] Plan updates

## 📞 Support Information

### Technical Support
- Supabase Dashboard: https://app.supabase.com
- Vercel Dashboard: https://vercel.com/dashboard
- Google Cloud Console: https://console.cloud.google.com

### Getting Help
- Check documentation files
- Review Supabase logs
- Check browser console
- Review GitHub issues (if applicable)

## ✅ Final Sign-Off

- [ ] All checklist items completed
- [ ] Production environment tested
- [ ] Team trained
- [ ] Documentation provided
- [ ] Monitoring configured
- [ ] Ready for users

---

## 🎊 Congratulations!

Your Wezen marketplace is now live and ready to connect local vendors with customers!

**Next Steps:**
1. Add initial product data
2. Invite beta users
3. Gather feedback
4. Plan feature updates
5. Scale as needed

**Remember:**
- Monitor regularly
- Update dependencies
- Backup database
- Listen to user feedback
- Keep security updated

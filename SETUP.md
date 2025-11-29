# ModelPro Website - Quick Start Guide

## 🎯 Complete Installation Steps

### 1. Environment Setup

1. Copy the environment example file:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your values:
   - Set your MongoDB connection string
   - Generate and add NEXTAUTH_SECRET
   - Set NEXTAUTH_URL (use http://localhost:3000 for development)

To generate NEXTAUTH_SECRET:

```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

### 4. Create Admin Account

**Option A: Using cURL (Mac/Linux/Git Bash)**

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"YourSecurePassword123"}'
```

**Option B: Using PowerShell (Windows)**

```powershell
$body = @{
    username = "admin"
    email = "admin@example.com"
    password = "YourSecurePassword123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/register" -Method POST -Body $body -ContentType "application/json"
```

**Option C: Using Postman or Insomnia**

- URL: `POST http://localhost:3000/api/admin/register`
- Headers: `Content-Type: application/json`
- Body (JSON):

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "YourSecurePassword123"
}
```

### 5. Login to Admin Dashboard

1. Navigate to: http://localhost:3000/admin/login
2. Use your admin email and password
3. You'll be redirected to the dashboard

### 6. Add Your First Service

1. Go to Dashboard or click "Add Service"
2. Fill in the service details:
   - Name: e.g., "Fashion Photoshoot"
   - Description: Brief overview
   - Price: e.g., 500
   - Images: Add image URLs (one per line)
   - Details: Full service description
3. Click "Create Service"

## 📝 MongoDB Setup Options

### Option A: Local MongoDB

1. Download and install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/modelsite`

### Option B: MongoDB Atlas (Recommended for beginners)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for testing)
5. Get your connection string
6. Replace `<password>` with your database user password
7. Add to `.env.local`

Example Atlas connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/modelsite?retryWrites=true&w=majority
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Linting
npm run lint        # Run ESLint
```

## 📱 Application Routes

### Public Routes

- `/` - Home page
- `/about` - About page
- `/services` - Services listing
- `/request-service` - Service request form
- `/contact` - Contact page

### Admin Routes (Protected)

- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/services` - Manage services
- `/admin/services/add` - Add new service
- `/admin/services/edit/[id]` - Edit service
- `/admin/orders` - View customer orders

## 🔧 Troubleshooting

### MongoDB Connection Error

- Check if MongoDB is running
- Verify connection string in `.env.local`
- Ensure database user has correct permissions

### NextAuth Error

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Build Errors

- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall
- Check Node.js version (requires 18+)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 💡 Tips

1. **Development**: Use MongoDB locally for faster development
2. **Production**: Use MongoDB Atlas for deployment
3. **Security**: Never commit `.env.local` to version control
4. **Images**: Use a CDN or cloud storage for production images
5. **Testing**: Test all features before deploying to production

## 📞 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the full README.md
3. Check the browser console for errors
4. Review server logs in the terminal

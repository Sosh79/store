# 🚀 Quick Reference Guide - ModelPro Website

Essential commands and information for managing your ModelPro website.

## 📦 NPM Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start           # Start production server (after build)
npm run lint        # Run ESLint to check code

# Dependencies
npm install         # Install all dependencies
npm update         # Update dependencies
```

## 🔧 Environment Variables

Required variables in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/modelsite
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-generated-secret>
```

## 🔑 Generate NEXTAUTH_SECRET

```bash
# Mac/Linux/Git Bash
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## 👤 Create Admin Account

### PowerShell (Windows)

```powershell
$body = @{
    username = "admin"
    email = "admin@example.com"
    password = "YourPassword123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/register" -Method POST -Body $body -ContentType "application/json"
```

### cURL (Mac/Linux/Git Bash)

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"YourPassword123!"}'
```

## 🗄️ MongoDB Commands

### Start MongoDB (Local)

```bash
# Mac/Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or start mongod manually
mongod
```

### Check MongoDB Status

```bash
# Mac/Linux
sudo systemctl status mongod

# Windows
net start | findstr MongoDB
```

### Connect to MongoDB Shell

```bash
mongosh              # Modern MongoDB Shell
# or
mongo                # Legacy MongoDB Shell
```

### Basic MongoDB Commands

```javascript
// In MongoDB shell
show dbs             // Show databases
use modelsite        // Switch to modelsite database
show collections     // Show collections
db.services.find()   // Show all services
db.orders.find()     // Show all orders
db.admins.find()     // Show all admins
```

## 📱 Important URLs

### Development

- Website: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin/dashboard
- Services: http://localhost:3000/services
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact

### API Endpoints

- Services: http://localhost:3000/api/services
- Orders: http://localhost:3000/api/orders
- Admin Register: http://localhost:3000/api/admin/register

## 🛠️ Common Tasks

### Starting Development

```bash
cd modelsite
npm run dev
```

### Adding a New Service

1. Login to admin at `/admin/login`
2. Go to Dashboard → "Add Service"
3. Fill in the form
4. Submit

### Viewing Orders

1. Login to admin
2. Navigate to `/admin/orders`
3. View all customer requests

### Editing a Service

1. Go to `/admin/services`
2. Click "Edit" on any service
3. Update and save

### Checking Database

```bash
# Start MongoDB shell
mongosh

# Use database
use modelsite

# Count documents
db.services.countDocuments()
db.orders.countDocuments()
db.admins.countDocuments()

# View data
db.services.find().pretty()
```

## 🐛 Troubleshooting

### Server Won't Start

```bash
# Check for port conflicts
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Mac/Linux

# Kill process on port 3000
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

### Can't Connect to MongoDB

```bash
# Check if MongoDB is running
# Windows
net start | findstr MongoDB

# Mac/Linux
sudo systemctl status mongod

# Check connection string in .env.local
# Verify MONGODB_URI is correct
```

### Clear Next.js Cache

```bash
# Delete .next folder and rebuild
rm -rf .next        # Mac/Linux
rmdir /s .next      # Windows CMD
Remove-Item -Recurse -Force .next   # PowerShell

npm run dev         # Restart
```

### Reset Node Modules

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json    # Mac/Linux
Remove-Item -Recurse -Force node_modules, package-lock.json   # PowerShell

npm install
```

## 📊 Database Queries (MongoDB Shell)

```javascript
// Find services by name
db.services.find({ name: /fashion/i });

// Find pending orders
db.orders.find({ status: "pending" });

// Count all orders
db.orders.countDocuments();

// Delete a service (use actual ID)
db.services.deleteOne({ _id: ObjectId("...") });

// Update order status
db.orders.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "completed" } }
);

// Drop entire collection (careful!)
db.services.drop();
```

## 🔒 Security Reminders

- Never commit `.env.local` to git
- Use strong passwords
- Generate random NEXTAUTH_SECRET
- Don't share admin credentials
- Keep dependencies updated

## 📦 Project Structure Quick Reference

```
modelsite/
├── app/              # All pages and routes
│   ├── page.tsx      # Home page
│   ├── about/        # About page
│   ├── services/     # Services page
│   ├── admin/        # Admin pages (protected)
│   └── api/          # API routes
├── components/       # Reusable components
├── lib/             # Utilities & config
├── models/          # Database models
└── .env.local       # Environment variables
```

## 🚢 Deployment Quick Guide

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or push to GitHub and import in Vercel dashboard
```

### Environment Variables for Production

Add these in your hosting platform:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `NEXTAUTH_URL` - Your production URL (https://yourdomain.com)
- `NEXTAUTH_SECRET` - Same secret from development

## 📞 Quick Help

If something's not working:

1. Check `.env.local` exists and is correct
2. Check MongoDB is running
3. Check browser console for errors
4. Check terminal for server errors
5. Restart development server
6. Clear browser cache
7. Check CHECKLIST.md for complete testing

## 📚 Documentation Files

- `README.md` - Complete project documentation
- `SETUP.md` - Detailed setup instructions
- `INSTALLATION.md` - Installation summary
- `CHECKLIST.md` - Pre-launch checklist
- `QUICK-REFERENCE.md` - This file

---

**Keep this file handy for quick access to common commands! 📌**

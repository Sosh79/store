# ModelPro - Professional Modeling Services Website

A complete, production-ready multi-page website built with Next.js, TypeScript, Tailwind CSS, MongoDB, and NextAuth for a professional modeler.

## 🎨 Features

### Public Pages

- **Home Page**: Hero section, services grid, portfolio gallery, and CTA
- **About Page**: Bio, experience timeline, skills showcase, and portfolio images
- **Services Page**: Dynamic services listing from database
- **Contact Page**: Contact information, social media links, and legal terms
- **Service Request**: Complete form for customers to request services

### Admin Dashboard (Protected)

- **Admin Login**: Secure authentication with NextAuth
- **Dashboard**: Overview with statistics and quick actions
- **Service Management**: Add, edit, view, and delete services
- **Order Management**: View all service requests with customer details

### Technical Features

- ✅ Full CRUD operations for services
- ✅ MongoDB database with Mongoose ODM
- ✅ NextAuth authentication system
- ✅ Protected admin routes
- ✅ API routes for all operations
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Custom color palette integrated

## 🎨 Color Palette

- **Primary**: `#4A86A5`
- **Secondary**: `#76B6E9`
- **Accent**: `#E3D200`
- **Extra-1**: `#B4CE3B`
- **Extra-2**: `#40815B`

## 📁 Project Structure

```
modelsite/
├── app/
│   ├── about/page.tsx
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── orders/page.tsx
│   │   └── services/
│   ├── api/
│   │   ├── admin/register/route.ts
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── orders/route.ts
│   │   └── services/
│   ├── contact/page.tsx
│   ├── request-service/
│   ├── services/page.tsx
│   └── page.tsx
├── components/
│   ├── Footer.tsx
│   ├── Gallery.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── ServiceCard.tsx
├── lib/
│   ├── auth.ts
│   └── mongodb.ts
├── models/
│   ├── Admin.ts
│   ├── Order.ts
│   └── Service.ts
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your values:

```env
MONGODB_URI=mongodb://localhost:27017/modelsite
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/modelsite`

**Option B: MongoDB Atlas (Cloud)**

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Add to `.env.local`

### Step 4: Create Admin Account

Start the development server:

```bash
npm run dev
```

Create an admin account using the API (use Postman, cURL, or similar):

```bash
POST http://localhost:3000/api/admin/register

Body (JSON):
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "your-secure-password"
}
```

### Step 5: Access the Application

- **Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## 📝 Usage Guide

### Admin Workflow

1. **Login**: Navigate to `/admin/login` and use your admin credentials
2. **Add Services**: Go to Dashboard → Add Service
3. **Manage Services**: Edit or delete services from `/admin/services`
4. **View Orders**: Check customer requests at `/admin/orders`

### Customer Workflow

1. **Browse Services**: View available services at `/services`
2. **Request Service**: Click "Request Service" on any service card
3. **Fill Form**: Complete the service request form
4. **Confirmation**: Receive success page after submission

## 🔒 Legal Terms

As specified in the contact page:

- **Copyright**: Customer may not republish the product
- **Refunds**: No refunds policy in effect

## 🛠️ Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Password Hashing**: bcryptjs
- **JWT**: jsonwebtoken

## 📦 API Routes

### Services

- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin only)
- `GET /api/services/[id]` - Get single service
- `PUT /api/services/[id]` - Update service (admin only)
- `DELETE /api/services/[id]` - Delete service (admin only)

### Orders

- `GET /api/orders` - Get all orders (admin only)
- `POST /api/orders` - Create new order

### Admin

- `POST /api/admin/register` - Register admin account

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## 📧 Support

For support, email contact@modelpro.com

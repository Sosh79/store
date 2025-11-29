import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

// POST create admin (protected - only existing admins can create new admins)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    // If admins exist, require authentication
    if (adminCount > 0) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Admin authentication required' },
          { status: 401 }
        );
      }
    }
    // If no admins exist, allow creation (initial setup only)

    const { username, email, password } = await request.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

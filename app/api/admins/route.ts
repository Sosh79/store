import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { getServerSession } from 'next-auth';

// GET - Get all admins (admin only)
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get all admins, excluding password field
    const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import NavbarSettings from '@/models/NavbarSettings';

// GET - Fetch navbar settings
export async function GET() {
  try {
    await dbConnect();

    let settings = await NavbarSettings.findOne();

    // If no settings exist, create default one
    if (!settings) {
      settings = await NavbarSettings.create({
        siteName: 'ModelPro',
        navLinks: [
          { label: 'Home', url: '/', order: 1 },
          { label: 'About', url: '/about', order: 2 },
          { label: 'Services', url: '/services', order: 3 },
          { label: 'Contact', url: '/contact', order: 4 },
        ],
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching navbar settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update navbar settings (Admin only)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();

    const existingSettings = await NavbarSettings.findOne();

    let settings;
    if (!existingSettings) {
      settings = await NavbarSettings.create(body);
    } else {
      settings = await NavbarSettings.findByIdAndUpdate(
        existingSettings._id,
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating navbar settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ServicesPageSettings from '@/models/ServicesPageSettings';

// GET - Fetch services page settings
export async function GET() {
  try {
    await dbConnect();

    let settings = await ServicesPageSettings.findOne();

    // If no settings exist, create default one
    if (!settings) {
      settings = await ServicesPageSettings.create({
        headerTitle: 'Our Services',
        headerSubtitle: 'Professional modeling services tailored to your needs',
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching services page settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update services page settings (Admin only)
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

    const existingSettings = await ServicesPageSettings.findOne();

    let settings;
    if (!existingSettings) {
      settings = await ServicesPageSettings.create(body);
    } else {
      settings = await ServicesPageSettings.findByIdAndUpdate(
        existingSettings._id,
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating services page settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

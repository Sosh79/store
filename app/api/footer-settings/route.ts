import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import FooterSettings from '@/models/FooterSettings';

// GET - Fetch footer settings
export async function GET() {
  try {
    await dbConnect();

    let settings = await FooterSettings.findOne();

    // If no settings exist, create default one
    if (!settings) {
      settings = await FooterSettings.create({
        brandName: 'ModelPro',
        brandDescription: 'Professional modeling services for brands, events, and content creation.',
        quickLinks: [
          { label: 'Home', url: '/' },
          { label: 'About', url: '/about' },
          { label: 'Services', url: '/services' },
          { label: 'Contact', url: '/contact' },
        ],
        contactEmail: 'contact@modelpro.com',
        contactPhone: '+1 (555) 123-4567',
        contactLocation: 'New York, NY',
        copyrightText: 'ModelPro. All rights reserved.',
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update footer settings (Admin only)
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

    const existingSettings = await FooterSettings.findOne();

    let settings;
    if (!existingSettings) {
      settings = await FooterSettings.create(body);
    } else {
      settings = await FooterSettings.findByIdAndUpdate(
        existingSettings._id,
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating footer settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

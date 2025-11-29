import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import About from '@/models/About';
import { getServerSession } from 'next-auth';

// GET - Get about page data (public)
export async function GET() {
  try {
    console.log('About GET: Connecting to database...');
    await dbConnect();

    console.log('About GET: Fetching about data...');
    let about = await About.findOne();

    // If no about data exists, create default
    if (!about) {
      console.log('About GET: No data found, creating default data...');
      about = await About.create({
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        storyTitle: 'My Story',
        storyContent: 'I am a professional model with years of experience in the fashion industry. My passion for modeling started at a young age, and I have worked with numerous brands and designers around the world.',
        experiences: [
          {
            year: '2020-Present',
            title: 'Professional Model',
            description: 'Working with international brands and fashion houses',
            order: 0,
          },
          {
            year: '2018-2020',
            title: 'Fashion Model',
            description: 'Runway and editorial modeling',
            order: 1,
          },
        ],
        skills: [
          { name: 'Runway Modeling', level: 95, order: 0 },
          { name: 'Photo Shoots', level: 90, order: 1 },
          { name: 'Commercial Modeling', level: 85, order: 2 },
        ],
      });
      console.log('About GET: Default data created successfully');
    } else {
      console.log('About GET: Data found');
    }

    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
}

// PATCH - Update about page data (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      console.error('About PATCH: No session found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();

    console.log('About PATCH: Updating with data:', JSON.stringify(body, null, 2));

    const existingAbout = await About.findOne();

    let about;
    if (!existingAbout) {
      console.log('About PATCH: Creating new about document');
      about = await About.create(body);
    } else {
      console.log('About PATCH: Updating existing about document');
      about = await About.findOneAndUpdate({}, body, { new: true, runValidators: true });
    }

    console.log('About PATCH: Successfully saved');

    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error: unknown) {
    console.error('Error updating about data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update about data';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

// GET all portfolio images
export async function GET() {
  try {
    await connectDB();
    const portfolioImages = await Portfolio.find().sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: portfolioImages,
    });
  } catch (error) {
    console.error('Error fetching portfolio images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio images' },
      { status: 500 }
    );
  }
}

// POST create new portfolio image (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { imageUrl, title, description, order } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const portfolio = await Portfolio.create({
      imageUrl,
      title,
      description,
      order: order || 0,
    });

    return NextResponse.json(
      { success: true, data: portfolio },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating portfolio image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create portfolio image' },
      { status: 500 }
    );
  }
}

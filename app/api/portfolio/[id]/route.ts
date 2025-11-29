import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

// DELETE portfolio image (admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await context.params;

    const portfolio = await Portfolio.findByIdAndDelete(id);

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting portfolio image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete portfolio image' },
      { status: 500 }
    );
  }
}

// PATCH update portfolio image (admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await context.params;
    const { imageUrl, title, description, order } = await req.json();

    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      { imageUrl, title, description, order },
      { new: true, runValidators: true }
    );

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error('Error updating portfolio image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio image' },
      { status: 500 }
    );
  }
}

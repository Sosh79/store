import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ContactInfo from '@/models/ContactInfo';

// GET - Fetch contact information
export async function GET() {
  try {
    await dbConnect();

    let contactInfo = await ContactInfo.findOne();

    // If no contact info exists, create default one
    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        headerTitle: 'Get In Touch',
        headerSubtitle: "Let's discuss how we can work together",
        email: 'contact@modelpro.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        businessHours: {
          weekday: 'Monday - Friday: 9AM - 6PM EST',
          weekend: 'Weekend: By Appointment',
        },
        socialMedia: [
          { name: 'Facebook', url: 'https://facebook.com', icon: '📘' },
          { name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
          { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
          { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
          { name: 'TikTok', url: 'https://tiktok.com', icon: '🎵' },
        ],
        legalTerms: {
          copyright: 'All content, photographs, videos, and materials created during our collaboration remain the intellectual property of ModelPro. The customer may not republish, redistribute, or resell any content without explicit written permission.',
          refundPolicy: 'All services are final sale. Once a service has been booked and scheduled, no refunds will be issued. In case of cancellation, credits may be offered for future services at our discretion.',
          serviceAgreement: 'By requesting a service, you agree to our terms and conditions. All projects require a signed agreement before work begins. Payment terms and schedules will be outlined in the service agreement.',
          privacy: 'We respect your privacy and maintain confidentiality of all client information. Personal data is protected in accordance with applicable privacy laws.',
        },
      });
    }

    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

// PATCH - Update contact information (Admin only)
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

    const existingContactInfo = await ContactInfo.findOne();

    let contactInfo;
    if (!existingContactInfo) {
      contactInfo = await ContactInfo.create(body);
    } else {
      contactInfo = await ContactInfo.findByIdAndUpdate(
        existingContactInfo._id,
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}

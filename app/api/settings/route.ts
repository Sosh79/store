import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

// GET site settings
export async function GET() {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await SiteSettings.create({
        heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        heroTitle: 'Professional Modeling Services',
        heroSubtitle: 'Elevate your brand with experienced, versatile modeling for fashion, events, and content creation.',
        heroButton: {
          label: 'Order Service',
          url: '/services',
        },
        servicesTitle: 'Our Services',
        noServicesMessage: 'No services available yet. Check back soon!',
        noServicesButtonLabel: 'Contact Us',
        noServicesButtonUrl: '/contact',
        portfolioTitle: 'Portfolio',
        ctaTitle: 'Ready to Work Together?',
        ctaDescription: 'Let\'s create something amazing. Get in touch to discuss your project.',
        ctaButtons: [
          { label: 'View Services', url: '/services', style: 'primary', order: 1 },
          { label: 'Contact Us', url: '/contact', style: 'secondary', order: 2 },
        ],
        aboutPageTitle: 'About Me',
        aboutPageSubtitle: 'Professional Model & Content Creator',
        servicesPageTitle: 'Our Services',
        servicesPageSubtitle: 'Professional modeling services tailored to your needs',
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH update site settings (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();
    const {
      heroImage,
      heroTitle,
      heroSubtitle,
      heroButton,
      servicesTitle,
      noServicesMessage,
      noServicesButtonLabel,
      noServicesButtonUrl,
      portfolioTitle,
      ctaTitle,
      ctaDescription,
      ctaButtons,
      aboutPageTitle,
      aboutPageSubtitle,
      servicesPageTitle,
      servicesPageSubtitle,
    } = body;

    const existingSettings = await SiteSettings.findOne();

    let settings;
    if (!existingSettings) {
      // Create if doesn't exist
      settings = await SiteSettings.create(body);
    } else {
      // Update existing - only update fields that are provided
      if (heroImage !== undefined) existingSettings.heroImage = heroImage;
      if (heroTitle !== undefined) existingSettings.heroTitle = heroTitle;
      if (heroSubtitle !== undefined) existingSettings.heroSubtitle = heroSubtitle;
      if (heroButton !== undefined) existingSettings.heroButton = heroButton;
      if (servicesTitle !== undefined) existingSettings.servicesTitle = servicesTitle;
      if (noServicesMessage !== undefined) existingSettings.noServicesMessage = noServicesMessage;
      if (noServicesButtonLabel !== undefined) existingSettings.noServicesButtonLabel = noServicesButtonLabel;
      if (noServicesButtonUrl !== undefined) existingSettings.noServicesButtonUrl = noServicesButtonUrl;
      if (portfolioTitle !== undefined) existingSettings.portfolioTitle = portfolioTitle;
      if (ctaTitle !== undefined) existingSettings.ctaTitle = ctaTitle;
      if (ctaDescription !== undefined) existingSettings.ctaDescription = ctaDescription;
      if (ctaButtons !== undefined) existingSettings.ctaButtons = ctaButtons;
      if (aboutPageTitle !== undefined) existingSettings.aboutPageTitle = aboutPageTitle;
      if (aboutPageSubtitle !== undefined) existingSettings.aboutPageSubtitle = aboutPageSubtitle;
      if (servicesPageTitle !== undefined) existingSettings.servicesPageTitle = servicesPageTitle;
      if (servicesPageSubtitle !== undefined) existingSettings.servicesPageSubtitle = servicesPageSubtitle;
      settings = await existingSettings.save();
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

import mongoose, { Schema, Model } from 'mongoose';

export interface IHeroButton {
  label: string;
  url: string;
  style: 'primary' | 'secondary';
  order: number;
}

export interface ISiteSettings {
  _id?: string;
  heroImage: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroButton?: {
    label: string;
    url: string;
  };
  servicesTitle?: string;
  noServicesMessage?: string;
  noServicesButtonLabel?: string;
  noServicesButtonUrl?: string;
  portfolioTitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtons?: IHeroButton[];
  aboutPageTitle?: string;
  aboutPageSubtitle?: string;
  servicesPageTitle?: string;
  servicesPageSubtitle?: string;
  updatedAt?: Date;
}

const HeroButtonSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    enum: ['primary', 'secondary'],
    default: 'primary',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroImage: {
      type: String,
      required: [true, 'Hero image URL is required'],
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    },
    heroTitle: {
      type: String,
      default: 'Professional Modeling Services',
    },
    heroSubtitle: {
      type: String,
      default: 'Elevate your brand with experienced, versatile modeling for fashion, events, and content creation.',
    },
    heroButton: {
      label: {
        type: String,
        default: 'Order Service',
      },
      url: {
        type: String,
        default: '/services',
      },
    },
    servicesTitle: {
      type: String,
      default: 'Our Services',
    },
    noServicesMessage: {
      type: String,
      default: 'No services available yet. Check back soon!',
    },
    noServicesButtonLabel: {
      type: String,
      default: 'Contact Us',
    },
    noServicesButtonUrl: {
      type: String,
      default: '/contact',
    },
    portfolioTitle: {
      type: String,
      default: 'Portfolio',
    },
    ctaTitle: {
      type: String,
      default: 'Ready to Work Together?',
    },
    ctaDescription: {
      type: String,
      default: 'Let\'s create something amazing. Get in touch to discuss your project.',
    },
    ctaButtons: {
      type: [HeroButtonSchema],
      default: [
        { label: 'View Services', url: '/services', style: 'primary', order: 1 },
        { label: 'Contact Us', url: '/contact', style: 'secondary', order: 2 },
      ],
    },
    aboutPageTitle: {
      type: String,
      default: 'About Me',
    },
    aboutPageSubtitle: {
      type: String,
      default: 'Professional Model & Content Creator',
    },
    servicesPageTitle: {
      type: String,
      default: 'Our Services',
    },
    servicesPageSubtitle: {
      type: String,
      default: 'Professional modeling services tailored to your needs',
    },
  },
  {
    timestamps: true,
  }
);

// Clear the cached model in development
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.SiteSettings;
}

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;

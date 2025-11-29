import mongoose from 'mongoose';

const QuickLinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const FooterSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'ModelPro',
    },
    brandDescription: {
      type: String,
      default: 'Professional modeling services for brands, events, and content creation.',
    },
    quickLinks: [QuickLinkSchema],
    contactEmail: {
      type: String,
      default: 'contact@modelpro.com',
    },
    contactPhone: {
      type: String,
      default: '+1 (555) 123-4567',
    },
    contactLocation: {
      type: String,
      default: 'New York, NY',
    },
    copyrightText: {
      type: String,
      default: 'ModelPro. All rights reserved.',
    },
  },
  {
    timestamps: true,
  }
);

// Clear the model cache in development
if (mongoose.models.FooterSettings) {
  delete mongoose.models.FooterSettings;
}

export default mongoose.model('FooterSettings', FooterSettingsSchema);

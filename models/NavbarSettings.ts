import mongoose from 'mongoose';

const NavLinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const NavbarSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'ModelPro',
    },
    navLinks: [NavLinkSchema],
  },
  {
    timestamps: true,
  }
);

// Clear the model cache in development
if (mongoose.models.NavbarSettings) {
  delete mongoose.models.NavbarSettings;
}

export default mongoose.model('NavbarSettings', NavbarSettingsSchema);

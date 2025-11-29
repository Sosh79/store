import mongoose from 'mongoose';

const ServicesPageSettingsSchema = new mongoose.Schema(
  {
    headerTitle: {
      type: String,
      default: 'Our Services',
    },
    headerSubtitle: {
      type: String,
      default: 'Professional modeling services tailored to your needs',
    },
  },
  {
    timestamps: true,
  }
);

// Clear the model cache in development
if (mongoose.models.ServicesPageSettings) {
  delete mongoose.models.ServicesPageSettings;
}

export default mongoose.model('ServicesPageSettings', ServicesPageSettingsSchema);

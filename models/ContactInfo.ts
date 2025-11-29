import mongoose from 'mongoose';

const SocialMediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const ContactInfoSchema = new mongoose.Schema(
  {
    headerTitle: {
      type: String,
      default: 'Get In Touch',
    },
    headerSubtitle: {
      type: String,
      default: "Let's discuss how we can work together",
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    businessHours: {
      weekday: {
        type: String,
        default: 'Monday - Friday: 9AM - 6PM EST',
      },
      weekend: {
        type: String,
        default: 'Weekend: By Appointment',
      },
    },
    socialMedia: [SocialMediaSchema],
    legalTerms: {
      copyright: {
        type: String,
        default: 'All content, photographs, videos, and materials created during our collaboration remain the intellectual property of ModelPro.',
      },
      refundPolicy: {
        type: String,
        default: 'All services are final sale. Once a service has been booked and scheduled, no refunds will be issued.',
      },
      serviceAgreement: {
        type: String,
        default: 'By requesting a service, you agree to our terms and conditions. All projects require a signed agreement before work begins.',
      },
      privacy: {
        type: String,
        default: 'We respect your privacy and maintain confidentiality of all client information.',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Clear the model cache in development
if (mongoose.models.ContactInfo) {
  delete mongoose.models.ContactInfo;
}

export default mongoose.model('ContactInfo', ContactInfoSchema);

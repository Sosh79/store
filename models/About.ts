import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  order: { type: Number, default: 0 },
});

const AboutSchema = new mongoose.Schema(
  {
    profileImage: { type: String, required: true },
    storyTitle: { type: String, required: true },
    storyContent: { type: String, required: true },
    experiences: [ExperienceSchema],
    skills: [SkillSchema],
  },
  { timestamps: true }
);

// Delete the model if it exists to avoid caching issues
if (mongoose.models.About) {
  delete mongoose.models.About;
}

export default mongoose.model('About', AboutSchema);

'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface Experience {
  _id?: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

interface Skill {
  _id?: string;
  name: string;
  level: number;
  order: number;
}

interface AboutData {
  profileImage: string;
  storyTitle: string;
  storyContent: string;
  experiences: Experience[];
  skills: Skill[];
}

export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<AboutData>({
    profileImage: '',
    storyTitle: '',
    storyContent: '',
    experiences: [],
    skills: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      if (data.success) {
        setAboutData(data.data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      setMessage('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      console.log('Saving about data:', aboutData);
      
      const res = await fetch('/api/about', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });

      const data = await res.json();
      console.log('Save response:', data);

      if (data.success) {
        setMessage('✓ About page updated successfully!');
        setAboutData(data.data); // Update with saved data
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`✗ Failed to update: ${data.error || 'Unknown error'}`);
        console.error('Update failed:', data);
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      setMessage('✗ Error saving changes. Please check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const addExperience = () => {
    setAboutData({
      ...aboutData,
      experiences: [
        ...aboutData.experiences,
        { year: '', title: '', description: '', order: aboutData.experiences.length },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const newExperiences = aboutData.experiences.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, experiences: newExperiences });
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | number) => {
    const newExperiences = [...aboutData.experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setAboutData({ ...aboutData, experiences: newExperiences });
  };

  const addSkill = () => {
    setAboutData({
      ...aboutData,
      skills: [
        ...aboutData.skills,
        { name: '', level: 50, order: aboutData.skills.length },
      ],
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = aboutData.skills.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, skills: newSkills });
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...aboutData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setAboutData({ ...aboutData, skills: newSkills });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage About Page</h1>
              <p className="text-gray-600 mt-1">Edit your profile, story, experience, and skills</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.includes('✓')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          {/* Profile Image */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile & Header</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  value={aboutData.profileImage}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, profileImage: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/profile.jpg"
                />
                {aboutData.profileImage && (
                  <img
                    src={aboutData.profileImage}
                    alt="Profile Preview"
                    className="mt-3 w-full h-64 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Story</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  value={aboutData.storyTitle}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, storyTitle: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  placeholder="My Story"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Content
                </label>
                <textarea
                  value={aboutData.storyContent}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, storyContent: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell your story..."
                />
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Experience</h2>
              <button
                onClick={addExperience}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {aboutData.experiences.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">
                      Experience #{index + 1}
                    </span>
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year/Period
                      </label>
                      <input
                        type="text"
                        value={exp.year}
                        onChange={(e) => updateExperience(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        placeholder="2020-Present"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        placeholder="Professional Model"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="Describe your experience..."
                    />
                  </div>
                </div>
              ))}

              {aboutData.experiences.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No experience added yet. Click "Add Experience" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Skills</h2>
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Skill
              </button>
            </div>

            <div className="space-y-4">
              {aboutData.skills.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">
                      Skill #{index + 1}
                    </span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        placeholder="Runway Modeling"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Level (0-100)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                          className="flex-grow"
                        />
                        <span className="text-sm font-medium text-gray-700 w-12">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {aboutData.skills.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No skills added yet. Click "Add Skill" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/about"
              target="_blank"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Preview Page
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

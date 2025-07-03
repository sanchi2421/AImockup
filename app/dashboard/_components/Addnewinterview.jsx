"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';


function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    jobRole: '',
    jobDescription: '',
    yearsExperience: ''
  });

  const { user } = useUser();
  const router = useRouter() ;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateInterviewQuestions = async (jobRole, jobDescription, yearsExperience) => {
    const prompt = `
    Generate exactly 5 technical interview questions for the following job position:

    Job Role: ${jobRole}
    Job Description/Tech Stack: ${jobDescription}
    Years of Experience: ${yearsExperience}

    Please generate questions that are:
    1. Appropriate for someone with ${yearsExperience} years of experience
    2. Relevant to the technologies mentioned in: ${jobDescription}
    3. Mix of technical concepts, problem-solving, and practical scenarios
    4. Progressive in difficulty (easier to harder)

    Format the response as a JSON array of objects with the following structure:
    [
      {
        "id": 1,
        "question": "Question text here",
        "type": "technical|behavioral|problem-solving",
        "difficulty": "easy|medium|hard"
      }
    ]

    Only return the JSON array, no additional text.
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';

      let questions;
      try {
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        questions = [{
          id: 1,
          question: generatedText.trim(),
          type: "technical",
          difficulty: "medium"
        }];
      }

      return questions;

    } catch (error) {
      console.error('Error generating questions:', error);
      return [
        {
          id: 1,
          question: `Tell me about your experience with ${jobDescription}`,
          type: "technical",
          difficulty: "easy"
        },
        {
          id: 2,
          question: `How would you approach a challenging project in ${jobRole}?`,
          type: "problem-solving",
          difficulty: "medium"
        }
      ];
    }
  };

  const handleStartInterview = async () => {
  setIsGenerating(true);

  try {
    const questions = await generateInterviewQuestions(
      formData.jobRole,
      formData.jobDescription,
      formData.yearsExperience
    );

    console.log('Generated Questions:', questions);

    // Log the data being inserted to debug
    const insertData = {
      mockId: uuidv4(),
      jsonMockResp: JSON.stringify(questions),
      jobDesc: formData.jobDescription,
      jobPosition: formData.jobRole,
      jobExperience: formData.yearsExperience,
      createdBy: user?.primaryEmailAddress?.emailAddress || 'anonymous'
    };
    
    console.log('Data being inserted:', insertData);

    const response = await db.insert(MockInterview).values(insertData)
      .returning({ mockId: MockInterview.mockId });
      
    if(response){
      setIsModalOpen(false);
      router.push('/dashboard/interview/'+response[0]?.mockId)
    }
    
    console.log('Inserted Interview Record ID:', response);

    alert(`Interview questions generated and saved successfully! Check console for details.`);

  } catch (error) {
    console.error('❌ Error generating interview or saving:', error);
    alert('Error generating questions. Please try again.');
  } finally {
    setIsGenerating(false);
    setIsModalOpen(false);
    setFormData({ jobRole: '', jobDescription: '', yearsExperience: '' });
  }
};
  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({
      jobRole: '',
      jobDescription: '',
      yearsExperience: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 relative overflow-hidden">
      {/* Background decorative elements to match the landing page */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-white/80 text-lg">Create and Start your AI Mockup Interview</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl px-16 py-8 text-white text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-purple-500/25 border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <span className="relative flex items-center gap-3">
              <span className="text-2xl">+</span>
              Start New Interview
            </span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative transform transition-all duration-300 scale-100 border border-purple-100">
            <button
              onClick={handleCancel}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              disabled={isGenerating}
            >
              <X size={22} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Tell us about your interview
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Add details about your job position, role, job description and years of experience to get personalized questions.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Job Role/Job Position
                </label>
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  placeholder="e.g. Full Stack Developer, Data Scientist"
                  disabled={isGenerating}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Job Description/Tech Stack (In Short)
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  placeholder="e.g. React, Node.js, MongoDB, AWS..."
                  rows="4"
                  disabled={isGenerating}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 disabled:opacity-50 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  placeholder="e.g. 3"
                  min="0"
                  max="50"
                  disabled={isGenerating}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-gray-700"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-10">
              <button
                onClick={handleCancel}
                disabled={isGenerating}
                className="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-xl hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartInterview}
                disabled={!formData.jobRole || !formData.jobDescription || !formData.yearsExperience || isGenerating}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <span>Start Interview</span>
                    <span className="text-xl">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
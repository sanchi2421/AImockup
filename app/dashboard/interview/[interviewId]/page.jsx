"use client";
import { Button } from '@/components/ui/button';
import { WebcamIcon, VideoIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

function Interview() {
  const params = useParams();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
        
    console.log(result);
    setInterviewData(result[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Let's Get Started
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Video Section */}
          <div className="flex flex-col space-y-6">
            {/* Video Container */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col items-center space-y-4">
                {webCamEnabled ? (
                  <div className="relative">
                    <Webcam
                      onUserMedia={() => setWebCamEnabled(true)}
                      onUserMediaError={() => setWebCamEnabled(false)}
                      mirrored={true}
                      className="rounded-lg border-4 border-gray-200 shadow-md"
                      style={{
                        height: 280,
                        width: 400,
                        maxWidth: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-12 w-full max-w-md">
                    <VideoIcon className="h-20 w-20 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center mb-2">Camera is disabled</p>
                    <p className="text-sm text-gray-400 text-center">
                      Enable your camera to start the mock interview
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={() => setWebCamEnabled(!webCamEnabled)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    webCamEnabled 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {webCamEnabled ? 'Disable Web Cam' : 'Enable Web Cam and Microphone'}
                </Button>
              </div>
            </div>

            {/* Information Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Information</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. 
                    It has 5 questions which you can answer and at the last you will get the report 
                    on the basis of your answer. <strong>NOTE:</strong> We never record your video. 
                    Web cam access you can disable at any time if you want.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Interview Details */}
          <div className="flex flex-col space-y-6">
            {interviewData ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Interview Details</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Job Role/Job Position
                    </h3>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      {interviewData.jobPosition}
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Job Description/Tech Stack
                    </h3>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      {interviewData.jobDesc}
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Years of Experience
                    </h3>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      {interviewData.jobExperience} years
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Start Interview Button */}
            {webCamEnabled && interviewData && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <Link href={`/dashboard/interview/${params.interviewId}/start`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200">
                    Start Interview
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
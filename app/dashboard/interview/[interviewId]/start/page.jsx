"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState, use } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const StartInterview = ({ params }) => {
  const [interViewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Unwrap the async params
  const resolvedParams = use(params);
  
  useEffect(() => {
    GetInterviewDetails();
  }, []);
  
  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, resolvedParams.interviewId));
      
      if (result.length === 0) {
        setError("Interview not found");
        return;
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      console.log(
        "🚀 ~ file: page.jsx:18 ~ GetInterviewDetails ~ jsonMockResp:",
        jsonMockResp
      );
      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
    } catch (err) {
      console.error("Error fetching interview details:", err);
      setError("Failed to load interview data");
      toast.error("Failed to load interview data");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < mockInterviewQuestion.length) {
      setActiveQuestionIndex(newIndex);
    }
  };

  const handleAnswerRecorded = (questionIndex) => {
    if (!answeredQuestions.includes(questionIndex)) {
      setAnsweredQuestions(prev => [...prev, questionIndex]);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const isLastQuestion = activeQuestionIndex === mockInterviewQuestion?.length - 1;
  const allQuestionsAnswered = answeredQuestions.length === mockInterviewQuestion?.length;
  const unansweredCount = mockInterviewQuestion?.length - answeredQuestions.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mock Interview</h1>
              <p className="text-gray-600">
                {interViewData?.jobPosition} • {interViewData?.jobExperience} Experience
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="font-semibold text-gray-800">
                  {activeQuestionIndex + 1} / {mockInterviewQuestion?.length}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">
                  {answeredQuestions.length} answered
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Questions Section */}
          <div className="order-1 lg:order-1">
            <QuestionsSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              onQuestionChange={handleQuestionChange}
              answeredQuestions={answeredQuestions}
            />
          </div>

          {/* Recording Section */}
          <div className="order-2 lg:order-2">
            <RecordAnswerSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interViewData}
              onAnswerRecorded={handleAnswerRecorded}
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {activeQuestionIndex > 0 && (
                <Button 
                  onClick={handlePreviousQuestion}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Question
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Skip Question Button */}
              {!isLastQuestion && (
                <Button 
                  onClick={handleNextQuestion}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  Skip Question
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              
              {!isLastQuestion ? (
                <Button 
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex items-center space-x-4">
                  {unansweredCount > 0 && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {unansweredCount} questions not answered
                      </span>
                    </div>
                  )}
                  <Link 
                    href={`/dashboard/interview/${interViewData?.mockId}/feedback`}
                  >
                    <Button 
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {allQuestionsAnswered ? "End Interview & Get Feedback" : "End Interview (Skip Remaining)"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(((activeQuestionIndex + 1) / mockInterviewQuestion?.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((activeQuestionIndex + 1) / mockInterviewQuestion?.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Interview Tips */}
        
        </div>
      </div>
  );
};

export default StartInterview;
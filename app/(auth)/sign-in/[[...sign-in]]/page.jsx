"use client";

import { SignIn } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/app/dashboard/_components/Header';

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [showDashboard, setShowDashboard] = useState(false);

  // Show dashboard view when user signs in successfully
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setShowDashboard(true);
    }
  }, [isSignedIn, isLoaded]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Show dashboard with header after successful sign-in
  if (isSignedIn && showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
      </div>
    );
  }

  // Show sign-in form if user is not signed in
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-red-900 via-red-800 to-black">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-black/80 z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl opacity-90">Continue your journey with us</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="max-w-md w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3L4 14h7v7l9-11h-7V3z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-600 mt-2">Today is a new day. It's your day. You shape it.</p>
            <p className="text-gray-600">Sign in to start managing your projects.</p>
          </div>
          
          {/* Clerk Sign In Component */}
          <div className="clerk-signin-wrapper">
            <SignIn 
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200",
                  socialButtonsBlockButtonText: "font-medium",
                  dividerLine: "bg-gray-300",
                  dividerText: "text-gray-500 text-sm",
                  formFieldInput: "bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200",
                  formFieldLabel: "text-gray-700 font-medium mb-2",
                  formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 w-full",
                  footerActionLink: "text-red-600 hover:text-red-700 font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButton: "text-red-600 hover:text-red-700"
                },
                layout: {
                  socialButtonsPlacement: "top",
                  showOptionalFields: false
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile background for small screens */}
      <div className="lg:hidden absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
      </div>
    </div>
  );
}
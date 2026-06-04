import { ForgetForm } from "@/modules/auth/components/forget-password/ForgetForm";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center max-sm:p-6  lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 px-4 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">WorkBridge</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Task Collaboration Platform
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your enterprise dashboard
        </p>
      </div>

      {/* Login Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-200">
          <ForgetForm />
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="#" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="#" className="hover:text-gray-700 transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="#" className="hover:text-gray-700 transition-colors">
              Security
            </Link>
          </div>
          <p className="mt-2">
            © {new Date().getFullYear()} WorkBridge. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;

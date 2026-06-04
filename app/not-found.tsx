"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button/button";
import { Home, ArrowLeft, Search, Mail, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-slate-600 mb-4">
            404
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-slate-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            The page you're looking for seems to have sailed away. Don't worry,
            even the best navigators sometimes lose their way in the digital
            ocean.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-cyan-50 to-slate-50 rounded-xl p-6 border border-cyan-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Need Help?
          </h3>
          <p className="text-slate-600 mb-4">
            If you believe this is an error or need assistance, please don't
            hesitate to contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="#">
              <Button
                variant="outline"
                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-400"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
              onClick={() => (window.location.href = "tel:+1234567890")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Us
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-cyan-200 to-cyan-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-gradient-to-r from-cyan-300 to-slate-300 rounded-full opacity-15 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}

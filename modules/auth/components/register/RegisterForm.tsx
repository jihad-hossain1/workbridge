"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { icons } from "@/components/ui/icons";
import { register as registerUser } from "../../actions/authActions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";

type FormInputs = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormInputs>();

  const password = watch("password");

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        mobile: data.mobile,
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ")[1] || data.name.split(" ")[0],
      });

      setIsLoading(false);

      if (response?.success) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        reset();
        // Redirect to login after successful registration
        setTimeout(() => {
          router.push("/user-verify?email=" + data?.email);
        }, 2000);

        return;
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  }, [successMessage]);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-cyan-700 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-lg border-l-4 border-red-500 bg-red-50 shadow-sm animate-scale-in">
            <svg
              className="h-5 w-5 text-red-500 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-red-700 font-medium text-sm">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-3 p-4 rounded-lg border-l-4 border-green-500 bg-green-50 shadow-sm animate-scale-in">
            <svg
              className="h-5 w-5 text-green-500 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <p className="text-green-700 font-medium text-sm">
              {successMessage}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Input
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            label="Full Name"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            label="Email"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Invalid mobile number (10-15 digits)",
              },
            })}
            label="Mobile Number"
            placeholder="Enter your mobile number"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <icons.eyeOff /> : <icons.eye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <icons.eyeOff /> : <icons.eye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 focus:ring-2"
              required
            />
            <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
              I agree to the{" "}
              <a
                href="#"
                className="text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
              >
                Terms and Conditions
              </a>
            </span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          button_color="ocean"
          size="lg"
          className="w-full font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <icons.loader className="mr-2" />
              Creating account...
            </span>
          ) : (
            "Create Your Account"
          )}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <div className="text-sm text-slate-600 mb-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cyan-600 hover:text-cyan-800 font-semibold transition-colors"
          >
            Sign In
          </a>
        </div>
        <a
          href="/"
          className="inline-flex items-center text-slate-500 hover:text-cyan-600 transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </a>
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { icons } from "@/components/ui/icons";
import { applyForActivation, signin } from "../../actions/authActions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input/input";
import { PROJECT_TITLE } from "@/config/constants";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button/button";
import toast from "react-hot-toast";

type FormInputs = {
  email: string;
  password: string;
};

export const Form = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loggedUser } = useAuthStore();
  const [isNotActive, setIsNotActive] = useState(false);
  const [isApplyLoading, setIsApplyLoading] = useState(false);
  const [activeEmail, setActiveEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    setErrorMessage("");
    setIsLoading(true);
    setIsNotActive(false);

    try {
      const response = await signin({
        email: data.email,
        password: data.password,
      });
      setIsLoading(false);

      if ((response as any)?.not_active) {
        setIsNotActive(true);
        setActiveEmail(data.email);
        return;
      }

      if (response?.success) {
        loggedUser({
          userId: String(response?.data?.id),
          email: response?.data?.email!,
          name: response?.data?.username!,
          accessToken: (response as any)?.data?.accessToken,
          _auth_token: (response as any)?.token,
          businessId: (response as any)?.data?.businessId,
        });

        router.push("/main");
        setIsLoading(true);

        return;
      } else {
        setErrorMessage(response?.error!);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApply = async () => {
    try {
      setIsApplyLoading(true);

      const response = await applyForActivation({
        email: activeEmail,
      });

      if (response?.success) {
        toast.success(`${(response as any)?.message}`);
        setIsNotActive(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsApplyLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div className={""}>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorMessage
          errorMessage={errorMessage}
          handleApply={handleApply}
          isApplyLoading={isApplyLoading}
          isNotActive={isNotActive}
        />
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
            placeholder="Enter Your Mail No."
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
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
              className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <icons.eyeOff className="h-4 w-4" />
              ) : (
                <icons.eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <SubmitButton isLoading={isLoading} />
      </form>
      <Footer />
    </div>
  );
};

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <label className="flex items-center group cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 focus:ring-2"
          />
          <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
            Remember me
          </span>
        </label>
        <a
          href="/forget-password"
          className="text-sm text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
        >
          Forgot password?
        </a>
      </div>
      <div className="w-full flex justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          button_color="ocean"
          className="w-1/3 font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <icons.loader className="mr-2 animate-spin h-4 w-4 2xl:h-5 2xl:w-5" />
              Signing in...
            </span>
          ) : (
            "Sign in to Account"
          )}
        </Button>
      </div>
    </>
  );
}

function Header({}) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-cyan-700 bg-clip-text text-transparent mb-2">
        Welcome Back
      </h1>
      <p className="text-slate-600">Sign in to your {PROJECT_TITLE} account</p>
    </div>
  );
}

function Footer() {
  return (
    <>
      <div className="mt-6 text-center">
        <div className="text-sm text-slate-600 mb-4">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-cyan-600 hover:text-cyan-800 font-semibold transition-colors"
          >
            Create Account
          </a>
        </div>
        <a
          href="/"
          className="inline-flex items-center text-slate-500 hover:text-cyan-600 transition-colors text-sm font-medium"
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
    </>
  );
}

function ErrorMessage({
  errorMessage,
  isNotActive,
  handleApply,
  isApplyLoading,
}: {
  errorMessage: string;
  isNotActive: boolean;
  handleApply: () => void;
  isApplyLoading: boolean;
}) {
  return (
    <>
      {errorMessage && (
        <>
          <div className="flex items-center gap-3 p-4 rounded-lg border-l-4 border-red-500 bg-red-50 shadow-sm">
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
        </>
      )}
      {isNotActive && (
        <div>
          <p className="text-red-500 text-sm flex items-center gap-2">
            Your account is not active. apply for activation{" "}
            <Button
              onClick={handleApply}
              button_color="forest"
              size="xs"
              type="button"
              disabled={isApplyLoading}
            >
              Apply
            </Button>
          </p>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import {
  confirmPassword,
  forgotPassword,
  verifyCode,
} from "../../actions/authActions";
import { Input } from "@/components/ui/input/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button/button";
import { icons } from "@/components/ui/icons";
import toast from "react-hot-toast";
const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/login`;

export const ForgetForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [forgotAction, setForgotAction] = useState(false);
  const [isSuccess, setIsSuccess] = useState("");
  const [codeFormData, setCodeFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
  });
  const [confirmAction, setConfirmAction] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setForgotAction(false);
    try {
      setLoading(true);
      const response = (await forgotPassword({
        email: formData.email,
      })) as unknown as {
        error?: string;
        success?: boolean;
      };
      setLoading(false);
      if (response?.error) {
        setErrors({ error: response.error });
        return;
      }
      if (response?.success) {
        setIsSuccess("Check your email for the reset code");
        setCodeFormData({
          ...codeFormData,
          email: formData.email,
        });

        setForgotAction(true);
        return;
      }
    } catch (error) {
      console.error(
        "error for forgotPassword action: ",
        (error as Error).message
      );
    }
  };

  const handleCheckCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      setLoading(true);
      const response = (await verifyCode({
        code: codeFormData.code,
        email: codeFormData.email,
      })) as unknown as {
        error?: string;
        success?: boolean;
      };
      setLoading(false);

      if (response?.success) {
        toast.success("Code reset successfully");
        setConfirmAction(true);
        return;
      } else {
        toast.error(`${response.error}`);
        return;
      }
    } catch (error) {
      console.error("error for verifyCode action: ", (error as Error).message);
    }
  };

  const handleConfirmPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (codeFormData.newPassword !== codeFormData.confirmPassword) {
      setErrors({ error: "Password not match, please check again" });
      return;
    }
    if (codeFormData.newPassword.length < 6) {
      setErrors({ error: "Password must be at least 6 characters" });
      return;
    }
    try {
      setLoading(true);
      const response = (await confirmPassword({
        email: codeFormData.email,
        password: codeFormData.newPassword,
      })) as unknown as {
        error?: string;
        success?: boolean;
      };
      setLoading(false);

      if (response?.success) {
        toast.success("Password reset successfully");
        router.push(redirectUrl);
      } else {
        toast.error(`${response.error}`);
      }
      setConfirmAction(false);
    } catch (error) {
      console.error(
        "error for forgotPassword action: ",
        (error as Error).message
      );
    }
  };

  return (
    <div>
      {!forgotAction && !confirmAction && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-cyan-700 bg-clip-text text-transparent mb-2">
              Forgot Password?
            </h1>
            <p className="text-slate-600">
              Enter your email to reset your password
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Input
                label="Email Address"
                type="email"
                name="email"
                id="email"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors?.notfound && (
                <p className="text-red-500 text-sm mt-1">{errors?.notfound}</p>
              )}
              {errors?.error && (
                <p className="text-red-500 text-sm mt-1">{errors?.error}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              button_color="ocean"
              size="lg"
              className="w-full font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <icons.loader className="mr-2" />
                  Processing...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <div className="text-sm text-slate-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-cyan-600 hover:text-cyan-800 font-semibold transition-colors"
              >
                Back to Login
              </a>
            </div>
          </div>
        </>
      )}
      {!confirmAction && forgotAction && (
        <>
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B2C</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-cyan-700 bg-clip-text text-transparent mb-2">
              Verify Identity
            </h1>
            <p className="text-slate-600">
              Enter the OTP sent to{" "}
              <span className="font-semibold text-cyan-600">
                {codeFormData?.email}
              </span>
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleCheckCode}>
            <div className="space-y-1">
              <Input
                label="Verification Code"
                type="text"
                name="code"
                id="code"
                required
                value={codeFormData.code}
                onChange={(e) =>
                  setCodeFormData({ ...codeFormData, code: e.target.value })
                }
              />
              {errors?.codeValid && (
                <p className="text-red-500 text-sm mt-1">{errors?.codeValid}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              button_color="ocean"
              size="lg"
              className="w-full font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <icons.loader className="mr-2" />
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </>
      )}
      {confirmAction && (
        <>
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B2C</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-cyan-700 bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-slate-600">
              Enter your new password (minimum 6 characters)
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleConfirmPassword}>
            <div className="space-y-1">
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                id="newPassword"
                required
                value={codeFormData.newPassword}
                onChange={(e) =>
                  setCodeFormData({
                    ...codeFormData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                value={codeFormData.confirmPassword}
                onChange={(e) =>
                  setCodeFormData({
                    ...codeFormData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              button_color="ocean"
              size="lg"
              className="w-full font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <icons.loader className="mr-2" />
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

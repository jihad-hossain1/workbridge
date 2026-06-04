"use client";

import { Input } from "@/components/ui/input/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { verifyEmail } from "../../actions/authActions";
import { Button } from "@/components/ui/button/button";

type VerifyFormData = {
  code: string;
};

export const VerifyForm = ({ email }: { email: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (data: VerifyFormData) => {
    try {
      setError("");
      setLoading(true);

      const res = await verifyEmail({
        email,
        code: data.code,
      });

      setLoading(false);
      if (res.success) {
        router.push("/login");
        return;
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("Failed to verify code");
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-cyan-700 bg-clip-text text-transparent mb-2">
          Verify Your Email
        </h1>
        <p className="text-slate-600">
          We sent a code to{" "}
          <span className="font-semibold text-cyan-600">{email}</span>
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}
        <div className="space-y-1">
          <Input
            label="Verification Code"
            id="code"
            placeholder="Enter code"
            type="text"
            inputMode="numeric"
            // pattern="[0-9]{6}"
            {...register("code", {
              required: "Verification code is required",

              pattern: {
                value: /^[0-9]+$/,
                message: "Code must be numeric",
              },
            })}
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>
        <Button
          type="submit"
          button_color="ocean"
          size="lg"
          className="w-full font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Account"}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <div className="text-sm text-slate-600">
          Didn't receive the code?{" "}
          <button
            type="button"
            className="text-cyan-600 hover:text-cyan-800 font-semibold transition-colors focus:outline-none focus:underline"
          >
            Resend Code
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          Back to{" "}
          <a
            href="/login"
            className="text-cyan-600 hover:text-cyan-800 font-semibold transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

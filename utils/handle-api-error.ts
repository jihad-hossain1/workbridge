import toast from "react-hot-toast";
import { style_error } from "./toast-style";

interface ApiErrorResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Handles API errors by displaying a toast message.
 * Priority:
 * 1. Validation errors (result.errors) - shows the first error message found.
 * 2. General error (result.error) - shows the error string.
 * 3. Default message - fallback if no specific error info is found.
 *
 * @param result The API response object containing error details
 * @param defaultMessage The fallback message to display if no specific error is found
 */
export const handleApiError = (
  result: ApiErrorResult | any,
  defaultMessage: string = "An error occurred"
) => {
  if (result?.errors) {
    const firstKey = Object.keys(result.errors)[0];
    const errorMessage = result.errors[firstKey]?.[0];
    if (errorMessage) {
      toast.error(errorMessage, style_error);
      return;
    }
  }

  if (result?.error) {
    toast.error(result.error, style_error);
    return;
  }

  toast.error(defaultMessage, style_error);
};

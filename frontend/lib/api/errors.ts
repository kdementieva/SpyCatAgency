import { ApiError } from "./client";

export const extractErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.data && typeof error.data === "object" && error.data !== null) {
      const entries = Object.entries(error.data as Record<string, unknown>);
      if (entries.length) {
        const first = entries[0];
        const value = first[1];
        if (Array.isArray(value) && value.length) {
          return String(value[0]);
        }
        if (typeof value === "string") {
          return value;
        }
      }
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

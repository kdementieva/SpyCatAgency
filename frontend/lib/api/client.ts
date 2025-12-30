import { unstable_noStore as noStore } from "next/cache";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const getBaseUrl = () => {
  let base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    base = "http://localhost:8000"
  }
  return base.replace(/\/$/, "");
};

type FetchOptions = RequestInit & { skipNoStore?: boolean };

export const apiFetch = async <T>(path: string, options: FetchOptions = {}) => {
  const { skipNoStore, ...rest } = options;

  if (!skipNoStore) {
    noStore();
  }

  const base = getBaseUrl();
  const url = `${base}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(rest.headers || {}),
  };

  const response = await fetch(url, { ...rest, headers });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "detail" in data && data.detail) ||
      "Request failed.";
    throw new ApiError(
      typeof message === "string" ? message : "Request failed.",
      response.status,
      data,
    );
  }

  return data as T;
};

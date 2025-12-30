import { apiFetch } from "./client";
import { Cat, CatPayload } from "../types/cat";

export const getCats = () => apiFetch<Cat[]>("/cat/", { skipNoStore: false });

export const createCat = (payload: CatPayload) =>
  apiFetch<Cat>("/cat/", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

export const updateCatSalary = (id: number, salary: string) =>
  apiFetch<Cat>(`/cat/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ salary }),
    cache: "no-store",
  });

export const deleteCat = (id: number) =>
  apiFetch<null>(`/cat/${id}/`, {
    method: "DELETE",
    cache: "no-store",
  });

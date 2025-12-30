"use client";

import { FormEvent, useState } from "react";
import { createCat } from "@/lib/api/cats";
import { extractErrorMessage } from "@/lib/api/errors";
import { Cat, CatPayload } from "@/lib/types/cat";

type Props = {
  onCreated: (cat: Cat) => void;
};

type FormState = {
  name: string;
  years_of_experience: string;
  breed: string;
  salary: string;
};

const initialForm: FormState = {
  name: "",
  years_of_experience: "",
  breed: "",
  salary: "",
};

const formLabel = "text-sm font-medium text-gray-700";
const formInput =
  "text-black mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm";

export default function CatForm({ onCreated }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: CatPayload = {
        name: form.name,
        breed: form.breed,
        salary: form.salary,
        years_of_experience: Number(form.years_of_experience),
      };

      const cat = await createCat(payload);
      onCreated(cat);
      setForm(initialForm);
      setSuccess("Cat added.");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Add Spy Cat</h2>
      <p className="mt-1 text-sm text-gray-600">
        Provide details and submit to create a new cat.
      </p>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className={formLabel} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            className={formInput}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={formLabel} htmlFor="years_of_experience">
            Years of Experience
          </label>
          <input
            id="years_of_experience"
            name="years_of_experience"
            type="number"
            min={0}
            className={formInput}
            value={form.years_of_experience}
            onChange={(e) =>
              setForm({ ...form, years_of_experience: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className={formLabel} htmlFor="breed">
            Breed
          </label>
          <input
            id="breed"
            name="breed"
            className={formInput}
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={formLabel} htmlFor="salary">
            Salary
          </label>
          <input
            id="salary"
            name="salary"
            type="number"
            min={0}
            step="0.01"
            className={formInput}
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Cat"}
          </button>

          {error && <span className="text-sm text-red-600">{error}</span>}
          {success && <span className="text-sm text-green-700">{success}</span>}
        </div>
      </form>
    </div>
  );
}

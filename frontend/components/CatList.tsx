"use client";

import { useMemo, useState } from "react";
import { deleteCat, updateCatSalary } from "@/lib/api/cats";
import { extractErrorMessage } from "@/lib/api/errors";
import { Cat } from "@/lib/types/cat";

type Props = {
  cats: Cat[];
  onChange: (cats: Cat[]) => void;
};

export default function CatList({ cats, onChange }: Props) {
  const [salaryDrafts, setSalaryDrafts] = useState<Record<number, string>>({});
  const [pending, setPending] = useState<Record<number, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => cats, [cats]);

  const setPendingFor = (id: number, value: boolean) =>
    setPending((prev) => ({ ...prev, [id]: value }));

  const handleSalarySave = async (cat: Cat) => {
    const nextSalary = salaryDrafts[cat.id] ?? cat.salary;
    setPendingFor(cat.id, true);
    setError(null);
    setMessage(null);

    try {
      const updated = await updateCatSalary(cat.id, nextSalary);
      onChange(rows.map((item) => (item.id === cat.id ? updated : item)));
      setMessage("Salary updated.");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setPendingFor(cat.id, false);
    }
  };

  const handleDelete = async (cat: Cat) => {
    const confirmed = window.confirm(
      `Delete ${cat.name}? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    setPendingFor(cat.id, true);
    setError(null);
    setMessage(null);

    try {
      await deleteCat(cat.id);
      onChange(rows.filter((item) => item.id !== cat.id));
      setMessage("Cat deleted.");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setPendingFor(cat.id, false);
    }
  };

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700 shadow-sm">
        No cats yet. Add the first one to get started.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Spy Cats</h2>
        <div className="text-sm">
          {message && <span className="text-green-700">{message}</span>}
          {error && <span className="text-red-600">{error}</span>}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Breed</th>
              <th className="px-4 py-3">Experience (years)</th>
              <th className="px-4 py-3">Salary</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((cat) => (
              <tr key={cat.id} className="align-middle">
                <td className="px-4 py-3 text-gray-900">{cat.name}</td>
                <td className="px-4 py-3 text-gray-700">{cat.breed}</td>
                <td className="px-4 py-3 text-gray-700">
                  {cat.years_of_experience}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="w-28 rounded border border-gray-300 px-2 py-1 text-sm focus:border-gray-600 focus:outline-none"
                      value={salaryDrafts[cat.id] ?? cat.salary}
                      onChange={(e) =>
                        setSalaryDrafts((prev) => ({
                          ...prev,
                          [cat.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => handleSalarySave(cat)}
                      disabled={pending[cat.id]}
                      className="rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={pending[cat.id]}
                    className="rounded border border-red-200 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

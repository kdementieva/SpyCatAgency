import CatsClient from "@/components/CatsClient";
import { getCats } from "@/lib/api/cats";

export const revalidate = 0;

export default async function CatsPage() {
  const cats = await getCats();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Cats Dashboard</h1>
      </header>

      <CatsClient initialCats={cats} />
    </main>
  );
}

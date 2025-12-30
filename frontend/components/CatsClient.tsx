"use client";

import { useState } from "react";
import CatForm from "./CatForm";
import CatList from "./CatList";
import { Cat } from "@/lib/types/cat";

type Props = {
  initialCats: Cat[];
};

export default function CatsClient({ initialCats }: Props) {
  const [cats, setCats] = useState<Cat[]>(initialCats);

  return (
    <div className="space-y-6">
      <CatForm
        onCreated={(cat) => {
          setCats((prev) => [...prev, cat]);
        }}
      />
      <CatList
        cats={cats}
        onChange={(next) => {
          setCats(next);
        }}
      />
    </div>
  );
}

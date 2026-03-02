"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import BikeCard from "@/components/BikeCard";
import type { Bike } from "@/types/hybike";
import { formatCategoryValue } from "@/types/hybike";

interface ProductGridProps {
  bikes: Bike[];
}

export default function ProductGrid({ bikes }: ProductGridProps) {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryValues = [
    ...new Set(bikes.map((b) => b.category?.value).filter(Boolean) as string[]),
  ];
  const categories = ["All", ...categoryValues];

  const param = searchParams.get("category") ?? "All";
  const activeCategory = categories.includes(param) ? param : "All";

  const filtered =
    activeCategory === "All"
      ? bikes
      : bikes.filter((b) => b.category?.value === activeCategory);

  function selectCategory(cat: string) {
    if (cat === "All") {
      router.push(`/${locale}/collection`);
    } else {
      router.push(`/${locale}/collection?category=${cat}`);
    }
  }

  return (
    <>
      {/* Filter Bar */}
      <section className="border-b border-primary">
        <div className="flex items-stretch overflow-x-auto">
          {categories.map((cat, i) => {
            const count =
              cat === "All"
                ? bikes.length
                : bikes.filter((b) => b.category?.value === cat).length;
            const label = cat === "All" ? "All" : formatCategoryValue(cat);
            return (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`px-6 py-4 uppercase tracking-[0.1em] transition-colors whitespace-nowrap ${
                  i < categories.length - 1 ? "border-r border-primary" : ""
                } ${
                  activeCategory === cat
                    ? "bg-primary text-secondary"
                    : "hover:bg-primary hover:text-secondary"
                }`}
                style={{ fontSize: "0.75rem", fontWeight: 700 }}
              >
                {label}
                <span
                  className={`ml-2 ${
                    activeCategory === cat ? "text-accent" : "text-muted"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {filtered.map((bike) => (
            <div key={bike.id} className="border-b border-primary">
              <BikeCard bike={bike} locale={locale} />
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="p-16 text-center">
            <p className="text-muted">No bikes found in this category.</p>
          </div>
        )}
      </section>
    </>
  );
}

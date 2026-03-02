"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import type { GetPageQuery } from "@/types/hygraph-generated";
import type { GetProductsQuery } from "@/types/hygraph-generated";
import type { Locale } from "@/lib/utils/locale";
import type { Bike } from "@/types/hybike";

type ProductShowcaseType = Extract<
  GetPageQuery["pages"][0]["sections"][0],
  { __typename?: "ProductShowcase" }
>;
type Product = GetProductsQuery["products"][0];

interface ProductShowcaseProps {
  section: ProductShowcaseType;
  locale: Locale;
  products: Product[];
}

export default function ProductShowcase({
  section,
  locale,
  products,
}: ProductShowcaseProps) {
  const searchParams = useSearchParams();

  if (products.length === 0) {
    return null;
  }

  const categoryValues = [
    ...new Set(
      products.map((b) => b.category?.value).filter(Boolean) as string[]
    ),
  ];
  const categories = ["All", ...categoryValues];
  const param = searchParams.get("category") ?? "All";
  const activeCategory = categories.includes(param) ? param : "All";

  const displayed =
    section.displayFilters && activeCategory !== "All"
      ? products.filter((b) => b.category?.value === activeCategory)
      : products;

  const cols =
    section.itemsPerRow === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="border-b border-primary">
      {section.displayFilters && (
        <ProductFilters categories={categories} products={products} />
      )}

      <div
        className={`grid ${
          section.displayFilters ? "grid-cols-1 md:grid-cols-2" : cols
        }`}
      >
        {displayed.map((product) => (
          <div
            key={product.id}
            className={section.displayFilters ? "border-b border-primary" : ""}
          >
            <ProductCard bike={product as unknown as Bike} locale={locale} />
          </div>
        ))}
      </div>

      {section.displayFilters && displayed.length === 0 && (
        <div className="p-16 text-center">
          <p className="text-muted">No bikes found in this category.</p>
        </div>
      )}
    </section>
  );
}

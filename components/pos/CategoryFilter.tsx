import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  activeId: string | null;
  onChange: (id: string | null) => void;
}

export function CategoryFilter({ categories, activeId, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-[transform,color,background-color] duration-[150ms] ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          activeId === null
            ? "bg-accent text-background"
            : "bg-surface-raised text-text-secondary hover:text-text-primary"
        )}
      >
        Semua
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={cn(
            "h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-[transform,color,background-color] duration-[150ms] ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            activeId === cat.id
              ? "bg-accent text-background"
              : "bg-surface-raised text-text-secondary hover:text-text-primary"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

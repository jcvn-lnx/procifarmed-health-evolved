import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, purposes } from "@/data/catalog";

export type ShopFilters = {
  q: string;
  category: string;
  purpose: string;
  min: string;
  max: string;
};

export function FiltersBar({ value, onChange }: { value: ShopFilters; onChange: (next: ShopFilters) => void }) {
  return (
    <div className="grid gap-4 rounded-xl border bg-card p-5 shadow-elev1 md:grid-cols-12">
      <div className="md:col-span-4">
        <Label className="text-xs text-muted-foreground">Busca</Label>
        <Input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Ex.: termômetro, vitaminas..."
        />
      </div>

      <div className="md:col-span-3">
        <Label className="text-xs text-muted-foreground">Categoria</Label>
        <Select value={value.category} onValueChange={(v) => onChange({ ...value, category: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-3">
        <Label className="text-xs text-muted-foreground">Finalidade</Label>
        <Select value={value.purpose} onValueChange={(v) => onChange({ ...value, purpose: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {purposes.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:col-span-2">
        <div>
          <Label className="text-xs text-muted-foreground">Preço mín.</Label>
          <Input value={value.min} onChange={(e) => onChange({ ...value, min: e.target.value })} placeholder="0" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Preço máx.</Label>
          <Input value={value.max} onChange={(e) => onChange({ ...value, max: e.target.value })} placeholder="999" />
        </div>
      </div>
    </div>
  );
}

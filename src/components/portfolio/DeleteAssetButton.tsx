"use client";

import { Trash2 } from "lucide-react";
import { deleteAsset } from "@/app/actions/assets";
import { toast } from "sonner";
import { useState } from "react";
import { useAssetStore } from "@/store/useAssetStore";

export function DeleteAssetButton({ id, type }: { id: number, type: "FD" | "Stock" | "Mutual Fund" }) {
  const [loading, setLoading] = useState(false);
  const { invalidate, fetchAssets } = useAssetStore();

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteAsset(id, type);
      invalidate();
      await fetchAssets(true);
      toast.success(`${type} deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors disabled:opacity-50"
      title="Delete Asset"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

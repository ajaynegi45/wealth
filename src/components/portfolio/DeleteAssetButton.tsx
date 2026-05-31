"use client";

import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { deleteAsset } from "@/app/actions/assets";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAssetStore } from "@/store/useAssetStore";

export function DeleteAssetButton({ id, type }: { id: number, type: "FD" | "Stock" | "Mutual Fund" }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { invalidate, fetchAssets } = useAssetStore();

  useEffect(() => setMounted(true), []);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteAsset(id, type);
      invalidate();
      await fetchAssets(true);
      toast.success(`${type} deleted successfully`);
      setIsOpen(false);
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={loading}
        className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors disabled:opacity-50 hover:cursor-pointer"
        title="Delete Asset"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-50 w-full max-w-[400px] rounded-2xl bg-card p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] duration-200 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">Delete Asset</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to permanently delete this {type}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded-sm text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-sm text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

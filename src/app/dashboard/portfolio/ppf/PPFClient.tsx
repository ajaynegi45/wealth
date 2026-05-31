"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Download, TrendingUp, AlertTriangle, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatINR } from "@/lib/formatters";
import { calculatePPFLedger, calculatePPFMaturity, getFinancialYear } from "@/lib/calculations/ppf";
import { addPPFTransaction, updatePPFTransaction, deletePPFTransaction } from "@/app/actions/assets";

export function PPFClient({ account }: { account: any }) {
  const [loading, setLoading] = useState(false);
  const [txType, setTxType] = useState<"Deposit" | "Withdrawal">("Deposit");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  function startEdit(entry: any, rawId: number) {
    setEditingId(rawId);
    setTxType(entry.type);
    setAmount(entry.amount.toString());
    setDate(format(new Date(entry.date), "yyyy-MM-dd"));
  }

  function cancelEdit() {
    setEditingId(null);
    setTxType("Deposit");
    setAmount("");
    setDate("");
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setLoading(true);
    try {
      await deletePPFTransaction(id);
      toast.success("Transaction deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  }

  const transactions = account.transactions.map((t: any) => ({
    ...t,
    transactionDate: new Date(t.transactionDate),
    type: t.type as 'Deposit'|'Withdrawal'
  }));

  const { ledger, currentBalance, totalInvested, totalInterest } = calculatePPFLedger(
    new Date(account.openingDate), 
    transactions
  );

  const maturityDate = calculatePPFMaturity(new Date(account.openingDate), account.extensionBlocks);
  const isMatured = new Date() >= maturityDate;

  const currentFY = getFinancialYear(new Date());
  const depositsThisFY = transactions
    .filter((t: any) => t.type === 'Deposit' && getFinancialYear(t.transactionDate) === currentFY)
    .reduce((sum: number, t: any) => sum + t.amount, 0);
  
  const limitRemaining = Math.max(0, 150000 - depositsThisFY);

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !date) return toast.error("Please fill all fields");
    
    setLoading(true);
    try {
      if (editingId) {
        await updatePPFTransaction(editingId, Number(amount), new Date(date), txType);
        toast.success("Transaction updated successfully");
        cancelEdit();
      } else {
        await addPPFTransaction(account.id, Number(amount), new Date(date), txType);
        toast.success("Transaction added successfully");
        setAmount("");
        setDate("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full max-w-7xl mx-auto pb-10 pt-4">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">PPF Account Ledger</h1>
          <p className="text-foreground/70 mt-1">Track your Public Provident Fund balance and history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card/50 border border-separator/30 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Current Balance</h3>
          <div className="text-3xl font-bold">{formatINR(currentBalance)}</div>
        </div>
        <div className="bg-card/50 border border-separator/30 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Total Invested</h3>
          <div className="text-3xl font-bold">{formatINR(totalInvested)}</div>
        </div>
        <div className="bg-card/50 border border-separator/30 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Total Interest Earned</h3>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-success">
              +{formatINR(totalInterest)}
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
        </div>
        <div className="bg-card/50 border border-separator/30 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Limit Remaining (FY {currentFY}-{currentFY+1})</h3>
          <div className="text-3xl font-bold">{formatINR(limitRemaining)}</div>
          <div className="w-full bg-muted mt-3 h-2 rounded-full overflow-hidden">
             <div className="bg-tint h-full" style={{ width: `${(depositsThisFY / 150000) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card border border-separator/30 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-separator/30 flex justify-between items-center bg-muted/20">
              <h2 className="font-bold text-lg">Transaction Ledger</h2>
            </div>
            {ledger.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No transactions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-left text-muted-foreground">
                      <th className="px-6 py-3 font-semibold">Date</th>
                      <th className="px-6 py-3 font-semibold">Description</th>
                      <th className="px-6 py-3 font-semibold text-right">Debit</th>
                      <th className="px-6 py-3 font-semibold text-right">Credit</th>
                      <th className="px-6 py-3 font-semibold text-right">Balance</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-separator/20">
                    {[...ledger].reverse().map((entry, idx) => (
                      <tr key={entry.id + idx} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">{format(new Date(entry.date), "dd MMM yyyy")}</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${entry.type === 'Interest' ? 'text-tint' : ''}`}>
                            {entry.description}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-destructive font-medium">
                          {entry.type === 'Withdrawal' ? formatINR(entry.amount) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right text-success font-medium">
                          {(entry.type === 'Deposit' || entry.type === 'Interest') ? formatINR(entry.amount) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-bold">
                          {formatINR(entry.balance)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {entry.id.startsWith('tx-') && (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => startEdit(entry, parseInt(entry.id.replace('tx-', '')))}
                                className="p-1.5 text-muted-foreground hover:text-tint hover:bg-tint/10 rounded-md transition-colors"
                                title="Edit Transaction"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(parseInt(entry.id.replace('tx-', '')))}
                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                title="Delete Transaction"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-card border border-separator/30 rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editingId ? "Edit Transaction" : "Add Transaction"}</h2>
              {editingId && (
                <button 
                  onClick={cancelEdit}
                  className="text-xs text-muted-foreground hover:text-foreground font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Type</label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setTxType('Deposit')}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${txType === 'Deposit' ? 'bg-tint text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    Deposit
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setTxType('Withdrawal')}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${txType === 'Withdrawal' ? 'bg-destructive text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    Withdrawal
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Amount (₹)</label>
                <input 
                  type="number" 
                  step="50"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 5000" 
                  className="flex h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:border-tint focus:ring-1 focus:ring-tint/20"
                />
                {txType === 'Deposit' && (
                  <p className="text-[11px] text-muted-foreground">Must be a multiple of ₹50.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:border-tint focus:ring-1 focus:ring-tint/20"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:bg-emerald-800 transition-all mt-2 disabled:opacity-50">
                {loading ? "Saving..." : (editingId ? "Update Transaction" : "Add Transaction")}
              </button>
            </form>
          </div>

          <div className="bg-muted/30 border border-separator/30 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Account Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-separator/20">
                <span className="text-muted-foreground">Opening Date</span>
                <span className="font-semibold">{format(new Date(account.openingDate), "dd MMM yyyy")}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-separator/20">
                <span className="text-muted-foreground">Maturity Date</span>
                <span className={`font-semibold ${isMatured ? 'text-destructive' : ''}`}>{format(maturityDate, "dd MMM yyyy")}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-separator/20">
                <span className="text-muted-foreground">Extensions</span>
                <span className="font-semibold">{account.extensionBlocks} block(s)</span>
              </div>
              {isMatured && (
                <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-warning-foreground">Account Matured</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Your PPF account has matured. You can extend it in blocks of 5 years.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

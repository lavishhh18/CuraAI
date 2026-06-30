import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AppShell from "../layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import EmptyState from "../components/ui/EmptyState";
import { useCuraTheme } from "../hooks/useCuraTheme";
import { useResponsive } from "../hooks/useMediaQuery";
import { copy } from "../cura/copy";
import { Wallet } from "lucide-react";
import api from "../api";

const CATEGORY_COLORS = {
  Food: "#EA580C", Transport: "#6366F1", Shopping: "#DB2777",
  Education: "#0D9488", Entertainment: "#059669", Others: "#78716C",
};

export default function FinancialWellness() {
  const { user } = useUser();
  const { c, input, btn } = useCuraTheme();
  const { isMobile } = useResponsive();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", category: "Food", type: "expense" });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/money/${user.id}`).then((res) => setTransactions(res.data.transactions || []));
  }, [user?.id]);

  const totalSpent = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const pieData = Object.entries(
    transactions.filter((t) => t.type === "expense").reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || "#78716C" }));

  const handleSave = async () => {
    if (!form.name || !form.amount) return;
    setLoading(true);
    try {
      await api.post("/money/", { clerk_id: user.id, name: form.name, amount: form.amount.toString(), category: form.category, type: form.type });
      const res = await api.get(`/money/${user.id}`);
      setTransactions(res.data.transactions || []);
      setForm({ name: "", amount: "", category: "Food", type: "expense" });
      setShowForm(false);
    } catch {
      alert("Unable to save transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <SectionHeader
        title={copy.finances.title}
        subtitle={copy.finances.subtitle}
        action={<Button onClick={() => setShowForm(!showForm)} style={{ background: c.finance }}>{copy.finances.add}</Button>}
      />

      {showForm && (
        <Card elevated style={{ marginBottom: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
            <div>
              <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Description</label>
              <input placeholder="e.g. Groceries" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={input} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Amount (₹)</label>
              <input type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={input} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={input}>
                {Object.keys(CATEGORY_COLORS).map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", color: c.textMuted, display: "block", marginBottom: "6px" }}>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={input}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <Button onClick={handleSave} disabled={loading} style={{ background: c.finance }}>{loading ? "Saving…" : "Save"}</Button>
          </div>
        </Card>
      )}

      <div className="cura-grid-auto" style={{ marginBottom: "20px" }}>
        {[
          { label: "Total spent", value: `₹${totalSpent.toLocaleString("en-IN")}` },
          { label: "Total income", value: `₹${totalIncome.toLocaleString("en-IN")}` },
          { label: "Net balance", value: `₹${(totalIncome - totalSpent).toLocaleString("en-IN")}` },
          { label: "Transactions", value: transactions.length },
        ].map(({ label, value }) => (
          <Card key={label} elevated>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: c.textMuted }}>{label}</p>
            <p style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: c.text, letterSpacing: "-0.02em" }}>{value}</p>
          </Card>
        ))}
      </div>

      <div className="cura-grid-2" style={{ marginBottom: "20px" }}>
        <Card>
          <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Spending by category</p>
          {pieData.length === 0 ? (
            <EmptyState icon={Wallet} title="No spending data" description={copy.finances.empty} action={<Button variant="soft" onClick={() => setShowForm(true)}>{copy.finances.add}</Button>} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${v}`} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {pieData.map(({ name, value, color }) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: c.textMuted, display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />{name}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: c.text }}>₹{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
        <Card>
          <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>Recent activity</p>
          {transactions.slice(0, 6).map((t) => (
            <div key={t.transaction_id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSubtle}` }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "500", color: c.text }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>{t.category}</p>
              </div>
              <span style={{ fontWeight: "600", fontSize: "14px", color: t.type === "income" ? c.success : c.danger }}>
                {t.type === "income" ? "+" : "−"}₹{t.amount}
              </span>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <p style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "600", color: c.text }}>All transactions</p>
        {transactions.length === 0 ? (
          <p style={{ color: c.textMuted, fontSize: "14px" }}>{copy.finances.empty}</p>
        ) : (
          transactions.map((t) => (
            <div key={t.transaction_id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${c.borderSubtle}` }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "500", color: c.text }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: c.textMuted }}>{t.category} · {new Date(t.date).toLocaleDateString("en-IN")}</p>
              </div>
              <span style={{ fontWeight: "600", color: t.type === "income" ? c.success : c.danger }}>
                {t.type === "income" ? "+" : "−"}₹{t.amount}
              </span>
            </div>
          ))
        )}
      </Card>
    </AppShell>
  );
}

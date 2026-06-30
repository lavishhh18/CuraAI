import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import api, { getUserProfile } from "../api";

export function useLifeData() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [healthLog, setHealthLog] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedBudget = localStorage.getItem("curaAIBudget");
  const monthlyBudget = storedBudget !== null && storedBudget.trim() !== "" ? Number(storedBudget) : null;

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    Promise.allSettled([
      getUserProfile(user.id).then((data) => {
        setProfile(data);
        localStorage.setItem("userProfile", JSON.stringify(data));
      }),
      api.get(`/money/${user.id}`).then((r) => setTransactions(r.data.transactions || [])),
      api.get(`/health/${user.id}/today`).then((r) => setHealthLog(r.data.log)),
      api.get(`/health/${user.id}`).then((r) => setHealthLogs(r.data.logs || [])),
      api.get(`/goals/${user.id}`).then((r) => setGoals(r.data.goals || [])),
      api.get(`/journal/${user.id}`).then((r) => setEntries(r.data.entries || [])),
    ]).finally(() => setLoading(false));
  }, [user?.id]);

  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const budgetLeft = monthlyBudget !== null ? Math.max(0, monthlyBudget - totalSpent) : null;
  const budgetRatio = monthlyBudget !== null && monthlyBudget > 0 ? (budgetLeft / monthlyBudget) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const todaySpent = transactions
    .filter((t) => t.type === "expense" && t.date?.startsWith(todayStr))
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const goalProgress = goals.length
    ? Math.round(goals.reduce((s, g) => s + (parseFloat(g.current || 0) / parseFloat(g.target || 1)) * 100, 0) / goals.length)
    : 0;

  const habits = healthLog?.habits || {};
  const habitsDone = Object.values(habits).filter(Boolean).length;
  const habitsTotal = Object.keys(habits).length || 5;

  const avgSleep = healthLogs.length
    ? healthLogs.reduce((s, l) => s + parseFloat(l.sleep_hours || 0), 0) / healthLogs.length
    : parseFloat(healthLog?.sleep_hours || 0);

  const wellnessScore = Math.round(
    Math.min(100, (
      (avgSleep >= 7 ? 25 : avgSleep >= 5 ? 15 : 5) +
      (habitsDone / habitsTotal) * 25 +
      (goalProgress / 100) * 25 +
      budgetRatio * 25
    ))
  );

  const localUser = JSON.parse(localStorage.getItem("curaAIUser") || "{}");
  const companionName = profile?.friend_name || localUser.friend_name || localUser.friendName || "Cura";

  return {
    loading,
    profile,
    transactions,
    healthLog,
    goals,
    entries,
    monthlyBudget,
    totalSpent,
    budgetLeft,
    todaySpent,
    goalProgress,
    habits,
    habitsDone,
    habitsTotal,
    wellnessScore,
    companionName,
    displayName: profile?.name || user?.firstName || "there",
  };
}

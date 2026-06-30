import {
  LayoutGrid,
  Sparkles,
  HeartPulse,
  Wallet,
  PenLine,
  Repeat,
  TrendingUp,
  BarChart3,
  Settings,
  MoreHorizontal,
} from "lucide-react";

export const NAV_ITEMS = [
  { path: "/overview", label: "Life Overview", shortLabel: "Overview", icon: LayoutGrid, group: "primary" },
  { path: "/companion", label: "Cura Companion", shortLabel: "Companion", icon: Sparkles, group: "primary", featured: true },
  { path: "/wellness", label: "Wellness", shortLabel: "Wellness", icon: HeartPulse, group: "primary" },
  { path: "/finances", label: "Financial Wellness", shortLabel: "Finances", icon: Wallet, group: "primary" },
  { path: "/reflections", label: "Reflections", shortLabel: "Reflect", icon: PenLine, group: "secondary" },
  { path: "/habits", label: "Habits", shortLabel: "Habits", icon: Repeat, group: "secondary" },
  { path: "/growth", label: "Personal Growth", shortLabel: "Growth", icon: TrendingUp, group: "secondary" },
  { path: "/insights", label: "Insights", shortLabel: "Insights", icon: BarChart3, group: "secondary" },
  { path: "/settings", label: "Settings", shortLabel: "Settings", icon: Settings, group: "secondary" },
];

export const MOBILE_TABS = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  { path: "/more", label: "More", shortLabel: "More", icon: MoreHorizontal, group: "mobile" },
];

export const LEGACY_REDIRECTS = {
  "/dashboard": "/overview",
  "/ai-companion": "/companion",
  "/health": "/wellness",
  "/money": "/finances",
  "/journal": "/reflections",
  "/goals": "/growth",
  "/reports": "/insights",
};

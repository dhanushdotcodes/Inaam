export const RANK_COLORS: Record<string, string> = {
  "Wanderer": "#6B7280",
  "Initiate": "#10B981",
  "Apprentice": "#38BDF8",
  "Spellbinder": "#8B5CF6",
  "Wizard": "#4F46E5",
  "Archmage": "#DC2626",
  "Oracle": "#F59E0B",
  "Mythic": "#06B6D4",
  "Ascendant": "#E5E7EB",
  "Chronomancer": "linear-gradient(135deg, #7C3AED, #06B6D4)",
};

export function getRankColor(rankName: string) {
  const baseName = rankName.split(" ")[0];
  return RANK_COLORS[baseName] || "#6B7280";
}

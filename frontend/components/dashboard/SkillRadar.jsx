"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function SkillRadar({ legacySkills = [], marketSkills = [] }) {
  // merge on skill name so legacy vs. target renders on the same axes
  const names = Array.from(new Set([...legacySkills, ...marketSkills].map((s) => s.skill)));
  const data = names.map((skill) => {
    const legacy = legacySkills.find((s) => s.skill === skill);
    const market = marketSkills.find((s) => s.skill === skill);
    return {
      skill,
      Legacy: legacy?.level ?? 0,
      "2026 target": market?.targetLevel ?? legacy?.level ?? 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#E3DFD1" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#6E6858" }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#B5AF9E" }} />
        <Radar name="Legacy skills" dataKey="Legacy" stroke="#6E6858" fill="#6E6858" fillOpacity={0.18} />
        <Radar name="2026 target" dataKey="2026 target" stroke="#E29A34" fill="#E29A34" fillOpacity={0.28} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E3DFD1", fontSize: 13 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

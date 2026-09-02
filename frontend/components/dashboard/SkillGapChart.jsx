"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SkillGapChart({ marketSkills = [] }) {
  const data = marketSkills.map((s) => ({
    skill: s.skill,
    "Current level": s.level,
    "2026 target": s.targetLevel,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E3DFD1" vertical={false} />
        <XAxis dataKey="skill" tick={{ fontSize: 11, fill: "#6E6858" }} interval={0} angle={-12} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 11, fill: "#6E6858" }} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #E3DFD1", fontSize: 13 }}
          cursor={{ fill: "#F1EEE3" }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Current level" fill="#2B4570" radius={[4, 4, 0, 0]} />
        <Bar dataKey="2026 target" fill="#E29A34" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

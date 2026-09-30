export const OVERALL = {
  id: "overall",
  name: "Overall Neuromarketing Score",
  value: 82,
} as const;

export const SIGNALS = [
  { id: "audience", name: "Audience Match Score", value: 78 },
  { id: "emotion", name: "Emotional Impact Score", value: 84 },
  { id: "attention", name: "Attention Score", value: 82 },
  { id: "memory", name: "Memory Retention Score", value: 71 },
  { id: "intent", name: "Purchase Intent Score", value: 69 },
  { id: "trend", name: "Trend Alignment Score", value: 74 },
] as const;

export const ATTENTION_CURVE = [
  0.22, 0.28, 0.31, 0.27, 0.24, 0.38, 0.52, 0.71, 0.86, 0.92, 0.78, 0.61, 0.44,
  0.33, 0.26, 0.21, 0.18, 0.16, 0.19, 0.28, 0.41, 0.58, 0.72, 0.81, 0.76, 0.68,
  0.55, 0.48, 0.42, 0.37, 0.33, 0.3,
] as const;

export type Campaign = {
  id: string;
  name: string;
  platform: string;
  objective: string;
  score: number;
  when: string;
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    name: "Monsoon Drop",
    platform: "Instagram",
    objective: "Brand awareness",
    score: 82,
    when: "Sample",
  },
  {
    id: "c2",
    name: "Festive Reel",
    platform: "YouTube",
    objective: "Purchase",
    score: 74,
    when: "Sample",
  },
  {
    id: "c3",
    name: "Launch Still",
    platform: "Facebook",
    objective: "Traffic",
    score: 69,
    when: "Sample",
  },
  {
    id: "c4",
    name: "Founder Cut",
    platform: "Instagram",
    objective: "Consideration",
    score: 77,
    when: "Sample",
  },
];

"use client";

import dynamic from "next/dynamic";

export const NeuralBackdrop = dynamic(
  () => import("./neural-scene").then((m) => m.NeuralScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-void" />,
  },
);

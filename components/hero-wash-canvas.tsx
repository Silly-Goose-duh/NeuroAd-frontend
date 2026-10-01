"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

/* One WebGL moment for the whole product, from ruucm/shadergradient.
   Brand colours only. Slow, grainy, behind a scrim. Not a second scene. */
export default function HeroWashCanvas({ animate }: { animate: "on" | "off" }) {
  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0 }}
      pixelDensity={1}
      fov={40}
      pointerEvents="none"
    >
      <ShaderGradient
        control="props"
        animate={animate}
        type="waterPlane"
        shader="defaults"
        uSpeed={0.07}
        uStrength={1.15}
        uDensity={1.1}
        uFrequency={5.2}
        uAmplitude={0.45}
        color1="#BE5205"
        color2="#1C1C1C"
        color3="#F59E0B"
        brightness={0.7}
        grain="on"
        lightType="3d"
        envPreset="city"
        reflection={0.12}
        cAzimuthAngle={180}
        cPolarAngle={115}
        cDistance={4.4}
        cameraZoom={1}
        positionY={0.35}
        rotationX={8}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  );
}

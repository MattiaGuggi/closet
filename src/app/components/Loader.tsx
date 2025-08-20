import { Html, useProgress } from "@react-three/drei";
import { useMemo } from "react";

export const Loader = () => {
  const { progress } = useProgress();

  const displayProgress = useMemo(
    () => progress.toFixed(0),
    [progress]
  );

  return (
    <Html className="absolute" center>
      Loading {displayProgress}%
    </Html>
  );
};

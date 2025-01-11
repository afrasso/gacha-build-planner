"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";

interface DebouncedProgressBarProps extends React.ComponentPropsWithoutRef<typeof Progress> {
  progressAnimationIncrement: number;
  progress: number;
}

const DebouncedProgressBar: React.FC<DebouncedProgressBarProps> = ({
  progress,
  progressAnimationIncrement,
  ...props
}) => {
  const [displayedProgress, setDisplayedProgress] = useState<number>(progress);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      if (displayedProgress < progress) {
        // If progress has been updated, increase the displayed progress by no more than the progressAnimationIncrement, but not past the current progress value.
        setDisplayedProgress((prev) => Math.min(prev + progressAnimationIncrement, progress));
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [progress, displayedProgress]);

  return <Progress value={displayedProgress} {...props} />;
};

export default DebouncedProgressBar;

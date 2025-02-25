"use client";

import { memo, useEffect, useState } from "react";
import Bubble from "./Bubble";

const BUBBLE_COUNT = 20; // 气泡数量

const BubbleContainer: React.FC = () => {
  const [bubbles, setBubbles] = useState<
    { id: number; text: string; number: number }[]
  >([]);

  useEffect(() => {
    const bubbles = Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
      id: i,
      text: `B${i + 1}`,
      number: BUBBLE_COUNT,
    }));

    setBubbles(bubbles);
  }, []);

  return (
    bubbles.length > 0 && (
      <div
        className="fixed bottom-16 sm:top-20 right-4 sm:right-6 
        w-full max-w-xs sm:max-w-md 
        h-auto min-h-[300px] max-h-[80vh] 
        flex items-center justify-center 
        cursor-pointer
        overflow-hidden"
      >
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} {...bubble} totalBubbles={BUBBLE_COUNT} />
        ))}
      </div>
    )
  );
};

export default memo(BubbleContainer);

import { motion } from "framer-motion";
import { useMemo } from "react";
import "./bubble.scss";

export interface BubbleProps {
  id: number;
  text: string;
  number: number;
  totalBubbles: number;
}

const Bubble: React.FC<BubbleProps> = ({ id, text, number }) => {
  const size = number * 50; // 气泡大小基于number
  const hue = Math.floor((id * 137) % 360); // 颜色
  const backgroundColor = `hsla(${hue}, 80%, 70%, 0.6)`; // 透明度 0.6

  // 使用 useMemo 避免每次渲染时重新计算
  const startX = useMemo(() => Math.random() * 200 - 100, []);
  const duration = useMemo(() => 5 + Math.random() * 3, []);
  const delay = useMemo(() => Math.random() * 2, []);
  
  return (
    <motion.div
      onClick={()=>{window.location.href =`/posts?tagid=${id}&tagname=${text}`}}
      initial={{ y: 200, opacity: 0, x: startX, scale: 0.8 }}
      animate={{
        y: -150,
        opacity: 1,
        x: startX + Math.random() * 30 - 15,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{
        duration,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "loop",
        delay,
      }}
      className="bubble"
      style={{
        width: size,
        height: size,
        backgroundColor,
        color: "#FAFAFA",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {text}
    </motion.div>
  );
};

export default Bubble;

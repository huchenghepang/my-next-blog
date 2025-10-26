"use client";
import { motion } from "framer-motion";

const INTPCharacter = () => {
  return (
    <div className="flex justify-center items-center">
      <motion.svg
        viewBox="0 0 300 300"
        width="250"
        height="250"
        animate={{
          y: [0, -50, 0], // 整个人上下跳跃
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* 头部（稍显凌乱的短发） */}
        <circle cx="150" cy="70" r="30" fill="#D1D5DB" />
        <motion.path
          d="M130 50 C135 40, 165 40, 170 50" // 头发的轮廓
          stroke="#333"
          strokeWidth="4"
          fill="none"
        />

        {/* 眼睛（深思模式） */}
        <circle cx="140" cy="75" r="4" fill="#333" />
        <circle cx="160" cy="75" r="4" fill="#333" />
        <motion.line
          x1="140"
          y1="85"
          x2="160"
          y2="85"
          stroke="#333"
          strokeWidth="2"
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 身体（黑色风衣 / 连帽衫） */}
        <rect x="130" y="100" width="40" height="80" rx="15" fill="#1F2937" />

        {/* 左手 */}
        <motion.rect
          x="90"
          y="120"
          width="30"
          height="10"
          rx="5"
          fill="#D1D5DB"
          animate={{
            rotate: [0, 10, 0], // 轻微摆动
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "right center" }}
        />

        {/* 右手（挥手动画） */}
        <motion.rect
          x="180"
          y="120"
          width="30"
          height="10"
          rx="5"
          fill="#D1D5DB"
          animate={{
            rotate: [0, -30, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.2,
          }}
          style={{ transformOrigin: "left center" }}
        />

        {/* 左腿 */}
        <motion.rect
          x="135"
          y="180"
          width="15"
          height="50"
          rx="7"
          fill="#374151"
          animate={{
            rotate: [0, 10, 0], // 跳跃时轻微晃动
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "top center" }}
        />

        {/* 右腿 */}
        <motion.rect
          x="155"
          y="180"
          width="15"
          height="50"
          rx="7"
          fill="#374151"
          animate={{
            rotate: [0, -10, 0], // 跳跃时轻微晃动
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "top center" }}
        />
      </motion.svg>
    </div>
  );
};

export default INTPCharacter;

import { motion } from "framer-motion";
import DigitalCounter from "./DigitalCounter";

export default function TeamCard({ team, score, color, progress }) {
  return (
    <motion.article
      className="team-card"
      style={{ borderColor: color, boxShadow: `0 0 36px ${color}55` }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <h2>{team}</h2>
      <div className="score" style={{ color }}>
        <DigitalCounter value={score} stepDelay={34} />
      </div>
      <div className="bar-track">
        <motion.div
          className="bar-fill"
          style={{ backgroundColor: color }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </motion.article>
  );
}

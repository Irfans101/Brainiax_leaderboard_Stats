import { motion } from "framer-motion";
import DigitalCounter from "./DigitalCounter";

export default function TeamCard({ team, score, color, progress, poster }) {
  const slug = team.toLowerCase();

  return (
    <motion.article
      className={`team-card team-card--${slug}`}
      style={{
        borderColor: color,
        boxShadow: `0 0 36px ${color}55`
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <img
        className="team-card__poster"
        src={poster}
        alt=""
        draggable={false}
      />

      <div className="team-card__score-slot" aria-label={`${team} sales`}>
        <DigitalCounter value={score} stepDelay={34} className="team-card__score" />
      </div>

      <div className="team-card__bar-track" aria-hidden="true">
        <motion.div
          className="team-card__bar-fill"
          style={{ backgroundColor: color }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </motion.article>
  );
}

import { motion } from "framer-motion";

export default function RoomCard({ room, onSelect }) {
  const price = room.price ?? room.pricePerNight ?? room.rate ?? 0;
  const capacity = room.capacity ?? room.maxGuests ?? room.guests ?? 2;

  return (
    <motion.article
      className="room-card"
      variants={{
        hidden: {
          opacity: 0,
          y: 35,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.35,
      }}
      onClick={onSelect}
    >
      {/* Ambient light */}
      <div className="room-card-light" />

      {/* Number */}
      <div className="room-number">
        {String(room.id).padStart(2, "0")}
      </div>

      {/* Room icon */}
      <motion.div
        className="room-symbol"
        whileHover={{
          scale: 1.08,
          rotate: -3,
        }}
      >
        ♜
      </motion.div>

      <div className="room-card-content">

        <p className="room-label">
          CASTLE CHAMBER
        </p>

        <h2>
          {room.name || `Chamber ${room.id}`}
        </h2>

        <p className="room-description">
          {room.description ||
            "A mysterious chamber hidden deep within Hotel Transylvania."}
        </p>

        <div className="room-meta">

          <div>
            <span>GUESTS</span>
            <strong>♟ {capacity}</strong>
          </div>

          <div>
            <span>PER NIGHT</span>
            <strong>₹{price}</strong>
          </div>

        </div>

        <motion.button
          className="room-button"
          whileHover={{
            x: 5,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
        >
          ENTER CHAMBER
          <span>→</span>
        </motion.button>

      </div>
    </motion.article>
  );
}
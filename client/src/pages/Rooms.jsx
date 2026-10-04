import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms");

        if (!response.ok) {
          throw new Error("Could not fetch rooms");
        }

        const data = await response.json();

        // Supports either:
        // [rooms]
        // or { rooms: [...] }
        setRooms(Array.isArray(data) ? data : data.rooms || []);
      } catch (err) {
        console.error(err);
        setError("The castle is currently hiding its rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <main className="rooms-page">

      {/* Background atmosphere */}
      <div className="rooms-glow rooms-glow-one" />
      <div className="rooms-glow rooms-glow-two" />

      {/* Header */}
      <motion.header
        className="rooms-header"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="section-eyebrow">THE CASTLE CHAMBERS</p>

        <h1>
          Choose Your
          <span>Chamber</span>
        </h1>

        <p className="rooms-description">
          Every room has a story.
          <br />
          Choose wisely. The castle remembers its guests.
        </p>
      </motion.header>

      {/* Loading */}
      {loading && (
        <div className="rooms-state">
          <div className="castle-loader">♜</div>
          <p>Unlocking the castle chambers...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rooms-state error-state">
          <div>🦇</div>
          <p>{error}</p>

          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}

      {/* Rooms */}
      {!loading && !error && (
        <motion.section
          className="rooms-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelect={() => navigate(`/rooms/${room.id}`)}
            />
          ))}
        </motion.section>
      )}

      {/* Empty */}
      {!loading && !error && rooms.length === 0 && (
        <div className="rooms-state">
          <div>🏰</div>
          <p>No chambers are available tonight.</p>
        </div>
      )}
    </main>
  );
}
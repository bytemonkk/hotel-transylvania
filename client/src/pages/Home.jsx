import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="home">
      {/* Background atmosphere */}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* Moon */}
      <div className="moon">
        <div className="moon-shadow" />
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="brand">HOTEL TRANSYLVANIA</div>

        <div className="nav-links">
          <span>HOME</span>
          <span>ROOMS</span>
          <span>THE CASTLE</span>
        </div>

        <button className="nav-button">ENTER CASTLE</button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <div className="established">EST. 1897</div>

          <div className="tagline">WHERE MONSTERS REST</div>

          <h1>
            HOTEL
            <span>TRANSYLVANIA</span>
          </h1>

          <p className="hero-description">
            Beyond the mountains lies a castle where the night never ends,
            legends live forever, and every room has a story.
          </p>

          <div className="hero-actions">
            <motion.button
              className="primary-button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              EXPLORE THE CASTLE
              <span>↗</span>
            </motion.button>

            <motion.button
              className="secondary-button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              VIEW ROOMS
            </motion.button>
          </div>
        </motion.div>

        {/* Castle emblem */}
        <motion.div
          className="castle-emblem"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3 }}
        >
          <div className="castle-symbol">♜</div>
        </motion.div>
      </section>

      {/* Residents */}
      <section className="residents">
        <div className="section-label">THE CASTLE FAMILY</div>

        <h2>MEET THE RESIDENTS</h2>

        <div className="residents-grid">
          <div className="resident-card">
            <span className="resident-number"></span>
            <span className="resident-role">THE COUNT</span>
            <h3>Dracula</h3>
            <p>Master of the castle and legendary host.</p>
          </div>

          <div className="resident-card">
            <span className="resident-number"></span>
            <span className="resident-role">THE HUMAN</span>
            <h3>Johnny</h3>
            <p>The unexpected guest who changed everything.</p>
          </div>

          <div className="resident-card">
            <span className="resident-number"></span>
            <span className="resident-role">THE DAUGHTER</span>
            <h3>Mavis</h3>
            <p>Curious, fearless and ready for adventure.</p>
          </div>

          <div className="resident-card">
            <span className="resident-number"></span>
            <span className="resident-role">THE LITTLE MONSTER</span>
            <h3>Dennis</h3>
            <p>The youngest member of the castle.</p>
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="closing">
        <div className="closing-line" />

        <p>HOTEL TRANSYLVANIA</p>

        <h2>
          Every monster
          <br />
          <em>needs a place to call home.</em>
        </h2>
      </section>
    </main>
  );
}

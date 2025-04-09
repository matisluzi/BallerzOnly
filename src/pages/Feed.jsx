import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { getGamesForDate, formatDateForAPI } from "../api";
import { motion, AnimatePresence } from "motion/react";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import DayView from "../components/DayView";

function Feed() {
  const [visibleDays, setVisibleDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(null); // 'up' or 'down' for animation direction
  const containerRef = useRef(null);

  // Initialize with 3 days (today, tomorrow, day after tomorrow)
  useEffect(() => {
    const today = new Date();
    const daysArray = [];

    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      daysArray.push({
        id: `day-${formatDateForAPI(date)}`, // Unique ID for animation
        date,
        games: [],
        loaded: false,
        expanded: false,
      });
    }

    setVisibleDays(daysArray);
    setIsLoading(false);
  }, []);

  // Load games for a specific day
  const loadGamesForDay = (index) => {
    const dayData = visibleDays[index];
    if (!dayData || dayData.loaded) return;

    setVisibleDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], loading: true };
      return updated;
    });

    getGamesForDate(dayData.date)
      .then((games) => {
        setVisibleDays((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            games: games || [], // Ensure we have an array even if games is undefined
            loaded: true,
            loading: false,
            expanded: true, // Auto-expand when games are loaded
            error: false,
          };
          return updated;
        });
      })
      .catch((error) => {
        console.error("Error loading games:", error);
        setVisibleDays((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            games: [],
            loaded: true,
            loading: false,
            error: true,
          };
          return updated;
        });
      });
  };

  // Toggle expansion of a day's games
  const toggleExpand = (index) => {
    if (!visibleDays[index].loaded) {
      loadGamesForDay(index);
    } else {
      setVisibleDays((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          expanded: !updated[index].expanded,
        };
        return updated;
      });
    }
  };

  // Show previous day
  const showPreviousDay = () => {
    setDirection("down");

    const firstVisibleDate = visibleDays[0].date;
    const previousDate = new Date(firstVisibleDate);
    previousDate.setDate(firstVisibleDate.getDate() - 1);

    const newDay = {
      id: `day-${formatDateForAPI(previousDate)}`, // Unique ID for animation
      date: previousDate,
      games: [],
      loaded: false,
      expanded: false,
    };

    setVisibleDays((prev) => [newDay, ...prev]);
  };

  // Show next day
  const showNextDay = () => {
    setDirection("up");

    const lastVisibleDate = visibleDays[visibleDays.length - 1].date;
    const nextDate = new Date(lastVisibleDate);
    nextDate.setDate(lastVisibleDate.getDate() + 1);

    const newDay = {
      id: `day-${formatDateForAPI(nextDate)}`, // Unique ID for animation
      date: nextDate,
      games: [],
      loaded: false,
      expanded: false,
    };

    setVisibleDays((prev) => [...prev, newDay]);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="container mx-auto mt-20 p-4">
      <NavBar />

      {/* Main content */}
      <h1 className="mb-6 text-2xl font-bold">NBA Games Feed</h1>

      {isLoading ? (
        <div className="flex justify-center">
          <p>Loading days...</p>
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-2">
          {/* Previous day button */}
          <button
            className="transform rounded-full bg-blue-100 p-1 transition-all hover:!scale-110 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
            onClick={showPreviousDay}
          >
            <CaretUp
              size={24}
              weight="bold"
              className="text-blue-800 dark:text-blue-200"
            />
          </button>

          <motion.div
            ref={containerRef}
            className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence initial={false}>
              {visibleDays.map((dayData, index) => (
                <DayView
                  key={dayData.id}
                  dayData={dayData}
                  index={index}
                  direction={direction}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Next day button */}
          <button
            className="transform rounded-full bg-blue-100 p-1 transition-all hover:!scale-110 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
            onClick={showNextDay}
          >
            <CaretDown
              size={24}
              weight="bold"
              className="text-blue-800 dark:text-blue-200"
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default Feed;

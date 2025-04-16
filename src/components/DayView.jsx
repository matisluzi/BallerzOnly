import React from "react";
import { motion, AnimatePresence } from "motion/react";
import GameBasketball from "./GameBasketball";

// Format date for display
function formatDateForDisplay(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

// Check if a date is today
function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

const DayView = ({ dayData, index, direction, onToggleExpand }) => {
  return (
    <motion.div
      key={dayData.id}
      variants={{
        hiddenDown: {
          y: -100,
          opacity: 0,
        },
        hiddenUp: {
          y: 100,
          opacity: 0,
        },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
          },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.2 },
        },
      }}
      initial={direction === "up" ? "hiddenUp" : "hiddenDown"}
      animate="visible"
      exit="exit"
      layout
      className={`border-b border-gray-200 p-4 dark:border-gray-600 ${
        isToday(dayData.date)
          ? "bg-slate-200/70 dark:bg-slate-800/35"
          : "bg-gray-50 dark:bg-neutral-800/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <h2
            className={`text-xl ${isToday(dayData.date) ? "font-bold" : "font-semibold"}`}
          >
            {formatDateForDisplay(dayData.date)}
          </h2>
          {isToday(dayData.date) && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-600 dark:bg-gray-700 dark:text-blue-100">
              Today
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleExpand(index)}
          className={`w-fit self-center rounded-md px-2 py-1 font-medium transition-colors ${
            dayData.loaded && dayData.expanded
              ? "bg-blue-300 hover:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600"
              : "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
          }`}
          disabled={dayData.loading}
        >
          {dayData.loading
            ? "Loading games..."
            : dayData.loaded && dayData.expanded
              ? "Hide Games"
              : dayData.loaded
                ? "Show Games"
                : "Load Games"}
        </button>
      </div>

      <AnimatePresence>
        {dayData.loaded && dayData.expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
          >
            {dayData.error ? (
              <div className="py-4 text-red-500">
                Error loading games for this date. Please try again later.
              </div>
            ) : dayData.games.length > 0 ? (
              <div className="flex flex-wrap gap-4 pt-4">
                {dayData.games.map((game) => (
                  <GameBasketball key={game.id} gameId={game.id} />
                ))}
              </div>
            ) : (
              <p className="py-4 text-gray-500">
                No games scheduled for this date.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DayView;

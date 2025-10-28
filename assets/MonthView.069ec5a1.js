/**
 * MonthView.vue - Renders a monthly calendar grid
 * Uses date-fns for date math, Vue 3 + JSX (h() render function)
 */

import {
  getYear,
  getMonth,
  startOfMonth,
  getDay,
  isToday,
  addMonths
} from "./vendor.b8623d82.js"; // date-fns assumed

import { useCalendarDate } from "./Calendar.0ee9814f.js";
import "./index.de5a9c43.js"; // Icons or utils

// Constants
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS_IN_LEAP_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper: Generate array of numbers from start (inclusive) to end (exclusive)
const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) result.push(i + 1);
  return result;
};

// CSS class names (BEM + hash scoped)
const CLASS = {
  monthView: "_monthView_zd8nz_1",
  weekday: "_weekday_zd8nz_12",
  weekend: "_weekend_zd8nz_13",
  day: "_day_zd8nz_19",
  dateNumber: "_dateNumber_zd8nz_44",
  thisMonth: "_thisMonth_zd8nz_56",
  today: "_today_zd8nz_62"
};

/**
 * MonthView Component
 * Renders 6 rows × 7 columns = 42 cells
 * Shows prev/next month overflow days in muted style
 */
export default function MonthView() {
  const [selectedDate] = useCalendarDate(); // Reactive date from parent
  const today = new Date();

  // Compute calendar grid data
  const {
    daysInPrevMonth,
    daysInThisMonth,
    daysInNextMonth
  } = getCalendarGrid(selectedDate.value);

  // Render a list of day cells
  const renderDays = (days, isCurrentMonth) =>
    days.map((day, index) => {
      const isTodayDate =
        selectedDate.value.getFullYear() === today.getFullYear() &&
        selectedDate.value.getMonth() === today.getMonth() &&
        isCurrentMonth &&
        day === today.getDate();

      return (
        <div
          key={`day-${index}-${day}-${selectedDate.value.getMonth()}`}
          class={{
            [CLASS.day]: true,
            [CLASS.today]: isTodayDate
          }}
        >
          <div
            class={{
              [CLASS.dateNumber]: true,
              [CLASS.thisMonth]: isCurrentMonth
            }}
          >
            {day}
          </div>
        </div>
      );
    });

  return (
    <div class={CLASS.monthView}>
      {/* Weekday headers */}
      {WEEKDAYS.map((day, index) => (
        <div
          key={day}
          class={index >= 5 ? CLASS.weekend : CLASS.weekday}
        >
          {day}
        </div>
      ))}

      {/* Render all days: prev + current + next */}
      {renderDays(daysInPrevMonth, false)}
      {renderDays(daysInThisMonth, true)}
      {renderDays(daysInNextMonth, false)}
    </div>
  );
}

// Named export
export { MonthView };

/**
 * Helper: Calculate days to display in 6×7 grid
 */
function getCalendarGrid(date) {
  const year = getYear(date);
  const month = getMonth(date); // 0–11
  const prevMonth = month === 0 ? 11 : month - 1;
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = isLeapYear ? DAYS_IN_LEAP_MONTH : DAYS_IN_MONTH;

  const firstDayOfMonth = startOfMonth(date);
  const firstWeekday = getDay(firstDayOfMonth); // 0=Sun, but we want Mon=0
  const startOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;

  const daysInCurrent = daysInMonth[month];
  const daysInPrev = daysInMonth[prevMonth];
  const totalCells = 42; // 6 rows × 7 days
  const remainingCells = totalCells - startOffset - daysInCurrent;

  return {
    daysInPrevMonth: range(daysInPrev - startOffset, daysInPrev),
    daysInThisMonth: range(0, daysInCurrent),
    daysInNextMonth: range(0, remainingCells)
  };
}

// External imports
import { _ as IconComponent, A as ArrowLeftIcon } from "./index.de5a9c43.js";
import {
  getCurrentInstance as getInstance,
  defineAsyncComponent as defineAsync,
  onMounted,
  ref,
  watch,
  toRefs,
  Teleport,
  Transition,
  Suspense as createSuspense,
  h,
  nextTick,
  onBeforeUnmount
} from "./vendor.b8623d82.js";

// CSS class names (BEM-style with hash for scoping)
const CLASS = {
  container: "_container_17mm3_1",
  titleBar: "_titleBar_17mm3_10",
  mainArea: "_mainArea_17mm3_19",
  calendarHeader: "_calendarHeader_17mm3_29",
  month: "_month_17mm3_36",
  year: "_year_17mm3_41",
  controlButtons: "_controlButtons_17mm3_45"
};

// Lazy-loaded view components
const DayView = defineAsync(() =>
  import("./DayView.3f60fbe5.js").then(m => ({ default: m.default }))
);

const MonthView = defineAsync(() =>
  import("./MonthView.069ec5a1.js").then(m => ({ default: m.default }))
);

const WeekView = defineAsync(() =>
  import("./WeekView.738355c2.js").then(m => ({ default: m.default }))
);

const YearView = defineAsync(() =>
  import("./YearView.838703ca.js").then(m => ({ default: m.default }))
);

// Default export: Calendar App Component
export default {
  name: "CalendarApp",

  setup() {
    // Reactive state from URL or store: current view mode
    const [viewMode] = toRefs(getInstance().appContext.config.globalProperties.$route?.params || { view: "month" });
    const currentView = ref(viewMode.value || "month");

    // Current selected date (reactive)
    const today = new Date();
    const [selectedDate, setSelectedDate] = ref(today);

    // Navigation: go to previous/next month
    const goToPrevious = () => {
      setSelectedDate(addMonths(selectedDate.value, -1));
    };

    const goToNext = () => {
      setSelectedDate(addMonths(selectedDate.value, 1));
    };

    const goToToday = () => {
      setSelectedDate(new Date());
    };

    return () => h("section", { class: CLASS.container },
      // Title bar (draggable area for native-like window)
      h("header", { class: [CLASS.titleBar, "app-window-drag-handle"] }),

      // Main content
      h("section", { class: CLASS.mainArea },
        h("div", { class: CLASS.calendarHeader },
          // Month & Year display
          h("div", null, [
            h("span", { class: CLASS.month }, format(selectedDate.value, "MMMM")),
            " ",
            h("span", { class: CLASS.year }, format(selectedDate.value, "yyyy"))
          ]),

          // Navigation controls
          h("div", { class: CLASS.controlButtons }, [
            h("button", { onClick: goToPrevious },
              h(ArrowLeftIcon, { size: 18, path: mdiChevronLeft })
            ),
            h("button", { onClick: goToToday }, "Today"),
            h("button", { onClick: goToNext },
              h(ArrowLeftIcon, { size: 18, path: mdiChevronRight })
            )
          ])
        ),

        // Dynamic view rendering with suspense fallback
        h(createSuspense, { fallback: h("div", "Loading...") }, [
          currentView.value === "year" && h(YearView),
          currentView.value === "month" && h(MonthView),
          currentView.value === "week" && h(WeekView),
          currentView.value === "day" && h(DayView)
        ])
      )
    );
  }
};

// Named export for module system
export { default as CalendarComponent } from "./this-file.js";
export { today as currentDateRef };

/**
 * AppsPlaceholder.vue
 * A dynamic "coming soon" screen for apps in a multi-app desktop suite
 * Uses Framer Motion for smooth spring animation on icon load
 */

import { h, Fragment } from "vue"; // h() render function
import { motion } from "framer-motion"; // Animated components
import { computed } from "vue";

const CLASS = {
  container: "_container_rcuip_1",
  titleBar: "_titleBar_rcuip_6",
  mainArea: "_mainArea_rcuip_14",
  img: "_img_rcuip_25"
};

/**
 * Apps Coming Soon Component
 * @param {Object} props
 * @param {string} props.appID - Folder name of app (e.g., "calendar", "notes")
 */
export default function AppsPlaceholder({ appID }) {
  // Dynamic icon path
  const iconSrc = computed(() =>
    `/assets/app-icons/${appID}/256.webp`
  );

  return () => h("section", { class: CLASS.container },
    // Draggable title bar (Tauri/Electron)
    h("header", { class: [CLASS.titleBar, "app-window-drag-handle"] }),

    // Main centered content
    h("section", { class: CLASS.mainArea },
      // Animated app icon
      h(motion.img, {
        class: CLASS.img,
        src: iconSrc.value,
        draggable: false,
        initial: { scale: 0, rotate: 180 },
        animate: { scale: 1, rotate: 360 },
        transition: {
          type: "spring",
          stiffness: 250,
          damping: 20
        }
      }),

      // Message
      h("h1", null, "Apps coming soon!")
    )
  );
}

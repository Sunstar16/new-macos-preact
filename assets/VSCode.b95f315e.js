/**
 * GitHub1sApp.vue
 * A native-like window that embeds GitHub1s (VS Code in browser)
 * Features: draggable title bar, iframe with dynamic drag styling
 */

import { h } from "vue";
import { clsx } from "clsx"; // Utility for conditional classes

const CLASS = {
  container: "_container_1lerz_1",
  iframe: "_iframe_1lerz_9",
  iframeDragged: "_iframeDragged_1lerz_14",
  header: "_header_1lerz_18"
};

/**
 * GitHub1s WebView Component
 * @param {Object} props
 * @param {boolean} props.isBeingDragged - Whether the window is being dragged
 */
export default function GitHub1sApp({ isBeingDragged }) {
  const iframeClass = clsx(
    CLASS.iframe,
    isBeingDragged && CLASS.iframeDragged
  );

  return () => h("section", { class: CLASS.container },
    // Draggable title bar (for Tauri/Electron)
    h("header", {
      class: [CLASS.header, "app-window-drag-handle"]
    }),

    // Full iframe container
    h("div", { style: { flex: 1, overflow: "hidden" } },
      h("iframe", {
        class: iframeClass,
        src: "https://github1s.com/puruvj/macos-web",
        frameborder: "0",
        allowfullscreen: true,
        sandbox: "allow-scripts allow-same-origin allow-modals allow-popups allow-forms",
        loading: "lazy"
      })
    )
  );
}

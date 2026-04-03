import { defineConfig } from "vitepress";

export default defineConfig({
  title: "My Docs",
  description: "A minimal VitePress site",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/getting-started" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Getting Started", link: "/guide/getting-started" }],
      },
    ],
  },
});

import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "My Docs",
  tagline: "Documentation made simple",
  url: "https://example.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: { defaultLocale: "en", locales: ["en"] },
  presets: [
    [
      "classic",
      {
        docs: { sidebarPath: "./sidebars.ts" },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: "My Docs",
      items: [{ type: "docSidebar", sidebarId: "docs", position: "left", label: "Docs" }],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

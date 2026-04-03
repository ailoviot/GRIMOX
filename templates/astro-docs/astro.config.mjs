import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      sidebar: [
        {
          label: "Guides",
          items: [{ label: "Getting Started", slug: "guides/getting-started" }],
        },
      ],
    }),
  ],
});

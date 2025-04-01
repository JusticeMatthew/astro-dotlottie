import tailwind from "@astrojs/tailwind";
import tailwindcss from "@tailwindcss/vite";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";

const { default: astroDotlottie } = await import("astro-dotlottie");

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		astroDotlottie(),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});

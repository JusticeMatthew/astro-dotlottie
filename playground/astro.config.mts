import tailwindcss from "@tailwindcss/vite";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";

const { default: astroDotlottie } = await import("astro-dotlottie");

// https://astro.build/config
export default defineConfig({
	integrations: [
		astroDotlottie({
			src: "assets/animations",
		}),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});

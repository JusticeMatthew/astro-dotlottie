import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";
import { getLottieScript } from "./script.js";

const toKebabCase = (str: string): string => {
	return str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();
};

const optionsSchema = z.object({
	src: z.string(),
	autoplay: z.boolean().default(true),
	loop: z.boolean().default(true),
	useHoverControls: z.boolean().default(false),
	containerPrefix: z.string().default("lottie-container-"),
	hoverPrefix: z.string().default("lottie-hover-"),
});

export const integration = defineIntegration({
	name: "astro-dotlottie",
	optionsSchema,
	setup({ options, name }): AstroIntegration {
		let rootDir: URL | undefined;
		const scriptContent = getLottieScript(options);

		return {
			name,
			hooks: {
				"astro:config:setup": (params) => {
					params.injectScript("page", scriptContent);
				},
				"astro:config:done": ({ config, logger }) => {
					rootDir = config.root;
					// Check for animations dir
					const animationsDir = new URL(`src/${options.src}/`, rootDir);
					try {
						fs.accessSync(fileURLToPath(animationsDir));
					} catch (err) {
						logger.warn(`Animations directory not found: ${animationsDir}`);
					}
				},
				"astro:build:done": ({ dir, logger }) => {
					const buildDir = new URL("animations/", dir);
					const srcDir = new URL(`src/${options.src}/`, rootDir);

					try {
						fs.mkdirSync(fileURLToPath(buildDir), { recursive: true });

						try {
							const files = fs.readdirSync(fileURLToPath(srcDir));
							let copiedCount = 0;

							for (const file of files) {
								if (file.endsWith(".lottie")) {
									const baseName = path.basename(file, ".lottie");
									const kebabName = toKebabCase(baseName);
									const newFileName = `${kebabName}.lottie`;

									fs.copyFileSync(
										path.join(fileURLToPath(srcDir), file),
										path.join(fileURLToPath(buildDir), newFileName),
									);
									copiedCount++;
								}
							}

							logger.info(
								`Copied ${copiedCount} animation files to build output`,
							);
						} catch (e) {
							logger.error(`Error copying animation files: ${e}`);
						}
					} catch (e) {
						logger.error(`Error creating animations directory: ${e}`);
					}
				},
			},
		};
	},
});

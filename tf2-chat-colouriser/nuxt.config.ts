export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	ssr: false,
	css: ["/assets/css/global.css",],
	modules: ["@vueuse/nuxt",],
	vite: {
		build: {
			rollupOptions: {
				output: {
					// https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
					sanitiseFileName(name: string) {
						// https://nuxt.com/docs/api/configuration/nuxt-config
						const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g;
						const DRIVE_LETTER_REGEX = /^[a-z]:/i;
						const match = DRIVE_LETTER_REGEX.exec(name);
						const driveLetter = match ? match[0] : "";

						return (
							driveLetter +
							name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
						);
					},
				},
			},
		},
	},
})

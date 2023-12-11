import { resolve } from 'path';
import { defineConfig } from 'vite';
import glob from 'glob';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
	root,
	publicDir: '../public/',
  	base: '/threejs-experiments/',
	build: {
		outDir,
		rollupOptions: {
			input: glob.globSync(resolve(__dirname, 'src', '**/*.html')),
		}
	},
});

import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import gzipPlugin from 'rollup-plugin-gzip';

import pkg from './package.json';

export default {
	input: 'src/index.tsx',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
		},
		{
			file: pkg.module,
			format: 'es',
		},
	],
	external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
	plugins: [
		babel({
			exclude: 'node_modules/**',
		}),
		typescript({
			typescript: require('typescript'),
		}),
		terser(),
		gzipPlugin(),
	],
};

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import externals from 'rollup-plugin-node-externals';

export default {
    input: './src/index.ts',
    output: {
        exports: 'named',
        file: './dist/index.js',
        format: 'cjs',
    },
    plugins: [
        externals({
            deps: true,
        }),
        nodeResolve(),
        commonjs({
            sourceMap: false,
        }),
        typescript({
            module: 'esnext',
        }),
    ],
};
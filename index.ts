import { makePackageJson } from './lib/package.js'

const cwd = process.cwd()
await makePackageJson(cwd)

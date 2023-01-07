import { init } from './lib/git.js'
import { makePackageJson } from './lib/package.js'

const cwd = process.cwd()
await init(cwd)
await makePackageJson(cwd)

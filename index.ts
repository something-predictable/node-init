import { init } from './lib/git.js'
import { installEnvPackage, makePackageJson } from './lib/package.js'

const cwd = process.cwd()
await init(cwd)
await makePackageJson(cwd)
installEnvPackage(cwd)

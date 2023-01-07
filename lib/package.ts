import { writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { vote } from './siblings.js'

const packageJson = {
    version: '0.0.1',
    type: 'module',
    private: true,
    engines: {
        node: '>=16',
    },
    scripts: {
        start: 'watch',
    },
}

export async function makePackageJson(path: string) {
    let name = basename(path)
    if (name.startsWith('node-')) {
        name = name.substring('node-'.length)
    }
    const scope = await vote(path, 'package.json', content => {
        const { name: sibling } = JSON.parse(content) as { name: string }
        const scopeIx = sibling.indexOf('/')
        if (scopeIx === -1 || !sibling.startsWith('@')) {
            return undefined
        }
        return sibling.substring(1, scopeIx)
    })
    if (scope) {
        name = `@${scope}/${name}`
    }

    await writeFile(
        join(path, 'package.json'),
        JSON.stringify(
            {
                name,
                ...packageJson,
            },
            undefined,
            '    ',
        ),
    )
}

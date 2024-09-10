import { mkdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { vote } from './siblings.js'

export async function init(path: string) {
    await mkdir(join(path, '.git/objects'), { recursive: true })
    await mkdir(join(path, '.git/refs'), { recursive: true })
    await writeFile(join(path, '.git/HEAD'), 'ref: refs/heads/main\n')
    const config = await vote(path, '.git/config', content => {
        const remotesAndUser = content
            .split('[')
            .filter(
                section => section.startsWith('remote "origin"]') || section.startsWith('user]'),
            )
        if (remotesAndUser.length === 0) {
            return
        }
        return '[' + remotesAndUser.join('[').replace(/(url\s*=.*\/)([^/]+)(\.git\n)/u, '$1%$3')
    })
    await writeFile(
        join(path, '.git/config'),
        `[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
${config?.replace('/%.git', `/${basename(path)}.git`) ?? ''}[branch "main"]
	remote = origin
	merge = refs/heads/main
`,
    )
}

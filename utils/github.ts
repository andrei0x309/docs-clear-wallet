import { base64Decode, createMDHeader } from './misc.ts';

const CONST = {
    username: 'andrei0x309',
    repo: 'clear-wallet'
}

export const getGithubFile = async ({
    username,
    repo,
    path,
    retry = 0
}: {
    username: string;
    repo: string;
    path: string;
    retry?: number
}): Promise<string> => {
    const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`
    const response = await fetch(url);
    const data = await response.text();
    const { content } = JSON.parse(data);
    let decodedContent;
    try {
        decodedContent = base64Decode(content);
    } catch {
        if (retry < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return getGithubFile({ username, repo, path, retry: retry + 1 });
        } else {
            console.error('Error decoding content from GitHub, retry limit exceeded');
        }
    }

    return decodedContent || '';
}

// title: FAQ
// group: getting-started
// description: Frequently asked questions
// templateEngine: njk,md
// type: docs
// pageOrder: 3

export const createChangeLog = async () => {
    const header = createMDHeader({
        title: 'Change Log',
        group: 'github',
        description: 'Change Log',
        templateEngine: 'njk,md',
        type: 'docs',
        pageOrder: 1,
        url: '/change-log'
    })

    const content = await getGithubFile({
        username: CONST.username,
        repo: CONST.repo,
        path: 'CHANGELOG.md'
    }) 

    return `${header}\n${content}`
}

export const writeChangeLog = async () => {
    const changeLog = await createChangeLog();
    await Deno.writeTextFile('./docs/automated-changelog.md', changeLog, {create: true});
}
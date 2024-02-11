import { base64Decode } from './misc.ts';

export const getGithubFile = async ({
    username,
    repo,
    path
}: {
    username: string;
    repo: string;
    path: string;
}) => {
    const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`
    const response = await fetch(url);
    const data = await response.text();
    const { content } = JSON.parse(data);
    return base64Decode(content)
}
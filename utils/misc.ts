export const createMDHeader = (
    {title, group, description, templateEngine, type, pageOrder, url }:
    {title: string, group: string, description: string, templateEngine: string, type: string, pageOrder: number, url: string}
) => {
return `---
title: ${title}
group: ${group}
description: ${description}
templateEngine: ${templateEngine}
type: ${type}
pageOrder: ${pageOrder}
#url: ${url}
---\n\n`
}

export const download = async (url: string, path: string ) => {
    const dir = path.split('/').slice(0, -1).join('/');
    await Deno.mkdir(dir, { recursive: true });
    const response = await fetch(url);
    const f = Deno.openSync(path, { write: true, create: true, createNew: true});
    await f.write(new Uint8Array(await response.arrayBuffer()));
    f.close();
}
  
export const writeDoc = async (docName: string, content: string) => {
    const path = `./docs/${docName}.md`;
    await Deno.writeTextFile(path, content, {create: true});
}


export const base64Decode = (str: string) => {
    return globalThis.atob(str);
}
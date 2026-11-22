import { mkdir, open, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const createMDHeader = ({
  title,
  group,
  description,
  templateEngine,
  type,
  pageOrder,
  url
}: {
  title: string;
  group: string;
  description: string;
  templateEngine: string;
  type: string;
  pageOrder: number;
  url: string;
}) => {
  return `---
title: ${title}
group: ${group}
description: ${description}
templateEngine: ${templateEngine}
type: ${type}
pageOrder: ${pageOrder}
#url: ${url}
---\n\n`;
};

export const download = async (url: string, path: string) => {
  const dir = dirname(path);
  if (dir && dir !== '.') {
    await mkdir(dir, { recursive: true });
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const fileHandle = await open(path, 'wx');
  try {
    await fileHandle.writeFile(bytes);
  } finally {
    await fileHandle.close();
  }
};

export const writeDoc = async (docName: string, content: string) => {
  const docsDir = './docs';
  const filePath = join(docsDir, `${docName}.md`);
  await mkdir(docsDir, { recursive: true });
  await writeFile(filePath, content, 'utf8');
};

export const base64Decode = (str: string) => {
  return Buffer.from(str, 'base64').toString('utf8');
};
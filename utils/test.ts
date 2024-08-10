import { createChangeLog } from './github.ts';

const changeLog = await createChangeLog();

console.log(changeLog);
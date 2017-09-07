import Dexie from 'dexie';

const db = new Dexie('myDb');
db.version(1).stores({
  stats: `[bucketKey+responseId+planId], [bucketKey+responseId], bucketKey`
});


export const readItems = (bucketKey, responseId) => db.stats
  .where('[bucketKey+responseId]').equals([bucketKey, responseId])
  .toArray();


export const saveItem = (bucketKey, responseId, planId, session) => {throw new Error('safe mode')}//db.stats.put({
//   bucketKey,
//   responseId,
//   planId,
//   session
// });

export const clearItems = (bucketKey, responseId) => {throw new Error('safe mode')}//db.stats.where('[bucketKey+responseId]').equals([bucketKey, responseId]).delete();

const getKey = bucketKey => `storage-service-${bucketKey}`;

const getBucket = (bucketKey) => JSON.parse(localStorage.getItem(getKey(bucketKey)));

export const saveItem = (bucketKey, id, session) => {

  const newValue = {...getBucket(bucketKey), [id]: session};
  localStorage.setItem(getKey(bucketKey), JSON.stringify(newValue));
};

export const readItems = (bucketKey) => getBucket(bucketKey);

export const clearItems = bucketKey => localStorage.removeItem(getKey(bucketKey));

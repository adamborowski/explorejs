export const loadResults = async()=>{

  const result = await fetch('/api/surveys');

  return result.json();

};

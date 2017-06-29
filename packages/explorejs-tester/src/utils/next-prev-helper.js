export default (items, currentItem, handle, cmp) => {

  const index = items.findIndex(cmp)

  const api = {
    canPrev: () => index > 0,
    canNext: () => index < items.length - 1,
    handlePrev: () => api.canPrev() && handle(items[index - 1]),
    handleNext: () => api.canNext() && handle(items[index + 1]),
  };
  return api;
};

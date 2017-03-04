export const getDialogs = (state) => state.dialogs;
export const getDialogById = (state, id) => getDialogs(state).find(a => a.id == id)

export default () => {
    const entries = [];

    return {
        addEntry(entry) {
            entries.push(entry);
        },
        getEntries() {
            return entries;
        }
    };
};

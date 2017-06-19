export const getScaleForLevel = (level, preferredUnitWidth) => level.step / preferredUnitWidth;
/**
 * What scale is required that given level aggregation will take exactly
 * @param levels
 * @param preferredUnitWidth
 */
export const getScalesForLevels = (levels, preferredUnitWidth) => levels.map(level => ({
    level,
    scale: getScaleForLevel(level, preferredUnitWidth)
}));

export const fitPrecalculatedLevelsForScale = (scale, scalesForLevels) => {
    for (let i = scalesForLevels.length - 1; i >= 0; i--) {
        const {level, scale: s} = scalesForLevels[i];

        if (scale >= s) {
            return level.id;
        }
    }
    return 'raw';
};

export const fitLevelForScale = (scale, levels, preferredUnitWidth) => {
    const scalesForLevels = getScalesForLevels(levels, preferredUnitWidth);

    return fitPrecalculatedLevelsForScale(scale, scalesForLevels);
};

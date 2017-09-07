/**
 * Preset representing set of options to configure explorejs library
 * @typedef {Object} ExplorejsPreset
 * @property {boolean} useCache if no, only simple mock is applied to data source and request manager
 * @property {boolean} usePrediction - if yes, uses additionally widercontextmodel, otherwise only basic with padding = 0
 * @property {boolean} useFallback - if yes - uses merges of dynamic projection, otherwise merge does not occur
 * @property {boolean} useMergingBatch - sets the MergingBatch, otherwise SimpleBatch
 */

import noCache from './configuration/no-cache';
import full from './configuration/full';
/**
 * Creates and configures explorejs library with various presets propagated to right modules as options
 * @param preset {ExplorejsPreset}
 * @returns {{}}
 */
export default (props, preset) => {

    if (preset.useCache === false) {
        return noCache(props, preset);
    }
    return full(props, preset);
};

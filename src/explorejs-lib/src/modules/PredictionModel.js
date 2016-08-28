/**
 * @property SerieCache {SerieCache} the cache which model should interact with
 */
export default class PredictionModel {

    /**
     *
     * @param SerieCache {SerieCache}
     * @param viewState {ViewState}
     */
    initialize(SerieCache, viewState) {
        this.SerieCache = SerieCache;
        this.viewState = viewState;
        this._enabled = true;
    }

    enable() {
        this._enabled = true;
    }

    disable() {
        this._enabled = false;
    }

    isEnabled() {
        return this._enabled;
    }

    update() {
        throw new Error("Prediciton model not yet implemented");
    }
}
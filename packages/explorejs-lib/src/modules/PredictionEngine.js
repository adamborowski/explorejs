export default class PredictionEngine {
    /**
     *
     * @param serieCache {SerieCache}
     * @param viewState {ViewState}
     */
    constructor(serieCache, viewState) {
        /**
         *
         * @type {PredictionModel[]}
         * @private
         */
        this._models = [];
        this.SerieCache = serieCache;
        this.viewState = viewState;
        viewState.addListener(this.onViewStateUpdate.bind(this));

    }

    /**
     *
     * @param model {PredictionModel}
     */
    addModel(model) {
        this._models.push(model);
        model.initialize(this.SerieCache, this.viewState);
    }

    addModels(models) {
        models.forEach(a => this.addModel(a));
    }

    removeModel(model) {
        const indexOf = this._models.indexOf(model);

        if (indexOf === 1) {
            throw new Error('Given model is not present in the engine.');
        }
        this._models.splice(indexOf, 1);
    }

    onViewStateUpdate(viewState) {
        if (this._models.length === 0) {
            throw new Error('There is no prediction models so no data will be gathered. You should provide BasicViewportModel at least.');
        }
        for (const model of this._models) {
            if (model.isEnabled()) {
                model.update();
            }
        }
    }

    destroy() {
        console.log('TODO: destroy predition engine');
    }

}

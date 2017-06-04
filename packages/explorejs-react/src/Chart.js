/**
 * A component which renders dom element for chart and instantiates adapter based on given type
 * We can set different type and serie cache at any time - it should reinitialize whole chart and adapter
 */
import React, {PropTypes} from 'react';
import adapterFactory, {types} from './AdapterFactory';
import {BasicViewportModel, RequestManager, WiderContextModel} from 'explorejs-lib';

export default class Chart extends React.Component {

    constructor() {
        super();
        this.state = {adapter: null, errorMessage: null};
    }

    render() {

        const {errorMessage} = this.state;

        if (errorMessage) {
            return <p>Explorejs error: {errorMessage}</p>;
        }

        return <div className="a-chart" ref={chart => {
            this.chart = chart;
        }}/>;
    }

    componentDidMount() {

        if (!this.context.explorejsRequestManager) {
            throw new Error('Chart has to be placed in context of ExploreJS context binding component from explorejs-react');
        }

        this._createAdapter();
    }

    /**
     * If adapterType or serieCache will change - destroy previous adapter and create new
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.adapter !== nextProps.adapter || this.props.serieId !== nextProps.serieId) {

            this._createAdapter();
        }
    }

    componentWillUnmount() {
        if (this.state.adapter) {
            this.state.adapter.destroy();
        }
    }

    async _createAdapter() {

        if (this.state.adapter) {
            this.state.adapter.destroy();
        }
        const {adapter, prediction, serieId} = this.props;

        if (!adapter || !prediction || !serieId) {
            return;
        }

        let serieCache;

        try {
            const requestManager = await this.context.explorejsRequestManager;

            serieCache = requestManager.CacheManager.getSerieCache(this.props.serieId);
        } catch (e) {
            this.setState({errorMessage: e.message});
        }

        if (serieCache) {
            const newAdapter = adapterFactory(adapter, serieCache, this.chart);

            newAdapter.dataSource.predictionEngine.addModels([ // todo get this from props!!
                new BasicViewportModel(),
                new WiderContextModel()
            ]);

            newAdapter.setDisplayedRange(new Date('2012-05-01').getTime(), new Date('2014-01-01').getTime());

            this.setState({adapter: newAdapter});

        }

    }

    static propTypes = {
        serieId: PropTypes.string,
        adapter: PropTypes.oneOf(types),
        prediction: PropTypes.arrayOf(PropTypes.string)
    };

    static contextTypes = {
        explorejsRequestManager: PropTypes.instanceOf(Promise)
    };
}


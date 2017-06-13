/**
 * A component which renders dom element for chart and instantiates adapter based on given type
 * We can set different type and serie cache at any time - it should reinitialize whole chart and adapter
 */
import React, {PropTypes} from 'react';
import adapterFactory, {types as chartTypes} from './AdapterFactory';
import predictionModelFactory, {types as predictionModelTypes} from './PredictionModelFactory';

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

        return <div className="a-chart" style={{width: '100%'}} ref={chart => {
            this.chart = chart;
        }}/>;
    }

    componentDidMount() {

        if (!this.context.explorejsRequestManager) {
            throw new Error('Chart has to be placed in context of ExploreJS context binding component from explorejs-react');
        }

        this._createAdapter(this.props);
    }

    /**
     * If adapterType or serieCache will change - destroy previous adapter and create new
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.adapter !== nextProps.adapter || this.props.serieId !== nextProps.serieId) {

            this._createAdapter(nextProps);
        }
    }

    componentWillUnmount() {
        if (this.state.adapter) {
            this.state.adapter.destroy();
        }
    }

    async _createAdapter(props) {

        let lastDisplayedRange = {start: props.initialStart.getTime(), end: props.initialEnd.getTime()};

        if (this.state.adapter) {
            lastDisplayedRange = this.state.adapter.getDisplayedRange();
            this.state.adapter.destroy();
        }
        const {adapter, prediction, serieId} = props;

        if (!adapter || !prediction || !serieId) {
            return;
        }

        let serieCache;

        try {
            const requestManager = await this.context.explorejsRequestManager;

            serieCache = requestManager.CacheManager.getSerieCache(props.serieId);
        } catch (e) {
            this.setState({errorMessage: e.message});
        }

        if (serieCache) {
            const newAdapter = adapterFactory(adapter, serieCache, this.chart);

            newAdapter.dataSource.predictionEngine.addModels(prediction.map(type => predictionModelFactory(type)));

            newAdapter.setDisplayedRange(lastDisplayedRange.start, lastDisplayedRange.end);

            this.setState({adapter: newAdapter});

        }

    }

    static propTypes = {
        serieId: PropTypes.string,
        adapter: PropTypes.oneOf(chartTypes),
        prediction: PropTypes.arrayOf(PropTypes.oneOf(predictionModelTypes)),
        initialStart: PropTypes.instanceOf(Date),
        initialEnd: PropTypes.instanceOf(Date)

    };

    static defaultProps = {
        initialStart: new Date('2013-05-01 00:00'),
        initialEnd: new Date('2013-05-01 01:00')
    };

    static contextTypes = {
        explorejsRequestManager: PropTypes.instanceOf(Promise)
    };
}


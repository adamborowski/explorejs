/**
 * A component which renders dom element for chart and instantiates adapter based on given type
 * We can set different type and serie cache at any time - it should reinitialize whole chart and adapter
 */
import React from 'react';
import PropTypes from 'prop-types';
import adapterFactory, {types as chartTypes} from './AdapterFactory';
import {predictionModelTypes} from 'explorejs-lib';

export default class Chart extends React.Component {
    static propTypes = {
        controlledViewState: PropTypes.object
    };

    static defaultProps = {
        controlledViewState: undefined
    };

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

        if (!this.context.explorejsConfiguration) {
            throw new Error('Chart has to be placed in context of ExploreJS context binding component from explorejs-react');
        }

        this._createAdapter(this.props);
        if (this.props.controlledViewState) {
            this.setRange(this.props.controlledViewState.range);
        }
    }

    setRange(range) {
        this.state.adapter && this.state.adapter.setDisplayedRange(range.start, range.end);
    }


    /**
     * If adapterType or serieCache will change - destroy previous adapter and create new
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.adapter !== nextProps.adapter || this.props.serieId !== nextProps.serieId) {

            this._createAdapter(nextProps);
        }
        if (this.props.controlledViewState !== nextProps.controlledViewState) {
            if (nextProps.controlledViewState) {
                this.setRange(nextProps.controlledViewState.range);
            }
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

        let dataSource;

        try {
            const config = await this.context.explorejsConfiguration;

            dataSource = config.createDataSource(props.serieId);
        } catch (e) {
            this.setState({errorMessage: e.message});
        }

        if (dataSource) {
            const newAdapter = adapterFactory(adapter, dataSource, this.chart);

            dataSource.setUpdateCallback(newAdapter.onProjectionRecompile);
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
        initialStart: new Date('1995-04-01 00:00'),
        initialEnd: new Date('1995-04-22 01:00')
    };

    static contextTypes = {
        explorejsConfiguration: PropTypes.instanceOf(Promise)
    };
}


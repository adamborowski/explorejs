/**
 * This component will initialize all necessary explorejs modules and put instance in component context so nested components can use it!!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CacheManager, RequestManager} from 'explorejs-lib';

class Deferred {
    constructor() {
        this.promise = new Promise((fulfill, reject) => {
            this.fulfill = fulfill;
            this.reject = reject;
        });
    }
}

export default class LocalBinding extends Component {

    constructor(props) {
        super(props);

        const requestManager = new RequestManager(props.manifest, props.batch);
        const cacheManager = new CacheManager();

        requestManager.CacheManager = cacheManager;
        cacheManager.RequestManager = requestManager;

        this.state = {requestManager, deferred: new Deferred()};

    }

    async componentDidMount() {
        const requestManager = await this.state.requestManager.ready();

        this.props.series.forEach(s => requestManager.CacheManager.createSerieCache({serieId: s}));

        this.state.deferred.fulfill(requestManager);
    }

    componentWillReceiveProps(newProps) {
        // TODO do we handle change of api/batch/series? maybe...
    }

    componentWillUnmount() {
        this.state.requestManager.destroy();
    }

    getChildContext() {
        return {
            explorejsRequestManager: this.state && this.state.deferred.promise
        };
    }

    render() {
        return React.Children.only(this.props.children);
    }

    static propTypes = {
        manifest: PropTypes.string,
        batch: PropTypes.string,
        series: PropTypes.arrayOf(PropTypes.string)
    };

    static childContextTypes = {
        explorejsRequestManager: PropTypes.instanceOf(Promise)
    };
}
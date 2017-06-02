/**
 * This component will initialize all necessary explorejs modules and put instance in component context so nested components can use it!!
 */
import {Component} from 'react';
import PropTypes from 'prop-types';
import {CacheManager, RequestManager} from 'explorejs-lib';

export default class LocalBinding extends Component {

    constructor(props) {
        super(props);
        this.initializeExploreJS();
    }

    initializeExploreJS() {

        const requestManager = new RequestManager();
        const cacheManager = new CacheManager();

        requestManager.CacheManager = cacheManager;
        cacheManager.RequestManager = requestManager;

        this.setState({requestManager});
    }

    componentDidMount() {
        this.state.requestManager.init(() => this.props.series.map(s => this.state.requestManager.CacheManager.createSerieCache({serieId: s})));
    }

    componentWillReceiveProps(newProps) {
        // TODO do we handle change of api/batch/series? maybe...
    }

    componentWillUnmount() {
        this.state.requestManager.destroy();
    }

    getChildContext() {
        return {
            explorejsRequestManager: this.state.requestManager
        };
    }

    render() {
        return this.props.children;
    }

    static propTypes = {
        manifest: PropTypes.string,
        batch: PropTypes.string,
        series: PropTypes.arrayOf(PropTypes.string)
    };

    static childContextTypes = {
        explorejsRequestManager: PropTypes.instanceOf(RequestManager)
    };
}

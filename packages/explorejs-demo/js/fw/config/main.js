/**
 *  Entrance of config
 *
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
import app from './AppConfig';
import notifier from './NotifierConfig';
import router from './RouterConfig';
import sso from './SSOConfig';

export default [
    app,
    notifier,
    router,
    sso
];

/**
 *
 *  Routes module expose route information used in home feature
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
import tpl from './partials/logs.html';

export default [
    {
        id: 'logs',
        isDefault: false,
        when: '/logs',
        controller: 'LogController as logController',
        template: tpl
    }
];

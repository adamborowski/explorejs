/**
 *
 *  Routes module expose route information used in home feature
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
import tpl from './partials/cacheDemo.html';

export default [
    {
        id: 'logs',
        isDefault: true,
        when: '/cache-demo',
        controller: 'CacheDemoController as controller',
        template: tpl
    }
];

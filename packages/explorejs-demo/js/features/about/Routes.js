/**
 *
 *  Routes module expose route information used in about feature
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
import tpl from './partials/about.html';

export default [
    {
        id: 'about',
        isDefault: false,
        when: '/about',
        controller: 'AboutController',
        template: tpl
    }
];

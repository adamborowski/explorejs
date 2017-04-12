/**
 *
 *  Routes module expose route information used in home feature
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
import tpl from './partials/home.html';

export default [
    {
        id: 'home',
        isDefault: false,
        when: '/home',
        controller: 'HomeController',
        template: tpl
    }
];

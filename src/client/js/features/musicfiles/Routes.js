/**
 *
 *  Routes module expose route information used in home feature
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
import tpl from './partials/musicFiles.html';

export default [
    {
        id: 'logs',
        isDefault: true,
        when: '/music-files',
        controller: 'ListController as listController',
        template: tpl
    }
];

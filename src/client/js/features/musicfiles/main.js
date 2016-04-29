/**
 * ******************************************************************************************************
 *
 *   Defines a logs feature
 *
 *  @author  aborowski
 *
 * ******************************************************************************************************
 */
'use strict';
import "./style/MusicFiles.less"
import "./style/player.less"
import FeatureBase from 'lib/FeatureBase';
import Routes from './Routes';

import MusicFileService from './service/MusicFileService';
import PlaybackService from './service/PlaybackService';
import FilterService from './service/FilterService';

import ListController from './controller/ListController';
import MusicFileController from './controller/MusicFileController';
import PlayerController from './controller/PlayerController';

import MusicFileDirective from './directive/MusicFileDirective';
import PlayerDirective from './directive/PlayerDirective';

class Feature extends FeatureBase {

    constructor() {
        super('musicfiles');
        this.routes = Routes;
    }

    execute() {
        this.controller('ListController', ListController);
        this.controller('MusicFileController', MusicFileController);
        this.controller('PlayerController', PlayerController);
        this.service('MusicFileService', MusicFileService);
        this.service('PlaybackService', PlaybackService);
        this.service('FilterService', FilterService);
        this.directive('musicFile', MusicFileDirective);
        this.directive('player', PlayerDirective);
    }
}

export default Feature;

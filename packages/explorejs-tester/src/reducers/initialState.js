export default {
  fuelSavings: {
    newMpg: '',
    tradeMpg: '',
    newPpg: '',
    tradePpg: '',
    milesDriven: '',
    milesDrivenTimeframe: 'week',
    displayResults: false,
    dateModified: null,
    necessaryDataIsProvidedToCalculateSavings: false,
    savings: {
      monthly: 0,
      annual: 0,
      threeYear: 0
    }
  },
  testing: {
    totalScore: 10,
    adminMode: false,
    answers:[
      {color: '#980400', key: -2}, // todo use from orm not from here - deprecated definition
      {color: '#aa891f', key: -1},
      {color: '#6e6d67', key: 0},
      {color: '#4fcc21', key: 1},
      {color: '#00a13b', key: 2},
    ],
    availableNetworkSpeed: [0, 1, 20, 50, 200, 1000],
    finalForm: {
      questions: [
        {type: 'range'},
        {type: 'text'},
        {type: 'text'},
        {type: 'range'},
        {type: 'text'},
        {type: 'range'},
        {type: 'range'},
        {type: 'range'},
        {type: 'range'},
        {type: 'text'},
        {type: 'text'},
        {type: 'text'}
      ]
    }
  },
  finalAnswers:{},
  notifications: [],
  throttleNetwork: true,
  networkSpeed: 50,
  adapter: 'flot'
  // testing: {
  //   totalScore: 10,
  //   scenarios: [
  //     {
  //       name: 'conf0',
  //       config: {cache: false, prediction: ['simple'], fallback: false, batching: 'simple'}
  //     },
  //     {
  //       name: 'conf1',
  //       config: {cache: false, prediction: ['simple'], fallback: false, batching: 'merging'}
  //
  //     },
  //     {
  //       name: 'conf2',
  //       config: {cache: true, prediction: ['simple'], fallback: false, batching: 'simple'}
  //
  //     },
  //     {
  //       name: 'conf3',
  //       config: {cache: true, prediction: ['simple'], fallback: false, batching: 'merging'}
  //
  //     },
  //     {
  //       name: 'conf4',
  //       config: {cache: true, prediction: ['simple'], fallback: true, batching: 'simple'}
  //
  //     },
  //     {
  //       name: 'conf5',
  //       config: {cache: true, prediction: ['simple'], fallback: true, batching: 'merging'}
  //
  //     },
  //     {
  //       name: 'conf6',
  //       config: {cache: true, prediction: ['simple', 'widerContext'], fallback: false, batching: 'simple'}
  //
  //     },
  //     {
  //       name: 'conf7',
  //       config: {cache: true, prediction: ['simple', 'widerContext'], fallback: false, batching: 'merging'}
  //
  //     },
  //     {
  //       name: 'conf8',
  //       config: {cache: true, prediction: ['simple', 'widerContext'], fallback: true, batching: 'simple'}
  //
  //     },
  //     {
  //       name: 'conf9',
  //       config: {cache: true, pediction: ['simple', 'widerContext'], fallback: true, batching: 'merging'}
  //     },
  //     {
  //       name: 'fullOptimization',
  //       config: {
  //         cache: true,
  //         fallback: true,
  //         prediction: ['basic', 'widerContext'],
  //         batching: 'merging'
  //       }
  //     }
  //   ],
  //   sessions: {
  //     // every user explorejs session recorded
  //     1234: {
  //       scenarioId: 'conf0',
  //       startTime: '2016-12-21 13:34:12',
  //       endTime: '2016-12-21 13:34:12',
  //       score: 4, // only one session can have score!!,
  //       recordedActions: [ // every user movement will trigger the action on the session and some reducer will push this action into recording... not sure if a good idea...
  //         {
  //           type: 'RECORD_SNAPSHOT',
  //           time: '2015-02-34 23:34:01.432',
  //           viewportWidth: 900, // the viewport height in this step
  //           viewportHeigth: 234,
  //           viewportStart: '2015-01-23 24:00',
  //           viewportEnd: '2015-03-20 14:00',
  //         }
  //       ]
  //     }
  //   },
  //   scoreConfirmQueue: [ // the array of actions which need confirmation to override previous session of the same scenario
  //     {
  //       type: 'SESSION_SCORE',
  //       sessionId: 12345,
  //       override: false, // if user clicks ok, copy this action but set override to true
  //       score: 134
  //     }//todo middleware for putting actions into queue
  //   ]
  // },
  // entities: {
  //   scenarios: {
  //     byId: {},
  //     allIds: [0, 1, 2, 3, 4, 5, 6, 7]
  //   },
  //   sessions: {
  //     byId: {
  //       0: {
  //         scenarioId: 0,
  //         startTime: '2016-12-21 13:34:12',
  //         endTime: '2016-12-21 13:34:12',
  //         score: 4, // only one session can have score!!,
  //         recordedActions: [ // every user movement will trigger the action on the session and some reducer will push this action into recording... not sure if a good idea...
  //           {
  //             type: 'RECORD_SNAPSHOT',
  //             time: '2015-02-34 23:34:01.432',
  //             viewportWidth: 900, // the viewport height in this step
  //             viewportHeigth: 234,
  //             viewportStart: '2015-01-23 24:00',
  //             viewportEnd: '2015-03-20 14:00',
  //           }
  //         ]
  //       }
  //     }
  //   }
  // }
  /**
   * {
    domainData1 : {},
    domainData2 : {},
    appState1 : {},
    appState2 : {},
    ui : {
        uiState1 : {},
        uiState2 : {},
    }
}
   */
};

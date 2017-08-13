import React from 'react';

import intro from './en_US.intro';

export default {
  languages: {
    pl_PL: 'Polish',
    en_US: 'English'
  },
  general: {
    configuration: 'Configuration',
    testConfigurations: 'Test configurations',
    title: 'ExploreJS interactive survey',
    beginSurvey: 'Begin survey',
    skipSurvey:'Skip introduction and begin survey',
    goToBase:'go to base version',
    scenarioIntro: (numScenarios) => `Now you have ${numScenarios} scenarios, you can pick them from the menu on the 
    left or by using contextual buttons that will appear below`,
    intro,
    nextPage:'Next page',
    prevPage:'Previous page'
  },
  menu: {
    survey: 'Survey',
    home: 'Introduction'
  },
  session: {
    finish: 'Finish and score',
    simulate: 'Simulate slow network',
    speed: 'Transmission speed',
    noThrottleWarning: 'Warning! Without throttling you may not notice the difference.',
    wrongOrderWarningHeader: 'Oh Snap!',
    wrongOrderWarning: conf => <div>You should look at <em>{conf}</em> configuration and score it first.</div>,
    instructions:{
      help:'Show help',
      header:'How to use a chart',
      zoom: <span>To zoom the chart in and out - use your mouse wheel or <kbd>&uarr;</kbd> <kbd>&darr;</kbd></span>,
      pan:
        <span>To pan the chart left and right - hold shift key, then use your mouse wheel or <kbd>&larr;</kbd> <kbd>&rarr;</kbd></span>,
      stepsHeader:'Pay attention to:',
      steps: <ul>
        <li>When moving horizontally, are you waiting for data to load?</li>
        <li>When going back to visited place, do you need to wait for data to load?</li>
        <li>When zooming-out, does the chart disappear when loading data?</li>
        <li>When zooming-out, do you loose context of place from which you moved away?</li>
        <li>When zooming-in to unvisited place, do you loose context of your movement?</li>
        <li>While waiting for data (after zooming-in or panning), do you notice low-detail shapes similar to data being loaded &mdash; does it help?</li>
        <li>After zooming-in to unvisited place, while panning, do you notice merge of data with differet resolution?</li>
      </ul>
    },
    expandInfo: 'Show description',
    collapseInfo: 'Hide description'
  },
  scenario: {
    back: 'Back',
    again: 'Test it again!',
    next: 'Next',
    pleasePutScore: 'Please, put a score for this configuration',
    clickButton: 'Click button below to experience visual exploration of large dataset with this configuration, then score it.',
    start: 'Start!'
  },
  finalForm: {
    header: 'Summary',
    placeholder: 'Write your answer',
    summarize: 'Summarize',
    intro: 'Here are some questions which will help to analyze results, please fill them all if you can.',
    send: 'Finish and send',
    questions: [
      {
        question: 'How satisfied are you with the given survey?',
        answers: ['I am bored', 'I am tired', 'I don\'t know', 'Nod bad', 'I am interested']
      },
      {question: 'Can you describe shortly, what the Problem is about?'},
      {question: 'Can you describe shortly, what does the solution try to solve?'},
      {
        question: 'Do you think that the Problem really exists?',
        answers: [
          'It is imaginary problem',
          'It exists but it does not need to be solved',
          'Hard to say',
          'It exists but we can deal with it',
          'Serious problem that needs to be solved'
        ]
      },
      {question: 'Do you know any existing solution solving the Problem?'},
      {
        question: 'How much the problem is similar to the problem existing in Google Maps example?',
        answers: ['Different', 'Almost no differences', 'Hard to say', 'Slightly different', 'It\'s the same']
      },
      {
        question: 'Did you face the Problem in the past?',
        answers: ['No at all', 'I guess not', 'not sure', 'sort of', 'Yes, I did']
      },
      {
        question: 'Do you expect to face the Problem in near (2 years) future',
        answers: ['No', 'I guess not', 'not sure', 'maybe', 'Yes']
      },
      {
        question: 'If you face the problem in your professional work, would you try to use ExploreJS?',
        answers: ['Oh no, why?', 'I would not be allowed', 'Hard to say', 'Yes, if allowed', 'Will do my best']
      },
      {question: 'What is needed to encourage you to use ExploreJS in your professional work when you face the Problem'},
      {question: 'Any additional comments regarding ExploreJS?'},
      {question: 'Your name (if I know you)'},
    ]
  },
  send: {
    error: message => `Unable to send the response. ${message}`
  },
  greetings:{
    header:'Thanks :)',
    body:'Thanks for your participation. Have a nice day!'
  }
};

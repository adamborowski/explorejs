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
    goToBase:'go to base version',
    scenarioIntro: (numScenarios) => `Now you have ${numScenarios} scenarios, you can pick them from the menu on the 
    left or by using contextual buttons that will appear below`,
    intro,
    nextPage:'Next page',
    prevPage:'Previous page'
  },
  menu: {
    survey: 'Survey',
    home: 'Home'
  },
  session: {
    finish: 'Finish and score',
    simulate: 'Simulate slow network',
    speed: 'Network speed',
    noThrottleWarning: 'Warning! Without throttling you may not notice the difference.',
    wrongOrderWarningHeader: 'Oh Snap!',
    wrongOrderWarning: conf => <div>You should look at <em>{conf}</em> configuration and score it first.</div>,
    instructions:{
      help:'Show help',
      header:'How to use a chart',
      zoom:'To zoom the chart in and out - use your mouse wheel',
      pan:'To pan the chart left and right - hold shift key, then use your mouse wheel',
      stepsHeader:'Navigation suggestions',
      steps: <ol>
        <li>pan right and left few times back and forth several times</li>
        <li>zoom out to see all the data</li>
        <li>zoom in few times</li>
        <li>pan in one direction few times</li>
        <li>zoom in to see raw data</li>
        <li>zoom out again to see all data</li>
      </ol>
    }
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
  }
};

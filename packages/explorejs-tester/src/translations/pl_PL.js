import React from 'react';
import intro from './pl_PL.intro';

export default {
  languages: {
    pl_PL: 'Polski',
    en_US: 'Angielski'
  },
  general: {
    configuration: 'Konfiguracja',
    testConfigurations: 'Konfiguracje testowe',
    title: 'ExploreJS interaktywna ankieta',
    beginSurvey: 'Przejdź do ankiety',
    goToBase: 'Przejdź do wersji podstawowej',
    scenarioIntro: (numScenarios) => `Zostanie przedstawionych ${numScenarios} różnych wersji komponentu, każda z 
    nich dostępna jest z menu po lewej stronie. Można też używać przycisków nawigacji, które pojawią się w dolnej części strony.`,
    intro
  },
  menu: {
    survey: 'Ankieta'
  },
  session: {
    finish: 'Zakończ i oceń',
    simulate: 'Symuluj wolne połączenie',
    speed: 'Prędkość połączenia',
    wrongOrderWarningHeader: 'Uwaga!',
    wrongOrderWarning: conf => <div>Proszę najpierw ocenić konfigurację <em>{conf}</em>.</div>
  },
  scenario: {
    back: 'Poprzednia',
    again: 'Jeszcze raz',
    next: 'Następna',
    pleasePutScore: 'Proszę ocenić tę konfigurację',
    clickButton: 'Naciśnij poniższy przycisk, aby użyć tej konfiguracji do eksploracji wielkich wielkiego zbioru danych, następnie oceń ją.',
    start: 'Rozpocznij'
  }
};

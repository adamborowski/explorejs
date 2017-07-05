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
    wrongOrderWarning: conf => <div>Proszę najpierw uruchomić konfigurację <em>{conf}</em>.</div>
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

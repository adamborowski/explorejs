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
    intro,
    nextPage:'Dalej',
    prevPage:'Wstecz'
  },
  menu: {
    survey: 'Ankieta',
    home:'Wprowadzenie'
  },
  session: {
    finish: 'Zakończ i oceń',
    simulate: 'Symuluj wolne połączenie',
    speed: 'Prędkość połączenia',
    noThrottleWarning: 'Uwaga! Bez symulacji wolnego łącza możesz nie dostrzeć różnicy.',
    wrongOrderWarningHeader: 'Uwaga!',
    wrongOrderWarning: conf => <div>Proszę najpierw ocenić konfigurację <em>{conf}</em>.</div>,
    instructions:{
      help:'Pokaż pomoc',
      header:'Instukcja nawigacji',
      zoom:<span>przybliżanie/oddalanie (zoom) - użyj kółka myszy lub <kbd>&uarr;</kbd> <kbd>&darr;</kbd></span>,
      pan:<span>przechodzenie w lewo/prawo (panning) - użyj kółka myszy z wciśniętym przyciskiem SHIFT lub <kbd>&larr;</kbd> <kbd>&rarr;</kbd></span>,
      stepsHeader:'Sugerowana nawigacja',
      steps: <ol>
        <li>idź w prawo jakiś czas i z powrotem w lewo, kilka razy</li>
        <li>oddal się aby zobaczyć wszystkie dane</li>
        <li>przybliż się kilka razy</li>
        <li>idź w jednym kierunku jakiś czas</li>
        <li>przybliż się by zobaczyć surowe dane</li>
        <li>oddal się z powrotem by zobaczyć wszystkie dane</li>
      </ol>
    },
    expandInfo: 'Pokaż opis',
    collapseInfo: 'Ukryj opis'
  },
  scenario: {
    back: 'Poprzednia',
    again: 'Jeszcze raz',
    next: 'Następna',
    pleasePutScore: 'Proszę ocenić tę konfigurację',
    clickButton: 'Naciśnij poniższy przycisk, aby użyć tej konfiguracji do eksploracji wielkich wielkiego zbioru danych, następnie oceń ją.',
    start: 'Rozpocznij'
  },
  finalForm: {
    header: 'Podsumowanie',
    placeholder: 'Wpisz odpowiedź',
    summarize: 'Do podsumowania',
    intro: 'Proszę odpowiedzieć na kilka pytań, które pomogą w analizowaniu wyników.',
    send: 'Zakończ i wyślij',
    questions: [
      {
        question: 'Jak podoba Ci sie ankieta?',
        answers: ['Znudziłem się', 'Jest męcząca', 'Ciężko stwierdzić', 'Nieźle', 'Zaciekawiła mnie']
      },
      {question: 'Możesz krótko opisać, jakie zagadnienie zostało tutaj poruszone?'},
      {question: 'Możesz krótko opisać, co jaki problem jest tu adresowany?'},
      {
        question: 'Czy uważasz, że problem w ogóle istnieje?',
        answers: [
          'Problem jest zmyślony',
          'Problem istnieje, ale nie ma potrzeby go rozwiązywać',
          'Ciężko stwierdzić',
          'Problem istenieje, ale można z tym żyć',
          'Poważny problem wymagający rozwiązania'
        ]
      },
      {question: 'Czy znasz inne rozwiązania tego problemu?'},
      {
        question: 'Jak bardzo ten problem podobny jest do tego w występującego w systemach typu Google Maps?',
        answers: ['Nie ma związku', 'Prawie bez związku','Ciężko stwierdzić', 'Lekko inny','To ten sam problem']
      },
      {
        question: 'Czy spotkałeś się z tym problem już wcześniej',
        answers: ['W ogóle nie', 'Chyba nie', 'Ciężko stwierdzić', 'Tak jakby', 'Tak, owszem']
      },
      {
        question: 'Czy spodziewasz się spotkać z tym problemem w niedalekiej przyszłości (2 lata)?',
        answers: ['Nie', 'Raczej nie', 'ciężko stwierdzić', 'może tak', 'Tak, owszem']
      },
      {
        question: 'Jeśli spotkasz ten problem w swojej pracy, czy chciałbyś użyć ExploreJS?',
        answers: ['Nie, w życiu', 'Nie będzie mi wolno', 'Ciężko stwiedzić', 'Tak, o ile będzie mi wolno', 'Zrobię wszystko, by skorzystać']
      },
      {question: 'Co jest potrzebne, by zachęcić Ciebie do używania ExploreJS w swojej pracy jeżeli zajdzie taka potrzeba?'},
      {question: 'Dodatkowe przemyślenia o ExploreJS?'},
      {question: 'Twoje imię/nick/nazwisko (jeżeli się znamy)'},
    ]
  }
};

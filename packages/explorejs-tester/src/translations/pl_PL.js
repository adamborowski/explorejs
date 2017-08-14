import React from 'react';
import intro from './pl_PL.intro';

export default {
  languages: {
    pl_PL: 'Polski',
    en_US: 'Angielski'
  },
  general: {
    configuration: 'Wersja',
    testConfigurations: 'Oceniane wersje',
    title: 'interaktywna ankieta ExploreJS',
    beginSurvey: 'Przejdź do ankiety',
    skipSurvey:'Pomiń wstęp i przejdź do ankiety',
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
    speed: 'Szybkość transmisji',
    noThrottleWarning: 'Uwaga! Bez symulacji wolnego łącza możesz nie dostrzeć różnicy.',
    wrongOrderWarningHeader: 'Uwaga!',
    wrongOrderWarning: conf => <div>Proszę najpierw ocenić konfigurację <em>{conf}</em>.</div>,
    instructions:{
      help:'Pokaż pomoc',
      header:'Instrukcja nawigacji',
      zoom:<span>przybliżanie/oddalanie (zoom) - użyj kółka myszy lub klawiszy <kbd>&uarr;</kbd> <kbd>&darr;</kbd></span>,
      pan:<span>przechodzenie w lewo/prawo (panning) - użyj kółka myszy z wciśniętym przyciskiem SHIFT lub klawiszy <kbd>&larr;</kbd> <kbd>&rarr;</kbd></span>,
      crop:<span>kadrowanie zakresu - zaznacz obszar lewym przyciskiem myszy</span>,
      stepsHeader:'Zwróć uwagę:',
      steps: <ul>
        <li>Czy poruszając się poziomo czekasz na załadowanie danych?</li>
        <li>Czy wracając do miejsc już odwiedzonych musisz ponownie czekać na załadowanie danych?</li>
        <li>Czy oddalając się nie znika wykres podczas ładowania?</li>
        <li>Czy oddalając się nie tracisz kontekstu miejsca, od którego się oddaliłeś?</li>
        <li>Czy przybliżając się do nieodwiedzonego miejsca nie tracisz kontekstu, w którym się poruszałeś?</li>
        <li>Czy czekając na załadowanie danych (przybliżając się lub przemieszczając w poziomie) dostrzegasz rozmyte obszary o przybliżonym kształcie &mdash; czy jest to pomocne?</li>
        <li>Czy, po przybliżeniu w nieodwiedzone miejsce, w czasie ruchu poziomego dostrzegasz łączenie obszarów o różnych rozdzielczościach?</li>
      </ul>
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
  },
  send: {
    error: message => `Nie udało się wysłać odpowiedzi. ${message}`
  },
  greetings:{
    header:'Dziękuję :)',
    body:'Dziękuję za udział w ankiecie. Miłego dnia!'
  }
};

import React from 'react';

// bootstrap.js
export default function bootstrap(schema) {
  // Get the empty state according to our schema.
  const state = schema.getEmptyState();

  // Begin a mutating session with that state.
  // `state` will be mutated.
  const session = schema.mutableSession(state);

  // Model classes are available as properties of the
  // Session instance.
  const {Scenario, Session} = session;


  /**
   * 1. simple no-cache
   * 2. simple cache - without fallback, no prediction, simple batch
   * 3. cache - add fallback
   * 4. cache - add prediction
   * 5. cache - add merging batch (a lot of queries there)
   */

  const ml = (en_US, pl_PL) => ({en_US, pl_PL});

  const meta = {
    baseQuestion: ml('Did you enjoy this visual exploration?', 'Jak ocenisz rozwiązanie podstawowe?'),
    baseAnswers: [
      {color: '#980400', key: -2, label: ml('It was a crap', 'Totalna porażka')},
      {color: '#aa891f', key: -1, label: ml('I expected something better', 'Spodziewałem się czegoś lepszego')},
      {color: '#6e6d67', key: 0, label: ml('I just works / hard to say', 'Po prostu działa / ciężko powiedzieć')},
      {color: '#4fcc21', key: 1, label: ml('I like it', 'Podoba mi się')},
      {color: '#00a13b', key: 2, label: ml('I don\'t need anything else', 'Nie trzeba mi niczego więcej')},
    ],
    question: ml('How do you compare this configuration to previous?', 'Jak porównasz tę konfigurację z poprzednią'),
    answers: [
      {color: '#980400', key: -2, label: ml('much worse', 'dużo gorsza')},//todo add color prop
      {color: '#aa891f', key: -1, label: ml('a little worse', 'nieznacznie gorsza')},
      {color: '#6e6d67', key: 0, label: ml('no difference / hard to say', 'bez różnicy / ciężko stwiedzić')},
      {color: '#4fcc21', key: 1, label: ml('slightly better', 'nieco lepsza')},
      {color: '#00a13b', key: 2, label: ml('incomparably better', 'nieporywnówalnie lepsza')},
    ]
  };

  const preset = (useCache = false, useFallback = false, usePrediction = false, useMergingBatch = false) => ({
    useCache,
    useFallback,
    usePrediction,
    useMergingBatch
  });

  // Start by creating entities whose props are not dependent
  // on others.
  const scenarioA = Scenario.create({
    id: 0, // optional. If omitted, Redux-ORM uses a number sequence starting from 0.
    name: {en_US: 'Basic', pl_PL: 'Bazowa'},
    description: ml(<p>
        Very simple solution.
        During navigation, it determines proper aggregation level and requests the server for whole displayed range.
        After getting response, it overwrites data on chart with data fetched from server.
        There is no reuse of already fetched data, however if you do zoom-in, you will
        see low resolution data during the fetch, because chart is not yet updated.
      </p>,
      <div>
        <p>Najprostsze rozwiązanie.
          Podczas nawigacji zostaje wyznaczony odpowiedni poziom agregacji do wyświetlenia, a do serwera zostaje
          wysyłane
          zapytanie o dane za cały nowy wyświetlany zakres.
          Po otrzymaniu odpowiedzi od serwera, stare dane na wykresie są w całości zastąpione nowymi danymi.
        </p>
        <p>
          W tym rozwiązaniu nie zastosowano w żadnym stopniu recyklingu uprzednio pobranych danych, mimo wrażenia, iż po
          wykonaniu
          przybliżenia
          <i> (zoom-in)</i> widzi się dane o niskiej rozdzielczości, co wynika tylko z faktu, że wykres nie został
          jeszcze
          aktualizowany i bazuje na poprzednich danych.
        </p>
      </div>
    ),
    preset: preset(),
    question: meta.baseQuestion,
    answers: meta.baseAnswers
  });
  const scenarioB = Scenario.create({
    id: 1, // optional.
    name: '+ Cache',
    description: ml(<p>
      More advanced solution.
      It gets proper aggregation level and requests the server for only part of displayed range,
      which is not already fetched, then it merges it with cached values.
      That way the cache grows as new requests are performed but actual chart is updated with data required to display,
      not all data in cache.
      It caches every aggregation level separately so it can reuse data only on same level of aggregation.
    </p>, <div>
      <p>
        Rozwiązanie nieco bardziej zaawansowane, pozwalające na recykling załadowanych wcześniej danych.
        Ponieważ nawigacja zazwyczaj zachowuje pewną ciągłość, między poprzednim a następnym zakresem występuje spora
        część wspólna, tak jak jest to w przypadku przesuwania zakresu w lewo czy w prawo.
      </p>
      <p>
        Podczas nawigacji zostaje wyznaczony odpowiedni poziom agregacji do wyświetlenia, ale do serwera zostaje
        wysyłane zapytanie tylko o tę część wyświetlanego zakresu, która nie była wcześniej załadowana, następnie scala
        nowe
        dane z istniejącymi w cache.
      </p>
      <p>
        W ten sposób liczba punktów w pamięci podręcznej rośnie z każdym żądaniem do serwera, ale same wykresy
        aktualizowane są danymi potrzebnymi do wyświetlenia aktualnego zakresu.
      </p>
      <p>
        Każdy poziom agregacji w pamięci podręcznej przechowywany jest osobno, co powoduje, że nie ma tu możliwości
        recyklingu danych z innego niż aktualnego poziomu agregacji. W momencie, gdy na skutek dopasowania poziomu
        agregacji do aktualnego przybliżenia nastąpi zmiana tego poziomu, wykres zostaje aktualizowany danymi z nowego
        poziomu w pamięci podręcznej tracąc wszystkie dane z poprzedniego poziomu cache.
      </p>
    </div>),
    preset: preset(true),
    question: meta.question,
    answers: meta.answers
  });
  const scenarioC = Scenario.create({
    id: 2, // optional.
    name: '+ Fallback',
    description: ml(
      <div>
        <p>
          The same as <strong>caching</strong> configuration but enables progressive display as it reuses data from any
          higher level of aggregation.
          It works like showing low-level resolution fragments on a geo map as a fallback when actual map is being
          loaded.
          For example, if you look at hours aggregations and you miss some part of data, it will fill the gap using data
          already fetched on higher level of aggregation, ie. day, month.
          This helps mostly when you do panning or you do zooming-in to the range which was partially visited before.

        </p>
        <p>
          Please note that reusing data from lower aggregations can crash the browser.
          For example if you visit a lot of data on low aggregation (so cache has tons of points on that level)
          and you zoom-out to see all data, the chart would be flooded with tons of points to draw.
          To prevent such situations, it fallbacks only to higher levels.
        </p>
      </div>,
      <div>
        <p>
          Rozwiązanie takie samo jak z <strong>cache</strong>, ale dodatkowo dzięki wykorzystywaniu danych z wyższych
          poziomów
          agregacji w pamięci podręcznej pozwala na progresywne wyświetlenie ładowanych danych.
        </p>
        <p>
          Działa na zasadzie wyświetlania niskiej rozdzielczości fragmentu mapy do czasu załadowania się właściwego
          kawałka.

          Dla przykłady, jeśli wyświetlane są agregacje godzinne i brakuje kilku punktów w cache, powstała luka zostanie
          zastąpiona fragmentem wcześniej załadowanych danych z wyższego poziomu, np. dnia czy miesiąca.

          To jest najbardziej pomocne podczas przesuwania czy przybliżania zakresu, który był wcześniej częściowo
          odwiedzony.

        </p>
        <p>
          Proszę zwrócić uwagę, że wykorzystanie danych z mniejszych poziomów agregacji może doprowadzić do awarii
          przeglądarki.
          Dla przykładu, jeżeli eksplorowano duży obszar w niskiej agregacji (co za tym idzie, w cache jest mnóstwo
          danych na tym poziomie) a następnie wykona się oddalenie, by zobaczyć cały obszar, wykres mógłby być zasilony
          zbyt wielką ilością danych do rysowania, nawet w ramach jednego piksela.
          Aby zapobiec tym sytuacjom, wykorzystywane są dane z pamięci podręcznej tylko z wyższych poziomów agregacji.
        </p>
      </div>
    ),
    preset: preset(true, true),
    question: meta.question,
    answers: meta.answers
  });
  const scenarioD = Scenario.create({
    id: 3, // optional.
    name: {en_US: '+ Prediction', pl_PL: '+ Predykcja'},
    description: ml(
      <div>
        <p>
          Same as <strong>cache+fallback</strong> but it prefetches data which may be needed in close future.
        </p>
        <ol>
          <li>
            It fetches data for additional <em>padding</em> to the left and right of visible range, so it helps mostly
            when
            you do panning
          </li>
          <li>
            If fetches some data on higher aggregation levels so it helps when you do zoom-out and change the level of
            aggregation to one of higher ones.
            This kind of prefetching addresses the problem that <strong>fallback</strong> does not get data from lower
            levels.
            So without this prediction the chart can be empty for a while during zoom-out.
          </li>
          <li>
            It recognizes common navigation pattern which is seamless panning to the one direction.
            In that case it loads more data in that direction (even more that in point 1) in advance.
          </li>
        </ol>
      </div>,
      <div>
        <p>
          Rozwiązanie takie samo jak z <strong>cache+fallback</strong>, ale dodatkowo ładowane są dane, które mogą być
          potrzebne w niedalekiej przyszłości. Jest to niejako wyjście na przeciw opóźnieniom sieci, gdyż w momencie,
          gdy użytkownik będzie ich potrzebował, dane będą już dostępne lub w trakcie pobierania z serwera.
        </p>
        <ol>
          <li>
            Ładowane są dodatkowo <em>marginesy</em> na lewo i prawo od wyświetlanego zakresu, by wyjść na przeciw
            nawigacji horyzontalnej (ang. <em>panning</em>).
          </li>
          <li>
            Ładowane są dodatkowo pewne zakresy danych na wyższych poziomach agregacji, co pomaga, gdy podczas oddalania
            wykres przełączy się na wyższy poziom agregacji w pamięci podręcznej.

            To niejako adresuje problem, że nie można wykorzystywać danych z niższego poziomu agreacji.
            Bez tej predykcji wykres może być pusty podczas oddalania się i przełączenia na wyższy poziom agregacji, do
            czasu załadowania właściwych danych.

          </li>
          {/*<li>*/}
          {/*Wykrywany jest często występujący wzór interakcji z wykresem polagający na ciągłym przesuwaniu wykresu w*/}
          {/*jednym kierunku. W tym przypadku zostanie załadowane więcej danych by nie generować wielu małych połączeń.*/}
          {/*</li>*/}
        </ol>

      </div>
    ),
    preset: preset(true, true, true),
    question: meta.question,
    answers: meta.answers
  });
  const scenarioE = Scenario.create({
    id: 4, // optional.
    name: {en_US: '+ Query Optimization', pl_PL: '+ Optymalizacja zapytań'},
    description: ml(
      <p>
        The same as <strong>cache+fallback+predicton</strong> but it optimizes
        queries sent to the server. For example, if a given range is being fetched
        and there is request for range which overlaps with given range, it will request for a subrange which does not
        overlap with already loading range.
        It can help when a database is slow and we should query as few data as possible.
      </p>,
      <p>
        Rozwiązanie takie samo, jak <strong>cache+fallback+predykcja</strong>, ale dodatkowo optymalizowane są zapytania
        do serwera.
        Na przykład, jeśli pobierany jest dany zakres z serwera i ma zostać pobrany zakres, który częściowo nakłada się
        z tym zakresem, do serwera zostanie wysłane zapytanie o tylko tę część zakresu, która nie jest aktualnie
        pobierana.
        To najbardziej powinno pomóc w przypadku, gdy odpytywanie bazy danych jest kosztowne i zawsze powinno pobierać
        się najmniej danych jak to możliwe.
      </p>
    ),
    preset: preset(true, true, true, true),
    question: meta.question,
    answers: meta.answers
  });

  // Session.create({
  //   scenario: scenarioA,
  //   score: 4,
  //   start: new Date('2017-01-02 13:45:24'),
  //   end: new Date('2017-01-02 13:51:14'),
  // });
  // Session.create({
  //   scenario: scenarioA,
  //   score: 0,
  //   start: new Date('2017-01-02 13:45:24'),
  //   end: new Date('2017-01-02 13:51:14'),
  // });
  // Session.create({
  //   scenario: scenarioA,
  //   score: -2,
  //   start: new Date('2017-01-02 13:45:24'),
  //   end: new Date('2017-01-02 13:51:14'),
  // });
  //
  // // Session.create({
  // //   scenario: scenarioB,
  // //   score: 2,
  // //   start: new Date('2017-01-02 13:45:24'),
  // //   end: new Date('2017-01-02 13:51:14'),
  // // });
  // Session.create({
  //   scenario: scenarioC,
  //   score: -1,
  //   start: new Date('2017-01-02 13:45:24'),
  //   end: new Date('2017-01-02 13:51:14'),
  // });
  // // Session.create({
  // //   scenario: scenarioD,
  // //   score: 0,
  // //   start: new Date('2017-01-02 13:45:24'),
  // //   end: new Date('2017-01-02 13:51:14'),
  // // });
  // Session.create({
  //   scenario: scenarioE,
  //   score: 2,
  //   start: new Date('2017-01-02 13:45:24'),
  //   end: new Date('2017-01-02 13:51:14'),
  // });

  return state;
}

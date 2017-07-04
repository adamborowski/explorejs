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
    answers:[
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
    description: () => (
      <p>
        Very simple solution.
        During navigation, it determines proper aggregation level and requests the server for whole displayed range.
        After getting response, it overwrites data on chart with data fetched from server.
        There is no reuse of already fetched data, however if you do zoom-in, you will
        see low resolution data during the fetch, because chart is not yet updated.
      </p>
    ),
    preset: preset(),
    question: meta.baseQuestion,
    answers:meta.baseAnswers
  });
  const scenarioB = Scenario.create({
    id: 1, // optional.
    name: '+ Cache',
    description: () => (
      <p>
        More advanced solution.
        It gets proper aggregation level and requests the server for only part of displayed range,
        which is not already fetched.
        It caches every aggregation level separately so it can reuse data only on same level of aggregation.
      </p>
    ),
    preset: preset(true),
    question: meta.question,
    answers:meta.answers
  });
  const scenarioC = Scenario.create({
    id: 2, // optional.
    name: '+ Fallback',
    description: () => (
      <div>
        <p>
          The same as <strong>caching</strong> configuration but enables progressive display as it reuses data from any higher level of aggregation.
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
      </div>
    ),
    preset: preset(true, true),
    question: meta.question,
    answers:meta.answers
  });
  const scenarioD = Scenario.create({
    id: 3, // optional.
    name: {en_US: '+ Prediction', pl_PL: '+ Predykcja'},
    description: () => (
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
      </div>
    ),
    preset: preset(true, true, true),
    question: meta.question,
    answers:meta.answers
  });
  const scenarioE = Scenario.create({
    id: 4, // optional.
    name: {en_US: '+ Query Optimization', pl_PL: '+ Optymalizacja zapytań'},
    description: () => (
      <p>
        The same as <strong>cache+fallback+predicton</strong> but it optimizes
        queries sent to the server. For example, if a given range is being fetched
        and there is request for range which overlaps with given range, it will request for a subrange which does not
        overlap with already loading range.
        It can help when a database is slow and we should query as few data as possible.
      </p>
    ),
    preset: preset(true, true, true, true),
    question: meta.question,
    answers:meta.answers
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

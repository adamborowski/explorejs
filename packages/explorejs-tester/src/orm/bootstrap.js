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

  // Start by creating entities whose props are not dependent
  // on others.
  const scenarioA = Scenario.create({
    id: 0, // optional. If omitted, Redux-ORM uses a number sequence starting from 0.
    name: 'Scenario A',
    preset: {useCache: false}
  });
  const scenarioB = Scenario.create({
    id: 1, // optional.
    name: 'Scenario B',
    preset: {useCache: true}
  });
  const scenarioC = Scenario.create({
    id: 2, // optional.
    name: 'Scenario C',
    preset: {useCache: true}
  });
  const scenarioD = Scenario.create({
    id: 3, // optional.
    name: 'Scenario D',
    preset: {useCache: true}
  });

  Session.create({
    scenario: scenarioA,
    score: 4,
    start: new Date('2017-01-02 13:45:24'),
    end: new Date('2017-01-02 13:51:14'),
  });
  Session.create({
    scenario: scenarioA,
    score: 0,
    start: new Date('2017-01-02 13:45:24'),
    end: new Date('2017-01-02 13:51:14'),
  });
  Session.create({
    scenario: scenarioA,
    score: 0,
    start: new Date('2017-01-02 13:45:24'),
    end: new Date('2017-01-02 13:51:14'),
  });

  Session.create({
    scenario: scenarioB,
    score: 2,
    start: new Date('2017-01-02 13:45:24'),
    end: new Date('2017-01-02 13:51:14'),
  });

  return state;
}

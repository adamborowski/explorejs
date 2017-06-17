/**
 * Function that iterates over generator and supplies batchers
 * @param generator {function*} generator which produces values to supply batchers with
 * @param batchers {function[]} array of batchers supplied with generated values
 * @param lockFactory {function:Promise} a factory which returns a promise that batch job has to wait for before going to next step
 */
module.exports = async (generator, batchers, lockFactory) => {

    let gen = generator.next();

    batchers.forEach(b => b.next());

    while (!gen.done) {
        batchers.forEach(b => b.next(gen.value));

        await lockFactory();

        gen = generator.next();
    }

    batchers.forEach(b => b.return());
};

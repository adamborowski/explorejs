/**
 * Function that iterates over generator and supplies batchers
 * @param generator {function*} generator which produces values to supply batchers with
 * @param batchers {function[]} array of batchers supplied with generated values
 */
module.exports = (generator, batchers) => {

    let gen = generator.next();

    while (!gen.done) {
        batchers.forEach(b => b.next(gen.value));
        gen = generator.next();
    }

    batchers.forEach(b => b.return());
};

/**
 * An utility which manages 'producer' tasks and 'result' tasks pipeline.
 *
 * It defers execution of new 'producer' task to time when there is no more than given number of 'result' tasks being executed.
 *
 * It means that if there are a few 'result' tasks executed, you can start new 'producer'.
 * But if there are too many 'result' tasks executed, you have to wait to start new 'producer' task.
 *
 * This prevents from starving resources used in 'result' tasks when producer is faster than result.
 *
 * @example consider reading-sending pipeline. When you produce data to send somewhere, your producer is extremally fast
 * and it may occur that all produced data is loaded into memory and you end up with thousands of open http requests
 * where no one is finished.
 *
 * To solve this problem we have to await producing data when previous data has been sent.
 *
 * Producer tasks are started externally by awaiting special promise, exposed by canProduce() method,
 * which is resolved once there are no more than given number of 'result' tasks.
 * As a result of producer task, any number of 'result' task may be created which have to be registered using registerResultTask() method.
 *
 */
module.exports = (maxResultTasks) => {

    let numResults = 0;
    let resolve = () => null; // noop
    let promise = Promise.resolve();

    const api = {
        canProduce: () => promise,
        registerResultTask(task) {
            numResults++;
            if (numResults === maxResultTasks) {
                promise = new Promise((_resolve, _reject) => {
                    resolve = _resolve;
                });
            }
            task.then(() => {
                numResults--;
                if (numResults === maxResultTasks - 1) {
                    resolve();
                }
            });
        },
        wrapResultFunction: fun => (...args) => {
            const task = fun(...args);

            api.registerResultTask(task);
            return task;
        }
    };

    return api;
};

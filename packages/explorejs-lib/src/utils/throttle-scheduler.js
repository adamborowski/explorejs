/**
 * Returns a task which can be executed with a delay for specified network speed and task size
 * @param size
 * @param initialSpeed
 * @param callback
 * @returns {{setSpeed: (function(*))}}
 */
export const createTask = (size, initialSpeed, callback, timeOffset = 0) => {

    let currentSpeed = initialSpeed;
    let loadedSize = 0; // size when speed changed
    let loadedTime = new Date().getTime(); // time when speed changed
    let timeout = null;
    const maxTimeout = 3000;

    const calculateTimeout = () => Math.min(maxTimeout, (size - loadedSize) / currentSpeed * 1000 - timeOffset); // speed per sec
    const updateTimeout = () => {
        if (currentSpeed === null) {
            callback(new Date());
        } else if (currentSpeed > 0) {
            console.log('wait for data of size ', size, ', loaded: ', loadedSize, ', timeout: ', calculateTimeout());
            timeout = setTimeout(callback, calculateTimeout());
        } else {
            timeout = null;
            // we don't want to call callback, someone needs to set new speed
            console.warn('throttle-scheuler speed set to 0, callback won\'t be processed.');
        }
    };

    timeout = updateTimeout();

    return {
        setSpeed(newSpeed) {
            const newTime = new Date().getTime();
            const timeElapsed = newTime - loadedTime;

            clearTimeout(timeout);
            currentSpeed = newSpeed;

            loadedSize += timeElapsed * currentSpeed / 1000;
            loadedTime = newTime;

            updateTimeout();
        }
    };
};

export default (initialSpeed = null) => {

    let speed = initialSpeed;
    let tasks = [];
    let initialMode = true;
    setTimeout(() => initialMode = false, 1000);

    return {
        setSpeed(newSpeed = null) {
            speed = newSpeed;
            for (const task of tasks) {
                task.setSpeed(speed);// for first couple request we do not want to simulate (for survey purpose)
            }
        },
        addTask(size, callback, timeOffset = 0) {

            if (initialMode || speed === null) {
                callback(new Date());
            } else {

                const newTask = createTask(size, speed, () => {
                    tasks = tasks.filter(t => t !== newTask);
                    callback(new Date());
                }, timeOffset);

                tasks.push(newTask);
            }
        }
    };
};

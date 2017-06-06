export default (func, span) => {
    let lastArgs = null; // keeps most recent arguments
    let calledDuringSpan = false; // if called during span, esure call after span phase
    let timeout = null; // tells if there is span phase

    return (...args) => {
        console.log('throttle real call', args, timeout);
        lastArgs = args;

        if (timeout === null) {
            // first call
            func(...lastArgs);
            timeout = setTimeout(() => {
                console.log('end of span, called during span: ', calledDuringSpan)
                if (calledDuringSpan) {
                    func(...lastArgs);
                }
                timeout = null;
                calledDuringSpan = false;
            }, span);
        } else {
            calledDuringSpan = true;
        }

    };
};
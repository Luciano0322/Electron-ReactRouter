const {
    Worker, isMainThread, MessageChannel, workerData
} = require('worker_threads');

const { port1: mainPort, port2: workerPort } = new MessageChannel();

if (isMainThread) {
    // const startTime = Date.now();
    // const numberOfElements = 1000000000;
    const workers = [];
    const numberOfElements = 100;
    const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * numberOfElements);
    const arr = new Int32Array(sharedBuffer);
    // const endTime = Date.now();
    // console.log((endTime - startTime) / 1000, 'seconds to complete');
    const numElementsPerThread = numberOfElements / 4;
    while(workers.length < 4) {
        const start = workers.length * numElementsPerThread;
        const end = start + numElementsPerThread;
        const worker = new Worker(__filename, {
            workerData: {
                index: workers.length,
                arr,
                start,
                end,
            },
        });
        worker.on('message', (message) => {
            console.log(message);
        });
        workers.push(worker);
    }
} else {
    for (let i = workerData.start; i < workerData.end; i++) {
        workerData.arr[i] = i + 2;
    }
    message = `${workerData.index} done!`;
    workerPort.postMessage({ message });
}
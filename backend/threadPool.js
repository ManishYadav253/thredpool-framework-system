const { Worker } = require('worker_threads');
const path = require('path');

class ThreadPool {
    constructor(initialSize) {
        this.size = initialSize;
        this.workers = [];
        this.idleWorkers = [];
        this.queue = [];
        this.activeTasks = 0;
        this.completedTasks = 0;
        this.deadWorkers = 0;
        this.deadTasks = 0;
        this.logs = [];

        for (let i = 0; i < initialSize; i++) {
            this.addWorker(i);
        }
    }

    addWorker(id) {
        const worker = new Worker(path.resolve(__dirname, 'worker.js'));
        const workerData = { worker, id, activeTask: null };
        this.workers.push(workerData);
        this.idleWorkers.push(workerData);

        worker.on('message', (result) => {
            const task = workerData.activeTask;
            workerData.activeTask = null;
            this.activeTasks--;
            this.completedTasks++;
            
            this.addLog(`Task ${result.id} completed by Worker ${id} in ${result.duration}ms`);
            
            this.idleWorkers.push(workerData);
            this.processQueue();
        });

        worker.on('error', (err) => {
            console.error(`Worker ${id} error:`, err);
            this.workers = this.workers.filter(w => w !== workerData);
            this.idleWorkers = this.idleWorkers.filter(w => w !== workerData);
            this.deadWorkers++;
            if (workerData.activeTask) {
                this.activeTasks--;
                this.deadTasks++;
                this.addLog(`Task ${workerData.activeTask.id} died due to Worker ${id} error`);
            }
            this.addWorker(id);
        });
    }

    submit(task) {
        // Priority: 0 (High), 1 (Medium), 2 (Low)
        this.queue.push(task);
        this.queue.sort((a, b) => a.priority - b.priority);
        this.addLog(`Task ${task.id} submitted [Priority: ${task.priority}]`);
        this.processQueue();
    }

    processQueue() {
        while (this.queue.length > 0 && this.idleWorkers.length > 0) {
            const task = this.queue.shift();
            const workerData = this.idleWorkers.shift();
            
            workerData.activeTask = task;
            this.activeTasks++;
            this.addLog(`Task ${task.id} started on Worker ${workerData.id}`);
            workerData.worker.postMessage(task);
        }
    }

    resize(newSize) {
        if (newSize > this.size) {
            const diff = newSize - this.size;
            for (let i = 0; i < diff; i++) {
                this.addWorker(this.workers.length);
            }
            this.addLog(`Pool resized up to ${newSize} workers`);
        } else if (newSize < this.size) {
            const diff = this.size - newSize;
            for (let i = 0; i < diff; i++) {
                if (this.idleWorkers.length > 0) {
                    const workerData = this.idleWorkers.pop();
                    this.workers = this.workers.filter(w => w !== workerData);
                    workerData.worker.terminate();
                    this.deadWorkers++;
                } else {
                    const workerData = this.workers.pop();
                    this.idleWorkers = this.idleWorkers.filter(w => w !== workerData);
                    workerData.worker.terminate();
                    this.deadWorkers++;
                    if (workerData.activeTask) {
                        this.activeTasks--;
                        this.deadTasks++;
                        this.addLog(`Task ${workerData.activeTask.id} died during pool resize`);
                    }
                }
            }
            this.addLog(`Pool resized down to ${newSize} workers`);
        }
        this.size = newSize;
        this.processQueue();
    }

    shutdown() {
        for (const workerData of this.workers) {
            if (workerData.activeTask) {
                this.deadTasks++;
            }
            workerData.worker.terminate();
            this.deadWorkers++;
        }
        this.deadTasks += this.queue.length;
        this.workers = [];
        this.idleWorkers = [];
        this.queue = [];
        this.size = 0;
        this.activeTasks = 0;
        this.addLog(`Pool shut down.`);
    }

    addLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        const log = { id: Date.now() + Math.random(), time: timestamp, message };
        this.logs.unshift(log);
        if (this.logs.length > 50) this.logs.pop();
        console.log(`[ThreadPool] ${message}`);
    }

    getStatus() {
        return {
            totalWorkers: this.size,
            activeThreads: this.activeTasks,
            idleThreads: this.idleWorkers.length,
            deadThreads: this.deadWorkers,
            deadTasks: this.deadTasks,
            queueSize: this.queue.length,
            completedTasks: this.completedTasks,
            logs: this.logs
        };
    }
}

module.exports = ThreadPool;

const express = require('express');
const cors = require('cors');
const ThreadPool = require('./threadPool');
const { Worker } = require('worker_threads');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

let pool = new ThreadPool(4);
let taskIdCounter = 1;

app.post('/task', (req, res) => {
    // priority: 0 (High), 1 (Medium), 2 (Low)
    const { type = 'cpu', param = 100, priority = 1 } = req.body;
    const task = {
        id: taskIdCounter++,
        type,
        param,
        priority
    };
    pool.submit(task);
    res.json({ message: 'Task submitted', task });
});

app.get('/status', (req, res) => {
    res.json(pool.getStatus());
});

app.post('/resize', (req, res) => {
    const { size } = req.body;
    if (size >= 1 && size <= 20) {
        pool.resize(size);
        res.json({ message: `Pool resized to ${size} workers` });
    } else {
        res.status(400).json({ error: 'Invalid size (1-20)' });
    }
});

app.post('/shutdown', (req, res) => {
    pool.shutdown();
    res.json({ message: 'Pool shut down completely' });
});

app.post('/restart', (req, res) => {
    pool.shutdown();
    const { size = 4 } = req.body;
    pool = new ThreadPool(size);
    res.json({ message: `Pool restarted with ${size} workers` });
});

app.post('/compare', async (req, res) => {
    const { taskCount = 10, type = 'cpu', param = 50 } = req.body;
    
    // 1. Run without pool (thread-per-task)
    const startNoPool = Date.now();
    let completedNoPool = 0;
    
    const runNoPool = new Promise((resolve) => {
        if (taskCount === 0) resolve();
        for(let i=0; i<taskCount; i++) {
            const w = new Worker(path.resolve(__dirname, 'worker.js'));
            w.postMessage({ id: i, type, param });
            w.on('message', () => {
                w.terminate();
                completedNoPool++;
                if (completedNoPool === taskCount) resolve();
            });
        }
    });
    await runNoPool;
    const timeNoPool = Date.now() - startNoPool;

    // 2. Run with pool
    const tempPool = new ThreadPool(4);
    const startPool = Date.now();
    
    const runPool = new Promise((resolve) => {
        if (taskCount === 0) resolve();
        // Override processQueue to detect finish
        const origProcess = tempPool.processQueue.bind(tempPool);
        let interval = setInterval(() => {
            if (tempPool.completedTasks === taskCount) {
                clearInterval(interval);
                resolve();
            }
        }, 10);
        for(let i=0; i<taskCount; i++) {
            tempPool.submit({ id: i, type, param, priority: 1 });
        }
    });
    await runPool;
    const timePool = Date.now() - startPool;
    tempPool.shutdown();

    res.json({
        noPoolTimeMs: timeNoPool,
        poolTimeMs: timePool,
        taskCount,
        speedup: (timeNoPool / timePool).toFixed(2)
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend simulator running on http://localhost:${PORT}`);
});

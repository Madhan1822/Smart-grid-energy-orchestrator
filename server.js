const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const QLearningAgent = require('./agent');
const EnergySimulator = require('./sim');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static('client/build'));

let sim = null;
let agent = null;
let isRunning = false;
let interval = null;

const stateSize = 3;
const actionSize = 3;

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('status', { running: isRunning });

  socket.on('start-sim', () => {
    if (!sim) {
      sim = new EnergySimulator();
      agent = new QLearningAgent(stateSize, actionSize);
    }
    isRunning = true;
    socket.emit('status', { running: true });
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      const state = sim ? sim.state || [0,0,0] : [0,0,0];
      const action = agent.chooseAction(state);
      const obs = sim.step(action);
      agent.learn(state, action, obs.reward, obs.state);
      socket.emit('step', obs.info);
      if (sim.done) {
        sim.reset();
        agent.decayEpsilon();
        socket.emit('episode-end');
      }
    }, 1000);
  });

  socket.on('pause-sim', () => {
    isRunning = false;
    if (interval) clearInterval(interval);
    socket.emit('status', { running: false });
  });

  socket.on('reset-agent', () => {
    agent = new QLearningAgent(stateSize, actionSize);
    socket.emit('agent-reset');
  });

  socket.on('train-offline', () => {
    const tempSim = new EnergySimulator();
    const tempAgent = new QLearningAgent(stateSize, actionSize, 0.2);
    for (let ep = 0; ep < 10; ep++) {
      tempSim.reset();
      for (let i = 0; i < 24; i++) {
        const state = tempSim.state || [0,0,0];
        const action = tempAgent.chooseAction(state);
        const obs = tempSim.step(action);
        tempAgent.learn(state, action, obs.reward, obs.state);
      }
    }
    Object.assign(agent.qTable, tempAgent.qTable);
    socket.emit('trained');
  });
});

app.get('/api/state', (req, res) => res.json({ running: isRunning }));

const PORT = 3001;
server.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));


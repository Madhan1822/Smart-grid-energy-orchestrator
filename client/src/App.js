import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const socket = io('http://localhost:3001');

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [latestData, setLatestData] = useState({});
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('Ready to orchestrate energy!');

  useEffect(() => {
    socket.on('status', (data) => setIsRunning(data.running));
    socket.on('step', (data) => {
      setLatestData(data);
      setHistory(prev => [...prev.slice(-50), data].filter(Boolean)); // last 50 steps
      setStatus(`Hour ${data.hour}: Action ${['Charge', 'Discharge', 'Sell'][data.action]} | Cost: $${data.totalCost} | CO2: ${data.totalCarbon}kg`);
    });
    socket.on('episode-end', () => setStatus(prev => prev + ' | New day learned!'));
    socket.on('agent-reset', () => setStatus('Agent reset'));
    socket.on('trained', () => setStatus('Offline training complete!'));

    return () => {
      socket.off('status');
      socket.off('step');
      socket.off('episode-end');
      socket.off('agent-reset');
      socket.off('trained');
    };
  }, []);

  const startSim = () => socket.emit('start-sim');
  const pauseSim = () => socket.emit('pause-sim');
  const resetAgent = () => socket.emit('reset-agent');
  const trainOffline = () => socket.emit('train-offline');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🟢 Smart Grid Energy Orchestrator</h1>
      <h2>Digital Twin Dashboard (RL Agent Learning)</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={startSim} disabled={isRunning}>▶️ Start Sim</button>
        <button onClick={pauseSim} disabled={!isRunning}>⏸️ Pause</button>
        <button onClick={resetAgent}>🔄 Reset Agent</button>
        <button onClick={trainOffline}>⚡ Train Offline</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>Current Status</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
{status}
          </pre>
          <p><strong>Battery:</strong> {latestData.batterySoc || 'N/A'}</p>
          <p><strong>Solar:</strong> {latestData.solar || 0} kWh</p>
          <p><strong>Wind:</strong> {latestData.wind || 0} kWh</p>
          <p><strong>Demand:</strong> {latestData.demand || 0} kWh</p>
        </div>
        <div>
          <h3>Performance Metrics</h3>
          <p>Total Cost: <strong>${latestData.totalCost || 0}</strong></p>
          <p>Total CO2: <strong>{latestData.totalCarbon || 0} kg</strong></p>
          <p>Grid Import: <strong>{latestData.gridCarbon || 0} kWh</strong></p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="solar" stroke="#ffc658" name="Solar" />
          <Line type="monotone" dataKey="wind" stroke="#82ca9d" name="Wind" />
          <Line type="monotone" dataKey="demand" stroke="#ff7300" name="Demand" />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalCost" stackId="a" fill="#8884d8" name="Cost" />
          <Bar dataKey="totalCarbon" stackId="b" fill="#82ca9d" name="Carbon" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;


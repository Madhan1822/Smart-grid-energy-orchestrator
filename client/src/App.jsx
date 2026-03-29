import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://your-backend.onrender.com",
  {
    transports: ["websocket"]
  }
);
function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [latestData, setLatestData] = useState({});
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('Connecting to backend...');

  useEffect(() => {
    socket.on('connect', () => {
      setStatus('Connected! Ready to orchestrate energy!');
      socket.emit('status');
    });
    socket.on('connect_error', (err) => setStatus(`Connection error: ${err.message}`));

    socket.on('status', (data) => setIsRunning(data.running));
    socket.on('step', (data) => {
      setLatestData(data);
      setHistory(prev => [...prev.slice(-50), data].filter(Boolean));
      setStatus(`Hour ${data.hour}: Action ${['Charge', 'Discharge', 'Sell'][data.action]} | Cost: $${data.totalCost} | CO2: ${data.totalCarbon}kg`);
    });
    socket.on('episode-end', () => setStatus(prev => prev + ' | New day learned!'));
    socket.on('agent-reset', () => setStatus('Agent reset'));
    socket.on('trained', () => setStatus('Offline training complete!'));

    return () => {
      socket.off();
    };
  }, []);

  const startSim = () => socket.emit('start-sim');
  const pauseSim = () => socket.emit('pause-sim');
  const resetAgent = () => socket.emit('reset-agent');
  const trainOffline = () => socket.emit('train-offline');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: socket.connected ? '#4CAF50' : '#f44336' }}>🟢 Smart Grid Energy Orchestrator</h1>
      <h2>Digital Twin Dashboard (RL Agent Learning)</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={startSim} disabled={isRunning || !socket.connected}>▶️ Start Sim</button>
        <button onClick={pauseSim} disabled={!isRunning}>⏸️ Pause</button>
        <button onClick={resetAgent} disabled={!socket.connected}>🔄 Reset Agent</button>
        <button onClick={trainOffline} disabled={!socket.connected}>⚡ Train Offline</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>Status: {socket.connected ? '🟢 Connected' : '🔴 Disconnected'}</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', height: '60px', overflow: 'auto' }}>
{status}
          </pre>
          <p><strong>Battery:</strong> {latestData.batterySoc || 'N/A'}</p>
          <p><strong>Solar:</strong> {latestData.solar || 0} kWh</p>
          <p><strong>Wind:</strong> {latestData.wind || 0} kWh</p>
          <p><strong>Demand:</strong> {latestData.demand || 0} kWh</p>
          <p><strong>Action:</strong> {latestData.action !== undefined ? ['Charge', 'Discharge', 'Sell'][latestData.action] : 'None'}</p>
        </div>
        <div>
          <h3>Performance Metrics</h3>
          <p>Total Cost: <strong style={{ color: '#8884d8' }}>${latestData.totalCost || 0}</strong></p>
          <p>Total CO2: <strong style={{ color: '#82ca9d' }}>{latestData.totalCarbon || 0} kg</strong></p>
          <p>Grid Import: <strong style={{ color: '#ff7300' }}>{latestData.gridCarbon || 0} kWh</strong></p>
        </div>
      </div>

      {history.length > 0 && (
        <>
          <h3>Energy Flows (last 50 steps)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom' }} />
              <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="solar" stroke="#ffc658" name="Solar" dot={false} />
              <Line type="monotone" dataKey="wind" stroke="#82ca9d" name="Wind" dot={false} />
              <Line type="monotone" dataKey="demand" stroke="#ff7300" name="Demand" dot={false} />
            </LineChart>
          </ResponsiveContainer>

          <h3>Cost & Carbon Accumulation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalCost" stroke="#8884d8" name="Cost ($)" dot={false} />
              <Line type="monotone" dataKey="totalCarbon" stroke="#82ca9d" name="CO2 (kg)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default App;


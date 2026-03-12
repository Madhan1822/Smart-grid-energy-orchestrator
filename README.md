Smart Grid Energy Orchestrator ⚡🌍

AI-powered Digital Twin platform that optimizes renewable energy usage using Reinforcement Learning.

The system simulates a microgrid environment and trains an RL agent to intelligently manage solar, wind, battery storage, and grid energy to minimize electricity cost and carbon emissions.

Architecture
React Dashboard (Vite)
        │
        │ WebSocket (Socket.io)
        ▼
Node.js + Express Server
        │
        ▼
Reinforcement Learning Agent (Q-Learning)
        │
        ▼
Energy Simulation Engine (Digital Twin)
Key Features

✔ Real-time energy simulation
✔ Reinforcement Learning agent (Q-learning)
✔ Smart battery charge/discharge decisions
✔ Renewable energy integration (solar + wind)
✔ Cost optimization
✔ Carbon footprint tracking
✔ Interactive dashboard with live charts

Tech Stack

Frontend

React (Vite)

Recharts

Socket.io Client

Backend

Node.js

Express

Socket.io

TensorFlow.js (optional RL extension)

AI / Simulation

Reinforcement Learning (Q-Learning)

Digital Twin Energy Simulation

Dashboard Controls
Control	Description
▶ Start Sim	Start the real-time energy simulation
⏸ Pause	Pause simulation
🔄 Reset Agent	Reset RL learning agent
⚡ Train Offline	Pre-train RL agent with historical data
Simulation Model

Solar generation

Sinusoidal daytime curve (~5kWh peak)

Wind generation

Random steady generation (~2kWh)

Demand

Base 8kWh + daily cycle

Battery

Capacity: 10 kWh

Energy Pricing

Buy price: $0.07 – $0.15 / kWh

Sell price varies hourly

Carbon Emission

Grid electricity: 0.4 kg CO₂ / kWh

Renewables: 0 kg CO₂

Reinforcement Learning Model

State Space

Time slot (morning / afternoon / evening / night)

Battery SOC

Renewable surplus indicator

Actions

0 → Charge battery
1 → Discharge battery
2 → Sell excess energy to grid

Reward Function

Reward = -(energy_cost + carbon_penalty)

Goal

Minimize electricity cost
Minimize carbon emissions
Running the Project

From project root:

npm install --ignore-scripts

Install frontend:

cd client
npm install

Run system:

npm start

Open:

http://localhost:3000
Future Improvements

• Replace simulated data with real weather APIs
• Implement Deep Q Network (DQN)
• Multi-building energy orchestration
• Persist trained Q-table
• Deploy cloud dashboard

Author

Madhan E
Smart Grid Energy Orchestrator ⚡🌍

An AI-powered Digital Twin platform that optimizes renewable energy usage using Reinforcement Learning.

The system simulates a microgrid energy environment and trains an RL agent to intelligently manage solar, wind, battery storage, and grid energy in order to minimize electricity cost and carbon emissions.

System Architecture:
React Dashboard (Vite)
        │
        │  WebSocket (Socket.io)
        ▼
Node.js + Express Backend
        │
        ▼
Reinforcement Learning Agent (Q-Learning)
        │
        ▼
Energy Simulation Engine (Digital Twin)

Key Features:

⚡ Real-time energy simulation
🧠 Reinforcement Learning agent (Q-learning)
🔋 Smart battery charge / discharge decisions
🌞 Renewable energy integration (Solar + Wind)
💰 Electricity cost optimization
🌍 Carbon footprint tracking
📊 Interactive dashboard with live charts

Tech Stack:
Frontend:
React (Vite)
Recharts – data visualization
Socket.io Client – real-time communication

Backend:
Node.js
Express.js
Socket.io
TensorFlow.js (optional for advanced RL models)

AI & Simulation:
Reinforcement Learning (Q-Learning)
Digital Twin Energy Simulation

Dashboard Controls:
Control	    Description
▶Start      Sim	Starts the real-time energy simulation
⏸Pause	    Pauses the simulation
🔄Reset     Agent	Resets the RL agent and clears learning
⚡Train     Offline	Runs pre-training episodes for faster learning

Simulation Model:
Solar Generation:
Sinusoidal daytime generation curve
Peak output ≈ 5 kWh

Wind Generation:
Random steady production
Average ≈ 2 kWh

Energy Demand:
Base demand ≈ 8 kWh
Daily cyclic variation

Battery System:
Capacity: 10 kWh
Used to store excess renewable energy

Energy Pricing Model:
Type	          Price
Grid Buy Price	  $0.07 – $0.15 per kWh
Grid Sell Price	  Varies hourly

Carbon Emission Model:
Source	            CO₂ Emission
Grid Electricity	0.4 kg CO₂ / kWh
Renewable Energy	0 kg CO₂

Reinforcement Learning Model:
State Space
The RL agent observes:
Time slot (Morning / Afternoon / Evening / Night)
Battery State of Charge (SOC)
Renewable energy surplus indicator

Actions:
0 → Charge battery
1 → Discharge battery to supply load
2 → Sell excess energy to the grid

Reward Function:
Reward = -(energy_cost + carbon_penalty)

The agent learns strategies that:
Reduce grid electricity usage
Reduce carbon emissions
Lower energy cost

Running the Project:
1️⃣ Install backend dependencies
npm install --ignore-scripts
2️⃣ Install frontend dependencies
cd client
npm install
3️⃣ Run the system
npm start
4️⃣ Open the dashboard
http://localhost:3000


Future Improvements:
🌦 Integrate real weather APIs for solar and wind prediction
🤖 Upgrade RL model to Deep Q-Network (DQN)
🏢 Multi-building energy orchestration
💾 Persist trained Q-table
☁ Deploy cloud-based dashboard
📈 Add energy forecasting models

Project Author:
Madhan E

Project Domain:
Artificial Intelligence
Reinforcement Learning
Smart Grid Systems
Sustainable Energy
Digital Twin Simulation

Why This Project Matters:
This project demonstrates how AI can optimize renewable energy usage in smart grids, reducing both electricity cost and carbon emissions while improving energy sustainability.
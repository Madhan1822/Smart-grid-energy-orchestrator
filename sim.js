class EnergySimulator {
  constructor() {
    this.reset();
  }

  reset() {
    this.hour = 0; // 0-23
    this.batterySoc = 0.5; // 0-1
    this.batteryCapacity = 10; // kWh
    this.solarProd = 0;
    this.windProd = 0;
    this.demand = 0;
    this.gridPriceBuy = 0.12; // $/kWh
    this.gridPriceSell = 0.08;
    this.carbonGrid = 0.4; // kgCO2/kWh
    this.carbonRenew = 0;
    this.totalCost = 0;
    this.totalCarbon = 0;
    this.done = false;
  }

  step(action) {
    // Generate data (simplified sinusoidal + noise)
    this.hour = (this.hour + 1) % 24;
    this.solarProd = Math.max(0, 5 * Math.sin((this.hour / 24) * 2 * Math.PI) + (Math.random() - 0.5));
    this.windProd = 2 + (Math.random() - 0.5) * 2;
    this.demand = 8 + 3 * Math.sin((this.hour / 12) * 2 * Math.PI) + (Math.random() - 0.5) * 2;
    this.gridPriceBuy = 0.1 + 0.05 * Math.sin((this.hour / 24) * 4 * Math.PI);
    this.gridPriceSell = 0.07 + 0.03 * Math.sin((this.hour / 24) * 4 * Math.PI + Math.PI);

    let renewables = this.solarProd + this.windProd;
    let net = renewables - this.demand;
    let reward = 0;
    let gridCarbon = 0;

    // Actions: 0=charge battery (buy from grid if needed), 1=discharge battery to load, 2=sell excess to grid
    if (action === 0) { // Charge battery
      let chargeNeeded = Math.min(0.2, 1 - this.batterySoc); // max 20% charge
      let chargeFromRenew = Math.min(chargeNeeded * this.batteryCapacity, Math.max(0, renewables));
      let chargeFromGrid = chargeNeeded * this.batteryCapacity - chargeFromRenew;
      this.batterySoc += (chargeFromRenew + chargeFromGrid) / this.batteryCapacity;
      this.totalCost += chargeFromGrid * this.gridPriceBuy;
      this.totalCarbon += chargeFromGrid * this.carbonGrid;
      renewables -= chargeFromRenew;
      net = renewables - this.demand;
    } else if (action === 1) { // Discharge to load
      let discharge = Math.min(this.batterySoc * this.batteryCapacity, Math.max(0, -net));
      net += discharge;
      this.batterySoc -= discharge / this.batteryCapacity;
    } else if (action === 2) { // Sell to grid
      let sell = Math.max(0, net);
      this.totalCost -= sell * this.gridPriceSell;
      this.totalCarbon -= sell * 0.01; // small credit
      net -= sell;
    }

    // Final balance: buy/sell remainder
    if (net < 0) {
      let buy = -net;
      this.totalCost += buy * this.gridPriceBuy;
      this.totalCarbon += buy * this.carbonGrid;
      gridCarbon += buy;
    } else {
      let sell = net;
      this.totalCost -= sell * this.gridPriceSell;
    }

    // Reward: -cost - carbon (normalized)
    reward = -(this.totalCost / 100 + this.totalCarbon / 10);

    if (this.hour === 0) this.done = true; // episode end daily

    return {
      state: [Math.floor(this.hour / 6), Math.round(this.batterySoc * 10) / 10, renewables > this.demand ? 1 : 0], // discretized state
      reward,
      info: {
        hour: this.hour,
        solar: this.solarProd.toFixed(1),
        wind: this.windProd.toFixed(1),
        demand: this.demand.toFixed(1),
        batterySoc: (this.batterySoc * 100).toFixed(0) + '%',
        action,
        totalCost: this.totalCost.toFixed(2),
        totalCarbon: this.totalCarbon.toFixed(1),
        gridCarbon
      }
    };
  }
}

module.exports = EnergySimulator;


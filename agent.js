class QLearningAgent {
  constructor(stateSize, actionSize, learningRate = 0.1, discountFactor = 0.95, epsilon = 0.1) {
    this.stateSize = stateSize;
    this.actionSize = actionSize;
    this.lr = learningRate;
    this.gamma = discountFactor;
    this.epsilon = epsilon;
    this.qTable = {};
  }

  getQState(state) {
    const key = state.join(',');
    if (!this.qTable[key]) {
      this.qTable[key] = new Array(this.actionSize).fill(0);
    }
    return key;
  }

  chooseAction(state) {
    const key = this.getQState(state);
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.actionSize);
    }
    return this.qTable[key].indexOf(Math.max(...this.qTable[key]));
  }

  learn(state, action, reward, nextState) {
    const key = this.getQState(state);
    const nextKey = this.getQState(nextState);
    const oldValue = this.qTable[key][action];
    const nextMax = Math.max(...this.qTable[nextKey]);
    const newValue = oldValue + this.lr * (reward + this.gamma * nextMax - oldValue);
    this.qTable[key][action] = newValue;
  }

  decayEpsilon() {
    this.epsilon = Math.max(0.01, this.epsilon * 0.995);
  }
}

module.exports = QLearningAgent;


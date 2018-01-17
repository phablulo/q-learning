class Q {
	constructor({epsilon=0.2, a_size=4, learning_rate=1, discount_factor=0.8}) {
		this.discount_factor = discount_factor;
		this.learning_rate = learning_rate;
		this.epsilon = epsilon;
		this.a_size = a_size;
		this.table = [];
	}
	_randomInt(max=10) {
		return Math.floor(Math.random() * max);
	}
	action_for_step(step, deterministic=false) {
		if (!this.table[step]) this.initializeRow(step);
		const index = (!deterministic && (Math.random() < this.epsilon)) ? this._randomInt(this.a_size) : Q.argmax(this.table[step]);
		return {
			index: index,
			update: this._update.bind(this, step, index, this.table[step][index])
		}
	}
	initializeRow(index) {
		const row = [];
		const s = this.a_size;
		for (let i = 0; i < s; ++i) {
			row.push(this._randomInt());
		}
		this.table[index] = row;
	}
	static argmax(array) {
		const max = Math.max(...array);
		return array.indexOf(max);
	}
	_update(step, action, expected, real) {
		const next_action = this.action_for_step(step + 1, true).index;
		const next_reward = this.table[step+1][next_action];
		this.table[step][action] = this.table[step][action] + this.learning_rate*(real - expected + this.discount_factor*next_reward);
	}
}
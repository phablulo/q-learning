"use strict";
const size = [400, 400];
let   [x, y] = [1, 4];
const [dx, dy] = map.dimensions().map((x, i) => size[i]/x);
const population_size = 10;
const colors = ["blue", "red", "yellow", "cyan", "deeppink", "fuchsia", "maroon", "orangered", "orchid", "purple", "thistle", "tomato", "violet", "yellowgreen"]

let qsp = Array(population_size).fill(0).map((_, i) => {
	return {
		q: new Q({discount_factor: Math.random(), epsilon: Math.random()}),
		p: new Player(dx, dy, x, y, colors[i % colors.length], true)
	}
});
function rand() {
	return Math.random()/10 - 0.05;
}
function reproduce (q1, q2) {
	return Array(population_size).fill(0).map(() => {
		const discount_factor = (q1.discount_factor + q2.discount_factor)/2 + rand();
		const epsilon = (q1.epsilon + q2.epsilon)/2 + rand();
		const table = [];
		for (let i = 0, len = Math.min(q1.table.length, q2.table.length); i < len; ++i) {
			const row = q1.table[i].map((v, action) => (v+q2.table[i][action])/2 + rand());
			table[i] = row;
		}
		const q = new Q({discount_factor: discount_factor, epsilon: epsilon});
		q.table = table;
		return q;
	});
}

const actions = ['up','down','left','right'];
let step = 0;
let points = 0;
let time = 1;

let cpoints = 0;
let iter = 0;

function reinit(p) {
	[x, y] = [1, 4];
	step = 0;
	points = 0;
	points = 0;
	p.goto(x, y);
}
function act(agent, max_steps, max_iter, done) {
	if (++iter > max_iter) {
		reinit(agent.p);
		return done();
	}
	const data = agent.q.action_for_step(step++);
	const action = actions[data.index];
	const new_x = (action == 'left' ? x-1 : action == 'right' ? x+1 : x);
	const new_y = (action == 'up' ? y-1 : action == 'down' ? y+1 : y);

	const pnts = map.pointsOn(new_x, new_y) - 1;
	data.update(pnts);

	points += pnts;
	cpoints += pnts;

	const status = map.statusOn(new_x, new_y);
	if (max_steps && step >= max_steps) {
		reinit(agent.p);
		// console.log("Timed out. Score: "+points);
	}
	else if (status == 'pass') {
		[x, y] = [new_x, new_y];
		agent.p[action]();
	} else if (status == 'win') {
		console.log("Win! Score: "+points+'; Steps: '+step);
		reinit(agent.p);
	} else if (status == 'lose') {
		// console.log("Lose! Score: "+points);
		reinit(agent.p);
	}
	return setTimeout(act.bind(this, agent, max_steps, max_iter, done), time);
}

const players_points = Array(population_size).fill(0);
let _index = 0;
function doit(callback) {
	const agent = qsp[_index];
	if (_index >= population_size) {
		_index = 0;
		return callback();
	}
	agent.p.show();
	act(agent, 20, 30, () => {
		agent.p.hide();
		players_points[_index++] = cpoints;
		cpoints = 0;
		iter = 0;
		return doit(callback);
	});
}

let generation = 0;
let shouldIStop = false;
(function manage() {
	doit(function selection() {
		// console.log("\t","Agent points", players_points)
		const q1_index = Q.argmax(players_points);
		players_points[q1_index] = -9876543219876542000; // espero não ter nenhum menor que esse
		const q2_index = Q.argmax(players_points);

		players_points.fill(0);
		const els = qsp.map(d => d.p);
		console.log("Generation", ++generation);
		// console.log("\t","Escolhidos: "+q1_index+' e '+q2_index);

		const new_population = reproduce(qsp[q1_index].q, qsp[q2_index].q);
		qsp = [qsp[q1_index].q, qsp[q2_index].q].concat(new_population.slice(2, population_size)).map((q, i) => {
			return {
				q: q,
				p: els[i]
			}
		});
		if (!shouldIStop) return manage();
	});
})();
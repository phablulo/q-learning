"use strict";
const size = 400;
const [dx, dy] = map.dimensions().map(x => size/x);
let   [x, y] = [1, 4];
const player = new Player(dx, dy, x, y);
const q      = new Q({discount_factor: .995, epsilon:0.05});

const actions = ['up','down','left','right'];
let step = 0;
let points = 0;
let stop = false;
let time = 1;
let log = false;
const wins = document.getElementById('wins');
const lose = document.getElementById('lose');
let _wins = 0, _lose = 0;
(function act() {
	// console.log('step',step);
	const data = q.action_for_step(step);
	const action = actions[data.index];
	const new_x = (action == 'left' ? x-1 : action == 'right' ? x+1 : x);
	const new_y = (action == 'up' ? y-1 : action == 'down' ? y+1 : y);

	const pnts  = map.pointsOn(new_x, new_y) - step++;
	// console.log("pnts", pnts)
	data.update(pnts);

	points += pnts;
	const status = map.statusOn(new_x, new_y);
	// if (status == 'stop') return setTimeout(act, 300);
	if (status == 'pass') {
		[x,y] = [new_x, new_y];
		player[action]();
	}
	else if (status != 'stop') {
		if (status == 'win') {
			q.epsilon *= 0.9;
			wins.innerHTML = ++_wins;
		} else if (status == 'lose') {
			lose.innerHTML = ++_lose;
		}
		if (log) console.log(status+'! Points:',points, 'Step', step);
		points = 0;
		step = 0;
		[x, y] = [1, 4];
		player.goto(x, y);
	}
	if (!stop) return setTimeout(act, time);
})();

"use strict";
const size = 400;
const [dx, dy] = map.dimensions().map(x => size/x);
let   [x, y] = [1, 4];
const player = new Player(dx, dy, x, y);
const q      = new Q({discount_factor: .8, epsilon:0.05});

const actions = ['up','down','left','right'];
let step = 0;
let points = 1;
(function act() {
	// console.log('step',step);
	const data = q.action_for_step(step++);
	const action = actions[data.index];
	const new_x = (action == 'left' ? x-1 : action == 'right' ? x+1 : x);
	const new_y = (action == 'up' ? y-1 : action == 'down' ? y+1 : y);

	const ptns  = map.pointsOn(new_x, new_y);
	data.update(ptns);

	points += ptns;
	const status = map.statusOn(new_x, new_y);
	// if (status == 'stop') return setTimeout(act, 300);
	if (status == 'pass') {
		[x,y] = [new_x, new_y];
		player[action]();
	}
	else if (status == 'win' || status == 'lose') {
		console.log(status+'! Points:',points);
		points = 1;
		step = 0;
		[x, y] = [1, 4];
		player.goto(x, y);
	}
	return setTimeout(act, 1);
})();
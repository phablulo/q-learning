Number.prototype.myClass = function() {
	switch (this.valueOf()) {
		case 0: return 'block';
		case 1: return 'pass';
		case 2: return 'hurt';
		case 3: return 'good';
		case 4: return 'vgood';
		default: throw new Error('hn? '+this);
	}
}
class Map {
	constructor(out_penality=-50) {
		this.out_penality = out_penality;
		this.map = [
			[0, 2, 0, 1, 4, 0, 0, 3],
			[2, 1, 0, 1, 0, 0, 1, 1],
			[0, 1, 1, 1, 0, 1, 1, 1],
			[0, 0, 1, 0, 0, 1, 0, 0],
			[2, 1, 1, 1, 1, 1, 1, 1]
		]; // 0 = bloco; 1 = livre; 2 = ruim; 3 = bom; 4 = superbom
	}
	dimensions() {
		return [this.map[0].length, this.map.length];
	}
	pointsOn(x, y) {
		if (y < 0 || y >= this.map.length || x < 0 || x >= this.map[0].length) return this.out_penality;

		switch (this.map[y][x]) {
			case 0:
			case 1: return    0;
			case 2: return   -1;
			case 3: return   30;
			case 4: return  900;
			default: throw new Error('hn? '+ this.map[y][x]);
		}
	}
	statusOn(x, y) {
		if (y < 0 || y >= this.map.length || x < 0 || x >= this.map[0].length) return 'lose';
		switch (this.map[y][x]) {
			case 0: return 'stop';
			case 1:
			case 2:
			case 3: return 'pass';
			case 4: return 'win';
			default: throw new Error('hn?? '+ this.map[y][x]);
		}
	}
}
const map = new Map();
const canvas = document.querySelector('.canvas');
map.map.forEach(line => {
	const row = document.createElement('div');
	row.classList.add('row');
	line.forEach(item => {
		const div = document.createElement('div');
		div.classList.add(item.myClass());
		row.append(div);
	});
	canvas.append(row);
});

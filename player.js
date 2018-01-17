class Player {
	constructor(dx, dy, start_x, start_y, color="blue", init_hidden=false) {
		this.dx = dx;
		this.dy = dy;

		const el = document.createElement('div');
		el.classList.add('player');
		this.element = el;
		document.body.appendChild(el);

		this.goto(start_x, start_y);
		el.style.backgroundColor=color;
		if (init_hidden) this.hide();
	}
	goto(x, y) {
		this.element.style.top  = (this.dy/2 - 20)+'px';
		this.element.style.left = (this.dx/2 - 20)+'px';
		while (y-- > 0) this.down();
		while (x-- > 0) this.right();
	}
	_add(to, what) {
		const v = parseInt(this.element.style[to]);
		this.element.style[to] = (v + what)+'px';
	}
	up() {
		this._add('top', -this.dy);
	}
	down() {
		this._add('top', this.dy);
	}
	left() {
		this._add('left', -this.dx);
	}
	right() {
		this._add('left', this.dx);
	}
	hide() {
		this.element.classList.add('hidden');
	}
	show() {
		this.element.classList.remove('hidden');
	}
}
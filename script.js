var game;

var words = new Array('ALBA', 'BRAK', 'CZARA', 'DAMA', 'EWA', 'FAMA', 'GAWRON', 'HANIA', 'IGLO', 'JAN', 'KLASA', 'MATA', 'NIE', 'OBRAZ', 'PLAC', 'RYBA', 'STAN', 'TRYB', 'URAZ', 'WRAK', 'YETI', 'ZNAK');

var Text = Class.create(
{
	initialize: function()
	{
		this.txt = words[Math.floor(Math.random()*words.length)];
		this.el = new Element('div', {'class':'txt'});
		this.el.update(this.txt);
		this.y = 0;
		this.x = Math.abs(Math.random() * game.board.clientWidth - this.el.clientWidth);
		
		this.el.setStyle({position: 'absolute',
					top: this.y+'px',
					left: this.x+'px',
					zIndex: --Text.zidx
				});
		game.board.appendChild(this.el);
	},
	
	del: function()
	{
		game.board.removeChild(this.el);
	},
	
	move: function(s)
	{
		this.y += s;
		this.el.setStyle({top: this.y+'px'});
	},
	
	end: function()
	{
		return this.y > game.board.clientHeight;
	}
});


var Game = Class.create(
{
	initialize: function()
	{
		this.board = $('board');
		this.status = $('status');
		Event.observe(document, "keydown", this.onKey);
	},
	
	new: function()
	{
		Text.zidx = 10000000;
		this.time = 0;
		this.array = new Array();
		this.timer = new PeriodicalExecuter(this.onTimer, 0.1);
		this.input = '';
		this.status.update(this.input);
	},
	
	stop: function()
	{
		this.timer.stop();
		alert('Game over'+"\n"+'Time: '+this.time/10+'s');
	},
	
	addObj: function()
	{
		game.array.push(new Text());
	},
	
	removeObj: function(i)
	{
		game.array[i].del();
		game.array.splice(i, 1);
	},
	
	onTimer: function()
	{
		game.time++;
		if(Math.random() > 0.9)
			game.addObj();
		
		for(var i = 0; i < game.array.length; i++)
		{
			game.array[i].move(5);
			if(game.array[i].end())
				game.stop();
		}
	},
	
	onKey: function(e)
	{
		var l = e.keyCode;
		if(l >= 65 && l<= 90)
			game.input = game.input + String.fromCharCode(l);
		
		if(l == 8) // Backspace
			game.input = game.input.substr(0, game.input.length-1);
			
		
		var res = false;
		if(l == Event.KEY_RETURN) // Enter
		{
			for(var i = 0; i < game.array.length; i++)
				if(game.array[i].txt == game.input)
				{
					game.removeObj(i--);
					res = true;
				}
			game.input = '';
		}
		
		
		if(!res && l == Event.KEY_RETURN)
			game.status.update('---');
		else
			game.status.update(game.input);
	}
});


window.onload = function()
{
	game = new Game();
	game.new();
};

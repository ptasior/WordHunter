var game;

var words = new Array('ALBA', 'BRAK', 'CZARA', 'DAMA', 'EWA', 'FAMA', 'GRA', 'HANIA', 'IGLO', 'JAN', 'KLASA', 'MATA', 'NIE', 'OBRAZ', 'PLAC', 'RYBA', 'STAN', 'TRYB', 'URAZ', 'WRAK', 'YETI', 'ZNAK');

var Text = Class.create(
{
	initialize: function()
	{
		this.txt = words[Math.floor(Math.random()*words.length)];
		this.el = new Element('div', {'class':'txt'});
		this.el.update(this.txt);
		this.y = 0;
		this.x = Math.abs(Math.random() * (game.board.clientWidth - this.txt.length*10));
		
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
		this.speed = 8;
		Event.observe(document, "keydown", this.onKey);
		$('msg_btn').observe("click", this.new);
	},
	
	new: function()
	{
		Text.zidx = 10000000;
		
		if(game.array)
			for(var i = 0; i < game.array.length; i++)
			{
				game.array[i].del();
			}
		game.array = new Array();
			
		game.hideMsg();
		game.status.update(game.input);
		
		game.time = 0;
		game.wcnt = 0;
		game.input = '';
		
		game.timer = new PeriodicalExecuter(game.onTimer, 1/game.speed);
	},
	
	stop: function()
	{
		this.timer.stop();
		this.showMsg('Game over!<br><br>Time: '+this.time/this.speed+'s<br>Words: '+this.wcnt);
	},
	
	addObj: function()
	{
		game.array.push(new Text());
	},
	
	removeObj: function(i)
	{
		game.wcnt++;
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
					break;
				}
			game.input = '';
		}
		
		
		if(!res && l == Event.KEY_RETURN)
			game.status.update('---');
		else
			game.status.update(game.input);
	},
	
	showMsg: function(msg)
	{
		$('msg_txt').update(msg);
		$('msg').show();
	},
	
	hideMsg: function()
	{
		$('msg').hide();
	}
});


window.onload = function()
{
	game = new Game();
};

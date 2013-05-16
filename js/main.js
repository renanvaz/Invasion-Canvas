(function(window) {
	EteBitmap = function() {
		this.initialize();
	}
	var EteBitmap_p = EteBitmap.prototype = new createjs.BitmapAnimation();
	EteBitmap_p.BitmapAnimation_initialize = EteBitmap_p.initialize;
	EteBitmap_p.initialize = function() {
		this.imageIndex = Math.round(Math.random() * (Ete.images.length - 1));
		var img = Game.preloader.get('ete'+this.imageIndex);
		this._SpriteSheet = new createjs.SpriteSheet({images: [img], frames: [[0,0,153,158,0,74.5,74],[153,0,153,158,0,74.5,74],[306,0,153,158,0,74.5,74],[0,158,153,158,0,74.5,74],[153,158,153,158,0,74.5,74],[306,158,153,158,0,74.5,74],[0,316,153,158,0,74.5,74],[153,316,153,158,0,74.5,74]],  animations: {fall:[0,7, true]}});
		this.BitmapAnimation_initialize(this._SpriteSheet);
		this.paused = false;
	}
	EteBitmap_p.fall = function(){
		this.gotoAndPlay("fall");
	}
	window.EteBitmap = EteBitmap;
}(window));

function V2 (x, y){
	this.x = x;
	this.y = y;
}


Game = {
	sprites: []

	, remove: function(sprite){
		this.sprites = Arr.remove(this.sprites, sprite);
		this.stage.removeChild(sprite);
	}

	, add: function(sprite){
		this.sprites.push(sprite);
		this.stage.addChild(sprite);
	}

	, initializer: function(){
		var self = this
			, manifest;

		Ete.generateRandomImages(10);

		this.canvas = document.getElementById('game');
		this.stage = new createjs.Stage(this.canvas);
		createjs.Touch.enable(this.stage);
		//this.stage.autoClear = false;

		this.preloader = new Preloader;
		this.preloader.add({src:'img/mountain1.png', id:'mountain1'});
        this.preloader.add({src:'img/mountain2.png', id:'mountain2'});

        for (var i = 0; i < Ete.images.length; i++) {
        	this.preloader.add({src: Ete.images[i].ete, id:'ete'+i});
        	this.preloader.add({src: Ete.images[i].explode, id:'explode'+i});
        };

        this.preloader.bind('complete', function(){
        	var mountain1 = self.preloader.get('mountain1');
        	var mountain2 = self.preloader.get('mountain2');

        	self.mountain1 = new createjs.Bitmap(mountain1);
			self.mountain2 = new createjs.Bitmap(mountain2);

			self.stage.addChild(self.mountain1);
			self.stage.addChild(self.mountain2);

			createjs.Ticker.setFPS(60);
			createjs.Ticker.addListener(self);

			document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
			window.addEventListener('resize', function(){ self.onResize() });
			self.onResize();

			Ete.interval();
        });

        this.preloader.start();
	}

	, tick: function(e){
		for (var i = 0; i < this.sprites.length; i++) {
			this.sprites[i].velocity.x += this.sprites[i].acceleration.x;
			this.sprites[i].velocity.y += this.sprites[i].acceleration.y;

			this.sprites[i].x += this.sprites[i].velocity.x;
			this.sprites[i].y += this.sprites[i].velocity.y;

			if(this.sprites[i].y > window.innerHeight + (this.sprites[i].height/2)){
				Game.remove(this.sprites[i]);
			}
		}

		this.stage.update(e);
	}

	, onResize: function(){
		this.canvas.width 	= window.innerWidth;
		this.canvas.height 	= window.innerHeight;

		this.mountain1.y = window.innerHeight - this.mountain1.image.height;
		this.mountain1.x = window.innerWidth * .2;
		this.mountain2.y = window.innerHeight - this.mountain2.image.height;
		this.mountain2.x = window.innerWidth * .4;
	}

}

var Ete = {
	images: []
	, create: function(){
		var rand1 		= Math.random()
			, rand2 	= Math.random()
			, rand3 	= Math.random()
			, rand4 	= Math.random()
			, win_w		= window.innerWidth
			, win_h		= window.innerHeight
			, direction	= rand3 > .5 ? 'right' : 'left'
			, top 		= 0
			, left 		= rand1 * (win_w / 2)
			, ete 		= new createjs.Container
			, ss 		= new EteBitmap;

		ete.width = 153;
		ete.height = 158;
		ete.ss = ss;
		ete.addChild(ss);

		if(direction != 'right'){
			left = (win_w / 2) + left;
			ete.scaleX = -1;
		}

		top = -ete.height /2;

		ete.x = left;
		ete.y = top;
		ete.acceleration = new V2(direction == 'right' ? .05 : -.05, Math.random() * .2 + .1);
		ete.velocity = new V2(0, 0);

		ete.addEventListener('mousedown', function(){
			alert('test');
		});

		Game.add(ete);
	}
	, time: 5000
	, interval: function(){
		var self = this;
		this.create();
		setTimeout(function(){ self.interval(); }, Math.random() * self.time + 1000);
	}
	, generateRandomImages: function(n){
		var colors =['#c165c1']; //Initied with default color
		for(var i = 0; i < n; i++){
			colors.push('#' + (Math.round(Math.random() * (255 * 255 * 255))).toString(16));
		}

		for(var i = 0; i < colors.length; i++){
			this.images.push({
				color: colors[i]
				, ete: 'getImage.php?type=ete&color='+encodeURIComponent(colors[i])
				, explode: 'getImage.php?type=explode&color='+encodeURIComponent(colors[i])
			});
		}
	}
}

var Clouds = {
	count: 0
	, FPS: Math.round((Math.random() * 5 * 60) + 60)
	, create: function(){
		var rand1 		= Math.random()
			, rand2 	= Math.random()
			, rand3 	= Math.random()
			, rand4 	= Math.random()
			, top 		= rand1 * ($(window).height() / 2)
			, left 		= -140
			, fontSize 	= (rand2 * 70) + 70
			, opacity 	= (rand4 * .5) + .2
			, time 		= (rand3 * 15000) + 10000;

		$('<i class="icon-cloud"></i>').css({top: top, left: left, fontSize: fontSize, opacity: opacity}).appendTo('body').animate({left: $(window).width()}, time, 'linear', function(){
			$(this).remove();
		});
	}

	, time: 5000
	, interval: function(){
		var self = this;
		this.create();
		setTimeout(function(){ self.interval(); }, Math.random() * self.time + 1000);
	}
}

var Arr = {
	remove: function(array, remove){
		var _return = [];
		for(var i = 0; i < array.length; i++){
			if(array[i] != remove){
				_return.push(array[i]);
			}
		}
		return _return;
	},
    merge: function(/* variable number of arrays */){
        var _return = [];
        for(var i = 0; i < arguments.length; i++){
            var array = arguments[i];
            for(var j = 0; j < array.length; j++){
                if(_return.indexOf(array[j]) === -1) {
                    _return.push(array[j]);
                }
            }
        }
        return _return;
    }
}


var EventHandler = function(context){
	this.context = context;
	this.events = {};
}

EventHandler.prototype.bind = function(name, fn){
	if(!this.events[name]){
		this.events[name] = [fn];
	}else{
		this.events[name].push(fn);
	}
};

EventHandler.prototype.trigger = function(name, params){
	if(this.events[name])
	for(var i = 0; i < this.events[name].length; i++){
		this.events[name][i].apply(this.context, [params || null]);
	}
};

var Preloader = (function(){
	function Preloader(){
		this.queue = [];
		this.index = 0;
	}

	Preloader.prototype.bind = function(name, fn){
		if(!this.event)	this.event = new EventHandler(this);
		this.event.bind(name, fn);
	};

	Preloader.prototype.trigger = function(name, params){
		if(!this.event)	this.event = new EventHandler(this);
		this.event.trigger(name, params);
	};

	/*
	* Add to a queue
	* @param params
	*/
	Preloader.prototype.add = function(params){
		if(!this.has(params)){
			this.queue.push(params);
			this.trigger('add');
		}
	}

	Preloader.prototype.get = function(id){
		console.log(this.list);
		for (var i = 0; i < this.list.length; i++) {
			if(this.list[i].id == id){
				return this.list[i].img;
			}
		}

		return false;
	}

	/*
	* Add to a queue
	* @param params
	*/
	Preloader.prototype.has = function(params){
		for (var i = 0; i < this.queue.length; i++) {
			if(JSON.stringify(this.queue[i]) == JSON.stringify(params)){
				return true;
			}
		}

		for (i = 0; i < this.list.length; i++) {
			if(JSON.stringify(this.list[i]) == JSON.stringify(params)){
				return true;
			}
		}

		return false;
	}

	/*
	* Clear the queue
	* @param
	*/
	Preloader.prototype.clear = function(){
		this.queue = [];
		this.index = 0;
		this.trigger('clear');
	}

	/*
	* Load to the next file
	* @param
	*/
	Preloader.prototype.next = function(){
		if(this.index < this.queue.length){
			var self 	= this;
			var current = this.index++;
			var img 	= new Image();
			img.src 	= this.queue[current].src;
			img.onload 	= function(){
				self.trigger('itemComplete', current);
				self.queue[current].img = this;
				self.list.push(self.queue[current]);
				self.next();
			}
		}else{
			this.trigger('complete');
		}
	}

	/*
	* Start to load the queue
	* @param
	*/
	Preloader.prototype.start = function(){
		this.trigger('start');
		this.next();
	}

	Preloader.prototype.list = [];

	return Preloader;
})();


Game.initializer();
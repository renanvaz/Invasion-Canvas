(function(window) {
	EteBitmap = function() {
		this.initialize();
	}
	EteBitmap._SpriteSheet = new createjs.SpriteSheet({images: ['getImage.php?color=995599&type=ete'], frames: [[0,0,153,158,0,74.5,74],[153,0,153,158,0,74.5,74],[306,0,153,158,0,74.5,74],[0,158,153,158,0,74.5,74],[153,158,153,158,0,74.5,74],[306,158,153,158,0,74.5,74],[0,316,153,158,0,74.5,74],[153,316,153,158,0,74.5,74]],  animations: {fall:[0,7, true]}});
	var EteBitmap_p = EteBitmap.prototype = new createjs.BitmapAnimation();
	EteBitmap_p.BitmapAnimation_initialize = EteBitmap_p.initialize;
	EteBitmap_p.initialize = function() {
		this.BitmapAnimation_initialize(EteBitmap._SpriteSheet);
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

		this.canvas = document.getElementById('game');
		this.stage = new createjs.Stage(this.canvas);
		createjs.Touch.enable(this.stage);
		//this.stage.autoClear = false;

		var manifest = [
            {src:'getImage.php?color=995599&type=ete', id:'ete'}
            , {src:'img/EteExplode.png', id:'explode'}
            , {src:'img/mountain1.png', id:'mountain1'}
            , {src:'img/mountain2.png', id:'mountain2'}
        ];

        loader = new createjs.LoadQueue(false);
        loader.onComplete = function(){
        	var mountain1 = loader.getResult('mountain1');
        	var mountain2 = loader.getResult('mountain2');

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
        }

        loader.loadManifest(manifest);
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
	create: function(){
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


var EteImage = (function(){
	function EteImage(){
		var self = this;
		this.data = {index: [], cache: {}};
	}
	EteImage.prototype = new DisplayObject();

	EteImage.prototype.cache = function(colors){
		var self = this;
		var count = 0;
		for(var i = 0; i < colors.length; i++){
			var img = {
				ete: new Image,
				explode: new Image
			}

			var nocache = +new Date;

			img.ete.onload = function(){
				if(++count == colors.length*2){
					self.trigger('cached');
				}
			}

			img.explode.onload = function(){
				if(++count == colors.length*2){
					self.trigger('cached');
				}
			}

			img.ete.src = 'getImage.php?type=ete&color='+encodeURIComponent(colors[i])+'&'+nocache;
			img.explode.src = 'getImage.php?type=explode&color='+encodeURIComponent(colors[i])+'&'+nocache;

			self.data.index.push(colors[i]);
			self.data.cache[colors[i]] = img;
		}
	}

	EteImage.prototype.getRandomCached = function(){
		return this.data.cache[this.data.index[Math.round(Math.random() * (this.data.index.length -1))]];
	}

	return EteImage;
})();

Game.initializer();
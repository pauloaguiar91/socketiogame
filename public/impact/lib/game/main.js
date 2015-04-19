ig.module( 
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.levels.untitled'
)
.defines(function(){
        var dir = "/public/impact/";

MultiVerse = ig.Game.extend({

	// Load a font
	//font: new ig.Font( dir + 'media/04b03.font.png' ),


    resizeEventHandler: function() {
        ig.system.resize($(window).width(), $(window).height());
    },
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
        this.loadLevel( LevelUntitled );

        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

        $(window).resize(this.resizeEventHandler);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();


        if( ig.input.pressed('up') ) { }
        if( ig.input.pressed('down') ) { }
        if( ig.input.pressed('left') ) { }
        if( ig.input.pressed('right') ) { }
	},
	
	draw: function() {
		this.parent();

		var x = ig.system.width/2,
			y = ig.system.height/2;

//        this.screen.x += 1;
//        this.screen.y += 1;
		
//		this.font.draw('', x, y, ig.Font.ALIGN.CENTER);
//        this.font.size = 240;
	}
});

ig.main( '#canvas', MultiVerse, 60, $(window).width(), $(window).height(), 1 );

});

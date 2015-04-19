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
	font: new ig.Font( dir + 'media/04b03.font.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
        this.loadLevel( LevelUntitled );
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;


        this.screen.x += 0.6;
        this.screen.y += 0.4;
		
//		this.font.draw( 'It Works, bitches!', x, y, ig.Font.ALIGN.CENTER );
//        this.font.size = 240;
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MultiVerse, 60, $(window).width(), $(window).height(), 1 );

});

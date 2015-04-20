ig.module( 
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.entities.player',
    'game.entities.otherplayer',
    'game.entities.playerbox',
    'game.levels.untitled'
)
.defines(function(){
        var dir = "/public/impact/";

MultiVerse = ig.Game.extend({
	font: new ig.Font( dir + 'media/04b03.font.png' ),

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
	},
	
	draw: function() {
        this.parent();

        var player = this.getEntitiesByType( EntityPlayer )[0];

        if( player ) {
            var x = player.pos.x - ig.system.width / 2,
                y = player.pos.y - ig.system.height / 2;

            this.screen.x = x;
            this.screen.y = y;

            this.font.size = 50;
            this.font.draw(player.name, (ig.system.width / 2), (ig.system.height / 2) - 10, ig.Font.ALIGN.right );
        }
	}
});

ig.main( '#canvas', MultiVerse, 60, $(window).width(), $(window).height(), 1 );

});

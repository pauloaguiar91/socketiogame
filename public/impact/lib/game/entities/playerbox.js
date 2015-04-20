ig.module(
        'game.entities.playerbox'
    )
    .requires(
        'impact.entity'
    )
    .defines(function(){
        EntityPlayerBox = ig.Entity.extend({
            font: new ig.Font( '/public/impact/media/04b03.font.png' ),
            //animSheet: new ig.AnimationSheet( '/public/impact/media/player.png', 32, 32 ),
            size: {x: 32, y:32},
            friction: {x: 500, y: 500},
            name: null,

            init: function( x, y, settings ) {
                this.addAnim( 'idle', 1, [0] );
                this.currentAnim = this.anims.idle;

                this.pos.x = x;
                this.pos.y = y;

                this.parent( x, y, settings );
            },

            update: function() {
                this.parent();
            },

            draw: function() {
                this.parent();
                //this.font.draw("test",this.pos.x, this.pos.y);
            }
        });
    });
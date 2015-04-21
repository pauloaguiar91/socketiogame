ig.module(
        'game.entities.otherplayer'
    )
    .requires(
        'impact.entity'
    )
    .defines(function(){
        EntityOtherPlayer = ig.Entity.extend({
            font: new ig.Font( '/public/impact/media/04b03.font.png' ),
            animSheet: new ig.AnimationSheet( '/public/impact/media/player.png', 32, 32 ),
            size: {x: 32, y:32},
            pos: {x: 1500, y: 1500},
            friction: {x: 400, y: 400},
            name: "otherPlayer",
            playerBox: null,

            init: function( x, y, settings ) {
                this.addAnim( 'idle', 1, [0] );
                this.addAnim( 'up', 1, [0] );
                this.addAnim( 'down', 1, [0] );
                this.addAnim( 'left', 1, [0] );
                this.addAnim( 'right', 1, [0] );

                this.currentAnim = this.anims.idle;

                //this.playerBox = ig.game.spawnEntity("EntityPlayerBox", this.pos.x, this.pos.y - 20);

                this.parent( x, y, settings );
            },

            update: function() {
                this.parent();
            },

            draw: function() {
                this.parent();
            }
        });
    });
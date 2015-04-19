ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( '/public/impact/media/player.png', 16, 16 ),
        size: {x: 32, y:32},
        offset: {x: 0, y: 0},
        flip: false,
        maxVel: {x: 100, y: 150},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 200,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', 1, 1 );
            this.addAnim( 'run', 1, 1 );
            this.addAnim( 'jump', 1, 1);
            this.addAnim( 'fall', 1, 1 );
        }
    });
});
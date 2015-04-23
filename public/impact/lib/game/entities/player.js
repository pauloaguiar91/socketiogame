ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( '/public/impact/media/player.png', 32, 32 ),
        size: { x: 32, y:32 },
        friction: { x: 0, y: 0 },
        speed: 40,
        maxVel: {x: 100, y: 100},
        name: "player",

        init: function( x, y, settings ) {
            this.addAnim( 'idle', 1, [0] );
            this.addAnim( 'up', 1, [0] );
            this.addAnim( 'down', 1, [0] );
            this.addAnim( 'left', 1, [0] );
            this.addAnim( 'right', 1, [0] );

            this.currentAnim = this.anims.idle;
            this.name = settings.name;

            this.parent( x, y, settings );
        },

        update: function() {
            if( ig.input.state('up') ) {
                this.currentAnim = this.anims.up;
                this.vel.y -= this.speed;
                this.vel.x = 0;
            } else if( ig.input.state('down') ) {
                this.currentAnim = this.anims.down;
                this.vel.y += this.speed;
                this.vel.x = 0;
            } else if( ig.input.state('left') ) {
                this.currentAnim = this.anims.left;
                this.vel.x -= this.speed;
                this.vel.y = 0;
            } else if( ig.input.state('right') ) {
                this.currentAnim = this.anims.right;
                this.vel.x += this.speed;
                this.vel.y = 0;
            } else {
                this.vel.x = 0;
                this.vel.y = 0;
            }

            ig.game.socket.emit("data", { "name": this.name, "x": this.pos.x, "y": this.pos.y } );
            this.parent();
        },

        draw: function() {
            this.parent();
        }
    });
});
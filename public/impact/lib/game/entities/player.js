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
        friction: { x: 100, y: 100 },
        speed: 50,
        maxVel: {x: 50, y: 50},
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

            if( ig.input.pressed('up') ) {
                this.currentAnim = this.anims.up;
                this.vel.y -= this.speed;
            } else if( ig.input.pressed('down') ) {
                this.currentAnim = this.anims.down;
                this.vel.y += this.speed;
            } else if( ig.input.pressed('left') ) {
                this.currentAnim = this.anims.left;
                this.vel.x -= this.speed;
            } else if( ig.input.pressed('right') ) {
                this.currentAnim = this.anims.right;
                this.vel.x += this.speed;
            }

            ig.game.socket.emit("data", { "name": this.name, "x": this.pos.x, "y": this.pos.y } );
            this.parent();
        },

        draw: function() {
            this.parent();
        }
    });
});
ig.module(
        'game.entities.txt'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityTxt = ig.Entity.extend({
            size: {
                x: 910,
                y: 910
            },

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            collides: ig.Entity.COLLIDES.NEVER,

            animSheet: new ig.AnimationSheet('media/txt.png', 910, 910),



            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 0.5, [0, 1]);
            },


            update: function () {
                // Do nothing in this update function; don't even call this.parent().
                // The coin just sits there, isn't affected by gravity and doesn't move.

                // We still have to update the animation, though. This is normally done
                // in the .parent() update:
                this.currentAnim.update();
            },



        });

    });

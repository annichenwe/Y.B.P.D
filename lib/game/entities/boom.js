ig.module(
        'game.entities.boom'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityBoom = ig.Entity.extend({
            size: {
                x: 522,
                y: 522
            },

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            collides: ig.Entity.COLLIDES.NEVER,

            animSheet: new ig.AnimationSheet('media/boom.png', 522.4, 522.5),
            //sfxCollect: new ig.Sound('media/Sounds/Player/pickup.*'),


            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 0.1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            },


            update: function () {
                // Do nothing in this update function; don't even call this.parent().
                // The coin just sits there, isn't affected by gravity and doesn't move.

                // We still have to update the animation, though. This is normally done
                // in the .parent() update:
                this.currentAnim.update();

                if ((this.currentAnim == this.anims.idle) && (this.currentAnim.frame == 9)) {
                    this.kill();
                }

            },


            check: function (other) {
                // The instanceof should always be true, since the player is
                // the only entity with TYPE.A - and we only check against A.

            }
        });

    });

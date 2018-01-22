ig.module(
        'game.entities.blob'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityBlob = ig.Entity.extend({
            size: {
                x: 90,
                y: 50
            },
            offset: {
                x: 24,
                y: 0
            },
            maxVel: {
                x: 100,
                y: 100
            },
            friction: {
                x: 150,
                y: 0
            },

            type: ig.Entity.TYPE.B, // Evil enemy group
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            collides: ig.Entity.COLLIDES.PASSIVE,

            health: 3,


            speed: 36,
            flip: false,

            animSheet: new ig.AnimationSheet('media/blob.png', 100, 50),
            sfxHurt: new ig.Sound('media/Sounds/Blobs/pain.*'),
            sfxDie: new ig.Sound('media/Sounds/Blobs/death.*'),



            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('crawl', 0.2, [0, 1]);
                this.addAnim('dead', 1, [2]);
                this.addAnim('pain', 0.3, [3]);
            },


            update: function () {
                // Near an edge? return!
                if (!ig.game.collisionMap.getTile(
                        this.pos.x + (this.flip ? +1 : this.size.x - 1),
                        this.pos.y + this.size.y + 1
                    )) {
                    this.flip = !this.flip;

                    // We have to move the offset.x around a bit when going
                    // in reverse direction, otherwise the blob's hitbox will
                    // be at the tail end.
                    this.offset.x = this.flip ? 0 : 14;
                }



                if (
                    this.currentAnim == this.anims.pain &&
                    this.currentAnim.loopCount < 1
                ) {
                    // If we're dead, fade out
                    if (this.health <= 0) {
                        // The pain animation is 0.3 seconds long, so in order to 
                        // completely fade out in this time, we have to reduce alpha
                        // by 3.3 per second === 1 in 0.3 seconds
                        var dec = (1 / this.currentAnim.frameTime) * ig.system.tick;
                        this.currentAnim.alpha = (this.currentAnim.alpha - dec).limit(0, 1);
                    }
                } else if (this.health <= 0) {
                    // We're actually dead and the death (pain) animation is 
                    // finished. Remove ourself from the game world.
                    this.kill();
                } else if (this.vel.x != 0) {
                    this.currentAnim = this.anims.crawl;
                }

                var xdir = this.flip ? -1 : 1;
                this.vel.x = this.speed * xdir;
                this.currentAnim.flip.x = !this.flip;
                this.parent();


            },

            kill: function () {
                this.sfxDie.play();
                this.parent();

            },

            handleMovementTrace: function (res) {
                this.parent(res);

                // Collision with a wall? return!
                if (res.collision.x) {
                    this.flip = !this.flip;
                    this.offset.x = this.flip ? 0 : 14;
                }
            },

            check: function (other) {
                other.receiveDamage(1, this);
            },

            receiveDamage: function (amount, from) {
                if (this.currentAnim == this.anims.pain) {
                    // Already in pain? Do nothing.
                    return;

                }

                // We don't call the parent implementation here, because it 
                // would call this.kill() as soon as the health is zero. 
                // We want to play our death (pain) animation first.
                this.health -= amount;
                this.currentAnim = this.anims.pain.rewind();



                // Sound
                this.sfxHurt.play();
            }
        });

    });

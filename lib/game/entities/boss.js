ig.module(
        'game.entities.boss'
    )
    .requires(
        'impact.entity'

    )
    .defines(function () {

        EntityBoss = ig.Entity.extend({
            size: {
                x: 323,
                y: 630
            },
            offset: {
                x: 49,
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



            animSheet: new ig.AnimationSheet('media/boss.png', 420, 630.5),
            sfxHurt: new ig.Sound('media/Sounds/Boss/boss_pain.*'),
            sfxDie: new ig.Sound('media/Sounds/Boss/boss_death.*'),
            sfxAttack: new ig.Sound('media/Sounds/Boss/boss_attack.*'),



            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 0.3, [0, 1, 2, 1]);
                this.addAnim('die', 0.2, [6, 7, 8, 9, 10, 11]);
                this.addAnim('pain', 0.1, [3, 4, 5, 4]);


            },






            update: function () {


                var player = ig.game.getEntitiesByType(EntityPlayer)[0];

                if ((this.distanceTo(ig.game.player) < 1000) && (ig.game.getEntitiesByType(EntityLazer).length < 1)) {
                    ig.game.spawnEntity(EntityLazer, this.pos.x, this.pos.y + 280);
                }
                //ARRAY MED VARIABEL PÅ HVOR SKYTE BOOOM - Andreas



                if (
                    this.currentAnim == this.anims.pain &&
                    this.currentAnim.loopCount < 1
                ) {
                    // If we're dead, fade out
                    if (this.health <= 0) {

                        // The pain animation is 0.3 seconds long, so in order to 
                        // completely fade out in this time, we have to reduce alpha
                        // by 3.3 per second === 1 in 0.3 seconds
                        var dec = (0.3 / this.currentAnim.frameTime) * ig.system.tick;
                        this.currentAnim.alpha = (this.currentAnim.alpha - dec).limit(0, 1);
                    }
                } else if (this.health <= 0) {
                    // We're actually dead and the death (pain) animation is 
                    // finished. Remove ourself from the game world.
                    this.kill();
                    ig.game.spawnEntity(EntityBoom, this.pos.x - 100, this.pos.y + 80);

                } else {
                    this.currentAnim = this.anims.idle;
                }





                this.parent();


            },



            kill: function () {
                this.sfxDie.play();

                this.parent();

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

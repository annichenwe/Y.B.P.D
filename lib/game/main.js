ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'impact.font',

        'plugins.camera',

        'game.entities.player',
        'game.entities.blob',
        'game.entities.coin',
        'game.entities.projectile',
        'game.entities.boss',
        'game.entities.enter',
        'game.entities.platform-move',
        'game.entities.platform-target',
        'game.entities.lazer',
        'game.entities.boom',
        'game.entities.txt',

        'game.levels.title',
        'game.levels.main',
        'game.levels.boss',
        'game.levels.endtitle',

        //'impact.debug.debug'

    )
    .defines(function () {

        MyGame = ig.Game.extend({

            clearColor: "#40122c",
            gravity: 800,

            // Load a font
            font: new ig.Font('media/vcr42.font.png'),
            coinIcon: new ig.Image('media/pill.png'),
            healthFull: new ig.Image('media/health-full.png'),
            healthEmpty: new ig.Image('media/health-empty.png'),

            level1sound: new ig.Sound('media/Sounds/Music/l1.*', false),
            boss1sound: new ig.Sound('media/Sounds/Music/b1.*', false),




            init: function () {
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.UP_ARROW, 'jump');
                ig.input.bind(ig.KEY.SPACE, 'shoot');

                ig.music.add(this.boss1sound);
                ig.music.add(this.level1sound);

                // Initialize your game here; bind keys etc.
                this.loadLevel(LevelMain);

                this.font.letterSpacing = -5;

                ig.music.volume = .8;
                ig.music.play(this.level1sound);
            },





            loadLevel: function (data) {
                // Remember the currently loaded level, so we can reload when
                // the player dies.
                this.currentLevel = data;
                ig.music.volume = .8;
                ig.music.next();
                // Call the parent implemenation; this creates the background
                // maps and entities.
                this.parent(data);

                this.setupCamera();


            },

            setupCamera: function () {
                // Set up the camera. The camera's center is at a third of the screen
                // size, i.e. somewhat shift left and up. Damping is set to 3px.		
                this.camera = new ig.Camera(ig.system.width / 3, ig.system.height / 3, 3);

                // The camera's trap (the deadzone in which the player can move with the
                // camera staying fixed) is set to according to the screen size as well.
                this.camera.trap.size.x = ig.system.width / 10;
                this.camera.trap.size.y = ig.system.height / 2.5;

                // The lookahead always shifts the camera in walking position; you can 
                // set it to 0 to disable.
                this.camera.lookAhead.x = ig.system.width / 6;

                // Set camera's screen bounds and reposition the trap on the player
                this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
                this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
                this.camera.set(this.player);
            },

            reloadLevel: function () {
                this.loadLevelDeferred(this.currentLevel);


            },

            update: function () {




                // Update all entities and backgroundMaps
                this.parent();

                // Add your own, additional update code here

                this.camera.follow(this.player);


            },

            draw: function () {
                // Call the parent implementation to draw all Entities and BackgroundMaps
                this.parent();

                if (this.player) {
                    var x = 30,
                        y = 16;

                    for (var i = 0; i < this.player.maxHealth; i++) {
                        // Full or empty health
                        if (this.player.health > i) {
                            this.healthFull.draw(x, y);
                        } else {
                            this.healthEmpty.draw(x, y);
                        }

                        x += this.healthEmpty.width - 2;
                    }

                    // We only want to draw the 0th tile of coin sprite-sheet
                    y += 75;
                    this.coinIcon.drawTile(16, y, 0, 36);

                    y += 5;
                    this.font.draw(this.player.coins, 55, y)
                }
            }
        });

        MyTitle = ig.Game.extend({
            clearColor: null,


            // The title image
            //title: new ig.Image('media/tile.png'),

            // Load a font
            font: new ig.Font('media/vcr.font.png'),
            background: new ig.Image('media/titlescreen.png'),



            init: function () {
                // Bind keys

                ig.input.bind(ig.KEY.SPACE, 'shoot');



                // We want the font's chars to slightly touch each other,
                // so set the letter spacing to -2px.
                this.font.letterSpacing = -2;

                this.loadLevel(LevelTitle);
                this.maxY = this.backgroundMaps[0].pxHeight - ig.system.height;
            },

            update: function () {
                // Check for buttons; start the game if pressed
                if (ig.input.pressed('shoot')) {
                    ig.system.setGame(MyGame);
                    return;

                }




                this.parent();

            },

            draw: function () {

                var image = this.background.data;
                ig.system.context.drawImage(image, 0, 0, ig.system.width, ig.system.height);

                this.parent();


            }
        });



        var scale = (window.innerWidth < 640) ? 2 : 1;

        var canvas = document.getElementById('canvas');
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';


        // Listen to the window's 'resize' event and set the canvas' size each time
        // it changes.
        window.addEventListener('resize', function () {
            // If the game hasn't started yet, there's nothing to do here
            if (!ig.system) {
                return;
            }

            // Resize the canvas style and tell Impact to resize the canvas itself;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ig.system.resize(window.innerWidth * scale, window.innerHeight * scale);

            // Re-center the camera - it's dependend on the screen size.
            if (ig.game && ig.game.setupCamera) {
                ig.game.setupCamera();
            }

        }, false);
        // Start the Game with 60fps, a resolution of 320x240, scaled
        // up by a factor of 2
        var width = window.innerWidth * scale,
            height = window.innerHeight * scale;
        ig.main('#canvas', MyTitle, 60, width, height, 1);

    });

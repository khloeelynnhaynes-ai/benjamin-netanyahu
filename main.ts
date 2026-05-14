// Space Invaders Game for MakeCode Arcade

// Game variables
let playerShip: Sprite
let projectiles: Sprite[] = []
let enemies: Sprite[] = []
let score = 0
let lives = 3
let gameOver = false

// Initialize game
function startGame() {
    // Create player ship (spaceship)
    playerShip = sprites.create(img`
        . . . . . 5 . . . . .
        . . . . 5 5 5 . . . .
        . . . 5 5 5 5 5 . . .
        . . 5 5 5 5 5 5 5 . .
        . 5 5 5 5 5 5 5 5 5 .
        5 5 5 5 5 5 5 5 5 5 5
    `, SpriteKind.Player)
    playerShip.setPosition(80, 110)
    playerShip.setVelocity(0, 0)

    // Play background music
    music.play(music.tonePlayable(440, music.beat(BeatFraction.Half)), music.PlaybackMode.LoopingInBackground)

    // Game loop
    game.onUpdate(function () {
        if (!gameOver) {
            updateGame()
        }
    })

    // Controls
    controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!gameOver) {
            playerShip.vx = -80
        }
    })

    controller.left.onEvent(ControllerButtonEvent.Released, function () {
        if (!gameOver && !controller.right.isPressed()) {
            playerShip.vx = 0
        }
    })

    controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!gameOver) {
            playerShip.vx = 80
        }
    })

    controller.right.onEvent(ControllerButtonEvent.Released, function () {
        if (!gameOver && !controller.left.isPressed()) {
            playerShip.vx = 0
        }
    })

    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!gameOver) {
            shoot()
        }
    })
}

// Shoot projectile (little ball)
function shoot() {
    let projectile = sprites.create(img`
        . . . . .
        . . 5 . .
        . 5 5 5 .
        . . 5 . .
        . . . . .
    `, SpriteKind.Projectile)
    projectile.setPosition(playerShip.x, playerShip.y - 10)
    projectile.vy = -150
    projectiles.push(projectile)

    // Shoot sound effect
    music.play(music.tonePlayable(880, music.beat(BeatFraction.Eighth)), music.PlaybackMode.UntilDone)
}

// Update game state
function updateGame() {
    // Spawn enemies randomly (little balls)
    if (Math.percentChance(5)) {
        spawnEnemy()
    }

    // Update projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        if (projectiles[i].y < 0) {
            projectiles[i].destroy()
            projectiles[i] = null
        }
    }

    // Clean up null projectiles
    projectiles = projectiles.filter(p => p != null)

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].y > 120) {
            enemies[i].destroy()
            enemies[i] = null
            lives--

            // Miss sound effect
            music.play(music.tonePlayable(220, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)

            if (lives <= 0) {
                endGame()
            }
        }
    }

    // Clean up null enemies
    enemies = enemies.filter(e => e != null)

    // Check collisions
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (projectiles[i].overlapsWith(enemies[j])) {
                projectiles[i].destroy()
                enemies[j].destroy()
                projectiles[i] = null
                enemies[j] = null
                score += 100

                // Hit sound effect
                music.play(music.tonePlayable(1200, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.UntilDone)

                break
            }
        }
    }

    // Clean up after collisions
    projectiles = projectiles.filter(p => p != null)
    enemies = enemies.filter(e => e != null)

    drawUI()
}

// Spawn enemy (little ball)
function spawnEnemy() {
    let enemy = sprites.create(img`
        . . . . .
        . . 2 . .
        . 2 2 2 .
        . . 2 . .
        . . . . .
    `, SpriteKind.Enemy)
    enemy.setPosition(Math.randomRange(10, 150), 10)
    enemy.vy = 40 + Math.randomRange(0, 30)
    enemy.vx = Math.randomRange(-20, 20)
    enemies.push(enemy)
}

// Draw UI
function drawUI() {
    screen.fillRect(0, 0, 160, 14, 0)
    screen.print("Score: " + score, 5, 4, 1)
    screen.print("Lives: " + lives, 130, 4, 1)
}

// End game
function endGame() {
    gameOver = true
    screen.fillRect(0, 0, 160, 120, 0)
    screen.print("GAME OVER", 55, 50, 15)
    screen.print("Score: " + score, 50, 65, 1)

    // Game over sound effect
    music.play(music.tonePlayable(400, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
    music.play(music.tonePlayable(300, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
    music.play(music.tonePlayable(200, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)

    pause(5000)
}

// Start the game
startGame()

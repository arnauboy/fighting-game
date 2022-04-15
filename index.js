const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './img/background.png'
})

const shop = new Sprite({
	position: {
		x: 600,
		y: 160
	},
	imageSrc: './img/shop.png',
	scale : 2.5,
	framesMax: 6
})

const player = new Fighter({
	position: {
	x: 0,
	y: 0
	},
	velocity : {
		x: 0,
		y: 10
	},
	imageSrc: './img/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215, 
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: './img/samuraiMack/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/samuraiMack/Run.png',
			framesMax: 8
		}, 
		jump: {
			imageSrc: './img/samuraiMack/Jump.png',
			framesMax: 2
		}, 
		fall: {
			imageSrc: './img/samuraiMack/Fall.png',
			framesMax: 2
		}, 
		attack1: {
			imageSrc: './img/samuraiMack/Attack1.png',
			framesMax: 6
		}, 
	}
})

const enemy = new Fighter({
	position: {
	x: 400,
	y: 100
	},
	velocity : {
		x: 0,
		y: 0
	},	
	color: 'red',
	offset : {
		x: -50,
		y: 10
	}
})


const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}
}

decreaseTimer()

function animate() {

	window.requestAnimationFrame(animate) //Infinite loop
	c.fillStyle = 'black'
	c.fillRect(0,0,canvas.width, canvas.height)

	background.update()
	shop.update()
	player.update()
	//enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	//player movement
	if(keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5
		player.switchSprite('run')
	}
	else if(keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5
		player.switchSprite('run')
	}


	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	}
	else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}
	else player.switchSprite('idle')

	//enemy movement
	if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5

	}
	else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5
	}

	//detect for collision
	if (rectangularCollision(
		{
			rectangle1: player,
			rectangle2: enemy
		}
		) && player.isAttacking) {	
		player.isAttacking = false
		console.log("player attack successfull")
		enemy.health -= 20
		document.querySelector('#enemyHealth').style.width =  enemy.health + '%'
	}

	if (rectangularCollision(
		{
			rectangle1: enemy,
			rectangle2: player
		}
		) && enemy.isAttacking) {	
		enemy.isAttacking = false
		console.log("enemy attack successfull")
		player.health -= 20
		document.querySelector('#playerHealth').style.width =  player.health + '%'
	}

	//end game based on health
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({ player,enemy,timerId })
	}
}

animate()

window.addEventListener('keydown', (e) => {
	switch (e.key) {
		//player casess
		case 'd':
			keys.d.pressed = true
			player.lastKey = e.key
			break
		case 'a':
			keys.a.pressed = true
			player.lastKey = e.key
			break
		case 'w':
			if (player.jumps < 2) {
				player.jumps += 1
				player.velocity.y = -20
			}
			break
		case ' ':
			player.attack()
			break

		//enemy cases
		case 'ArrowRight':
			keys.ArrowRight.pressed = true
			enemy.lastKey = e.key
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true
			enemy.lastKey = e.key
			break
		case 'ArrowUp':
			if (enemy.jumps < 2) {
				enemy.jumps += 1
				enemy.velocity.y = -20
			}
			break
		case 'Control':
			enemy.attack()
			break

	}
})

window.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'd':
			keys.d.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
	}

	switch (e.key) {
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
	
	}
})



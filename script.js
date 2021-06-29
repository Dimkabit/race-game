const score = document.querySelector('.score'),
		start = document.querySelector('.start'),
		gameArea = document.querySelector('.gameArea'),
		car = document.createElement('div'),
		btns = document.querySelectorAll('.btn');

const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;


const music = document.createElement('embed');
music.src = './flo.mp3';
music.classList.add('visually-hidden');

	
car.classList.add('car');		



const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const setting = {
	start: false,
	score: 0,
	speed: 3,
	trafic: 3,
	record: localStorage.getItem('best-record'),
}


let startSpeed = 0;

const changeLevel = (lvl) => {
	switch (lvl) {
		case '1':
			setting.trafic = 4;
			setting.speed = 3;
			break;
		case '2':
			setting.trafic = 3;
			setting.speed = 5;
			break;
		case '3':
			setting.trafic = 3;
			setting.speed = 7;
			break;
		
	}
	startSpeed = setting.speed;
}

function getQuantityElements(heightElement) {
	return (gameArea.offsetHeight / heightElement) + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

function startGame(e) {

	const target = e.target;
	if(!target.classList.contains('btn')) return;

	const levelGame = target.dataset.levelGame;
	
	changeLevel(levelGame);
	btns.forEach(btn => btn.disabled = true);


	document.body.append(music)
	gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;

	start.classList.add('hide');
	gameArea.innerHTML = '';
	
	
	for(let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * HEIGHT_ELEM) + 'px';
		line.style.height = (HEIGHT_ELEM / 2) + 'px';
		line.y = i * HEIGHT_ELEM;
		gameArea.append(line);
	}

	for(let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.trafic); i++) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.y = -HEIGHT_ELEM * setting.trafic * (i + 1);
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
		enemy.style.top = enemy.y + 'px';
		enemy.style.background = `transparent url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png) center / cover no-repeat`;
		gameArea.append(enemy);
	}
	setting.score = 0;
	setting.start = true;
	gameArea.append(car);
	car.style.left = '125px';
	car.style.top = 'auto';
	car.style.bottom = '10px';
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
	
};

function playGame() {
	
	if(setting.start) {
		setting.score += setting.speed;
		score.innerHTML = `
		<p>SCORE: ${setting.score}</p>
		${setting.record ? `<p>Best record: ${setting.record}</p>` : ''}`;

		setting.speed = startSpeed + Math.floor(setting.score / 5000);

		moveRoad();
		moveEnemy();
		if(keys.ArrowLeft && setting.x > 0) {
			setting.x -= setting.speed;
		}
		if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
			setting.x += setting.speed;
		}
		if(keys.ArrowUp && setting.y > 0) {
			setting.y -= setting.speed;
		}
		if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
			setting.y += setting.speed;
		}
		car.style.top = setting.y + 'px';
		car.style.left = setting.x + 'px';
		requestAnimationFrame(playGame);
	} else {
		music.remove();
		btns.forEach(btn => btn.disabled = false);
	}
	
};

function startRun(e) {
	if(keys.hasOwnProperty(e.key)) {
		e.preventDefault();
	keys[e.key] = true;
	}
};

function stopRun(e) {
	if(keys.hasOwnProperty(e.key)) {
		e.preventDefault();
	keys[e.key] = false;
	}
};

function moveRoad() {
	let lines = document.querySelectorAll('.line');
	lines.forEach(function(line) {
		line.y += setting.speed;
		line.style.top = line.y + 'px';
		
		if(line.y >= gameArea.offsetHeight) {
			line.y = -HEIGHT_ELEM;
		}
	});
}

function moveEnemy() {
	let enemy = document.querySelectorAll('.enemy');
	enemy.forEach(function(item){
		let carRect = car.getBoundingClientRect();
		let enemyRect = item.getBoundingClientRect();

		if(carRect.top <= enemyRect.bottom && 
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top) {
				setting.start = false;
				if(setting.score > setting.record) {
					localStorage.setItem('best-record', setting.score);
					alert(`Вы набрали новый рекорд на ${setting.score - setting.record} очков больше`);
					setting.record = setting.score;
				}
				console.log('dtp');
				start.classList.remove('hide');
			
		}

		item.y += setting.speed / 2;
		item.style.top = item.y + 'px'
		if(item.y >= gameArea.offsetHeight) {
			item.y = -HEIGHT_ELEM * setting.trafic;
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
		}
	});


}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

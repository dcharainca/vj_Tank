//Referencia al lienzo y su contexto de dibujo 2d
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let keys={};
document.addEventListener("keydown",(e)=> keys[e.key]=true);
document.addEventListener("keyup",(e)=> keys[e.key]=false);

//Definiiendo el jugador
const player = {x:50, y:50, w:30, h:30, color:'red', speed: 3};

//Defnicion de los niveles con obstaculos y monedas
const levels=[
		//Primer nivel
	{
		obstacles:[
			{x:100, y:150, w:400, h:20},
			{x:300, y:250, w:20, h:100}
		],
		coins:[
			{x:500, y:50, collected: false},
			{x:50, y:300, collected: false}
		]
	},
	//Segundo nivel
	{
		obstacles:[
			{x:200, y:100, w:200, h:20},
			{x:200, y:200, w:20, h:100},
			{x:400, y:200, w:20, h:100}
		],
		coins:[
			{x:500, y:50, collected: false},
			{x:550, y:200, collected: false},
			{x:300, y:180, collected: false}
		]
	},
	{
        obstacles: [
            {x: 100, y: 100, w: 100, h: 20},
            {x: 150, y: 200, w: 20, h: 100},
            {x: 400, y: 350, w: 150, h: 20}
        ],
        coins: [
            {x: 50, y: 50, collected: false},
            {x: 150, y: 300, collected: false},
            {x: 300, y: 100, collected: false},
            {x: 450, y: 200, collected: false}
        ]
    }

];



//Funcion para que aparezca el jugador u obstaculo
function drawRect(obj) {
	ctx.fillStyle = obj.color || 'white';
	ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}

//Indice del nivel actual
let currentLevel = 0

const sonidoColision = new Audio('sonido/colision.mp3');
let mostrarPantallaInicio = true; 

function rectsCollide(a,b){
	return(a.x < b.x + b.w && 
		a.x + a.w > b.x && 
		a.y < b.y + b.h &&
		a.y + a.h > b.y)
}

function update()
{
	if (mostrarPantallaInicio) {
     
        if (keys["Enter"]) {
            mostrarPantallaInicio = false;
            resetLevel();
        }
        return;
    }


	const level = levels[currentLevel];

	if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y + player.h < canvas.height) player.y += player.speed;
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x + player.w < canvas.width) player.x += player.speed;


	for(let obs of level.obstacles){
		if(rectsCollide(player, obs)){
			
			if(keys["ArrowUp"]) player.y += player.speed;
			if(keys["ArrowDown"]) player.y -= player.speed;
			if(keys["ArrowLeft"]) player.x += player.speed;
			if(keys["ArrowRight"]) player.x -= player.speed;
		}
	}

	for(let coin of level.coins){
		if(!coin.collected){
			if(
				player.x<coin.x +15 &&
				player.x + player.w > coin.x &&
				player.y < coin.y +15 &&
				player.y + player.h > coin.y
			){
				coin.collected=true;
				sonidoColision.play();
			}
		}
	}

	const allCollected = level.coins.every(x=>x.collected);
	if(allCollected){
		if(currentLevel < levels.length -1){
			currentLevel++;
			resetLevel();
		}else{
			alert("Felicitaciones! Edwin David Chara Inca");
			currentLevel=0;
			resetLevel();
		}

	}


}


function resetLevel(){

	player.x=50;
	player.y=50;
	levels[currentLevel].coins.forEach(x=>x.collected=false);

}

function draw()
{
	//Limpiar el lienzo
	ctx.clearRect(0,0, canvas.width, canvas.height);

	if (mostrarPantallaInicio) {        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("Edwin David Chara Inca", canvas.width / 2, canvas.height / 3);
        ctx.font = '20px Arial';
        ctx.fillText("Presiona ENTER para empezar", canvas.width / 2, canvas.height / 2);
        return; 
    }


	//Dibuja el jugador
	drawRect(player);

	const level = levels[currentLevel];

	//Dibuja los obstaculos
	for (let obs of level.obstacles){
		drawRect({...obs, color:'skyblue'});
	}
	//Dibuja las monedas no recogidas
	for (let coin of level.coins){
		if(!coin.collected){
			ctx.fillStyle='gold';
			ctx.beginPath();
			ctx.arc(coin.x + 7.5, coin.y + 7.5, 7.5, 0 , Math.PI*2);
			ctx.fill();
		}
	}
	//Muestra el numero del nivel actual
	ctx.fillStyle = 'white';
	ctx.fillText(`Nivel: ${currentLevel + 1}`,50,20);
}

function gameLoop(){
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

//Inicializa el juego
resetLevel();
gameLoop();

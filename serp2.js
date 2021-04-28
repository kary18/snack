window.onload = function()
{

	var canvasWidth = 1200;
	var canvasHeight = 700;
	var blockSize = 20;
	var ctx;
	var delay = 200;
	// var xCoord = 0;
	// var yCoord = 0;
	var kaa;
	var pom;
	var widthInBlocks = canvasWidth/blockSize;
	var heightInBlocks = canvasHeight/blockSize;
	var score;  

	init();

	function init()
		{
	/*fonction qui nous permet d'initialisé notre code
	***************************************************
	/*la fonction refreshcanvas va etre appeler a la fin de la fonction init 
	mais elle va etre appeler q'une fois*/

		var canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "20px solid #039dfc";
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		kaa = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
		pom = new Apple([10,10]);
		score = 0
		refreshCanvas();
	


		}
/*fonction qui va rafrechir notre canvas*/

	function refreshCanvas()
	{

		kaa.advance();

		if(kaa.checkCollision())
		{
			gameOver();
		}
		else
		{
			if(kaa.isEatingApple(pom))
			{
				score++;
				kaa.eatApple = true;
				do
				{
					pom.setNewposition();
				}
				while(pom.isOnSnake(kaa))
			}
			ctx.clearRect(0,0,canvasWidth, canvasHeight);

			drawScore();
			kaa.draw();
			pom.draw();
			
			setTimeout(refreshCanvas,delay);

		}
	}
//game over
		function gameOver()
		{
			ctx.save();
			ctx.font = "bold 70px sans-serif";
			ctx.fillStyle = "red";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.stroKeStyle = "white";
			ctx.lineWidth = 5;
			var centreX = canvasWidth / 2;
			var centreY = canvasHeight /2;
			ctx.strokeText("GAME OVER", centreX, centreY-180);
			ctx.fillText("GAME OVER",centreX, centreY-180);
			ctx.font = "bold 30px sans-serif";
			ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY-120);

			ctx.fillText("Appuyer sur la touche Espace pour rejouer",  centreX, centreY-120);
			ctx.restore();
		}
		function restart()
		{
			kaa = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
		pom = new Apple([10,10]);
		score = 0
		refreshCanvas();
		}
//score
		function drawScore()
		{
			ctx.save();
			ctx.font = "bold 200px sans-serif";
			ctx.fillStyle = "#039dfc";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			var centerX = canvasWidth / 2;
			var centerY = canvasHeight /2;
			ctx.fillText(score.toString(),centerX,centerY);
			
			ctx.restore();

		}
		/*ceci est notre rectangle:
		****************************************
	/* on va demander qu'il nous dessine notre rectangle
		 a une position X speciale que l'on va decider et a chaque fois
		  on va mettrea jour ce x la on va
		   appeler ça Xcoord come coordonnées et un grec*/
		// xCoord += 5;
		// yCoord += 5; on a plus besoin apres avoir cree notre prototype snake
		
		// ctx.fillStyle = "#ff0000";
		// ctx.fillRect(xCoord, yCoord , 100, 50);
		/*(c'etais pour dessiner le rectangle)*/
		
		

	function drawBlock(ctx, position)
		{
		var x = position[0]* blockSize;
		var y = position[1]* blockSize;
		ctx.fillRect(x ,y , blockSize, blockSize);
		}


/* on cree notre prototype de serpent avec cette fonction snake*/
	function Snake(body,direction)
		{
		this.body = body;
		this.direction = direction;
		this.eatApple = false;
		this.draw = function()
			{
		ctx.save();
		ctx.fillStyle = "yellow";
			for(var i = 0; i < this.body.length; i++)
				{
				drawBlock(ctx, this.body[i]);		
				}

		ctx.restore();
			};
		this.advance = function()
			{
				var nextPosition = this.body[0].slice();
				switch(this.direction)
					{
						case "left":
							nextPosition[0] -= 1;
							break;
						case "right":
							nextPosition[0] += 1;
							break;
						case "down":
							nextPosition[1] += 1;
							break;
						case "up":
							nextPosition[1] -= 1;
							break;
						default:
		//throw:FONCTION QUI PERMET DE DIRE qu'il ya une erreur et qui renvois un message d'erreur
							throw("Invalid Direction");

					}
				this.body.unshift(nextPosition);
				if(!this.eatApple)
				this.body.pop();
			else
				this.eatApple = false;
			};
			this.setDirection = function(newDirection)
			{
				var allowedDirection;
				switch(this.direction)
				{
					case "left":		
					case "right":
						allowedDirection= ["up", "down"];
						break;
					
							
					case "down":					
					case "up":
						allowedDirection= ["left", "right"];
						break;
					default:
						throw("Invalid Direction");
						
				}
				if(allowedDirection.indexOf(newDirection) > -1)
				{
					this.direction = newDirection;
				}
			};
			// quand notre serpent entre en collision avec
			//les bords du canvas ou avec son propre corp 

			this.checkCollision = function()
			{
				var wallCollision =false;
				var snakeCollision = false;
				var head = this.body[0];
				var rest = this.body.slice(1);
				var snakeX = head[0];
				var snakeY = head[1];				
				var minX = 0;
				var minY = 0;
				var maxX = widthInBlocks -1;
				var maxY = heightInBlocks -1;
				var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
				var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
				if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
				{
					wallCollision = true;
				}
 
				for(var i = 0; i < rest.length ; i++)
				{
					if(snakeX == rest[i][0] && snakeY === rest[i][1])
					{
						snakeCollision = true;
					}
				}
				return wallCollision || snakeCollision;
			};
			this.isEatingApple = function(appleToEat)
			{
				var head = this.body[0];
				if(head[0] === appleToEat.position[0] && head[1]=== appleToEat.position[1])
				
					return true;
				else
					return false;
				
			};
		}
		// fonction de la pomme

	function Apple(position)
		{
		this.position = position;
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle ="#ea1c09";
			ctx.beginPath();
			var radius = blockSize/2;
			var x = this.position[0]*blockSize + radius;
			var y = this.position[1]*blockSize + radius;
			ctx.arc(x,y, radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.restore();
		};
		this.setNewposition = function()
		{
			var newX = Math.round(Math.random() * (widthInBlocks-1));
			var newY = Math.round(Math.random() * (heightInBlocks-1));
			this.position = [newX,newY];
		};
		//notre pomme a une position aléatoire donc 
		//elle peux se trouver sur le corp de notre serpent
		this.isOnSnake = function(snakeToCheck)
		{
			var isOnSnake = false;
			for(var i = 0 ; i < snakeToCheck.body.length; i++)
			{
				if(this.position[0]=== snakeToCheck.body[i][0] && this.position[i] === snakeToCheck.body[i][1])
				{
					isOnSnake = true;
				}
			
			}
			return isOnSnake;
		};

	}
// pour  definir l'evenement
	document.onkeydown =  function handlekeydown(e)
	{
		var key = e.keyCode;
		var newDirection;
		switch(key)
		{
			// code des 4 fleches du clavier
			case 37://fleche gauche
				newDirection = "left";
				break;
			case 38:// fleche haut
				newDirection = "up";
				break;
			case 39://droite
				newDirection = "right";
				break;
			case 40://bas
				newDirection = "down";
				break;
			case 32://touche espace pour rejouer
				restart();
				return;
			default:
				return;

		}
		kaa.setDirection(newDirection);

	}
}
/*animation body
const colors = [
	'#711c91',
	'#ea00d9',
	'#0abdc6',
	'#133e7c'
  ];
  
  createSquare = () => {
	const section = document.querySelector('section');
	const square = document.createElement('span');
	
	const size = Math.random() * 50;
	
	square.style.width = 20 + size + 'px';
	square.style.height = 20 + size + 'px';
	
	square.style.top = Math.random() * innerHeight + 'px';
	square.style.left = Math.random() * innerWidth + 'px';
	
	square.style.background = colors[Math.floor(Math.random() * colors.length)];
	section.appendChild(square);
	
	setTimeout(() => {
	  square.remove()
	}, 5000);
  }
  
  setInterval(createSquare, 150);*/

	

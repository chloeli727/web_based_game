var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var objects = [];
var produceRate = 1500;
var fallRate = 4.50;
var lastProduct = -1;
var startTime = Date.now();
var score = 0;
var doAnimation = true;
var randomRange = 0.70;

//cat variable (character variable)
var catW  = 75;//width with only cup
var catH = 120;//cat's height + cup's height
var catSpeed = 50;
var catObj = {
	x: 340,
	y: 370,
	width: catW,
	height: catH,
	catSpeed: catSpeed
}

//milk variable
var milkW = 33;
var milkH = 50;
var milkObj = {
	width: milkW,
	height: milkH
}

//pepper variable
var pepperW = 25;
var pepperH = 46;
var pepperObj = {
	width: pepperW,
	height: pepperH
}

//bomb variable
var bombW = 40;//40 is the width of the black part
var bombH = 42;
var bombObj = {
	width: bombW,
	height: bombH
}

//The start window of the game
var start = new Image();
start.src = "start.jpg";

//load background and character into the game
var bg = new Image();
var cat = new Image();

//load object pictures into the game
var milk = new Image();
milk.src = "milk2.png";

var pepper = new Image();
pepper.src = "pepper.png";

var bomb = new Image();
bomb.src = "bomb.png";

var boom = new Image();
boom.src = "boom.png";

//emotion of the cat
var emotionDetect = "";
var cry = new Image();
cry.src = "cry.png";
var happy = new Image();
happy.src = "happy.png";

//result display window
var result = new Image();
result.src = "result.jpg";


start.onload = function()
{
	ctx.drawImage(start, 0, 0);
};

//display instruction of the game
function instruction()
{
	var instruction = new Image();
	instruction.src = "instruction.jpg";
	instruction.onload = function()
	{
		ctx.drawImage(instruction, 0, 0);
	}
}

//playGame button
function playGame()
{
	bg.onload = function()
	{
		ctx.drawImage(bg, 0, 0);
		cat.src = "cat2.png";
	};
	cat.onload = function()
	{
		ctx.drawImage(cat, catObj.x, catObj.y);
	};
	bg.src = "bg2.jpg";

	drawScore();
	function drawScore()
	{
		ctx.font = "20px Verdana";
		ctx.fillStyle = "#5e462a";
		ctx.fillText("Score: " + score, 10, 25);
	}

	//control the character
	document.onkeydown = function(event)
	{
		if(doAnimation)
		{
			if(event.keyCode == 37){
				if(catObj.x <= catObj.catSpeed)
				{
					catObj.x = 0;
				}
				else if(catObj.x > 0)
				{
					catObj.x -= catObj.catSpeed;
				}
				ctx.clearRect(0, 0, 750, 550);
				ctx.drawImage(bg, 0, 0);
				ctx.drawImage(cat, catObj.x, catObj.y);
				drawScore();
			}
			else if(event.keyCode == 39){
				if(catObj.x < 610)
				{
					catObj.x += catObj.catSpeed;
				}
				ctx.clearRect(0, 0, 750, 550);
				ctx.drawImage(bg, 0, 0);
				ctx.drawImage(cat, catObj.x, catObj.y);
				drawScore();
			}
		}
	}

	animate();
	function fallingObj()
	{
		var type;
		var random = Math.random();
		
		if(score > 100)
		{
			randomRange = 0.60;
		}
		else if(score > 200)
		{
			randomRange = 0.50;
		}
		else
		{
			randomRange = 0.70;
		}
		
		if(random < (randomRange/2))
		{
			type = "milk";
		}
		else if(random < randomRange)
		{
			type = "pepper";
		}
		else
		{
			type = "bomb";
		}
		
		var Obj = {
			type: type,
			x: Math.random() * (canvas.width - 30) + 10,
			y: 0,
		}
		objects.push(Obj);
	}

	function animate()
	{
		var time = Date.now();
		if(time > (lastProduct + produceRate))
		{
			lastProduct = time;
			fallingObj();
		}
		
		if(doAnimation)
		{
			requestAnimationFrame(animate);
		}
		
		ctx.drawImage(bg, 0, 0);//draw background
		ctx.drawImage(cat, catObj.x, catObj.y);//draw character
		
		//emotion of the character after eating the food
		if(emotionDetect  == "cry")
		{
			ctx.drawImage(cry, catObj.x + catObj.width, catObj.y);
		}
		else if(emotionDetect == "happy")
		{
			ctx.drawImage(happy, catObj.x + catObj.width, catObj.y);
		}
		
		for (var i = 0; i < objects.length; i++)
		{
			var Obj = objects[i];
			Obj.y += fallRate;
			if(Obj.type == "milk")
			{
				ctx.drawImage(milk, Obj.x, Obj.y);
				Obj.width = milkObj.width;
				Obj.height = milkObj.height;
				if(collisionDetect(Obj, catObj))
				{
					score += 10;
					objects.splice(i, 1);
					emotionDetect = "happy";
				}
				drawScore();
			}
			else if(Obj.type == "pepper")
			{
				ctx.drawImage(pepper, Obj.x, Obj.y);
				Obj.width = pepperObj.width;
				Obj.height = pepperObj.height;
				if(collisionDetect(Obj, catObj))
				{
					score -= 10;
					objects.splice(i, 1);
					emotionDetect  = "cry";
				}
				drawScore();
			}
			else if(Obj.type == "bomb")
			{
				ctx.drawImage(bomb, Obj.x, Obj.y);
				Obj.width = bombObj.width;
				Obj.height = bombObj.height;
				if(collisionDetect(Obj, catObj))
				{
					doAnimation = false;
					emotionDetect = "cry";
					ctx.drawImage(boom, Obj.x - 20, Obj.y);
					ctx.drawImage(result, 230, 155);
				}
			}
			if(score < 0)
			{
				doAnimation = false;
				ctx.drawImage(result, 230, 155);
			}
			
		}
		
		drawScore();
	}

	function collisionDetect (obj1, obj2)
	{
		if(obj2.x > obj1.x + obj1.width || obj2.x + obj2.width < obj1.x || obj2.y > obj1.y + obj1.height || obj2.y + obj2.height < obj1.y)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}
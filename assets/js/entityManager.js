var circle =
{
	speed: 256,
	x: 0,
	y: 0
};

var square =
{
	speed: 256,
	x: 0,
	y: 0
};

var canvas = document.getElementById("mainWindow");
var context = canvas.getContext("2d");

canvas.width = 960;
canvas.height = 480;

document.body.appendChild(canvas);

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) 
{
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e)
 {
	delete keysDown[e.keyCode];
}, false);

var reset = function () 
{


	circle.x = canvas.width / 2;
	circle.y = canvas.height / 2;

	square.x = 32 + (Math.random() * (canvas.width - 64));
	square.y = 32 + (Math.random() * (canvas.height - 64));
};

lerp = function(a, b, u)
{
    return (1 - u) * a + u * b;
};

var update = function (modifier) 
{
	
	if (38 in keysDown) // Player holding up
	{ 
		circle.y -= circle.speed * modifier;
	}
	if (40 in keysDown) // Player holding down
	{
		circle.y += circle.speed * modifier;
	}
	if (37 in keysDown) // Player holding left
	{ 
		circle.x -= circle.speed * modifier;
	}
	if (39 in keysDown)   // Player holding right
	{
		circle.x += circle.speed * modifier;
	}
	square.x = lerp(square.x, circle.x, (circle.speed*modifier)/100);
	square.y = lerp(square.y, circle.y, (circle.speed*modifier)/100);

	if  (circle.x <= (square.x + 16) && square.x <= (circle.x + 16) && circle.y <= (square.y + 16) && square.y <= (circle.y + 16)) 
	{
		alert("u got rekt m8");
		reset();
	}
};



var render = function () 
{


	var rectangle = new Path2D();
    rectangle.rect(square.x, square.y, 32, 32);

    var circleObj = new Path2D();
    circleObj.arc(circle.x, circle.y, 10, 0, 2 * Math.PI, false);

    context.fillStyle = "Blue";
    context.fill(rectangle);
    context.fillStyle = "Pink";
    context.fill(circleObj);


};

var clearScreen = function ()
{
	context.save();

	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.restore();
}

var main = function ()
{
	var now = Date.now();
	var delta = now - then;

	clearScreen();
	update(delta / 1000);
	render();
	

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();
main();
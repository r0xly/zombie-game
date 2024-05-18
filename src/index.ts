import 'pixi.js/math-extras';
import { AlphaFilter, Application, Assets,  EventEmitter,  mapType,  Point,  Rectangle, Sprite, Texture } from 'pixi.js';
import { Player } from './objects/player';
import { PlayerController } from './controllers/player-contoller';
import { Blaster } from './objects/blaster';
import { InputController } from './controllers/input-controller';
import { Projectile } from './objects/projectile';
import { Zombie } from './objects/zombie';
import { projectileContainer, updateProjectiles } from './controllers/projectile-controller';
import { addZombie, updateZombies, zombieContainer, zombies } from './containers/zombie-container';

const app = new Application();

async function setup() 
{
	await app.init({ background: "#ffffff", resizeTo: window })
	document.body.appendChild(app.canvas);

	app.stage.hitArea = app.screen;
	app.stage.eventMode = "static";

}


async function preload() 
{
	const assets = 
    [
		{ alias: "character", src: "character.png"},
		{ alias: "blaster", src: "blaster.png"},
		{ alias: "projectile", src: "projectile.png"},
		{ alias: "map", src: "map.png" },
	];

	await Assets.load(assets);

}

async function start() 
{
	await setup();
	await preload();	
	

	const map = Sprite.from("map");
	app.stage.addChild(map);

	const inputController = new InputController(app);

	const player = new Player();
	player.x = app.screen.width / 2;
	player.y = app.screen.height / 2;

	const playerController = new PlayerController(player, inputController);
	
	const blaster = new Blaster(
	{
		texture: Assets.get("blaster"),
		anchorPoint: new Point(0.6, 0.6),
		offset: new Point(-10, 0),
		projectileSpeed: 60,
		fireRate: 100,
	});

	player.equipWeapon(blaster);


	let t = 0;
	app.ticker.add(ticker => 
	{
		t++;
		playerController.update(ticker);
		updateProjectiles(ticker);
		updateZombies(ticker);

		zombies.forEach(zombie => 
		{
			//zombie.seek(player.x, player.y)
			//if (zombie.position.subtract(player.position).magnitude() < 1000)
			//	zombie.seek(player)
			//else 
				zombie.wander(t);

			zombie.seperate(zombies)
			zombie.cohesion(zombies);
			zombie.align(zombies);

			if (zombie.x < -10)
				zombie.x = app.screen.width + 10;
			if (zombie.x > app.screen.width + 10)
				zombie.x = -10
			if (zombie.y < -10)
				zombie.y = app.screen.height + 10
			if (zombie.y > app.screen.height + 10)
				zombie.y = 10

		});
	});

	for (let i = 0; i < 50; i++)
	{
		const zombie = new Zombie(Assets.get("character"));
		zombie.x = Math.random() * app.screen.width;
		zombie.y = Math.random() * app.screen.height;
		addZombie(zombie);
		zombie.zIndex = Math.round(Math.random()) - 1;

	}


	projectileContainer.zIndex = 100;

	app.stage.addChild(player, projectileContainer, zombieContainer);
}


start();



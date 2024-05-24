import 'pixi.js/math-extras';
import { AlphaFilter, Application, Assets,  Container,  EventEmitter,  mapType,  Point,  Rectangle, Sprite, Texture } from 'pixi.js';
import { Player } from './objects/player';
import { PlayerController } from './controllers/player-contoller';
import { Blaster } from './objects/blaster';
import { InputController } from './controllers/input-controller';
import { Projectile } from './objects/projectile';
import { Zombie } from './controllers/entities/zombies/zombie';
import { projectileContainer, updateProjectiles } from './controllers/projectile-controller';
import { addZombie, updateZombies, zombieContainer, zombies } from './controllers/entities/zombies/zombie-controller';
import { Camera, PanTo, Shake, ZoomTo } from 'pixi-game-camera';

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
	player.y = app.screen.height / 2;

	const playerController = new PlayerController(player, inputController);
	
	const blaster = new Blaster(
	{
		texture: Assets.get("blaster"),
		anchorPoint: new Point(0.6, 0.6),
		offset: new Point(-10, 0),
		projectileSpeed: 60 * 2,
		fireRate: 100 * 0.5,
	});

	player.equipWeapon(blaster);
	

	app.ticker.add(ticker => 
	{
		playerController.update(ticker);
		updateProjectiles(ticker);
		updateZombies(ticker);

		zombies.forEach(zombie => 
		{
			if (zombie.position.subtract(player.position).magnitude() < 500)
			{
				zombie.behavior.seek(player.position);
				zombie.behavior.seperate(zombies)
				return;
			}

			
			zombie.behavior.wander();
			zombie.behavior.cohesion(zombies);
			zombie.behavior.align(zombies);
			//zombie.behavior.seek(player.position);

			/*
			if (zombie.x < -10)
				zombie.x = app.screen.width + 10;
			if (zombie.x > app.screen.width + 10)
				zombie.x = -10
			if (zombie.y < -10)
				zombie.y = app.screen.height + 10
			if (zombie.y > app.screen.height + 10)
				zombie.y = 10
			*/
		});
	});

	for (let i = 0; i < 50; i++)
	{
		const zombie = new Zombie(Assets.get("character"));
		zombie.x = Math.random() * app.screen.width;
		zombie.y = Math.random() * app.screen.height;
		addZombie(zombie);

	}


	projectileContainer.zIndex = 100;

	app.stage.addChild(player, projectileContainer, zombieContainer);
	const camera = new Camera(app.ticker);


	window.addEventListener("keydown", event =>
	{
		if (event.key === "e")
			camera.effect(new Shake(app.stage, 20, 50));
	})

}

start();
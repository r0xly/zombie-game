import 'pixi.js/math-extras';
import { Application, Assets } from 'pixi.js';
import { Game } from './game';
import { GameAssets } from './data/assets';
import { WeaponData } from './data/weapon-data';
import { Weapon } from './objects/tools/weapon';

const app = new Application();
const global = (window as any);	

async function setup() 
{
	await app.init({ background: "#ffffff", resizeTo: window })
	document.body.appendChild(app.canvas);
	
	app.stage.hitArea = app.screen;
	app.stage.eventMode = "static";
}


async function preload() 
{
	await Assets.load(GameAssets);
}


(async() => 
{
	await preload();	
	await setup();

	const game = new Game(app);
	global.game = game;
	global.WeaponData = WeaponData;
	global.Weapon = Weapon;
})();
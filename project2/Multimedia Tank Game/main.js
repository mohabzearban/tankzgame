	//import Math
	
	// Loading Components
	var assetsToLoader = [ "NextLevel1.png", "NextLevel2.png", "SoundOff.png","SoundOn.png","Exit.png","GameOver1.png","GameOver2.png","Pause.png", "TankMenu.json", "MainTextures.json", "Explosion.json"];
	
	loader = new PIXI.AssetLoader(assetsToLoader);
	
	loader.onProgress = onAssetsProgress
	loader.onComplete = onAssetsLoaded

	loader.load();
	
	var loaderView = document.getElementById("loader");
	var loaderText = document.getElementById("loaderText"); 
	
	var loadCount = 0;
	
	// create an new instance of a pixi stage
	var interactive = true;
	var stage = new PIXI.Stage(0xFFFFFF, interactive);
	
	// create a renderer instance.
	renderer = PIXI.autoDetectRenderer(500, 500);
	
	//Game Modes Enumerator
	var GAME_MODE = {MENU:0,PLAYING:1,GAMEOVER:2,PAUSE:3, WON:4};
	var GameMode = 0;
	
	
	// holder to store Menu Images
	// create a background..
	var MenuBG;
	var LevelBG;
	
	// create Button Textures
	var PlayButtonUp;
	var PlayButtonDown;
	var PlayButton;
	var PauseLbl;
	var GameOverOn;
	var GameOverOff;
	var GameOverButton;
	var Exit;
	var Mute = false;
	var SoundOn;
	var SoundOff;
	var SoundButton;
	var NextLevelOn;
	var NextLevelOff;
	var NextLevelButton;
		
	//Player and Enemies
	var Player;
	var Enemies = [];
	var NoEnemies;
	var EnemySpeed;
	var Score = 0;
	var Lives = 3;
	var RotationSpeed = 5;
	var MovSpeed = 5;
	var PlayerBullet;
	var BulletSpeed;
	var BulletAlive = false;
	var PlayerBulletSpeed = 5;
	var GameLevel = 1;
	
	//Initializing Score
	var Score;
	var ScoreContainer = document.getElementById ("Score");
	
	
	//Initializing Explosion Textures
	var explosionTextures = [];

	
	//Loading SOUNDS
	var ShootSnd = document.getElementById("Shoot");
	var ExplSnd = document.getElementById("Explosion");
	var bgm = document.getElementById('BGM');
	bgm.play();
    //bgm.pause();
	bgm.volume =0.5;
	bgm.loop = true;

		
	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);
	
	//Add Event Keys on Keyboard
	key = [];
	document.body.addEventListener("keydown", function (e) {
		key[e.keyCode] = true;
	});
	document.body.addEventListener("keyup", function (e) {
		key[e.keyCode] = false;
	});
	
	
	function onAssetsProgress ()
	{
		loadInterval = setInterval(function(){
		
		loadCount++;
		loadCount %=4;
		
		if(loadCount == 0)
		{
			loaderText.src = "img/Loading0.png"
		}
		else if(loadCount == 1)
		{
			loaderText.src = "img/Loading1.png"
		}
		else if(loadCount == 2)
		{
			loaderText.src = "img/Loading2.png"
		}
		else if(loadCount == 3)
		{
			loaderText.src = "img/Loading3.png"
		}
		//console.log("!!!")
		}, 500);
	}
	
	function onAssetsLoaded()
	{
		clearInterval(loadInterval);
		loaderView.style.display = "none";
		
		
		InitMenu ();
		InitLevel (3,3);

		
			// start animating
		requestAnimFrame( GameLoop );
		
	}

	function InitLevel (EnemyNumber, ESpeed)
	{
		NoEnemies = EnemyNumber;
		EnemySpeed = ESpeed;
		LevelBG = new PIXI.Sprite.fromFrame("TankBackGround.png");
		var PlayerTex = new PIXI.Texture.fromFrame("Player.png");
		Player = new PIXI.Sprite(PlayerTex);
		var PlayerBulletTex = new PIXI.Texture.fromFrame("PlayerBullet.png");
		PlayerBullet = new PIXI.Sprite(PlayerBulletTex);
		var EnemyTex = new PIXI.Texture.fromFrame("Enemy.png");
		var PauseLblTex = new PIXI.Texture.fromFrame("Pause.png");
		PauseLbl = new PIXI.Sprite(PauseLblTex);
		GameOverOn = new PIXI.Texture.fromFrame("GameOver2.png");
		GameOverOff = new PIXI.Texture.fromFrame("GameOver1.png");
		GameOverButton  = new PIXI.Sprite(GameOverOff);
		var ExitTex = new PIXI.Texture.fromFrame("Exit.png");
		Exit = new PIXI.Sprite(ExitTex);
		SoundOn = new PIXI.Texture.fromFrame("SoundOn.png");
		SoundOff = new PIXI.Texture.fromFrame("SoundOff.png");
		SoundButton = new PIXI.Sprite(SoundOn);
		NextLevelOn = new PIXI.Texture.fromFrame("NextLevel2.png");
		NextLevelOff = new PIXI.Texture.fromFrame("NextLevel1.png");
		NextLevelButton  = new PIXI.Sprite(NextLevelOff);
		GameOverButton.setInteractive(true);
		SoundButton.setInteractive(true);
		Exit.setInteractive(true);
		NextLevelButton.setInteractive(true);
		
		Score = 0;
		
		for ( var i=0 ; i < NoEnemies ; i++ )
		{
			Enemies[i] = new PIXI.Sprite(EnemyTex);
			Enemies[i].anchor.x = 0.5;
			Enemies[i].anchor.y = 0.5;
		}
		
		//Initialize Explosion MovieClip
		for (var i=0; i < 26; i++) 
			{
		 	var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
		 	explosionTextures.push(texture);
			};
		
		
		InitEnemyPositions ();
		
		Player.anchor.x = 0.5;
		Player.anchor.y = 0.5;
		Player.position.x = 250;
		Player.position.y = renderer.height - 40;
		Player.rotation = 0;
		PlayerBullet.anchor.x = 0.5;
		PlayerBullet.anchor.y = 0.5;
		

		

	}
	
	//Initialize Menu Variables
	
	function InitMenu ()
	{
		MenuBG = PIXI.Sprite.fromFrame("MenuBG.png");
		PlayButtonUp = PIXI.Texture.fromFrame("PlayUp.png");
		PlayButtonDown = PIXI.Texture.fromFrame("PlayDown.png");
		PlayButton  = new PIXI.Sprite(PlayButtonUp);
		PlayButton.anchor.x = 0.5;
		PlayButton.anchor.y = 0.5;
		
		PlayButton.position.x = renderer.width / 2;
		PlayButton.position.y = renderer.height / 1.5;
		
		PlayButton.setInteractive(true);
		
		
	}
	
	function DrawMenu ()
	{
		// add background to stage..
		stage.addChild(MenuBG);
		
		// add Button to stage..
		stage.addChild(PlayButton);
	}
	
	function ShowScore (score)
	{
		ScoreContainer.innerHTML = "Score :" + score;
	}
	
	function UpdatePlayerBullet ()
	{
		//Draw Bullet
		stage.addChild(PlayerBullet);
		
		//Move Bullet
		PlayerBullet.position.y -= PlayerBulletSpeed;
		
		//Bullet Out of Bounds
		if(PlayerBullet.position.y < 0 )
		{
			KillBullet ();
		}
		
	}
	
	function KillBullet ()
	{
		BulletAlive = false;
		PlayerBullet.position.y = 600;
		stage.removeChild(PlayerBullet);
	}
	
	function UpdataEnemies ()
	{
		for ( var i = 0 ; i < Enemies.length ; i++)
		{
			//Move Enemies
			Enemies[i].position.y += EnemySpeed;
			
			//Check for in Bounds
			if(Enemies[i].position.y > 550)
			{
				RespawnEnemy (Enemies[i]);
			}
			
			//Check Collision with Player
			if (Check_Collision (Player,Enemies[i]))
			{
				Explode(Enemies[i]);
				Explode(Player);
				if(!Mute) ExplSnd.play();
				
				RespawnEnemy(Enemies[i]);
				stage.removeChild(Player);
				
				//Game mode change to Game Over
				GameMode = 2;
				
			}
			
			//Check Collision with Bullets
			
			if (Check_Collision (PlayerBullet,Enemies[i]))
			{
				if(!Mute) {ExplSnd.play();}
				Explode(Enemies[i]);
				Score ++;
				
				
				RespawnEnemy (Enemies[i]);
				//KillBullet ();

			}
			
		}
	}
	
	function InitEnemyPositions ()
	{
		for ( var i = 0 ; i < Enemies.length ; i++)
		{
			Enemies[i].position.x = Math.random() * (renderer.width - 30) + 30;
			Enemies[i].position.y = Math.random() * (-0.5*Enemies[i].height) - Enemies[i].height;
		}
	}
	
	function Settings ()
	{
			Exit.position.x = 480;
			Exit.position.y = 20;
			Exit.anchor.x = 0.5;
			Exit.anchor.y = 0.5;
			stage.addChild(Exit);
			
			
			SoundButton.position.x = 480;
			SoundButton.position.y = 70;
			SoundButton.anchor.x = 0.5;
			SoundButton.anchor.y = 0.5;
			stage.addChild(SoundButton);
			
			// set the mousedown and touchstart callback..
			Exit.mousedown = function(data){
				this.alpha = 1;
				GameMode = 0;
				GameLevel = 1;
				DeleteLevel ();
				
				stage.removeChild(ExitButton);
			}
			
		    // set the mousedown and touchstart callback..
			SoundButton.mousedown = function(data){
			
				if(!Mute){this.setTexture(SoundOff);Mute = true;bgm.pause();}else{this.setTexture(SoundOn);Mute = false;bgm.play();}
				this.alpha = 1;
				// Mute Sound and Stop BGM
				
				
				
				stage.removeChild(SoundButton);
			}
			
			
	}
	
	function DrawEnemies ()
	{
		for ( var i = 0 ; i < Enemies.length ; i++)
		{
			stage.addChild(Enemies[i]);
		}
	}
	
	function RespawnEnemy (Enemy)
	{
			Enemy.position.x = Math.random() * (renderer.width - 30) + 30;
			Enemy.position.y = Math.random() * (-0.5*Enemy.height) - Enemy.height;
	}
	
	function Check_Collision (Object1, Object2) 
	{
		
		//Sides of object1:
		var Left1 = Object1.position.x - 0.5* Object1.width;
		var Right1  = Object1.position.x + 0.5* Object1.width;
		var Top1   = Object1.position.y - 0.5* Object1.height;
		var Bottom1 = Object1.position.y + 0.5* Object1.height;
		
		//Sides of object2:
		var Left2 = Object2.position.x - 0.5* Object2.width;
		var Right2  = Object2.position.x + 0.5* Object2.width;
		var Top2   = Object2.position.y - 0.5* Object2.height;
		var Bottom2 = Object2.position.y + 0.5* Object2.height;
		
		 return !(Left2 > Right1 || Right2  < Left1 ||  Top2 > Bottom1 || Bottom2 - 50 < Top1 );
	}
	
	function Explode (Object)
	{
		var Explosion = new PIXI.MovieClip (explosionTextures);
		
		Explosion.currentFrame = 1;
		
		Explosion.anchor.x = Object.anchor.x;
		Explosion.anchor.y = Object.anchor.y;
		Explosion.position.x = Object.position.x;
		Explosion.position.y = Object.position.y;

		
		Explosion.play();
		stage.addChild(Explosion);
		window.setTimeout(function(){Explosion.stop();stage.removeChild(Explosion);},400);
		
	}
	
	function DeleteLevel ()
	{
		for ( var i = 0 ; i < Enemies.length ; i++)
		{
			stage.removeChild(Enemies[i]);
		}
		
		for ( var i = 0 ; i < Enemies.length ; i++)
		{
			Enemies.splice(i,1);
		}
		
		
		stage.removeChild(Player);
		stage.removeChild(Exit);
		stage.removeChild(SoundButton);
	}
	
	function GameUpdate ()
	{
		
		
		if(GameMode == GAME_MODE.MENU)
		{
			
			DrawMenu();
			
			// set the mousedown and touchstart callback..
			PlayButton.mousedown = function(data){
			
				this.setTexture(PlayButtonDown);
				this.alpha = 1;
				GameMode = 1;
				GameLevel = 1;
				stage.removeChild(MenuBG);
				stage.removeChild(PlayButton);
				InitLevel(3,3);
			}
			
			// set the mouseover callback..
			PlayButton.mouseover = function(data){
			
				this.setTexture(PlayButtonDown);
			}
			
			// set the mouseout callback..
			PlayButton.mouseout = function(data){
			
				this.setTexture(PlayButtonUp)
			}
		
			// set the mouseup and touchend callback..
			PlayButton.mouseup = PlayButton.touchend = function(data){
			//this.isdown = false;

				this.setTexture(PlayButtonUp);
			
			}
		}
		
		else if (GameMode == GAME_MODE.PLAYING)
		{
			//Draw Level
			stage.addChild(LevelBG);
			ShowScore (Score);
			Settings ();
			
			
			//Update Enemies
			UpdataEnemies ();
			DrawEnemies ();
			
			//Update Player
			
			if(key[37])
			{
				//Move Left
				Player.position.x -= MovSpeed;
				Player.rotation = ((Math.PI/180) * (-1*90) );
			}
			else if(key[39])
			{
				//Move Right
				Player.position.x += MovSpeed;
				Player.rotation = ((Math.PI/180) * (90) );;
			}
			else if (key[38])
			{
				//Look Up
				Player.rotation = 0;
			}
			
			if (key[32] && !BulletAlive)
			{
				//Shoot At Enemy
				BulletAlive = true;
				if(!Mute){ShootSnd.play();}
				//Init Bullet to Player Position
				PlayerBullet.position.x = Player.position.x;
				PlayerBullet.position.y = Player.position.y - (Player.height / 2);
				//Look At Enemy
				Player.rotation = 0;
			}
			
			//Click P to Pause
			if (key[80])
			{
				GameMode = 3;
			}

			stage.addChild(Player);
			
			//Explode (Player);
			
			if (BulletAlive) UpdatePlayerBullet();
			
			//Check Wining Condition
			if(Score >= 10) {if(GameLevel == 1){GameMode = 4 ;}else if(GameLevel == 2) {GameMode = 2}}
			

		}
		else if (GameMode == GAME_MODE.PAUSE)
		{
			
			PauseLbl.position.x = 250;
			PauseLbl.position.y = 250;
			PauseLbl.anchor.x = 0.5;
			PauseLbl.anchor.y = 0.5;
			stage.addChild(PauseLbl);
			
			//Click Esc to Continue
			if (key[27])
			{
				GameMode = 1;
				stage.removeChild(PauseLbl);
				console.log("aloo");
			}
			
		}
		else if  (GameMode == GAME_MODE.GAMEOVER )
		{
			GameOverButton.position.x = 250;
			GameOverButton.position.y = 250;
			GameOverButton.anchor.x = 0.5;
			GameOverButton.anchor.y = 0.5;
			stage.addChild(GameOverButton);
			
			// set the mousedown and touchstart callback..
			GameOverButton.mousedown = function(data){
			
				this.setTexture(GameOverOn);
				this.alpha = 1;
				GameMode = 0;
				DeleteLevel ();
				stage.removeChild(GameOverButton);
			}
			
			// set the mouseover callback..
			GameOverButton.mouseover = function(data){
			
				this.setTexture(GameOverOn);
			}
			
			// set the mouseout callback..
			GameOverButton.mouseout = function(data){
			
				this.setTexture(GameOverOff);
			}
		
			// set the mouseup and touchend callback..
			GameOverButton.mouseup = GameOverButton.touchend = function(data){
			//this.isdown = false;

				this.setTexture(GameOverOff);
			
			}
			
		}
		else if (GameMode == GAME_MODE.WON )
		{
			NextLevelButton.position.x = 250;
			NextLevelButton.position.y = 250;
			NextLevelButton.anchor.x = 0.5;
			NextLevelButton.anchor.y = 0.5;
			stage.addChild(NextLevelButton);
			
			// set the mousedown and touchstart callback..
			NextLevelButton.mousedown = function(data){
			
				this.setTexture(NextLevelOn);
				this.alpha = 1;
				GameMode = 1;
				GameLevel = 2;
				DeleteLevel ();
				InitLevel (5,5);
				stage.removeChild(NextLevelButton);
			}
			
			// set the mouseover callback..
			NextLevelButton.mouseover = function(data){
			
				this.setTexture(NextLevelOn);
			}
			
			// set the mouseout callback..
			GameOverButton.mouseout = function(data){
			
				this.setTexture(NextLevelOff);
			}
		
			// set the mouseup and touchend callback..
			NextLevelButton.mouseup = NextLevelButton.touchend = function(data){
			//this.isdown = false;

				this.setTexture(NextLevelOff);
			
			}
		}
	}
	

	
	
	function GameLoop() {
		
		GameUpdate();
	    requestAnimFrame( GameLoop );
	
	    renderer.render(stage);
	}

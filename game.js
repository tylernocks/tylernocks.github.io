enchant();

var changeLevel;
window.onload = function() {
  var game = new Game(300, 300);


  game.keybind(32, 'a');
  game.keybind(13, 'b');
  game.spriteSheetWidth = 256;
  game.spriteSheetHeight = 256;
  game.itemSpriteSheetWidth = 64;
  game.preload(['sprites.png', 'items.png', 'map0.png']);
  game.fps = 15;
  game.spriteWidth = 16;
  game.spriteHeight = 16;
  var map = new Map(16, 16);
  var foregroundMap = new Map(16, 16);
  var currentLevel = 0;
  
 
  changeLevel = function(levelData){
      map.image = game.assets['map0.png'];
      foregroundMap.image = game.assets['map0.png'];


    map.loadData(levelData.bg);
    foregroundMap.loadData(levelData.fg);
    map.collisionData = levelData.cd;
    setPlayer();
  }



  var setStage = function(){
    var stage = new Group();
    stage.addChild(map);
    stage.addChild(foregroundMap);
    stage.addChild(player);
    stage.addChild(player.statusLabel);
    game.rootScene.addChild(stage);
  };

  var player = new Sprite(game.spriteWidth, game.spriteHeight);
  var setPlayer = function(){
    player.spriteOffset = 5;
    //player.startingX = 6;
    //player.startingY = 14;
    player.x = levels[currentLevel].x * game.spriteWidth;
    player.y = levels[currentLevel].y * game.spriteHeight;
    player.direction = 0;
    player.walk = 0;
    player.frame = player.spriteOffset + player.direction; 
    player.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
    player.image.draw(game.assets['sprites.png']);

    player.name = "Roger";
    player.characterClass = "Rogue";
    player.exp = 0;
    player.level = 1;
    console.log(player.level);
    player.gp = 100;
    if (window.localStorage.getItem('exp')) {
      player.exp = parseInt(window.localStorage.getItem('exp'));
    } else {
      player.exp = 0;
    }
    if (window.localStorage.getItem('level')) {
      player.level = parseInt(window.localStorage.getItem('level'));
    } else {
      player.level = 1;
    }
    if (window.localStorage.getItem('gp')) {
      player.gp = parseInt(window.localStorage.getItem('gp'));
    } else {
      player.gp = 100;
    }
    if (window.localStorage.getItem('inventory')) {
      player.inventory = JSON.parse(window.localStorage.getItem('inventory'));
    } else {
      player.inventory = []; 
    }
    player.levelStats = [{},{attack: 4, maxHp: 10, maxMp: 0, expMax: 10},
                         {attack: 6, maxHp: 14, maxMp: 0, expMax: 30},
                         {attack: 7, maxHp: 20, maxMp: 5, expMax: 50}
    ];
    

    player.attack = function(){
      return player.levelStats[1].attack;
    };

    player.hp = player.levelStats[1].maxHp;
    player.mp = player.levelStats[1].maxMp;
      
    player.statusLabel = new Label("");
    player.statusLabel.width = game.width;
    player.statusLabel.y = undefined;
    player.statusLabel.x = undefined;
    player.statusLabel.color = '#fff';
    player.statusLabel.backgroundColor = '#000';
  };

  player.displayStatus = function(){
    player.statusLabel.text = 
      "--" + player.name + " the " + player.characterClass + 
      "<br />--HP: "+player.hp + "/" + player.levelStats[1].maxHp + 
      "<br />--MP: "+player.mp + "/" + player.levelStats[1].maxMp + 
      "<br />--Exp: "+player.exp + 
      "<br />--Level: " + player.level + 
      "<br />--GP: " + player.gp +
      "<br /><br />--Inventory:"; 
    player.statusLabel.height = 170;
    player.showInventory(0);
  };
  player.clearStatus = function(){
    player.statusLabel.text = "";
    player.statusLabel.height = 0;
    player.hideInventory();
  };

  player.move = function(){
    this.frame = this.spriteOffset + this.direction * 2 + this.walk;
    if(map.checkTile(player.x, player.y) == 162){
      currentLevel++;
      changeLevel(levels[currentLevel]);
    }
    //if(map.checkTile(player.x, player.y) == 13){
//
    //}



    if (this.isMoving) {
      this.moveBy(this.xMovement, this.yMovement);
      if (!(game.frame % 2)) {
        this.walk++;
        this.walk %= 2;
      }
      if ((this.xMovement && this.x % 16 === 0) || (this.yMovement && this.y % 16 === 0)) {
        this.isMoving = false;
        this.walk = 1;
      }
    } else {
      this.xMovement = 0;
      this.yMovement = 0;
      if (game.input.up) {
        this.direction = 1;
        this.yMovement = -4;
        player.clearStatus();
      } else if (game.input.right) {
        this.direction = 2;
        this.xMovement = 4;
        player.clearStatus();
      } else if (game.input.left) {
        this.xMovement = -4;
        this.direction = 3;
        player.clearStatus();
      } else if (game.input.down) {
        this.direction = 0;
        this.yMovement = 4;
        player.clearStatus();
      }
      if (this.xMovement || this.yMovement) {
        var x = this.x + (this.xMovement ? this.xMovement / Math.abs(this.xMovement) * 16 : 0);
        var y = this.y + (this.yMovement ? this.yMovement / Math.abs(this.yMovement) * 16 : 0);
      if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
          this.isMoving = true;
          this.move();
      }
      }
    }
  };
  player.square = function(){
    return {x: Math.floor(this.x /game.spriteWidth), y: Math.floor(this.y/game.spriteHeight)}
  }
  player.facingSquare = function(){
    var playerSquare = player.square();
    var facingSquare;
    if(player.direction === 0){
      facingSquare = {x: playerSquare.x, y: playerSquare.y + 1}
    }else if (player.direction === 1) {
      facingSquare = {x: playerSquare.x, y: playerSquare.y - 1}
    }else if (player.direction === 2) {
      facingSquare = {x: playerSquare.x + 1, y: playerSquare.y}
    }else if (player.direction === 3) {
      facingSquare = {x: playerSquare.x - 1, y: playerSquare.y}
    }
    if ((facingSquare.x < 0 || facingSquare.x >= map.width/16) || (facingSquare.y < 0 || facingSquare.y >= map.height/16)) {
      return null;
    } else {
      return facingSquare;
    }
  }
  player.facing = function(){
    var facingSquare = player.facingSquare();
    if (!facingSquare){
      return null;
    }else{
      return map[facingSquare.y][facingSquare.x];
    }
  }
  player.visibleItems = [];
  player.itemSurface = new Surface(game.itemSpriteSheetWidth, game.spriteSheetHeight);
  player.inventory = [];
  player.hideInventory = function(){
    for(var i = 0; i < player.visibleItems.length; i++){
      player.visibleItems[i].remove();
    }
      player.visibleItems = [];
  };
  player.showInventory = function(yOffset){
     if(player.visibleItems.length === 0){
      player.itemSurface.draw(game.assets['items.png']);
      for (var i = 0; i < player.inventory.length; i++){
        var item = new Sprite(game.spriteWidth, game.spriteHeight);
        item.y = 130 + yOffset;
        item.x = 30 + 70*i;
        item.frame = player.inventory[i];
        item.scaleX = 2;
        item.scaleY = 2;
        item.image = player.itemSurface;
        player.visibleItems.push(item);
        game.currentScene.addChild(item);
      }
    }
  };
  var npc = {
    say: function(message){
      player.statusLabel.height = game.height/2;
      player.statusLabel.text = message;
    }
  }
  var greeter = {
    action: function(){
      npc.say("Hi. Do you remember me? we went to middle school together..<br>I'm the only survivor that's left " +
               "after the wizard came and took everyone..<br>Luckily I was in the bathroom and he didn't see me...<br>" +
               "You have to save everyone!! You are their only hope since I don't know<br>what to do and where to go..<br>" +
               "But here, you can have this sword as a good-luck gift from me!");
    }
  };
  var opening = new Scene ();
  opening.backgroundColor = '#000';
  var openingLabel = new enchant.Label("Welcome to Zenith!<br>You are the hero.<br>You are all that is left.<br>" + 
      "Your village has been taken over while you" +
      " were traveling abroad, exploring the" +
      " world.<br>Now that you are back you must save the village!<br>Zenith is built in a wooded area " + 
      "surrounded on  all sides by mountains, believed to be the home<br>" +
      "to magnificent caverns.<br> You can explore the village and go into the cave.<br>" +
      "As you progress you'd meet different<br>characters but remember your goal - to find and save the villagers!<br>Good Luck!<br>" +
      "you can use the arrow-keys to move and the spacebar to communicate with people/fight<br>" +
      "(to start the game press the 'enter' key)");
  openingLabel.width = game.width;
  openingLabel.height = game.height;
  openingLabel.font = "10px courier";
  openingLabel.textAlign = "center";
  openingLabel.y = 0;
  openingLabel.x = 5
  openingLabel.color = '#fff';
  openingLabel.backgroundColor = '#000';
  opening.addChild(openingLabel);
    var clearopening = function(){
    openingLabel.text = "";
    openingLabel.height = 0;
  };
  var ID=setInterval(function() {
        if (game.input.b){
          clearInterval(ID);
          clearopening();
          game.popScene();
        }
  }, 200);


  var battleScene = new Scene();
  var illumintaiWizard = {
    maxHp: 20,
    hp: 20,
    sprite: 15,
    attack: 3,
    exp: 3,
    gp: 5,

    action: function(){
      player.currentEnemy = this;
      player.currentEnemy.hp = player.currentEnemy.maxHp;
      game.pushScene(battleScene);
    }
  };

  var minion1 = {
    maxHp: 20,
    hp: 20,
    sprite: 16,
    attack: 3,
    exp: 3,
    gp: 5,

    action: function(){
      player.currentEnemy = this;
      player.currentEnemy.hp = player.currentEnemy.maxHp;
      game.pushScene(battleScene);
    }
  };

  var minion2 = {
    maxHp: 20,
    hp: 20,
    sprite: 17,
    attack: 3,
    exp: 3,
    gp: 5,

    action: function(){
      player.currentEnemy = this;
      player.currentEnemy.hp = player.currentEnemy.maxHp;
      game.pushScene(battleScene);
    }
  };

  var minion3 = {
    maxHp: 20,
    hp: 20,
    sprite: 18,
    attack: 3,
    exp: 3,
    gp: 5,

    action: function(){
      player.currentEnemy = this;
      player.currentEnemy.hp = player.currentEnemy.maxHp;
      game.pushScene(battleScene);
    }
  };

  var minion4 = {
    maxHp: 20,
    hp: 20,
    sprite: 19,
    attack: 3,
    exp: 3,
    gp: 5,

    action: function(){
      player.currentEnemy = this;
      player.currentEnemy.hp = player.currentEnemy.maxHp;
      game.pushScene(battleScene);
    }
  };

  var minion5 = {
    maxHp: 20,
    hp: 20,
    sprite: 20,
    attack: 3,
    exp: 3,
    gp: 5,

    action: function(){
      player.currentEnemy = this;
      player.currentEnemy.hp = player.currentEnemy.maxHp;
      game.pushScene(battleScene);
    }
  };


  var spriteRoles = [,,greeter,,,,,,,,,,,,,illumintaiWizard, minion1, minion2, minion3, minion4, minion5]


  var hitOrMiss = function(number)
  {
    var value = Math.random();
    if(value < .4)
    {
      number = 0;
    }
    else
    {
      number = number;
    }
    return number;
  }

  var setBattle = function(){
    var battle = new Group();
    battleScene.backgroundColor = "#90ee90";

    battle.menu = new Label();
    battle.menu.x = 150;
    battle.menu.y = 230;
    battle.menu.color = '#fff';  
    battle.activeAction = 0; 

    battle.getPlayerStatus = function () { 
      return "You  <br />" + "HP: " + player.hp + "<br />MP: " + player.mp;
    };


    battle.playerStatus = new Label("");
    battle.playerStatus.color = '#0066FF';
    battle.playerStatus.x = 65;
    battle.playerStatus.y = 230;


    battle.getEnemyStatus = function () { 
      return "Enemy <br />" +"HP: " + player.currentEnemy.hp + "<br />GP: " + player.currentEnemy.gp;
    };


    battle.enemyStatus = new Label("");
    battle.enemyStatus.color = '#C80000';
    battle.enemyStatus.x = 115;
    battle.enemyStatus.y = 55;

    

    battle.hitStrength = function(hit){
      return Math.round((Math.random() + .5) * hit);
    };
    battle.won = function(){
      battle.over = true;
      player.exp += player.currentEnemy.exp;
      player.gp += player.currentEnemy.gp;
      
      player.statusLabel.text = "You won!<br />" +
        "You gained "+ player.currentEnemy.exp + " exp<br />"+
        "and " + player.currentEnemy.gp + " gold pieces!";
      player.statusLabel.height = 45;
      
      if(player.exp > player.levelStats[player.level].expMax){
        player.level += 1;
        player.statusLabel.text = player.statusLabel.text + 
          "<br />And you gained a level!"+
          "<br />You are now at level " + player.level +"!";
        player.statusLabel.height = 75;
      }
    };

    battle.lost = function(){
      battle.over = true;
      player.hp = player.levelStats[player.level].maxHp;
      player.mp = player.levelStats[player.level].maxMp;
      player.gp = Math.round(player.gp/2);
      player.statusLabel.text = "You lost!";
      player.statusLabel.height = 12;
    };
    battle.playerAttack = function(){
      var currentEnemy = player.currentEnemy;
      var playerHit = hitOrMiss(battle.hitStrength(player.attack()));
      currentEnemy.hp = currentEnemy.hp - playerHit;
      if(playerHit === 0)
      {
        battle.menu.text = "You missed !";
      }
      else
      {
        battle.menu.text = "You did " + playerHit + " damage!";
      }
      if(currentEnemy.hp <= 0)
      {
         currentEnemy.hp = 0;
         battle.won();
      };
    };
    battle.enemyAttack = function(){
      var currentEnemy = player.currentEnemy;
      var enemyHit = hitOrMiss(battle.hitStrength(currentEnemy.attack));
      player.hp = player.hp - enemyHit;
      if(enemyHit === 0)
      {
        battle.menu.text = "He missed!";
      }
      else
      {
        battle.menu.text = "He did " + enemyHit + " damage!";
      }
      if(player.hp <= 0)
      {
        battle.lost();
      };
    };




    battle.actions = [{name: "Fight", action: function(){
        battle.wait = true;
        battle.playerAttack();
        setTimeout(function(){
          if(!battle.over){
            battle.enemyAttack();
          };
          if(!battle.over){
            setTimeout(function(){
              battle.menu.text = battle.listActions();
              battle.wait = false;
            }, 1000)
          } else {
            setTimeout(function(){
              battle.menu.text = "";
              game.popScene();
            }, 1000)
          };
        }, 1000);
      }},
    ];
    battle.listActions = function(){
      battle.optionText = [];
      for(var i = 0; i < battle.actions.length; i++){
        if(i === battle.activeAction){
          battle.optionText[i] =  battle.actions[i].name;
        } else {
          battle.optionText[i] = battle.actions[i].name;
        }
      }
      return battle.optionText.join("<br />");
    };
    battle.addCombatants = function(){
      var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
      image.draw(game.assets['sprites.png']);

      battle.player = new Sprite(game.spriteWidth, game.spriteHeight);
      battle.player.image = image;
      battle.player.frame = 8;
      battle.player.x = 250/2 - 90;
      battle.player.y = 245;
      battle.player.scaleX = 2;
      battle.player.scaleY = 2;

      battle.enemy = new Sprite(game.spriteWidth, game.spriteHeight);
      battle.enemy.image = image;
      battle.enemy.x = 250/2 + 90;
      battle.enemy.y = 55;
      battle.enemy.scaleX = 6;
      battle.enemy.scaleY = 6;

      battle.addChild(battle.enemy);
    };
    battle.addCombatants();
    
    battleScene.on('enter', function() {
      battle.over = false;
      battle.wait = true;
      battle.menu.text = "";
      battle.enemy.frame = player.currentEnemy.sprite;
      setTimeout(function(){
        battle.menu.text = battle.listActions();
        battle.wait = false;
      }, 500);
    });
    battleScene.on('enterframe', function() {
      if(!battle.wait){
        if (game.input.a){
          battle.actions[battle.activeAction].action();
        } else if (game.input.down){
          battle.activeAction = (battle.activeAction + 1) % battle.actions.length;
          battle.menu.text = battle.listActions();
        } else if (game.input.up){
          battle.activeAction = (battle.activeAction - 1 + battle.actions.length) % battle.actions.length;
          battle.menu.text = battle.listActions();
        }
        battle.playerStatus.text = battle.getPlayerStatus();
        battle.enemyStatus.text = battle.getEnemyStatus();

      };
    })
    battleScene.on('exit', function() {
      setTimeout(function(){
        battle.menu.text = "";
        battle.activeAction = 0;
        battle.playerStatus.text = battle.getPlayerStatus();
        battle.enemyStatus.text = battle.getEnemyStatus();
        game.resume();
      }, 1000);
    });
    battle.addChild(battle.playerStatus);
    battle.addChild(battle.enemyStatus);
    battle.addChild(battle.menu);
    battle.addChild(battle.player);
    battleScene.addChild(battle);
  };

  game.focusViewport = function(){
    var x = Math.min((game.width  - 16) / 2 - player.x, 0);
    var y = Math.min((game.height - 16) / 2 - player.y, 0);
    x = Math.max(game.width,  x + map.width)  - map.width;
    y = Math.max(game.height, y + map.height) - map.height;
    game.rootScene.firstChild.x = x;
    game.rootScene.firstChild.y = y;
  };
  game.onload = function(){
    game.storable = ['exp', 'level', 'gp', 'inventory'];
    game.pushScene(opening);
    game.saveToLocalStorage = function(){
      for(var i = 0; i < game.storable.length; i++){
        if(game.storable[i] === 'inventory'){
          window.localStorage.setItem(game.storable[i], JSON.stringify(player[game.storable[i]]));
        } else {
          window.localStorage.setItem(game.storable[i], player[game.storable[i]]);
        }
      }
    };
    setInterval(game.saveToLocalStorage, 5000);
    
    changeLevel(levels[0]);
    setStage();
    setBattle();
    player.on('enterframe', function() {
      player.move();
      if (game.input.a) {
        var playerFacing = player.facing();
        if(!playerFacing || !spriteRoles[playerFacing]){
          player.displayStatus();
        }else{
          spriteRoles[playerFacing].action();
        };
      };
    });
    game.rootScene.on('enterframe', function(e) {
      game.focusViewport();
    });
  };
  game.start();
};
/*============================================================================*\

  game.js
  ()

  @date: Sunday May 13, 2018 -5:17 PM
  @author: Dylan Burkey


\*============================================================================*/

/*
    Game layout
      
 */


/**
 *  Create the players and their attributes
 * 
 *  We want to store this in data.json at some point
 *
 *  @date: Sunday May 13, 2018 - 6:35 PM
 *  @author: Dyan Burkey
 *
 */ 

 /*
 * Players 1 You
 * 
 */

$(function() {

	$("#result").html("Mortal Kombat");
	$(".newGame").hide();

/**
 *  Start adding globals
 *  will needs variables for enemy picked, player won, and for player wins
 *
 *  @date: Tuesday May 15, 2018 - 4:18 PM
 *  @author: Dyan Burkey
 *
 */ 
  
 //var imgSrc = "assets/media/images/";

	var characterPicked;
	var enemyPicked;
	var enemyBattling = false;
	var playerWon;
	var enemies = [];



/**
 * I would have liked to take the time to create a game.json to pull from
 *  and add more interactiviy. 
 */
var jcage = {
		name: "Johnny Cage",
		display: "Johhny Cage",
		health: 70,
		attack: 20,
		baseAttack: 8,
		counterAttack: 14,
		iconPath: "assets/images/jonny-cage.jpg",
		charSpritePath: " ' + '  imgSrc ' + 'db.jpeg",
		enemySpritePath: " ' + '  imgSrc ' + 'db.jpeg"
	}
	var subzero = {
		name: "Subzero",
		display: "Subzero",
		health: 70,
		attack: 8,
		baseAttack: 7,
		counterAttack: 16,
		iconPath: "assets/images/sub-zero.jpg",
		charSpritePath: " ' + '  imgSrc ' + 'db.jpeg",
		enemySpritePath: " ' + '  imgSrc ' + 'db.jpeg"
	}
	var kittana = {
		name: 'Kittana',
		display: "Kittana",
		health: 34,
		attack: 18,
		baseAttack: 12,
		counterAttack: 18,
		iconPath: "assets/images/kittana.jpg",
		charSpritePath: "assets/images/sprites/ChunLi.gif",
		enemySpritePath: "assets/images/sprites/ChunLi2.gif"
	}
	var kano = {
		name: "Kano",
		display: "Kano",
		health: 100,
		attack: 75,
		baseAttack: 30,
		counterAttack: 2,
		iconPath: "assets/images/kano.jpg",
		charSpritePath: "assets/images/sprites/Bison.gif",
		enemySpritePath: "assets/images/sprites/Bison2.gif"
	}

	var characters = [dylan, subzero, kittana, kano];

	$(".playerCharPick").on("click", function() {
		characterPicked = eval($(this).data("obj"));
		$("#playerCharArea").append('<img src="'+ characterPicked.charSpritePath + '" class="image" data-obj="' + characterPicked.name + '">');
		$("#playerCharArea").show();
		updatePlayerStats();
		$("#playerCharSelection").empty();
		$("#result").html("");
		for (i=0;i<characters.length;i++) {
			if (characters[i].name !== characterPicked.name) {
				$("#enemyCharSelection").append('<div class = "col-md-3 cont"><img src="' + characters[i].iconPath + '" class="enemyCharPick" data-obj="' + characters[i].name + '"></div>');
			}
		}

  });
  


	$("#enemyCharSelection").on("click", ".enemyCharPick", function() {
		$(".newGame").show();
		if (!enemyBattling) {
			enemyPicked = eval($(this).data("obj"));
			$("#enemyCharArea").append('<img src="'+ enemyPicked.enemySpritePath + '" class="image" id="enemyChar" data-obj="' + enemyPicked.name + '">');
			$("#enemyCharArea").show();
			updateEnemyStats();
			$("#attack").show();
			$(this).hide();
			enemies.push(enemyPicked);
			enemyBattling = true;
		}
	});

	$(".attack").on("click", function() {
		// Player attacks enemy, enemy loses health equal to player attk
		// Player attack increases by base amount
		// If enemy is not dead, enemy counter attacks, player loses health equal to enemy counter attk
		if (enemyBattling == true) {

			enemyPicked.health -= characterPicked.attack;
			characterPicked.attack += characterPicked.baseAttack;
			updateEnemyStats();

			if (enemyPicked.health <= 0) { //Checks to see if enemy has been defeated
				$("#enemyChar").remove();
				$("#enemyName").html("");
				$("#enemyHealth").html("");
				enemyBattling = false;
				if (enemies.length == 3) { //Once all 3 enemies have been fought
					var enemyLiving = false;
					for (i=0; i<enemies.length;i++) {
						if (enemies[i].health > 0) {
							enemyLiving = true;
						}
					}
					if (enemyLiving == false) { //Once all 3 enemies have 0 health
						playerWon = true;
						$("#result").html("Player 1 Wins!");
						$(".attack").hide();
					}
				}
			}

			else {
				characterPicked.health -= enemyPicked.counterAttack;
				updatePlayerStats();
					if (characterPicked.health <= 0) { //Checks to see if player has been defeated
						playerLoss = false;
						$("#result").html("CPU Wins");
						$(".attack").hide();
					}
			}
			
		}
		else {
			alert("Please select another enemy");
		}
	});

	$(".newGame").on("click", function() {
		location.reload();
	});

	function updatePlayerStats() {
		$("#playerHealth").html("HP: " + characterPicked.health + "<br />Attack: " + characterPicked.attack);
		$("#playerName").html(characterPicked.display);
	}
	function updateEnemyStats() {
		$("#enemyHealth").html("HP: " + enemyPicked.health + "<br />Attack: " + enemyPicked.attack);
		$("#enemyName").html(enemyPicked.display);
	}

})


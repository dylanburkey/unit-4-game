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



$(function() {

  
  //Array of Playable Characters
  let characters = {
      'subzero': {
          name: 'subzero',
          health: 130,
          attack: 9,
          imageUrl: "assets/media/images/sub-zero.png",
          enemyAttackBack: 40
      }, 
      'raiden': {
          name: 'raiden',
          health: 120,
          attack: 15,
          imageUrl: "assets/media/images/raiden.png",
          enemyAttackBack: 60
      }, 
      'kano': {
          name: 'kano',
          health: 145,
          attack: 30,
          imageUrl: "assets/media/images/kano.png",
          enemyAttackBack: 20
      }, 
      'kittana': {
          name: 'kittana',
          health: 175,
          attack: 30,
          imageUrl: "assets/media/images/jonny-cage.png",
          enemyAttackBack: 20
      }
  };
/*
  let characters = {
    'jcage': {
        name: 'Kano',
        health: 140,
        attack: 4,
        imageUrl: "assets/images/rey.png",
        enemyAttackBack: 30
    }, 
    'darth': {
        name: 'raiden',
        health: 100,
        attack: 14,
        imageUrl: "assets/images/darthVader.png",
        enemyAttackBack: 5
    }, 
    'finn': {
        name: 'scorpion',
        health: 150,
        attack: 8,
        imageUrl: "assets/images/finn.png",
        enemyAttackBack: 20
    }, 
    'scorpion': {
        name: 'stormtrooper',
        health: 180,
        attack: 7,
        imageUrl: "assets/images/trooper.png",
        enemyAttackBack: 20
    }
};
*/
  
  var currentCharacter;
  var currentCharDefender;
  var combantList = [];
  var indexofSelChar;
  var attackResult;
  var gamegameTurnCounter = 1;
  var mortalKillCount = 0;
  
  
  var renderOne = function(character, renderArea, makeChar) {
      //character: obj, renderArea: class/id, makeChar: string


      var charDiv = $("<div class='character' data-name='" + character.name + "'>");
      var charName = $("<div class='character-name'>").text(character.name);
      var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
      var charHealth = $("<div class='character-health'>").text(character.health);
      charDiv.append(charName).append(charImage).append(charHealth);
      $(renderArea).append(charDiv);



      //Capitalizes the first letter in characters name
      // $('.character').css('textTransform', 'capitalize');
      // conditional render


      if (makeChar == 'enemy') {
        $(charDiv).addClass('enemy');
      } else if (makeChar == 'defender') {
        currentCharDefender = character;
        $(charDiv).addClass('target-enemy');
      }
    };
  
    // Create function to render game message to DOM



    var renderMessage = function(message) {
      var gameMesageSet = $("#gameMessage");
      var newMessage = $("<div>").text(message);
      gameMesageSet.append(newMessage);
  
      if (message == 'clearMessage') {
        gameMesageSet.text('');
      }
    };
  
    var renderCharacters = function(charObj, areaRender) {
      //render all characters
      if (areaRender == '#characters-section') {
        $(areaRender).empty();
        for (var key in charObj) {
          if (charObj.hasOwnProperty(key)) {
            renderOne(charObj[key], areaRender, '');
          }
        }
      }
      //render player character
      if (areaRender == '#selected-character') {
        $('#selected-character').prepend("Your Character");       
        renderOne(charObj, areaRender, '');
        $('#attack-button').css('visibility', 'visible');
      }
      //render combantList
      if (areaRender == '#available-to-attack-section') {
          $('#available-to-attack-section').prepend("Choose Your Next Opponent");      
        for (var i = 0; i < charObj.length; i++) {
  
          renderOne(charObj[i], areaRender, 'enemy');
        }
        //render one enemy to defender area
        $(document).on('click', '.enemy', function() {
          //select an combatant to fight
          name = ($(this).data('name'));
          //if defernder area is empty
          if ($('#defender').children().length === 0) {
            renderCharacters(name, '#defender');
            $(this).hide();
            renderMessage("clearMessage");
          }
        });
      }
      //render defender
      if (areaRender == '#defender') {
        $(areaRender).empty();
        for (var i = 0; i < combantList.length; i++) {
          //add enemy to defender area
          if (combantList[i].name == charObj) {
            $('#defender').append("Your selected opponent")
            renderOne(combantList[i], areaRender, 'defender');
          }
        }
      }
      //re-render defender when attacked
      if (areaRender == 'playerDamage') {
        $('#defender').empty();
        $('#defender').append("Your selected opponent")
        renderOne(charObj, '#defender', 'defender');
      }
      //re-render player character when attacked
      if (areaRender == 'enemyDamage') {
        $('#selected-character').empty();
        renderOne(charObj, '#selected-character', '');
      }
      //render defeated enemy
      if (areaRender == 'enemyDefeated') {
        $('#defender').empty();
        var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
        renderMessage(gameStateMessage);
      }
    };
    //this is to render all characters for user to choose their computer
    renderCharacters(characters, '#characters-section');
    $(document).on('click', '.character', function() {
      name = $(this).data('name');
      //if no player char has been selected
      if (!currentCharacter) {
        currentCharacter = characters[name];
        for (var key in characters) {
          if (key != name) {
            combantList.push(characters[key]);
          }
        }
        $("#characters-section").hide();
        renderCharacters(currentCharacter, '#selected-character');
        //this is to render all characters for user to choose fight against
        renderCharacters(combantList, '#available-to-attack-section');
      }
    });
  
    // ----------------------------------------------------------------
    // Create functions to enable actions between objects.
    $("#attack-button").on("click", function() {
      //if defernder area has enemy
      if ($('#defender').children().length !== 0) {
        //defender state change
        var attackMessage = "You attacked " + currentCharDefender.name + " for " + (currentCharacter.attack * gamegameTurnCounter) + " damage.";
        renderMessage("clearMessage");
        //combat
        currentCharDefender.health = currentCharDefender.health - (currentCharacter.attack * gamegameTurnCounter);
  
        //win condition
        if (currentCharDefender.health > 0) {
          //enemy not dead keep playing
          renderCharacters(currentCharDefender, 'playerDamage');
          //player state change
          var counterAttackMessage = currentCharDefender.name + " attacked you back for " + currentCharDefender.enemyAttackBack + " damage.";
          renderMessage(attackMessage);
          renderMessage(counterAttackMessage);
  
          currentCharacter.health = currentCharacter.health - currentCharDefender.enemyAttackBack;
          renderCharacters(currentCharacter, 'enemyDamage');
          if (currentCharacter.health <= 0) {
            renderMessage("clearMessage");
            restartGame("You have been defeated...GAME OVER!!!");
            $("#attack-button").unbind("click");
          }
        } else {
          renderCharacters(currentCharDefender, 'enemyDefeated');
          mortalKillCount++;
          if (mortalKillCount >= 3) {
            renderMessage("clearMessage");
            restartGame("You Won!!!! GAME OVER!!!");
            // The following line will play the imperial march:
            setTimeout(function() {
           
            }, 2000);
  
          }
        }
        gamegameTurnCounter++;
      } else {
        renderMessage("clearMessage");
        renderMessage("No enemy here.");
      }
    });
  
  //Restarts the game - renders a reset button
    var restartGame = function(inputEndGame) {
      //When 'Restart' button is clicked, reload the page.
      var restart = $('<button class="btn">Restart</button>').click(function() {
        location.reload();
      });
      var gameState = $("<div>").text(inputEndGame);
      $("#gameMessage").append(gameState);
      $("#gameMessage").append(restart);
    };
  
  });

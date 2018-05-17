/*============================================================================*\

  game.js
  ()

  @date: Sunday May 13, 2018 -5:17 PM
  @author: Dylan Burkey


\*============================================================================*/



/**
 *  Create the players and their attributes
 * 
 *  We want to store this in data.json at some point
 *
 *  @date: Sunday May 13, 2018 - 6:35 PM
 *  @author: Dyan Burkey
 *
 */



$(function () {

  /**
   *  Characters Array
   *  @todo Add this to a .json file to pull from 
   *  @date: Tuesday May 15, 2018 - 2:49 PM
   *  @author: Dyan Burkey
   *
   */
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



  /**
   *  Set "Global Vars" 
   *
   *  @date: Tuesday May 15, 2018 - 7:50 PM
   *  @author: Dyan Burkey
   *
   */
  var currentCharacter;
  var currentCharDefender;

  var indexofSelChar;
  var attackResult;
  var combantList = [];
  var mkGameTurnCounter = 1;
  var mortalKillCount = 0;


  /**
   *  Add Character attributes
   *  Create fire section to render content
   *  @date: Tuesday May 15, 2018 - 1:51 PM
   *  @author: Dyan Burkey
   *
   */

  var renderOne = function (character, renderArea, makeChar) {


    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    var charHealth = $("<div class='character-health'>").text(character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(renderArea).append(charDiv);



    /**
     *  
     *
     *  @date: Tuesday May 15, 2018 - 2:52 PM
     *  @author: Dyan Burkey
     *
     */


    if (makeChar == 'enemy') {
      $(charDiv).addClass('enemy');
    } else if (makeChar == 'defender') {
      currentCharDefender = character;
      $(charDiv).addClass('target-enemy');
    }
  };


  /**
   *  Function that should have added a message, does not appear to workl
   *
   *  @date: Tuesday May 15, 2018 - 1:52 PM
   *  @author: Dyan Burkey
   *
   */

  var gameStateMessage = function (message) {
    var gameMesageSet = $("#gameMessage");
    var newMessage = $("<div>").attr('class','message').text(message);
    gameMesageSet.append(newMessage);

    if (message == 'clearMessage') {
      gameMesageSet.text('');
    }
  };

  var renderCharacters = function (charObj, areaRender) {

/**
 *  Add alll fighters to the game
 *
 *  @date: Tuesday May 15, 2018 - 8:02 PM
 *  @author: Dyan Burkey
 *
 */ 

    if (areaRender == '#characters-section') {
      $(areaRender).empty();
      for (var key in charObj) {
        if (charObj.hasOwnProperty(key)) {
          renderOne(charObj[key], areaRender, '');
        }
      }
    }

    /**
     *  Create Character Section
     *
     *  @date: Tuesday May 15, 2018 - 3:53 PM
     *  @author: Dyan Burkey
     *
     */
    if (areaRender == '#selected-character') {
      $('#selected-character').prepend("Your Character");
      renderOne(charObj, areaRender, '');
      $('#attack-button').css('visibility', 'visible');
    }
    /**
     *  
     * Combat List - Players avaliable to attack
     *
     *  @date: Tuesday May 15, 2018 - 7:54 PM
     *  @author: Dyan Burkey
     *
     */
    if (areaRender == '#available-to-attack-section') {
      $('#available-to-attack-section').prepend("Good Kill. Choose Your Next Opponent");
      for (var i = 0; i < charObj.length; i++) {

        renderOne(charObj[i], areaRender, 'enemy');
      }

/**
 *  Aadd a fighter to the defnder list
 *
 *  @date: Tuesday May 15, 2018 - 8:04 PM
 *  @author: Dyan Burkey
 *
 */ 

      $(document).on('click', '.enemy', function () {
        //select an combatant to fight
        name = ($(this).data('name'));

        // If the defender area is empty - 
//Db @ May 15, 2018 - 4:04 PM

        if ($('#defender').children().length === 0) {
          renderCharacters(name, '#defender');
          $(this).hide();
          gameStateMessage("clearMessage");
        }
      });
    }
    /**
     *  
     *  Create Defender Section
     *  @date: Tuesday May 15, 2018 - 4:55 PM
     *  @author: Dyan Burkey
     *
     */
    if (areaRender == '#defender') {
      $(areaRender).empty();
      for (var i = 0; i < combantList.length; i++) {
        //
        // Add defender to selection
        // @author Dylan Burkey
        // @date May 15, 2018 - 4:05 PM
        //
        if (combantList[i].name == charObj) {
          $('#defender').append("Your selected opponent")
          renderOne(combantList[i], areaRender, 'defender');
        }
      }
    }
    /**
     *  When your opponent is injured, update stats
     *
     *  @date: Tuesday May 15, 2018 - 3:56 PM
     *  @author: Dyan Burkey
     *
     */

    if (areaRender == 'playerDamage') {
      $('#defender').empty();
      $('#defender').append("Your selected opponent")
      renderOne(charObj, '#defender', 'defender');
    }

    /**
     *  When you are attacked update stats.
     *
     *  @date: Tuesday May 15, 2018 - 7:57 PM
     *  @author: Dyan Burkey
     *
     */
    if (areaRender == 'enemyDamage') {
      $('#selected-character').empty();
      renderOne(charObj, '#selected-character', '');
    }

    /**
     *  When the enemy is defeated allow user to select a new opponent
     *
     *  @date: Tuesday May 15, 2018 - 7:58 PM
     *  @author: Dyan Burkey
     *
     */

    if (areaRender == 'enemyDefeated') {
      $('#defender').empty();
      var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
      gameStateMessage(gameStateMessage);
    }
  };

  /**
   *  Allow users to select their fighters
   *
   *  @date: Tuesday May 15, 2018 - 1:59 PM
   *  @author: Dyan Burkey
   *
   */
  renderCharacters(characters, '#characters-section');
  $(document).on('click', '.character', function () {
    name = $(this).data('name');
//
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


  // On click the player attacks
  $("#attack-button").on("click", function () {
    if ($('#defender').children().length !== 0) {
      var attackMessage = "You have attacked " + currentCharDefender.name + " for " + (currentCharacter.attack * mkGameTurnCounter) + " damage. Now you are learning";
      gameStateMessage("clearMessage");

      // Quick fix for counter
      currentCharDefender.health = currentCharDefender.health - (currentCharacter.attack * mkGameTurnCounter);

      /**
       *  Create a win condition
       *
       *  @date: Tuesday May 15, 2018 - 2:00 PM
       *  @author: Dyan Burkey
       *
       */
      if (currentCharDefender.health > 0) {
        renderCharacters(currentCharDefender, 'playerDamage');
        
        // Player keeps fighting
        
        // Player is damaged
        var counterAttackMessage = currentCharDefender.name + " made you feel the pain, for " + currentCharDefender.enemyAttackBack + " damage.";
        gameStateMessage(attackMessage);
        gameStateMessage(counterAttackMessage);


        currentCharacter.health = currentCharacter.health - currentCharDefender.enemyAttackBack;
        renderCharacters(currentCharacter, 'enemyDamage');
        if (currentCharacter.health <= 0) {
          gameStateMessage("clearMessage");
          // Player has been killed
          restartGame("You have been defeated..FINISH HIM");
          $("#attack-button").unbind("click");
        }
      } else {
        renderCharacters(currentCharDefender, 'enemyDefeated');
        mortalKillCount++;
        if (mortalKillCount >= 3) {
          gameStateMessage("clearMessage");
          restartGame("You have advanced to the next round, maybe you will survive!");
        }
      }
      mkGameTurnCounter++;


    } else {
      gameStateMessage("clearMessage");
      gameStateMessage("No enemy here.");
    }
  });

  // Restart game
  var restartGame = function (inputEndGame) {
    //When 'Restart' button is clicked, reload the page.
    var restart = $('<button class="btn">Restart</button>').click(function () {
      location.reload();
    });
    var gameState = $("<div>").attr('class','end-of-game').text(inputEndGame);
    $("#gameMessage").append(gameState);
    $("#gameMessage").append(restart);
  };

});
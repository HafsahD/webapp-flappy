// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: start ,update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)

var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var labelScore;
var player;
var pipes =[];
var pipeTimer;
var splashDisplay;
var backgroundSprite;
var background;
var background2;
var background3;
var backgroundLayer;
var otherLayer;
var easyTag;
var normalTag;
var backgroundVelocity;
var binary = [];
var binary2 =[];
var gameGravity;
;

/*;
 * Loads all resources for the game and gives them names.
 */

jQuery("#greeting-form").on("submit", function(event_details) {
    //var greeting = "Hello ";
    //var name = jQuery("#fullName").val();
    //var greeting_message = greeting + name;
    jQuery("#greeting").hide();
    //jQuery("#greeting").append("<p>" + greeting_message + "</p>");
});

function preload() {
    game.load.image("playerImg", "../assets/superwoman-Elph-1.gif");
    game.load.image("backgroundImg", "../assets/ccc.jpg");
    game.load.audio("score", "../assets/bttf.mp3");
    game.load.image("pipe", "../assets/pipe.png");
    game.load.image("backgroundImg2", "../assets/bg2.jpg");
    game.load.image("Easy", "../assets/easy.png");
    game.load.image("Normal", "../assets/normal.png");
    game.load.image("backgroundImg3", "../assets/space.png");
    //game.load.image("binary", "../assets/picture1.png");
   // game.load.image("binary2", "../assets/0.png");
    //game.load.image("bg", "../assets/ccc.png");
    //game.load.image("StartPage","../assets/srt.png")

}

function start()
{
    backgroundLayer= game.add.group();
    backgroundLayer.z=0;
    otherLayer= game.add.group();
    otherLayer.z=1;


    background = game.add.image(0, 0, "backgroundImg");
    background.width =790;
    background.height = 395;

    backgroundLayer.add(background);
    backgroundSprite = game.add.tileSprite( 0,0, 790,395,"backgroundImg");
    backgroundLayer.add(backgroundSprite);

    player = game.add.sprite(50, 80, "playerImg");
    player.width = 55;
    player.height = 100;

    otherLayer.add(player);
    splashDisplay =game.add.text(100,300, "Press ENTER to start, and move up or down", {fill:"LightBlue"} );
    otherLayer.add(splashDisplay);
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(create);

    setMode(modes.normal);

}

function moveUp() {
    player.y = player.y -25;
}
function moveDown(){
    player.y = player.y +25;
}
/* * Initialises the game. This function is only  called once.
 */

function NewLevel2() {
    background.destroy();
    background2 = game.add.image (0,0,"backgroundImg2");
    backgroundLayer.add(background2);

    splashDisplay =game.add.text(100,300, "LEVEL 2 - THE TOWN CENTRE");
    otherLayer.add(splashDisplay);
    backgroundVelocity = 20;
    backgroundSprite.autoScroll(-backgroundVelocity,0);


}

function NewLevel3() {
    background2.destroy();
    background3 = game.add.image(0,0, "backgroundImg3");
    backgroundLayer.add(background3);
    splashDisplay= game.add.text(100,300,"LEVEL 3 - SPACE MISSION", {fill:"#FFFFFF"});
    otherLayer.add(splashDisplay);
    backgroundVelocity =20;
    backgroundSprite.autoScroll(-backgroundVelocity,0);

}

function create() {

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(create);
    splashDisplay.destroy();
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);

    labelScore = game.add.text(760, 360, "0", {fill:"#00FF00"});
    otherLayer.add(labelScore);

    //var background = game.add.image(0, 0, "backgroundImg");
    //background.width =790;
    //background.height = 395;

    var backgroundVelocity = 20;
    backgroundSprite.autoScroll(-backgroundVelocity,0);


    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);
    generatePipe();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(player);

    //player.body.velocity.x = 5;
    //player.body.velocity.y = 5;


    // var pipeInterval = 1.75;
    //pipeTimer = game.time.events
    //.loop(pipeInterval * Phaser.Timer.SECOND,
    // generatePipe)

    easyTag = game.add.sprite(350, 100, "Easy");
    game.physics.arcade.enable(easyTag);
    easyTag.body.velocity.x = - gameSpeed;

    normalTag = game.add.sprite(350, 300, "Normal");
    game.physics.arcade.enable(normalTag);
    normalTag.body.velocity.x = - gameSpeed;

}
function addPipeBlock(x, y) {

    var pipeBlock = game.add.sprite(x,y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
    otherLayer.add(pipeBlock);
}
function generatePipe() {
    var gap = game.rnd.integerInRange(1, 4);
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap + 1 && count != gap + 2) {
            addPipeBlock(750, count * 50);
        }
    }
    changeScore();
}
function spaceHandler() {
    game.sound.play("score");
}
function changeScore () {
    score = score + 1;
    labelScore.setText(score.toString());

    if (score > 5 && score < 10) {
        NewLevel2();
    }

    else if (score >= 10) {
        NewLevel3();
    }
    else if (score == 20)
    {
            game.destroy();
            splashDisplay = game.add.text(100, 300, "MISSION SUCCESSFUL", {fill: "#FFFFFF"});
        }

}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

    game.physics.arcade.overlap(player,easyTag, function() {
        easyTag.destroy();
        normalTag.destroy();
        setMode(modes.easy);
        game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe)
    });

    game.physics.arcade.overlap(player,normalTag, function() {
        easyTag.destroy();
        normalTag.destroy();
        setMode(modes.normal);
        game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe)
    });
for (var i=binary.length - 1; i >= 0; i--){
    game.physics.arcade. overlap(player, binary [i], function(){

        changeGravity(-50);
       binary[i].destory();
        binary.splice(i,1);

    });
}
    function changeGravity(g) {
        gameGravity+= g;
        player.body.gravity.y = gameGravity
    }
    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes[index],
            gameOver);
    }

    checkBonus(binary, 50);
    checkBonus(binary2, 50);
}


function gameOver() {

    for (var index = 0; index < pipes.length; index++ ){

        //game.physics.arcade.destroy();

        game.time.events.remove(pipeTimer);
        jQuery("#greeting").show();
        game.destroy();
        game.input
            .keyboard.addKey(Phaser.Keyboard.ENTER)
            .onDown.add(gameRestart);
        $("#score").val(score.toString());

        //location.reload();
    }}

function gameRestart() {
    score = 0;
    start();
}

$.get("/score", function(scores) {
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });

    for (var i = 0; i < 3; i++) {
        $("#scoreBoard").append(
            "<li>" + scores[i].name + ": " + scores[i].score +
            "</li>")
    }
});

var easyMode = {
    pipeInterval: 3,
    gameSpeed: 170
};
var normalMode = {
    pipeInterval: 1.75,
    gameSpeed: 200
};

var modes = {
    easy: easyMode,
    normal: normalMode
}

function setMode(mode) {
    pipeInterval = mode.pipeInterval;
    gameSpeed = mode.gameSpeed;
}
function generatebinary () {
    var bonus = game.add.sprite(width, height, "binary");
    binary.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
}

function generatebinary2 () {
    var bonus = game.add.sprite(width, height, "binary2");
    binary2.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
}

function generate(){
    var diceRoll = game.rnd.integerInRange(1,2);
    if(diceRoll == 1) {
        generatebinary();
    }
    else if(diceRoll==2){
        generatebinary2();
    }
    else {
        generatePipe();
    }
}

function checkBonus (binary, BonusEffect) {
    for(var i=binary.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,binary[i], function(){
            changeGravity(BonusEffect);
            binary[i].destroy();
            binary.splice(i,1)
        });
    }
}



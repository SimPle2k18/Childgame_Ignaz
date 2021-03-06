/**
 * Einfaches Ausweich-Spiel Prototyp
 * @author Simone Pledl
 * @version 0.1
 */

/**
*Initialisierung Canvas
*/
var canvas = document.getElementById("canvas");
canvas.width = screen.width;
canvas.height = screen.height;
var ctx = canvas.getContext("2d");


/**
*Klasse Spieler
* @constructor
*/
class player{
  /**
  *Konstruktor Spieler
  @param img = Bild d. Spielers,
  @param posX = X-Position d. Spielers,
  @param posY = Y-Position d. Spielers
  */
  constructor(img, posX, posY){
    this.img = new Image();
    this.img.src='img/Schildkroete_med.png';
    this.img.height = 100;
    this.img.width = 100;
    this.posX = posX;
    this.posY = posY;
  }
}

/**
*Klasse Gegner
@constructor
*/
class enemy{
  /**
  *Klasse Gegner
    @param img = Bild d. Gegners
  */
  constructor(img){
    this.img = new Image();
    this.img.src='img/plastik.png';
    this.posX = [];
    this.posY = [];
  }
}

/**
* GLOBALS
* festsetzen der Variablen für den Spielablauf
*/
var character = new player();
var spawnAmount = 1/30;
var maxTicks = 60;
var tickCount = 0;
var level = 1;

/**
*Spielstart wird bei Klick auf StartButton ausgelöst
*/
document.getElementById("Startbtn").addEventListener("click", init);
/**
*durch klick auf StartseiteBtn kommt man während des Spiels auf Startseite zurück
*/
document.getElementById("StartseiteBtn").addEventListener("click", function(){location.reload()});


/**
*Initialisierung des Spiels
*/
function init(){
  var canvas = document.getElementById("canvas");
  canvas.width = screen.width;
  canvas.height = screen.height;
  var ctx = canvas.getContext("2d");

/**
* Initialisierung des Spielers in Variablen character
* @param img,
* @param posX,
* @param posY
* Initialisierung des Gegners in Variblen enemy
* @param this.img
*/
  character = new player(this.img, (canvas.width - 100) / 2,(canvas.height - 100) / 2);
  enemy = new enemy(this.img);

/**
* Hinzufügen eines EventListeners
* zur Bewegungssteuerung auf Canvas mit TouchHandler
*/
  ctx.canvas.addEventListener("touchstart", touchHandler);
  ctx.canvas.addEventListener("touchmove", touchHandler);
  function touchHandler(e) {
      if(e.touches) {
          character.posX = e.touches[0].pageX - canvas.offsetLeft - 50;
          character.posY = e.touches[0].pageY - canvas.offsetTop - 50;
          e.preventDefault();
      }
  }

/**
* in Funktion setInerval
* @param gameLogic aufruf der Funktion gameLogic
* @param 50 - alle 50 Millisekunden wird gameLogic aufgerufen
*/
  setInterval(gameLogic, 50);

}

/**
* Funktion draw zeichnet Timer- und Levelanzeige auf Canvas
*/
      function draw(){
            //LEVEL
            ctx.font = "15px Verdana";
            ctx.fillStyle = 'black';
            /**
            *.fillText
            * @param maxTicks holt sich Wert aus Global maxTicks
            * @param 7, 15 = Positionierung in x- und y-Richtung
            */
            ctx.fillText("Timer: " + maxTicks, 7, 15)
            ctx.fillText("Level: " + level, 7, 30)
      }

      /**
      * Herzstück des Spiels
      */
    function gameLogic(){
      /**
      *@param draw, damit Anzeige immer wieder neu "gezeichnet" wird
      */
      requestAnimationFrame(draw);
      /**
      *Funktion wird aufgerufen, damit Canvas wieder neugezeichnet wird
      */
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      /**
      * Zeichne Charakter auf canvas
      * @param character.img = Bild Charakter
      * @param character.posX = X-Position an der Charakter gezeichnet werden soll
      * @param characer.posY = Y-Position an der Charakter gezeichnet werden soll
      * @param height = Höhe, die Charakter haben soll
      * @param width = Breite, die Charakter haben soll
      */
      ctx.drawImage(character.img, character.posX, character.posY, 100, 100);
      /**
      * Definition der Gegner-Variablen für das Array
      *
      */
      var enemyNr = 0;
      var allEnemies = enemy.posX.length;
      /**
      *Gegner Spawn-Loop
      * wenn die maxTicks-Anzahl größer als 0 ist,
      * wird jeder 30ste Gegner (da spawnAmount = 1/30) in das Gegner Array gespeichert
      * und auf dem Canvas an random X-Position gezeichnet
      */
      if(maxTicks>0){
      if (Math.random() < spawnAmount)
      {
          enemy.posY.push(0);
          enemy.posX.push(Math.random() * this.canvas.width);
      }
      while (enemyNr < allEnemies) {
          enemy.posY[enemyNr] = enemy.posY[enemyNr] + 1;
          enemyNr += 1;
      }
      enemyNr = 0;
      while (enemyNr < allEnemies) {
        ctx.drawImage(enemy.img, enemy.posX[enemyNr], enemy.posY[enemyNr], 60, 70);
        enemyNr += 1;
      }
      /**
       * Aufruf der collision funktion im Loop da immer getestet wird, ob collision vorliegt
       */
      collision();
      }else{
        /**
         * sollte die Zeitspanne der Ticks abgelaufen sein, hat man das Level "bestanden"
         * es werden keine Gegner mehr ins Array geladen
         * @param enemy.posX.push(0);
         * und man kommt zum nächsten Level
         */
        enemy.posX.push(0);
        alert("Du hast mich gerettet!");
        nextLevel();

      }

    }

/**
* Hier wird getestet ob Kollision zwischen Spieler und Gegner vorliegt
*/
function collision(){
  var enemyNr = 0;
  var allEnemies = enemy.posX.length;
  /**
   * Solange das einzelne element im Array kleiner ist, als die Gesamtanzahl, wird gestetet ob Kollisionen vorliegen
   */
  while (enemyNr < allEnemies){
    if ( ( (character.posX < enemy.posY[enemyNr] && enemy.posX[enemyNr] < character.posX + 80)
     || (enemy.posX[enemyNr] < character.posX && character.posX < enemy.posX[enemyNr] + 40 ) )
     && ( (character.posY < enemy.posY[enemyNr] && enemy.posY[enemyNr] < character.posY + 80)
     || (enemy.posY[enemyNr] < character.posY && character.posY < enemy.posY[enemyNr] + 30) ) ) {
       /**
        * Liegt eine Kollision vor wird dies mit alert() angezeigt
        * und das Spiel wird neu gestartet
        */
      alert("Du hast dich im Plastik verfangen!");

      startNewGame();
    }
    /**
     * erhöhe die Anzahl der Gegner um 1
     */
    enemyNr += 1;
  }
}

/**
 * für den Neustart des Spiels wird der Countdown neu gesetzt
 * sowie das Array geleert
 */
function startNewGame(){
  maxTicks = 60;
  enemy.posY=[];
  enemy.posX=[];
}

/**
 * Der countdown zieht von der Globalen Variablen maxTicks immer 1 ab
 */
function countdown()
{
  maxTicks--;
};
/**
 * er wird jede Sekunde aufgerufen
 * @param countdown();
 * @param 1000 = Milisekunden
 */
var countdown = setInterval(countdown, 1000);


/**
 * in der Funktion nextLevel werden die Variablen wieder neu gesetzt
 * die Levelanzeige erhöht sich
 * der Countdown wird länger
 * und die Anzahl der Gegner wird mehr
 * auch hier werden die Positionsarrays der Gegner in x und y Richtung wieder neu aufgesetzt
 */
function nextLevel(){
  level += 1;
  maxTicks = 70;
  spawnAmount = 1/20;
  enemy.posY=[];
  enemy.posX=[];

}

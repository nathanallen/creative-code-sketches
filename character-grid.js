function randLetter(){
  return String.fromCharCode(rand(10000000000));
}

var nextLetter = (function(){
  var idx = 0;
  return function(reverse=false){
    return String.fromCharCode(idx++);
  }
}());

function rand(max=255){
  return Math.floor( Math.random() * max );
}

var randColor = (function(){
  return function(){
    return `rgb(${rand()},${rand()},${rand()})`;
  }
}())

var nextSpaceBool = (function(){
  // to fill or not to fill, that is the question
  // simulates a word-char vs a space between words, in a sentence
  var word = 1+rand(5);
  return function(){
    if (word){
      word--;
      return true;
    }
    word = rand(5) + rand(3);
    return false;
  }

}())

var nextPos = (function(){
  var idx = 0,
      max = window.N || 20, // TODO
      pos = {x: 0, y: 0}

  return function(){
    pos.x = idx%max;
    pos.y = Math.floor( (idx/max) % max);
    idx++;
    return pos;
  }
}());

var randPos = (function(){
  var max = 20,
      pos = {x: 0, y: 0};

  return function(){
    pos.x = rand(max);
    pos.y = rand(max)
    return pos;
  }
}());

var nextWord = function(){
  var word = "";
  while(nextSpaceBool()){
    word += nextLetter();
  }
  return word;
}

const N = 30;
function setup() {
  createCanvas(N*N, N*N);
}

function draw() {

  eraseSpaceBySpace();
  fillRandCell();

  // renderWordByWord();
  // renderBigLetter();

}


function eraseSpaceBySpace(){
  pos = nextPos();
  // noStroke()
  if (nextSpaceBool()) {
    // DO NOTHING (e.g. it's a "word" in a sentence)
  } else {
    // e.g. it's a space between words that we want to erase
    fill("rgb(255,255,255)")
    rect(pos.x*N, pos.y*N, N, N)
  }
}

function fillRandCell(letter=""){
  pos = randPos();

  /* partially erase cell */
  noStroke()
  fill("rgba(255,255,255)")
  rect(pos.x*N, pos.y*N, N, N)

  /* and then add randomly colored nextLetter to cell */
  c = color(randColor());
  fill(c);
  textSize(N)
  text(letter || nextLetter(), pos.x*N, pos.y*N, N, N);
}

function renderWordByWord(){
  /* print out sentences word by word */
  pos = nextPos();
  c = color(randColor());
  fill(c);
  textSize(N)
  text(nextWord(), pos.x*N, pos.y*N, N, N);
}

function renderBigLetter(){
  if (Math.random() < 0.1){
    c = color(randColor());
    fill(c);
    textSize(N*12)
    text(nextLetter(), rand(N*N), rand(N*N), N*12, N*12);
  }
}


function mousePressed() {
  if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    var fs = fullscreen();
    fullscreen(!fs);
  }
}

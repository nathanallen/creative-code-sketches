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


var forever = (function() {

  return function setup(cb) {
    function repeat(){
      cb()
      setTimeout(repeat, 200)
    }
    return repeat;
  }

}());

var els = document.querySelectorAll("td");

function nextSequentialGrid(){
  for(var el of els ) {
    l = nextLetter();
    el.innerText = l;
  }
}
function nextRandGrid(){
  for(var el of els ) {
    el.innerText = randLetter();
  }
}
function nextRandGridGhosting(){
  for(var el of els ) {
    if (Math.random() <= 0.25){
      el.innerText = nextLetter();
      continue;
    }
    if (Math.random() <= 0.05){
      el.innerText = " ";
    }
  }
}

function nextRandGridGhostingFlyers(){
  for(var el of els ) {
    if (Math.random() <= 0.25){
      el.innerText = nextLetter();
      continue;
    }
    if (Math.random() <= 0.05){
      el.innerText = " ";
    }
    if (Math.random() <= 0.01){
      fly(el);
    }
  }
}


function fly(el, steps=5){
  var letter = el.innerText;
  var el = el;
  var interval = setInterval(function(){
    el.setAttribute("style", "border: none;")
    el = el.nextElementSibling
    el.innerText = letter;
    el.setAttribute("style", "border: 1px solid blue;")
  }, 300)
  // setTimeout(function(){
  //   clearInterval(this)
  // }.bind(interval), 900)
}


// forever(nextSequentialGrid)();
// forever(nextRandGrid)();
forever(nextRandGridGhosting)();
// forever(nextRandGridGhostingFlyers)();

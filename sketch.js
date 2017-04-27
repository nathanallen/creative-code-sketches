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
iters = 30;
els = document.querySelectorAll("td");

var forever = (function() {

  return function setup(cb) {
    function repeat(){
      cb()
      setTimeout(repeat, 200)
    }
    return repeat;
  }

}());

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
    }
  }
}

// forever(nextSequentialGrid)();
forever(nextRandGridGhosting)();

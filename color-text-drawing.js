var nextLetter = (function(){
  var text = "The quick brown fox jumped over the lazy dog"
  var idx = 0,
      len = text.length;
  return function(reverse=false){
    if (reverse) {
      console.count("reverse")
      return text[--idx % len] || ""
    }
    return text[++idx % len]  || "";
  }
}());

var lastX = 0;

function setup() {
  createCanvas(1400, 800);
}

function draw() {
  textSize(20)
  c = color(`rgb(${Math.ceil(Math.random()*255)},${Math.ceil(Math.random()*255)},${Math.ceil(Math.random()*255)})`);
  fill(c);
  text(nextLetter(lastX > mouseX), mouseX, mouseY, 20, 20);
  lastX = mouseX;
}

function mousePressed() {
  if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    var fs = fullscreen();
    fullscreen(!fs);
  }
}

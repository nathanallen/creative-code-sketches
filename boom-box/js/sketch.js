
//create audio context
const audioContext = new AudioContext();

//setup analyser
const
analyser = audioContext.createAnalyser();
// analyser.fftSize = 512;
analyser.fftSize = 64;

const
bufferLength = analyser.frequencyBinCount,
dataArray = new Uint8Array( bufferLength );

analyser.getByteTimeDomainData( dataArray );

//setup master gain (volume)
const masterGain = audioContext.createGain();
masterGain.connect( audioContext.destination );
masterGain.connect( analyser );
masterGain.gain.value = 0;


//setup LFO
const lfoOctaveRange = 4;
const maxLFOValue = 5;//sample playback rate
const maxLFORate = 8;

const lfo = audioContext.createOscillator();
lfo.frequency.value = maxLFORate;

const lfoGain = audioContext.createGain();
lfoGain.gain.value = maxLFOValue;
lfo.start();

lfo.connect( lfoGain );

let buffersLoaded = false;
let bufferSource = undefined;
let bufferMap = undefined;
let bufferPlayer = undefined;

function setup() {

  bufferPlayer = new AudioBufferPlayer({
    audioContext: audioContext
  });

  let audioURLs = new Map();
  let buffers = new Map();
  audioURLs.set( 0, "audio/BeatSample.mp3" );
  AudioBufferLoader.load( audioURLs, audioContext ).then( function( buffers ){
    bufferMap = buffers;
    buffersLoaded = true;
    let buffer = bufferMap.get( 0 );
    let offset = 0;
    bufferSource = bufferPlayer.start( buffer, audioContext.currentTime, offset, buffer.duration, true, 0, buffer.duration );
    bufferSource.connect( masterGain );

    // lfo.connect( bufferSource.playbackRate );

  } );


  //create canvas
  createCanvas( window.innerWidth, window.innerHeight );
  noStroke()

}


function draw() {
  noStroke()
  if ( !mouseIsPressed) {

    //fill canvas with 50% transparency (127/255)
    fill( 255, 255, 255, 127 );
    rect( 0, 0, window.innerWidth, window.innerHeight );

    lfo.frequency.value = ( mouseY / window.innerHeight ) * maxLFORate;
    lfoGain.gain.value = ( 1 - ( mouseX / window.innerWidth ) ) * maxLFOValue;

    masterGain.gain.value = 1;

    fill( 0 );

    if ( buffersLoaded === true ) {
      //time, offset, duration, loop, loopStartTime, loopEndTime
      bufferSource.playbackRate.value = ( mouseY / window.innerHeight );

    }

    lpMouse();

  } else {

    // clear();
    fill(255, 255, 255, 10);

    masterGain.gain.value = 0;


    stroke(0)


  }


}


function lpMouse(){

  analyser.getByteTimeDomainData( dataArray );
  var n = dataArray.reduce(function(acc, val){
    return acc += val;
  },0)/32

  // stroke(0,0,255,80)
  // fill(255, 255, 255)
  // translate(mouseX, mouseY);
  // rotate(PI*(100/mouseX*mouseY) );
  // rect(-50, -50, 100, 100);


  // generateRecord(n, (100/mouseX * 255), (100/mouseY * 255))
  generateRecord(n, 0, 0)
  renderWave(dataArray)
}

function generateRecord(size,rgbX, rgbY){
  noStroke()
  fill(rgbX, 0, rgbY)
  ellipse( mouseX, mouseY, size, size );
  while((size-=10) > 0){
    fill(255)
    ellipse( mouseX, mouseY, size, size );
    fill(rgbY, rgbX, 0)
    ellipse(mouseX, mouseY, size-2, size-2 );
  }
  fill(255)
  ellipse( mouseX, mouseY, 5, 5 );
}

function renderWave(wave) {
  noStroke();
  // A simple wax to draw the wave with an ellipse at each location
  for (var x = 0; x < wave.length; x++) {
    // fill(random(255), random(255), random(255));
    fill(0)
    ellipse(windowWidth*sin(wave[x])+x, 10+x*windowHeight/32, 8);
  }
}

// // start slingin' some d3 here.

var board = d3.select('svg');

var scoreBoard = {
  currentScore: 0,
  highScore: 0,
  collisions: 0,
  collisionFlag: false,

  currentUI:document.querySelector('.current span'),
  highUI: document.querySelector('.high span'),
  collisionUI: document.querySelector('.collisions span'),

  setScores: function(){
    this.currentScore ++;
    if(this.currentScore > this.highScore){
      this.highScore = this.currentScore;
      this.highUI.innerHTML = this.highScore;
    }

    this.currentUI.innerHTML = this.currentScore;
    
  },
  resetScore: function(){
    this.currentScore = 0;
    this.currentUI.innerHTML = this.currentScore;
  },
  updateCollisions: function(){
    this.collisions++;
    this.collisionUI.innerHTML = this.collisions;
    this.collisionFlag = false;
  }
};

var gameOptions = {
  enemyCount:30,
  enemyRadius: 10
};



var makeEnemyData = function () {
  var enemyData = [];
  for(var i=0; i < gameOptions.enemyCount; i++) {
    enemyData.push({
      id: i,
      cx:Math.random() * 600,
      cy:Math.random() * 400,
      r:gameOptions.enemyRadius,
      color:'red',
      class: 'enemy'

    });
  }
  return enemyData;
};


var playerOptions = [{
  r:10,
  cy:200,
  cx:300,
  color:'yellow',
  class:'playerOptions'
}];


var player = board.selectAll('circle.player')
  .data(playerOptions)
  .enter()
  .append('circle')
  .attr('cx', function(d){return d.cx;})
  .attr('cy', function(d){return d.cy;})
  .attr('r',  function(d){return d.r;})
  .attr('fill',  function(d){return d.color})
  .attr('class', function(d){return d.class});

var enemies = board.selectAll('circle.enemy')
  .data(makeEnemyData())
  .enter()
  .append('circle')
  .attr('cx', function(d){ return d.cx;})
  .attr('cy', function(d){ return d.cy;})
  .attr('r', function(d){ return d.r;})
  .attr('fill', function(d){ return d.color;})
  .attr('class', function(d){ return d.class});  

var collisionCheck = function(enemyDOMElement) {

  var a = Math.pow(Math.abs(enemyDOMElement.attributes.cx.value - player.attr('cx')), 2);
  var b = Math.pow(Math.abs(enemyDOMElement.attributes.cy.value - player.attr('cy')), 2);
  var distance = Math.sqrt(a + b);
  if (distance < 20){
    scoreBoard.resetScore();
    scoreBoard.collisonFlag = true;
  }

};

player.call(d3.behavior.drag().on('drag', function(d){
  
  player.attr('cx', function(d){
    return d3.event.x;
  })
  .attr('cy', function(d){
    return d3.event.y;
  });

}));



var update = function() {
  enemies
    .data(makeEnemyData(), function(d){ return d.id;})
    .transition()
    .duration(1000)
    .attr('cx', function(d){ return d.cx;})
    .attr('cy', function(d){ return d.cy;})
    .ease('bounce');

  if(scoreBoard.collisonFlag===true){
    scoreBoard.updateCollisions();
  }
};



setInterval(function() {
  update();
},2000)

setInterval(function(){
  enemies[0].forEach(function(enemyDOMElement) {
    collisionCheck.call(null, enemyDOMElement);
  });
  scoreBoard.setScores();
},10);





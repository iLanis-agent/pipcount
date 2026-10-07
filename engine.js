/* PipCount engine: backgammon race math and dice odds.
   - pip counts from point distributions
   - doubling-cube advice via the published 8-9-12 race rule of thumb
     (races only - no contact, no bearoff structure)
   - hit odds by distance via full enumeration of the 36 ordered rolls,
     simple model: direct die, two-dice sum, double steps; blockers ignored
   - bar entry odds with k open home points
   Pure JS, browser + Node. */
(function(root,factory){
  if(typeof module==='object'&&module.exports){module.exports=factory();}
  else{root.PipCount=factory();}
})(typeof self!=='undefined'?self:this,function(){
'use strict';
/* counts: array of 24, checkers per point (point 1 = index 0) */
function pips(counts){
  var total=0;
  for(var i=0;i<counts.length;i++){
    var c=parseInt(counts[i],10);
    if(!(c>=0))return null;
    total+=(i+1)*c;
  }
  return total;
}
function checkers(counts){
  var t=0;
  for(var i=0;i<counts.length;i++)t+=parseInt(counts[i],10)||0;
  return t;
}
/* 8-9-12 rule: deficit = trailer - leader as pct of leader's count.
   double at >=8%, redouble at >=9%, take if deficit <=12%. */
function cubeAdvice(leader,trailer){
  if(!(leader>0)||!(trailer>leader))return null;
  var pct=(trailer-leader)/leader*100;
  return {
    deficitPct:Math.round(pct*10)/10,
    double:pct>=8,
    redouble:pct>=9,
    take:pct<=12
  };
}
var ROLLS=[];
for(var a=1;a<=6;a++)for(var b=1;b<=6;b++)ROLLS.push([a,b]);
/* outcomes (of 36) that hit a blot exactly d pips away, simple model */
function hitCount(d){
  if(!(d>=1&&d<=24))return 0;
  var n=0;
  for(var i=0;i<36;i++){
    var x=ROLLS[i][0],y=ROLLS[i][1],hit=false;
    if(x===d||y===d||x+y===d)hit=true;
    if(x===y){for(var m=1;m<=4;m++)if(x*m===d)hit=true;}
    if(hit)n++;
  }
  return n;
}
function hitProb(d){return hitCount(d)/36;}
/* bar entry: home points 1..6, `open` of them unblocked.
   Enters if either die shows an open point. */
function enterCount(openPoints){
  if(!(openPoints>=0&&openPoints<=6))return null;
  if(openPoints===0)return 0;
  var n=0;
  for(var i=0;i<36;i++){
    var x=ROLLS[i][0],y=ROLLS[i][1];
    if(x<=openPoints||y<=openPoints)n++;
  }
  return n;
}
function enterProb(openPoints){
  var c=enterCount(openPoints);
  return c===null?null:c/36;
}
return {pips:pips,checkers:checkers,cubeAdvice:cubeAdvice,hitCount:hitCount,hitProb:hitProb,enterCount:enterCount,enterProb:enterProb};
});

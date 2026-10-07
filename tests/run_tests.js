/* PipCount tests: engine vs tests/expected.json (python oracle). */
'use strict';
const fs=require('fs'),path=require('path');
const P=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
function ok(){pass++;}
function bad(l,a,b){fail++;console.log('FAIL '+l+': got '+JSON.stringify(a)+' want '+JSON.stringify(b));}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
for(const it of items){
  const T=it.kind+' '+JSON.stringify(it).slice(0,45)+' ';
  if(it.kind==='pips'){
    const r=P.pips(it.counts);
    if(r===it.oracle)ok(); else bad(T,r,it.oracle);
  }else if(it.kind==='cube'){
    const r=P.cubeAdvice(it.leader,it.trailer);
    if(same(r,it.oracle))ok(); else bad(T,r,it.oracle);
  }else if(it.kind==='hit'){
    if(P.hitCount(it.d)===it.oracle)ok(); else bad(T,P.hitCount(it.d),it.oracle);
  }else{
    const r=P.enterCount(it.open);
    if(r===it.oracle)ok(); else bad(T,r,it.oracle);
  }
}
// known reference values from published tables: hit 6 = 17/36, enter with 4 open = 32/36
if(P.hitCount(6)===17)pass++; else bad('hit6 ref',P.hitCount(6),17);
if(P.enterCount(4)===32)pass++; else bad('enter4 ref',P.enterCount(4),32);
if(P.enterCount(1)===11)pass++; else bad('enter1 ref',P.enterCount(1),11);
// starting position is 167 pips
const START=[0,0,0,0,0,5,0,3,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,2];
if(P.pips(START)===167&&P.checkers(START)===15)pass++; else bad('start pos',P.pips(START),167);
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);

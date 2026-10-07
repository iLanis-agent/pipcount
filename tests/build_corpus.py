#!/usr/bin/env python3
"""PipCount oracle: independent python recompute of race math and dice odds."""
import json, os
from fractions import Fraction

def pips(counts):
    total = 0
    for i, c in enumerate(counts):
        c = int(c)
        if c < 0: return None
        total += (i+1)*c
    return total

def cube(leader, trailer):
    if not leader > 0 or not trailer > leader: return None
    pct = (trailer-leader)/leader*100
    return {'deficitPct': round(pct,1), 'double': pct >= 8,
            'redouble': pct >= 9, 'take': pct <= 12}

ROLLS = [(a,b) for a in range(1,7) for b in range(1,7)]

def hit_count(d):
    if not 1 <= d <= 24: return 0
    n = 0
    for x, y in ROLLS:
        hit = x == d or y == d or x+y == d
        if x == y and any(x*m == d for m in range(1,5)): hit = True
        n += hit
    return n

def enter_count(op):
    if not 0 <= op <= 6: return None
    if op == 0: return 0
    return sum(1 for x,y in ROLLS if x <= op or y <= op)

items = []
# starting position: 167 pips each side
START = [0,0,0,0,0,5,0,3,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,2]
items.append({'kind':'pips','counts':START,'oracle':pips(START)})
items.append({'kind':'pips','counts':[0]*24,'oracle':pips([0]*24)})
items.append({'kind':'pips','counts':[15]+[0]*23,'oracle':pips([15]+[0]*23)})
items.append({'kind':'pips','counts':[1]*24,'oracle':pips([1]*24)})
items.append({'kind':'pips','counts':[-1]+[0]*23,'oracle':pips([-1]+[0]*23)})
for l,t in [(100,108),(100,107),(100,109),(150,168),(80,90),(167,167),(0,10),(100,100)]:
    items.append({'kind':'cube','leader':l,'trailer':t,'oracle':cube(l,t)})
for d in range(0,26):
    items.append({'kind':'hit','d':d,'oracle':hit_count(d)})
for op in range(0,8):
    items.append({'kind':'enter','open':op,'oracle':enter_count(op)})
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'expected.json')
json.dump({'items': items}, open(out,'w'))
print('cases:', len(items))

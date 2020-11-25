this is the final version.
Works: rotating using up/down and left/right arrows
a,d: for previous / next object in the same hierarchical level
(Two feet not in same level but not siblings since they're each child of the other leg)
w: previous level (pressing w in the begining right after loading highlights the whole object)
s: select next child (right after load, pressing s highlights first child (head of the robot)).
selecting an object automatically shows its local coordinate axes, can be hidden by pressing c
r: resets the entire robot (by resetting all matrices of objects and axes individually)
c: show and hide coordinate axes

Not working
orbitalcontrols:for some reason, outside of the scope of the questions.

Bug:
After a few rotations / transformations, the objects drift away from the axes (axes remain in original position,
object still rotates in its initial position.)

N.B: Feet are small and hard to see, but are highlighted once we reach legs (with a or d) and then pressing s.

Devlog
======



.. author:: default
.. categories:: Gamedev
.. tags:: gamedev, devlog, game, dev, sfml, c++
.. comments::

Hello! I've decided to start a devlog on this blog. As you can see, I've used 
this for other things, but I'm going to use this as my devlog from now on. I've
started a game and I don't know if  I'll generate any interest, but who knows. 
This may just be my own echo chamber, and maybe a place to log all the things
I've learned, but so be it. 

I'm a little nervous to let my idea out of the bag, but I'd rather get people
interested early in the story. My goal is to be as historically accurate as 
possible. I say historically because..

The story follows a bodygaurd in 1886 America. In this alternate timeline, you
as the bodyguard were hired by Abraham Lincoln to protect him post-civil war. 
After thwarting John Wilkes Booth assasination attempt, Lincoln wants you to
escort him via train to the Pacific Northwest. 

The gameplay so far is going to be a sidescrolling arcade-ish game. Hopefully
I can get some screenshots up soon. But back to historically accurate, I want
to capture the feel of the late 1880's, with music and style, and pre-steam
punk 'future tech'. I also want to follow the railroad tracks from that time
as closely as possible.

So far, I've been working on the game for about a week. I am using SFML and C++
to roll my own mini-engine but it will be integral
to the game. I have created a StateManager class that creates a stack of 
GameStates and controls the game loop. It controlls pushes, pops, and the
transition between the  states. The GameState class has a bunch of virtual
functions for the input handling, updatating the screen and drawing to it.
The virtual functions make it so that children class, like the MenuState
or the PauseState or whatever have to implement and handle their own input and
update handling. As of now, I have this working with a menu state that can
transition to the gameplay state. I can't go back yet to the menu yet. Right now
I'm working on handling textures, sprites, and animations. No big roadblocks
yet!

Thank you for anyone who is looking at this! I'm glad that at least someone is
reading this. 

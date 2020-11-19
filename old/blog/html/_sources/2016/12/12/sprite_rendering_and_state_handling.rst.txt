Sprite Rendering and State Handling
===================================



.. author:: Taylor Fahlmant
.. categories:: Gamedev
.. tags:: gamedev, devlog, game, dev, sfml, c++, sprites, state
.. comments::

After a long hiatus (thanks to a 19 credit term), I'm back to working on the game.
Textures and sprites now can be loaded and drawn pretty easily. Chaning between the states
is now smoothly handled after I removed a bug. Now I can start the game in a menu, click on
a button, transition to the 'gameplay' and render a sprite that changes when pressing the
direction keys. Now time to explain how it all works, after a short GIF!

(GIF Here)

The first part of the architecture I worked on was state handling. The most basic thing
one can do, at least in my game, is go from the menu, to the game or to the options, and
of course there has to be a pause screen too. In order to manage these states, I made
a StateManager class. This class has a stack of GameStates, which is the parent class
of all possible states. Along with this stack, there are functions to push, pop, peek
and change states, which is just a combination of pop and push. The state manager 
also runs the game loop, which handles input, updates the state based on the input,
and draws all the changes. It does this by using a parent GameState objet, and running
the respective functions of whatever the state actually is. 

The GameState parent class isn't used directy in the game, but instead provides
the basic functions that each state will need to implement themselves, and lets
the StateManager not care which state is currently on top of the stack. The MenuState
currently has a blue background and a placeholder button. The input handling function
only looks for mouse click within the parameters of the drawn sprite. The PlayState's
input handling fucntion instead check if the arrow keys are pressed. I haven't implemented
other states yet, but this is the general way they work. 

For textures, I've created a TextureManager. When a texture is needed to be loaded in a
state, the TextureManager takes a string, image file, and coordinates. It then takes the
resulting slice of the image file and add it to a std::map with the string as its id.
So when applying a texture, it looks something like

.. code-block:: c++

	playerSprite.setTexture(this->textureManager.getRef("right"));

The 'right' reference then returns the corresponding texture. This makes it 
really easy to have multiple textures that you can apply to a single sprite,
or to resuse a texture across mutliple sprites.

Unfortunately, this doesn't work great for animation. I'm currently in the process of 
writing the animation componenet. Once that is done, I hope to work on making events easier
to handle, rather than a big case statement looking for certain keys to be pressed. Until
next time!

	

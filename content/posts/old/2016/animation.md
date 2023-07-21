---
title: "Animation"
date: 2016-12-19
---
An animation handler is decently hard to write, especially when working
with objects instead of directly with sprites, so I opted to use the
Thor library. It has some great tools and tutorials. I think I\'ll also
use the action handling component of Thor in the future, but for now
I\'m just using the Animation component.

Before this, I manually moved the sprite\'s position every time I
pressed an arrow key. It looked something like

```
case sf::Event::KeyPressed:
    {
    if(sf::Keyboard::isKeyPressed(sf::Keyboard::Down)){
        if(y < 600)
            y += 5;
        playerSprite.setTexture(this->textureManager.getRef("down"));
    }

    ...(add other directions here)

}

playerSprite.setPosition(x, y);
```

As you can see, there is a lot that can go wrong here, and animation
without some sort of counter and change to how I handled textures was
going to be hard and tedious. But Thor\'s animation makes this much
easier. First you load the animations

```
Thor::FrameAnimation playerDown;
Thor::Animator animator;

loadAnimations() {
        playerDown.addFrame(1.f, sf::IntRect(0, 0, 400, 600));
    playerDown.addFrame(1.f, sf::IntRect(400, 0, 400 ,600));
        playerDown.addFrame(1.f, sf::IntRect(800, 0, 400, 600));
    playerDown.addFrame(1.f, sf::IntRect(1200, 0, 400, 600));
    animator.addAnimation("down", playerDown, sf::seconds(1.f));
}
```

We use an animator from Thor to keep track of all the animations we
need, with a reference by a string similar to how the texture manager
works, and a duration. Now our input handling block will play the
animation

```
case sf::Event::KeyPressed:
    {
        if(sf::Keyboard::isKeyPressed(sf::Keyboard::Down)){
            if(y < 600)
                y += 5;
            animator.playAnimation("down");
        }

        ...(add other directions here)

    }

    playerSprite.setPosition(x, y);
animator.update(clock.restart());
animator.animate(playerSprite);
```

And that\'s all there is to get the animations I need for player
movement as of now. Once we load the frames we want played and ensure
the clock gets restarted, we just need to set the animation we want, and
tell the animator to handle it, and Thor takes care of it all for us.
This is essentially what I wanted my animation handler to do, but Thor
did it much more elegantly and efficiently than I could.

After adding this in, I saw a glaring flaw in the input handling:
manually manipulating the sprite position does not scale. Time to
implement an entity-component system.

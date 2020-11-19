Travis and SFML
===============



.. author:: Taylor Fahlman
.. categories:: Gamedev
.. tags:: gamedev devlog game dev sfml c++ ci travis build
.. comments::

I currently work at the `Open Source Lab <https://osuosl.org>`_ as a Student System Admin, and 
will soon be interning on the Infrastructure team at CoreOS_ . So I like automating
things, especially testing and building. One of the more annoying things about using
a framework like SFML is that there is not a lot of documentation on testing them. Don't
get me wrong, I'm really loving SFML and its community, especially the IRC channel. But in
asking if anyone there used anything like Travis to automate their builds, there were only
a few that did, and even then, it was all hacked together and not easily replicable.

I want to share my working Travis config for my SFML project so that anyone else out there could
have at least a starting point. 

.. code-block:: yaml

	language: cpp
	dist: trusty
	sudo: required
	compiler:
	  - gcc

	before_script:
	  - wget https://www.sfml-dev.org/files/SFML-2.3.2-linux-gcc-64-bit.tar.gz -O /tmp/sfml.tar.gz
	  - tar -xvf /tmp/sfml.tar.gz
	  - sudo cp -r SFML-2.3.2/* /usr/
	  - wget http://www.bromeon.ch/libraries/thor/download/v2.0/thor-v2.0-linux64-make.tar.gz -O /tmp/thor.tar.gz
	  - tar -xvf /tmp/thor.tar.gz
	  - sudo cp -r thor-v2.0-linux64-make/* /usr/
	  - sudo apt-get install -y libjpeg62-dev libsndfile1-dev libglew1.5 libglew1.5-dev libfreetype6 libjpeg-turbo8 libjpeg8 libopenal-data libopenal1  libxrandr2 libxrender1 libsoil1 libxcb-image0 libxcb-randr0 libudev1 
	  - sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
	  - sudo apt-get update
	  - sudo apt-get install g++-4.9
	  - cd src

	script: make travis

So lets break this down a little.

.. code-block:: yaml

	laguage: cpp
	dist: trusty
	sudo: required
	compiler:
	  - gcc

The language is CPP, assuming that's what you're using for SFML. The distro is trusty, because there are a few
packages that don't exist or work properly on 12.04 (default for travis) that we need. Sudo is required due
to some commands you'll see in the next block, and I'm using gcc, (well, really g++). Nothing there too
out of the ordinary.

.. code-block:: yaml

	before_script:
	  - wget https://www.sfml-dev.org/files/SFML-2.3.2-linux-gcc-64-bit.tar.gz -O /tmp/sfml.tar.gz
	  - tar -xvf /tmp/sfml.tar.gz
	  - sudo cp -r SFML-2.3.2/* /usr/
	  - wget http://www.bromeon.ch/libraries/thor/download/v2.0/thor-v2.0-linux64-make.tar.gz -O /tmp/thor.tar.gz
	  - tar -xvf /tmp/thor.tar.gz
	  - sudo cp -r thor-v2.0-linux64-make/* /usr/

Ubuntu does have an SFML package, but its too low of a version for me, so I manually install the version I want. I'm also using
Thor, a library built for SFML, so I also manually install that. This is the method I recommend for installing the SFML binaries
because it ensures exactly what version you'll get. You can also compile it yourself if you really want to, but I won't cover that
here.

.. code-block:: yaml

 	  - sudo apt-get install -y libjpeg62-dev libsndfile1-dev libglew1.5 libglew1.5-dev libfreetype6 libjpeg-turbo8 libjpeg8 libopenal-data libopenal1  libxrandr2 libxrender1 libsoil1 libxcb-image0 libxcb-randr0 libudev1 
	  - sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
	  - sudo apt-get update
	  - sudo apt-get install g++-4.9

First, we install all the dependencies for SFML and Thor. libudev1 and the xcb packages gave me a lot of trouble, which is why I tried using
trusty. So here's where I banged my head against the wall for a while. I kept getting errors about udev and undefined references on travis that 
I wasn't getting locally. Turns out, even on trusty, the default g++ is 4.8, but 4.9 or greater is needed for udev to work (I guess?).
Installing 4.9 fixed everything and my project compiled cleanly.

.. code-block:: yaml

	script: make travis

Now, just run your make script or whatever your equivalent is. I made a separate target that specifically uses g++-4.9, but other
than that, the target is identical to my default target.

Hopefully, this will help someone out there who wants to automate their SFML build.

.. _CoreOS: https://coreos.com/

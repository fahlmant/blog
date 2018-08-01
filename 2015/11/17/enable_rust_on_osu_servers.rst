Enable Rust on OSU Servers
==========================



.. author:: Taylor
.. categories:: none
.. tags:: rust, osu, oregon state, bash
.. comments::

Rust was recently installed on flip{1-3} at Oregon State. In order to use it, you must first add the path to the library to your LD_LIBRARY_PATH::

	export LD_LIBRARY_PATH=/usr/local/apps/rust/lib:$LD_LIBRARY_PATH
	
Now add the Rust binary directory path to your $PATH. This is needed for cargo to work::

	export PATH=$PATH:/usr/local/apps/rust-1.4.0/bin/

Now you just need to alias rustc and cargo to the full paths::
	
	alias rustc="/usr/local/apps/rust-1.4.0/bin/rustc"
	alias cargo="/usr/local/apps/rust-1.4.0/bin/cargo"

Happy Rusting

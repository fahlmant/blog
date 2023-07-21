---
title: "Rust Syntax Highlighting in Vim"
date: 2015-11-20
---

I use Vim on a daily basis, and now that I\'m learning Rust, I wanted
syntax highlighting. There are some great tools out there, but the
instructions to get them to work are broken up a bit. Here are the best
instructions I found in one place.

First, you\'ll need [Vundle](https://github.com/VundleVim/Vundle.vim) if
you don\'t have it. Vundle is a great tool for Vim, managing plugins and
making them configurable in your `.vimrc`.

Make sure that your `.vim` directory has a `bundle` subdirectory. Then
clone the Vundle repo there:

    git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim

Now you can install and configure pluins within your `.vimrc`. But
first, we need a little setup.

This little snippet needs to go at the top of your `.vimrc`. You have to
make sure that filetype is set to off and that Vundle is running before
we can load the Rust plugin.:

    set nocompatible
    filetype off

    set rtp+=~/.vim/bundle/Vundle.vim
    call vundle#begin()

    Plugin 'VundleVim/Vundle.vim'

    call vundle#end()
    filetype plugin indent on

Awesome, so now Vundle starts up, loads itself, and then it ends. After
this snippet, put whatever other setting for Vim you want. Run this from
the command line to ensure all is working well:

    vim +PluginInstall +qall

Now to get the Rust highlighting. I\'m using
[this](https://github.com/wting/rust.vim) repo, which has worked pretty
great for me so far. All you need to do to use it is to add this line
before the call to `vundle#end`:

    Plugin 'wting/rust.vim'

Now run the above command again to make sure everything works:

    vim +PluginInstall +qall

And now you should have beautiful Rust syntax highlighting!

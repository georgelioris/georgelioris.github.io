---
title: "Improving productivity in the terminal with pipes"
date: 2020-02-09
image: "image.jpg"
description: "Make life in the terminal easier with Unix tools 🍏🛠🐧."
---

If you do any kind of development, the terminal is probably part of your
workflow, and although some tasks are relatively painless out of the box - like
managing software packages - others can take time to adjust to. But doing
things in the terminal isn't supposed to be hard, on the contrary, it's
liberating, it gets everything out of the way so you can interact with the
computer in the most direct way. By using _pipes_ you can hopefully remove some
friction and make the experience more enjoyable. Even if the majority
of your work is done outside of the terminal, you can still reap the benefits
of utilizing command line tools to speed up common tasks. Without any shell
scripting knowledge, you can get a lot of functionality out of combining
commands with preexisting tools on your system.

---
### Unix philosophy

Unix tools are a very powerful set of low level programs that follow the [Unix philosophy][1],
and provide you with  very powerful abstractions. In practice this
translates to a couple of things:
- Each program does one thing really well
- The output of one program can be the input of another program

A shell allows the use of __stdout__ as __stdin__ with the use of the pipe `|` operator.

>Unix programs use [Standard streams][2],
>but to simplify things we will refer to ___stdout___ as what the program outputs
>and ___stdin___ to the data the program on right side of the pipe operator receives.

Some of those tools are the familiar `cd`, `cat`, `grep`, `echo`, `mkdir` etc, but there are many more,
and since most cli tools follow the same logic we have plenty of options. If you are aware of the pipe
operator, it's certain you have encountered the following

```bash
cat file | grep pattern
```

This is quite underwhelming and also suboptimal. Using `cat` here is redundant,
since `grep` can take file/s as argument/s and while it's fine if it happens in
your terminal, it should be avoided when writing scripts.

While getting a stream of data and piping it into a `grep` is pretty straight
forward, it's not very exciting. By utilizing _pipes_, you can do more with tools
you already use, with very little overhead.  Some more interesting common use
cases for _pipes_ are using interfaces to make dynamic selections, executing
conditionally, feeding data to commands that don't read from ___stdin___.

---
### Leveraging pipes

Navigating to a project's directory is a very common operation, and while tab
completion is great, we can make it virtually effortless by using a fuzzy
finder. Our goal is to create a fuzzy matched list with our project directories
to select from.

Let's assume all our projects are located at inside the *code* directory of our home folder.

First we need to generate a list of our directory paths.

**du** - summarizes disk usage of the set of FILEs, recursively for directories

Without the `-a` flag it will only list directories. We make sure to exclude
the *node_modules* and hidden folders (such as .git) to avoid flooding our list
with unwanted results, this also improves the speed of our command.


```console
$ du ~/code --exclude={".*","node_*"}

5584 /home/user/code/Project1/
12 /home/user/code/Project1/src
4980 /home/user/code/Project2/
4    /home/user/code/Project2/src
...
```

>For lengthier ignore patterns you can provide a *.ignore* file with the `--exclude-from="path/to/.ignore"` option.

Since we only need the paths we need to format our data.

**cut** - removes sections from each line of files

with the `-f2-` option it will print only the second field of each line, so just the directory paths.

```console
$ du ~/code --exclude={".*","node_*"} | cut -f2-

/home/user/code/Project1/
/home/user/code/Project1/src
/home/user/code/Project2/
/home/user/code/Project2/src
...
```

We could use that data as is but we can make it look cleaner by removing the _$HOME_ path.

**sed** - stream editor for filtering and transforming text

For any operations on strings this is quite handy, allowing you to perform even
advanced *regex* with the `-E` flag.

```console
$ du ~/code --exclude={".*","node_*",misc,public} | cut -f2- | sed "s|$HOME/||"

code/Project1/
code/Project1/src
code/Project2/
code/Project2/src
...
```

Now that our data is ready we need a menu to select from.

```bash
du ~/code --exclude={".*","node_*"} | cut -f2- | sed "s|$HOME/||"| fzf +m
```
**[fzf][fzf]** - a command-line fuzzy finder

This will provide us the fuzzy list to select a directory from. Any selection we make will
get printed to ___stdout___, ready for our next command to read.
The `+m` option disables multiline selection.

To change directory we need to give our selection to `cd`, but before we do that we need to prepend
the _$HOME_ path.

```bash
du ~/code --exclude={".*","node_*",misc,public} | cut -f2- | sed "s|$HOME/||" | fzf +m | sed "s|^|$HOME/|"
```
Unlike the previous commands `cd` cannot read from ___stdin___ (we'll get a bit into why later) so we will
use command substitution, replacing the _dir_ name with our pipe. Anything
inside `"$(...)" `(or `` `...` ``) will get evaluated (executed) first, and `cd` will run after.

```bash
cd "$(du ~/code --exclude={".*","node_*",misc,public} | cut -f2- | sed "s|$HOME/||" | fzf +m | sed "s|^|$HOME/|")"
```
Since this is intended to be used frequently we can extract that logic to a
function inside our shell's .rc file (.bashrc/.zshrc)

```bash
cf() { cd "$(du ~/code --exclude={".*","node_*",misc,public} | cut -f2- | sed "s|$HOME/||" | fzf +m | sed "s|^|$HOME/|")" ;}
```
**cf** - is the name of the function and how we access it from the shell

![Function demonstration](./demo.gif "Function demonstration")

---

Following the same idea let's create a similar pipe for changing git branches.

Fist we need to check if we are in a valid git directory.

This can be achieved executing our pipe only if `git branch` (or  `git status`)
succeeds.  Since we don't care about the actual output of that command, we will
discard it by redirecting it to  `/dev/null` In case of an error, the message
still gets printed since we only redirected ___stdout___ not ___stderr___.

>To discard the error message as well, use `command > /dev/null 2>&1`

```bash
git branch > /dev/null && git branch
```

To make the output of git branch usable we need to treat individual non-empty
lines as input arguments and print that to ___stdout___ for our next command to
read. `xargs -L 1` takes care of the first part and `echo` of the latter.

**xargs** - build and execute command lines from standard input

Some commands (like `echo`) cannot read from ___stdin___, in that case `xargs`
will read from ___stdin___ and execute the command we give it with that input.
>The reason we did not use `xargs` for `cd`, is because `xargs` runs commands in a
>subprocess and changes in a subprocess do not get propagated to the parent
>process.

```console
$ git branch > /dev/null && git branch | xargs -L 1 echo

* master
feature
testing
```

Now we can supply our interface as before. Instead of `fzf` we could use any
equivalent tool of our choice, even a graphical one like **[dmenu][dmenu]** or
**[rofi][rofi]**.

```bash
git branch > /dev/null && git branch | xargs -L 1 echo | fzf --reverse
```

You may have noticed that the asterisk is visible in our interface. That's because
it's a useful visual indicator when changing branches. To avoid any trouble, we will
remove it before calling `git checkout`.

```bash
git branch > /dev/null && git branch | xargs -L 1 echo | fzf --reverse | sed "s/.* //"
```

Finally we need to call `git checkout` on our selection, Using `xargs` once again.
The `-r` option will prevent execution on empty input.

```bash
git branch > /dev/null && git branch | xargs -L 1 echo | fzf --reverse | sed "s/.* //" | xargs -r git checkout
```
---
### POSIX Shell syntax

Instead of a function you may also put your pipe in a script file. When writing
scripts that are intended to be run on other systems, you may want to avoid
[bashisms][3]. For portability, make it POSIX compliant as all Unices have at
least one shell called **sh** (usually at _/bin/sh_) that can interpret that syntax.
If your script does depend on bash make sure to use the appropriate shebang
(`#!/usr/bin/env bash`).  You can lint your scripts with [ shellcheck
][shellcheck] which also provides useful suggestions.

---
### Which is faster?

There are multiple ways that achieve the same result but some are more optimal
than others.  Usually commands take milliseconds to execute so it's hard to
tell which iteration is faster. It can also be hard to determine how adding
another command to your pipe affects performance. A quick way to check the
speed of a command is by running it multiple times and measuring the total time
to completion.

```console
$ time (
for x in $(seq 100 ); do
command > /dev/null
done )

7.88s user 3.26s system 120% cpu 9.266 total
```

   > Redirecting output to `/dev/null` so we don't flood the terminal

---
### More tools

The above examples only scratch the surface of what possible. The demonstrated model,
hopefully provides some ideas on how you can integrate your tools with other commands.
There are plenty more common operations you may want for your workflow. Below I've compiled
a short list of programs you may find interesting.

- `awk` for more complicated field selections and pattern scanning
- `rsync` for remote and local file copying
- [ curl ][curl] for transferring data with URLs
- [ ripgrep ][ripgrep] recursively search for a pattern in files of a directory
- [ fd ][fd] to search for directories and files
- [ bat ][bat] cat but with syntax highlighting
- [ entr ][entr] to run arbitrary commands when files change
- [yank][yank] to selectively copy terminal output to clipboard
- [ffmpeg][ffmpeg] video converter
- [mpv][mpv] media player than can read video data from ___stdin___ and URLs
- [imagemagick][imagemagick] edit, crate or modify images




[1]: https://en.wikipedia.org/wiki/Unix_philosophy
[2]: https://en.wikipedia.org/wiki/Standard_streams
[3]: https://mywiki.wooledge.org/Bashism
[fzf]: https://github.com/junegunn/fzf
[dmenu]: https://tools.suckless.org/dmenu/
[rofi]: https://github.com/davatorium/rofi
[ripgrep]: https://github.com/BurntSushi/ripgrep
[fd]: https://github.com/sharkdp/fd
[bat]: https://github.com/sharkdp/bat
[shellcheck]: https://github.com/koalaman/shellcheck
[curl]: https://curl.haxx.se/
[entr]: http://eradman.com/entrproject/
[ffmpeg]: https://www.ffmpeg.org/
[mpv]: https://mpv.io/
[imagemagick]: https://imagemagick.org/
[yank]: https://github.com/mptre/yank

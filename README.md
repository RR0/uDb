# \*U* database reader

This is a [node](https://nodejs.org) application to read binary data file of the now-defunct the [\*U* database](http://web.archive.org/web/20060701162044/http://www.larryhatch.net/).

## Setup

You need to have [node](https://nodejs.org) 7.6.0 or later installed on your computer.

## Usage

    node udb.js [<sources file>] [<data file>]

will look for `usources.txt` as a source file, and `U.RND` as a data file in the current directory.
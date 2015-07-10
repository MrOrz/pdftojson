pdftojson
=========

[![Build Status](https://travis-ci.org/MrOrz/pdftojson.svg)](https://travis-ci.org/MrOrz/pdftojson) [![Coverage Status](https://coveralls.io/repos/MrOrz/pdftojson/badge.svg?branch=master&service=github)](https://coveralls.io/github/MrOrz/pdftojson?branch=master)

**pdftojson** is a `pdftotext` wrapper that generates JSON with bounding box data. It takes care of overlapping duplicated characters, which often exists in MS-Word-generated PDF files with floating images and text.

Install
-------

pdftojson uses [`pdftotext`](http://www.foolabs.com/xpdf/home.html). Please make sure `pdftotext` is available in `PATH`.


Usage
-----

pdftojson is available as a command line tool and a nodejs library.

### CLI

```
# outputs some.json
pdftojson some.pdf

# converts page 3 ~ 6 of some.pdf and outputs to some.json
pdftojson -c "-f 3 -l 6" some.pdf
```

### NodeJS Library

The library exposes a single function that takes the name of a PDF file
and returns a promise that resolves to .

```
import pdftojson from 'pdftojson';

pdftojson("./some.pdf").then((output) => {
  // output is a Javascript object.
});
```

### Output format

All numeric values are in `pt`.

```
[
    { #: Page
        width: (Number) page width
        height: (Number) page height
        words: [
            {
                text: (String) the text enclosed in the bounding box

                width: (Number) bounding box width
                height: (Number) bounding box height

                # All coordinates calculated from top-left corner of the page
                xMin: (Number) left edge of the bounding box
                xMax: (Number) right edge of the bounding box
                yMin: (Number) top edge of the bounding box
                yMax: (Number) bottom edge of the bounding box
            }, ...
        ]
    }

]
```

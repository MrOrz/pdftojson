pdftojson
=========

[![Build Status](https://travis-ci.org/MrOrz/pdftojson.svg)](https://travis-ci.org/MrOrz/pdftojson) [![Coverage Status](https://coveralls.io/repos/MrOrz/pdftojson/badge.svg?branch=master&service=github)](https://coveralls.io/github/MrOrz/pdftojson?branch=master)

**pdftojson** is a `pdftotext` wrapper that generates JSON with bounding box data. It takes care of overlapping duplicated characters, which often exists in MS-Word-generated PDF files with floating images and text.

Why a wrapper?
------------------------------

Given this PDF file:

<img src="http://i.imgur.com/KUEN9nL.png" style="border: 1px solid #ccc" alt="A PDF">

`pdftotext -bbox <myFile>` would generate this:

```html
...
<word xMin="103.320000" yMin="547.355700" xMax="152.368008" yMax="561.321720">(6)綠線</word>
<word xMin="155.880000" yMin="547.355700" xMax="176.846541" yMax="561.321720">G01</word>
<word xMin="155.880000" yMin="547.355700" xMax="162.867200" yMax="561.321720">G</word>
<word xMin="180.300000" yMin="547.355700" xMax="222.295867" yMax="561.321720">站延伸</word>
<word xMin="208.080000" yMin="547.355700" xMax="264.053062" yMax="561.321720">伸至大溪</word>
<word xMin="264.480000" yMin="547.355700" xMax="334.420485" yMax="561.321720">、龍潭先進</word>
<word xMin="320.340000" yMin="547.355700" xMax="348.294390" yMax="561.321720">進公</word>
<word xMin="124.680000" yMin="572.375700" xMax="166.675867" yMax="586.341720">共運輸</word>
<word xMin="152.700000" yMin="572.375700" xMax="222.644667" yMax="586.341720">輸系統發展</word>
<word xMin="208.440000" yMin="572.375700" xMax="278.395867" yMax="586.341720">展委託可行</word>
<word xMin="264 .840000" yMin="572.375700" xMax="320.813062" yMax="586.341720">行性研究</word>
...
```

Note that some words are overlapping and duplicate. PDF layout engines sometimes generate these quirks when imags and text are mixed in a page.

On the other hand, `pdftojson <myFile>` generates this:

```js
...
{
    "xMin": 103.2,
    "xMax": 348.29439,
    "yMin": 547.3557,
    "yMax": 561.32172,
    "text": "(6)綠線 G01 站延伸至大溪、龍潭先進公"
},
{
    "xMin": 124.68,
    "xMax": 320.813062,
    "yMin": 572.3757,
    "yMax": 586.34172,
    "text": "共運輸系統發展委託可行性研究"
}
...
```


Install
-------

```
$ npm install pdftojson
```

`pdftojson` uses [`pdftotext`](http://www.foolabs.com/xpdf/home.html). Please make sure `pdftotext` is available in `PATH`.


Usage
-----

pdftojson is available as a command line tool and a nodejs library.

### CLI

```
# outputs some.json
$ pdftojson some.pdf

# converts page 3 ~ 6 of some.pdf and outputs to some.json
$ pdftojson -c "-f 3 -l 6" some.pdf
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

         # All coordinates calculated from top-left corner of the page
         xMin: (Number) left edge of the bounding box
         xMax: (Number) right edge of the bounding box
         yMin: (Number) top edge of the bounding box
         yMax: (Number) bottom edge of the bounding box
       }, ...
    ]
  }, ...
]
```

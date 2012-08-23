# icebox.js - A simple object serialization library

icebox.js serializes object structures, which may be circular, into
non-circular structures that can be stored or transmitted.  When
deserializating such structures, icebox.js re-establish constructor
associations and circular links.

## Installation

    $ npm install icebox

## Usage

Load the module

```javascript
var icebox = require('icebox');
```

Freeze some data:

```javascript
var frozen = icebox.freeze(data);
```

The frozen variable now contains a non-circular, annotated object tree
that can be converted to JSON, stored in files or transmitted over a
network connection.

Thaw the frozen representation to yield the same circular structure:

```javascript
var data = icebox.thaw(frozen);
```



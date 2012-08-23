# icebox.js - A simple object serialization library

icebox.js serializes object structures, which may be circular, into
non-circular structures that can be stored or transmitted.  When
deserializating such structures, icebox.js re-establish constructor
associations and circular links.

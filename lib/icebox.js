function ieConstructorName(constructor) { 
   var funcNameRegex = /function ([^ ]+) \(/;
   var results = (funcNameRegex).exec(constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
}

function thaw(object, prototypeMap) {
    var objectsThawed = [];

    if (prototypeMap && prototypeMap.length) {
        // convert to hash map
        var newPrototypeMap = {};
        prototypeMap.forEach(function(constructor) {
            var name = constructor.name || ieConstructorName(constructor);
            newPrototypeMap[name] = constructor;
        });
        prototypeMap = newPrototypeMap;
    }

    function thawTree(object) {
        if (object && (typeof object == 'object')) {
            if (object._icebox_ref !== undefined) {
                if (objectsThawed[object._icebox_ref]) {
                    return objectsThawed[object._icebox_ref];
                } else {
                    throw "invalid reference to id " + object._icebox_ref;
                }
            } else {
                var thawed;
                if (object._icebox_constructorName == 'Date') {
                    thawed = new Date(object._isoString);
                } else {
                    if (object.hasOwnProperty('_icebox_constructorName')) {
                        var constructor = prototypeMap[object._icebox_constructorName];
                        if (constructor) {
                            thawed = Object.create(constructor['prototype']);
                        } else {
                            console.log('no prototype for ' + object._icebox_constructorName);
                            thawed = {};
                        }
                    } else {
                        thawed = (typeof object.length == 'undefined') ? {} : [];
                    }
                    if (object.hasOwnProperty('_icebox_id')) {
                        objectsThawed[object._icebox_id] = thawed;
                    }
                    for (var prop in object) {
                        if (object.hasOwnProperty(prop)
                            && prop != '_icebox_constructorName'
                            && prop != '_icebox_id') {
                            thawed[prop] = thawTree(object[prop]);
                        }
                    }
                }
                if (thawed.thawed) {
                    thawed.thawed();
                }
                return thawed;
            }
        } else {
            return object;
        }
    }

    return thawTree(object);
}

function freeze(object) {
    var objectsFrozen = [];
    var id = 0;

    function freezeObject(object) {
        object._icebox_frozen = (typeof object.length == 'undefined') ? {} : [];
        Object.defineProperty(object, '_icebox_frozen', { enumerable: false });
        objectsFrozen[id] = object;
        object._icebox_frozen._icebox_id = id;
        id++;
        return object._icebox_frozen;
    }

    function freezeTree(object) {
        if (object && (typeof object == 'object')) {
            if (object._icebox_frozen) {
                return { _icebox_ref: object._icebox_frozen._icebox_id };
            } else {
                var frozen = freezeObject(object);
                if (!object.constructor.name.match(/^(Array|Object)$/)) {
                    frozen._icebox_constructorName = object.constructor.name;
                }
                if (object.constructor.name == 'Date') {
                    frozen._isoString = object.toISOString();
                } else {
                    for (var prop in object) {
                        if (object.hasOwnProperty(prop) && prop != '_icebox_constructorName') {
                            frozen[prop] = freezeTree(object[prop]);
                        }
                    }
                }
                return frozen;
            }
        } else {
            return object;
        }
    }
    var after = freezeTree(object);
    for (var i in objectsFrozen) {
        delete objectsFrozen[i]._icebox_frozen;
    }
    return after;
}

if (typeof exports == 'object') {
    exports.freeze = freeze;
    exports.thaw = thaw;
}

var cloneObj = function(o) {
    if (o instanceof Array) {
        var n = [];
        for (var i = 0; i < o.length; ++i) {
            n[i] = cloneObj(o[i]);
        }
        return n;

    } else if (o instanceof Object) {
        var n = {}
        for (var i in o) {
            n[i] = cloneObj(o[i]);
        }
        return n;
    } else {
        return o;
    }
}

export {cloneObj}
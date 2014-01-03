
/**
 * Must change objects by its id.
 * @param entity is the object with values to unpupulate
 * @param paths String/Array with path/s to unpupulate.
 * 
 * values referenced by path are eather objects or arrays
 */
exports.unpopulate = function(entity, paths) {
    if ( !paths ) return;

    if ( !(paths instanceof Array) ) {
        paths = [paths];
    }

    for ( var i=0; i<paths.length; i++) {
        var path = paths[i];
        if ( entity[path] instanceof Array ) {
            for ( var j=0; j<entity[path].length; j++ ) {
                entity[path][j] = entity[path][j]._id;
            }
        } else {
            if ( entity[path] ) {
                entity[path] = entity[path]._id;    
            }
        }
    }
};


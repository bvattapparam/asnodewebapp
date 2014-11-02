'use strict';

exports.tryRequire = function tryRequire(name) {
    try {
        return require(name);
    } catch (err) {
        console.log('warning: failed loading ' + name);
    }
    return undefined;
};
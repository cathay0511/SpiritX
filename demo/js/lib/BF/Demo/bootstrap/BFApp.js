define(function(require, exports, module) {
    var BFBase = require('bf/BFBase/BFBase');

    /**
     *
     * @param container
     * @param model = {title: '', brief: ''}
     * @param tpl
     * @constructor
     */
    var BFApp = function () {
        var self = this.__proto__ = new BFBase();

        self.run = function () {
            var defer = $.Deferred();

            defer.resolve(self);

            return defer;
        }
    }

    module.exports = BFApp;

});
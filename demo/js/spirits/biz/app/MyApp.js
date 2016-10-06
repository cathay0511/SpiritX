define(function(require, exports, module) {
    var BFBase = require('bf/BFBase/BFBase');

    /**
     *
     * @param container
     * @param model = {title: '', brief: ''}
     * @param tpl
     * @constructor
     */
    var MyApp = function () {
        var self = this.__proto__ = new BFBase();

        self.profile = {
            utils: {
                env: {}
            },
            global: {}
        }

        self.run = function () {
            var defer = $.Deferred();
            defer.resolve(self);
            return defer;
        }

    }

    module.exports = MyApp;

});
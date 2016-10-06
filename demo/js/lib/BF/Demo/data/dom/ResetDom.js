define(function(require, exports, module) {
    var BFDom = require('bf/BFBase/BFDom');

    /**
     *
     * @param key
     * @param container
     * @param dom
     * @constructor
     */
    var TitleDom = function (key, container, dom) {
        var self = this.__proto__ = new BFDom(key, container, dom);

        self.profile.dom.bind('click', function () {
            self.profile.container.reset();
        });
    }

    module.exports = TitleDom;

});
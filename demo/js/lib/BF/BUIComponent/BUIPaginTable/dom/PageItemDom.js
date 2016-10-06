define(function(require, exports, module) {
    var BFDom = require('bf/BFBase/BFDom');

    /**
     *
     * @param container
     * @param model
     * @param tpl
     * @constructor
     */
    var PageItemDom = function (key, container, dom) {
        this.__proto__ = new BFDom(key, container, dom);
        var self = this.profile.instance = this;

        self.profile.dom.bind('click', function () {
            self.profile.container.refresh($(this).attr('page'));
        });
    }

    module.exports = PageItemDom;

});
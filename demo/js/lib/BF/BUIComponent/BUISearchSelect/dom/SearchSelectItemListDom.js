define(function(require, exports, module) {
    var BFDom = require('bf/BFBase/BFDom');

    /**
     *
     * @param key
     * @param container
     * @param dom
     * @constructor
     */
    var SearchSelectItemListDom = function (key, container, dom) {
        this.__proto__ = new BFDom(key, container, dom);
        var self = this.profile.instance = this;

        self.hide = function () {
            self.profile.dom.css({display: 'none'});
        }

        self.show = function () {
            self.profile.dom.css({display: 'block'});
        }
    }

    module.exports = SearchSelectItemListDom;

});
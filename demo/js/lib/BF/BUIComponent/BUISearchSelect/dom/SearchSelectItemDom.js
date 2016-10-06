define(function(require, exports, module) {
    var BFDom = require('bf/BFBase/BFDom');

    /**
     *
     * @param key
     * @param container
     * @param dom
     * @constructor
     */
    var SearchSelectItemDom = function (key, container, dom) {
        this.__proto__ = new BFDom(key, container, dom);
        var self = this.profile.instance = this;

        self.profile.dom.bind('mouseenter', function () {
            self.profile.container.pickingItem(true);
        });

        self.profile.dom.bind('mouseleave', function () {
            self.profile.container.pickingItem(false);
        });

        self.profile.dom.bind('click', function () {
            self.profile.container.pickItem($(this).attr('itemId'), $(this).text());
        });
    }

    module.exports = SearchSelectItemDom;

});
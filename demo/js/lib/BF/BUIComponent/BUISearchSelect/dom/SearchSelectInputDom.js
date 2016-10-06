define(function(require, exports, module) {
    var BFDom = require('bf/BFBase/BFDom');

    /**
     *
     * @param key
     * @param container
     * @param dom
     * @constructor
     */
    var SearchSelectInputDom = function (key, container, dom) {
        this.__proto__ = new BFDom(key, container, dom);
        var self = this.profile.instance = this;

        var blur = function () {
            self.profile.container.hideSearchSelectList();
        }

        self.profile.dom.bind('input propertychange', function () {
            self.profile.container.refreshInput();
        });

        self.profile.dom.bind('focus', function () {
            console.log(self.profile.container);
            self.profile.container.showSearchSelectList();
        });

        self.profile.dom.bind('blur', blur);

        self.blur = function (flag) {
            if (flag) {
                self.profile.dom.bind('blur', blur);
            }
            else {
                self.profile.dom.unbind('blur', blur);
            }
        }

        self.focus = function () {
            self.profile.dom.focus();
        }
    }

    module.exports = SearchSelectInputDom;

});
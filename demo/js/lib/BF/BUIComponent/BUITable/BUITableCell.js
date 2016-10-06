define(function(require, exports, module) {
    var BFView = require('bf/BFBase/BFView');
    var __tpl__ = require('bf/BUIComponent/BUITable/BUITableCell.html');

    /**
     *
     * @param container
     * @param model
     * @param tpl
     * @constructor
     */
    var BUITableCell = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.profile.container.append(self.profile.tpl);
            self.update(self.profile.model);
        }

        /**
         *
         * @param val = string || {
         *     key: string,
         *     class: object,
         *     model: {}
         * }
         */
        self.update = function (val) {
            self.getDom().html('');
            if (val !== null && typeof (val) === 'object') {
                self.removeSpirit(val.key);
                var container = self.getDom();
                var spirit = new val.class(container, val.model);
                spirit.setKey(val.key);
                spirit.render();
                self.addSpirit(val.key, spirit);
            }
            else {
                self.getDom().html(val);
            }

            self.profile.model = val;
        }
    }

    module.exports = BUITableCell;

});
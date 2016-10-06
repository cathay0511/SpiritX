define(function(require, exports, module) {
    var BFView = require('bf/BFBase/BFView');
    var BFDom = require('bf/BFBase/BFDom');
    var BFUtil = require('bf/BFUtil/BFUtil');
    var __tpl__ = require('widget/MoreOpMenu/MoreOpMenu.html');
    var tplMoreOpMenuItem = require('widget/MoreOpMenu/MoreOpMenuItem.html');

    /**
     * dom
     */
    /**
     *
     * @param container
     * @param model
     * @param tpl
     * @constructor
     */
    var MoreOpMenuItemDom = function (key, container, dom) {
        var self = this.__proto__ = new BFDom(key, container, dom);

        self.getDom().click(function () {
            self.getContainer().click(self);
            event.stopPropagation();
        });
    }

    /**
     *
     * @param container
     * @param model = [
     *      {
     *          key: string,
     *          title: string,
     *      }
     * ]
     * @param tpl
     * @constructor
     */
    var MoreOpMenu = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.__proto__.render();
            self.renderItem(self.profile.model.itemList);

        }

        self.renderItem = function (itemList) {
            for (var i = 0; i < itemList.length; i++) {

                var item = itemList[i];
                var tempTpl = BFUtil.replaceTpl(tplMoreOpMenuItem, {domKey: item.key});
                self.getDom().append(tempTpl);

                var dom   = self.findDom('bf-dom', item.key);
                var key   = dom.attr('bf-dom');
                var bfDom = new MoreOpMenuItemDom(key, self.getInstance(), dom);
                bfDom.setAttr('html', item.title);
                self.addDom(item.key, bfDom);
            }
        }

        self.click = function (dom) {
            if (self.getModel().delegate && typeof (self.getModel().delegate.onMoreMenuClick) === 'function') {
                self.getModel().delegate.onMoreMenuClick(self, dom);
            }
        }

        self.show = function () {
            self.getDom().css({display: 'block'});
            self.getModel().status = 1; //opening
        }

        self.hide = function () {
            self.getDom().css({display: 'none'});
        }

        $('body').click(function () {
            if (self.getModel().status !== 1) {
                self.hide();
            }
            self.getModel().status = 0;
        });
    }

    module.exports = MoreOpMenu;

});
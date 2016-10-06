define(function(require, exports, module) {
    var BFView = require('bf/BFBase/BFView');
    var BFDom = require('bf/BFBase/BFDom');
    var BFUtil = require('bf/BFUtil/BFUtil');
    var __tpl__ = require('widget/TableOpList/TableOpList.html');
    var tplOpItem = require('widget/TableOpList/TableOpItem.html');

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
    var MoreOpDom = function (key, container, dom) {
        var self = this.__proto__ = new BFDom(key, container, dom);

        self.getDom().click(function () {
            self.getContainer().openMoreOpMenu();
        });
    }

    var OpItemDom = function (key, container, dom) {
        var self = this.__proto__ = new BFDom(key, container, dom);

        self.getDom().click(function () {
            self.getContainer().onOpItemClick(self);
        });

        self.show = function () {
            self.getDom().css({display: 'inline-block'});
        }

        self.hide = function () {
            self.getDom().css({display: 'none'});
        }
    }

    /**
     * spirit
     */
    var MoreOpMenu = require('spirits/Widget/MoreOpMenu/MoreOpMenu');

    /**
     * 表格操作列
     * - 说明
     *      - 对于 onTableOpItemClick或onMoreMenuClick 的操作结果会改变对应表格行状态的情况，建议刷新表格行来进行 TableOpList 的更新
     *      - 如果操作需要额外的数据，可以考虑将表格行对象作为 model 的一个属性传递给本对象，代理方法直接访问即可
     *
     * - 接口
     *      - showOpItem(key)
     *      - hideOpItem(key)
     * - 代理
     *      - onTableOpItemClick(spirit, dom)
     *      - onMoreMenuClick(spirit, dom)
     *
     * @param container
     * @param model = {
     *       itemList: [
     *           {
     *               key: string,
     *               title: string,
     *               invisible: bool    // 可选
     *           }
     *       ],
     *       moreOpMenu: []             // 可选
     *   },
     * @param tpl
     * @constructor
     */
    var TableOpList = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.__proto__.render();
            self.renderItem(self.getModel().itemList);

            var dom   = self.findDom('bf-dom', 'moreOp');
            var key   = dom.attr('bf-dom');
            var bfDom = new MoreOpDom(key, self.getInstance(), dom);
            self.addDom('moreOp', bfDom);

            if (self.getModel().moreOpMenu) {
                var container = self.findDom('bf-container', 'MoreOpMenu');
                container.css({display: 'inline-block'});
                var model = {
                    delegate: self.getInstance(),
                    itemList: self.getModel().moreOpMenu
                }
                var moreOpMenu = new MoreOpMenu(container, model);
                moreOpMenu.setKey(self.getKey());
                moreOpMenu.render();
                self.addSpirit('moreOpMenu', moreOpMenu);
            }
        }

        self.renderItem = function (itemList) {
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i];
                var domKey = item.key ? item.key : 'opItem__' + i;
                var tempTpl = BFUtil.replaceTpl(tplOpItem, {domKey: domKey, title: item.title});
                self.findDom('bf-container', 'OpItem').append(tempTpl);

                var dom   = self.findDom('bf-dom', domKey);
                var key   = dom.attr('bf-dom');
                var bfDom = new OpItemDom(key, self.getInstance(), dom);
                if (item.invisible !== true) {
                    bfDom.show();
                }
                self.addDom(domKey, bfDom);
            }
        }

        self.openMoreOpMenu = function () {
            self.getSpirit('moreOpMenu').show();
        }

        self.onOpItemClick = function (dom) {
            if (self.getModel().delegate && typeof (self.getModel().delegate.onTableOpItemClick) === 'function') {
                self.getModel().delegate.onTableOpItemClick(self, dom);
            }
        }

        self.onMoreMenuClick = function (spirit, dom) {
            if (self.getModel().delegate && typeof (self.getModel().delegate.onMoreMenuClick) === 'function') {
                self.getModel().delegate.onMoreMenuClick(self, dom);
            }
        }

        self.showOpItem = function (key) {
            self.getSubDom(key).show();
        }

        self.hideOpItem = function (key) {
            self.getSubDom(key).hide();
        }
    }

    module.exports = TableOpList;

});
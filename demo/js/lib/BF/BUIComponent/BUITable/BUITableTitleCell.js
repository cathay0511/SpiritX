define(function(require, exports, module) {
    var BUITableCell = require('bf/BUIComponent/BUITable/BUITableCell');
    var BFDom = require('bf/BFBase/BFDom');
    var __tpl__ = require('bf/BUIComponent/BUITable/BUITableTitleCell.html');

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
    var TableTitleCellDom = function (key, container, dom) {
        var self = this.__proto__ = new BFDom(key, container, dom);

        self.setWidth = function (value) {
            self.getDom().css({width: value});
        }
    }

    var OrderByIconDom = function (key, container, dom) {
        var self = this.__proto__ = new BFDom(key, container, dom);

        var orderBy = function () {
            var orderByStatus = parseInt(self.getAttr('orderBy'));
            self.updateOrderByStatus(orderByStatus * -1);
            self.profile.container.onOrderBy(parseInt(self.getAttr('orderBy')));
        };

        self.updateOrderByStatus = function (value) {
            if (value === -1) {
                // asc
                self.addClass('Hui-iconfont-arrow2-top');
                self.removeClass('Hui-iconfont-arrow2-bottom');
            }
            else {
                // desc
                self.addClass('Hui-iconfont-arrow2-bottom');
                self.removeClass('Hui-iconfont-arrow2-top');
            }
            self.getDom().css({opacity: 1});
            self.setAttr('orderBy', value);
        }

        self.inActive = function () {
            self.getDom().css({opacity: 0.4});
            self.addClass('Hui-iconfont-arrow2-bottom');
            self.removeClass('Hui-iconfont-arrow2-top');
            self.setAttr('orderBy', 1);
        }

        self.profile.dom.bind('click', orderBy);
    }

    /**
     * table title
     * - 接口
     *      - render
     *      - updateOrderByStatus
     * - 委托
     *      - onOrderBy(self, page)
     *
     * @param container
     * @param model = {
     *      content: string || {
     *          key: string,
     *          class: object,
     *          model: {}
     *      }
     *      orderBy: int,    // -1: asc, 1: desc
     *      width: string
     * }
     * @param tpl
     * @constructor
     */
    var BUITableTitleCell = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BUITableCell(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.profile.container.append(self.profile.tpl);
            var dom   = self.getDom();
            var key   = dom.attr('bf-dom');
            var bfDom = new TableTitleCellDom(key, self, dom);
            bfDom.setAttr('html', self.profile.model.content);
            self.addDom(key, bfDom);
            self.update(self.profile.model);
        }

        self.updateOrderByStatus = function (value) {
            self.getSubDom('orderByIcon').updateOrderByStatus(value);
        }

        self.inActive = function () {
            self.getSubDom('orderByIcon').inActive();
        }

        self.onOrderBy = function (orderByStatus) {
            self.profile.model.delegate.onOrderBy(self, orderByStatus);
        }

        /**
         *
         * @param val
         */
        self.update = function (val) {
            self.getDom().html('');

            if (val.content !== null && typeof (val.content) === 'object') {
                self.removeSpirit(val.content.key);
                var container = self.getDom();
                var spirit = new val.content.class(container, val.content.model);
                spirit.setKey(val.content.key);
                spirit.render();
                self.addSpirit(val.content.key, spirit);
            }
            else {
                self.getDom().html(val.content);
            }

            if (val.width) {
                self.getSubDom('titleCell').setWidth(val.width);
            }
            if (val.orderBy) {
//                self.getSubDom('titleCell').updateOrderByStatus(val.orderBy);
//                self.getSubDom('titleCell').bindOrderBy();
                self.getSubDom('titleCell').addClass('bui-order-by');

                var orderByTpl = '<i class="fr Hui-iconfont Hui-iconfont-arrow2-bottom" orderBy="1" bf-dom="orderByIcon" bf-class="OrderByIconDom" style="opacity: 0.4"></i>';
                self.getDom().append(orderByTpl);
                var dom   = self.findDom('bf-dom', 'orderByIcon');
                var key   = dom.attr('bf-dom');
                var bfDom = new OrderByIconDom(key, self, dom);

                if (val.activeOrderBy) {
                    bfDom.updateOrderByStatus(val.orderBy);
                }

                self.addDom(key, bfDom);
            }
            else {
//                self.getSubDom('titleCell').unBindOrderBy();
                self.removeDom('orderByIcon');
                self.getSubDom('titleCell').removeClass('bui-order-by');
            }

            self.profile.model = val;
        }
    }

    module.exports = BUITableTitleCell;

});
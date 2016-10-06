define(function(require, exports, module) {
    var BFView = require('bf/BFBase/BFView');
    var BFUtil = require('bf/BFUtil/BFUtil');
    var __tpl__ = require('bf/BUIComponent/BUITable/BUITable.html');

    /**
     * css
     */
    require('bf/BUIComponent/BUITable/BUITable.css');

    /**
     * spirit
     */
    var BUITableTitle = require('bf/BUIComponent/BUITable/BUITableTitle');
    var BUITableItem  = require('bf/BUIComponent/BUITable/BUITableItem');

    /**
     * table
     * - 说明
     *      - 【列刷新】支持：updateTitle&update
     *      - 【行刷新】支持：update
     *      - 【对象单元】支持：通过传入一个标准 spirit 来构建一个 cell
     *      - 【排序】目前只支持单一列排序
     *      - 【样式】可配置列宽度
     * - 接口
     *      - render
     *      - updateCell
     *      - update
     *      - updateTitle
     * - 委托
     *      - onTableOrderBy(self, index, orderByStatus)
     *      - onTableUpdated(self)
     *
     * @param container
     * @param model = {
     *      title: [
     *          {
     *              orderBy: int,           // 【可选】-1:asc, 1:desc   构造方需要保证该状态与实际列表排序结果一致（即传入的itemList）
     *              activeOrderBy: bool,    // 【可选】是否为活跃排序状态
     *              content: string | {
     *                  key: string,        // 提供给构造方的 key
     *                  class: {},          // 构造 cell 的标准 BF Spirit 构造方法
     *                  model: {}           // 构造 cell 的 model
     *              }，
     *              width: string           // 【可选】
     *          }
     *      ],
     *      itemList: [
     *          [],
     *          ...
     *      ]
     * }
     * @param tpl
     * @constructor
     */
    var BUITable = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        self.profile.model.itemCount = 0;

        self.render = function () {
            self.remove();
            self.profile.container.append(self.profile.tpl);

            var container  = self.getDom().find('[bf-container="title"]');
            var model      = self.getModel().title;
            model.delegate = self.getInstance();
            var tableTitle = new BUITableTitle(container, model);
            tableTitle.render();
            self.profile.spiritSet['tableTitle'] = tableTitle;

            var itemList = self.getModel().itemList;
            for (var i = 0; i < itemList.length; i++) {
                appendItem(itemList[i]);
            }
        }

        self.updateCell = function (row, column, val) {
            if (self.profile.spiritSet['tableItem__' + row]) {
                self.getModel().itemList[row][column] = val;
                self.profile.spiritSet['tableItem__' + row].updateCell(column, val);
                self.onUpdated();
            }
        }

        /**
         * 全量更新cell值
         * @param itemList
         */
        self.update = function (itemList) {
            for (var i = 0; i < itemList.length; i++) {
                var key = 'tableItem__' + i;
                if (self.getSpirit(key)) {
                    self.getSpirit(key).update(itemList[i]);
                }
                else {
                    appendItem(itemList[i]);
                }
            }

            if (itemList.length < self.getItemCount()) {
                for (var i = itemList.length; i < self.getItemCount(); i++) {
                    self.removeSpirit('tableItem__' + i);
                }

                self.getModel().itemCount = itemList.length;
            }

            self.getModel().itemList = itemList;
            self.onUpdated();
        }

        /**
         *
         * @param title
         */
        self.updateTitle = function (title) {
            self.getSpirit('tableTitle').update(title);
        }

        self.getItemCount = function () {
            return self.profile.model.itemCount;
        }

        var appendItem = function (item) {
            var container = self.findDom('bf-container', 'body');
            var model     = item;
            var tableItem = new BUITableItem(container, model);
            tableItem.render();
            self.addSpirit('tableItem__' + self.getModel().itemCount, tableItem);
            self.getModel().itemCount += 1;
        }

        self.onOrderBy = function(index, orderByStatus) {
            if (typeof (self.getModel().delegate.onTableOrderBy)) {
                self.getModel().delegate.onTableOrderBy(self, index, orderByStatus).then(function (ret) {
                    if (parseInt(ret.status) === 1) {
                        self.update(ret.itemList);
                    }
                })
            }
        }

        self.onUpdated = function() {
            if (typeof (self.getModel().delegate.onTableUpdated) === 'function') {
                self.getModel().delegate.onTableUpdated(self);
            }
        }
    }

    module.exports = BUITable;

});
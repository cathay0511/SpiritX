define(function(require, exports, module) {
    var BFView = require('bf/BFBase/BFView');
    var __tpl__ = require('bf/BUIComponent/BUITable/BUITableItem.html');
    var BUITableCell = require('bf/BUIComponent/BUITable/BUITableCell');

    /**
     *
     * @param container
     * @param model
     * @param tpl
     * @constructor
     */
    var BUITableItem = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.profile.container.append(self.profile.tpl);

            var cellList = self.profile.model;
            for (var i = 0; i < cellList.length; i++) {
                var container = self.getDom();
                var model     = cellList[i];
                var tableCell = new BUITableCell(container, model);
                tableCell.render();
                self.addSpirit('cell__' + i, tableCell);
            }
        }

        self.updateCell = function (column, val) {
            if (self.profile.spiritSet['cell__' + column]) {
                self.profile.spiritSet['cell__' + column].update(val);
            }
        }

        /**
         * 全量更新 cell 值
         * @param cellList
         */
        self.update = function (cellList) {
            for (var i = 0; i < cellList.length; i++) {
                var key = ['cell__' + i];
                if (self.getSpirit(key)) {
                    self.getSpirit(key).update(cellList[i]);
                }
                else {
                    var container = self.getDom();
                    var model     = cellList[i];
                    var tableCell = new BUITableCell(container, model);
                    tableCell.render();
                    self.addSpirit('cell__' + i, tableCell);
                }
            }

            if (cellList.length < self.getModel().length) {
                for (var i = cellList.length; i < self.getModel().length; i++) {
                    self.removeSpirit('cell__' + i);
                }
            }

            self.profile.model = cellList;
        }
    }

    module.exports = BUITableItem;

});
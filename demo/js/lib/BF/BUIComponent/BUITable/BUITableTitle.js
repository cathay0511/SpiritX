define(function(require, exports, module) {
    var BUITableItem  = require('bf/BUIComponent/BUITable/BUITableItem');
    var __tpl__ = require('bf/BUIComponent/BUITable/BUITableTitle.html');
    var BUITableTitleCell = require('bf/BUIComponent/BUITable/BUITableTitleCell');

    /**
     *
     * @param container
     * @param model
     * @param tpl
     * @constructor
     */
    var BUITableTitle = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BUITableItem(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.profile.container.append(self.profile.tpl);

            var cellList = self.profile.model;
            for (var i = 0; i < cellList.length; i++) {
                var container  = self.getDom();
                var model      = cellList[i];
                model.index    = i;
                model.delegate = self;
                var tableCell = new BUITableTitleCell(container, model);
                tableCell.setKey('cell__' + i);
                tableCell.render();
                self.addSpirit('cell__' + i, tableCell);
            }
        }

        self.onOrderBy = function(spirit, orderByStatus) {
            for (var i = 0; i < self.getModel().length; i++) {
                var item = self.getModel()[i];
                var spiritX = self.getSpirit('cell__' + i);
                if (item.orderBy && spirit.getKey() !== spiritX.getKey()) {
                    spiritX.inActive();
                }
            }
            self.profile.model.delegate.onOrderBy(spirit.getModel().index, orderByStatus);
        }

        self.update = function (cellList) {
            for (var i = 0; i < cellList.length; i++) {
                var key = ['cell__' + i];
                if (self.getSpirit(key)) {
                    self.getSpirit(key).update(cellList[i]);
                }
                else {
                    var container = self.getDom();
                    var model     = cellList[i];
                    var tableCell = new BUITableTitleCell(container, model);
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

    module.exports = BUITableTitle;

});
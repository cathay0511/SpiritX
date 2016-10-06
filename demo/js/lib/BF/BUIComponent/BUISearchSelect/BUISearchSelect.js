define(function(require, exports, module) {
    var BFView = require('bf/BFBase/BFView');
    var BFUtil = require('bf/BFUtil/BFUtil');
    var __tpl__ = require('bf/BUIComponent/BUISearchSelect/BUISearchSelect.html');
    var tplBUISearchSelectItem = require('bf/BUIComponent/BUISearchSelect/BUISearchSelectItem.html');

    /**
     * css
     */
    require('bf/BUIComponent/BUISearchSelect/BUISearchSelect.css');

    /**
     * dom
     */
    var SearchSelectInputDom = require('bf/BUIComponent/BUISearchSelect/dom/SearchSelectInputDom');
    var SearchSelectItemListDom = require('bf/BUIComponent/BUISearchSelect/dom/SearchSelectItemListDom');
    var SearchSelectItemDom = require('bf/BUIComponent/BUISearchSelect/dom/SearchSelectItemDom');

    /**
     * 可搜索下拉框
     * - 说明
     *      - container 需要为非 static 元素。此种情况 container 的宽度即为 BUISearchSelect 的宽度
     *      - 由于使用了 box-sizing:border-box ，因此在某些浏览器中可能存在 input 框的样式问题
     *
     * @param container
     * @param model = {key1: string, key2: string, ..., keyn: string}
     * @param tpl
     * @constructor
     */
    var BUISearchSelect = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.profile.container.append(self.profile.tpl);
            self.renderItem(self.profile.model);

            var domSetConfig = {
                SearchSelectInputDom: SearchSelectInputDom,
                SearchSelectItemListDom: SearchSelectItemListDom
            }
            self.buildDomSet(domSetConfig);

        }

        self.renderItem = function (itemList) {
            self.removeDom('searchSelectItem__*');

            for (var key in itemList) {
                var tempTpl = BFUtil.replaceTpl(tplBUISearchSelectItem, {domKey: 'searchSelectItem__' + key, item: itemList[key], itemId: key});
                self.getDom().find('[bf-container="BUISearchSelectItem"]').append(tempTpl);
            }

            var domSetConfig = {
                SearchSelectItemDom: SearchSelectItemDom
            }
            self.buildDomSet(domSetConfig);
        }

        self.refreshInput = function () {
            self.showSearchSelectList();
            var itemList = refreshItemList();
            self.renderItem(itemList);
        }

        self.hideSearchSelectList = function () {
            self.getSubDom('searchSelectItemList').hide();
        }

        self.showSearchSelectList = function () {
            self.getSubDom('searchSelectItemList').show();
        }

        self.pickingItem = function (flag) {
            if (flag) {
                self.getSubDom('searchSelectInput').blur(false);
            }
            else {
                self.getSubDom('searchSelectInput').blur(true);
            }
        }

        self.pickItem = function (itemId, value) {
            self.getSubDom('searchSelectInput').focus();
            self.getSubDom('searchSelectInput').setAttr('value', value);
            self.getSubDom('searchSelectInput').setAttr('itemId', itemId);
            self.hideSearchSelectList();
        }

        self.getValue = function () {
            return self.getSubDom('searchSelectInput').getAttr('value');
        }

        self.getItemId = function () {
            return self.getSubDom('searchSelectInput').getAttr('itemId');
        }

        self.setValue = function (value) {
            self.getSubDom('searchSelectInput').setAttr('value', value);
        }

        self.setValueByKey = function (key) {
            self.getSubDom('searchSelectInput').setAttr('value', self.profile.model[key]);
            self.getSubDom('searchSelectInput').setAttr('itemId', key);
        }

        var refreshItemList = function () {
            var ret = {};

            var searchValue = self.getSubDom('searchSelectInput').getAttr('value');
            var lastMatchKey = null;
            for (var key in self.profile.model) {
                var value = self.profile.model[key];
                if (value.match(searchValue) !== null) {
                    ret[key] = value;
                    lastMatchKey = key;
                }
            }

            self.getSubDom('searchSelectInput').setAttr('itemId', lastMatchKey);

            return ret;
        }


    }

    module.exports = BUISearchSelect;

});
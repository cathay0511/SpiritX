define(function(require, exports, module) {
    /**
     * base
     */
    var BFView = require('bf/BFBase/BFView');
    var __tpl__ = require('bf/Demo/data/SampleData.tpl');

    /**
     * dom
     */
    var BFDom  = require('bf/BFBase/BFDom');
    var TitleDom = require('bf/Demo/data/dom/TitleDom');
    var ResetDom = require('bf/Demo/data/dom/ResetDom');
    var domSetConfig = {
        ResetDom: ResetDom
    }

    /**
     * spirit
     */
    var BUISearchSelect = require('bf/BUIComponent/BUISearchSelect/BUISearchSelect');
    var BUITable        = require('bf/BUIComponent/BUITable/BUITable');
    var BUIPaginTable   = require('bf/BUIComponent/BUIPaginTable/BUIPaginTable');

    /**
     *
     * @param container
     * @param model = {title: '', brief: ''}
     * @param tpl
     * @constructor
     */
    var SampleData = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.profile.container.append(self.profile.tpl);
            self.buildDomSet(domSetConfig, true);
            self.buildDomModelSet();
            self.buildSpiritSet();
        }

        /**
         *
         */
        self.buildDomModelSet = function () {
            self.bindDomModel('self.profile.model.title', 'input_title', 'value');
            self.bindDomModel('self.profile.model.title', 'title', 'html');
            self.bindDomModel('self.profile.model.brief', 'input_brief', 'value');
            self.bindDomModel('self.profile.model.brief', 'brief', 'html');
            self.bindDomModel('self.profile.model.brief', 'input', 'value');
        }

        self.buildSpiritSet = function () {
            var container = self.getDom().find('[bf-container="SampleSearchSelect"]');
            var sampleSearchSelect = new BUISearchSelect(container, {1: 'gray', 2: 'ly'});
            sampleSearchSelect.render();
            sampleSearchSelect.setValueByKey(2);
            self.profile.spiritSet['sampleSearchSelect'] = sampleSearchSelect;

            var container = self.getDom().find('[bf-container="SampleTable"]');
            var model = {
                delegate: self.getInstance(),
                pagination: {
                    totalCount: 105,
                    currentPage: 5,
                    pageSize: 10
                },
                table: {
                    title: [
                        {
                            orderBy: 1,
                            content: 'name'
                        },
                        {
                            content:'city'
                        }, {
                            orderBy: -1,
                            content: 'order'
                        }],
                    itemList: [
                        ['gray', 'sh', 'a'],
                        ['ly', 'gz', 'b'],
                        ['xi', 'zs', 'c']
                    ]
                }
            }
            var sampleTable = new BUIPaginTable(container, model);
            sampleTable.setKey('sampleTable');
            sampleTable.render();
            self.profile.spiritSet['sampleTable'] = sampleTable;
            
        }

        self.reset = function () {
            self.updateModel('self.profile.model.title', '');
            self.updateModel('self.profile.model.brief', '');

            var val = self.getSubDom('input').getAttr('value');
            var model = [
                    [val, 'sh'],
                    [val, 'gz']
                ];
            self.profile.spiritSet['sampleTable'].updateTable(model);
        }

        self.onPageRefreshed = function (spirit, page) {
            var defer = $.Deferred();

            if (spirit.getKey() === 'sampleTable') {
                var itemList = [];
                for (var i = 0; i < page; i++) {
                    var item = ['f', 's', i];
                    itemList.push(item);
                }
                var ret = {
                    status: 1,
                    itemList: itemList
                }
            }

            defer.resolve(ret);
            return defer;
        }

        self.onTableOrderBy = function (spirit, index, value) {
            var defer = $.Deferred();

            if (spirit.getKey() === 'sampleTable') {
                var itemList = [];
                for (var i = 0; i < 10; i++) {
                    var item = ['f', 's', i];
                    itemList.push(item);
                }
                var ret = {
                    status: 1,
                    itemList: itemList
                }
            }

            defer.resolve(ret);
            return defer;
        }
    }

    module.exports = SampleData;

});
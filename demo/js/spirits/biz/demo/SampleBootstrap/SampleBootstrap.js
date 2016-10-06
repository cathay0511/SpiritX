define(function(require, exports, module) {
    /**
     * base
     */
    var BFView = require('bf/BFBase/BFView');
    var __tpl__ = require('biz/demo/SampleBootstrap/SampleBootstrap.tpl');

    /**
     * css
     */
    require('biz/demo/SampleBootstrap/SampleBootstrap.css');

    /**
     * spirit
     */
    var BUISearchSelect = require('bf/BUIComponent/BUISearchSelect/BUISearchSelect');
    var BUIPaginTable   = require('bf/BUIComponent/BUIPaginTable/BUIPaginTable');
    var SwitchOnOff     = require('component/SwitchOnOff/SwitchOnOff');
    var TableOpList     = require('widget/TableOpList/TableOpList');

    /**
     *
     * @param container
     * @param model
     * @param tpl
     * @constructor
     */
    var SampleBootstrap = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;


        self.buildDomModelSet = function () {
            self.bindDomModel('self.profile.model.input1', 'input1', 'value');
            self.bindDomModel('self.profile.model.input1', 'input2', 'value');
            self.bindDomModel('self.profile.model.input1', 'span1', 'html');
        }

        self.buildSpiritSet = function () {
            var container = self.findDom('bf-container', 'SampleSearchSelect');
            var sampleSearchSelect = new BUISearchSelect(container, {1: 'gray', 2: 'ly'});
            sampleSearchSelect.render();
            sampleSearchSelect.setValueByKey(2);
            self.addSpirit('sampleSearchSelect', sampleSearchSelect);

            var container = self.findDom('bf-container', 'SampleTable');
            var model = {
                delegate: self.getInstance(),
                pagination: {
                    totalCount: 3,
                    currentPage: 1,
                    pageSize: 10
                },
                table: {
                    title: [
                        {
                            orderBy: 1,
                            content: 'name',
                            activeOrderBy: true,
                            width: '100px'
                        },
                        {
                            content:'city'
                        }, {
                            orderBy: -1,
                            content: 'order'
                        }],
                    itemList: [
                        ['coco', 'sh', 'a'],
                        ['ly', {
                            class: SwitchOnOff,
                            key: 'switch_ly',
                            model: {delegate: self.getInstance(), value: 'on'}
                        }, 'b'],
                        ['gray', {
                            class: SwitchOnOff,
                            key: 'switch_gray',
                            model: {delegate: self.getInstance(), value: 'off'}
                        }, 'c'],
                    ]
                }
            }
            var sampleTable = new BUIPaginTable(container, model);
            sampleTable.setKey('sampleTable');
            sampleTable.render();
            self.addSpirit('sampleTable', sampleTable);
        }

        self.onSwitchClick = function (spirit, value) {
            alert(spirit.getKey() + ' now is ' + value);
        }

        self.onPageRefreshed = function (spirit, page) {
            alert('page ' + page);
        }

        self.onTableOrderBy = function (spirit, index, value) {
            var order = value === 1 ? 'desc' : 'asc';
            alert('column ' + index + ' ' + order);
        }

        self.onDomClick = function (bfDom) {
            console.log(bfDom);
        }
    }



    module.exports = SampleBootstrap;

});
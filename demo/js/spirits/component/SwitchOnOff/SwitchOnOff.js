/**
 * Created by laixuejiao on 16-5-13.
 * model = {value: string, delegate: parent} //string = 'on' or 'off'
 * delegate: 需实现代理方法 onSwitchClick(spirit, switchValue)
 */
define(function(require, exports, module) {
    var BFView = require('bf/BFBase/BFView');
    var BFUtil = require('bf/BFUtil/BFUtil');
    var BFDom = require('bf/BFBase/BFDom');

    var __tpl__ = '<div id="{$DOM_ID}" class="bui-switch"><input bf-dom="{$domKey}" bf-class="SwitchOnOff" id="{$domKey}" type="checkbox"><label for="{$domKey}"><span></span></label></div>';

    var SwitchOnOffDom = function (key, container, dom) {
        var self = this.__proto__ = new BFDom(key, container, dom);
        self.profile.dom.bind('change', function () {
            self.profile.container.updateValue($(this).prop('checked'));
        });
        self.switchOnOff = function (onOff) {
            self.profile.dom.prop('checked', onOff === 'on');
        }
    };

    /**
     *
     * @param container
     * @param model = {value: string, callback: function} string = 'on' or 'off', callback没有可不带
     * @param tpl
     * @constructor
     */
    var SwitchOnOff = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        // 父模块调用 - 渲染组件
        self.render = function () {
            var domSetConfig = {domKey: 'Switch__' + BFUtil.uuid(8, 10)};
            self.profile.tpl = BFUtil.replaceTpl(self.profile.tpl, domSetConfig);
            self.profile.container.append(self.profile.tpl);
            self.buildDomSet({SwitchOnOff: SwitchOnOffDom});
            self.getSubDom(domSetConfig.domKey).switchOnOff(self.profile.model.value);
        };

        self.updateValue = function (value) {
            self.profile.model.value = value === true ? 'on' : 'off';
            if (typeof self.profile.model.callback === 'function') {
                self.profile.model.callback(self.profile.model.value);
            }
            if (self.getModel().delegate && typeof self.getModel().delegate.onSwitchClick == 'function') {
                self.getModel().delegate.onSwitchClick(self, self.profile.model.value);
            }
        };

        // 父模块调用 - 获取组件值 'on' or 'off'
        self.getValue = function () {
            return self.profile.model.value;
        };

        self.setValue = function (value) {
            self.profile.model.value = value;
        };
    };

    module.exports = SwitchOnOff;

});
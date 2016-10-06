define(function(require, exports, module) {
    var BFUtil = require('bf/BFUtil/BFUtil');
    var BFDom  = require('bf/BFBase/BFDom');
    /**
     * view 基类
     * - description
     *      - 一段html片段及其业务逻辑的抽象
     *      - 生成全局唯一的domId
     *      - 不负责dom事件的绑定（交由BFDom类对象）
     *      - 实现业务逻辑
     * - 子类
     *      - 编写 tpl
     *      - 实现 buildDomModelSet
     *      - 实现 buildSpiritSet
     *      - 实现业务逻辑
     *
     * @param container
     * @param model
     * @param tpl
     * @constructor
     */
    var BFView = function (container, model, tpl) {
        var self = this;
        self.profile = {
            instance: self,
            domId: 0,
            container: {},
            model: {},
            tpl: '',
            domSet: {},       // BFDom对象集合，名称通过 bf-dom 属性指定
            domModelSet: {},  // dom属性级别数据绑定集合：{query:{key:{attr:1}}}
            spiritSet: {}
        }

        self.init = function (container, model, tpl) {
            var domId = 'BF_' + BFUtil.uuid(8, 10);

            self.profile.domId     = domId;
            self.profile.container = container;
            self.profile.model     = model;
            self.profile.tpl       = BFUtil.replaceTpl(tpl, {DOM_ID: domId});
        }

        /**
         * 子类实现
         * @returns {*}
         */
        self.initModel = function () {
            var defer = $.Deferred();
            defer.resolve(1);
            return defer;
        }

        /**
         * 标准render流程
         * 通常需要子类重写
         */
        self.render = function () {
            self.getInstance().replaceTpl();
            self.profile.container.append(self.profile.tpl);
            self.getInstance().buildDomSet(null, true);
            self.getInstance().buildDomModelSet();
            self.getInstance().buildSpiritSet();
        }

        /**
         * 子类重写
         */
        self.replaceTpl = function () {

        }

        /**
         * 由于一些引用方式的问题，需要在config中传递特定的构造器对象
         * 由 bf-dom 指定对象名称，由 bf-class 指定其构造器名称
         * @param config
         * @param flag
         */
        self.buildDomSet = function (config, flag) {
            if (config) {
                buildDomSet(config);
            }

            if (flag) {
                buildDomSetDefault();
            }
        }

        var buildDomSetDefault = function () {
            self.getDom().find('*[bf-dom]').each(function () {
                var dom   = $(this);
                var key   = dom.attr('bf-dom');

                var className = dom.attr('bf-class');
                if (typeof (className) === 'undefined') {
                    var bfDom = new BFDom(key, self.getInstance(), dom);
                    self.profile.domSet[key] = bfDom;
                }
            });
        }

        var buildDomSet = function (config) {
            self.getDom().find('*[bf-dom]').each(function () {
                var dom   = $(this);
                var key   = dom.attr('bf-dom');

                var className = dom.attr('bf-class');
                if (typeof (config[className]) === 'function') {
                    var bfDom = new config[className](key, self.getInstance(), dom);
                    self.profile.domSet[key] = bfDom;
                }
            });
        }

        self.getContainer = function () {
            return self.profile.container;
        }

        self.addDom = function (key, dom) {
            self.profile.domSet[key] = dom;
        }

        self.removeDom = function (query) {
            for (var key in self.profile.domSet) {
                if (key.match(new RegExp(query))) {
                    self.profile.domSet[key].remove();
                    delete self.profile.domSet[key];
                }
            }
        }

        self.getSpirit = function (key) {
            return self.profile.spiritSet[key];
        }

        self.addSpirit = function (key, spirit) {
            self.profile.spiritSet[key] = spirit;
        }

        self.removeSpirit = function (query) {
            for (var key in self.profile.spiritSet) {
                if (key.match(new RegExp(query))) {
                    self.profile.spiritSet[key].remove();
                    delete self.profile.spiritSet[key];
                }
            }
        }

        /**
         * 交由子类实现
         * 由 bf-spirit 指定对象名称
         */
        self.buildDomModelSet = function () {

        }

        /**
         * 由子类实现（需要子类传递特定的model来构造spirit）
         */
        self.buildSpiritSet = function () {

        }

        /**
         *
         * @param query 检索 self.profile.model
         * @param key dom在domSet的key
         * @param attr dom的属性
         */
        self.bindDomModel = function (query, key, attr) {
            if (typeof (self.profile.domModelSet[query]) === 'undefined') {
                self.profile.domModelSet[query] = {}
            }

            if (typeof (self.profile.domModelSet[query][key]) === 'undefined') {
                self.profile.domModelSet[query][key] = {};
            }

            self.profile.domModelSet[query][key][attr] = 1;
        }

        /**
         * 更新绑定了该dom指定属性的model的值
         * 该方法由特定的BFDom对象来调用（BFDom对象对自身属性变化负责）
         * 更新链： dom => onDomUpdated => updateModel => onModelUpdated => refreshDom
         * @param key
         * @param attr
         * @param value
         */
        self.onDomUpdated = function (key, attr, value) {
            for (var query in self.profile.domModelSet) {
                var domModel = self.profile.domModelSet[query];
                if (domModel[key] && domModel[key][attr] === 1) {
                    self.profile.curResDom = self.getSubDom(key);
                    self.updateModel(query, value);
                }
            }
        }

        var getModelByExp = function (query) {
            return eval('(' + query + ')');
        }

        self.updateModel = function (query, value) {
            if (typeof (value) === 'string') {
                value = '"' + value + '"';
            }
            var expr = query + ' = ' + value;
            eval('(' + expr + ')');
            self.getInstance().onModelUpdated(query);
        }

        /**
         * 更新与该model绑定的dom的指定属性的值
         * 理论上不应当被主动调用，类似于 ng 的 apply
         * @param query
         */
        self.onModelUpdated = function (query) {
            for (var key in self.profile.domModelSet[query]) {
                if (self.profile.curResDom && self.profile.curResDom.getKey() === key) {
                    continue;
                }

                for (var attr in self.profile.domModelSet[query][key]) {
                    self.refreshDom(key, attr, getModelByExp(query));
                }
            }

            self.profile.curResDom = undefined;
        }

        self.refreshDom = function (key, attr, value) {
            self.getSubDom(key).setAttr(attr, value);
        }

        self.getSubDom = function (key) {
            if (typeof (self.profile.domSet[key]) !== 'undefined') {
                return self.profile.domSet[key];
            }

            return null;
        }

        self.get = function () {
            return self.profile.model;
        }

        self.remove = function () {
            self.getDom().remove();
        }

        self.getDID = function () {
            return self.profile.domId;
        }

        self.getDom = function () {
            return $('#' + self.getDID());
        }

        /**
         * 返回用户标记的key
         */
        self.getKey = function () {
            return self.profile.key;
        }

        self.setKey = function (key) {
            self.profile.key = key;
        }

        self.getInstance = function () {
            return self.profile.instance;
        }

        self.getModel = function () {
            return self.profile.model;
        }

        self.findDom = function (type, query) {
            return self.getDom().find('[' + type + '="' + query + '"]');
        }

        self.getInstance().init(container, model, tpl);

    }

    module.exports = BFView;

});
define(function(require, exports, module) {
    /**
     * dom 元素基类
     * - description
     *      - 对dom元素的抽象
     *      - 事件绑定（通常是调用container对应的“委托”方法）
     * @param key       // 在container中的标识
     * @param container // 标准 BFView 对象
     * @param dom
     * @constructor
     */
    var BFDom = function (key, container, dom) {
        var self = this;

        self.profile = {
            instance: self,
            key: key,
            container: container,
            dom: dom,
            cpLock: false //input 事件的同步锁
        }

        self.getKey = function () {
            return self.profile.key;
        }

        self.getContainer = function () {
            return self.profile.container;
        }

        self.getDom = function () {
            return self.profile.dom;
        }

        self.remove = function () {
            self.profile.dom.remove();
        }

        self.getAttr = function (attr) {
            switch (attr) {
                case 'html':
                    return self.profile.dom.html();
                case 'value':
                    return self.profile.dom.val();
                default :
                    return self.profile.dom.attr(attr);
            }
        }

        self.setAttr = function (attr, value) {
            switch (attr) {
                case 'html':
                    self.profile.dom.html(value);
                    break;
                case 'value':
                    self.profile.dom.val(value);
                    break;
                default :
                    self.profile.dom.attr(attr, value);
                    break;
            }
        }

        self.addClass = function (className) {
            self.profile.dom.addClass(className);
        }

        self.removeClass = function (className) {
            self.profile.dom.removeClass(className);
        }

        self.style = function (style) {
            self.profile.dom.css(style);
        }

        self.profile.dom.bind('compositionstart', function(){
            self.profile.cpLock = true;
        })
        self.profile.dom.bind('compositionend', function(){
            self.profile.cpLock = false;
        })
        self.profile.dom.bind('input propertychange', function () {
            if (!self.profile.cpLock) {
                self.profile.container.onDomUpdated(self.profile.key, 'value', self.getAttr('value'));
            }
        });

        if (typeof (self.getContainer().onDomClick) === 'function') {
            self.profile.dom.on("click", function(){
                self.getContainer().onDomClick(self);
            });
        }
    }

    module.exports = BFDom;

});
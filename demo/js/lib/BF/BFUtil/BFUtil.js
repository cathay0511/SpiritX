define(function(require, exports, module) {

    var uuid = function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }

    /**
     * 替换模板变量
     * - 主要用于环境变量
     * @param __tpl__
     * @param varTpls
     * @returns {*}
     */
    var replaceTpl = function (__tpl__, varTpl) {
        for (var key in varTpl) {
            var reg = new RegExp("\\{\\$" + key + "\\}", 'g');
            __tpl__ = __tpl__.replace(reg, varTpl[key]);
        }
        return __tpl__;
    }

    var getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    var addUrlPara = function (name, value) {
        var currentUrl = window.location.href.split('#')[0];
        if (/\?/g.test(currentUrl)) {
            if (/name=[-\w]{4,25}/g.test(currentUrl)) {
                currentUrl = currentUrl.replace(/name=[-\w]{4,25}/g, name + "=" + value);
            } else {
                currentUrl += "&" + name + "=" + value;
            }
        } else {
            currentUrl += "?" + name + "=" + value;
        }
        if (window.location.href.split('#')[1]) {
            window.location.href = currentUrl + '#' + window.location.href.split('#')[1];
        } else {
            window.location.href = currentUrl;
        }
    }

    var getHashParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.hash.substr(2).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    return {
        uuid: uuid,
        replaceTpl: replaceTpl,
        getUrlParam: getUrlParam,
        addUrlPara: addUrlPara,
        getHashParam: getHashParam
    }

});
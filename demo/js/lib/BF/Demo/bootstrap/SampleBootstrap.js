define(function(require, exports, module) {
    /**
     * base
     */
    var BFView = require('bf/BFBase/BFView');
    var __tpl__ = require('bf/Demo/bootstrap/SampleBootstrap.tpl');


    /**
     *
     * @param container
     * @param model
     * @param tpl
     * @constructor
     */
    var SampleBootstrap = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        var self = this.__proto__ = new BFView(container, model, tpl);
    }

    module.exports = SampleBootstrap;

});
define(function(require, exports, module) {
    var BFView = require('bf/BFBase/BFView');
    var BFUtil = require('bf/BFUtil/BFUtil');
    var __tpl__ = require('bf/BUIComponent/BUIPaginTable/BUIPaginTable.html');
    var tplPagination = require('bf/BUIComponent/BUIPaginTable/Pagination.html');

    /**
     * css
     */
    require('bf/BUIComponent/BUIPaginTable/BUIPaginTable.css');

    /**
     * dom
     */
    var PageItemDom = require('bf/BUIComponent/BUIPaginTable/dom/PageItemDom');

    /**
     * spirit
     */
    var BUITable   = require('bf/BUIComponent/BUITable/BUITable');

    /**
     * 带分页的table
     * - 接口
     *      - render
     *      - setCurrentPage(value)
     *      - updateTotalCount(value)
     *      - updateTable(itemList)
     *      - updateTableTitle(title)
     * - 代理
     *      - onPageRefreshed(self, page)
     *      - onTableOrderBy(self, index, orderByStatus)
     *
     * @param container
     * @param model = {
     *      delegate: {},
     *      pagination: {
     *          totalCount: int,
     *          currentPage: int,
     *          pageSize: int,
     *      },
     *      table: {
     *          title: [],
     *          itemList: [
     *              [],
     *              ...
     *          ]
     *      }
     * }
     * @param tpl
     * @constructor
     */
    var BUIPaginTable = function (container, model, tpl) {
        tpl = tpl == null ? __tpl__ : tpl;
        this.__proto__ = new BFView(container, model, tpl);
        var self = this.profile.instance = this;

        self.render = function () {
            self.profile.container.append(self.profile.tpl);

            var container  = self.getDom().find('[bf-container="table"]');
            var model      = self.profile.model.table;
            model.delegate = self.getInstance();

            var table      = new BUITable(container, model);
            table.render();
            self.profile.spiritSet['table'] = table;

            var dom   = self.getDom().find('[bf-dom="firstPageItem"]');
            var key   = dom.attr('bf-dom');
            var bfDom = new PageItemDom(key, self, dom);
            self.profile.domSet[key] = bfDom;

            var dom   = self.getDom().find('[bf-dom="prePageItem"]');
            var key   = dom.attr('bf-dom');
            var bfDom = new PageItemDom(key, self, dom);
            self.profile.domSet[key] = bfDom;

            var dom   = self.getDom().find('[bf-dom="nextPageItem"]');
            var key   = dom.attr('bf-dom');
            var bfDom = new PageItemDom(key, self, dom);
            self.profile.domSet[key] = bfDom;

            var dom   = self.getDom().find('[bf-dom="lastPageItem"]');
            var key   = dom.attr('bf-dom');
            var bfDom = new PageItemDom(key, self, dom);
            self.profile.domSet[key] = bfDom;

            renderPagination();
        }

        self.refresh = function (page) {
            var currentPage = self.getCurrentPage();
            var totalPage   = self.getTotalPage();
            if (page === 'first') {
                page = 1;
            }
            else if (page === 'pre') {
                page = currentPage - 1;
            }
            else if (page === 'next') {
                page = currentPage + 1;
            }
            else if (page === 'last') {
                page = totalPage;
            }
            else {
                page = parseInt(page);
            }

            if (page < 1) {
                page = 1;
            }
            else if (page > totalPage) {
                page = totalPage;
            }

            if (self.profile.model.delegate && typeof (self.profile.model.delegate.onPageRefreshed) === 'function') {
                self.profile.model.delegate.onPageRefreshed(self, page).then(function (ret) {
                    if (parseInt(ret.status) === 1) {
                        self.setCurrentPage(page);
                        self.updateTable(ret.itemList);
                    }
                })
            }
        }

        self.onTableOrderBy = function(spirit, index, orderByStatus) {
            var defer = $.Deferred();
            if (self.profile.model.delegate && typeof (self.profile.model.delegate.onTableOrderBy) === 'function') {
                self.profile.model.delegate.onTableOrderBy(self, index, orderByStatus).then(function (ret) {
                    if (parseInt(ret.status) === 1) {
                        self.setCurrentPage(1);
                        defer.resolve(ret);
                    }
                })
            }
            else {
                defer.reject();
            }

            return defer;
        }

        /**
         * 子类重写
         */
        self.onTableUpdated = function(spirit) {

        }

        /**
         *
         * @param itemList
         */
        self.updateTable = function (itemList) {
            self.profile.spiritSet['table'].update(itemList);
        }

        self.updateTableTitle = function (title) {
            self.profile.spiritSet['table'].updateTitle(title);
        }

        self.updateTotalCount = function (value) {
            self.profile.model.pagination.totalCount = value;
            renderPagination();
        }

        self.getTotalCount = function () {
            return self.profile.model.pagination.totalCount;
        }

        self.getCurrentPage = function () {
            return self.profile.model.pagination.currentPage;
        }

        self.setCurrentPage = function (value) {
            self.profile.model.pagination.currentPage = value;
            renderPagination();
        }

        self.getPageSize = function () {
            return self.profile.model.pagination.pageSize;
        }

        self.getTotalPage = function () {
            var totalCount  = self.getTotalCount();
            var pageSize    = self.getPageSize();
            var totalPage   = Math.floor((totalCount + pageSize - 1) / pageSize + 0.00001);
            return totalPage;
        }

        var renderPagination = function () {
            self.removeDom('pageItem__*');

            var currentPage = self.getCurrentPage();
            var totalPage   = self.getTotalPage();

            var startPage = currentPage - 2;
            if (startPage < 1) {
                startPage = 1;
            }
            var endPage =  currentPage + 2;
            if (endPage > totalPage) {
                endPage = totalPage;
            }

            for (var i = startPage; i <= endPage; i += 1) {
                if (i === currentPage) {
                    var classActive = 'active';
                }
                else {
                    var classActive = '';
                }

                var domKey = 'pageItem__' + i;
                var tempTpl = BFUtil.replaceTpl(tplPagination, {domKey: domKey, page: i, classActive: classActive});
                self.getDom().find('[bf-container="pagination"]').append(tempTpl);

                var dom   = self.getDom().find('[bf-dom="' + domKey + '"]');
                var key   = dom.attr('bf-dom');
                var bfDom = new PageItemDom(key, self, dom);
                self.profile.domSet[key] = bfDom;
            }
        }

        self.getPageItemCount = function () {
            return self.profile.spiritSet['table'].getItemCount();
        }
    }

    module.exports = BUIPaginTable;

});
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-job-roles-job-roles-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/job-roles/job-roles.page.html":
  /*!*******************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/job-roles/job-roles.page.html ***!
    \*******************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppPagesJobRolesJobRolesPageHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n\r\n    <ion-buttons slot=\"start\">\r\n      <ion-menu-button></ion-menu-button>\r\n      <ion-back-button></ion-back-button>\r\n    </ion-buttons>\r\n\r\n    <ion-title>CÂY CHỨC DANH</ion-title>\r\n\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content class=\"ion-no-padding\">\r\n  <ion-row>\r\n    <ion-col class=\"ion-text-center\" size=\"12\" class=\"card-prospect\" *ngFor=\"let item of organizationsTree\"\r\n      [style.background]=\"(item.background?item.background:'#fafafaf6')\">\r\n\r\n      <ion-row (click)=\"onClickSpec($event, item)\">\r\n        <ion-col size=\"10\" class=\"prospect-header\" [style.color]=\"(item.color?item.color:'darkblue')\">\r\n          <ion-icon item-start *ngIf=\"item.click_type\" style=\"font-size: 1em\" [style.color]=\"'lightblue'\"\r\n            name=\"md-cloud-upload\"></ion-icon>{{item.name}}\r\n        </ion-col>\r\n        <ion-col size=\"2\" class=\"prospect-header\" [style.color]=\"(item.color?item.color:'darkblue')\">\r\n          {{item.status}}\r\n        </ion-col>\r\n      </ion-row>\r\n\r\n      <tree-list [treeData]=\"item.subs\" (onClickKpi)=\"onClickTreeItem($event)\"></tree-list>\r\n\r\n    </ion-col>\r\n\r\n  </ion-row>\r\n</ion-content>";
    /***/
  },

  /***/
  "./src/app/pages/job-roles/job-roles-routing.module.ts":
  /*!*************************************************************!*\
    !*** ./src/app/pages/job-roles/job-roles-routing.module.ts ***!
    \*************************************************************/

  /*! exports provided: JobRolesPageRoutingModule */

  /***/
  function srcAppPagesJobRolesJobRolesRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "JobRolesPageRoutingModule", function () {
      return JobRolesPageRoutingModule;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _job_roles_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./job-roles.page */
    "./src/app/pages/job-roles/job-roles.page.ts");

    var routes = [{
      path: '',
      component: _job_roles_page__WEBPACK_IMPORTED_MODULE_3__["JobRolesPage"]
    }];

    var JobRolesPageRoutingModule = function JobRolesPageRoutingModule() {
      _classCallCheck(this, JobRolesPageRoutingModule);
    };

    JobRolesPageRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
      exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })], JobRolesPageRoutingModule);
    /***/
  },

  /***/
  "./src/app/pages/job-roles/job-roles.module.ts":
  /*!*****************************************************!*\
    !*** ./src/app/pages/job-roles/job-roles.module.ts ***!
    \*****************************************************/

  /*! exports provided: JobRolesPageModule */

  /***/
  function srcAppPagesJobRolesJobRolesModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "JobRolesPageModule", function () {
      return JobRolesPageModule;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/fesm2015/common.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/fesm2015/forms.js");
    /* harmony import */


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/dist/fesm5.js");
    /* harmony import */


    var _job_roles_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./job-roles-routing.module */
    "./src/app/pages/job-roles/job-roles-routing.module.ts");
    /* harmony import */


    var _job_roles_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./job-roles.page */
    "./src/app/pages/job-roles/job-roles.page.ts");
    /* harmony import */


    var src_app_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! src/app/shared.module */
    "./src/app/shared.module.ts");

    var JobRolesPageModule = function JobRolesPageModule() {
      _classCallCheck(this, JobRolesPageModule);
    };

    JobRolesPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"], src_app_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"], _job_roles_routing_module__WEBPACK_IMPORTED_MODULE_5__["JobRolesPageRoutingModule"]],
      declarations: [_job_roles_page__WEBPACK_IMPORTED_MODULE_6__["JobRolesPage"]]
    })], JobRolesPageModule);
    /***/
  },

  /***/
  "./src/app/pages/job-roles/job-roles.page.scss":
  /*!*****************************************************!*\
    !*** ./src/app/pages/job-roles/job-roles.page.scss ***!
    \*****************************************************/

  /*! exports provided: default */

  /***/
  function srcAppPagesJobRolesJobRolesPageScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".card-title-header {\n  font-size: 1.5em;\n  width: 90%;\n  font-weight: bold;\n  color: darkblue;\n  text-transform: uppercase;\n  opacity: 0.7;\n}\n\n.card-prospect {\n  border-radius: 0.8em;\n  border: solid 0.15em #FFFFFF;\n  width: 100%;\n}\n\n.card-prospect .prospect-header {\n  font-size: 1.2em;\n  width: 100%;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.9;\n}\n\n.table-row .table-header {\n  background: #99b7f0e0 !important;\n  color: #0a0909fb !important;\n  font-weight: bold;\n}\n\n.table-row ion-col {\n  border: solid 0.1em #FFFFFF;\n  font-size: 1.3em;\n}\n\n.table-row ion-row:nth-of-type(odd) {\n  background: #fafafaf6;\n  color: #202020;\n  opacity: 0.9;\n}\n\n.table-row ion-row:nth-of-type(even) {\n  background: #e6f5f8;\n  color: #202020;\n  opacity: 0.7;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvam9iLXJvbGVzL0Q6XFxESU5ITlZcXE15RGF0YVxcTEFQVFJJTkhcXE5PREU0XFxpb25pYzQucWxuc1xcY2xpZW50L3NyY1xcYXBwXFxwYWdlc1xcam9iLXJvbGVzXFxqb2Itcm9sZXMucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9qb2Itcm9sZXMvam9iLXJvbGVzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNJLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO0VBQ0EsWUFBQTtBQ0FKOztBRElBO0VBQ0ksb0JBQUE7RUFDQSw0QkFBQTtFQUNBLFdBQUE7QUNESjs7QURLQTtFQUNJLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FDRko7O0FETUE7RUFDSSxnQ0FBQTtFQUNBLDJCQUFBO0VBQ0EsaUJBQUE7QUNISjs7QURNQTtFQUNJLDJCQUFBO0VBQ0EsZ0JBQUE7QUNISjs7QURNQTtFQUNJLHFCQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISjs7QURNQTtFQUNJLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2pvYi1yb2xlcy9qb2Itcm9sZXMucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy90aGnhur90IGzhuq1wIGNo4buvIGNobyB0acOqdSDEkeG7gSBjw7RuZyB0eVxyXG4uY2FyZC10aXRsZS1oZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiAxLjVlbTtcclxuICAgIHdpZHRoOiA5MCU7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiBkYXJrYmx1ZTtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn1cclxuXHJcbi8vVGhp4bq/dCBs4bqtcCBraHVuZyBu4buBbiB2w6AgY+G7oSBjaOG7ryBjaG8gY2FyZCB2aeG7hW4gY+G6o25oXHJcbi5jYXJkLXByb3NwZWN0e1xyXG4gICAgYm9yZGVyLXJhZGl1czogMC44ZW07XHJcbiAgICBib3JkZXI6IHNvbGlkIDAuMTVlbSAjRkZGRkZGO1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICAgIC8vb3BhY2l0eTogMC44O1xyXG59XHJcblxyXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcclxuICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIG9wYWNpdHk6IDAuOTtcclxufVxyXG5cclxuLy9UaGnhur90IGzhuq1wIGTDsm5nIGNo4bq1biBs4bq7IGNobyBi4bqjbmdcclxuLnRhYmxlLXJvdyAudGFibGUtaGVhZGVyIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xyXG4gICAgY29sb3I6IzBhMDkwOWZiICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxufVxyXG5cclxuLnRhYmxlLXJvdyBpb24tY29sIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJvcmRlcjogc29saWQgMC4xZW0gI0ZGRkZGRjtcclxuICAgIGZvbnQtc2l6ZTogMS4zZW07XHJcbn1cclxuXHJcbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHsgLy9kw7JuZyBs4bq7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmFmYWZhZjY7XHJcbiAgICBjb2xvcjojMjAyMDIwO1xyXG4gICAgb3BhY2l0eTogMC45O1xyXG59XHJcblxyXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikgeyAvL2TDsm5nIGNo4bq1blxyXG4gICAgYmFja2dyb3VuZDogI2U2ZjVmODtcclxuICAgIGNvbG9yOiMyMDIwMjA7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn0iLCIuY2FyZC10aXRsZS1oZWFkZXIge1xuICBmb250LXNpemU6IDEuNWVtO1xuICB3aWR0aDogOTAlO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IGRhcmtibHVlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjc7XG59XG5cbi5jYXJkLXByb3NwZWN0IHtcbiAgYm9yZGVyLXJhZGl1czogMC44ZW07XG4gIGJvcmRlcjogc29saWQgMC4xNWVtICNGRkZGRkY7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcbiAgZm9udC1zaXplOiAxLjJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjk7XG59XG5cbi50YWJsZS1yb3cgLnRhYmxlLWhlYWRlciB7XG4gIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xuICBjb2xvcjogIzBhMDkwOWZiICFpbXBvcnRhbnQ7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4udGFibGUtcm93IGlvbi1jb2wge1xuICBib3JkZXI6IHNvbGlkIDAuMWVtICNGRkZGRkY7XG4gIGZvbnQtc2l6ZTogMS4zZW07XG59XG5cbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHtcbiAgYmFja2dyb3VuZDogI2ZhZmFmYWY2O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC45O1xufVxuXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikge1xuICBiYWNrZ3JvdW5kOiAjZTZmNWY4O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC43O1xufSJdfQ== */";
    /***/
  },

  /***/
  "./src/app/pages/job-roles/job-roles.page.ts":
  /*!***************************************************!*\
    !*** ./src/app/pages/job-roles/job-roles.page.ts ***!
    \***************************************************/

  /*! exports provided: JobRolesPage */

  /***/
  function srcAppPagesJobRolesJobRolesPageTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "JobRolesPage", function () {
      return JobRolesPage;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ngxi4-dynamic-service */
    "./node_modules/ngxi4-dynamic-service/fesm2015/ngxi4-dynamic-service.js");

    var JobRolesPage = /*#__PURE__*/function () {
      function JobRolesPage(apiAuth, apiCommon) {
        _classCallCheck(this, JobRolesPage);

        this.apiAuth = apiAuth;
        this.apiCommon = apiCommon;
        /**
         * Hàm xử lý kết quả post sửa thêm
         */

        this.callbackKpi = function (res) {
          var _this = this;

          //console.log(res);
          return new Promise(function (resolve, reject) {
            if (res.error) {
              _this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
            } else if (res.ajax) {//Khi thay đổi cần gọi ajax thì nó gọi cái này
              //ta không cần refresh trang
            } else {
              //lấy lại kết quả đã tính toán
              _this.onChangeSelect();
            }

            resolve({
              next: "CLOSE"
            });
          });
        }.bind(this);
      }

      _createClass(JobRolesPage, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          this.refreshNews();
        }
      }, {
        key: "refreshNews",
        value: function refreshNews() {
          return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-organizations", true);

                  case 3:
                    this.organizations = _context.sent;
                    _context.next = 6;
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-user-report", true);

                  case 6:
                    this.userReport = _context.sent;
                    // console.log(this.userReport);
                    this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0;
                    _context.next = 12;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context["catch"](0);

                  case 12:
                    this.onChangeSelect();

                  case 13:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this, [[0, 10]]);
          }));
        }
        /**
         * Khi có thay đổi chọn đơn vị cấp Cty
         */

      }, {
        key: "onChangeSelect",
        value: function onChangeSelect() {
          return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var _this2 = this;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    this.organizationsTree = [];
                    this.jobRolesTree = [];
                    _context2.prev = 2;
                    _context2.next = 5;
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-job-roles");

                  case 5:
                    this.jobRoles = _context2.sent;

                    // console.log(this.jobRoles);
                    // Chuyển thành cây chức danh
                    if (Array.isArray(this.jobRoles)) {
                      this.jobRolesTree = this.apiCommon.createTreeMenu(this.jobRoles, 'id', 'parent_id'); // console.log(this.jobRolesTree);
                    } // thêm thuộc tính click_type và main_tree cho cây chính


                    this.organizations.forEach(function (el) {
                      el.click_type = 1; //cây chính cho click luôn

                      if (_this2.jobRolesTree && el.id + '' !== '' + _this2.organizationId) {
                        el.subs = _this2.jobRolesTree.filter(function (x) {
                          return x.organization_id === el.id;
                        }); //mảng con được ghép vào
                      }

                      el.main_tree = 1; //cây chính
                    }); // console.log(this.organizations);
                    // chuyển thành cây tổ chức và chức danh

                    this.organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id'); // console.log(this.organizationsTree);
                    // ghép chức danh giám đốc vào

                    this.organizationsTree.forEach(function (el) {
                      if (_this2.jobRolesTree && el.id + '' === '' + _this2.organizationId) {
                        var rootSubs = _this2.jobRolesTree.filter(function (x) {
                          return x.organization_id === el.id;
                        });

                        if (!el.subs) el.subs = rootSubs;
                        rootSubs.forEach(function (elsub) {
                          var index = el.subs.findIndex(function (x) {
                            return x.id === elsub.id && x.organization_id == elsub.organization_id;
                          });

                          if (index >= 0) {
                            el.subs.splice(index, 1, elsub);
                          } else {
                            el.subs.unshift(elsub);
                          }
                        });
                      }
                    });
                    _context2.next = 15;
                    break;

                  case 12:
                    _context2.prev = 12;
                    _context2.t0 = _context2["catch"](2);
                    console.log('Error:', _context2.t0);

                  case 15:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this, [[2, 12]]);
          }));
        }
        /**
         * Click vào nội dung cấp Công ty/Trung tâm
         * @param ev
         * @param card
         */

      }, {
        key: "onClickSpec",
        value: function onClickSpec(ev, card) {
          var _this3 = this;

          //console.log(card);
          var menu = [{
            name: "Thêm chức danh GĐ",
            value: "add-child",
            icon: {
              name: "md-add",
              color: "secondary"
            }
          }]; //Thực hiện hiển thị menu

          this.apiCommon.presentPopover(ev, ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["PopoverCardComponent"], {
            type: 'single-choice',
            title: "Chọn chức năng",
            color: "primary",
            menu: menu
          }).then(function (data) {
            // console.log(data);
            _this3.processKpiDetails(data, card);
          })["catch"](function (err) {
            console.log('err: ', err);
          });
        }
        /**
         * Click vào đơn vị cấp con
         * @param event
         */

      }, {
        key: "onClickTreeItem",
        value: function onClickTreeItem(event) {
          var _this4 = this;

          //Khai báo menu popup
          var menu; //cây chức danh thuần
          // console.log(event.item);

          if (!event.item.main_tree) {
            menu = [{
              icon: {
                name: "md-create",
                color: "primary"
              },
              name: "Chỉnh sửa chức danh",
              value: "edit-owner"
            }, {
              icon: {
                name: "md-add",
                color: "secondary"
              },
              name: "Thêm chức danh con",
              value: "add-child"
            }, {
              icon: {
                name: "trash",
                color: "danger"
              },
              name: event.item.status === 1 ? "Khóa bỏ chức danh" : "Kích hoạt chức danh",
              value: "stop-owner"
            }];
          } else {
            menu = [{
              icon: {
                name: "md-add",
                color: "secondary"
              },
              name: "Thêm chức danh TP",
              value: "add-child"
            }];
          } //Thực hiện hiển thị menu


          this.apiCommon.presentPopover(event.event, ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["PopoverCardComponent"], {
            type: 'single-choice',
            title: "Chọn chức năng",
            color: "primary",
            menu: menu
          }).then(function (data) {
            // console.log(data);
            _this4.processKpiDetails(data, event.item);
          })["catch"](function (err) {
            console.log('err: ', err);
          });
        }
        /**
         * Xử lý từng lệnh
         * @param cmd
         * @param item
         */

      }, {
        key: "processKpiDetails",
        value: function processKpiDetails(cmd, item) {
          //thêm tham số
          if (cmd.value === 'add-child') {
            var itemNew = {
              id: -1,
              parent_id: item.main_tree === 1 ? undefined : item.id,
              organization_id: item.organization_id ? item.organization_id : item.id,
              table_name: 'job_roles',
              wheres: [],
              title_name: item.name //tên của cấp cha

            };
            this.addNewItem(itemNew, 'add');
          } //sửa tham số


          if (cmd.value === 'edit-owner') {
            item.table_name = 'job_roles'; //tên bảng cần đưa vào

            item.wheres = ['id']; //Mệnh đề wheres để update = '';

            item.title_name = 'Chức danh';
            this.addNewItem(item, 'edit');
          } //tạm dừng tham số


          if (cmd.value === 'stop-owner') {
            item.table_name = 'job_roles'; //tên bảng cần đưa vào

            item.wheres = ['id']; //Mệnh đề wheres để update = '';

            this.stopItem(item);
          }
        }
        /**
         * Dừng đối tượng này
         * @param item
         */

      }, {
        key: "stopItem",
        value: function stopItem(item) {
          var form = {
            title: "Thay đổi trạng thái",
            buttons: [{
              color: "danger",
              icon: "close",
              next: "CLOSE"
            }],
            items: [{
              type: "title",
              name: item.name
            }, {
              type: "hidden",
              key: "id",
              value: item.id
            } //đối tượng để update
            , {
              type: "hidden",
              key: "table_name",
              value: item.table_name
            }, {
              type: "hidden",
              key: "wheres",
              value: item.wheres
            }, {
              type: "datetime",
              key: "end_date",
              value: item.end_date,
              name: "Chọn ngày kết thúc",
              display: "DD/MM/YYYY",
              picker: "DD/MM/YYYY"
            }, {
              type: "toggle",
              key: "status",
              name: item.status ? "Tạm ngưng?" : "Kích hoạt?",
              value: item.status,
              color: "secondary",
              icon: "ios-hand-outline"
            }, {
              type: "button",
              options: [{
                name: 'Cập nhập',
                next: "CALLBACK",
                url: this.apiAuth.serviceUrls.RESOURCE_SERVER + "/post-parameters"
              }]
            }]
          };
          this.apiCommon.openModal(ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["DynamicFormMobilePage"], {
            parent: this,
            form: form,
            callback: this.callbackKpi
          });
        }
        /**
         * Thêm hoặc sửa chức danh
         * @param item
         */

      }, {
        key: "addNewItem",
        value: function addNewItem(item, type) {
          var form = {
            title: (type === 'add' ? 'THÊM' : 'SỬA') + " DANH MỤC",
            buttons: [{
              color: "danger",
              icon: "close",
              next: "CLOSE"
            }],
            items: [{
              type: "title",
              name: item.title_name
            }, {
              type: "hidden",
              key: "id",
              value: item.id
            }, {
              type: "hidden",
              key: "parent_id",
              value: item.parent_id
            }, {
              type: "hidden",
              key: "organization_id",
              value: item.organization_id
            }, {
              type: "hidden",
              key: "table_name",
              value: item.table_name
            }, {
              type: "hidden",
              key: "wheres",
              value: item.wheres
            }, {
              type: "text",
              key: "short_name",
              value: item.short_name,
              name: "Nhóm chức danh",
              input_type: "text",
              icon: "ios-people",
              validators: [{
                required: true,
                min: 2,
                max: 20
              }],
              hint: "Mã nhóm viết tắt vd: TT-VT để nhóm cùng loại khác đơn vị"
            }, {
              type: "text",
              key: "name",
              value: item.name,
              name: "Tên chức danh",
              input_type: "text",
              icon: "ios-people",
              validators: [{
                required: true,
                min: 5,
                max: 100
              }],
              hint: "Độ dài tên cho phép từ 5 đến 100 ký tự"
            }, {
              type: "text_area",
              key: "description",
              value: item.description,
              name: "Mô tả công việc của chức danh này",
              input_type: "text",
              icon: "md-alert",
              hint: "Nhập mô tả chức danh này để ghi nhớ, công việc làm gì"
            }, {
              type: "button",
              options: [{
                name: "Reset",
                next: "RESET"
              }, {
                name: type === 'add' ? 'Tạo mới' : 'Chỉnh sửa',
                next: "CALLBACK",
                url: this.apiAuth.serviceUrls.RESOURCE_SERVER + "/post-parameters"
              }]
            }]
          };
          this.apiCommon.openModal(ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["DynamicFormMobilePage"], {
            parent: this,
            form: form,
            callback: this.callbackKpi
          });
        }
      }]);

      return JobRolesPage;
    }();

    JobRolesPage.ctorParameters = function () {
      return [{
        type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]
      }, {
        type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]
      }];
    };

    JobRolesPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-job-roles',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./job-roles.page.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/job-roles/job-roles.page.html"))["default"],
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./job-roles.page.scss */
      "./src/app/pages/job-roles/job-roles.page.scss"))["default"]]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]])], JobRolesPage);
    /***/
  }
}]);
//# sourceMappingURL=pages-job-roles-job-roles-module-es5.js.map
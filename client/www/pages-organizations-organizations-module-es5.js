function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-organizations-organizations-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html":
  /*!***************************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html ***!
    \***************************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppPagesOrganizationsOrganizationsPageHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n\r\n    <ion-buttons slot=\"start\">\r\n      <ion-menu-button></ion-menu-button>\r\n      <ion-back-button></ion-back-button>\r\n      <ion-button>\r\n        <input class=\"file-over\" type=\"file\" (change)=\"onClickUpload($event)\"\r\n          accept=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel\" />\r\n        <ion-icon name=\"cloud-upload\"></ion-icon>\r\n      </ion-button>\r\n    </ion-buttons>\r\n\r\n    <ion-title>MÔ HÌNH TỔ CHỨC</ion-title>\r\n\r\n    <ion-buttons slot=\"end\">\r\n      <ion-button (click)=\"onClickDownload()\">\r\n        <ion-icon name=\"cloud-download\"></ion-icon>\r\n      </ion-button>\r\n    </ion-buttons>\r\n\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content>\r\n  <ion-row>\r\n    <ion-col size=\"12\" class=\"card-prospect\" *ngFor=\"let item of organizationsTree\"\r\n      [style.background]=\"'#fafafaf6'\">\r\n      <ion-row (click)=\"onClickSpec($event, item)\">\r\n        <ion-col size=\"10\" class=\"prospect-header\" [style.color]=\"'darkblue'\">\r\n          <ion-icon *ngIf=\"item.click_type\" style=\"font-size: 1em\" [style.color]=\"'lightblue'\" name=\"md-cloud-upload\">\r\n          </ion-icon>{{item.name}}\r\n        </ion-col>\r\n        <ion-col size=\"2\" class=\"prospect-header\" [style.color]=\"'darkblue'\">\r\n          {{item.id}}\r\n        </ion-col>\r\n      </ion-row>\r\n\r\n      <tree-list [treeData]=\"item.subs\" (onClickKpi)=\"onClickTreeItem($event)\"></tree-list>\r\n\r\n    </ion-col>\r\n  </ion-row>\r\n</ion-content>";
    /***/
  },

  /***/
  "./src/app/pages/organizations/organizations.module.ts":
  /*!*************************************************************!*\
    !*** ./src/app/pages/organizations/organizations.module.ts ***!
    \*************************************************************/

  /*! exports provided: OrganizationsPageModule */

  /***/
  function srcAppPagesOrganizationsOrganizationsModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "OrganizationsPageModule", function () {
      return OrganizationsPageModule;
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


    var _organizations_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./organizations.page */
    "./src/app/pages/organizations/organizations.page.ts");
    /* harmony import */


    var _shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../../shared.module */
    "./src/app/shared.module.ts");

    var OrganizationsPageModule = function OrganizationsPageModule() {
      _classCallCheck(this, OrganizationsPageModule);
    };

    OrganizationsPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_shared_module__WEBPACK_IMPORTED_MODULE_4__["SharedModule"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([{
        path: '',
        component: _organizations_page__WEBPACK_IMPORTED_MODULE_3__["OrganizationsPage"]
      }])],
      declarations: [_organizations_page__WEBPACK_IMPORTED_MODULE_3__["OrganizationsPage"]]
    })], OrganizationsPageModule);
    /***/
  },

  /***/
  "./src/app/pages/organizations/organizations.page.scss":
  /*!*************************************************************!*\
    !*** ./src/app/pages/organizations/organizations.page.scss ***!
    \*************************************************************/

  /*! exports provided: default */

  /***/
  function srcAppPagesOrganizationsOrganizationsPageScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".card-title-header {\n  font-size: 1.5em;\n  width: 90%;\n  font-weight: bold;\n  color: darkblue;\n  text-transform: uppercase;\n  opacity: 0.7;\n}\n\n.card-prospect {\n  border-radius: 0.8em;\n  border: solid 0.15em #FFFFFF;\n  width: 100%;\n}\n\n.card-prospect .prospect-header {\n  font-size: 1.2em;\n  width: 100%;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.9;\n}\n\n.table-row .table-header {\n  background: #99b7f0e0 !important;\n  color: #0a0909fb !important;\n  font-weight: bold;\n}\n\n.table-row ion-col {\n  border: solid 0.1em #FFFFFF;\n  font-size: 1.3em;\n}\n\n.table-row ion-row:nth-of-type(odd) {\n  background: #fafafaf6;\n  color: #202020;\n  opacity: 0.9;\n}\n\n.table-row ion-row:nth-of-type(even) {\n  background: #e6f5f8;\n  color: #202020;\n  opacity: 0.7;\n}\n\n.file-over {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  width: 100%;\n  height: 100%;\n  opacity: 1;\n  cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvb3JnYW5pemF0aW9ucy9EOlxcTVlEQVRBXFxMYXBUcmluaERpRG9uZ1xcTk9ERTRcXG5vZGU0LXFsbnNcXGNsaWVudC9zcmNcXGFwcFxccGFnZXNcXG9yZ2FuaXphdGlvbnNcXG9yZ2FuaXphdGlvbnMucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9vcmdhbml6YXRpb25zL29yZ2FuaXphdGlvbnMucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksZ0JBQUE7RUFDQSxVQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FDQUo7O0FESUE7RUFDSSxvQkFBQTtFQUNBLDRCQUFBO0VBQ0EsV0FBQTtBQ0RKOztBREtBO0VBQ0ksZ0JBQUE7RUFDQSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSx5QkFBQTtFQUNBLFlBQUE7QUNGSjs7QURNQTtFQUNJLGdDQUFBO0VBQ0EsMkJBQUE7RUFDQSxpQkFBQTtBQ0hKOztBRE1BO0VBQ0ksMkJBQUE7RUFDQSxnQkFBQTtBQ0hKOztBRE1BO0VBQ0kscUJBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtBQ0hKOztBRE1BO0VBQ0ksbUJBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtBQ0hKOztBRE1BO0VBQ0ksa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7RUFDQSxlQUFBO0FDSEoiLCJmaWxlIjoic3JjL2FwcC9wYWdlcy9vcmdhbml6YXRpb25zL29yZ2FuaXphdGlvbnMucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy90aGnhur90IGzhuq1wIGNo4buvIGNobyB0acOqdSDEkeG7gSBjw7RuZyB0eVxyXG4uY2FyZC10aXRsZS1oZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiAxLjVlbTtcclxuICAgIHdpZHRoOiA5MCU7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiBkYXJrYmx1ZTtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn1cclxuXHJcbi8vVGhp4bq/dCBs4bqtcCBraHVuZyBu4buBbiB2w6AgY+G7oSBjaOG7ryBjaG8gY2FyZCB2aeG7hW4gY+G6o25oXHJcbi5jYXJkLXByb3NwZWN0e1xyXG4gICAgYm9yZGVyLXJhZGl1czogMC44ZW07XHJcbiAgICBib3JkZXI6IHNvbGlkIDAuMTVlbSAjRkZGRkZGO1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICAgIC8vb3BhY2l0eTogMC44O1xyXG59XHJcblxyXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcclxuICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIG9wYWNpdHk6IDAuOTtcclxufVxyXG5cclxuLy9UaGnhur90IGzhuq1wIGTDsm5nIGNo4bq1biBs4bq7IGNobyBi4bqjbmdcclxuLnRhYmxlLXJvdyAudGFibGUtaGVhZGVyIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xyXG4gICAgY29sb3I6IzBhMDkwOWZiICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxufVxyXG5cclxuLnRhYmxlLXJvdyBpb24tY29sIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJvcmRlcjogc29saWQgMC4xZW0gI0ZGRkZGRjtcclxuICAgIGZvbnQtc2l6ZTogMS4zZW07XHJcbn1cclxuXHJcbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHsgLy9kw7JuZyBs4bq7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmFmYWZhZjY7XHJcbiAgICBjb2xvcjojMjAyMDIwO1xyXG4gICAgb3BhY2l0eTogMC45O1xyXG59XHJcblxyXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikgeyAvL2TDsm5nIGNo4bq1blxyXG4gICAgYmFja2dyb3VuZDogI2U2ZjVmODtcclxuICAgIGNvbG9yOiMyMDIwMjA7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn1cclxuXHJcbi5maWxlLW92ZXIge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHotaW5kZXg6IDI7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn0iLCIuY2FyZC10aXRsZS1oZWFkZXIge1xuICBmb250LXNpemU6IDEuNWVtO1xuICB3aWR0aDogOTAlO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IGRhcmtibHVlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjc7XG59XG5cbi5jYXJkLXByb3NwZWN0IHtcbiAgYm9yZGVyLXJhZGl1czogMC44ZW07XG4gIGJvcmRlcjogc29saWQgMC4xNWVtICNGRkZGRkY7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcbiAgZm9udC1zaXplOiAxLjJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjk7XG59XG5cbi50YWJsZS1yb3cgLnRhYmxlLWhlYWRlciB7XG4gIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xuICBjb2xvcjogIzBhMDkwOWZiICFpbXBvcnRhbnQ7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4udGFibGUtcm93IGlvbi1jb2wge1xuICBib3JkZXI6IHNvbGlkIDAuMWVtICNGRkZGRkY7XG4gIGZvbnQtc2l6ZTogMS4zZW07XG59XG5cbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHtcbiAgYmFja2dyb3VuZDogI2ZhZmFmYWY2O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC45O1xufVxuXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikge1xuICBiYWNrZ3JvdW5kOiAjZTZmNWY4O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC43O1xufVxuXG4uZmlsZS1vdmVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHotaW5kZXg6IDI7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG9wYWNpdHk6IDE7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn0iXX0= */";
    /***/
  },

  /***/
  "./src/app/pages/organizations/organizations.page.ts":
  /*!***********************************************************!*\
    !*** ./src/app/pages/organizations/organizations.page.ts ***!
    \***********************************************************/

  /*! exports provided: OrganizationsPage */

  /***/
  function srcAppPagesOrganizationsOrganizationsPageTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "OrganizationsPage", function () {
      return OrganizationsPage;
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
    /* harmony import */


    var src_app_services_api_download_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! src/app/services/api-download.service */
    "./src/app/services/api-download.service.ts");
    /* harmony import */


    var src_app_services_api_excel_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! src/app/services/api-excel.service */
    "./src/app/services/api-excel.service.ts");
    /* harmony import */


    var exceljs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! exceljs */
    "./node_modules/exceljs/dist/exceljs.min.js");
    /* harmony import */


    var exceljs__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_5__);

    var config = {
      sheet_name: {
        value: "organizations"
      },
      noId: {
        value: "A"
      },
      name: {
        value: "B"
      },
      short_name: {
        value: "C"
      },
      description: {
        value: "D"
      },
      id: {
        value: "E"
      },
      parent_id: {
        value: "F"
      }
    };

    var OrganizationsPage = /*#__PURE__*/function () {
      function OrganizationsPage(apiAuth, apiCommon, apiDownload, apiExcel) {
        var _this = this;

        _classCallCheck(this, OrganizationsPage);

        this.apiAuth = apiAuth;
        this.apiCommon = apiCommon;
        this.apiDownload = apiDownload;
        this.apiExcel = apiExcel;
        /**
         * Hàm xử lý kết quả post sửa thêm
         */

        this.callbackProcess = function (res) {
          // console.log(res);
          return new Promise(function (resolve) {
            if (res.error) {
              _this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
            } else {
              //lấy lại kết quả đã tính toán
              _this.refreshNews();
            }

            resolve({
              next: "CLOSE"
            });
          });
        };
        /**
         * Hàm xử lý gọi lại download
         */


        this.callbackDownload = function (ws, config) {
          var _this2 = this;

          return new Promise(function (resolve) {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](_this2, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var result;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return this.apiExcel.processWriteExcel(this.organizationsTree, ws, config);

                    case 3:
                      result = _context.sent;
                      resolve({
                        status: "OK",
                        message: "Xử lý thành công",
                        count: result.count
                      });
                      _context.next = 11;
                      break;

                    case 7:
                      _context.prev = 7;
                      _context.t0 = _context["catch"](0);
                      console.log("Lỗi xử lý dữ liệu callback process", _context.t0);
                      resolve({
                        status: "NOK",
                        error: _context.t0
                      });

                    case 11:
                      _context.prev = 11;
                      return _context.finish(11);

                    case 13:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this, [[0, 7, 11, 13]]);
            }));
          });
        }.bind(this);

        this.convertColExcel2Number = function (val) {
          var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
              i,
              j,
              result = 0;

          for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
            result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
          }

          return result;
        };
      }

      _createClass(OrganizationsPage, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          this.refreshNews();
        }
      }, {
        key: "refreshNews",
        value: function refreshNews() {
          return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var _this3 = this;

            var organizationsTree;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    _context2.next = 3;
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-user-report");

                  case 3:
                    this.userReport = _context2.sent;
                    _context2.next = 6;
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-organizations");

                  case 6:
                    this.organizations = _context2.sent;

                    // console.log(this.organizations);
                    if (Array.isArray(this.organizations)) {
                      this.organizations.forEach(function (el) {
                        el.click_type = 2;
                      }); // Dùng service để chuyển thành cây tổ chức

                      organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id'); // console.log(organizationsTree);
                      // Lấy cây tổ chức theo userReport.organization_id

                      if (this.userReport && Array.isArray(organizationsTree)) {
                        this.organizationsTree = organizationsTree.filter(function (x) {
                          return x.id === _this3.userReport.organization_id;
                        });
                      } else {
                        this.organizationsTree = organizationsTree;
                      } // console.log(this.organizationsTree);

                    }

                    _context2.next = 12;
                    break;

                  case 10:
                    _context2.prev = 10;
                    _context2.t0 = _context2["catch"](0);

                  case 12:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this, [[0, 10]]);
          }));
        }
        /**
         * Click vào nội dung cấp Công ty/Trung tâm
         * @param ev
         * @param card
         */

      }, {
        key: "onClickSpec",
        value: function onClickSpec(ev, item) {
          var _this4 = this;

          var menu = [{
            name: "Thêm đơn vị phụ thuộc",
            value: "add-child",
            icon: {
              name: "md-add",
              color: "secondary"
            }
          }, {
            name: "Chỉnh sửa thông tin",
            value: "edit-owner",
            icon: {
              name: "md-create",
              color: "primary"
            }
          }]; //Thực hiện hiển thị menu

          this.apiCommon.presentPopover(ev, ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["PopoverCardComponent"], {
            type: 'single-choice',
            title: "Chọn chức năng",
            color: "primary",
            menu: menu
          }).then(function (data) {
            // console.log(data);
            _this4.processDetails(data, item);
          })["catch"](function (err) {
            console.log('err: ', err);
          });
        }
        /**
         * Kích vào nội dung cấp con (tổ chức)
         * @param event
         */

      }, {
        key: "onClickTreeItem",
        value: function onClickTreeItem(event) {
          var _this5 = this;

          // console.log(event);
          //Khai báo menu popup
          var menu = [{
            name: "Chỉnh sửa thông tin",
            value: "edit-owner",
            icon: {
              name: "md-create",
              color: "primary"
            }
          }, {
            name: event.item.status === 1 ? "Loại bỏ đơn vị" : "Kích hoạt đơn vị",
            value: "stop-owner",
            icon: {
              name: "trash",
              color: "danger"
            }
          }]; //Thực hiện hiển thị menu

          this.apiCommon.presentPopover(event.event, ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["PopoverCardComponent"], {
            type: 'single-choice',
            title: "Chọn chức năng",
            color: "primary",
            menu: menu
          }).then(function (data) {
            // console.log(data);
            _this5.processDetails(data, event.item);
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
        key: "processDetails",
        value: function processDetails(cmd, item) {
          //thêm tham số
          if (cmd.value === 'add-child') {
            var itemNew = {
              id: -1,
              parent_id: item.id,
              table_name: 'organizations',
              wheres: [],
              title_name: item.name //tên của cấp cha

            };
            this.addNewItem(itemNew, 'add');
          } //sửa tham số


          if (cmd.value === 'edit-owner') {
            item.table_name = 'organizations'; //tên bảng cần đưa vào

            item.wheres = ['id']; //Mệnh đề wheres để update = '';

            item.title_name = item.name;
            this.addNewItem(item, 'edit');
          } //tạm dừng tham số


          if (cmd.value === 'stop-owner') {
            item.table_name = 'organizations'; //tên bảng cần đưa vào

            item.wheres = ['id']; //Mệnh đề wheres để update = '';

            this.stopItem(item);
          }
        }
        /**
         * Thêm hoặc sửa tham số
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
              key: "table_name",
              value: item.table_name
            }, {
              type: "hidden",
              key: "wheres",
              value: item.wheres
            }, {
              type: "text",
              key: "name",
              value: item.name,
              name: "Tên đơn vị",
              input_type: "text",
              icon: "logo-buffer",
              validators: [{
                required: true,
                min: 5,
                max: 100
              }],
              hint: "Độ dài tên cho phép từ 5 đến 100 ký tự"
            }, {
              type: "text",
              key: "short_name",
              value: item.short_name,
              name: "Tên viết tắt",
              input_type: "text",
              icon: "at",
              validators: [{
                required: true,
                min: 1,
                max: 6
              }],
              hint: "Độ dài tối đa 6 ký tự"
            }, {
              type: "text_area",
              key: "description",
              value: item.description,
              name: "Mô tả thông tin của đơn vị",
              input_type: "text",
              icon: "md-alert",
              hint: "Nhập mô tả này để ghi nhớ"
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
            callback: this.callbackProcess
          });
        }
        /**
         * Hàm loại bỏ/kích hoạt đơn vị
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
            }, {
              type: "hidden",
              key: "table_name",
              value: item.table_name
            }, {
              type: "hidden",
              key: "wheres",
              value: item.wheres
            }, {
              type: "datetime",
              key: "changed_date",
              value: item.changed_date,
              name: "Chọn ngày thay đổi trạng thái",
              display: "DD/MM/YYYY",
              picker: "DD/MM/YYYY"
            }, {
              type: "toggle",
              key: "status",
              name: item.status ? "Tạm ngưng?" : "Kích hoạt?",
              value: item.status,
              color: "secondary",
              icon: "hand"
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
            callback: this.callbackProcess
          });
        }
        /**
         * Download file excel xuống máy
         */

      }, {
        key: "onClickDownload",
        value: function onClickDownload() {
          var linkFile = this.apiAuth.serviceUrls.RESOURCE_SERVER + '/get-templates/sample-danhmuc-tochuc.xlsx';
          this.apiDownload.processFileDownload(linkFile, config.sheet_name.value, "excel", config, this.callbackDownload);
        }
        /**
         * Chọn file dữ liệu mẫu và upload để cập nhật CSDL
         * @param ev
         */

      }, {
        key: "onClickUpload",
        value: function onClickUpload(ev) {
          var _this6 = this;

          var arFile = ev.target.files; // console.log(arFile);

          var fr = new FileReader();
          fr.readAsArrayBuffer(arFile[0]);

          fr.onloadend = function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](_this6, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              var _this7 = this;

              var bufferData, wb, workbook, worksheet, results, returnFinish, _i, _results, el, jsonPost;

              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      bufferData = fr.result;
                      wb = new exceljs__WEBPACK_IMPORTED_MODULE_5__["Workbook"]();
                      _context3.prev = 2;
                      _context3.next = 5;
                      return wb.xlsx.load(bufferData);

                    case 5:
                      workbook = _context3.sent;
                      worksheet = workbook.getWorksheet(config.sheet_name.value);
                      results = [];
                      worksheet.eachRow(function (row, rowIndex) {
                        if (rowIndex > 3) {
                          var cols = {};

                          for (var key in config) {
                            var item = config[key];

                            if (key != "sheet_name") {
                              Object.defineProperty(cols, key, {
                                value: _this7.getValueFormula(row.values[_this7.convertColExcel2Number(item.value)])
                              });
                            }
                          }

                          results.push(cols);
                        }
                      }); // console.log(results);

                      returnFinish = {
                        count_success: 0,
                        count_fail: 0
                      };
                      _i = 0, _results = results;

                    case 11:
                      if (!(_i < _results.length)) {
                        _context3.next = 26;
                        break;
                      }

                      el = _results[_i];
                      jsonPost = {
                        name: el.name,
                        short_name: el.short_name,
                        description: el.description,
                        id: el.id,
                        parent_id: el.parent_id
                      }; // console.log(jsonPost);

                      _context3.prev = 14;
                      _context3.next = 17;
                      return this.apiAuth.postDynamicJson(this.apiAuth.serviceUrls.RESOURCE_SERVER + '/post-organizations', jsonPost);

                    case 17:
                      returnFinish.count_success++;
                      _context3.next = 23;
                      break;

                    case 20:
                      _context3.prev = 20;
                      _context3.t0 = _context3["catch"](14);
                      // console.log(err);
                      returnFinish.count_fail++;

                    case 23:
                      _i++;
                      _context3.next = 11;
                      break;

                    case 26:
                      console.log(returnFinish);
                      this.refreshNews();
                      _context3.next = 33;
                      break;

                    case 30:
                      _context3.prev = 30;
                      _context3.t1 = _context3["catch"](2);
                      console.log('Lỗi đọc file excel nguồn!', _context3.t1);

                    case 33:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, this, [[2, 30], [14, 20]]);
            }));
          };
        }
      }, {
        key: "getValueFormula",
        value: function getValueFormula(obj) {
          if (obj === null || obj === undefined) return null;

          if (typeof obj === 'object') {
            // xử lý chuyển đổi chỉ lấy text thôi
            if (obj.richText) return obj.richText.map(function (o) {
              return o["text"];
            }).join(""); // lấy giá trị bằng biểu thức function

            return obj.result;
          }

          return obj;
        }
      }]);

      return OrganizationsPage;
    }();

    OrganizationsPage.ctorParameters = function () {
      return [{
        type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]
      }, {
        type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]
      }, {
        type: src_app_services_api_download_service__WEBPACK_IMPORTED_MODULE_3__["ApiDownloadService"]
      }, {
        type: src_app_services_api_excel_service__WEBPACK_IMPORTED_MODULE_4__["ApiExcelService"]
      }];
    };

    OrganizationsPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-organizations',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./organizations.page.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html"))["default"],
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./organizations.page.scss */
      "./src/app/pages/organizations/organizations.page.scss"))["default"]]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"], src_app_services_api_download_service__WEBPACK_IMPORTED_MODULE_3__["ApiDownloadService"], src_app_services_api_excel_service__WEBPACK_IMPORTED_MODULE_4__["ApiExcelService"]])], OrganizationsPage);
    /***/
  },

  /***/
  "./src/app/services/api-download.service.ts":
  /*!**************************************************!*\
    !*** ./src/app/services/api-download.service.ts ***!
    \**************************************************/

  /*! exports provided: ApiDownloadService */

  /***/
  function srcAppServicesApiDownloadServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ApiDownloadService", function () {
      return ApiDownloadService;
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
    /* harmony import */


    var exceljs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! exceljs */
    "./node_modules/exceljs/dist/exceljs.min.js");
    /* harmony import */


    var exceljs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_3__);
    /* harmony import */


    var file_saver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! file-saver */
    "./node_modules/file-saver/dist/FileSaver.min.js");
    /* harmony import */


    var file_saver__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_4__);

    var ApiDownloadService = /*#__PURE__*/function () {
      function ApiDownloadService(apiAuth, apiCommon) {
        _classCallCheck(this, ApiDownloadService);

        this.apiAuth = apiAuth;
        this.apiCommon = apiCommon;
      }

      _createClass(ApiDownloadService, [{
        key: "processFileDownload",
        value: function processFileDownload(urlTemplateFile, sheet_name, file_name, config, callbackPromise) {
          var _this8 = this;

          this.apiAuth.getDynamicUrl(urlTemplateFile, '', {
            responseType: 'blob'
          }).then(function (blobData) {
            // console.log(blobData);
            var fr = new FileReader();
            fr.readAsArrayBuffer(blobData);

            fr.onloadend = function () {
              var bufferData = fr.result;
              var wb = new exceljs__WEBPACK_IMPORTED_MODULE_3__["Workbook"]();
              wb.xlsx.load(bufferData).then(function (workbook) {
                return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](_this8, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                  var _this9 = this;

                  var arrayOutput;
                  return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          // console.log(bufferData)
                          arrayOutput = [];
                          workbook.eachSheet(function (sheet) {
                            return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](_this9, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                              var ws, resultCallback;
                              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                while (1) {
                                  switch (_context4.prev = _context4.next) {
                                    case 0:
                                      if (!(sheet.name === sheet_name)) {
                                        _context4.next = 14;
                                        break;
                                      }

                                      _context4.prev = 1;
                                      ws = sheet;
                                      _context4.next = 5;
                                      return callbackPromise(ws, config);

                                    case 5:
                                      resultCallback = _context4.sent;
                                      arrayOutput.splice(arrayOutput.length, 0, resultCallback);
                                      _context4.next = 12;
                                      break;

                                    case 9:
                                      _context4.prev = 9;
                                      _context4.t0 = _context4["catch"](1);
                                      console.log('Lỗi xử lý dữ liệu', _context4.t0);

                                    case 12:
                                      _context4.next = 15;
                                      break;

                                    case 14:
                                      // ẩn các sheet không dùng đến
                                      sheet.state = 'hidden';

                                    case 15:
                                    case "end":
                                      return _context4.stop();
                                  }
                                }
                              }, _callee4, null, [[1, 9]]);
                            }));
                          }); // Đợi cho đến khi arrayOutput có dữ liệu mới đi tiếp

                          _context5.next = 4;
                          return this.apiCommon.delay(5000, arrayOutput);

                        case 4:
                          // console.log(arrayOutput);
                          if (arrayOutput.length > 0 && arrayOutput[0].status === "OK" && arrayOutput[0].count > 0) {
                            workbook.views = [{
                              x: 0,
                              y: 0,
                              width: 10000,
                              height: 20000,
                              firstSheet: 0,
                              activeTab: 0,
                              visibility: 'visible'
                            }];
                            workbook.xlsx.writeBuffer().then(function (data) {
                              var blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                              });
                              file_saver__WEBPACK_IMPORTED_MODULE_4__["saveAs"](blob, "".concat(file_name, "-").concat(sheet_name, "-").concat(Date.now(), ".xlsx"));
                            });
                          }

                        case 5:
                        case "end":
                          return _context5.stop();
                      }
                    }
                  }, _callee5, this);
                }));
              })["catch"](function (err) {
                console.log('Lỗi đọc dữ liệu blob', err);
              });
            };
          })["catch"](function (err) {
            console.log('Lỗi lấy file mẫu từ API', err);
          });
        }
      }]);

      return ApiDownloadService;
    }();

    ApiDownloadService.ctorParameters = function () {
      return [{
        type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]
      }, {
        type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]
      }];
    };

    ApiDownloadService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]])], ApiDownloadService);
    /***/
  },

  /***/
  "./src/app/services/api-excel.service.ts":
  /*!***********************************************!*\
    !*** ./src/app/services/api-excel.service.ts ***!
    \***********************************************/

  /*! exports provided: ApiExcelService */

  /***/
  function srcAppServicesApiExcelServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ApiExcelService", function () {
      return ApiExcelService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");

    var ApiExcelService = /*#__PURE__*/function () {
      function ApiExcelService() {
        _classCallCheck(this, ApiExcelService);
      }

      _createClass(ApiExcelService, [{
        key: "processWriteExcel",
        value: function processWriteExcel(data, ws, config) {
          return new Promise(function (resolve, reject) {
            try {
              // console.log(data);
              var row = ws.getRow(2);
              row.getCell("A").value = data[0].name;
              row.getCell("E").value = data[0].id; // Xác định bề rộng cho các cột

              ws.getColumn(1).width = 5;
              ws.getColumn(2).alignment = {
                wrapText: true
              };
              ws.getColumn(4).alignment = {
                wrapText: true
              };
              var index = 0;
              data[0].subs.forEach(function (el) {
                row = ws.getRow(index + 4);
                row.getCell(config.noId.value).value = index + 1;
                row.getCell(config.name.value).value = el.name;
                row.getCell(config.short_name.value).value = el.short_name;
                row.getCell(config.description.value).value = el.description;
                row.getCell(config.id.value).value = el.id;
                row.getCell(config.parent_id.value).value = el.parent_id;
                index++;
              });
              resolve({
                status: "OK",
                count: index
              });
            } catch (e) {
              console.log(e);
              reject({
                status: "NOK",
                error: e
              });
            }
          });
        }
      }]);

      return ApiExcelService;
    }();

    ApiExcelService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])], ApiExcelService);
    /***/
  }
}]);
//# sourceMappingURL=pages-organizations-organizations-module-es5.js.map
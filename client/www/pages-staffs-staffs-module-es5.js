function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-staffs-staffs-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/staffs/staffs.page.html":
  /*!*************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/staffs/staffs.page.html ***!
    \*************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppPagesStaffsStaffsPageHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-header>\n  <ion-toolbar color=\"primary\">\n\n    <ion-buttons slot=\"start\">\n      <ion-menu-button></ion-menu-button>\n      <ion-back-button></ion-back-button>\n    </ion-buttons>\n\n    <ion-title>CÂY NHÂN SỰ</ion-title>\n\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class=\"ion-no-padding\">\n  <ion-row>\n    <ion-col class=\"ion-text-center\" size=\"12\" class=\"card-prospect\" *ngFor=\"let item of organizationsTree\"\n      [style.background]=\"(item.background?item.background:'#fafafaf6')\">\n\n      <ion-row (click)=\"onClickSpec($event, item)\">\n        <ion-col size=\"10\" class=\"prospect-header\" [style.color]=\"(item.color?item.color:'darkblue')\">\n          <ion-icon item-start *ngIf=\"item.click_type\" style=\"font-size: 1em\" [style.color]=\"'lightblue'\"\n            name=\"md-cloud-upload\"></ion-icon>{{item.name}}\n        </ion-col>\n        <ion-col size=\"2\" class=\"prospect-header\" [style.color]=\"(item.color?item.color:'darkblue')\">\n          {{item.status}}\n        </ion-col>\n      </ion-row>\n\n      <tree-list [treeData]=\"item.subs\" (onClickKpi)=\"onClickTreeItem($event)\"></tree-list>\n\n    </ion-col>\n\n  </ion-row>\n</ion-content>\n";
    /***/
  },

  /***/
  "./src/app/pages/staffs/staffs-routing.module.ts":
  /*!*******************************************************!*\
    !*** ./src/app/pages/staffs/staffs-routing.module.ts ***!
    \*******************************************************/

  /*! exports provided: StaffsPageRoutingModule */

  /***/
  function srcAppPagesStaffsStaffsRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "StaffsPageRoutingModule", function () {
      return StaffsPageRoutingModule;
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


    var _staffs_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./staffs.page */
    "./src/app/pages/staffs/staffs.page.ts");

    var routes = [{
      path: '',
      component: _staffs_page__WEBPACK_IMPORTED_MODULE_3__["StaffsPage"]
    }];

    var StaffsPageRoutingModule = function StaffsPageRoutingModule() {
      _classCallCheck(this, StaffsPageRoutingModule);
    };

    StaffsPageRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
      exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })], StaffsPageRoutingModule);
    /***/
  },

  /***/
  "./src/app/pages/staffs/staffs.module.ts":
  /*!***********************************************!*\
    !*** ./src/app/pages/staffs/staffs.module.ts ***!
    \***********************************************/

  /*! exports provided: StaffsPageModule */

  /***/
  function srcAppPagesStaffsStaffsModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "StaffsPageModule", function () {
      return StaffsPageModule;
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


    var _staffs_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./staffs-routing.module */
    "./src/app/pages/staffs/staffs-routing.module.ts");
    /* harmony import */


    var _staffs_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./staffs.page */
    "./src/app/pages/staffs/staffs.page.ts");
    /* harmony import */


    var src_app_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! src/app/shared.module */
    "./src/app/shared.module.ts");

    var StaffsPageModule = function StaffsPageModule() {
      _classCallCheck(this, StaffsPageModule);
    };

    StaffsPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"], src_app_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"], _staffs_routing_module__WEBPACK_IMPORTED_MODULE_5__["StaffsPageRoutingModule"]],
      declarations: [_staffs_page__WEBPACK_IMPORTED_MODULE_6__["StaffsPage"]]
    })], StaffsPageModule);
    /***/
  },

  /***/
  "./src/app/pages/staffs/staffs.page.scss":
  /*!***********************************************!*\
    !*** ./src/app/pages/staffs/staffs.page.scss ***!
    \***********************************************/

  /*! exports provided: default */

  /***/
  function srcAppPagesStaffsStaffsPageScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".card-title-header {\n  font-size: 1.5em;\n  width: 90%;\n  font-weight: bold;\n  color: darkblue;\n  text-transform: uppercase;\n  opacity: 0.7;\n}\n\n.card-prospect {\n  border-radius: 0.8em;\n  border: solid 0.15em #FFFFFF;\n  width: 100%;\n}\n\n.card-prospect .prospect-header {\n  font-size: 1.2em;\n  width: 100%;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.9;\n}\n\n.table-row .table-header {\n  background: #99b7f0e0 !important;\n  color: #0a0909fb !important;\n  font-weight: bold;\n}\n\n.table-row ion-col {\n  border: solid 0.1em #FFFFFF;\n  font-size: 1.3em;\n}\n\n.table-row ion-row:nth-of-type(odd) {\n  background: #fafafaf6;\n  color: #202020;\n  opacity: 0.9;\n}\n\n.table-row ion-row:nth-of-type(even) {\n  background: #e6f5f8;\n  color: #202020;\n  opacity: 0.7;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvc3RhZmZzL0Q6XFxESU5ITlZcXE15RGF0YVxcTEFQVFJJTkhcXE5PREU0XFxpb25pYzQucWxuc1xcY2xpZW50L3NyY1xcYXBwXFxwYWdlc1xcc3RhZmZzXFxzdGFmZnMucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9zdGFmZnMvc3RhZmZzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNJLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO0VBQ0EsWUFBQTtBQ0FKOztBRElBO0VBQ0ksb0JBQUE7RUFDQSw0QkFBQTtFQUNBLFdBQUE7QUNESjs7QURLQTtFQUNJLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FDRko7O0FETUE7RUFDSSxnQ0FBQTtFQUNBLDJCQUFBO0VBQ0EsaUJBQUE7QUNISjs7QURNQTtFQUNJLDJCQUFBO0VBQ0EsZ0JBQUE7QUNISjs7QURNQTtFQUNJLHFCQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISjs7QURNQTtFQUNJLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3N0YWZmcy9zdGFmZnMucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy90aGnhur90IGzhuq1wIGNo4buvIGNobyB0acOqdSDEkeG7gSBjw7RuZyB0eVxyXG4uY2FyZC10aXRsZS1oZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiAxLjVlbTtcclxuICAgIHdpZHRoOiA5MCU7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiBkYXJrYmx1ZTtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn1cclxuXHJcbi8vVGhp4bq/dCBs4bqtcCBraHVuZyBu4buBbiB2w6AgY+G7oSBjaOG7ryBjaG8gY2FyZCB2aeG7hW4gY+G6o25oXHJcbi5jYXJkLXByb3NwZWN0e1xyXG4gICAgYm9yZGVyLXJhZGl1czogMC44ZW07XHJcbiAgICBib3JkZXI6IHNvbGlkIDAuMTVlbSAjRkZGRkZGO1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICAgIC8vb3BhY2l0eTogMC44O1xyXG59XHJcblxyXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcclxuICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIG9wYWNpdHk6IDAuOTtcclxufVxyXG5cclxuLy9UaGnhur90IGzhuq1wIGTDsm5nIGNo4bq1biBs4bq7IGNobyBi4bqjbmdcclxuLnRhYmxlLXJvdyAudGFibGUtaGVhZGVyIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xyXG4gICAgY29sb3I6IzBhMDkwOWZiICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxufVxyXG5cclxuLnRhYmxlLXJvdyBpb24tY29sIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJvcmRlcjogc29saWQgMC4xZW0gI0ZGRkZGRjtcclxuICAgIGZvbnQtc2l6ZTogMS4zZW07XHJcbn1cclxuXHJcbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHsgLy9kw7JuZyBs4bq7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmFmYWZhZjY7XHJcbiAgICBjb2xvcjojMjAyMDIwO1xyXG4gICAgb3BhY2l0eTogMC45O1xyXG59XHJcblxyXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikgeyAvL2TDsm5nIGNo4bq1blxyXG4gICAgYmFja2dyb3VuZDogI2U2ZjVmODtcclxuICAgIGNvbG9yOiMyMDIwMjA7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn0iLCIuY2FyZC10aXRsZS1oZWFkZXIge1xuICBmb250LXNpemU6IDEuNWVtO1xuICB3aWR0aDogOTAlO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IGRhcmtibHVlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjc7XG59XG5cbi5jYXJkLXByb3NwZWN0IHtcbiAgYm9yZGVyLXJhZGl1czogMC44ZW07XG4gIGJvcmRlcjogc29saWQgMC4xNWVtICNGRkZGRkY7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcbiAgZm9udC1zaXplOiAxLjJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjk7XG59XG5cbi50YWJsZS1yb3cgLnRhYmxlLWhlYWRlciB7XG4gIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xuICBjb2xvcjogIzBhMDkwOWZiICFpbXBvcnRhbnQ7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4udGFibGUtcm93IGlvbi1jb2wge1xuICBib3JkZXI6IHNvbGlkIDAuMWVtICNGRkZGRkY7XG4gIGZvbnQtc2l6ZTogMS4zZW07XG59XG5cbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHtcbiAgYmFja2dyb3VuZDogI2ZhZmFmYWY2O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC45O1xufVxuXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikge1xuICBiYWNrZ3JvdW5kOiAjZTZmNWY4O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC43O1xufSJdfQ== */";
    /***/
  },

  /***/
  "./src/app/pages/staffs/staffs.page.ts":
  /*!*********************************************!*\
    !*** ./src/app/pages/staffs/staffs.page.ts ***!
    \*********************************************/

  /*! exports provided: StaffsPage */

  /***/
  function srcAppPagesStaffsStaffsPageTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "StaffsPage", function () {
      return StaffsPage;
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

    var StaffsPage = /*#__PURE__*/function () {
      function StaffsPage(apiAuth, apiCommon) {
        _classCallCheck(this, StaffsPage);

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
            } else if (res.ajax) {
              //res.ajax.key==='organization_id' là trường có giá trị thay đổi
              //res.ajax.value là giá trị thay đổi ở trường có tên ở trên
              if (res.ajax.key === 'organization_id' && res.ajax.value) {
                //danh mục chức danh của tổ chức đó
                var jobOptions = []; //danh mục chức danh của tổ chức đó nhưng bỏ chức danh chính đi

                var jobListOptions = []; //lấy danh sách chức danh tùy chọn

                if (Array.isArray(_this.jobRoles)) {
                  _this.jobRoles.forEach(function (el) {
                    //chỉ lọc chức danh của tổ chức được chọn thôi
                    if ('' + el.organization_id === '' + res.ajax.value) {
                      //lấy danh sách chức danh
                      jobOptions.push({
                        name: el.name,
                        value: parseInt(el.id)
                      }); //vì không biết chọn chức danh nào nên vẫn trả đủ danh sách chức danh cho nó

                      jobListOptions.push({
                        name: el.name,
                        value: parseInt(el.id)
                      });
                    }
                  });
                } //báo cho form động biết cần thay đổi trường dữ liệu ajax nào


                resolve([{
                  key: "job_id" //tìm item có key là trường này
                  ,
                  property_name: "options" //nếu tìm thấy thì thay thuộc tính có tên ở đây
                  ,
                  new_data: jobOptions //bằng giá trị mới cập nhập do chọn lựa từ form này

                }, {
                  key: "job_list" //tìm item có key là trường này
                  ,
                  property_name: "options" //nếu tìm thấy thì thay thuộc tính có tên ở đây
                  ,
                  new_data: jobListOptions //bằng giá trị mới cập nhập do chọn lựa từ form này

                }]);
              } else if (res.ajax.key === 'job_id' && res.ajax.value) {
                //vì thay đổi công việc chính nên
                //thay đổi công việc kiêm nhiệm là trừ công việc chính đi
                var _jobListOptions = [];

                if (Array.isArray(_this.jobRoles)) {
                  //lấy công việc chính đã chọn
                  var elSelected = _this.jobRoles.find(function (x) {
                    return x.id == res.ajax.value;
                  });

                  if (elSelected) {
                    _this.jobRoles.forEach(function (el) {
                      //chỉ lọc chức danh của tổ chức được chọn thôi
                      //loại trừ chức danh được chọn
                      if ('' + el.organization_id === '' + elSelected.organization_id && '' + el.id !== '' + res.ajax.value) {
                        _jobListOptions.push({
                          name: el.name,
                          value: parseInt(el.id)
                        });
                      }
                    });
                  } //báo cho form động biết cần thay đổi trường dữ liệu ajax nào
                  // console.log(jobListOptions);


                  resolve({
                    key: "job_list" //tìm item có key là trường này
                    ,
                    property_name: "options" //nếu tìm thấy thì thay thuộc tính có tên ở đây
                    ,
                    new_data: _jobListOptions //bằng giá trị mới cập nhập do chọn lựa từ form này

                  });
                }
              } else {
                resolve({
                  next: "NO-CHANGE"
                }); //không có gì thay đổi cả
              }

              return; //nếu gọi kiểu ajax thì chỉ trả về form đó thôi
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

      _createClass(StaffsPage, [{
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
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-organizations");

                  case 3:
                    this.organizations = _context.sent;
                    _context.next = 6;
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-user-report");

                  case 6:
                    this.userReport = _context.sent;
                    // console.log('get-user-report', this.userReport);
                    //gán mã công ty vào để kiểm soát sau này
                    this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0; //lấy cây chức danh của đơn vị cấp cty/trung tâm

                    _context.next = 10;
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-job-roles");

                  case 10:
                    this.jobRoles = _context.sent;
                    _context.next = 16;
                    break;

                  case 13:
                    _context.prev = 13;
                    _context.t0 = _context["catch"](0);
                    console.log('Lỗi', _context.t0);

                  case 16:
                    //thay đổi chọn lựa
                    this.onChangeSelect();

                  case 17:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this, [[0, 13]]);
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
                    //reset cây vai trò
                    this.organizationsTree = [];
                    _context2.prev = 1;
                    _context2.next = 4;
                    return this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER + "/get-staffs");

                  case 4:
                    this.staffs = _context2.sent;

                    // console.log(this.staffs);
                    if (Array.isArray(this.staffs)) {
                      this.organizations.forEach(function (el) {
                        el.click_type = 1; //cây chính cho click luôn
                        //ghép con vào các nhánh cây (bỏ qua gốc cây)

                        if (_this2.staffs && el.id + '' !== '' + _this2.organizationId) {
                          el.subs = _this2.staffs.filter(function (x) {
                            return x.organization_id === el.id;
                          }); //mảng con được ghép vào
                        }

                        el.main_tree = 1; //cây chính
                      }); // console.log(this.organizations);
                      //tạo cây để hiển thị lên form

                      this.organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id'); // console.log(this.organizationsTree);
                      //ghép thêm nhân sự Giám đốc, Phó Giám đốc vào gốc cây

                      this.organizationsTree.forEach(function (el) {
                        //lọc các nhân sự giám đốc, phó giám đốc của tổ chức
                        if (_this2.staffs && el.id + '' === '' + _this2.organizationId) {
                          var rootSubs = _this2.staffs.filter(function (x) {
                            return x.organization_id === el.id;
                          }); //trường hợp refresh thì không cần thêm vào


                          if (!el.subs) el.subs = rootSubs; //duyệt rootSubs nếu tìm thấy một đối tượng trong el.subs thì thôi thoát ra 
                          //nếu không tìm thấy thì push vào

                          rootSubs.forEach(function (elsub) {
                            var index = el.subs.findIndex(function (x) {
                              return x.id === elsub.id && x.organization_id === elsub.organization_id;
                            });

                            if (index >= 0) {
                              //không cần thêm vào nếu là lá cây
                              //trường hợp nó có subs thì phải thay thế nó
                              //if (elsub.subs) 
                              el.subs.splice(index, 1, elsub); //thay thế lại
                            } else {
                              el.subs.unshift(elsub); //bổ sung vào đầu
                            }
                          });
                        }
                      });
                    }

                    _context2.next = 11;
                    break;

                  case 8:
                    _context2.prev = 8;
                    _context2.t0 = _context2["catch"](1);
                    console.log('Err:', _context2.t0);

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this, [[1, 8]]);
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
            icon: {
              name: "md-add",
              color: "secondary"
            },
            name: "Thêm nhân sự GĐ",
            value: "add-child"
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
          var menu; //cây nhân sự thuần

          if (!event.item.main_tree) {
            menu = [{
              icon: {
                name: "md-create",
                color: "primary"
              },
              name: "Chỉnh sửa nhân sự",
              value: "edit-owner"
            }, {
              icon: {
                name: "trash",
                color: "danger"
              },
              name: event.item.status === 1 ? "Khóa bỏ nhân sự" : "Kích hoạt nhân sự",
              value: "stop-owner"
            }];
          } else {
            menu = [{
              icon: {
                name: "md-add",
                color: "secondary"
              },
              name: "Thêm nhân sự",
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
              table_name: 'staffs',
              wheres: [],
              title_name: item.name //tên của cấp cha

            };
            this.addNewItem(itemNew, 'add');
          } //sửa tham số


          if (cmd.value === 'edit-owner') {
            item.table_name = 'staffs'; //tên bảng cần đưa vào

            item.wheres = ['id']; //Mệnh đề wheres để update = '';

            item.title_name = item.organization_name;
            this.addNewItem(item, 'edit');
          } //thêm kpi từ Chỉ tiêu


          if (cmd.value === 'stop-owner') {
            item.table_name = 'staffs'; //tên bảng cần đưa vào

            item.wheres = ['id']; //Mệnh đề wheres để update = '';

            this.stopItem(item);
          }
        }
        /**
           *Thêm hoặc sửa nhân sự
           * @param item
           */

      }, {
        key: "addNewItem",
        value: function addNewItem(item, type) {
          // console.log('item', item);
          var orgOptions = []; //lấy danh sách đơn vị

          if (Array.isArray(this.organizations)) {
            this.organizations.forEach(function (el) {
              orgOptions.push({
                name: el.name,
                value: parseInt(el.id)
              });
            });
          } //danh mục chức danh của tổ chức đó


          var jobOptions = []; //danh mục chức danh của tổ chức đó nhưng bỏ chức danh chính đi

          var jobListOptions = []; //lấy từ cây đơn vị mà trong đó parent_id là gốc cây của đơn vị

          if (Array.isArray(this.jobRoles)) {
            this.jobRoles.forEach(function (el) {
              //chỉ lọc các chức danh trong tổ chức đó thôi
              if ('' + el.organization_id === '' + item.organization_id) {
                //lấy danh sách chức danh
                jobOptions.push({
                  name: el.name,
                  value: parseInt(el.id)
                }); //lấy danh sách chức danh kiêm nhiệm - bỏ chức danh đang đảm nhiệm

                if ('' + el.id !== '' + item.job_id) {
                  jobListOptions.push({
                    name: el.name,
                    value: parseInt(el.id)
                  });
                }
              }
            });
          }

          var form = {
            title: (type === 'add' ? 'THÊM' : 'SỬA') + " DANH MỤC",
            home_disable: true,
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
            } //hiển thị các thông tin của nhân sự
            , {
              type: "text",
              key: "name",
              value: item.name,
              name: "Họ và tên",
              input_type: "text",
              icon: "contact",
              validators: [{
                required: true,
                min: 3,
                max: 100
              }],
              hint: "Độ dài tên cho phép từ 5 đến 100 ký tự"
            }, {
              type: "select-origin",
              key: "organization_id",
              name: "Thuộc đơn vị",
              value: "" + item.organization_id,
              options: orgOptions,
              icon: "logo-windows",
              validators: [{
                required: true
              }],
              hint: "Chọn một đơn vị trực thuộc"
            }, {
              type: "select-origin",
              key: "job_id",
              name: "Chức danh",
              value: "" + item.job_id,
              options: jobOptions,
              icon: "logo-wordpress",
              validators: [{
                required: true
              }],
              hint: "Chọn một chức danh"
            }, {
              type: "select-multiple-origin",
              key: "job_list",
              name: "Chức danh kiêm nhiệm",
              value: [],
              options: jobListOptions,
              icon: "logo-buffer",
              hint: "Chọn các công việc kiêm nhiệm của cá nhân đó"
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
        /**
         * Dừng đối tượng này
         * @param item
         */

      }, {
        key: "stopItem",
        value: function stopItem(item) {
          var form = {
            title: "Thay đổi trạng thái",
            home_disable: true,
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
                url: this.apiAuth.serviceUrls.RESOURCE_SERVER + "/post-parameters",
                token: true,
                signed: true
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

      return StaffsPage;
    }();

    StaffsPage.ctorParameters = function () {
      return [{
        type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]
      }, {
        type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]
      }];
    };

    StaffsPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-staffs',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./staffs.page.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/staffs/staffs.page.html"))["default"],
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./staffs.page.scss */
      "./src/app/pages/staffs/staffs.page.scss"))["default"]]
    }), tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]])], StaffsPage);
    /***/
  }
}]);
//# sourceMappingURL=pages-staffs-staffs-module-es5.js.map
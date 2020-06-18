(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-organizations-organizations-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html":
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n\r\n    <ion-buttons slot=\"start\">\r\n      <ion-menu-button></ion-menu-button>\r\n      <ion-back-button></ion-back-button>\r\n    </ion-buttons>\r\n\r\n    <ion-title>MÔ HÌNH TỔ CHỨC</ion-title>\r\n\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content>\r\n  <ion-row>\r\n    <ion-col class=\"ion-text-center\" size=\"12\" class=\"card-prospect\" *ngFor=\"let item of organizationsTree\"\r\n      [style.background]=\"(item.background?item.background:'#fafafaf6')\">\r\n      <ion-row (click)=\"onClickSpec($event, item)\">\r\n        <ion-col size=\"10\" class=\"prospect-header\" [style.color]=\"(item.color?item.color:'darkblue')\">\r\n          <ion-icon *ngIf=\"item.click_type\" style=\"font-size: 1em\" [style.color]=\"'lightblue'\"\r\n            name=\"md-cloud-upload\"></ion-icon>{{item.name}}\r\n        </ion-col>\r\n        <ion-col size=\"2\" class=\"prospect-header\" [style.color]=\"(item.color?item.color:'darkblue')\">\r\n          {{item.status}}\r\n        </ion-col>\r\n      </ion-row>\r\n\r\n      <!-- Bộ cây tổ chức của tổ chức độc lập cấp phòng ban, cấp tổ/đội, vùng -->\r\n      <tree-list [treeData]=\"item.subs\" (onClickKpi)=\"onClickTreeItem($event)\"></tree-list>\r\n    </ion-col>\r\n  </ion-row>\r\n</ion-content>");

/***/ }),

/***/ "./src/app/pages/organizations/organizations.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/pages/organizations/organizations.module.ts ***!
  \*************************************************************/
/*! exports provided: OrganizationsPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrganizationsPageModule", function() { return OrganizationsPageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _organizations_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./organizations.page */ "./src/app/pages/organizations/organizations.page.ts");
/* harmony import */ var ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngxi4-dynamic-service */ "./node_modules/ngxi4-dynamic-service/fesm2015/ngxi4-dynamic-service.js");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");








let OrganizationsPageModule = class OrganizationsPageModule {
};
OrganizationsPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["IonicModule"],
            _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
            _shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
            ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_6__["Ngxi4DynamicServiceModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild([
                {
                    path: '',
                    component: _organizations_page__WEBPACK_IMPORTED_MODULE_5__["OrganizationsPage"]
                }
            ])
        ],
        declarations: [_organizations_page__WEBPACK_IMPORTED_MODULE_5__["OrganizationsPage"]]
    })
], OrganizationsPageModule);



/***/ }),

/***/ "./src/app/pages/organizations/organizations.page.scss":
/*!*************************************************************!*\
  !*** ./src/app/pages/organizations/organizations.page.scss ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".card-title-header {\n  font-size: 1.5em;\n  width: 90%;\n  font-weight: bold;\n  color: darkblue;\n  text-transform: uppercase;\n  opacity: 0.7;\n}\n\n.card-prospect {\n  border-radius: 0.8em;\n  border: solid 0.15em #FFFFFF;\n  width: 100%;\n}\n\n.card-prospect .prospect-header {\n  font-size: 1.2em;\n  width: 100%;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.9;\n}\n\n.table-row .table-header {\n  background: #99b7f0e0 !important;\n  color: #0a0909fb !important;\n  font-weight: bold;\n}\n\n.table-row ion-col {\n  border: solid 0.1em #FFFFFF;\n  font-size: 1.3em;\n}\n\n.table-row ion-row:nth-of-type(odd) {\n  background: #fafafaf6;\n  color: #202020;\n  opacity: 0.9;\n}\n\n.table-row ion-row:nth-of-type(even) {\n  background: #e6f5f8;\n  color: #202020;\n  opacity: 0.7;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvb3JnYW5pemF0aW9ucy9EOlxcRElOSE5WXFxNeURhdGFcXExBUFRSSU5IXFxOT0RFNFxcaW9uaWM0LnFsbnNcXGNsaWVudC9zcmNcXGFwcFxccGFnZXNcXG9yZ2FuaXphdGlvbnNcXG9yZ2FuaXphdGlvbnMucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9vcmdhbml6YXRpb25zL29yZ2FuaXphdGlvbnMucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksZ0JBQUE7RUFDQSxVQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FDQUo7O0FESUE7RUFDSSxvQkFBQTtFQUNBLDRCQUFBO0VBQ0EsV0FBQTtBQ0RKOztBREtBO0VBQ0ksZ0JBQUE7RUFDQSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSx5QkFBQTtFQUNBLFlBQUE7QUNGSjs7QURNQTtFQUNJLGdDQUFBO0VBQ0EsMkJBQUE7RUFDQSxpQkFBQTtBQ0hKOztBRE1BO0VBQ0ksMkJBQUE7RUFDQSxnQkFBQTtBQ0hKOztBRE1BO0VBQ0kscUJBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtBQ0hKOztBRE1BO0VBQ0ksbUJBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtBQ0hKIiwiZmlsZSI6InNyYy9hcHAvcGFnZXMvb3JnYW5pemF0aW9ucy9vcmdhbml6YXRpb25zLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8vdGhp4bq/dCBs4bqtcCBjaOG7ryBjaG8gdGnDqnUgxJHhu4EgY8O0bmcgdHlcclxuLmNhcmQtdGl0bGUtaGVhZGVyIHtcclxuICAgIGZvbnQtc2l6ZTogMS41ZW07XHJcbiAgICB3aWR0aDogOTAlO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBjb2xvcjogZGFya2JsdWU7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgb3BhY2l0eTogMC43O1xyXG59XHJcblxyXG4vL1RoaeG6v3QgbOG6rXAga2h1bmcgbuG7gW4gdsOgIGPhu6EgY2jhu68gY2hvIGNhcmQgdmnhu4VuIGPhuqNuaFxyXG4uY2FyZC1wcm9zcGVjdHtcclxuICAgIGJvcmRlci1yYWRpdXM6IDAuOGVtO1xyXG4gICAgYm9yZGVyOiBzb2xpZCAwLjE1ZW0gI0ZGRkZGRjtcclxuICAgIHdpZHRoOjEwMCU7XHJcbiAgICAvL29wYWNpdHk6IDAuODtcclxufVxyXG5cclxuLmNhcmQtcHJvc3BlY3QgLnByb3NwZWN0LWhlYWRlciB7XHJcbiAgICBmb250LXNpemU6IDEuMmVtO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBvcGFjaXR5OiAwLjk7XHJcbn1cclxuXHJcbi8vVGhp4bq/dCBs4bqtcCBkw7JuZyBjaOG6tW4gbOG6uyBjaG8gYuG6o25nXHJcbi50YWJsZS1yb3cgLnRhYmxlLWhlYWRlciB7IC8vdOG6pXQgY+G6oyBjw6FjIGPhu5l0IHNhdSBjbGFzcyBuw6B5XHJcbiAgICBiYWNrZ3JvdW5kOiAjOTliN2YwZTAgIWltcG9ydGFudDtcclxuICAgIGNvbG9yOiMwYTA5MDlmYiAhaW1wb3J0YW50O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbn1cclxuXHJcbi50YWJsZS1yb3cgaW9uLWNvbCB7IC8vdOG6pXQgY+G6oyBjw6FjIGPhu5l0IHNhdSBjbGFzcyBuw6B5XHJcbiAgICBib3JkZXI6IHNvbGlkIDAuMWVtICNGRkZGRkY7XHJcbiAgICBmb250LXNpemU6IDEuM2VtO1xyXG59XHJcblxyXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUob2RkKSB7IC8vZMOybmcgbOG6u1xyXG4gICAgYmFja2dyb3VuZDogI2ZhZmFmYWY2O1xyXG4gICAgY29sb3I6IzIwMjAyMDtcclxuICAgIG9wYWNpdHk6IDAuOTtcclxufVxyXG5cclxuLnRhYmxlLXJvdyBpb24tcm93Om50aC1vZi10eXBlKGV2ZW4pIHsgLy9kw7JuZyBjaOG6tW5cclxuICAgIGJhY2tncm91bmQ6ICNlNmY1Zjg7XHJcbiAgICBjb2xvcjojMjAyMDIwO1xyXG4gICAgb3BhY2l0eTogMC43O1xyXG59IiwiLmNhcmQtdGl0bGUtaGVhZGVyIHtcbiAgZm9udC1zaXplOiAxLjVlbTtcbiAgd2lkdGg6IDkwJTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiBkYXJrYmx1ZTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgb3BhY2l0eTogMC43O1xufVxuXG4uY2FyZC1wcm9zcGVjdCB7XG4gIGJvcmRlci1yYWRpdXM6IDAuOGVtO1xuICBib3JkZXI6IHNvbGlkIDAuMTVlbSAjRkZGRkZGO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmNhcmQtcHJvc3BlY3QgLnByb3NwZWN0LWhlYWRlciB7XG4gIGZvbnQtc2l6ZTogMS4yZW07XG4gIHdpZHRoOiAxMDAlO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgb3BhY2l0eTogMC45O1xufVxuXG4udGFibGUtcm93IC50YWJsZS1oZWFkZXIge1xuICBiYWNrZ3JvdW5kOiAjOTliN2YwZTAgIWltcG9ydGFudDtcbiAgY29sb3I6ICMwYTA5MDlmYiAhaW1wb3J0YW50O1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLnRhYmxlLXJvdyBpb24tY29sIHtcbiAgYm9yZGVyOiBzb2xpZCAwLjFlbSAjRkZGRkZGO1xuICBmb250LXNpemU6IDEuM2VtO1xufVxuXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUob2RkKSB7XG4gIGJhY2tncm91bmQ6ICNmYWZhZmFmNjtcbiAgY29sb3I6ICMyMDIwMjA7XG4gIG9wYWNpdHk6IDAuOTtcbn1cblxuLnRhYmxlLXJvdyBpb24tcm93Om50aC1vZi10eXBlKGV2ZW4pIHtcbiAgYmFja2dyb3VuZDogI2U2ZjVmODtcbiAgY29sb3I6ICMyMDIwMjA7XG4gIG9wYWNpdHk6IDAuNztcbn0iXX0= */");

/***/ }),

/***/ "./src/app/pages/organizations/organizations.page.ts":
/*!***********************************************************!*\
  !*** ./src/app/pages/organizations/organizations.page.ts ***!
  \***********************************************************/
/*! exports provided: OrganizationsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrganizationsPage", function() { return OrganizationsPage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngxi4-dynamic-service */ "./node_modules/ngxi4-dynamic-service/fesm2015/ngxi4-dynamic-service.js");



let OrganizationsPage = class OrganizationsPage {
    constructor(apiAuth, apiCommon) {
        this.apiAuth = apiAuth;
        this.apiCommon = apiCommon;
        /**
         * Hàm xử lý kết quả post sửa thêm
         */
        this.callbackKpi = (res) => {
            // console.log(res);
            return new Promise((resolve, reject) => {
                if (res.error) {
                    this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
                }
                else if (res.ajax) {
                    //Khi thay đổi cần gọi ajax thì nó gọi cái này
                    //ta không cần refresh trang
                }
                else {
                    //lấy lại kết quả đã tính toán
                    this.refreshNews();
                }
                resolve({ next: "CLOSE" });
            });
        };
    }
    ngOnInit() {
        this.refreshNews();
    }
    refreshNews() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            try {
                //Lấy chu kỳ báo cáo + đơn vị + danh sách department
                this.userReport = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-user-report", true);
                // console.log(this.userReport);
                //Lấy danh sách đơn vị trong toàn bộ cây danh sách, 
                //lọc lấy tách cây id=root_id và chỉ sử dụng nhánh cây mà user đang sở hữu thôi, không hiển thị các nhánh cây khác
                this.organizations = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-organizations", true);
                // console.log(this.organizations);
                if (Array.isArray(this.organizations)) {
                    //lọc lấy cây id = root_id để làm gốc cây
                    //thiết lập parent_id=undefined cho gốc cây
                    //đã có cây thì ta reset parent_id
                    this.organizations.forEach(el => {
                        //xử lý mở nút cây (biểu tượng click)
                        el.click_type = 2;
                        //xóa các quan hệ cấp trên
                        if (el.id === el.root_id)
                            el.parent_id = undefined;
                        //mở cây trước đó
                        if (this.itemOpen && (this.itemOpen.parent_id === el.id || this.itemOpen.id === el.id)) {
                            el.visible = true;
                        }
                    });
                    // tạo cấu trúc hình cây để khai báo, chỉnh sửa cây tổ chức
                    let organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id');
                    if (this.userReport && Array.isArray(organizationsTree)) {
                        this.organizationsTree = organizationsTree.filter(x => x.id === this.userReport.organization_id);
                    }
                    else {
                        this.organizationsTree = organizationsTree;
                    }
                    // console.log(this.organizationsTree);
                }
            }
            catch (e) { }
        });
    }
    /**
     * Click vào nội dung cấp Công ty/Trung tâm
     * @param ev
     * @param card
     */
    onClickSpec(ev, card) {
        // console.log(card);
        let menu = [
            {
                name: "Thêm đơn vị phụ thuộc",
                value: "add-child",
                icon: {
                    name: "md-add",
                    color: "secondary",
                }
            },
            {
                name: "Chỉnh sửa thông tin",
                value: "edit-owner",
                icon: {
                    name: "md-create",
                    color: "primary",
                }
            }
        ];
        //Thực hiện hiển thị menu
        this.apiCommon.presentPopover(ev, ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["PopoverCardComponent"], {
            type: 'single-choice',
            title: "Chọn chức năng",
            color: "primary",
            menu: menu
        })
            .then(data => {
            // console.log(data);
            this.processKpiDetails(data, card);
        })
            .catch(err => {
            console.log('err: ', err);
        });
    }
    onClickTreeItem(event) {
        //Khi cây con có click_type>0 thì ta tự mở node ra để xem
        if (event.item.click_type > 0) {
            event.item.visible = true;
        }
        //Khai báo menu popup
        let menu = [
            {
                name: "Chỉnh sửa thông tin",
                value: "edit-owner",
                icon: {
                    name: "md-create",
                    color: "primary",
                }
            },
            {
                name: "Thêm đơn vị cấp con",
                value: "add-child",
                icon: {
                    name: "md-add",
                    color: "secondary",
                }
            },
            {
                name: event.item.status === 1 ? "Loại bỏ đơn vị" : "Mở hoạt động đơn vị",
                value: "stop-owner",
                icon: {
                    name: "trash",
                    color: "danger",
                }
            }
        ];
        //Thực hiện hiển thị menu
        this.apiCommon.presentPopover(event.event, ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["PopoverCardComponent"], {
            type: 'single-choice',
            title: "Chọn chức năng",
            color: "primary",
            menu: menu
        })
            .then(data => {
            // console.log(data);
            this.processKpiDetails(data, event.item);
        })
            .catch(err => {
            console.log('err: ', err);
        });
    }
    /**
     * Xử lý từng lệnh
     * @param cmd
     * @param item
     */
    processKpiDetails(cmd, item) {
        //thêm tham số
        if (cmd.value === 'add-child') {
            this.itemOpen = item;
            //item là một nhánh cây đang xét
            let itemNew = {
                id: -1,
                parent_id: item.id,
                table_name: 'organizations',
                wheres: [],
                title_name: item.name //tên của cấp cha
            };
            this.addNewItem(itemNew, 'add');
        }
        //sửa tham số
        if (cmd.value === 'edit-owner') {
            this.itemOpen = item;
            item.table_name = 'organizations'; //tên bảng cần đưa vào
            item.wheres = ['id']; //Mệnh đề wheres để update = '';
            item.title_name = 'Tổ chức';
            this.addNewItem(item, 'edit');
        }
        //thêm kpi từ Chỉ tiêu
        if (cmd.value === 'stop-owner') {
            this.itemOpen = item;
            item.table_name = 'organizations'; //tên bảng cần đưa vào
            item.wheres = ['id']; //Mệnh đề wheres để update = '';
            this.stopItem(item);
        }
    }
    /**
     * Thêm kpi mới có kpi_role là C và Tr từ cây
     * @param item
     */
    addNewItem(item, type) {
        let form = {
            title: (type === 'add' ? 'THÊM' : 'SỬA') + " DANH MỤC",
            buttons: [
                { color: "danger", icon: "close", next: "CLOSE" }
            ],
            items: [
                { type: "title", name: item.title_name },
                { type: "hidden", key: "id", value: item.id },
                { type: "hidden", key: "parent_id", value: item.parent_id },
                { type: "hidden", key: "table_name", value: item.table_name },
                { type: "hidden", key: "wheres", value: item.wheres }
                //hiển thị nội dung nhập vào cho Chỉ tiêu chỉ là tên và trọng số
                //new Date().toISOString().slice(0, 10)
                ,
                { type: "text", key: "name", value: item.name, name: "Tên đơn vị", input_type: "text", icon: "logo-buffer", validators: [{ required: true, min: 3, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" },
                { type: "text", key: "short_name", value: item.short_name, name: "Tên viết tắt", input_type: "text", icon: "logo-buffer", validators: [{ required: true, min: 1, max: 6 }], hint: "Độ dài tối đa 6 ký tự" }
                //, { type: "datetime", key: "start_date", value: item.start_date, name: "Chọn ngày hoạt động", hint: "Lựa chọn ngày", display: "DD/MM/YYYY", picker: "DD/MM/YYYY", validators: [{ required: true }] }
                ,
                { type: "text_area", key: "description", value: item.description, name: "Mô tả thông tin của đơn vị", input_type: "text", icon: "md-alert", hint: "Nhập mô tả này để ghi nhớ" },
                {
                    type: "button",
                    options: [
                        { name: "Reset", next: "RESET" },
                        {
                            name: type === 'add' ? 'Tạo mới' : 'Chỉnh sửa', next: "CALLBACK",
                            url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                                + "/post-parameters", token: true
                        }
                    ]
                }
            ]
        };
        this.apiCommon.openModal(ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["DynamicFormMobilePage"], {
            parent: this,
            form: form,
            callback: this.callbackKpi
        });
    }
    stopItem(item) {
        let form = {
            title: "Thay đổi trạng thái",
            buttons: [
                { color: "danger", icon: "close", next: "CLOSE" }
            ],
            items: [
                { type: "title", name: item.name },
                { type: "hidden", key: "id", value: item.id } //đối tượng để update
                ,
                { type: "hidden", key: "table_name", value: item.table_name },
                { type: "hidden", key: "wheres", value: item.wheres },
                { type: "datetime", key: "end_date", value: item.end_date, name: "Chọn ngày kết thúc", display: "DD/MM/YYYY", picker: "DD/MM/YYYY" },
                { type: "toggle", key: "status", name: item.status ? "Tạm ngưng?" : "Kích hoạt?", value: item.status, color: "secondary", icon: "ios-hand-outline" },
                {
                    type: "button",
                    options: [
                        {
                            name: 'Cập nhập', next: "CALLBACK", url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                                + "/post-parameters", token: true, signed: true
                        }
                    ]
                }
            ]
        };
        this.apiCommon.openModal(ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["DynamicFormMobilePage"], {
            parent: this,
            form: form,
            callback: this.callbackKpi
        });
    }
};
OrganizationsPage.ctorParameters = () => [
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] },
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"] }
];
OrganizationsPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-organizations',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./organizations.page.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./organizations.page.scss */ "./src/app/pages/organizations/organizations.page.scss")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
        ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]])
], OrganizationsPage);



/***/ })

}]);
//# sourceMappingURL=pages-organizations-organizations-module-es2015.js.map
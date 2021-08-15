(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-organizations-organizations-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html":
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n\r\n    <ion-buttons slot=\"start\">\r\n      <ion-menu-button></ion-menu-button>\r\n      <ion-back-button></ion-back-button>\r\n      <ion-button>\r\n        <input class=\"file-over\" type=\"file\" (change)=\"onClickUpload($event)\"\r\n          accept=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel\" />\r\n        <ion-icon name=\"cloud-upload\"></ion-icon>\r\n      </ion-button>\r\n    </ion-buttons>\r\n\r\n    <ion-title>MÔ HÌNH TỔ CHỨC</ion-title>\r\n\r\n    <ion-buttons slot=\"end\">\r\n      <ion-button (click)=\"onClickDownload()\">\r\n        <ion-icon name=\"cloud-download\"></ion-icon>\r\n      </ion-button>\r\n    </ion-buttons>\r\n\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content>\r\n  <ion-row>\r\n    <ion-col size=\"12\" class=\"card-prospect\" *ngFor=\"let item of organizationsTree\"\r\n      [style.background]=\"'#fafafaf6'\">\r\n      <ion-row (click)=\"onClickSpec($event, item)\">\r\n        <ion-col size=\"10\" class=\"prospect-header\" [style.color]=\"'darkblue'\">\r\n          <ion-icon *ngIf=\"item.click_type\" style=\"font-size: 1em\" [style.color]=\"'lightblue'\" name=\"md-cloud-upload\">\r\n          </ion-icon>{{item.name}}\r\n        </ion-col>\r\n        <ion-col size=\"2\" class=\"prospect-header\" [style.color]=\"'darkblue'\">\r\n          {{item.id}}\r\n        </ion-col>\r\n      </ion-row>\r\n\r\n      <tree-list [treeData]=\"item.subs\" (onClickKpi)=\"onClickTreeItem($event)\"></tree-list>\r\n\r\n    </ion-col>\r\n  </ion-row>\r\n</ion-content>");

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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _organizations_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./organizations.page */ "./src/app/pages/organizations/organizations.page.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared.module */ "./src/app/shared.module.ts");





let OrganizationsPageModule = class OrganizationsPageModule {
};
OrganizationsPageModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _shared_module__WEBPACK_IMPORTED_MODULE_4__["SharedModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                {
                    path: '',
                    component: _organizations_page__WEBPACK_IMPORTED_MODULE_3__["OrganizationsPage"]
                }
            ])
        ],
        declarations: [_organizations_page__WEBPACK_IMPORTED_MODULE_3__["OrganizationsPage"]]
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
/* harmony default export */ __webpack_exports__["default"] = (".card-title-header {\n  font-size: 1.5em;\n  width: 90%;\n  font-weight: bold;\n  color: darkblue;\n  text-transform: uppercase;\n  opacity: 0.7;\n}\n\n.card-prospect {\n  border-radius: 0.8em;\n  border: solid 0.15em #FFFFFF;\n  width: 100%;\n}\n\n.card-prospect .prospect-header {\n  font-size: 1.2em;\n  width: 100%;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.9;\n}\n\n.table-row .table-header {\n  background: #99b7f0e0 !important;\n  color: #0a0909fb !important;\n  font-weight: bold;\n}\n\n.table-row ion-col {\n  border: solid 0.1em #FFFFFF;\n  font-size: 1.3em;\n}\n\n.table-row ion-row:nth-of-type(odd) {\n  background: #fafafaf6;\n  color: #202020;\n  opacity: 0.9;\n}\n\n.table-row ion-row:nth-of-type(even) {\n  background: #e6f5f8;\n  color: #202020;\n  opacity: 0.7;\n}\n\n.file-over {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  width: 100%;\n  height: 100%;\n  opacity: 1;\n  cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvb3JnYW5pemF0aW9ucy9FOlxcTVlEQVRBXFxMQVBUUklOSFxcTk9ERTRcXG5vZGU0LXFsbnNcXGNsaWVudC9zcmNcXGFwcFxccGFnZXNcXG9yZ2FuaXphdGlvbnNcXG9yZ2FuaXphdGlvbnMucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9vcmdhbml6YXRpb25zL29yZ2FuaXphdGlvbnMucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksZ0JBQUE7RUFDQSxVQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FDQUo7O0FESUE7RUFDSSxvQkFBQTtFQUNBLDRCQUFBO0VBQ0EsV0FBQTtBQ0RKOztBREtBO0VBQ0ksZ0JBQUE7RUFDQSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSx5QkFBQTtFQUNBLFlBQUE7QUNGSjs7QURNQTtFQUNJLGdDQUFBO0VBQ0EsMkJBQUE7RUFDQSxpQkFBQTtBQ0hKOztBRE1BO0VBQ0ksMkJBQUE7RUFDQSxnQkFBQTtBQ0hKOztBRE1BO0VBQ0kscUJBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtBQ0hKOztBRE1BO0VBQ0ksbUJBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtBQ0hKOztBRE1BO0VBQ0ksa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7RUFDQSxlQUFBO0FDSEoiLCJmaWxlIjoic3JjL2FwcC9wYWdlcy9vcmdhbml6YXRpb25zL29yZ2FuaXphdGlvbnMucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy90aGnhur90IGzhuq1wIGNo4buvIGNobyB0acOqdSDEkeG7gSBjw7RuZyB0eVxyXG4uY2FyZC10aXRsZS1oZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiAxLjVlbTtcclxuICAgIHdpZHRoOiA5MCU7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiBkYXJrYmx1ZTtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn1cclxuXHJcbi8vVGhp4bq/dCBs4bqtcCBraHVuZyBu4buBbiB2w6AgY+G7oSBjaOG7ryBjaG8gY2FyZCB2aeG7hW4gY+G6o25oXHJcbi5jYXJkLXByb3NwZWN0e1xyXG4gICAgYm9yZGVyLXJhZGl1czogMC44ZW07XHJcbiAgICBib3JkZXI6IHNvbGlkIDAuMTVlbSAjRkZGRkZGO1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICAgIC8vb3BhY2l0eTogMC44O1xyXG59XHJcblxyXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcclxuICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIG9wYWNpdHk6IDAuOTtcclxufVxyXG5cclxuLy9UaGnhur90IGzhuq1wIGTDsm5nIGNo4bq1biBs4bq7IGNobyBi4bqjbmdcclxuLnRhYmxlLXJvdyAudGFibGUtaGVhZGVyIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xyXG4gICAgY29sb3I6IzBhMDkwOWZiICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxufVxyXG5cclxuLnRhYmxlLXJvdyBpb24tY29sIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJvcmRlcjogc29saWQgMC4xZW0gI0ZGRkZGRjtcclxuICAgIGZvbnQtc2l6ZTogMS4zZW07XHJcbn1cclxuXHJcbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHsgLy9kw7JuZyBs4bq7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmFmYWZhZjY7XHJcbiAgICBjb2xvcjojMjAyMDIwO1xyXG4gICAgb3BhY2l0eTogMC45O1xyXG59XHJcblxyXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikgeyAvL2TDsm5nIGNo4bq1blxyXG4gICAgYmFja2dyb3VuZDogI2U2ZjVmODtcclxuICAgIGNvbG9yOiMyMDIwMjA7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn1cclxuXHJcbi5maWxlLW92ZXIge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHotaW5kZXg6IDI7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn0iLCIuY2FyZC10aXRsZS1oZWFkZXIge1xuICBmb250LXNpemU6IDEuNWVtO1xuICB3aWR0aDogOTAlO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IGRhcmtibHVlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjc7XG59XG5cbi5jYXJkLXByb3NwZWN0IHtcbiAgYm9yZGVyLXJhZGl1czogMC44ZW07XG4gIGJvcmRlcjogc29saWQgMC4xNWVtICNGRkZGRkY7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcbiAgZm9udC1zaXplOiAxLjJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjk7XG59XG5cbi50YWJsZS1yb3cgLnRhYmxlLWhlYWRlciB7XG4gIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xuICBjb2xvcjogIzBhMDkwOWZiICFpbXBvcnRhbnQ7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4udGFibGUtcm93IGlvbi1jb2wge1xuICBib3JkZXI6IHNvbGlkIDAuMWVtICNGRkZGRkY7XG4gIGZvbnQtc2l6ZTogMS4zZW07XG59XG5cbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHtcbiAgYmFja2dyb3VuZDogI2ZhZmFmYWY2O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC45O1xufVxuXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikge1xuICBiYWNrZ3JvdW5kOiAjZTZmNWY4O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC43O1xufVxuXG4uZmlsZS1vdmVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHotaW5kZXg6IDI7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG9wYWNpdHk6IDE7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn0iXX0= */");

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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngxi4-dynamic-service */ "./node_modules/ngxi4-dynamic-service/__ivy_ngcc__/fesm2015/ngxi4-dynamic-service.js");
/* harmony import */ var src_app_services_api_download_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/api-download.service */ "./src/app/services/api-download.service.ts");
/* harmony import */ var src_app_services_api_excel_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/api-excel.service */ "./src/app/services/api-excel.service.ts");
/* harmony import */ var ngx_socket_io__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-socket-io */ "./node_modules/ngx-socket-io/__ivy_ngcc__/fesm2015/ngx-socket-io.js");
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! exceljs */ "./node_modules/exceljs/dist/exceljs.min.js");
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_6__);







const config = {
    sheet_name: { value: "organizations" },
    noId: { value: "A" },
    name: { value: "B" },
    short_name: { value: "C" },
    description: { value: "D" },
    id: { value: "E" },
    parent_id: { value: "F" }
};
let OrganizationsPage = class OrganizationsPage {
    constructor(apiAuth, apiCommon, apiDownload, apiExcel, socket) {
        this.apiAuth = apiAuth;
        this.apiCommon = apiCommon;
        this.apiDownload = apiDownload;
        this.apiExcel = apiExcel;
        this.socket = socket;
        /**
         * Hàm xử lý kết quả post thêm sửa xóa
         */
        this.callbackProcess = (res) => {
            // console.log(res);
            return new Promise(resolve => {
                if (res.error) {
                    this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
                }
                else {
                    //Báo cho socket biết là thực hiện xong
                    this.socket.emit('Client-send-data');
                }
                resolve({ next: "CLOSE" });
            });
        };
        /**
         * Hàm xử lý gọi lại download
         */
        this.callbackDownload = function (ws, config) {
            let writeExcel = this.apiExcel.processWriteExcel(this.organizationsTree, ws, config);
            // console.log(writeExcel);
            return { status: "OK", message: "Xử lý thành công", count: writeExcel.count };
        }.bind(this);
        this.convertColExcel2Number = (val) => {
            var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;
            for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
                result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
            }
            return result;
        };
    }
    ngOnInit() {
        this.refreshNews();
        this.socket.on("Server-send-data", () => {
            this.refreshNews();
        });
    }
    refreshNews() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            try {
                // lấy mã tổ chức của username: 0766777123
                this.userReport = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-user-report");
                // console.log(this.userReport);
                // Lấy danh sách tổ chức
                this.organizations = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-organizations");
                // console.log(this.organizations);
                if (Array.isArray(this.organizations)) {
                    // Dùng service để chuyển thành cây tổ chức
                    let organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id');
                    // console.log(organizationsTree);
                    // Lấy cây tổ chức theo userReport.organization_id
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
    onClickSpec(ev, item) {
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
            this.processDetails(data, item);
        })
            .catch(err => {
            console.log('err: ', err);
        });
    }
    /**
     * Kích vào nội dung cấp con (tổ chức)
     * @param event
     */
    onClickTreeItem(event) {
        // console.log(event);
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
                name: event.item.status === 1 ? "Loại bỏ đơn vị" : "Kích hoạt đơn vị",
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
            this.processDetails(data, event.item);
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
    processDetails(cmd, item) {
        //thêm tham số
        if (cmd.value === 'add-child') {
            let itemNew = {
                id: -1,
                parent_id: item.id,
                table_name: 'organizations',
                wheres: [],
                title_name: item.name //tên của cấp cha
            };
            this.updateItem(itemNew, 'add');
        }
        //sửa tham số
        if (cmd.value === 'edit-owner') {
            item.table_name = 'organizations'; //tên bảng cần đưa vào
            item.wheres = ['id']; //Mệnh đề wheres để update = '';
            item.title_name = item.name;
            this.updateItem(item, 'edit');
        }
        //tạm dừng tham số
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
    updateItem(item, type) {
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
                { type: "hidden", key: "wheres", value: item.wheres },
                { type: "text", key: "name", value: item.name, name: "Tên đơn vị", input_type: "text", icon: "logo-buffer", validators: [{ required: true, min: 5, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" },
                { type: "text", key: "short_name", value: item.short_name, name: "Tên viết tắt", input_type: "text", icon: "at", validators: [{ required: true, min: 1, max: 6 }], hint: "Độ dài tối đa 6 ký tự" },
                { type: "text_area", key: "description", value: item.description, name: "Mô tả thông tin của đơn vị", input_type: "text", icon: "md-alert", hint: "Nhập mô tả này để ghi nhớ" },
                {
                    type: "button",
                    options: [
                        { name: "Reset", next: "RESET" },
                        {
                            name: type === 'add' ? 'Tạo mới' : 'Chỉnh sửa', next: "CALLBACK",
                            url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                                + "/post-parameters"
                        }
                    ]
                }
            ]
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
    stopItem(item) {
        let form = {
            title: "Thay đổi trạng thái",
            buttons: [
                { color: "danger", icon: "close", next: "CLOSE" }
            ],
            items: [
                { type: "title", name: item.name },
                { type: "hidden", key: "id", value: item.id },
                { type: "hidden", key: "table_name", value: item.table_name },
                { type: "hidden", key: "wheres", value: item.wheres },
                { type: "datetime", key: "changed_date", value: item.changed_date, name: "Chọn ngày thay đổi trạng thái", display: "DD/MM/YYYY", picker: "DD/MM/YYYY" },
                { type: "toggle", key: "status", name: item.status ? "Tạm ngưng?" : "Kích hoạt?", value: item.status, color: "secondary", icon: "hand" },
                {
                    type: "button",
                    options: [
                        {
                            name: 'Cập nhập', next: "CALLBACK", url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                                + "/post-parameters"
                        }
                    ]
                }
            ]
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
    onClickDownload() {
        let linkFile = this.apiAuth.serviceUrls.RESOURCE_SERVER + '/get-templates/sample-danhmuc-tochuc.xlsx';
        this.apiDownload.processFileDownload(linkFile, config.sheet_name.value, "excel", config, this.callbackDownload);
    }
    /**
     * Chọn file dữ liệu mẫu và upload để cập nhật CSDL
     * @param ev
     */
    onClickUpload(ev) {
        let arFile = ev.target.files;
        // console.log(arFile);
        let fr = new FileReader();
        fr.readAsArrayBuffer(arFile[0]);
        fr.onloadend = () => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            let bufferData = fr.result;
            let wb = new exceljs__WEBPACK_IMPORTED_MODULE_6__["Workbook"]();
            try {
                let workbook = yield wb.xlsx.load(bufferData);
                let worksheet = workbook.getWorksheet(config.sheet_name.value);
                let results = [];
                worksheet.eachRow((row, rowIndex) => {
                    if (rowIndex > 3) {
                        let cols = {};
                        for (let key in config) {
                            let item = config[key];
                            if (key != "sheet_name") {
                                Object.defineProperty(cols, key, { value: this.getValueFormula(row.values[this.convertColExcel2Number(item.value)]) });
                            }
                        }
                        results.push(cols);
                    }
                });
                // console.log(results);
                let returnFinish = { count_success: 0, count_fail: 0 };
                for (const el of results) {
                    if (el.parent_id === this.userReport.organization_id) {
                        let jsonPost = { name: el.name, short_name: el.short_name, description: el.description, id: el.id, parent_id: el.parent_id };
                        // console.log(jsonPost);
                        try {
                            yield this.apiAuth.postDynamicJson(this.apiAuth.serviceUrls.RESOURCE_SERVER
                                + '/post-organizations', jsonPost);
                            returnFinish.count_success++;
                        }
                        catch (err) {
                            // console.log(err);
                            returnFinish.count_fail++;
                        }
                    }
                }
                console.log(returnFinish);
                //Báo cho socket biết là thực hiện xong
                this.socket.emit('Client-send-data');
            }
            catch (err) {
                console.log('Lỗi đọc file excel nguồn!', err);
            }
        });
    }
    getValueFormula(obj) {
        if (obj === null || obj === undefined)
            return null;
        if (typeof obj === 'object') {
            // xử lý chuyển đổi chỉ lấy text thôi
            if (obj.richText)
                return obj.richText.map(o => o["text"]).join("");
            // lấy giá trị bằng biểu thức function
            return obj.result;
        }
        return obj;
    }
};
OrganizationsPage.ctorParameters = () => [
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] },
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"] },
    { type: src_app_services_api_download_service__WEBPACK_IMPORTED_MODULE_3__["ApiDownloadService"] },
    { type: src_app_services_api_excel_service__WEBPACK_IMPORTED_MODULE_4__["ApiExcelService"] },
    { type: ngx_socket_io__WEBPACK_IMPORTED_MODULE_5__["Socket"] }
];
OrganizationsPage = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-organizations',
        template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! raw-loader!./organizations.page.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/organizations/organizations.page.html")).default,
        styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! ./organizations.page.scss */ "./src/app/pages/organizations/organizations.page.scss")).default]
    }),
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
        ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"],
        src_app_services_api_download_service__WEBPACK_IMPORTED_MODULE_3__["ApiDownloadService"],
        src_app_services_api_excel_service__WEBPACK_IMPORTED_MODULE_4__["ApiExcelService"],
        ngx_socket_io__WEBPACK_IMPORTED_MODULE_5__["Socket"]])
], OrganizationsPage);



/***/ }),

/***/ "./src/app/services/api-download.service.ts":
/*!**************************************************!*\
  !*** ./src/app/services/api-download.service.ts ***!
  \**************************************************/
/*! exports provided: ApiDownloadService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiDownloadService", function() { return ApiDownloadService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngxi4-dynamic-service */ "./node_modules/ngxi4-dynamic-service/__ivy_ngcc__/fesm2015/ngxi4-dynamic-service.js");
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! exceljs */ "./node_modules/exceljs/dist/exceljs.min.js");
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/dist/FileSaver.min.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_4__);





let ApiDownloadService = class ApiDownloadService {
    constructor(apiAuth) {
        this.apiAuth = apiAuth;
    }
    processFileDownload(urlTemplateFile, sheet_name, file_name, config, callbackPromise) {
        this.apiAuth.getDynamicUrl(urlTemplateFile, '', { responseType: 'blob' })
            .then(blobData => {
            // console.log(blobData);
            let fr = new FileReader();
            fr.readAsArrayBuffer(blobData);
            fr.onloadend = () => {
                let bufferData = fr.result;
                let wb = new exceljs__WEBPACK_IMPORTED_MODULE_3__["Workbook"]();
                wb.xlsx.load(bufferData)
                    .then((workbook) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                    // console.log(bufferData);
                    let arrayOutput = [];
                    workbook.eachSheet((sheet) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                        if (sheet.name === sheet_name) {
                            let ws = sheet;
                            let resultCallback = callbackPromise(ws, config);
                            arrayOutput.splice(arrayOutput.length, 0, resultCallback);
                        }
                        else {
                            // ẩn các sheet không dùng đến
                            sheet.state = 'hidden';
                        }
                    }));
                    // console.log(arrayOutput);
                    if (arrayOutput.length > 0 && arrayOutput[0].status === "OK" && arrayOutput[0].count > 0) {
                        workbook.views = [
                            {
                                x: 0, y: 0, width: 10000, height: 20000,
                                firstSheet: 0, activeTab: 0, visibility: 'visible'
                            }
                        ];
                        workbook.xlsx.writeBuffer().then(data => {
                            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                            file_saver__WEBPACK_IMPORTED_MODULE_4__["saveAs"](blob, `${file_name}-${sheet_name}-${Date.now()}.xlsx`);
                        });
                    }
                }))
                    .catch(err => {
                    console.log('Lỗi đọc dữ liệu blob', err);
                });
            };
        })
            .catch(err => {
            console.log('Lỗi lấy file mẫu từ API', err);
        });
    }
};
ApiDownloadService.ctorParameters = () => [
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] }
];
ApiDownloadService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    }),
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]])
], ApiDownloadService);



/***/ }),

/***/ "./src/app/services/api-excel.service.ts":
/*!***********************************************!*\
  !*** ./src/app/services/api-excel.service.ts ***!
  \***********************************************/
/*! exports provided: ApiExcelService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiExcelService", function() { return ApiExcelService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


let ApiExcelService = class ApiExcelService {
    constructor() { }
    processWriteExcel(data, ws, config) {
        let row = ws.getRow(2);
        row.getCell("A").value = data[0].name;
        row.getCell("E").value = data[0].id;
        // Xác định bề rộng cho các cột
        ws.getColumn(1).width = 5;
        ws.getColumn(2).alignment = { wrapText: true };
        ws.getColumn(4).alignment = { wrapText: true };
        let index = 0;
        data[0].subs.forEach(el => {
            row = ws.getRow(index + 4);
            row.getCell(config.noId.value).value = index + 1;
            row.getCell(config.name.value).value = el.name;
            row.getCell(config.short_name.value).value = el.short_name;
            row.getCell(config.description.value).value = el.description;
            row.getCell(config.id.value).value = el.id;
            row.getCell(config.parent_id.value).value = el.parent_id;
            index++;
        });
        return { status: "OK", count: index };
    }
};
ApiExcelService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    }),
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [])
], ApiExcelService);



/***/ })

}]);
//# sourceMappingURL=pages-organizations-organizations-module-es2015.js.map
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-job-roles-job-roles-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/job-roles/job-roles.page.html":
/*!*******************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/job-roles/job-roles.page.html ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n\r\n    <ion-buttons slot=\"start\">\r\n      <ion-menu-button></ion-menu-button>\r\n      <ion-back-button></ion-back-button>\r\n      <ion-button>\r\n        <input class=\"file-over\" type=\"file\" (change)=\"onClickUpload($event)\"\r\n          accept=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel\" />\r\n        <ion-icon name=\"cloud-upload\"></ion-icon>\r\n      </ion-button>\r\n    </ion-buttons>\r\n\r\n    <ion-title>CÂY CHỨC DANH</ion-title>\r\n\r\n    <ion-buttons slot=\"end\">\r\n      <ion-button (click)=\"onClickDownload()\">\r\n        <ion-icon name=\"cloud-download\"></ion-icon>\r\n      </ion-button>\r\n    </ion-buttons>\r\n\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content class=\"ion-no-padding\">\r\n  <ion-row>\r\n    <ion-col class=\"ion-text-center\" size=\"12\" class=\"card-prospect\" *ngFor=\"let item of organizationsTree\"\r\n      [style.background]=\"'#fafafaf6'\">\r\n\r\n      <ion-row (click)=\"onClickSpec($event, item)\">\r\n        <ion-col size=\"10\" class=\"prospect-header\" [style.color]=\"'darkblue'\">\r\n          <ion-icon item-start *ngIf=\"item.click_type\" style=\"font-size: 1em\" [style.color]=\"'lightblue'\"\r\n            name=\"md-cloud-upload\"></ion-icon>{{item.name}}\r\n        </ion-col>\r\n        <ion-col size=\"2\" class=\"prospect-header\" [style.color]=\"'darkblue'\">\r\n          {{item.id}}\r\n        </ion-col>\r\n      </ion-row>\r\n\r\n      <tree-list [treeData]=\"item.subs\" (onClickKpi)=\"onClickTreeItem($event)\"></tree-list>\r\n\r\n    </ion-col>\r\n\r\n  </ion-row>\r\n</ion-content>");

/***/ }),

/***/ "./src/app/pages/job-roles/job-roles-routing.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/pages/job-roles/job-roles-routing.module.ts ***!
  \*************************************************************/
/*! exports provided: JobRolesPageRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobRolesPageRoutingModule", function() { return JobRolesPageRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _job_roles_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./job-roles.page */ "./src/app/pages/job-roles/job-roles.page.ts");




const routes = [
    {
        path: '',
        component: _job_roles_page__WEBPACK_IMPORTED_MODULE_3__["JobRolesPage"]
    }
];
let JobRolesPageRoutingModule = class JobRolesPageRoutingModule {
};
JobRolesPageRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
    })
], JobRolesPageRoutingModule);



/***/ }),

/***/ "./src/app/pages/job-roles/job-roles.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/pages/job-roles/job-roles.module.ts ***!
  \*****************************************************/
/*! exports provided: JobRolesPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobRolesPageModule", function() { return JobRolesPageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _job_roles_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./job-roles-routing.module */ "./src/app/pages/job-roles/job-roles-routing.module.ts");
/* harmony import */ var _job_roles_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./job-roles.page */ "./src/app/pages/job-roles/job-roles.page.ts");
/* harmony import */ var src_app_shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared.module */ "./src/app/shared.module.ts");





let JobRolesPageModule = class JobRolesPageModule {
};
JobRolesPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            src_app_shared_module__WEBPACK_IMPORTED_MODULE_4__["SharedModule"],
            _job_roles_routing_module__WEBPACK_IMPORTED_MODULE_2__["JobRolesPageRoutingModule"]
        ],
        declarations: [_job_roles_page__WEBPACK_IMPORTED_MODULE_3__["JobRolesPage"]]
    })
], JobRolesPageModule);



/***/ }),

/***/ "./src/app/pages/job-roles/job-roles.page.scss":
/*!*****************************************************!*\
  !*** ./src/app/pages/job-roles/job-roles.page.scss ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".card-title-header {\n  font-size: 1.5em;\n  width: 90%;\n  font-weight: bold;\n  color: darkblue;\n  text-transform: uppercase;\n  opacity: 0.7;\n}\n\n.card-prospect {\n  border-radius: 0.8em;\n  border: solid 0.15em #FFFFFF;\n  width: 100%;\n}\n\n.card-prospect .prospect-header {\n  font-size: 1.2em;\n  width: 100%;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.9;\n}\n\n.table-row .table-header {\n  background: #99b7f0e0 !important;\n  color: #0a0909fb !important;\n  font-weight: bold;\n}\n\n.table-row ion-col {\n  border: solid 0.1em #FFFFFF;\n  font-size: 1.3em;\n}\n\n.table-row ion-row:nth-of-type(odd) {\n  background: #fafafaf6;\n  color: #202020;\n  opacity: 0.9;\n}\n\n.table-row ion-row:nth-of-type(even) {\n  background: #e6f5f8;\n  color: #202020;\n  opacity: 0.7;\n}\n\n.file-over {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  width: 100%;\n  height: 100%;\n  opacity: 1;\n  cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvam9iLXJvbGVzL0Q6XFxNWURBVEFcXExhcFRyaW5oRGlEb25nXFxOT0RFNFxcbm9kZTQtcWxuc1xcY2xpZW50L3NyY1xcYXBwXFxwYWdlc1xcam9iLXJvbGVzXFxqb2Itcm9sZXMucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9qb2Itcm9sZXMvam9iLXJvbGVzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNJLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO0VBQ0EsWUFBQTtBQ0FKOztBRElBO0VBQ0ksb0JBQUE7RUFDQSw0QkFBQTtFQUNBLFdBQUE7QUNESjs7QURLQTtFQUNJLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FDRko7O0FETUE7RUFDSSxnQ0FBQTtFQUNBLDJCQUFBO0VBQ0EsaUJBQUE7QUNISjs7QURNQTtFQUNJLDJCQUFBO0VBQ0EsZ0JBQUE7QUNISjs7QURNQTtFQUNJLHFCQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISjs7QURNQTtFQUNJLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISjs7QURNQTtFQUNJLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxVQUFBO0VBQ0EsZUFBQTtBQ0hKIiwiZmlsZSI6InNyYy9hcHAvcGFnZXMvam9iLXJvbGVzL2pvYi1yb2xlcy5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvL3RoaeG6v3QgbOG6rXAgY2jhu68gY2hvIHRpw6p1IMSR4buBIGPDtG5nIHR5XHJcbi5jYXJkLXRpdGxlLWhlYWRlciB7XHJcbiAgICBmb250LXNpemU6IDEuNWVtO1xyXG4gICAgd2lkdGg6IDkwJTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgY29sb3I6IGRhcmtibHVlO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIG9wYWNpdHk6IDAuNztcclxufVxyXG5cclxuLy9UaGnhur90IGzhuq1wIGtodW5nIG7hu4FuIHbDoCBj4buhIGNo4buvIGNobyBjYXJkIHZp4buFbiBj4bqjbmhcclxuLmNhcmQtcHJvc3BlY3R7XHJcbiAgICBib3JkZXItcmFkaXVzOiAwLjhlbTtcclxuICAgIGJvcmRlcjogc29saWQgMC4xNWVtICNGRkZGRkY7XHJcbiAgICB3aWR0aDoxMDAlO1xyXG4gICAgLy9vcGFjaXR5OiAwLjg7XHJcbn1cclxuXHJcbi5jYXJkLXByb3NwZWN0IC5wcm9zcGVjdC1oZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiAxLjJlbTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgb3BhY2l0eTogMC45O1xyXG59XHJcblxyXG4vL1RoaeG6v3QgbOG6rXAgZMOybmcgY2jhurVuIGzhursgY2hvIGLhuqNuZ1xyXG4udGFibGUtcm93IC50YWJsZS1oZWFkZXIgeyAvL3ThuqV0IGPhuqMgY8OhYyBj4buZdCBzYXUgY2xhc3MgbsOgeVxyXG4gICAgYmFja2dyb3VuZDogIzk5YjdmMGUwICFpbXBvcnRhbnQ7XHJcbiAgICBjb2xvcjojMGEwOTA5ZmIgIWltcG9ydGFudDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcblxyXG4udGFibGUtcm93IGlvbi1jb2wgeyAvL3ThuqV0IGPhuqMgY8OhYyBj4buZdCBzYXUgY2xhc3MgbsOgeVxyXG4gICAgYm9yZGVyOiBzb2xpZCAwLjFlbSAjRkZGRkZGO1xyXG4gICAgZm9udC1zaXplOiAxLjNlbTtcclxufVxyXG5cclxuLnRhYmxlLXJvdyBpb24tcm93Om50aC1vZi10eXBlKG9kZCkgeyAvL2TDsm5nIGzhurtcclxuICAgIGJhY2tncm91bmQ6ICNmYWZhZmFmNjtcclxuICAgIGNvbG9yOiMyMDIwMjA7XHJcbiAgICBvcGFjaXR5OiAwLjk7XHJcbn1cclxuXHJcbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShldmVuKSB7IC8vZMOybmcgY2jhurVuXHJcbiAgICBiYWNrZ3JvdW5kOiAjZTZmNWY4O1xyXG4gICAgY29sb3I6IzIwMjAyMDtcclxuICAgIG9wYWNpdHk6IDAuNztcclxufVxyXG5cclxuLmZpbGUtb3ZlciB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgei1pbmRleDogMjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufSIsIi5jYXJkLXRpdGxlLWhlYWRlciB7XG4gIGZvbnQtc2l6ZTogMS41ZW07XG4gIHdpZHRoOiA5MCU7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogZGFya2JsdWU7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIG9wYWNpdHk6IDAuNztcbn1cblxuLmNhcmQtcHJvc3BlY3Qge1xuICBib3JkZXItcmFkaXVzOiAwLjhlbTtcbiAgYm9yZGVyOiBzb2xpZCAwLjE1ZW0gI0ZGRkZGRjtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5jYXJkLXByb3NwZWN0IC5wcm9zcGVjdC1oZWFkZXIge1xuICBmb250LXNpemU6IDEuMmVtO1xuICB3aWR0aDogMTAwJTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIG9wYWNpdHk6IDAuOTtcbn1cblxuLnRhYmxlLXJvdyAudGFibGUtaGVhZGVyIHtcbiAgYmFja2dyb3VuZDogIzk5YjdmMGUwICFpbXBvcnRhbnQ7XG4gIGNvbG9yOiAjMGEwOTA5ZmIgIWltcG9ydGFudDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5cbi50YWJsZS1yb3cgaW9uLWNvbCB7XG4gIGJvcmRlcjogc29saWQgMC4xZW0gI0ZGRkZGRjtcbiAgZm9udC1zaXplOiAxLjNlbTtcbn1cblxuLnRhYmxlLXJvdyBpb24tcm93Om50aC1vZi10eXBlKG9kZCkge1xuICBiYWNrZ3JvdW5kOiAjZmFmYWZhZjY7XG4gIGNvbG9yOiAjMjAyMDIwO1xuICBvcGFjaXR5OiAwLjk7XG59XG5cbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShldmVuKSB7XG4gIGJhY2tncm91bmQ6ICNlNmY1Zjg7XG4gIGNvbG9yOiAjMjAyMDIwO1xuICBvcGFjaXR5OiAwLjc7XG59XG5cbi5maWxlLW92ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgei1pbmRleDogMjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3BhY2l0eTogMTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/pages/job-roles/job-roles.page.ts":
/*!***************************************************!*\
  !*** ./src/app/pages/job-roles/job-roles.page.ts ***!
  \***************************************************/
/*! exports provided: JobRolesPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobRolesPage", function() { return JobRolesPage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngxi4-dynamic-service */ "./node_modules/ngxi4-dynamic-service/fesm2015/ngxi4-dynamic-service.js");
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! exceljs */ "./node_modules/exceljs/dist/exceljs.min.js");
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/dist/FileSaver.min.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_4__);





let config = {
    sheet_name: { value: 'job_roles' },
    noId: { value: "A" },
    name: { value: "B" },
    short_name: { value: "C" },
    description: { value: "D" },
    id: { value: "E" },
    parent_id: { value: "F" },
    organization_id: { value: "G" },
    organization_name: { value: "H" }
};
let JobRolesPage = class JobRolesPage {
    constructor(apiAuth, apiCommon) {
        this.apiAuth = apiAuth;
        this.apiCommon = apiCommon;
        /**
         * Hàm xử lý kết quả post sửa thêm xóa
         */
        this.callbackProcess = function (res) {
            //console.log(res);
            return new Promise(resolve => {
                if (res.error) {
                    this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
                }
                else {
                    //lấy lại kết quả đã tính toán
                    this.onChangeSelect();
                }
                resolve({ next: "CLOSE" });
            });
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
    }
    refreshNews() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            try {
                this.userReport = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-user-report");
                // console.log(this.userReport);
                this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0;
                this.organizations = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-organizations");
                // console.log(this.organizations);
            }
            catch (e) { }
            this.onChangeSelect();
        });
    }
    /**
     * Khi có thay đổi thêm mới/cập nhật/xóa
     */
    onChangeSelect() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            this.organizationsTree = [];
            this.jobRolesTree = [];
            try {
                // lấy danh sách chức danh trong csdl
                this.jobRoles = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-job-roles");
                // console.log(this.jobRoles);
                // Chuyển thành cây chức danh
                if (Array.isArray(this.jobRoles)) {
                    this.jobRolesTree = this.apiCommon.createTreeMenu(this.jobRoles, 'id', 'parent_id');
                    // console.log(this.jobRolesTree);
                }
                let orgTree = [];
                // lọc lấy những tổ chức theo id tổ chức của user
                this.organizations.forEach(el => {
                    if (el.id === this.organizationId) {
                        orgTree.push(el);
                    }
                    if (el.parent_id === this.organizationId) {
                        orgTree.push(el);
                    }
                });
                // console.log(orgTree);
                // thêm thuộc tính click_type và main_tree cho cây chính
                // ghép cây chức danh vào cây chính
                orgTree.forEach(el => {
                    el.click_type = 1; //cây chính cho click luôn
                    el.main_tree = 1; //là cây chính
                    // Nếu id khác id tổ chức của user thì mới ghép vào (tức là ds các chức danh của tổ chức, không phải là giám đốc)
                    if (this.jobRolesTree && el.id !== this.organizationId) {
                        // ghép cây chức danh vào làm nhánh của cây tổ chức theo id tổ chức
                        el.subs = this.jobRolesTree.filter(x => x.organization_id === el.id);
                    }
                });
                // console.log(orgTree);
                // chuyển cây tổ chức và chức danh thành cây chính để hiển thị
                this.organizationsTree = this.apiCommon.createTreeMenu(orgTree, 'id', 'parent_id');
                // console.log(this.organizationsTree);
                // ghép chức danh giám đốc vào
                this.organizationsTree.forEach(el => {
                    if (this.jobRolesTree && el.id + '' === '' + this.organizationId) {
                        let rootSubs = this.jobRolesTree.filter(x => x.organization_id === el.id);
                        if (!el.subs)
                            el.subs = rootSubs;
                        rootSubs.forEach(elsub => {
                            let index = el.subs.findIndex(x => x.id === elsub.id && x.organization_id == elsub.organization_id);
                            if (index >= 0) {
                                el.subs.splice(index, 1, elsub);
                            }
                            else {
                                el.subs.unshift(elsub);
                            }
                        });
                    }
                });
            }
            catch (e) {
                console.log('Error:', e);
            }
        });
    }
    /**
     * Click vào nội dung cấp Công ty/Trung tâm
     * @param ev
     * @param card
     */
    onClickSpec(ev, item) {
        //console.log(item);
        let menu = [
            {
                name: "Thêm chức danh GĐ",
                value: "add-child",
                icon: {
                    name: "md-add",
                    color: "secondary",
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
     * Click vào đơn vị cấp con
     * @param event
     */
    onClickTreeItem(event) {
        //Khai báo menu popup
        let menu;
        //cây chức danh thuần
        // console.log(event.item);
        if (!event.item.main_tree) {
            menu = [
                {
                    icon: {
                        name: "md-create",
                        color: "primary",
                    },
                    name: "Chỉnh sửa chức danh",
                    value: "edit-owner"
                },
                {
                    icon: {
                        name: "trash",
                        color: "danger",
                    },
                    name: event.item.status === 1 ? "Khóa bỏ chức danh" : "Kích hoạt chức danh",
                    value: "stop-owner"
                }
            ];
            //Nếu là chức danh quản lý thì mới có menu thêm chức danh con
            if (event.item.$level == 1) {
                menu.unshift({
                    icon: {
                        name: "md-add",
                        color: "secondary",
                    },
                    name: "Thêm chức danh con",
                    value: "add-child"
                });
            }
        }
        else {
            menu = [
                {
                    icon: {
                        name: "md-add",
                        color: "secondary",
                    },
                    name: "Thêm chức danh TP",
                    value: "add-child"
                }
            ];
        }
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
                parent_id: item.main_tree === 1 ? undefined : item.id,
                organization_id: item.organization_id ? item.organization_id : item.id,
                table_name: 'job_roles',
                wheres: [],
                title_name: item.name //tên của cấp cha
            };
            this.addNewItem(itemNew, 'add');
        }
        //sửa tham số
        if (cmd.value === 'edit-owner') {
            item.table_name = 'job_roles'; //tên bảng cần đưa vào
            item.wheres = ['id']; //Mệnh đề wheres để update
            item.title_name = item.name;
            this.addNewItem(item, 'edit');
        }
        //tạm dừng tham số
        if (cmd.value === 'stop-owner') {
            item.table_name = 'job_roles'; //tên bảng cần đưa vào
            item.wheres = ['id']; //Mệnh đề wheres để update
            this.stopItem(item);
        }
    }
    /**
     * Dừng đối tượng này
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
     * Thêm hoặc sửa chức danh
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
                { type: "hidden", key: "organization_id", value: item.organization_id },
                { type: "hidden", key: "table_name", value: item.table_name },
                { type: "hidden", key: "wheres", value: item.wheres },
                { type: "text", key: "short_name", value: item.short_name, name: "Nhóm chức danh", input_type: "text", icon: "ios-people", validators: [{ required: true, min: 2, max: 20 }], hint: "Mã nhóm viết tắt vd: TT-VT để nhóm cùng loại khác đơn vị" },
                { type: "text", key: "name", value: item.name, name: "Tên chức danh", input_type: "text", icon: "calendar", validators: [{ required: true, min: 5, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" },
                { type: "text_area", key: "description", value: item.description, name: "Mô tả công việc của chức danh này", input_type: "text", icon: "md-alert", hint: "Nhập mô tả chức danh này để ghi nhớ, công việc làm gì" },
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
    onClickDownload() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            let templateFile = this.apiAuth.serviceUrls.RESOURCE_SERVER + '/get-templates/sample-danhmuc-tochuc.xlsx';
            let blobData = yield this.apiAuth.getDynamicUrl(templateFile, '', { responseType: 'blob' });
            let fr = new FileReader();
            fr.readAsArrayBuffer(blobData);
            fr.onloadend = () => tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
                let bufferData = fr.result;
                let wb = new exceljs__WEBPACK_IMPORTED_MODULE_3__["Workbook"]();
                let workbook = yield wb.xlsx.load(bufferData);
                //ẩn các sheet không mong muốn
                workbook.eachSheet(sheet => {
                    if (sheet.name !== config.sheet_name.value)
                        sheet.state = 'hidden';
                });
                let worksheet = workbook.getWorksheet(config.sheet_name.value);
                let row = worksheet.getRow(2);
                row.getCell("A").value = this.organizationsTree[0].name;
                row.getCell("E").value = this.organizationsTree[0].id;
                // xác định bề rộng cho các cột
                worksheet.getColumn(1).width = 5;
                worksheet.getColumn(2).width = 30;
                worksheet.getColumn(3).width = 18;
                worksheet.getColumn(4).width = 30;
                worksheet.getColumn(8).width = 20;
                // tự động xuống hàng nếu text quá dài
                worksheet.getColumn(2).alignment = { wrapText: true };
                worksheet.getColumn(3).alignment = { wrapText: true };
                worksheet.getColumn(4).alignment = { wrapText: true };
                worksheet.getColumn(8).alignment = { wrapText: true };
                let idx = 4;
                // Lặp mảng để ghi dữ liệu vào excel
                this.jobRoles.forEach(el => {
                    row = worksheet.getRow(idx);
                    row.getCell(config.noId.value).value = idx - 3;
                    row.getCell(config.name.value).value = el.name;
                    row.getCell(config.short_name.value).value = el.short_name;
                    row.getCell(config.description.value).value = el.description;
                    row.getCell(config.id.value).value = el.id;
                    row.getCell(config.parent_id.value).value = el.parent_id;
                    row.getCell(config.organization_id.value).value = el.organization_id;
                    row.getCell(config.organization_name.value).value = el.organization_name;
                    idx++;
                });
                workbook.views = [
                    {
                        x: 0, y: 0, width: 10000, height: 20000,
                        firstSheet: 1, activeTab: 1, visibility: 'visible'
                    }
                ];
                //Ghi file excel
                workbook.xlsx.writeBuffer().then((data) => {
                    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    file_saver__WEBPACK_IMPORTED_MODULE_4__["saveAs"](blob, `excel-job_roles-${Date.now()}.xlsx`);
                });
            });
        });
    }
    onClickUpload(ev) {
        let arFile = ev.target.files;
        // console.log(arFile);
        let fr = new FileReader();
        fr.readAsArrayBuffer(arFile[0]);
        fr.onloadend = () => tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            let bufferData = fr.result;
            let wb = new exceljs__WEBPACK_IMPORTED_MODULE_3__["Workbook"]();
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
                    let jsonPost = {
                        name: el.name,
                        short_name: el.short_name,
                        description: el.description,
                        id: el.id,
                        parent_id: el.parent_id,
                        organization_id: el.organization_id
                    };
                    // console.log(jsonPost);
                    try {
                        yield this.apiAuth.postDynamicJson(this.apiAuth.serviceUrls.RESOURCE_SERVER
                            + '/post-job-roles', jsonPost);
                        returnFinish.count_success++;
                    }
                    catch (err) {
                        // console.log(err);
                        returnFinish.count_fail++;
                    }
                }
                console.log(returnFinish);
                this.onChangeSelect();
            }
            catch (err) {
                console.log('Lỗi đọc file excel nguồn!', err);
            }
            finally {
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
JobRolesPage.ctorParameters = () => [
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] },
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"] }
];
JobRolesPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-job-roles',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./job-roles.page.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/job-roles/job-roles.page.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./job-roles.page.scss */ "./src/app/pages/job-roles/job-roles.page.scss")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
        ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]])
], JobRolesPage);



/***/ })

}]);
//# sourceMappingURL=pages-job-roles-job-roles-module-es2015.js.map
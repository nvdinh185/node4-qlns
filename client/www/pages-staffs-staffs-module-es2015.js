(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-staffs-staffs-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/staffs/staffs.page.html":
/*!*************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/staffs/staffs.page.html ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header>\n  <ion-toolbar color=\"primary\">\n\n    <ion-buttons slot=\"start\">\n      <ion-menu-button></ion-menu-button>\n      <ion-back-button></ion-back-button>\n      <ion-button>\n        <input class=\"file-over\" type=\"file\" multiple=\"single\" (change)=\"onClickUpload($event)\"\n          accept=\".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel\" />\n        <ion-icon name=\"cloud-upload\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n\n    <ion-title>CÂY NHÂN SỰ</ion-title>\n\n    <ion-buttons slot=\"end\">\n      <ion-button (click)=\"onClickDownload()\">\n        <ion-icon name=\"cloud-download\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class=\"ion-no-padding\">\n  <ion-row>\n    <ion-col class=\"ion-text-center\" size=\"12\" class=\"card-prospect\" *ngFor=\"let item of organizationsTree\"\n      [style.background]=\"'#fafafaf6'\">\n\n      <ion-row (click)=\"onClickSpec($event, item)\">\n        <ion-col size=\"10\" class=\"prospect-header\" [style.color]=\"'darkblue'\">\n          <ion-icon item-start *ngIf=\"item.click_type\" style=\"font-size: 1em\" [style.color]=\"'lightblue'\"\n            name=\"md-cloud-upload\"></ion-icon>{{item.name}}\n        </ion-col>\n        <ion-col size=\"2\" class=\"prospect-header\" [style.color]=\"'darkblue'\">\n          {{item.id}}\n        </ion-col>\n      </ion-row>\n\n      <tree-list [treeData]=\"item.subs\" (onClickKpi)=\"onClickTreeItem($event)\"></tree-list>\n\n    </ion-col>\n\n  </ion-row>\n</ion-content>\n");

/***/ }),

/***/ "./src/app/pages/staffs/staffs-routing.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/pages/staffs/staffs-routing.module.ts ***!
  \*******************************************************/
/*! exports provided: StaffsPageRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StaffsPageRoutingModule", function() { return StaffsPageRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _staffs_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./staffs.page */ "./src/app/pages/staffs/staffs.page.ts");




const routes = [
    {
        path: '',
        component: _staffs_page__WEBPACK_IMPORTED_MODULE_3__["StaffsPage"]
    }
];
let StaffsPageRoutingModule = class StaffsPageRoutingModule {
};
StaffsPageRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
    })
], StaffsPageRoutingModule);



/***/ }),

/***/ "./src/app/pages/staffs/staffs.module.ts":
/*!***********************************************!*\
  !*** ./src/app/pages/staffs/staffs.module.ts ***!
  \***********************************************/
/*! exports provided: StaffsPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StaffsPageModule", function() { return StaffsPageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _staffs_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./staffs-routing.module */ "./src/app/pages/staffs/staffs-routing.module.ts");
/* harmony import */ var _staffs_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./staffs.page */ "./src/app/pages/staffs/staffs.page.ts");
/* harmony import */ var src_app_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/shared.module */ "./src/app/shared.module.ts");








let StaffsPageModule = class StaffsPageModule {
};
StaffsPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
            src_app_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
            _staffs_routing_module__WEBPACK_IMPORTED_MODULE_5__["StaffsPageRoutingModule"]
        ],
        declarations: [_staffs_page__WEBPACK_IMPORTED_MODULE_6__["StaffsPage"]]
    })
], StaffsPageModule);



/***/ }),

/***/ "./src/app/pages/staffs/staffs.page.scss":
/*!***********************************************!*\
  !*** ./src/app/pages/staffs/staffs.page.scss ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".card-title-header {\n  font-size: 1.5em;\n  width: 90%;\n  font-weight: bold;\n  color: darkblue;\n  text-transform: uppercase;\n  opacity: 0.7;\n}\n\n.card-prospect {\n  border-radius: 0.8em;\n  border: solid 0.15em #FFFFFF;\n  width: 100%;\n}\n\n.card-prospect .prospect-header {\n  font-size: 1.2em;\n  width: 100%;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.9;\n}\n\n.table-row .table-header {\n  background: #99b7f0e0 !important;\n  color: #0a0909fb !important;\n  font-weight: bold;\n}\n\n.table-row ion-col {\n  border: solid 0.1em #FFFFFF;\n  font-size: 1.3em;\n}\n\n.table-row ion-row:nth-of-type(odd) {\n  background: #fafafaf6;\n  color: #202020;\n  opacity: 0.9;\n}\n\n.table-row ion-row:nth-of-type(even) {\n  background: #e6f5f8;\n  color: #202020;\n  opacity: 0.7;\n}\n\n.file-over {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  width: 100%;\n  height: 100%;\n  opacity: 1;\n  cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvc3RhZmZzL0Q6XFxESU5ITlZcXE15RGF0YVxcTEFQVFJJTkhcXE5PREU0XFxpb25pYzQucWxuc1xcY2xpZW50L3NyY1xcYXBwXFxwYWdlc1xcc3RhZmZzXFxzdGFmZnMucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9zdGFmZnMvc3RhZmZzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNJLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO0VBQ0EsWUFBQTtBQ0FKOztBRElBO0VBQ0ksb0JBQUE7RUFDQSw0QkFBQTtFQUNBLFdBQUE7QUNESjs7QURLQTtFQUNJLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FDRko7O0FETUE7RUFDSSxnQ0FBQTtFQUNBLDJCQUFBO0VBQ0EsaUJBQUE7QUNISjs7QURNQTtFQUNJLDJCQUFBO0VBQ0EsZ0JBQUE7QUNISjs7QURNQTtFQUNJLHFCQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISjs7QURNQTtFQUNJLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISjs7QURNQTtFQUNJLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxVQUFBO0VBQ0EsZUFBQTtBQ0hKIiwiZmlsZSI6InNyYy9hcHAvcGFnZXMvc3RhZmZzL3N0YWZmcy5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvL3RoaeG6v3QgbOG6rXAgY2jhu68gY2hvIHRpw6p1IMSR4buBIGPDtG5nIHR5XHJcbi5jYXJkLXRpdGxlLWhlYWRlciB7XHJcbiAgICBmb250LXNpemU6IDEuNWVtO1xyXG4gICAgd2lkdGg6IDkwJTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgY29sb3I6IGRhcmtibHVlO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIG9wYWNpdHk6IDAuNztcclxufVxyXG5cclxuLy9UaGnhur90IGzhuq1wIGtodW5nIG7hu4FuIHbDoCBj4buhIGNo4buvIGNobyBjYXJkIHZp4buFbiBj4bqjbmhcclxuLmNhcmQtcHJvc3BlY3R7XHJcbiAgICBib3JkZXItcmFkaXVzOiAwLjhlbTtcclxuICAgIGJvcmRlcjogc29saWQgMC4xNWVtICNGRkZGRkY7XHJcbiAgICB3aWR0aDoxMDAlO1xyXG4gICAgLy9vcGFjaXR5OiAwLjg7XHJcbn1cclxuXHJcbi5jYXJkLXByb3NwZWN0IC5wcm9zcGVjdC1oZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiAxLjJlbTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgb3BhY2l0eTogMC45O1xyXG59XHJcblxyXG4vL1RoaeG6v3QgbOG6rXAgZMOybmcgY2jhurVuIGzhursgY2hvIGLhuqNuZ1xyXG4udGFibGUtcm93IC50YWJsZS1oZWFkZXIgeyAvL3ThuqV0IGPhuqMgY8OhYyBj4buZdCBzYXUgY2xhc3MgbsOgeVxyXG4gICAgYmFja2dyb3VuZDogIzk5YjdmMGUwICFpbXBvcnRhbnQ7XHJcbiAgICBjb2xvcjojMGEwOTA5ZmIgIWltcG9ydGFudDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcblxyXG4udGFibGUtcm93IGlvbi1jb2wgeyAvL3ThuqV0IGPhuqMgY8OhYyBj4buZdCBzYXUgY2xhc3MgbsOgeVxyXG4gICAgYm9yZGVyOiBzb2xpZCAwLjFlbSAjRkZGRkZGO1xyXG4gICAgZm9udC1zaXplOiAxLjNlbTtcclxufVxyXG5cclxuLnRhYmxlLXJvdyBpb24tcm93Om50aC1vZi10eXBlKG9kZCkgeyAvL2TDsm5nIGzhurtcclxuICAgIGJhY2tncm91bmQ6ICNmYWZhZmFmNjtcclxuICAgIGNvbG9yOiMyMDIwMjA7XHJcbiAgICBvcGFjaXR5OiAwLjk7XHJcbn1cclxuXHJcbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShldmVuKSB7IC8vZMOybmcgY2jhurVuXHJcbiAgICBiYWNrZ3JvdW5kOiAjZTZmNWY4O1xyXG4gICAgY29sb3I6IzIwMjAyMDtcclxuICAgIG9wYWNpdHk6IDAuNztcclxufVxyXG5cclxuLmZpbGUtb3ZlciB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgei1pbmRleDogMjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufSIsIi5jYXJkLXRpdGxlLWhlYWRlciB7XG4gIGZvbnQtc2l6ZTogMS41ZW07XG4gIHdpZHRoOiA5MCU7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogZGFya2JsdWU7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIG9wYWNpdHk6IDAuNztcbn1cblxuLmNhcmQtcHJvc3BlY3Qge1xuICBib3JkZXItcmFkaXVzOiAwLjhlbTtcbiAgYm9yZGVyOiBzb2xpZCAwLjE1ZW0gI0ZGRkZGRjtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5jYXJkLXByb3NwZWN0IC5wcm9zcGVjdC1oZWFkZXIge1xuICBmb250LXNpemU6IDEuMmVtO1xuICB3aWR0aDogMTAwJTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIG9wYWNpdHk6IDAuOTtcbn1cblxuLnRhYmxlLXJvdyAudGFibGUtaGVhZGVyIHtcbiAgYmFja2dyb3VuZDogIzk5YjdmMGUwICFpbXBvcnRhbnQ7XG4gIGNvbG9yOiAjMGEwOTA5ZmIgIWltcG9ydGFudDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5cbi50YWJsZS1yb3cgaW9uLWNvbCB7XG4gIGJvcmRlcjogc29saWQgMC4xZW0gI0ZGRkZGRjtcbiAgZm9udC1zaXplOiAxLjNlbTtcbn1cblxuLnRhYmxlLXJvdyBpb24tcm93Om50aC1vZi10eXBlKG9kZCkge1xuICBiYWNrZ3JvdW5kOiAjZmFmYWZhZjY7XG4gIGNvbG9yOiAjMjAyMDIwO1xuICBvcGFjaXR5OiAwLjk7XG59XG5cbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShldmVuKSB7XG4gIGJhY2tncm91bmQ6ICNlNmY1Zjg7XG4gIGNvbG9yOiAjMjAyMDIwO1xuICBvcGFjaXR5OiAwLjc7XG59XG5cbi5maWxlLW92ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgei1pbmRleDogMjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3BhY2l0eTogMTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/pages/staffs/staffs.page.ts":
/*!*********************************************!*\
  !*** ./src/app/pages/staffs/staffs.page.ts ***!
  \*********************************************/
/*! exports provided: StaffsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StaffsPage", function() { return StaffsPage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngxi4-dynamic-service */ "./node_modules/ngxi4-dynamic-service/fesm2015/ngxi4-dynamic-service.js");
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! exceljs */ "./node_modules/exceljs/dist/exceljs.min.js");
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/dist/FileSaver.min.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_4__);





let config = {
    sheet_name: { value: 'staffs' },
    noId: { value: "A" },
    name: { value: "B" },
    organization_id: { value: "C" },
    organization_name: { value: "D" },
    job_id: { value: "E" },
    job_name: { value: "F" },
    id: { value: "G" },
    job_list: { value: "H" }
};
let StaffsPage = class StaffsPage {
    constructor(apiAuth, apiCommon) {
        this.apiAuth = apiAuth;
        this.apiCommon = apiCommon;
        /**
         * Hàm xử lý kết quả post sửa thêm
         */
        this.callbackKpi = function (res) {
            //console.log(res);
            return new Promise(resolve => {
                if (res.error) {
                    this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
                }
                else if (res.ajax) {
                    //res.ajax.key==='organization_id' là trường có giá trị thay đổi
                    //res.ajax.value là giá trị thay đổi ở trường có tên ở trên
                    if (res.ajax.key === 'organization_id' && res.ajax.value) {
                        //tùy chọn chức danh
                        let jobOptions = [];
                        //tùy chọn chức danh kiêm nhiệm (bỏ chức danh chính đi)
                        let jobListOptions = [];
                        //lấy danh sách chức danh tùy chọn
                        if (Array.isArray(this.jobRoles)) {
                            this.jobRoles.forEach(el => {
                                //chỉ lọc chức danh của tổ chức được chọn thôi
                                if ('' + el.organization_id === '' + res.ajax.value) {
                                    //lấy tùy chọn chức danh
                                    jobOptions.push({ name: el.name, value: parseInt(el.id) });
                                    //vì không biết chọn chức danh nào nên vẫn trả đủ danh sách chức danh kiêm nhiệm
                                    jobListOptions.push({ name: el.name, value: parseInt(el.id) });
                                }
                            });
                        }
                        //báo cho form động biết cần thay đổi trường dữ liệu ajax nào
                        resolve([
                            {
                                key: "job_id" //tìm item có key là trường này
                                ,
                                property_name: "options" //nếu tìm thấy thì thay thuộc tính có tên ở đây
                                ,
                                new_data: jobOptions //bằng giá trị mới cập nhập do chọn lựa từ form này
                            },
                            {
                                key: "job_list" //tìm item có key là trường này
                                ,
                                property_name: "options" //nếu tìm thấy thì thay thuộc tính có tên ở đây
                                ,
                                new_data: jobListOptions //bằng giá trị mới cập nhập do chọn lựa từ form này
                            }
                        ]);
                    }
                    else if (res.ajax.key === 'job_id' && res.ajax.value) {
                        //vì thay đổi chức danh chính nên
                        //thay đổi chức danh kiêm nhiệm là trừ công việc chính đi
                        let jobListOptions = [];
                        if (Array.isArray(this.jobRoles)) {
                            //lấy công việc chính đã chọn
                            let elSelected = this.jobRoles.find(x => x.id == res.ajax.value);
                            if (elSelected) {
                                this.jobRoles.forEach(el => {
                                    //chỉ lọc chức danh của tổ chức được chọn thôi
                                    //loại trừ chức danh được chọn
                                    if ('' + el.organization_id === '' + elSelected.organization_id && '' + el.id !== '' + res.ajax.value) {
                                        jobListOptions.push({ name: el.name, value: parseInt(el.id) });
                                    }
                                });
                            }
                            //báo cho form động biết cần thay đổi trường dữ liệu ajax nào
                            // console.log(jobListOptions);
                            resolve({
                                key: "job_list" //tìm item có key là trường này
                                ,
                                property_name: "options" //nếu tìm thấy thì thay thuộc tính có tên ở đây
                                ,
                                new_data: jobListOptions //bằng giá trị mới cập nhập do chọn lựa từ form này
                            });
                        }
                    }
                    else {
                        resolve({ next: "NO-CHANGE" }); //không có gì thay đổi cả
                    }
                    return; //nếu gọi kiểu ajax thì chỉ trả về form đó thôi, không đóng form popup
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
                //Lấy danh sách tổ chức có trong csdl, 
                this.organizations = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-organizations");
                // console.log('Organization', this.organizations);
                //lấy mã tổ chức của username: 0766777123
                this.userReport = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-user-report");
                // console.log('get-user-report', this.userReport);
                //mã tổ chức của user
                this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0;
                //lấy danh sách chức danh từ csdl
                this.jobRoles = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-job-roles");
                // console.log('get-job-roles', this.jobRoles);
            }
            catch (e) {
                console.log('Lỗi', e);
            }
            this.onChangeSelect();
        });
    }
    /**
     * Khi có thay đổi thêm/sửa/xóa
     */
    onChangeSelect() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            //cây tổ chức
            this.organizationsTree = [];
            try {
                //lấy danh sách nhân sự
                this.staffs = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-staffs");
                // console.log(this.staffs);
                if (Array.isArray(this.staffs)) {
                    let orgTree = [];
                    // Lọc danh sách nhân sự theo mã tổ chức của user
                    this.organizations.forEach(el => {
                        if (el.id === this.organizationId) {
                            orgTree.push(el);
                        }
                        if (el.parent_id === this.organizationId) {
                            orgTree.push(el);
                        }
                    });
                    orgTree.forEach(el => {
                        el.click_type = 1; //cây chính cho click luôn
                        el.main_tree = 1; //là cây chính
                        // ghép nhân sự vào gốc cây
                        // chỉ ghép những nhân sự của các chức danh
                        if (this.staffs && el.id !== this.organizationId) {
                            // ghép nhân sự vào theo id tổ chức
                            el.subs = this.staffs.filter(x => x.organization_id === el.id);
                        }
                    });
                    // console.log(orgTree);
                    //tạo cây tổ chức để hiển thị lên form
                    this.organizationsTree = this.apiCommon.createTreeMenu(orgTree, 'id', 'parent_id');
                    // console.log(this.organizationsTree);
                    //ghép thêm nhân sự Giám đốc, Phó Giám đốc vào gốc cây
                    this.organizationsTree.forEach(el => {
                        //lọc các nhân sự giám đốc, phó giám đốc của tổ chức
                        if (this.staffs && el.id + '' === '' + this.organizationId) {
                            let rootSubs = this.staffs.filter(x => x.organization_id === el.id);
                            //trường hợp refresh thì không cần thêm vào
                            if (!el.subs)
                                el.subs = rootSubs;
                            //duyệt rootSubs nếu tìm thấy một đối tượng trong el.subs thì thôi thoát ra 
                            //nếu không tìm thấy thì push vào
                            rootSubs.forEach(elsub => {
                                let index = el.subs.findIndex(x => x.id === elsub.id && x.organization_id === elsub.organization_id);
                                if (index >= 0) {
                                    //không cần thêm vào nếu là lá cây
                                    //trường hợp nó có subs thì phải thay thế nó
                                    //if (elsub.subs) 
                                    el.subs.splice(index, 1, elsub); //thay thế lại
                                }
                                else {
                                    el.subs.unshift(elsub); //bổ sung vào đầu
                                }
                            });
                        }
                    });
                }
            }
            catch (e) {
                console.log('Err:', e);
            }
        });
    }
    /**
     * Click vào nội dung cấp Công ty/Trung tâm
     * @param ev
     * @param card
     */
    onClickSpec(ev, card) {
        //console.log(card);
        let menu = [
            {
                icon: {
                    name: "md-add",
                    color: "secondary",
                },
                name: "Thêm nhân sự GĐ",
                value: "add-child"
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
    /**
     * Click vào đơn vị cấp con
     * @param event
     */
    onClickTreeItem(event) {
        //Khai báo menu popup
        let menu;
        //cây nhân sự thuần
        if (!event.item.main_tree) {
            menu = [
                {
                    icon: {
                        name: "md-create",
                        color: "primary",
                    },
                    name: "Chỉnh sửa nhân sự",
                    value: "edit-owner"
                },
                {
                    icon: {
                        name: "trash",
                        color: "danger",
                    },
                    name: event.item.status === 1 ? "Khóa bỏ nhân sự" : "Kích hoạt nhân sự",
                    value: "stop-owner"
                }
            ];
        }
        else {
            menu = [
                {
                    icon: {
                        name: "md-add",
                        color: "secondary",
                    },
                    name: "Thêm nhân sự",
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
            let itemNew = {
                id: -1,
                organization_id: item.id,
                table_name: 'staffs',
                wheres: [],
                title_name: item.name //tên của cấp cha
            };
            this.addNewItem(itemNew, 'add');
        }
        //sửa tham số
        if (cmd.value === 'edit-owner') {
            item.table_name = 'staffs'; //tên bảng cần đưa vào
            item.wheres = ['id']; //Mệnh đề wheres để update = '';
            item.title_name = item.organization_name;
            this.addNewItem(item, 'edit');
        }
        //thêm kpi từ Chỉ tiêu
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
    addNewItem(item, type) {
        // console.log('item', item);
        let orgOptions = [];
        //lấy tùy chọn đơn vị
        if (Array.isArray(this.organizations)) {
            this.organizations.forEach(el => {
                orgOptions.push({ name: el.name, value: parseInt(el.id) });
            });
        }
        //tùy chọn chức danh
        let jobOptions = [];
        //tùy chọn chức danh kiêm nhiệm (bỏ chức danh chính đi)
        let jobListOptions = [];
        if (Array.isArray(this.jobRoles)) {
            this.jobRoles.forEach(el => {
                //chỉ lọc các chức danh trong tổ chức đó thôi
                if (el.organization_id === item.organization_id) {
                    //lấy tùy chọn chức danh
                    jobOptions.push({ name: el.name, value: parseInt(el.id) });
                    //lấy danh sách tùy chọn chức danh kiêm nhiệm - bỏ chức danh đang đảm nhiệm
                    if (el.id !== item.job_id) {
                        jobListOptions.push({ name: el.name, value: parseInt(el.id) });
                    }
                }
            });
        }
        let form = {
            title: (type === 'add' ? 'THÊM' : 'SỬA') + " DANH MỤC",
            home_disable: true,
            buttons: [
                { color: "danger", icon: "close", next: "CLOSE" }
            ],
            items: [
                { type: "title", name: item.title_name },
                { type: "hidden", key: "id", value: item.id },
                { type: "hidden", key: "organization_id", value: item.organization_id },
                { type: "hidden", key: "table_name", value: item.table_name },
                { type: "hidden", key: "wheres", value: item.wheres }
                //hiển thị các thông tin của nhân sự
                ,
                { type: "text", key: "name", value: item.name, name: "Họ và tên", input_type: "text", icon: "contact", validators: [{ required: true, min: 3, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" },
                { type: "select-origin", key: "organization_id", name: "Thuộc đơn vị", value: "" + item.organization_id, options: orgOptions, icon: "logo-windows", validators: [{ required: true }], hint: "Chọn một đơn vị trực thuộc" },
                { type: "select-origin", key: "job_id", name: "Chức danh", value: "" + item.job_id, options: jobOptions, icon: "logo-wordpress", validators: [{ required: true }], hint: "Chọn một chức danh" },
                { type: "select-multiple-origin", key: "job_list", name: "Chức danh kiêm nhiệm", value: [], options: jobListOptions, icon: "logo-buffer", hint: "Chọn các công việc kiêm nhiệm của cá nhân đó" },
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
            callback: this.callbackKpi
        });
    }
    /**
     * Dừng đối tượng này
     * @param item
     */
    stopItem(item) {
        let form = {
            title: "Thay đổi trạng thái",
            home_disable: true,
            buttons: [
                { color: "danger", icon: "close", next: "CLOSE" }
            ],
            items: [
                { type: "title", name: item.name },
                { type: "hidden", key: "id", value: item.id } //đối tượng để update
                ,
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
            callback: this.callbackKpi
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
                workbook.eachSheet(sheet => {
                    if (sheet.name != config.sheet_name.value)
                        sheet.state = 'hidden'; //ẩn các sheet không mong muốn
                });
                let worksheet = workbook.getWorksheet(config.sheet_name.value);
                let row = worksheet.getRow(2);
                row.getCell("A").value = this.organizationsTree[0].name;
                row.getCell("G").value = this.organizationsTree[0].id;
                // xác định bề rộng cho các cột
                worksheet.getColumn(1).width = 5;
                worksheet.getColumn(2).width = 25;
                worksheet.getColumn(4).width = 25;
                worksheet.getColumn(6).width = 30;
                worksheet.getColumn(8).width = 20;
                worksheet.getColumn(9).width = 20;
                // tự động xuống hàng nếu text quá dài
                worksheet.getColumn(2).alignment = { wrapText: true };
                worksheet.getColumn(4).alignment = { wrapText: true };
                worksheet.getColumn(6).alignment = { wrapText: true };
                worksheet.getColumn(8).alignment = { wrapText: true };
                worksheet.getColumn(9).alignment = { wrapText: true };
                let idx = 4;
                // Lặp mảng để ghi dữ liệu vào excel
                this.staffs.forEach(el => {
                    row = worksheet.getRow(idx);
                    row.getCell(config.noId.value).value = idx - 3;
                    row.getCell(config.name.value).value = el.name;
                    row.getCell(config.organization_id.value).value = el.organization_id;
                    row.getCell(config.organization_name.value).value = el.organization_name;
                    row.getCell(config.job_id.value).value = el.job_id;
                    row.getCell(config.job_name.value).value = el.job_name;
                    row.getCell(config.id.value).value = el.id;
                    row.getCell(config.job_list.value).value = el.job_list;
                    idx++;
                });
                workbook.views = [
                    {
                        x: 0, y: 0, width: 10000, height: 20000,
                        firstSheet: 2, activeTab: 2, visibility: 'visible'
                    }
                ];
                //Ghi file excel
                workbook.xlsx.writeBuffer().then((data) => {
                    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    file_saver__WEBPACK_IMPORTED_MODULE_4__["saveAs"](blob, `excel-staffs-${Date.now()}.xlsx`);
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
                        id: el.id,
                        organization_id: el.organization_id,
                        name: el.name,
                        job_id: el.job_id,
                        job_list: el.job_list,
                    };
                    // console.log(jsonPost);
                    try {
                        yield this.apiAuth.postDynamicJson(this.apiAuth.serviceUrls.RESOURCE_SERVER
                            + '/post-staffs', jsonPost);
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
StaffsPage.ctorParameters = () => [
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] },
    { type: ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"] }
];
StaffsPage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-staffs',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./staffs.page.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/staffs/staffs.page.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./staffs.page.scss */ "./src/app/pages/staffs/staffs.page.scss")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
        ngxi4_dynamic_service__WEBPACK_IMPORTED_MODULE_2__["CommonsService"]])
], StaffsPage);



/***/ })

}]);
//# sourceMappingURL=pages-staffs-staffs-module-es2015.js.map
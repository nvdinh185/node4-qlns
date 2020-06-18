(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-job-roles-job-roles-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/job-roles/job-roles.page.html":
/*!*******************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/job-roles/job-roles.page.html ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header>\n  <ion-toolbar color=\"primary\">\n\n    <ion-buttons slot=\"start\">\n      <ion-menu-button></ion-menu-button>\n      <ion-back-button></ion-back-button>\n    </ion-buttons>\n\n    <ion-title>CÂY CHỨC DANH</ion-title>\n\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class=\"ion-no-padding\">\n  <ion-row>\n    <ion-col class=\"ion-text-center\" size=\"12\" class=\"card-prospect\" *ngFor=\"let item of organizationsTree\"\n      [style.background]=\"(item.background?item.background:'#fafafaf6')\">\n\n      <!-- Chỉnh sửa thông tin của tổ chức độc lập Cấp id=root_id -->\n      <ion-row (click)=\"onClickSpec($event, item)\">\n        <ion-col size=\"10\" class=\"prospect-header\" [style.color]=\"(item.color?item.color:'darkblue')\">\n          <ion-icon item-start *ngIf=\"item.click_type\" style=\"font-size: 1em\" [style.color]=\"'lightblue'\"\n            name=\"md-cloud-upload\"></ion-icon>{{item.name}}\n        </ion-col>\n        <ion-col size=\"2\" class=\"prospect-header\" [style.color]=\"(item.color?item.color:'darkblue')\">\n          {{item.status}}\n        </ion-col>\n      </ion-row>\n\n      <!-- Bộ cây tổ chức của tổ chức độc lập cấp phòng ban, cấp tổ/đội, vùng -->\n      <tree-list [treeData]=\"item.subs\" (onClickKpi)=\"onClickTreeItem($event)\"></tree-list>\n\n    </ion-col>\n\n  </ion-row>\n</ion-content>");

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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _job_roles_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./job-roles-routing.module */ "./src/app/pages/job-roles/job-roles-routing.module.ts");
/* harmony import */ var _job_roles_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./job-roles.page */ "./src/app/pages/job-roles/job-roles.page.ts");
/* harmony import */ var src_app_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/shared.module */ "./src/app/shared.module.ts");








let JobRolesPageModule = class JobRolesPageModule {
};
JobRolesPageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
            src_app_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
            _job_roles_routing_module__WEBPACK_IMPORTED_MODULE_5__["JobRolesPageRoutingModule"]
        ],
        declarations: [_job_roles_page__WEBPACK_IMPORTED_MODULE_6__["JobRolesPage"]]
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
/* harmony default export */ __webpack_exports__["default"] = (".card-title-header {\n  font-size: 1.5em;\n  width: 90%;\n  font-weight: bold;\n  color: darkblue;\n  text-transform: uppercase;\n  opacity: 0.7;\n}\n\n.card-prospect {\n  border-radius: 0.8em;\n  border: solid 0.15em #FFFFFF;\n  width: 100%;\n}\n\n.card-prospect .prospect-header {\n  font-size: 1.2em;\n  width: 100%;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.9;\n}\n\n.table-row .table-header {\n  background: #99b7f0e0 !important;\n  color: #0a0909fb !important;\n  font-weight: bold;\n}\n\n.table-row ion-col {\n  border: solid 0.1em #FFFFFF;\n  font-size: 1.3em;\n}\n\n.table-row ion-row:nth-of-type(odd) {\n  background: #fafafaf6;\n  color: #202020;\n  opacity: 0.9;\n}\n\n.table-row ion-row:nth-of-type(even) {\n  background: #e6f5f8;\n  color: #202020;\n  opacity: 0.7;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvam9iLXJvbGVzL0Q6XFxESU5ITlZcXE15RGF0YVxcTEFQVFJJTkhcXE5PREU0XFxpb25pYzQucWxuc1xcY2xpZW50L3NyY1xcYXBwXFxwYWdlc1xcam9iLXJvbGVzXFxqb2Itcm9sZXMucGFnZS5zY3NzIiwic3JjL2FwcC9wYWdlcy9qb2Itcm9sZXMvam9iLXJvbGVzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNJLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO0VBQ0EsWUFBQTtBQ0FKOztBRElBO0VBQ0ksb0JBQUE7RUFDQSw0QkFBQTtFQUNBLFdBQUE7QUNESjs7QURLQTtFQUNJLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FDRko7O0FETUE7RUFDSSxnQ0FBQTtFQUNBLDJCQUFBO0VBQ0EsaUJBQUE7QUNISjs7QURNQTtFQUNJLDJCQUFBO0VBQ0EsZ0JBQUE7QUNISjs7QURNQTtFQUNJLHFCQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISjs7QURNQTtFQUNJLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNISiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2pvYi1yb2xlcy9qb2Itcm9sZXMucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy90aGnhur90IGzhuq1wIGNo4buvIGNobyB0acOqdSDEkeG7gSBjw7RuZyB0eVxyXG4uY2FyZC10aXRsZS1oZWFkZXIge1xyXG4gICAgZm9udC1zaXplOiAxLjVlbTtcclxuICAgIHdpZHRoOiA5MCU7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiBkYXJrYmx1ZTtcclxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn1cclxuXHJcbi8vVGhp4bq/dCBs4bqtcCBraHVuZyBu4buBbiB2w6AgY+G7oSBjaOG7ryBjaG8gY2FyZCB2aeG7hW4gY+G6o25oXHJcbi5jYXJkLXByb3NwZWN0e1xyXG4gICAgYm9yZGVyLXJhZGl1czogMC44ZW07XHJcbiAgICBib3JkZXI6IHNvbGlkIDAuMTVlbSAjRkZGRkZGO1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICAgIC8vb3BhY2l0eTogMC44O1xyXG59XHJcblxyXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcclxuICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIG9wYWNpdHk6IDAuOTtcclxufVxyXG5cclxuLy9UaGnhur90IGzhuq1wIGTDsm5nIGNo4bq1biBs4bq7IGNobyBi4bqjbmdcclxuLnRhYmxlLXJvdyAudGFibGUtaGVhZGVyIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xyXG4gICAgY29sb3I6IzBhMDkwOWZiICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxufVxyXG5cclxuLnRhYmxlLXJvdyBpb24tY29sIHsgLy904bqldCBj4bqjIGPDoWMgY+G7mXQgc2F1IGNsYXNzIG7DoHlcclxuICAgIGJvcmRlcjogc29saWQgMC4xZW0gI0ZGRkZGRjtcclxuICAgIGZvbnQtc2l6ZTogMS4zZW07XHJcbn1cclxuXHJcbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHsgLy9kw7JuZyBs4bq7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmFmYWZhZjY7XHJcbiAgICBjb2xvcjojMjAyMDIwO1xyXG4gICAgb3BhY2l0eTogMC45O1xyXG59XHJcblxyXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikgeyAvL2TDsm5nIGNo4bq1blxyXG4gICAgYmFja2dyb3VuZDogI2U2ZjVmODtcclxuICAgIGNvbG9yOiMyMDIwMjA7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbn0iLCIuY2FyZC10aXRsZS1oZWFkZXIge1xuICBmb250LXNpemU6IDEuNWVtO1xuICB3aWR0aDogOTAlO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IGRhcmtibHVlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjc7XG59XG5cbi5jYXJkLXByb3NwZWN0IHtcbiAgYm9yZGVyLXJhZGl1czogMC44ZW07XG4gIGJvcmRlcjogc29saWQgMC4xNWVtICNGRkZGRkY7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uY2FyZC1wcm9zcGVjdCAucHJvc3BlY3QtaGVhZGVyIHtcbiAgZm9udC1zaXplOiAxLjJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBvcGFjaXR5OiAwLjk7XG59XG5cbi50YWJsZS1yb3cgLnRhYmxlLWhlYWRlciB7XG4gIGJhY2tncm91bmQ6ICM5OWI3ZjBlMCAhaW1wb3J0YW50O1xuICBjb2xvcjogIzBhMDkwOWZiICFpbXBvcnRhbnQ7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4udGFibGUtcm93IGlvbi1jb2wge1xuICBib3JkZXI6IHNvbGlkIDAuMWVtICNGRkZGRkY7XG4gIGZvbnQtc2l6ZTogMS4zZW07XG59XG5cbi50YWJsZS1yb3cgaW9uLXJvdzpudGgtb2YtdHlwZShvZGQpIHtcbiAgYmFja2dyb3VuZDogI2ZhZmFmYWY2O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC45O1xufVxuXG4udGFibGUtcm93IGlvbi1yb3c6bnRoLW9mLXR5cGUoZXZlbikge1xuICBiYWNrZ3JvdW5kOiAjZTZmNWY4O1xuICBjb2xvcjogIzIwMjAyMDtcbiAgb3BhY2l0eTogMC43O1xufSJdfQ== */");

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



let JobRolesPage = class JobRolesPage {
    constructor(apiAuth, apiCommon) {
        this.apiAuth = apiAuth;
        this.apiCommon = apiCommon;
        this.orgOptions = []; //cây tùy chọn để lựa chọn cấp công ty
        /**
         * Hàm xử lý kết quả post sửa thêm
         */
        this.callbackKpi = function (res) {
            //console.log(res);
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
                    this.onChangeSelect();
                }
                resolve({ next: "CLOSE" });
            });
        }.bind(this);
    }
    ngOnInit() {
        this.refreshNews();
    }
    refreshNews() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            try {
                //Lấy danh sách đơn vị trong toàn bộ cây danh sách, 
                this.organizations = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-organizations", true);
                //Lấy đơn vị + danh sách staff mà user đảm nhiệm + chu kỳ báo cáo (nếu có)
                this.userReport = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-user-report", true);
                //gán mã công ty vào để kiểm soát sau này
                this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0;
            }
            catch (e) { }
            //thay đổi chọn lựa
            if (Array.isArray(this.organizations)) {
                //xóa liên hệ cấp gốc
                this.organizations.forEach(el => {
                    if (el.id === el.root_id)
                        el.parent_id = undefined;
                });
                //lọc lấy tách cây id=root_id -- 
                this.orgOptions = this.organizations.filter(x => x.id === x.root_id && x.status === 1);
                //chuyển thành cây sắp xếp để xác định lá cây, gốc cây
                this.organizations = this.apiCommon.createTreeOrder(this.organizations, 'id', 'parent_id');
                //chuyển thành cây cấu trúc để ghép vào
                //this.organizations = this.apiAuth.createTreeMenu(this.organizations,'id','parent_id');
                this.onChangeSelect();
            }
        });
    }
    /**
     * Khi có thay đổi chọn đơn vị cấp Cty
     */
    onChangeSelect() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            //reset cây vai trò
            this.organizationsTree = [];
            this.jobRolesTree = [];
            //lấy đơn vị được chọn tức là lấy gốc cây sau này
            this.orgSelected = this.orgOptions.find(x => '' + x.id === '' + this.organizationId);
            try {
                //lấy cây vai trò của đơn vị cấp cty/trung tâm
                this.jobRoles = yield this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
                    + "/get-job-roles?organization_id=" + (this.organizationId || 0), true);
                // console.log(this.jobRoles);
                if (Array.isArray(this.jobRoles)) {
                    //mở lá cây khi có tác động ở gốc cây hoặc lá cây
                    this.jobRoles.forEach(el => {
                        el.click_type = 2; //cho phép tự mở cây, mở menu 
                        //mở lá cây được tác động
                        if (this.itemOpen && (this.itemOpen.organization_id === el.organization_id)) {
                            el.visible = true;
                        }
                    });
                    //console.log(this.jobRoles,this.jobRolesTree);
                    //tạo luôn cây vai trò (Giám đốc-->PGĐ--> Trưởng phòng --> Phó phòng -->Tổ trưởng--> Chuyên viên...)
                    this.jobRolesTree = this.apiCommon.createTreeMenu(this.jobRoles, 'id', 'parent_id');
                }
                //this.jobRolesTree = this.jobRolesTree?this.jobRolesTree:[];
                //console.log(this.jobRoles,this.jobRolesTree);
                //Lọc lấy cây của đơn vị được chọn từ gốc
                //chỉ lấy các đơn vị trạng thái đang hoạt động thôi
                let orgTree = this.organizations.filter(x => '' + x.$root === '' + this.organizationId);
                //console.log('cay goc',this.organizationId, orgTree);
                orgTree.forEach(el => {
                    el.click_type = 1; //cây chính cho click luôn
                    //ghép con vào các nhánh cây (bỏ qua gốc cây)
                    if (this.jobRolesTree && el.id + '' !== '' + this.organizationId) {
                        el.subs = this.jobRolesTree.filter(x => x.organization_id === el.id); //mảng con được ghép vào
                    }
                    //định nghĩa một tham số riêng để nhận biết cây đơn vị và cây vai trò
                    el.main_tree = 1; //cây chính
                    //mở cây hiển thị vùng tác động
                    if (this.itemOpen && (this.itemOpen.organization_id === el.id)) {
                        el.visible = true;
                    }
                });
                //tạo cây để hiển thị lên form
                this.organizationsTree = this.apiCommon.createTreeMenu(orgTree, 'id', 'parent_id');
                //console.log(orgTree, this.organizationsTree, this.jobRolesTree);
                //ghép thêm chức danh Giám đốc, Phó Giám đốc vào gốc cây
                this.organizationsTree.forEach(el => {
                    if (this.jobRolesTree && el.id + '' === '' + this.organizationId) {
                        //lọc các chức danh giám đốc, phó giám đốc của tổ chức
                        let rootSubs = this.jobRolesTree.filter(x => x.organization_id === el.id);
                        //trường hợp refresh thì không cần thêm vào
                        if (!el.subs)
                            el.subs = rootSubs;
                        //duyệt rootSubs nếu tìm thấy một đối tượng trong el.subs thì thôi thoát ra 
                        //nếu không tìm thấy thì push vào
                        rootSubs.forEach(elsub => {
                            let index = el.subs.findIndex(x => x.id === elsub.id && x.organization_id == elsub.organization_id);
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
    onClickSpec(ev, card) {
        //console.log(card);
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
            this.processKpiDetails(data, card);
        })
            .catch(err => {
            console.log('err: ', err);
        });
    }
    /**
     * Click vào cell Chỉ tiêu hoặc Cell Kpi
     * depth = 2,3
     * @param event
     */
    onClickTreeItem(event) {
        //Khi cây con có click_type>0 thì ta tự mở node ra để xem
        if (event.item.click_type > 0) {
            event.item.visible = true;
        }
        //Khai báo menu popup
        let menu;
        //cây chức danh thuần
        // console.log(event.item.main_tree);
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
                        name: "md-add",
                        color: "secondary",
                    },
                    name: "Thêm chức danh con",
                    value: "add-child"
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
        }
        else if (event.item.$is_leaf === 1) {
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
                parent_id: item.main_tree === 1 ? undefined : item.id,
                organization_id: item.organization_id ? item.organization_id : item.id,
                //kế thừa cấp cha của nó nếu có tổ chức thì lấy luôn tổ chức, nếu không có tổ chức thì lấy id cấp cha
                table_name: 'job_roles',
                wheres: [],
                title_name: item.name //tên của cấp cha
            };
            // console.log(cmd);
            // console.log(item);
            this.addNewItem(itemNew, 'add');
        }
        //sửa tham số
        if (cmd.value === 'edit-owner') {
            this.itemOpen = item;
            item.table_name = 'job_roles'; //tên bảng cần đưa vào
            item.wheres = ['id']; //Mệnh đề wheres để update = '';
            item.title_name = 'Chức danh';
            this.addNewItem(item, 'edit');
        }
        //thêm kpi từ Chỉ tiêu
        if (cmd.value === 'stop-owner') {
            this.itemOpen = item;
            item.table_name = 'job_roles'; //tên bảng cần đưa vào
            item.wheres = ['id']; //Mệnh đề wheres để update = '';
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
                { type: "hidden", key: "organization_id", value: item.organization_id },
                { type: "hidden", key: "table_name", value: item.table_name },
                { type: "hidden", key: "wheres", value: item.wheres }
                //hiển thị nội dung nhập vào cho Chỉ tiêu chỉ là tên và trọng số
                //new Date().toISOString().slice(0, 10)
                ,
                { type: "text", key: "short_name", value: item.short_name, name: "Nhóm chức danh", input_type: "text", icon: "ios-people", validators: [{ required: true, min: 2, max: 20 }], hint: "Mã nhóm viết tắt vd: TT-VT để nhóm cùng loại khác đơn vị" },
                { type: "text", key: "name", value: item.name, name: "Tên chức danh", input_type: "text", icon: "ios-contact-outline", validators: [{ required: true, min: 3, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" }
                //, { type: "datetime", key: "start_date", value: item.start_date, name: "Chọn ngày hoạt động", hint: "Lựa chọn ngày", display: "DD/MM/YYYY", picker: "DD/MM/YYYY", validators: [{ required: true }] }
                ,
                { type: "text_area", key: "description", value: item.description, name: "Mô tả công việc của chức danh này", input_type: "text", icon: "md-alert", hint: "Nhập mô tả chức danh này để ghi nhớ, công việc làm gì" },
                {
                    type: "button",
                    options: [
                        { name: "Reset", next: "RESET" },
                        {
                            name: type === 'add' ? 'Tạo mới' : 'Chỉnh sửa', next: "CALLBACK",
                            url: this.apiAuth.serviceUrls.RESOURCE_SERVER
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
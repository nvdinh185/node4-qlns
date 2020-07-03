import { Component, OnInit } from '@angular/core';
import { AuthService, CommonsService, PopoverCardComponent, DynamicFormMobilePage } from 'ngxi4-dynamic-service';

@Component({
  selector: 'app-job-roles',
  templateUrl: './job-roles.page.html',
  styleUrls: ['./job-roles.page.scss'],
})
export class JobRolesPage implements OnInit {

  organizationId: any; //mã tổ chức của user

  userReport: any;

  organizations: any; //danh sách tổ chức lấy từ csdl
  organizationsTree: any; //cây tổ chức hiển thị

  jobRoles: any; //danh sách chức danh lấy từ csdl
  jobRolesTree: any; // cây chức danh

  constructor(
    private apiAuth: AuthService
    , private apiCommon: CommonsService
  ) { }

  ngOnInit() {
    this.refreshNews();
  }

  async refreshNews() {

    try {
      this.organizations = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-organizations", true);
      // console.log(this.organizations);

      this.userReport = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-user-report", true);
      // console.log(this.userReport);

      this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0;

    } catch (e) { }

    this.onChangeSelect();
  }

  /**
   * Khi có thay đổi thêm mới/cập nhật/xóa
   */
  async onChangeSelect() {

    this.organizationsTree = [];
    this.jobRolesTree = [];

    try {
      // lấy danh sách chức danh trong csdl
      this.jobRoles = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-job-roles");
        // console.log(this.jobRoles);

      // Chuyển thành cây chức danh
      if (Array.isArray(this.jobRoles)) {
        this.jobRolesTree = this.apiCommon.createTreeMenu(this.jobRoles, 'id', 'parent_id');
        // console.log(this.jobRolesTree);
      }

      // thêm thuộc tính click_type và main_tree cho cây chính
      // ghép cây chức danh vào cây chính
      this.organizations.forEach(el => {
        el.click_type = 1; //cây chính cho click luôn
        el.main_tree = 1; //là cây chính

        // Ghép nhánh chức danh vào cây chính
        if (this.jobRolesTree && el.id + '' !== '' + this.organizationId) {
          el.subs = this.jobRolesTree.filter(x => x.organization_id === el.id); //mảng chức danh được ghép vào
        }

      });
      // console.log(this.organizations);

      // chuyển thành cây tổ chức và chức danh
      this.organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id');

      // console.log(this.organizationsTree);

      // ghép chức danh giám đốc vào
      this.organizationsTree.forEach(el => {
        if (this.jobRolesTree && el.id + '' === '' + this.organizationId) {
          let rootSubs = this.jobRolesTree.filter(x => x.organization_id === el.id);
          if (!el.subs) el.subs = rootSubs;

          rootSubs.forEach(elsub => {
            let index = el.subs.findIndex(x => x.id === elsub.id && x.organization_id == elsub.organization_id);
            if (index >= 0) {
              el.subs.splice(index, 1, elsub);
            } else {
              el.subs.unshift(elsub);
            }
          })
        }
      })

    } catch (e) {
      console.log('Error:', e)
    }

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
    this.apiCommon.presentPopover(
      ev, PopoverCardComponent
      , {
        type: 'single-choice',
        title: "Chọn chức năng",
        color: "primary",
        menu: menu
      })
      .then(data => {
        // console.log(data);
        this.processKpiDetails(data, card)
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
        }
        ,
        {
          icon: {
            name: "md-add",
            color: "secondary",
          },
          name: "Thêm chức danh con",
          value: "add-child"
        }
        ,
        {
          icon: {
            name: "trash",
            color: "danger",
          },
          name: event.item.status === 1 ? "Khóa bỏ chức danh" : "Kích hoạt chức danh",
          value: "stop-owner"
        }
      ];
    } else {
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
    this.apiCommon.presentPopover(
      event.event, PopoverCardComponent
      , {
        type: 'single-choice',
        title: "Chọn chức năng",
        color: "primary",
        menu: menu
      })
      .then(data => {
        // console.log(data);
        this.processKpiDetails(data, event.item)
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
        id: -1, //Giả id để thêm vào
        parent_id: item.main_tree === 1 ? undefined : item.id, //kế thừa cấp cha của nó
        organization_id: item.organization_id ? item.organization_id : item.id,
        table_name: 'job_roles', //tên bảng cần đưa vào
        wheres: [], //Mệnh đề wheres để update
        title_name: item.name //tên của cấp cha
      }

      this.addNewItem(itemNew, 'add');
    }

    //sửa tham số
    if (cmd.value === 'edit-owner') {

      item.table_name = 'job_roles'; //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';
      item.title_name = item.name;

      this.addNewItem(item, 'edit');
    }

    //tạm dừng tham số
    if (cmd.value === 'stop-owner') {

      item.table_name = 'job_roles'; //tên bảng cần đưa vào
      item.wheres = ['id'];         //Mệnh đề wheres để update = '';

      this.stopItem(item);
    }

  }

  /**
   * Dừng đối tượng này
   * @param item 
   */
  stopItem(item) {
    let form = {
      title: "Thay đổi trạng thái"
      , buttons: [
        { color: "danger", icon: "close", next: "CLOSE" }
      ]
      , items: [
        { type: "title", name: item.name }
        , { type: "hidden", key: "id", value: item.id } //đối tượng để update
        , { type: "hidden", key: "table_name", value: item.table_name }
        , { type: "hidden", key: "wheres", value: item.wheres }
        , { type: "datetime", key: "changed_date", value: item.changed_date, name: "Chọn ngày thay đổi trạng thái", display: "DD/MM/YYYY", picker: "DD/MM/YYYY" }
        , { type: "toggle", key: "status", name: item.status ? "Tạm ngưng?" : "Kích hoạt?", value: item.status, color: "secondary", icon: "hand" }
        , {
          type: "button"
          , options: [
            {
              name: 'Cập nhập', next: "CALLBACK", url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                + "/post-parameters"
            }
          ]
        }
      ]
    }

    this.apiCommon.openModal(DynamicFormMobilePage, {
      parent: this,
      form: form,
      callback: this.callbackKpi
    })
  }

  /**
   * Thêm hoặc sửa chức danh
   * @param item 
   */
  addNewItem(item, type) {

    let form = {
      title: (type === 'add' ? 'THÊM' : 'SỬA') + " DANH MỤC"
      , buttons: [
        { color: "danger", icon: "close", next: "CLOSE" }
      ]
      , items: [
        { type: "title", name: item.title_name }
        , { type: "hidden", key: "id", value: item.id }
        , { type: "hidden", key: "parent_id", value: item.parent_id }
        , { type: "hidden", key: "organization_id", value: item.organization_id }
        , { type: "hidden", key: "table_name", value: item.table_name }
        , { type: "hidden", key: "wheres", value: item.wheres }

        , { type: "text", key: "short_name", value: item.short_name, name: "Nhóm chức danh", input_type: "text", icon: "ios-people", validators: [{ required: true, min: 2, max: 20 }], hint: "Mã nhóm viết tắt vd: TT-VT để nhóm cùng loại khác đơn vị" }
        , { type: "text", key: "name", value: item.name, name: "Tên chức danh", input_type: "text", icon: "calendar", validators: [{ required: true, min: 5, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" }
        , { type: "text_area", key: "description", value: item.description, name: "Mô tả công việc của chức danh này", input_type: "text", icon: "md-alert", hint: "Nhập mô tả chức danh này để ghi nhớ, công việc làm gì" }
        , {
          type: "button"
          , options: [
            { name: "Reset", next: "RESET" }
            , {
              name: type === 'add' ? 'Tạo mới' : 'Chỉnh sửa', next: "CALLBACK"
              , url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                + "/post-parameters"
            }
          ]
        }
      ]
    };

    this.apiCommon.openModal(DynamicFormMobilePage, {
      parent: this,
      form: form,
      callback: this.callbackKpi
    })

  }

  /**
   * Hàm xử lý kết quả post sửa thêm xóa
   */
  callbackKpi = function (res) {

    //console.log(res);

    return new Promise((resolve, reject) => {

      if (res.error) {
        this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
      } else if (res.ajax) {
        //Khi thay đổi cần gọi ajax thì nó gọi cái này
        //ta không cần refresh trang
      } else {
        //lấy lại kết quả đã tính toán
        this.onChangeSelect();
      }
      resolve({ next: "CLOSE" })
    })
  }.bind(this)

}

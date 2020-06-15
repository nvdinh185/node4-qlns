import { Component } from '@angular/core';
import { AuthService, CommonsService, PopoverCardComponent, DynamicFormMobilePage } from 'ngxi4-dynamic-service';

@Component({
  selector: 'app-organizations',
  templateUrl: 'organizations.page.html',
  styleUrls: ['organizations.page.scss'],
})
export class OrganizationsPage {

  userReport: any;

  organizations: any;
  organizationsTree: any;

  itemOpen: any;

  constructor(
    private apiAuth: AuthService
    , private apiCommon: CommonsService
  ) { }

  ngOnInit() {
    this.refreshNews();
  }

  async refreshNews() {

    try {

      //Lấy chu kỳ báo cáo + đơn vị + danh sách department
      this.userReport = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-user-report", true);


      //Lấy danh sách đơn vị trong toàn bộ cây danh sách, 
      //lọc lấy tách cây id=root_id và chỉ sử dụng nhánh cây mà user đang sở hữu thôi, không hiển thị các nhánh cây khác
      this.organizations = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-organizations", true);
      console.log(this.organizations);
      if (Array.isArray(this.organizations)) {
        //lọc lấy cây id = root_id để làm gốc cây
        //thiết lập parent_id=undefined cho gốc cây
        //đã có cây thì ta reset parent_id
        this.organizations.forEach(el => {
          //xử lý mở nút cây (biểu tượng click)
          el.click_type = 2;
          //xóa các quan hệ cấp trên
          if (el.id === el.root_id) el.parent_id = undefined;
          //mở cây trước đó
          if (this.itemOpen && (this.itemOpen.parent_id === el.id || this.itemOpen.id === el.id)) {
            el.visible = true;
          }
        });

        // tạo cấu trúc hình cây để khai báo, chỉnh sửa cây tổ chức
        let organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id');

        if (this.userReport && Array.isArray(organizationsTree)) {
          this.organizationsTree = organizationsTree.filter(x => x.id === this.userReport.organization_id);
        } else {
          this.organizationsTree = organizationsTree;
        }
        console.log(this.organizationsTree);

      }

    } catch (e) { }

  }

  /**
   * Click vào nội dung cấp Công ty/Trung tâm
   * @param ev 
   * @param card 
   */
  onClickSpec(ev, card) {
    // console.log(card);
    let menu =
      [
        {
          id: 1,
          name: "Thêm đơn vị phụ thuộc",
          value: "add-child",
          icon: {
            name: "md-add",
            color: "secondary",
          }
        }
        ,
        {
          id: 2,
          name: "Chỉnh sửa thông tin",
          value: "edit-owner",
          icon: {
            name: "md-create",
            color: "primary",
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
      }
      ,
      {
        name: "Thêm đơn vị cấp con",
        value: "add-child",
        icon: {
          name: "md-add",
          color: "secondary",
        }
      }
      ,
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
      this.itemOpen = item;
      //item là một nhánh cây đang xét
      let itemNew = {
        id: -1, //Giả id để thêm vào
        parent_id: item.id, //kế thừa cấp cha của nó
        table_name: 'organizations', //tên bảng cần đưa vào
        wheres: [], //Mệnh đề wheres để update
        title_name: item.name //tên của cấp cha
      }

      // console.log(cmd);
      // console.log(item);
      this.addNewItem(itemNew, 'add');
    }

    //sửa tham số
    if (cmd.value === 'edit-owner') {
      this.itemOpen = item;

      item.table_name = 'organizations'; //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';
      item.title_name = 'Tổ chức';

      this.addNewItem(item, 'edit');
    }


    //thêm kpi từ Chỉ tiêu
    if (cmd.value === 'stop-owner') {

      this.itemOpen = item;

      item.table_name = 'organizations'; //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';

      this.stopItem(item);
    }

  }

  /**
   * Thêm kpi mới có kpi_role là C và Tr từ cây
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
        , { type: "hidden", key: "table_name", value: item.table_name }
        , { type: "hidden", key: "wheres", value: item.wheres }

        //hiển thị nội dung nhập vào cho Chỉ tiêu chỉ là tên và trọng số
        //new Date().toISOString().slice(0, 10)
        , { type: "text", key: "name", value: item.name, name: "Tên đơn vị", input_type: "text", icon: "logo-buffer", validators: [{ required: true, min: 3, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" }
        , { type: "text", key: "short_name", value: item.short_name, name: "Tên viết tắt", input_type: "text", icon: "logo-buffer", validators: [{ required: true, min: 1, max: 6 }], hint: "Độ dài tối đa 6 ký tự" }
        //, { type: "datetime", key: "start_date", value: item.start_date, name: "Chọn ngày hoạt động", hint: "Lựa chọn ngày", display: "DD/MM/YYYY", picker: "DD/MM/YYYY", validators: [{ required: true }] }
        , { type: "text_area", key: "description", value: item.description, name: "Mô tả thông tin của đơn vị", input_type: "text", icon: "md-alert", hint: "Nhập mô tả này để ghi nhớ" }
        , {
          type: "button"
          , options: [
            { name: "Reset", next: "RESET" }
            , {
              name: type === 'add' ? 'Tạo mới' : 'Chỉnh sửa', next: "CALLBACK"
              , url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                + "/post-parameters", token: true
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
        , { type: "datetime", key: "end_date", value: item.end_date, name: "Chọn ngày kết thúc", display: "DD/MM/YYYY", picker: "DD/MM/YYYY" }
        , { type: "toggle", key: "status", name: item.status ? "Tạm ngưng?" : "Kích hoạt?", value: item.status, color: "secondary", icon: "ios-hand-outline" }
        , {
          type: "button"
          , options: [
            {
              name: 'Cập nhập', next: "CALLBACK", url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                + "/post-parameters", token: true, signed: true
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
   * Hàm xử lý kết quả post sửa thêm
   */
  callbackKpi = (res) => {

    // console.log(res);

    return new Promise((resolve, reject) => {

      if (res.error) {
        this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)))
      } else if (res.ajax) {
        //Khi thay đổi cần gọi ajax thì nó gọi cái này
        //ta không cần refresh trang
      } else {
        //lấy lại kết quả đã tính toán
        this.refreshNews();
      }
      resolve({ next: "CLOSE" })
    })
  }

}

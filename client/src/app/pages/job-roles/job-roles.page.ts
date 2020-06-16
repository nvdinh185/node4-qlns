import { Component, OnInit } from '@angular/core';
import { AuthService, CommonsService, PopoverCardComponent, DynamicFormMobilePage } from 'ngxi4-dynamic-service';

@Component({
  selector: 'app-job-roles',
  templateUrl: './job-roles.page.html',
  styleUrls: ['./job-roles.page.scss'],
})
export class JobRolesPage implements OnInit {

  orgOptions: any = []; //cây tùy chọn để lựa chọn cấp công ty
  organizationId: any;  //cấp công ty được chọn
  orgSelected: any;


  userReport: any;

  organizations: any; //ghi bảng ghi gốc của tổ chức cấp độc lập (lấy id=root_id)
  organizationsTree: any; //ghi cây của các tổ chức độc lập đến subs

  jobRoles: any;        //cây của chức danh của đơn vị (cấp công ty - lấy toàn bộ chức danh của công ty đó)
  jobRolesTree: any;    //cây biến đổi của chức danh theo cấp đơn vị

  itemOpen: any; //đối tượng mở cây để khi tạo lại sẽ tự mở ra

  constructor(
    private apiAuth: AuthService
    , private apiCommon: CommonsService
  ) { }

  ngOnInit() {
    this.refreshNews();
  }

  async refreshNews() {

    try {
      //Lấy danh sách đơn vị trong toàn bộ cây danh sách, 
      this.organizations = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-organizations", true);


      //Lấy đơn vị + danh sách staff mà user đảm nhiệm + chu kỳ báo cáo (nếu có)
      this.userReport = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-user-report", true);

      //gán mã công ty vào để kiểm soát sau này
      this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0;

    } catch (e) { }

    //thay đổi chọn lựa
    if (Array.isArray(this.organizations)) {

      //xóa liên hệ cấp gốc
      this.organizations.forEach(el => {
        if (el.id === el.root_id) el.parent_id = undefined;
      });

      //lọc lấy tách cây id=root_id -- 
      this.orgOptions = this.organizations.filter(x => x.id === x.root_id && x.status === 1);


      //chuyển thành cây sắp xếp để xác định lá cây, gốc cây
      this.organizations = this.apiCommon.createTreeOrder(this.organizations, 'id', 'parent_id');

      //chuyển thành cây cấu trúc để ghép vào
      //this.organizations = this.apiAuth.createTreeMenu(this.organizations,'id','parent_id');

      this.onChangeSelect();

    }


  }

  /**
   * Khi có thay đổi chọn đơn vị cấp Cty
   */
  async onChangeSelect() {

    //reset cây vai trò
    this.organizationsTree = [];
    this.jobRolesTree = [];

    //lấy đơn vị được chọn tức là lấy gốc cây sau này
    this.orgSelected = this.orgOptions.find(x => '' + x.id === '' + this.organizationId);


    try {
      //lấy cây vai trò của đơn vị cấp cty/trung tâm
      this.jobRoles = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
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

        })

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
          if (!el.subs) el.subs = rootSubs;

          //duyệt rootSubs nếu tìm thấy một đối tượng trong el.subs thì thôi thoát ra 
          //nếu không tìm thấy thì push vào
          rootSubs.forEach(elsub => {
            let index = el.subs.findIndex(x => x.id === elsub.id && x.organization_id == elsub.organization_id);
            if (index >= 0) {
              //không cần thêm vào nếu là lá cây
              //trường hợp nó có subs thì phải thay thế nó
              //if (elsub.subs) 
              el.subs.splice(index, 1, elsub); //thay thế lại
            } else {
              el.subs.unshift(elsub); //bổ sung vào đầu
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

    } else if (event.item.$is_leaf === 1) {
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
      this.itemOpen = item;
      //item là một nhánh cây đang xét
      let itemNew = {
        id: -1, //Giả id để thêm vào
        parent_id: item.main_tree === 1 ? undefined : item.id, //kế thừa cấp cha của nó
        organization_id: item.organization_id ? item.organization_id : item.id,
        //kế thừa cấp cha của nó nếu có tổ chức thì lấy luôn tổ chức, nếu không có tổ chức thì lấy id cấp cha
        table_name: 'job_roles', //tên bảng cần đưa vào
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

      item.table_name = 'job_roles'; //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';
      item.title_name = 'Chức danh';

      this.addNewItem(item, 'edit');
    }


    //thêm kpi từ Chỉ tiêu
    if (cmd.value === 'stop-owner') {

      this.itemOpen = item;

      item.table_name = 'job_roles'; //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';

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
        , { type: "hidden", key: "organization_id", value: item.organization_id }
        , { type: "hidden", key: "table_name", value: item.table_name }
        , { type: "hidden", key: "wheres", value: item.wheres }

        //hiển thị nội dung nhập vào cho Chỉ tiêu chỉ là tên và trọng số
        //new Date().toISOString().slice(0, 10)
        , { type: "text", key: "short_name", value: item.short_name, name: "Nhóm chức danh", input_type: "text", icon: "ios-people", validators: [{ required: true, min: 2, max: 20 }], hint: "Mã nhóm viết tắt vd: TT-VT để nhóm cùng loại khác đơn vị" }
        , { type: "text", key: "name", value: item.name, name: "Tên chức danh", input_type: "text", icon: "ios-contact-outline", validators: [{ required: true, min: 3, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" }
        //, { type: "datetime", key: "start_date", value: item.start_date, name: "Chọn ngày hoạt động", hint: "Lựa chọn ngày", display: "DD/MM/YYYY", picker: "DD/MM/YYYY", validators: [{ required: true }] }
        , { type: "text_area", key: "description", value: item.description, name: "Mô tả công việc của chức danh này", input_type: "text", icon: "md-alert", hint: "Nhập mô tả chức danh này để ghi nhớ, công việc làm gì" }
        , {
          type: "button"
          , options: [
            { name: "Reset", next: "RESET" }
            , {
              name: type === 'add' ? 'Tạo mới' : 'Chỉnh sửa', next: "CALLBACK"
              , url: this.apiAuth.serviceUrls.RESOURCE_SERVER
                + "/post-parameters", token: true, signed: true
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
   * Hàm xử lý kết quả post sửa thêm
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
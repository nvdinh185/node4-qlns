import { Component, OnInit } from '@angular/core';
import { CommonsService, AuthService, PopoverCardComponent, DynamicFormMobilePage } from 'ngxi4-dynamic-service';

@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.page.html',
  styleUrls: ['./staffs.page.scss'],
})
export class StaffsPage implements OnInit {

  organizationId: any;  //mã tổ chức của user
  userReport: any;

  organizations: any; //danh sách tổ chức lấy từ csdl
  organizationsTree: any; //cây tổ chức hiển thị

  jobRoles: any; //danh sách chức danh lấy từ csdl

  staffs: any;//danh sách nhân sự lấy từ csdl

  constructor(
    private apiAuth: AuthService
    , private apiCommon: CommonsService
  ) { }

  ngOnInit() {
    this.refreshNews()
  }

  async refreshNews() {

    try {
      //Lấy danh sách tổ chức có trong csdl, 
      this.organizations = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-organizations");

      // console.log('Organization', this.organizations);


      //lấy mã tổ chức của username: 0766777123
      this.userReport = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-user-report");

      // console.log('get-user-report', this.userReport);

      //mã tổ chức của user
      this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0;

      //lấy danh sách chức danh từ csdl
      this.jobRoles = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-job-roles");

      // console.log('get-job-roles', this.jobRoles);

    } catch (e) {
      console.log('Lỗi', e);
    }

    //thay đổi chọn lựa
    this.onChangeSelect();
  }

  /**
   * Khi có thay đổi thêm/sửa/xóa
   */
  async onChangeSelect() {

    //reset cây tổ chức
    this.organizationsTree = [];

    try {
      //lấy danh sách nhân sự
      this.staffs = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-staffs");

      // console.log(this.staffs);

      if (Array.isArray(this.staffs)) {

        this.organizations.forEach(el => {

          el.click_type = 1; //cây chính cho click luôn
          el.main_tree = 1; //là cây chính

          //ghép nhân sự vào gốc cây
          if (this.staffs && el.id + '' !== '' + this.organizationId) {
            el.subs = this.staffs.filter(x => x.organization_id === el.id); //mảng nhân sự được ghép vào
          }

        });
        // console.log(this.organizations);

        //tạo cây tổ chức để hiển thị lên form
        this.organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id');
        // console.log(this.organizationsTree);

        //ghép thêm nhân sự Giám đốc, Phó Giám đốc vào gốc cây
        this.organizationsTree.forEach(el => {
          //lọc các nhân sự giám đốc, phó giám đốc của tổ chức
          if (this.staffs && el.id + '' === '' + this.organizationId) {
            let rootSubs = this.staffs.filter(x => x.organization_id === el.id);
            //trường hợp refresh thì không cần thêm vào
            if (!el.subs) el.subs = rootSubs;

            //duyệt rootSubs nếu tìm thấy một đối tượng trong el.subs thì thôi thoát ra 
            //nếu không tìm thấy thì push vào
            rootSubs.forEach(elsub => {
              let index = el.subs.findIndex(x => x.id === elsub.id && x.organization_id === elsub.organization_id);
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

      }
    } catch (e) {
      console.log('Err:', e);
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
        icon: {
          name: "md-add",
          color: "secondary",
        },
        name: "Thêm nhân sự GĐ",
        value: "add-child"
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
        }
        ,
        {
          icon: {
            name: "trash",
            color: "danger",
          },
          name: event.item.status === 1 ? "Khóa bỏ nhân sự" : "Kích hoạt nhân sự",
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
          name: "Thêm nhân sự",
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
        parent_id: item.main_tree === 1 ? undefined : item.id, //kế thừa cấp cha của nó nếu là cây con
        organization_id: item.organization_id ? item.organization_id : item.id,
        table_name: 'staffs', //tên bảng cần đưa vào
        wheres: [], //Mệnh đề wheres để update
        title_name: item.name //tên của cấp cha
      }

      this.addNewItem(itemNew, 'add');
    }

    //sửa tham số
    if (cmd.value === 'edit-owner') {
      item.table_name = 'staffs';         //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';
      item.title_name = item.organization_name;

      this.addNewItem(item, 'edit');
    }


    //thêm kpi từ Chỉ tiêu
    if (cmd.value === 'stop-owner') {

      item.table_name = 'staffs'; //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';

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
    //lấy danh sách đơn vị
    if (Array.isArray(this.organizations)) {
      this.organizations.forEach(el => {
        orgOptions.push(
          { name: el.name, value: parseInt(el.id) }
        )
      });
    }

    //danh mục chức danh của tổ chức đó
    let jobOptions = [];
    //danh mục chức danh của tổ chức đó nhưng bỏ chức danh chính đi
    let jobListOptions = [];

    //lấy từ cây đơn vị mà trong đó parent_id là gốc cây của đơn vị
    if (Array.isArray(this.jobRoles)) {
      this.jobRoles.forEach(el => {
        //chỉ lọc các chức danh trong tổ chức đó thôi
        if ('' + el.organization_id === '' + item.organization_id) {

          //lấy danh sách chức danh
          jobOptions.push(
            { name: el.name, value: parseInt(el.id) }
          )

          //lấy danh sách chức danh kiêm nhiệm - bỏ chức danh đang đảm nhiệm
          if ('' + el.id !== '' + item.job_id) {
            jobListOptions.push(
              { name: el.name, value: parseInt(el.id) }
            )
          }
        }

      });
    }

    let form = {
      title: (type === 'add' ? 'THÊM' : 'SỬA') + " DANH MỤC"
      , home_disable: true
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

        //hiển thị các thông tin của nhân sự
        , { type: "text", key: "name", value: item.name, name: "Họ và tên", input_type: "text", icon: "contact", validators: [{ required: true, min: 3, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" }
        , { type: "select-origin", key: "organization_id", name: "Thuộc đơn vị", value: "" + item.organization_id, options: orgOptions, icon: "logo-windows", validators: [{ required: true }], hint: "Chọn một đơn vị trực thuộc" }
        , { type: "select-origin", key: "job_id", name: "Chức danh", value: "" + item.job_id, options: jobOptions, icon: "logo-wordpress", validators: [{ required: true }], hint: "Chọn một chức danh" }
        , { type: "select-multiple-origin", key: "job_list", name: "Chức danh kiêm nhiệm", value: [], options: jobListOptions, icon: "logo-buffer", hint: "Chọn các công việc kiêm nhiệm của cá nhân đó" }
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
   * Dừng đối tượng này
   * @param item 
   */
  stopItem(item) {
    let form = {
      title: "Thay đổi trạng thái"
      , home_disable: true
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
   * Hàm xử lý kết quả post sửa thêm
   */
  callbackKpi = function (res) {

    //console.log(res);

    return new Promise((resolve, reject) => {

      if (res.error) {
        this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
      } else if (res.ajax) {
        //res.ajax.key==='organization_id' là trường có giá trị thay đổi
        //res.ajax.value là giá trị thay đổi ở trường có tên ở trên
        if (res.ajax.key === 'organization_id' && res.ajax.value) {

          //danh mục chức danh của tổ chức đó
          let jobOptions = [];

          //danh mục chức danh của tổ chức đó nhưng bỏ chức danh chính đi
          let jobListOptions = [];

          //lấy danh sách chức danh tùy chọn
          if (Array.isArray(this.jobRoles)) {
            this.jobRoles.forEach(el => {
              //chỉ lọc chức danh của tổ chức được chọn thôi
              if ('' + el.organization_id === '' + res.ajax.value) {

                //lấy danh sách chức danh
                jobOptions.push(
                  { name: el.name, value: parseInt(el.id) }
                )

                //vì không biết chọn chức danh nào nên vẫn trả đủ danh sách chức danh cho nó
                jobListOptions.push(
                  { name: el.name, value: parseInt(el.id) }
                )
              }

            });
          }

          //báo cho form động biết cần thay đổi trường dữ liệu ajax nào
          resolve([
            {
              key: "job_id" //tìm item có key là trường này
              , property_name: "options"   //nếu tìm thấy thì thay thuộc tính có tên ở đây
              , new_data: jobOptions //bằng giá trị mới cập nhập do chọn lựa từ form này
            }
            ,
            {
              key: "job_list" //tìm item có key là trường này
              , property_name: "options"   //nếu tìm thấy thì thay thuộc tính có tên ở đây
              , new_data: jobListOptions //bằng giá trị mới cập nhập do chọn lựa từ form này
            }
          ])

        } else if (res.ajax.key === 'job_id' && res.ajax.value) {
          //vì thay đổi công việc chính nên
          //thay đổi công việc kiêm nhiệm là trừ công việc chính đi
          let jobListOptions = [];

          if (Array.isArray(this.jobRoles)) {

            //lấy công việc chính đã chọn
            let elSelected = this.jobRoles.find(x => x.id == res.ajax.value);

            if (elSelected) {
              this.jobRoles.forEach(el => {
                //chỉ lọc chức danh của tổ chức được chọn thôi
                //loại trừ chức danh được chọn
                if ('' + el.organization_id === '' + elSelected.organization_id && '' + el.id !== '' + res.ajax.value) {
                  jobListOptions.push(
                    { name: el.name, value: parseInt(el.id) }
                  )
                }
              });
            }

            //báo cho form động biết cần thay đổi trường dữ liệu ajax nào
            // console.log(jobListOptions);
            resolve(
              {
                key: "job_list" //tìm item có key là trường này
                , property_name: "options"   //nếu tìm thấy thì thay thuộc tính có tên ở đây
                , new_data: jobListOptions //bằng giá trị mới cập nhập do chọn lựa từ form này
              }
            )

          }

        } else {
          resolve({ next: "NO-CHANGE" }); //không có gì thay đổi cả
        }

        return; //nếu gọi kiểu ajax thì chỉ trả về form đó thôi

      } else {
        //lấy lại kết quả đã tính toán
        this.onChangeSelect();
      }
      resolve({ next: "CLOSE" })
    })
  }.bind(this)

}

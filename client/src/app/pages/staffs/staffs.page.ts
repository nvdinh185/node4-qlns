import { Component, OnInit } from '@angular/core';
import { CommonsService, AuthService, PopoverCardComponent, DynamicFormMobilePage } from 'ngxi4-dynamic-service';

import * as Excel from "exceljs";
import * as fs from 'file-saver';

let config = {
  sheet_name: { value: 'staffs' }
  , noId: { value: "A" }
  , name: { value: "B" }
  , organization_id: { value: "C" }
  , organization_name: { value: "D" }
  , job_id: { value: "E" }
  , job_name: { value: "F" }
  , id: { value: "G" }
  , job_list: { value: "H" }
}

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

    this.onChangeSelect();
  }

  /**
   * Khi có thay đổi thêm/sửa/xóa
   */
  async onChangeSelect() {

    //cây tổ chức
    this.organizationsTree = [];

    try {
      //lấy danh sách nhân sự
      this.staffs = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-staffs");

      // console.log(this.staffs);

      if (Array.isArray(this.staffs)) {

        let orgTree = []

        // Lọc danh sách nhân sự theo mã tổ chức của user
        this.organizations.forEach(el => {
          if (el.id === this.organizationId) {
            orgTree.push(el)
          }
          if (el.parent_id === this.organizationId) {
            orgTree.push(el)
          }
        })

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
        organization_id: item.id,
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
    //lấy tùy chọn đơn vị
    if (Array.isArray(this.organizations)) {
      this.organizations.forEach(el => {
        orgOptions.push(
          { name: el.name, value: parseInt(el.id) }
        )
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
          jobOptions.push({ name: el.name, value: parseInt(el.id) })

          //lấy danh sách tùy chọn chức danh kiêm nhiệm - bỏ chức danh đang đảm nhiệm
          if (el.id !== item.job_id) {
            jobListOptions.push({ name: el.name, value: parseInt(el.id) })
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

    return new Promise(resolve => {

      if (res.error) {
        this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
      } else if (res.ajax) {
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
                jobOptions.push({ name: el.name, value: parseInt(el.id) })

                //vì không biết chọn chức danh nào nên vẫn trả đủ danh sách chức danh kiêm nhiệm
                jobListOptions.push({ name: el.name, value: parseInt(el.id) })
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
                  jobListOptions.push({ name: el.name, value: parseInt(el.id) })
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

        return; //nếu gọi kiểu ajax thì chỉ trả về form đó thôi, không đóng form popup

      } else {
        //lấy lại kết quả đã tính toán
        this.onChangeSelect();
      }
      resolve({ next: "CLOSE" })
    })
  }.bind(this)

  async onClickDownload() {
    let templateFile = this.apiAuth.serviceUrls.RESOURCE_SERVER + '/get-templates/sample-danhmuc-tochuc.xlsx'
    let blobData = await this.apiAuth.getDynamicUrl(templateFile, '', { responseType: 'blob' });
    let fr = new FileReader();
    fr.readAsArrayBuffer(blobData);
    fr.onloadend = async () => {
      let bufferData: any = fr.result;
      let wb = new Excel.Workbook();
      let workbook = await wb.xlsx.load(bufferData);
      workbook.eachSheet(sheet => {
        if (sheet.name != config.sheet_name.value) sheet.state = 'hidden';//ẩn các sheet không mong muốn
      })
      let worksheet = workbook.getWorksheet(config.sheet_name.value);

      let row = worksheet.getRow(2);
      row.getCell("A").value = this.organizationsTree[0].name;
      row.getCell("G").value = this.organizationsTree[0].id;

      // xác định bề rộng cho các cột
      worksheet.getColumn(1).width = 5
      worksheet.getColumn(2).width = 25
      worksheet.getColumn(4).width = 25
      worksheet.getColumn(6).width = 30
      worksheet.getColumn(8).width = 20
      worksheet.getColumn(9).width = 20

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
        fs.saveAs(blob, `excel-staffs-${Date.now()}.xlsx`);
      })
    }
  }

  onClickUpload(ev) {
    let arFile = ev.target.files;
    // console.log(arFile);
    let fr = new FileReader();
    fr.readAsArrayBuffer(arFile[0]);
    fr.onloadend = async () => {
      let bufferData: any = fr.result;
      let wb = new Excel.Workbook();
      try {
        let workbook = await wb.xlsx.load(bufferData)
        let worksheet = workbook.getWorksheet(config.sheet_name.value);
        let results = []
        worksheet.eachRow((row, rowIndex) => {
          if (rowIndex > 3) {
            let cols = {}
            for (let key in config) {
              let item = config[key];
              if (key != "sheet_name") {
                Object.defineProperty(cols
                  , key
                  , { value: this.getValueFormula(row.values[this.convertColExcel2Number(item.value)]) })
              }
            }
            results.push(cols);
          }
        })
        // console.log(results);
        let returnFinish = { count_success: 0, count_fail: 0 }
        for (const el of results) {
          let jsonPost = {
            id: el.id,
            organization_id: el.organization_id,
            name: el.name,
            job_id: el.job_id,
            job_list: el.job_list,
          }
          // console.log(jsonPost);
          try {
            await this.apiAuth.postDynamicJson(this.apiAuth.serviceUrls.RESOURCE_SERVER
              + '/post-staffs', jsonPost)
            returnFinish.count_success++;
          } catch (err) {
            // console.log(err);
            returnFinish.count_fail++;
          }
        }
        console.log(returnFinish);
        this.onChangeSelect();

      } catch (err) {
        console.log('Lỗi đọc file excel nguồn!', err);
      } finally {
      }

    }

  }

  convertColExcel2Number = (val: string): number => {
    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;
    for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
      result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
    }
    return result;
  }

  getValueFormula(obj) {
    if (obj === null || obj === undefined) return null
    if (typeof obj === 'object') {
      // xử lý chuyển đổi chỉ lấy text thôi
      if (obj.richText) return obj.richText.map(o => o["text"]).join("")
      // lấy giá trị bằng biểu thức function
      return obj.result
    }
    return obj
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService, CommonsService, PopoverCardComponent, DynamicFormMobilePage } from 'ngxi4-dynamic-service';

import * as Excel from "exceljs";
import * as fs from 'file-saver';

let config = {
  sheet_name: { value: 'job_roles' }
  , noId: { value: "A" }
  , name: { value: "B" }
  , short_name: { value: "C" }
  , description: { value: "D" }
  , id: { value: "E" }
  , parent_id: { value: "F" }
  , organization_id: { value: "G" }
  , organization_name: { value: "H" }
}

@Component({
  selector: 'app-job-roles',
  templateUrl: './job-roles.page.html',
  styleUrls: ['./job-roles.page.scss'],
})
export class JobRolesPage implements OnInit {

  organizationId: any; //id tổ chức của user

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
      this.userReport = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-user-report");
      // console.log(this.userReport);

      this.organizationId = this.userReport && this.userReport.organization_id ? this.userReport.organization_id : 0;

      this.organizations = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-organizations");
      // console.log(this.organizations);

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

      let orgTree = []

      // lọc lấy những tổ chức theo id tổ chức của user
      this.organizations.forEach(el => {
        if (el.id === this.organizationId) {
          orgTree.push(el)
        }
        if (el.parent_id === this.organizationId) {
          orgTree.push(el)
        }
      })
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
        this.processDetails(data, item)
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
        this.processDetails(data, event.item)
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
        id: -1, //Giả id để thêm vào
        parent_id: item.main_tree === 1 ? undefined : item.id, //kế thừa cấp cha của nó
        organization_id: item.organization_id ? item.organization_id : item.id,//mã tổ chức của nó hoặc cấp cha
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
        , { type: "hidden", key: "id", value: item.id }
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
      callback: this.callbackProcess
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
      callback: this.callbackProcess
    })

  }

  /**
   * Hàm xử lý kết quả post sửa thêm xóa
   */
  callbackProcess = function (res) {

    //console.log(res);

    return new Promise(resolve => {

      if (res.error) {
        this.apiCommon.presentAlert('Lỗi:<br>' + (res.error && res.error.message ? res.error.message : "Error Unknow: " + JSON.stringify(res.error)));
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
      //ẩn các sheet không mong muốn
      workbook.eachSheet(sheet => {
        if (sheet.name !== config.sheet_name.value) sheet.state = 'hidden';
      })
      let worksheet = workbook.getWorksheet(config.sheet_name.value);

      let row = worksheet.getRow(2);
      row.getCell("A").value = this.organizationsTree[0].name;
      row.getCell("E").value = this.organizationsTree[0].id;

      // xác định bề rộng cho các cột
      worksheet.getColumn(1).width = 5
      worksheet.getColumn(2).width = 30
      worksheet.getColumn(3).width = 18
      worksheet.getColumn(4).width = 30
      worksheet.getColumn(8).width = 20

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
        fs.saveAs(blob, `excel-job_roles-${Date.now()}.xlsx`);
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
            name: el.name,
            short_name: el.short_name,
            description: el.description,
            id: el.id,
            parent_id: el.parent_id,
            organization_id: el.organization_id
          }
          // console.log(jsonPost);
          try {
            await this.apiAuth.postDynamicJson(this.apiAuth.serviceUrls.RESOURCE_SERVER
              + '/post-job-roles', jsonPost)
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

import { Component } from '@angular/core';
import { AuthService, CommonsService, PopoverCardComponent, DynamicFormMobilePage } from 'ngxi4-dynamic-service';
import { ApiDownloadService } from 'src/app/services/api-download.service';
import { ApiExcelService } from 'src/app/services/api-excel.service';

import * as Excel from "exceljs";

let config = {
  sheet_name: { value: "organizations" }
  , noId: { value: "A" }
  , name: { value: "B" }
  , short_name: { value: "C" }
  , description: { value: "D" }
  , id: { value: "E" }
  , parent_id: { value: "F" }
}

@Component({
  selector: 'app-organizations',
  templateUrl: 'organizations.page.html',
  styleUrls: ['organizations.page.scss'],
})
export class OrganizationsPage {

  userReport: any;

  organizations: any; //danh sách tổ chức từ csdl
  organizationsTree: any; //cây tổ chức để hiển thị

  constructor(
    private apiAuth: AuthService
    , private apiCommon: CommonsService
    , private apiDownload: ApiDownloadService
    , private apiExcel: ApiExcelService
  ) { }

  ngOnInit() {
    this.refreshNews();
  }

  async refreshNews() {

    try {
      // lấy mã tổ chức của username: 0766777123
      this.userReport = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-user-report");
      // console.log(this.userReport);

      // Lấy danh sách tổ chức
      this.organizations = await this.apiAuth.getDynamicUrl(this.apiAuth.serviceUrls.RESOURCE_SERVER
        + "/get-organizations");
      // console.log(this.organizations);
      if (Array.isArray(this.organizations)) {
        this.organizations.forEach(el => {
          el.click_type = 2;
        });

        // Dùng service để chuyển thành cây tổ chức
        let organizationsTree = this.apiCommon.createTreeMenu(this.organizations, 'id', 'parent_id');
        // console.log(organizationsTree);

        // Lấy cây tổ chức theo userReport.organization_id
        if (this.userReport && Array.isArray(organizationsTree)) {
          this.organizationsTree = organizationsTree.filter(x => x.id === this.userReport.organization_id);
        } else {
          this.organizationsTree = organizationsTree;
        }
        // console.log(this.organizationsTree);

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
          name: "Thêm đơn vị phụ thuộc",
          value: "add-child",
          icon: {
            name: "md-add",
            color: "secondary",
          }
        }
        ,
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
      }
      ,
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
        parent_id: item.id, //kế thừa cấp cha của nó
        table_name: 'organizations', //tên bảng cần đưa vào
        wheres: [], //Mệnh đề wheres để update
        title_name: item.name //tên của cấp cha
      }

      this.addNewItem(itemNew, 'add');
    }

    //sửa tham số
    if (cmd.value === 'edit-owner') {

      item.table_name = 'organizations'; //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';
      item.title_name = item.name;

      this.addNewItem(item, 'edit');
    }

    //tạm dừng tham số
    if (cmd.value === 'stop-owner') {

      item.table_name = 'organizations'; //tên bảng cần đưa vào
      item.wheres = ['id'];              //Mệnh đề wheres để update = '';

      this.stopItem(item);
    }

  }

  /**
   * Thêm hoặc sửa tham số
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

        , { type: "text", key: "name", value: item.name, name: "Tên đơn vị", input_type: "text", icon: "logo-buffer", validators: [{ required: true, min: 5, max: 100 }], hint: "Độ dài tên cho phép từ 5 đến 100 ký tự" }
        , { type: "text", key: "short_name", value: item.short_name, name: "Tên viết tắt", input_type: "text", icon: "at", validators: [{ required: true, min: 1, max: 6 }], hint: "Độ dài tối đa 6 ký tự" }
        , { type: "text_area", key: "description", value: item.description, name: "Mô tả thông tin của đơn vị", input_type: "text", icon: "md-alert", hint: "Nhập mô tả này để ghi nhớ" }
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
   * Hàm loại bỏ/kích hoạt đơn vị
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

  /**
   * Download file excel xuống máy
   */
  onClickDownload() {
    let linkFile = this.apiAuth.serviceUrls.RESOURCE_SERVER + '/get-templates/sample-danhmuc-tochuc.xlsx'
    this.apiDownload.processFileDownload(linkFile
      , config.sheet_name.value
      , "excel"
      , config
      , this.callbackDownload)
  }

  /**
   * Hàm xử lý gọi lại download
   */
  callbackDownload = function (ws: Excel.Worksheet, config: any) {
    return new Promise(async resolve => {
      try {
        let result = await this.apiExcel.processWriteExcel(this.organizationsTree, ws, config)
        resolve({ status: "OK", message: "Xử lý thành công", count: result.count })
      } catch (e) {
        console.log("Lỗi xử lý dữ liệu callback process", e);
        resolve({ status: "NOK", error: e })
      } finally {
      }
    })
  }.bind(this)

  /**
   * Chọn file dữ liệu mẫu và upload để cập nhật CSDL
   * @param ev 
   */
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
          let jsonPost = { name: el.name, short_name: el.short_name, description: el.description, id: el.id, parent_id: el.parent_id }
          // console.log(jsonPost);
          try {
            await this.apiAuth.postDynamicJson(this.apiAuth.serviceUrls.RESOURCE_SERVER
              + '/post-organizations', jsonPost)
            returnFinish.count_success++;
          } catch (err) {
            // console.log(err);
            returnFinish.count_fail++;
          }
        }
        console.log(returnFinish);
        this.refreshNews();

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

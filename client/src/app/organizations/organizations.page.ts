import { Component } from '@angular/core';
import { AuthService, CommonsService, PopoverCardComponent } from 'ngxi4-dynamic-service';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-organizations',
  templateUrl: 'organizations.page.html',
  styleUrls: ['organizations.page.scss'],
})
export class OrganizationsPage {

  userReport: any; //Đối tượng nhận 1 lần ban đầu về chu kỳ đơn vị, cá nhân

  organizations: any; //ghi bảng ghi gốc của tổ chức cấp độc lập (lấy id=root_id)
  organizationsTree: any; //ghi cây của các tổ chức độc lập đến subs

  itemOpen: any;

  constructor(
    private apiAuth: AuthService
    , private apiCommon: CommonsService
    , private popoverCtrl: PopoverController
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
    console.log(card);
    let menu =
      [
        {
          icon: "md-add",
          color: "secondary",
          name: "Thêm đơn vị phụ thuộc",
          value: "add-child"
        }
        ,
        {
          icon: "md-create",
          color: "primary",
          name: "Chỉnh sửa thông tin",
          value: "edit-owner"
        }
      ];

    //Thực hiện hiển thị menu
    // let popover = this.popoverCtrl.create(PopoverCardComponent, {
    //   form: {
    //     type: "item", //icon/color/tab/item
    //     menu: menu
    //   }
    // });

    //Hiển thị menu tại nơi xãy ra sự kiện $event này
    // popover.present({ ev: ev });

    // //Sau khi người dùng lựa chọn một item thì sẽ trả về dữ liệu data sau
    // popover.onDidDismiss(data => {
    //   if (data) {
    //     //thực hiện tùy vào tham số data trả về này
    //     this.processKpiDetails(data, card)
    //   }
    // })

  }

}

/**
 * cap menu dong dung hien thi dong mo cay
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'tree-list',
    templateUrl: "tree-list.html"
})
export class TreeList implements OnInit {
    @Input() treeData: any[];
    @Input() level: number = 0;

    @Output() onClickKpi = new EventEmitter();

    isArrow: boolean = false;
    /**
     * Khai báo các biến liên kết sử dụng dịch vụ
     */
    constructor(public platform: Platform) { }

    /**
     * Khởi tạo các tham số mặt định
     */
    ngOnInit() {
        this.isArrow = this.platform.is('mobile')
    }

    /**
     * Khi bấm để đóng mở node
     * @param node 
     */
    toggleChildren(node: any) {
        node.visible = !node.visible;
    }

    /**
     * Khi bấm vào cell nội dung nhằm gọi chức năng edit thông tin của cell này
     * @param node 
     */
    onClickItem(event, item) {
        this.onClickKpi.emit({ event, item });
    }

    /**
     * Khi Bấm sự kiện ở node con
     * Chuyển giao sự kiện này lên cấp cao hơn
     * @param event 
     */
    onClickTreeItem(event) {
        this.onClickKpi.emit(event);
    }

}
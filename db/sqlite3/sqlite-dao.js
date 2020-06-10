"use strict"
/**
 * ver 4.0 ngày 01/11/2019
 * Tích hợp hàm chuyển đổi jsonData=>jsonSql
 * Và sử dụng mệnh đề where khi value là array --> in ()
 * Lưu ý, do sử dụng mệnh đề toString() nên nếu array Value là string thì phải có dạng
 * "''" cặp nháy kép trong nháy đơn, thì câu lệnh sql mới thực thi
 * console.log(["'abc'","'xyz'"].toString());
 * 
 * Hàm chuyển đổi json -> sql tích hợp
 * 
 * ver 3.3 ngày 02/10/2019
 * Khởi tạo bảng và dữ liệu ban đầu từ json
 * 
 * Tạo các bảng từ array, và insert data từ array
 * 
 * version 3.2
 * debug runSql all parameters
 *  
 * version 3.1 
 * doi tuong sqlite-dao - cuong.dq 
 * 
 * repaired 20190105: col.value !=undefined && !=null 
 */
const sqlite3 = require('sqlite3').verbose();
const isSilence = true;

class SQLiteDAO {

  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.error('Could NOT connect to database ' + dbFilePath, err);
      } else {
        console.log('Connected to database ' + dbFilePath);
      }
    })
  }

  /**
   * Hàm chuyển đổi câu lệnh sql insert, update, delete từ json
   * @param tablename 
   * @param json 
   * @param idWheres 
   */
  convertSqlFromJson(tablename, json, idWheres = []) {
    let jsonInsert = { name: tablename, cols: [], wheres: [] }
    let whereFields = idWheres ? idWheres : ['id'];
    for (let key in json) {
      let value = json[key];
      // chuyển đổi tất cả các giá trị kiểu object sang stringify trước khi chèn vào
      // Do sử dụng array trong mệnh đề where nên cho phép chuyển đổi trong lệnh update, insert và update
      // if (typeof value === 'object') value = JSON.stringify(value, null, 2);

      jsonInsert.cols.push({ name: key, value: value });
      if (whereFields.find(x => x === key)) jsonInsert.wheres.push({ name: key, value: value })
    }
    return jsonInsert;
  }


  /**
   * Tạo các bảng dữ liệu từ sheet tables trong file excel
   * @param {*} tables [{table_name: value, field_name: value, ...}]
   */
  createTables(tables) {

    return new Promise(resolve => {

      let tables_created = [];
      let countFinish = 0;

      // Khai báo mảng chứa tên bảng duy nhất
      let valueArr = tables.map((o) => { return o['table_name'] });
      //const distinct = (value, index, self) => { return self.indexOf(value)===index;}
      let distinct_table_name = valueArr.filter((value, index, self) => { return self.indexOf(value) === index });

      // hoac 1 cau sau:
      // let distinct_table_name = [...new Set(tables.map(x => x.table_name))];

      //console.log('distinct_table_name', distinct_table_name);
      distinct_table_name.forEach(
        async el => { //để cho các lệnh dưới thực hiện tuần tự xong thì mới qua bước kia

          // Lọc lấy các dòng có cùng tên bảng
          let table = tables.filter(x => x.table_name === el);

          // Nếu có dữ liệu được lọc
          if (table && table.length > 0) {

            //thì chuyển đổi thành chuỗi json chèn dữ liệu vào csdl
            let tableJson = {
              name: el,
              cols: []
            };

            let createIndexs = [];
            let idx = 0;

            table.forEach(e => {

              let col = {
                name: e.field_name,
                type: e.data_type,
                option_key: e.options,
                description: e.description
              };

              tableJson.cols.push(col);

              // Kiểm tra nếu yêu cầu tạo index thì tạo câu lệnh tạo index độc lập riêng
              if (e.option_index === 'UNIQUE' || e.option_index === 'INDEX') {
                createIndexs.push("CREATE " + (e.option_index === "UNIQUE" ? "UNIQUE" : "") + "\
                                          INDEX idx_"+ el + "_" + (++idx) + "\
                                          ON "+ el + "(" + e.field_name + ")"
                );
              }
            })

            // Thực hiện tạo bảng bằng dữ liệu json đã chuyển đổi ở trên
            try {
              await this.createTable(tableJson);
              // thông báo tạo xong bảng
              console.log('Create table ok: ', el);

              for (let i = 0; i < createIndexs.length; i++) {
                //thực hiện tạo index sau khi tạo bảng thành công
                await this.runSql(createIndexs[i]);
                console.log('index created: ', "idx_" + el + "_" + i);
              }
              // ghi nhận bảng đã tạo xong
              tables_created.push(el);
              countFinish++;
            } catch (err) {
              console.log('Lỗi create table: ', err);
              countFinish++;
            }
          } else {
            countFinish++;
          }

          if (countFinish === distinct_table_name.length) {
            resolve(tables_created);
          }

        })
    })


  }

  /**
   * Tạo dũ liệu cho bảng, từ một mảng dữ liệu json chứa từng bảng ghi
   * @param {*} tableName 
   * @param {*} jsonRows {col_name:value,...}
   */
  insertTableData(tableName, jsonRows) {

    return new Promise(resolve => {
      let returnFinish = { count_sccess: 0, count_fail: 0 }

      // for (let i = 0; i < jsonRows.length; i++) {
      jsonRows.forEach(async (row, idx) => {

        // let row = jsonRows[i];
        let jsonInsert = { name: tableName, cols: [] }

        for (let key in row) {
          let col = { name: key, value: row[key] };
          jsonInsert.cols.push(col);
        }

        try {
          if (jsonInsert.cols.length > 0) {
            await this.insert(jsonInsert);
            returnFinish.count_sccess++;
          }
        } catch (err) {
          console.log('err: ', err);
          returnFinish.count_fail++;
        } finally {
          if (idx >= jsonRows.length - 1) resolve(returnFinish)
        }

      })

    })
  }

  /**
   * 
   * @param {*} table 
   * var table ={
   *              name: 'LOGIN',
   *              cols: [
   *                      {
   *                        name: 'ID',
   *                        type: dataType.integer,
   *                        option_key: 'PRIMARY KEY AUTOINCREMENT',
   *                        description: 'Key duy nhat quan ly'
   *                        }
   *                      ]
   *            }
   */
  createTable(table) {
    let sql = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (';
    let i = 0;
    for (var col of table.cols) {
      if (i++ == 0) {
        sql += col.name + ' ' + col.type + ' ' + col.option_key;
      } else {
        sql += ', ' + col.name + ' ' + col.type + ' ' + col.option_key;
      }
    }
    sql += ')';
    return this.runSql(sql);
  }


  //insert
  /**
   * 
   * @param {*} insertTable 
   * var insertTable={
   *                  name:'tablename',
   *                  cols:[{
   *                        name:'ID',
   *                        value:'1'
   *                        }]
   *                  }
   * 
   */
  insert(insertTable) {
    let sql = 'INSERT INTO ' + insertTable.name
      + ' ('
    let i = 0;
    let sqlNames = '';
    let sqlValues = '';
    let params = [];
    for (let col of insertTable.cols) {
      if (col.value != undefined && col.value != null) {
        // chuyển đổi tất cả các giá trị kiểu object sang stringify trước khi chèn vào
        // Do sử dụng array trong mệnh đề where nên cho phép chuyển đổi trong lệnh update, insert và update
        // nếu là đối tượng trong insert thì tự chuyển string nhé
        // còn nếu đối tượng ở mệnh đề where của câu lệnh update phải tự chuyển sang string trước khi update, delete
        if (typeof col.value === 'object') {
          params.push(JSON.stringify(col.value, null, 2));
        } else {
          params.push(col.value);
        }

        if (i++ == 0) {
          sqlNames += col.name;
          sqlValues += '?';
        } else {
          sqlNames += ', ' + col.name;
          sqlValues += ', ?';
        }
      }
    }

    sql += sqlNames + ') VALUES (';
    sql += sqlValues + ')';

    return this.runSql(sql, params);
  }

  //update 
  /**
   * 
   * @param {*} updateTable
   *  var updateTable={
   *                  name:'tablename',
   *                  cols:[{
   *                        name:'ID',
   *                        value:'1'
   *                        }]
   *                  wheres:[{
   *                         name:'ID',
   *                         value:'1'
   *                         }]
   *                  }
   */
  update(updateTable) {
    let sql = 'UPDATE ' + updateTable.name + ' SET ';

    let i = 0;
    let params = [];
    for (let col of updateTable.cols) {
      if (col.value !== undefined && col.value !== null && (typeof col.value != 'object')) {
        //neu gia tri khong phai undefined moi duoc thuc thi, và giá trị không phải là đối tượng
        params.push(col.value);
        if (i++ == 0) {
          sql += col.name + '= ?';
        } else {
          sql += ', ' + col.name + '= ?';
        }
      } else if (col.value === null) {
        // mệnh đề null luôn không tăng i
        if (i++ == 0) {
          sql += col.name + '= null';
        } else {
          sql += ', ' + col.name + '= null';
        }
      }
    }

    i = 0;
    for (let col of updateTable.wheres) {
      if (col.value !== undefined && col.value !== null) {
        // ver 4.0 bổ sung mệnh đề in trong where
        if (Array.isArray(col.value)) {
          if (i++ == 0) {
            sql += ' WHERE ' + col.name + ' in (' + col.value.toString() + ')';
          } else {
            sql += ' AND ' + col.name + ' in (' + col.value.toString() + ')';
          }
        } else {
          params.push(col.value);
          if (i++ == 0) {
            sql += ' WHERE ' + col.name + '= ?';
          } else {
            sql += ' AND ' + col.name + '= ?';
          }
        }

      } else if (col.value === null) {
        // mệnh đề null luôn không tăng i
        if (i++ == 0) {
          sql += ' WHERE ' + col.name + 'is null';
        } else {
          sql += ' AND ' + col.name + 'is null';
        }

      } else {
        sql += ' WHERE 1=2'; //menh de where sai thi khong cho update Bao toan du lieu
      }
    }
    return this.runSql(sql, params)
  }

  //delete
  /**
   * Ham xoa bang ghi
   * @param {*} id 
   */
  delete(deleteTable) {
    let sql = 'DELETE FROM ' + deleteTable.name;
    let i = 0;
    let params = [];
    for (let col of deleteTable.wheres) {
      if (col.value != undefined && col.value != null) {
        // ver 4.0 bổ sung mệnh đề in trong where
        if (Array.isArray(col.value)) {
          if (i++ == 0) {
            sql += ' WHERE ' + col.name + ' in (' + col.value.toString() + ')';
          } else {
            sql += ' AND ' + col.name + ' in (' + col.value.toString() + ')';
          }
        } else {
          params.push(col.value);
          if (i++ == 0) {
            sql += ' WHERE ' + col.name + '= ?';
          } else {
            sql += ' AND ' + col.name + '= ?';
          }
        }

      } else {
        sql += ' WHERE 1=2'; //dam bao khong bi xoa toan bo so lieu khi khai bao sai
      }
    }
    return this.runSql(sql, params)
  }

  //
  /**
   *lenh select, update, delete su dung keu json 
   * @param {*} selectTable 
   */
  select(selectTable) {
    let sql = 'SELECT * FROM ' + selectTable.name;
    let i = 0;
    let params = [];
    let sqlNames = '';
    for (let col of selectTable.cols) {
      if (i++ == 0) {
        sqlNames += col.name;
      } else {
        sqlNames += ', ' + col.name;
      }
    }
    sql = 'SELECT ' + sqlNames + ' FROM ' + selectTable.name;
    i = 0;
    if (selectTable.wheres) {
      for (let col of selectTable.wheres) {
        if (col.value != undefined && col.value != null) {

          // ver 4.0 bổ sung mệnh đề in trong where
          if (Array.isArray(col.value)) {
            if (i++ == 0) {
              sql += ' WHERE ' + col.name + ' in (' + col.value.toString() + ')';
            } else {
              sql += ' AND ' + col.name + ' in (' + col.value.toString() + ')';
            }
          } else {
            params.push(col.value);
            if (i++ == 0) {
              sql += ' WHERE ' + col.name + '= ?';
            } else {
              sql += ' AND ' + col.name + '= ?';
            }
          }

        }
      }
    }
    //console.log(sql);
    //console.log(params);
    return this.getRst(sql, params)
  }
  //lay 1 bang ghi dau tien cua select
  /**
   * lay 1 bang ghi
   * @param {*} sql 
   * @param {*} params 
   */
  getRst(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          if (!isSilence) console.log('Could NOT excute: ', sql, params);
          reject(err)
        } else {
          resolve(row || {})
        }
      })
    })
  }

  /**
   * Lay tat ca cac bang ghi
   * @param {*} sql 
   * @param {*} params 
   */
  getRsts(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          if (!isSilence) console.log('Could NOT excute: ', sql, params);
          reject(err)
        } else {
          resolve(result || [])
        }
      })
    })
  }

  //cac ham va thu tuc duoc viet duoi nay
  /**
   * Ham thuc thi lenh sql va cac tham so
   * @param {*} sql 
   * @param {*} params 
   */
  runSql(sql, params = []) {                    // Hàm do ta tự đặt tên gồm 2 tham số truyền vào.
    return new Promise((resolve, reject) => {   // Tạo mới một Promise thực thi câu lệnh sql
      this.db.run(sql, params, function (err) { // This.db sẽ là biến đã kết nối csdl, ta gọi hàm run của this.db chính là gọi hàm run của sqlite3 trong NodeJS hỗ trợ (1 trong 3 hàm như đã nói ở trên)
        if (err) {   //Trường hợp lỗi
          if (!isSilence) console.log('Could NOT excute: ', sql, params, err)
          reject(err)
        } else {   //Trường hợp chạy query thành công
          resolve('Executed: ' + sql)   //Trả về kết quả là một object có id lấy từ DB.
        }
      })
    })
  }

}

module.exports = SQLiteDAO; 
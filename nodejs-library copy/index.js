
const start=require('./createtable');
const add=require('./add_book');
const changebooknumber=require('./change_book_number');
const app=require('./WebApp');
const alter=require('./alter');
const search=require('./search');
const reader=require('./reader');
const record=require('./borrowrecord');

app.route('/createtable','post',start.create); //初始化
app.route('/add_book','post',add.addbook);//添加新书
app.route('/add_book_number','post',changebooknumber.addnumber);//增加书籍数量
app.route('/dec_book_number','post',changebooknumber.decnumber);//删除、减少书籍
app.route('/change_book','post',alter.changebookinfo);//修改书籍信息
app.route('/search_book','post',search.searchbook);//查询书籍
app.route('/add_reader','post',reader.addreader);//添加读者
app.route('/delete_reader','post',reader.deletereader);//删除读者
app.route('/change_reader','post',alter.changereader);//修改读者信息
app.route('/search_reader','post',search.searchreader);//查询读者
app.route('/search_return_info','post',search.searchreturn);//查看某个读者未还书籍信息
app.route('/borrow_book','post',record.borrowbook);//借书
app.route('/return_book','post',record.returnbook);//还书
app.route('/late_reader','post',search.searchlate);//超期读者列表

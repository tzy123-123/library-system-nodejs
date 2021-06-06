const { execSQL } = require("./coSqlite3");
const db=require("./coSqlite3");

function get_time(now){
    var d=new Date(now);
    var Y=d.getFullYear();
    var M=d.getMonth()+1;
    if(M>1&&D<10){
        M='0'+M;
    }
    var D=d.getDate();
    if(D>1&&D<10){
        D='0'+D;
    }
    return Y+'-'+M+'-'+D;
}
function get_return_time(time,days){
    var d=new Date(time)
    d.setDate(d.getDate()+days);
    return get_time(d);
}

exports.borrowbook=function*(req,res){

    let ans="<html><body><div id='result' style='display:none'>";
    let now=Math.round(new Date().getTime());
    let body=req.body;
    let rID=body.rID;
    let bID=body.bID;
    let time=get_time(now);
    let returntime=get_return_time(now,30);
    let reader=yield db.execSQL("select count(*) as cnt from Myreader where rID=?",[rID]);
    let book=yield db.execSQL("select count(*) as cnt from Mybook where bID=?",[bID]);
    let book_number=yield db.execSQL("select bCnt as cnt from Mybook where bID=?",[bID]);
    let record=yield db.execSQL("select count(*) as cnt from Myrecord where rID=? and timereturn < ? ",[rID,time]);
    let rows=yield db.execSQL("select count(*) as cnt from Myrecord where rID=? and bID=?",[rID,bID]);

    if(!rID||!bID){
        ans+="6</div>不能为空</body></html>";
    }
    else if(reader[0].cnt==0){
        ans+="1</div>该证号不存在</body></html>";
    }
    else if(book[0].cnt==0){
        ans+="2</div>该书号不存在</body></html>";
    }
    else if(record[0].cnt>0){
        ans+="3</div>该读者有超期书未还</body></html>";
    }
    else if(rows[0].cnt>0){
        ans+="4</div>该读者已经借阅该书，且未归还</body></html>";
    }
    else if(book_number[0].cnt==0){
        ans+="5</div>该书已经全部借出</body></html>";
    }
    else{
        yield db.execSQL("insert into Myrecord(bID,rID,timeborrow,timereturn) values(?,?,?,?)",[bID,rID,time,returntime]);
        yield db.execSQL("update Mybook set bCnt=bCnt-1 where bID=?",[bID]);
        ans+="0</div>成功</body></html>";
    }
    return ans;
}
exports.returnbook=function*(req,res){

    let ans="<html><body><div id='result' style='display:none'>";
    let body=req.body;
    let rID=body.rID;
    let bID=body.bID;
    let student=yield db.execSQL("select count(*) as cnt from Myreader where rID=?",[rID]);
    let book=yield db.execSQL("select count(*) as cnt from Mybook where bID=?",[bID]);
    let record=yield db.execSQL("select count(*) as cnt from Myrecord where rID=? and bID=?",[rID,bID]);
    //if(!rID||bID){}
    if(student[0].cnt==0){
        ans+="1</div>该证号不存在</body></html>";
    } 
    else if(book[0].cnt==0){
        ans+="2</div>该书号不存在</body></html>";
    }
    else if(record[0].cnt==0){
        ans+="3</div>该读者并未借阅该书</body></html>";
    }
    else{
        yield db.execSQL("delete from Myrecord where rID=? and bID=?",[rID,bID]);
        yield db.execSQL("update Mybook set bCnt=bCnt+1 where bID=?",[bID]);
        ans+="0</div>成功</body></html>";
    }
    return ans;
}

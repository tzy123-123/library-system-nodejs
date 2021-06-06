const { execSQL } = require("./coSqlite3");
const db=require("./coSqlite3");

exports.addreader=function*(req,res){

    let ans="<html><body><div id='result' style='display:none'>";
    let body=req.body;
    let rID=body.rID;
    let rName=body.rName;
    let rSex=body.rSex;
    let rDept=body.rDept;
    let rGrade=body.rGrade;
    let number=yield db.execSQL("select count(*) as cnt from Myreader where rID=?",[rID]);

    if(!rID||!rName||!rSex||!rDept||!rGrade){
        ans+="2</div>提交的参数有误：有内容为空</body></html>";
    }
    else if(rID.length>8){
        ans+="2</div>提交的参数有误：ID超过8字符</body></html>";
    }
    else if(rName.length>10){
        ans+="2</div>提交的参数有误：姓名超过10字符</body></html>";
    }
    else if(rSex!='女'&&rSex!='男'){
        ans+="2</div>提交的参数有误：性别不为男或女</body></html>";
    }
    else if(rDept.length>10){    
        ans+="2</div>提交的参数有误：系超过10字符</body></html>";
    }
    else if(parseInt(rGrade)!=rGrade||rGrade<=0){    
        ans+="2</div>提交的参数有误：年级不为正整数</body></html>";
    }
    else if(number[0].cnt>0){
        ans+="1</div>该证号已经存在</body></html>";
    }
    else{
        yield db.execSQL("insert into Myreader(rID,rName,rSex,rDept,rGrade) values(?,?,?,?,?)",[rID,rName,rSex,rDept,rGrade]);
        ans+="0</div>成功</body></html>";
    }
    return ans;
}
exports.deletereader=function*(req,res){

    let ans="<html><body><div id='result' style='display:none'>";
    let body=req.body;
    let rID=body.rID;
    let number=yield db.execSQL("select count(*) as cnt from Myreader where rID=?",[rID]);
    if(number[0].cnt==0){
        ans+="1</div>该证号不存在</body></html>";
    }
    else{
        let rows=yield db.execSQL("select count(*) as cnt from Myrecord where rID=?",[rID]);
        if(rows[0].cnt!=0){
            ans+="2</div>该读者尚有书籍未归还</body></html>";
            return ans;
        }
        else{
            yield db.execSQL("delete from Myreader where rID=?",[rID]);
            ans+="0</div>成功</body></html>";
        }
    }

    return ans;
}


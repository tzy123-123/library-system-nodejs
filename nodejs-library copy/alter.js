const { execSQL } = require("./coSqlite3");
const db=require("./coSqlite3");

function isDatePart(dateStr){
    var parts;
    
    if(dateStr.indexOf("-") > -1){
        parts = dateStr.split('-');
    }else{
        return false;
    }
    if(parts.length < 3){
        return false;
    }
    
    for(i = 0 ;i < 3; i ++){
        if(isNaN(parts[i])){
          return false;
        }
    }

    y = parts[0];
    m = parts[1];
    d = parts[2];
    
    if(y.length!=4||m.length!=2||d.length!=2) return false;

    y=parseInt(y);
    m=parseInt(m);
    d=parseInt(d);


    if(y > 3000){
        return false;
    }
    
    if(m < 1 || m > 12){
        return false;
    }
    
    switch(d){
        case 29:
          if(m == 2){
          //如果是2月份
            if( (y / 100) * 100 == y && (y / 400) * 400 != y){
              //如果年份能被100整除但不能被400整除 (即闰年)
            }else{
              return false;
            }
          }
          break;
        case 30:
          if(m == 2){
          //2月没有30日
            return false;
          }
          break;
        case 31:
          if(m == 2 || m == 4 || m == 6 || m == 9 || m == 11){
          //2、4、6、9、11月没有31日
            return false;
          }
          break;
        default:
    
    }
    return true;
}

exports.changebookinfo=function*(req,res){
    
    let ans="<html><body><div id='result' style='display:none'>";
    let body=req.body;
    let bID=body.bID;
    let bName=body.bName;
    let bPub=body.bPub;
    let bDate=body.bDate;
    let bAuthor=body.bAuthor;
    let bMem=body.bMem;
    let number=yield db.execSQL("select count(*) as number from Mybook where bID=?",[bID]);
    
    if(!bID||!bName||!bPub||!bDate||!bAuthor||!bMem){
        ans+="2</div>提交的参数有误：信息不能为空</body></html>";
    }
    else if(bID.length>30){
        ans+="2</div>提交的参数有误：bID超过30个字符</body></html>";
    }
    else if(number[0].number==0){
        ans+="1</div>该书不存在</body></html>";
    }
    else if(bName.length>30){
        ans+="2</div>提交的参数有误：bname超过30字符</body></html>";
    }
    else if(bPub.length>30){
        ans+="2</div>提交的参数有误：bpub超过20字符</body></html>";
    }
    else if(bAuthor.length>20){
        ans+="2</div>提交的参数有误：bauther超过20字符</body></html>";
    }
    else if(bMem.length>30){
        ans+="2</div>提交的参数有误：bmem超过30字符</body></html>";
    }
    else if(!isDatePart(bDate)){
        ans+="2</div>提交的参数有误：日期格式不对</body></html>";
    }
    else {
        yield db.execSQL("update Mybook set bName=?,bPub=?,bDate=?,bAuthor=?,bMem=? where bID=?",[bName,bPub,bDate,bAuthor,bMem,bID]);
        ans+="0</div>成功</body></html>";
    }
    return ans;
}
exports.changereader=function*(req,res){
    let ans="<html><body><div id='result' style='display:none'>";
    let body=req.body;
    let rID=body.rID;
    let rName=body.rName;
    let rSex=body.rSex;
    let rDept=body.rDept;
    let rGrade=body.rGrade;
    let number=yield db.execSQL("select count(*) as number from Myreader where rID=?",[rID]);
   
    if(!rID||!rName||!rSex||!rDept||!rGrade){
        ans+="2</div>提交的参数有误：有信息为空</body></html>";
    }
    else if(number[0].number==0){
        ans+="1</div>该证号不存在</body></html>";
    }
	else if(rID.length>8){
        ans+="2</div>提交的参数有误：ID超过8字符</body></html>";
    }
    else if(rName.length>10){
        ans+="2</div>提交的参数有误：姓名超过10字符</body></html>";
    }
    else if(rSex!='男'&&rSex!='女'){
        ans+="2</div>提交的参数有误：性别为男或女</body></html>";
    }
    else if(rDept.length>10){    
        ans+="2</div>提交的参数有误：系名超过10字符</body></html>";
    }
    else if(parseInt(rGrade)!=rGrade||rGrade<=0){   
        ans+="2</div>提交的参数有误：年级不为正整数</body></html>";
    }
    else{
    yield db.execSQL("update Myreader set rName=?,rSex=?,rDept=?,rGrade=? where rID=?",[rName,rSex,rDept,rGrade,rID]);
    ans+="0</div>成功</body></html>";
    }

    return ans;

}


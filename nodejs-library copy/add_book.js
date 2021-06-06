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

exports.addbook=function*(req,res){

    let ans="<html><body><div id='result'style='display:none'>";
    let body=req.body;
    let bID=body.bID;
    let bName=body.bName;
    let bPub=body.bPub;
    let bDate=body.bDate;
    let bAuthor=body.bAuthor;
    let bMem=body.bMem;
    let bCnt=body.bCnt;
    let number=yield db.execSQL("select count(*) as number from Mybook where bID=?",[bID]);
    
    if(!bID||!bName||!bPub||!bDate||!bAuthor||!bMem||!bCnt){
        ans+="2</div>提交的参数有误：某些信息为空！</body></html>";
    }
    else if(bID.length>30){
        ans+="2</div>提交的参数有误：bID超过30个字符</body></html>";
    }
    else if(number[0].number>0){
        ans+="1</div>该书已经存在</body></html>";
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
    else if(parseInt(bCnt,10)!=bCnt){
        ans+="2</div>提交的参数有误：bcnt应该为整数</body></html>";
    }
    else if(bCnt<=0){
        ans+="2</div>提交的参数有误：bcnt应大于0</body></html>";
    }
    else if(!isDatePart(bDate)){
        ans+="2</div>提交的参数有误：日期格式不对</body></html>";
    }
    else {
    yield db.execSQL("INSERT INTO Mybook(bID,bName,bPub,bDate,bAuthor,bMem,bCnt) VALUES(?,?,?,?,?,?,?)",[bID,bName,bPub,bDate,bAuthor,bMem,bCnt]);
    ans+="0</div>成功</body></html>";
    }
    return ans;
}
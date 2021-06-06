const { execSQL } = require("./coSqlite3");
const db=require("./coSqlite3");
exports.addnumber=function*(req,res){
    let ans="<html><body><div id='result' style='display:none'>";
    let body=req.body;
    let bID=body.bID;
    let cnt=body.bCnt;

    if(!bID||!cnt){
        ans+="2</div>提交的参数有误：书号和数量均不能为空</body></html>";
    }
    else if(parseInt(cnt)!=cnt){
        ans+="2</div>提交的参数有误：数量应为整数</body></html>";
    }
    else if(bID.length>30){
        ans+="2</div>提交的参数有误：书号不能超过30字符</body></html>";
    }
    else if(cnt<=0){    
        ans+="2</div>提交的参数有误：数量不能为负数</body></html>";
    }
    else{

    let rows=yield db.execSQL("select count(*) as res from Mybook where bID=?",[bID]);

    if(rows[0].res==0){
        ans+="1</div>该书不存在</body></html>";
    }
    else{
        yield db.execSQL("update Mybook set bCnt=bCnt+? where bID=?",[cnt,bID]);
        ans+="0</div>成功</body></html>";
    }
}
    return ans;
}
exports.decnumber=function*(req,res){
    let ans="<html><body><div id='result' style='display:none'>";
    let body=req.body;
    let bID=body.bID;
    let cnt=body.bCnt;

    if(!bID||!cnt){
        ans+="2</div>提交的参数有误：书号和数量均不能为空</body></html>";
    }
    else if(parseInt(cnt)!=cnt){
        ans+="2</div>提交的参数有误：数量应为整数</body></html>";
    }
    else if(bID.length>30){
        ans+="2</div>提交的参数有误：书号不能超过30字符</body></html>";
    }
    else if(cnt<=0){    
        ans+="2</div>提交的参数有误：数量不能为负数</body></html>";
    }
    else{
        let rows=yield db.execSQL("select count(*) as res from Mybook where bID=?",[bID]);
        if(rows[0].res==0){
            ans+="1</div>该书不存在</body></html>";
        }
        else{
        let rows2=yield db.execSQL("select bCnt from Mybook where bID=?",[bID]);
        if(rows2[0].bCnt<cnt){
            ans+="2</div>减少的数量大于该书目前在库数量</body></html>";
        }   
        else if(rows2[0].bCnt>cnt){
            yield db.execSQL("update Mybook set bCnt=bCnt-? where bID=?",[cnt,bID]);
            ans+="0</div>成功</body></html>";
        }
        else if(rows2[0].bCnt==cnt){
            let row3=yield db.execSQL("select count(*) as lent from Myrecord where bID=?",[bID]);
            if(row3[0].lent==0){
                yield db.execSQL("delete from Mybook where bID=?",[bID]);
                ans+="0</div>成功</body></html>";
            }
            else{
                yield db.execSQL("update Mybook set bCnt=0 where bID=?",[bID]);
                ans+="0</div>成功</body></html>";
            }
        }
    }
}
    return ans; 
}

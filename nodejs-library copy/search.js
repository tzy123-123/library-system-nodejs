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
exports.searchbook=function*(req,res){
    let ans="<html><head><META HTTP-EQUIV=\"Content-Type\" Content=\"text-html;charset=utf-8\"></head><body><table border=1 id='result'>";
    let body=req.body;
    let bID=body.bID;
    let bName=body.bName;
    let bPub=body.bPub;
    let bDate_begin=body.bDate0;
    let bDate_end=body.bDate1;
    let bAuthor=body.bAuthor;
    let bMem=body.bMem;
    let sql="select bID,bName,bPub,bDate,bAuthor,bMem,bCnt from Mybook where true";

	if(bID)
		sql+=" and bID like '%"+bID.replace(/\x27/g,"''")+"%'";
	if(bName)
		sql+=" and bName like '%"+bName.replace(/\x27/g,"''")+"%'";
    if(bPub)
		sql+=" and bPub like '%"+bPub.replace(/\x27/g,"''")+"%'";
    if(bAuthor)
		sql+=" and bAuthor like '%"+bAuthor.replace(/\x27/g,"''")+"%'";
    if(bMem)
		sql+=" and bMem like '%"+bMem.replace(/\x27/g,"''")+"%'";
    if(bDate_begin){
        let isvalid=isDatePart(bDate_begin);
        if(isvalid)
        sql+=" and bDate >= "+"date('"+bDate_begin+"')";
        else 
        sql+=" and false ";
    }
    if(bDate_end){
        let isvalid2=isDatePart(bDate_end);
        if(isvalid2)
        sql+=" and bDate <= "+"date('"+bDate_end+"')";
        else
        sql+=" and false";
    }

    let rows=yield db.execSQL(sql);

    if(!rows){
        ans+="</table></body></html>";
    }
    else {
    for(let one_row of rows){
        let row=yield db.execSQL("select count(*) as number from Myrecord where bID=?",[one_row.bID]);
        let sum=parseInt(row[0].number)+parseInt(one_row.bCnt);
		ans+='<tr><td>'+one_row.bID+'</td><td>'+one_row.bName+'</td><td>'+sum+'</td><td>'+one_row.bCnt+'</td><td>'+one_row.bPub+'</td><td>'+one_row.bDate+'</td><td>'+one_row.bAuthor+'</td><td>'+one_row.bMem+'</td></tr>';
    }
    ans+="</table></body></html>";
    }
    return ans;
}
exports.searchreader=function*(req,res){

    let ans="<html><head><META HTTP-EQUIV=\"Content-Type\" Content=\"text-html;charset=utf-8\"></head><body><table border=1 id='result'>";
    let body=req.body;
    let rID=body.rID;
    let rName=body.rName;
    let rSex=body.rSex;
    let rDept=body.rDept;
    let min=body.rGrade0;
    let max=body.rGrade1;
    let sql="select rID,rName,rSex,rDept,rGrade from Myreader where true";
    if(rID)
		sql+=" and rID like '%"+rID.replace(/\x27/g,"''")+"%'";
	if(rName)
		sql+=" and rName like '%"+rName.replace(/\x27/g,"''")+"%'";
    if(rSex){
        if(rSex!="男"||rSex!="女")
		sql+=" and rSex like '%"+rSex.replace(/\x27/g,"''")+"%'";
        else
        sql+=" and false";
    }
    if(rDept)
		sql+=" and rDept like '%"+rDept.replace(/\x27/g,"''")+"%'";
    if(min){
        if(parseInt(min)==min&&min>0)
		sql+=" and rGrade >="+min;
        else
        sql+=" and false";
    }
    if(max){
        if(parseInt(max)==max&&max>0)
        sql+=" and rGrade <="+max;
        else
        sql+=" and false";
    }
    let rows=yield db.execSQL(sql);
    if(!rows){
        ans+="</table></body></html>";
    }
    else{
    for(let row of rows){
		ans+='<tr><td>'+row.rID+'</td><td>'+row.rName+'</td><td>'+row.rSex+'</td><td>'+row.rDept+'</td><td>'+row.rGrade+'</td></tr>';
    }
    ans+="</table></body></html>";
}

        return ans;
}
exports.searchreturn=function*(req,res){

    let ans="<html><head><META HTTP-EQUIV=\"Content-Type\" Content=\"text-html;charset=utf-8\"></head><body><table border=1 id='result'>";
    let time=Math.round(new Date().getTime());
    let now=get_time(time);
    let body=req.body;
    let rID=body.rID;
    let iflate='否';
    let record=yield db.execSQL("select Myrecord.bID,bName,timeborrow,timereturn from Myrecord natural join Mybook where rID=?",[rID]);
    if(!record){
        ans+="</table></body></html>";
    }
    else{
        for(let row of record){
        if(now>row.timereturn){
            overdue='是';
        }
        ans+='<tr><td>'+row.bID+'</td><td>'+row.bName+'</td><td>'+row.timeborrow+'</td><td>'+row.timereturn+'</td><td>'+iflate+'</td></tr>';
    }
    ans+="</table></body></html>";
}
    return ans;
}
exports.searchlate=function*(req,res){
    
    let ans="<html><head><META HTTP-EQUIV=\"Content-Type\" Content=\"text-html;charset=utf-8\"></head><body><table border=1 id='result'>";
    let t=Math.round(new Date().getTime());
    let time=get_time(t);
    let reader=yield db.execSQL("select rID,rName,rSex,rDept,rGrade from Myreader where rID in (select rID from Myrecord where timereturn < ?)",[time]);
    if(!reader){
        ans+="</table></body></html>";
    }
    else{
        for(let row of reader){
        ans+='<tr><td>'+row.rID+'</td><td>'+row.rName+'</td><td>'+row.rSex+'</td><td>'+row.rDept+'</td><td>'+row.rGrade+'</td></tr>';
        }
        ans+="</table></body></html>";
    }
    return ans;

}

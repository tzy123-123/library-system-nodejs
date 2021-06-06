const db=require("./coSqlite3");
exports.create=function*(req,res)
{
    let ans="<html><body><div id='result' style='display:none'>";

    try{
        yield db.execSQL("create table Mybook(bMem varchar(30) not null,bID varchar(30) primary key,bName varchar(30) not null,bPub varchar(30) not null,bDate date not null,bAuthor varchar(20) not null,bCnt integer not null check(bCnt>0))");
        
        yield db.execSQL("create table Myreader(rID varchar(8) primary key,rName varchar(10) not null,rSex varchar(8) not null check(rSex in('男','女')),rDept varchar(10) not null,rGrade integer not null)");

        yield db.execSQL("create table Myrecord(bID varchar(30),rID varchar(8),timeborrow date not null,timereturn date not null,primary key(bID,rID),foreign key(bID) references Mybook(bID),foreign key(rID) references Myreader(rID))");

    }
    catch(exception){
        ans+="1</div>数据库都建错，太失败了</body></html>";
        return ans;
    }

    return  ans+"0</div>成功</body></html>";
} 

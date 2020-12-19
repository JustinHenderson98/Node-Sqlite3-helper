exports.dbQuery = class {
    constructor(query,params){
      this.query = query;
      this.params = params;
      this.result = undefined;
      this.err = undefined;
    }

    setResult(result){
      this.result = result;
    }
    setErr(err){
      this.err = err;
    }
}
  
exports.sqlite3dbAll = function(db,qList,cb){
sqlite3dbAllrec(db,qList,cb,{});
}

sqlite3dbAllrec = function(DB,qList,cb, cbList){
  if(!(qList.length)){
    cb(cbList);
    return;
  }

  q = qList.pop();
  var key = Object.keys(q)[0];
  var value = q[key];
  DB.all(value.query ,value.params ,function (err,rows){
    value.setErr(err);
    value.setResult(rows);
    cbList[key] = value;
  sqlite3dbAllrec(DB,qList,cb,cbList);
  });
}

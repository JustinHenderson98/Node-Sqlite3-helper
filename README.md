#Node-Sqlite3-helper
---
This little piece of code can be used to flatten and simplify the pyramid of doom required to access a sqlite database in Node.js.
This has only been written with the db.all() function in mind as that is often what would be used in a SQL select queury.

#Motivation
---
I wrote this code because sqlite3 in Node.js only supports the use of callbacks for async calls. This is fine until multiple quesries
to the database are required for a single api call and each subsequent query gets placed in the callback of the previous query.
This is terrible design and pushed me away from Javascript for many months.

#Code Example
---
```Javascript
var {dbQuery, sqlite3dbAll} = require('./Sqlite_Helper');

router.get('/api', async function(req, res, next) {
//...
//...
//...
	var db = open_db();
	var dbQueryList = [];

	var countQry = 'SELECT Count(*) from  ...';
	var countParams = [...,...];
	var queury = 'SELECT * from ...';
	var qParams = [...,...,...];
	dbQueryList.push({"count": new dbQuery(countQry,countParams)});
	dbQueryList.push({"results": new dbQuery( query, qParams)});
	
	
	
	sqlite3dbAll(db,dbQueryList,function(resObj){
      var errList = [];

      for (e in resObj){
        errList.push(e.err);
      }
      errList = errList.filter(err => err != null);
      if (errList.length >0){
        for (err of errList){
          console.log(err);
        }
        res.status(500);
        return;
      }
    res.json({
      "message":"success",
      "data":
      {
        "rowCount":resObj['count'].result[0]["Count(*)"],
        "results": resObj['results'].result,
        
      }
    });
    close_db(db);
  });

});
```

#How to use?
---
1. Import the file: ```var {dbQuery, sqlite3dbAll} = require('./Sqlite_Helper');```
2. Create your SQL queries as prepared statements.
3. Create a parameter list for each prepared statement. ```var qParams = [...,...,...];```
4. Push a new query object onto the query list.```dbQueryList.push({"name": new dbQuery(query,params)});```
5. Process the results and errors. 
```Javascript
 sqlite3dbAll(db,dbQueryList,function(resObj){
      var errList = [];

      for (e in resObj){
        errList.push(e.err);
      }
      errList = errList.filter(err => err != null);
      if (errList.length >0){
        for (err of errList){
          console.log(err);
        }
        res.status(500);
        return;
      }
    res.json({
      "message":"success",
      "data":
      {
        "rowCount":resObj['count'].result[0]["Count(*)"],
        "results": resObj['results'].result,
        
      }
    });
    close_db(db);
  });


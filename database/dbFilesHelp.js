const { boolean } = require("optimist");
const { pgp, db } = require("./db");
//resultInfo.js
const { resultInfo, fileInfo, getTime } = require("./utils");

const dbFilesHelp = {
  //查询文件列表
  getfiles: (req, res) => {
    const index = req.params.index;
    // new URL
    console.log("getfiles query index", index);
    db.any("select * from files where dirindex = $1 ORDER BY id ASC", [index])
      .then((data) => {
        // console.log('DATA:', data); // print data;
        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //查询文件夹信息
  getDirs: (req, res) => {
    const index = req.params.index;
    // new URL
    console.log("getDirs query index", index);
    db.any("select * from directorys where index = $1 ORDER BY id ASC", [index])
      .then((data) => {
        // console.log('DATA:', data); // print data;
        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //查询属于index下的文件夹列表
  //排除删除的文件夹
  getDirsOfParentIndex: (req, res) => {
    const parentIndex = req.params.parentIndex;
    // new URL
    console.log("getDirsOfParentIndex ", parentIndex);
    db.any(
      "select * from directorys where parentindex = $1  and isdel = false ORDER BY id ASC",
      [parentIndex]
    )
      .then((data) => {
        // console.log('DATA:', data); // print data;
        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  // 'SELECT  * FROM ( SELECT  parentindex, name, permissions,haspermissions,null as upuser, null as size, null as path,null as mimetype, null as md5,'dir' as type FROM directorys where parentindex  =1
  //   union
  // SELECT  dirindex as parentindex,  originalname as name, null as permissions, null as haspermissions ,upuser, size, path, mimetype,md5,'file' as type  FROM files where dirindex  = 1)
  //  AS foo ORDER BY type'

  //查询属于index下的文件夹和文件列表
  //排除删除的文件，文件夹
  getFilesAndDirsOfParentIndex: (req, res) => {
    const parentIndex = req.params.parentIndex;
    // new URL

    var typeDir = "dir";
    var typefile = "file";

    console.log("getFilesAndDirsOfParentIndex", parentIndex);

    //pgadmin 语句
    // 		SELECT * FROM(
    // 			SELECT id, index, parentindex, name, null as filename,permissions, haspermissions, null as upuser, null as uptime,null as size, null as pathyear, null as mimetype, null as md5, 'dir' as type FROM directorys where parentindex = 1 and isdel = false
    //         union
    //           SELECT id, dirindex as index, dirindex as parentindex ,originalname as name, filename,null as permissions, null as haspermissions, upuser,uptime, size, pathyear, mimetype, md5, 'file' as type  FROM files where dirindex = 1 and isdel = false
    // 		)
    //         AS foo
    //         ORDER BY type, id

    db.any(
      "SELECT  * FROM ( SELECT id, index,parentindex, name, null as filename, permissions,haspermissions,null as upuser, null as uptime,null as size, null as pathyear,null as mimetype, null as md5, $1 as type FROM directorys where parentindex  =$3 and isdel = false union SELECT id, dirindex as index, dirindex as parentindex, originalname as name,filename, null as permissions, null as haspermissions ,upuser,uptime, size, pathyear, mimetype,md5, $2 as type  FROM files where dirindex  = $3 and isdel = false) AS foo ORDER BY type , id",
      [typeDir, typefile, parentIndex]
    )

      .then((data) => {
        // console.log('DATA:', data); // print data;
        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //增加文件夹
  addDir: (req, res) => {
    console.log("addDir req.body", req.body);
    const { name, permissions, parentindex, haspermissions } = req.body;
    console.log("addDir", name, permissions, parentindex, haspermissions); //必须配置中间件
    console.log("typeof haspermissions", typeof haspermissions, haspermissions);

    if (!name) {
      console.log("name empty", name);
      res.send(resultInfo(false, "name is empty", "创建时出现错误"));
      return;
    }

    db.task(async (t) => {
      // `t` and `this` here are the same;
      // this.ctx = transaction config + state context;

      //获取最大文件夹index
      var maxIndex = await t.one("SELECT MAX(index) FROM directorys");
      console.log("addDir max index", maxIndex.max);

      var dirId = 0;
      var newDirId = 0;
      var newDirName = name;
      //查询文件夹下的同名文件夹
      do {
        dirId = await t.oneOrNone(
          "SELECT id, name, parentindex FROM directorys WHERE name = $1 AND parentindex = $2  AND isdel = false",
          [name, parentindex],
          (user) => {
            return user ? user.id : 0;
          }
        );
        //文件夹已存在
        if (dirId) {
          console.log("/addDir ", " 文件夹已存在");
          //修改新文件名 加(1)
          // console.log("hasSomeNameFile", hasSomeNameFile);
          newDirName = newDirName + "(1)";
        }
      } while (dirId);

      console.log("/addDir ", "   新增...");
      // maxIndex++;
      console.log("addDir max indesdfsdfx ++", maxIndex.max + 1);
      newDirId = await t.one(
        "INSERT INTO directorys(index,name,permissions,parentindex,haspermissions,isdel) VALUES($1,$2,$3,$4,$5,$6) RETURNING id",
        [
          maxIndex.max + 1,
          newDirName,
          permissions,
          parentindex,
          haspermissions,
          false,
        ]
      );
      console.log("/addDir  Id ", newDirId);

      return { dirId, newDirId };
    })
      .then((data) => {
        // res.send(resultInfo(false, data, "max index"))
        const { dirId, newDirId } = data;
        if (dirId) {
          res.send(resultInfo(false, dirId, "文件夹已存在"));
        } else if (dirId == 0 && newDirId) {
          res.send(resultInfo(true, newDirId, "创建成功"));
        } else res.send(resultInfo(false, error, "创建时出现错误"));
      })
      .catch((error) => {
        // error
        console.log("catch error", error);
        res.send(resultInfo(false, error, "未知错误"));
      });
  },

  //const ids = [1, 2, 3];
  //await db.any('SELECT * FROM table WHERE id IN ($1:list)', [ids])
  //=> SELECT * FROM table WHERE id IN (1,2,3)
  //批量删除文件

  delFiles: (req, res) => {
    console.log("delFiles req.body", req.body);
    var ids = req.body;
    db.any("UPDATE files SET isdel = true WHERE id IN ($1:list)", [ids])

      .then((data) => {
        // console.log('DATA:', data); // print data;
        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //批量删除文件夹
  delDirs: (req, res) => {
    console.log("delDirs req.body", req.body);
    var indexs = req.body;
    db.any("UPDATE directorys SET isdel = true WHERE index IN ($1:list)", [
      indexs,
    ])
      .then((data) => {
        // console.log('DATA:', data); // print data;
        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //批量删除文件,文件夹
  delFilesAndDirs: (req, res) => {
    // console.log("delFilesAndDirs req.body", req.body);
    // var files = req.body.files;
    // var dirs = req.body.dirs;
    const { files, dirs, delusername, deltime } = req.body;
    // db.any('UPDATE files SET originalname=$1 isdel = true WHERE id = $2', [files[i].originalname, files[i].id])
    // console.log("delFilesAndDirs req.body.files",  req.body.files);
    console.log("delFilesAndDirs files", files[0]);
    console.log("delFilesAndDirs dirs", dirs[0]);

    console.log("delFilesAndDirs files.length", files.length);
    console.log("delFilesAndDirs dirs.length", dirs.length);

    db.tx((t) => {
      const queries = [];
      // queries.push("aaaaaa")
      for (let i = 0; i < files.length; i++) {
        queries.push(
          t.any(
            "UPDATE files SET originalname = $1 ,delusername =$2,deltime = $3 ,isdel = true WHERE id = $4",
            [files[i].name, delusername, deltime, files[i].id]
          )
        );
        console.log("queries push files ", [files[i].name, files[i].id]);
      }
      for (let i = 0; i < dirs.length; i++) {
        queries.push(
          t.any(
            "UPDATE directorys SET name = $1 , delusername =$2,deltime = $3, isdel = true WHERE index = $4",
            [dirs[i].name, delusername, deltime, dirs[i].index]
          )
        );
        console.log("queries push dirs", [dirs[i].name, dirs[i].index]);
      }
      console.log("delFilesAndDirs queries", queries);
      // returning a promise that determines a successful transaction:
      return t.batch(queries); // all of the queries are to be resolved;
    })
      .then((data) => {
        // success, COMMIT was executed
        res.send(resultInfo(true, data, "success"));
      })
      .catch((error) => {
        // failure, ROLLBACK was executed
        res.send(resultInfo(false, error, "error"));
      });
  },

  //获取删除的文件,文件夹
  getAllDelFilesAndDirs: (req, res) => {
    // new URL
    console.log("getAllDelFilesAndDirs query", req.query);
    var typeDir = "dir";
    var typefile = "file";

    //pgadmin 语句
    // 		SELECT * FROM(
    // 			SELECT id, index, parentindex, name, null as filename,permissions, haspermissions, null as upuser, null as uptime,null as size, null as pathyear, null as mimetype, null as md5, delusername, deltime, 'dir' as type FROM directorys where     isdel = true
    //         union
    //           SELECT id, dirindex as index, dirindex as parentindex ,originalname as name, filename,null as permissions, null as haspermissions, upuser,uptime, size, pathyear, mimetype, md5, delusername, deltime, 'file' as type  FROM files where   isdel = true
    // 		)
    //         AS foo
    //         ORDER BY deltime

    db.any(
      "SELECT  * FROM ( SELECT id, index,parentindex, name, null as filename, permissions,haspermissions,null as upuser, null as uptime,null as size, null as pathyear,null as mimetype, null as md5,  delusername, deltime, $1 as type FROM directorys where   isdel = true union SELECT id, dirindex as index, dirindex as parentindex, originalname as name,filename, null as permissions, null as haspermissions ,upuser,uptime, size, pathyear, mimetype,md5,  delusername, deltime,  $2 as type  FROM files where   isdel = true) AS foo ORDER BY deltime",
      [typeDir, typefile]
    )

      .then((data) => {
        // console.log('DATA:', data); // print data;
        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //恢复删除的文件
  restoreFiles: (req, res) => {
    const id = req.params.id;

    db.any("UPDATE files SET isdel = false WHERE id = $1", [id])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //恢复删除的文件夹
  restoreDirs: (req, res) => {
    const index = req.params.index;
    db.any("UPDATE directorys SET isdel = false WHERE index = $1", [index])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //重命名文件
  reNameFile: (req, res) => {
    console.log("reNameFile body", req.body);
    const { filename, id } = req.body;
    db.any("UPDATE files SET originalname =  $1 WHERE id = $2", [filename, id])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //重命名文件夹
  reNameDir: (req, res) => {
    console.log("reNameDir body", req.body);

    const { dirname, index } = req.body;
    db.any("UPDATE directorys SET name =  $1 WHERE index = $2", [
      dirname,
      index,
    ])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },

  //更新文件夹权限
  UpDateDirPermissions: (req, res) => {
    // console.log("UpDateDirPermissions body", req.body);
    const { index, permissions } = req.body;

    db.any("UPDATE directorys SET permissions =  $1 WHERE index = $2", [
      permissions,
      index,
    ])
      .then((data) => {
        // console.log('DATA:', resultInfo(true, data, "success")); // print data;

        res.send(resultInfo(true, data, "success"));
        // return (resultInfo(true, data, "success"))
      })
      .catch((error) => {
        // console.log('ERROR:', error); // print the error;
        res.send(resultInfo(false, error, "error"));
        // return (resultInfo(false, error, "error"))
      });
  },
};

module.exports = dbFilesHelp;

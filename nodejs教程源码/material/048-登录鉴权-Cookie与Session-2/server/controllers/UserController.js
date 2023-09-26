const UserService = require("../services/UserService")

/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const UserController = {
    addUser:async (req,res)=>{
        console.log(req.body)
        //插入数据库
        // 1. 创建一个模型(user,限制filed类型), 一一对应数据库的集合(users)
        // user.create user.find user.delete user.update
        const {username,password,age} = req.body

        await UserService.addUser(username,password,age)
        res.send({
            ok:1
          })
      },

      updateUser:async (req,res)=>{
        console.log(req.body,req.params.myid)
        const {username,age,password} = req.body
        await UserService.updateUser(req.params.myid,username,age,password)
        res.send({
            ok:1
          })
        
      },
      deleteUser:async (req,res)=>{

        await UserService.deleteUser(req.params.id)

        res.send({
            ok:1
          })
      },
      getUser:async (req,res)=>{
        console.log(req.query)
        const {page,limit} = req.query
        const data = await UserService.getUser(page,limit)

        res.send(data)
      },

      login:async(req,res)=>{
          const {username,password} = req.body
          const data = await UserService.login(username,password)
          if(data.length===0){
              res.send({
                  ok:0
              })
          }else{
              //设置session {}  
              req.session.user = data[0] //设置session对象， 
              //默认存在内存中。
              res.send({
                  ok:1
              })
          }
      }
}

module.exports = UserController
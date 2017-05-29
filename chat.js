var io = require('socket.io')();
var _ = require('underscore');


var userList = [];
var msgList=[];

//var socketList = [];
io.on('connection',function(socket){
	  socket.on('login',function(userdata,logininfo){
         // console.log(userdata);
         userdata.id=socket.id;
         //Add user
         userList.push(userdata);
         // console.log(userList);
         io.emit('login',userList,logininfo);
	  });
      socket.on('chat',function(Message){
          for(var i=0;i<userList.length;i++){
		  	    
	            if(userList[i].id==socket.id){
                   var index=i;
                   console.log(i);
                   var msgData={};
                   msgData.name=userList[index].name;
                   msgData.id=userList[index].id;
                   msgData.img=userList[index].img;
                   msgData.loginTime=userList[index].loginTime;
                   msgData.Msg=Message;
                   msgData.self=true;
                   // console.log(msgData);
                  msgList.push(msgData);
                  
	            }
              
		  }
          io.emit('chat',msgList,socket.id);
      });




	  socket.on('disconnect',function(){
	  // console.log('a user disconnect '+socket.id);
		  for(var i=0;i<userList.length;i++){
		  	       
	            if(userList[i].id==socket.id){
                
                   var outinfo="<script>$.scojs_message('用户"+userList[i].name+"下线啦', $.scojs_message.TYPE_ERROR)</script>";
                   userList.splice(i,1);
                   
                   
                   io.emit('disconnect',userList,outinfo);
	            }
		  }

	  });	
	
});
exports.listen = function(_server){
	io.listen(_server);
};
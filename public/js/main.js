$(document).ready(function(){
   //document loaded 
    var socket = io();
        //getTime
        function getTime(){
          var date=new Date();
          var year=date.getFullYear();
          var month=rightTime((date.getMonth()+1));
          var day=rightTime(date.getDate());
          var hour=rightTime(date.getHours());
          var minutes=rightTime(date.getMinutes());
          var seconds=rightTime(date.getSeconds());
            //时间格式化
          function rightTime(timers){
               
               // timers>10 ? return timers : return  '0'+timers;
               if(timers>10){
                 return timers;
               }else{
                return '0'+timers;
               }
        }
          var nowTime=year+"年"+month+"月"+day+"日 &nbsp;"+hour+":"+minutes+":"+seconds;
          $('#times').html(nowTime);
          
        }
      
     setInterval(getTime,1000);
 //input your nickName
$('#myModal').modal({
		//backdrop: 'static',
		keyboard: false
		});
		Messenger.options = {
			extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
			theme: 'flat'
		};

		$('.popover-dismiss').popover('show');
		
		//login
		$('#btn-setName').click(function(){
			var name = $('#username').val();

			if(checkUser(name)){
				$('#username').val('');
				alert('Nickname already exists or can not be empty!');
			}else{
				var imgList = ["/img/1.jpg","/img/2.jpg","/img/3.jpg","/img/4.jpg","/img/5.jpg"];
				var randomNum = Math.floor(Math.random()*5);
				//random user
				var img = imgList[randomNum];
				//package user
				var dataObj = {
					name:name,
					img:img,
					loginTime:new Date()
				};

				//send user info to server
				var loginInfoData="<script>$.scojs_message('用户"+name+"上线了', $.scojs_message.TYPE_OK)</script>";
				socket.emit('login',dataObj,loginInfoData);
				socket.on('login',function(userList,loginInfo){
					$('body').append(loginInfo);
					//adduser
					var userItem='';
					$('#spanuser').html('欢迎您！'+name);
                    // console.log(userList);
                    for(var i=0;i<userList.length;i++){
                         userItem=userItem+"<li style='display: list-item;'><a id="+userList[i].id+" href='javascript:void(0);'><img src="+userList[i].img+" class='img-thumbnail'><span>"+userList[i].name+"</span></a></li>";
                         $('.msg-list-body ul').html(userItem);
                    }
                    // 

				});

				//usesr idsconnect
				socket.on('disconnect',function(userList,outinfo){
					var userItem='';
					$('body').append(outinfo);
                   for(var i=0;i<userList.length;i++){
                         userItem=userItem+"<li style='display: list-item;'><a id="+userList[i].id+" href='javascript:void(0);'><img src="+userList[i].img+" class='img-thumbnail'><span>"+userList[i].name+"</span></a></li>";
                         $('.msg-list-body ul').html(userItem);
                    }
				});

				//hide login modal
				$('#myModal').modal('hide');
				$('#username').val('');
				//$.scojs_message('用户'+name+'上线了', $.scojs_message.TYPE_OK)
				//user login info
				
				
				$('#msg').focus();
			}
		});
        //send message
       

             function SendMsg(){
             	var imgStr='';
        	  //check FileReader       	 
              if(typeof FileReader == "undefined"){
                    alert("I think your browser is not support FileReader,please update or change your browser!");
                }else{
              
					var file = document.querySelector('input[type=file]').files[0];
					var reader = new FileReader();
					
					reader.onloadend = function () {
							var data = reader.result;
							 imgStr="<img src="+data+"  alt=''/>";
							 //load img end
							 //load text begin
                                var MsgItem=$('#msg').val()+imgStr;
					           if(MsgItem==''||MsgItem==null){
					             alert('plase edit your message that you want to send '+MsgItem);
					           }else{
					            socket.emit('chat',MsgItem);
					            socket.on('chat',function(msgList,socketId){
					                // console.log(msgList);
					                // console.log(socketId);
					                //show messages
					                var html='';
					                for(var i=0;i<msgList.length;i++){
					                    if(msgList[i].id==socketId){
					                      html=html+"<div class='message-receive'><div class='message-info'><div class='user-info'><img title="+msgList[i].name+" src="+msgList[i].img+" class='user-avatar img-thumbnail'></div><div class='message-content-box'><div class='arrow'></div><div class='message-content'>"+msgList[i].Msg+"</div></div></div></div>";
					                    }else{
					                     html=html+"<div class='message-reply'><div class='message-info'><div class='user-info'><img title="+msgList[i].name+" src="+msgList[i].img+" class='user-avatar img-thumbnail'></div><div class='message-content-box'><div class='arrow'></div><div class='message-content'>"+msgList[i].Msg+"</div></div></div></div>";	
					                    }
					                    $('.msg-content').html(html);
					                }
					            });
					           }

					           //load text
							 
					}
					if (file) {
					reader.readAsDataURL(file);
					} else {
					     var MsgItem=$('#msg').val();
					           if(MsgItem==''||MsgItem==null){
					             alert('plase edit your message that you want to send '+MsgItem);
					           }else{
					            socket.emit('chat',MsgItem);
					            socket.on('chat',function(msgList,socketId){
					                // console.log(msgList);
					                // console.log(socketId);
					                //show messages
					                var html='';
					                for(var i=0;i<msgList.length;i++){
					                    if(msgList[i].id==socketId){
					                      html=html+"<div class='message-receive'><div class='message-info'><div class='user-info'><img title="+msgList[i].name+" src="+msgList[i].img+" class='user-avatar img-thumbnail'></div><div class='message-content-box'><div class='arrow'></div><div class='message-content'>"+msgList[i].Msg+"</div></div></div></div>";
					                    }else{
					                     html=html+"<div class='message-reply'><div class='message-info'><div class='user-info'><img title="+msgList[i].name+" src="+msgList[i].img+" class='user-avatar img-thumbnail'></div><div class='message-content-box'><div class='arrow'></div><div class='message-content'>"+msgList[i].Msg+"</div></div></div></div>";	
					                    }
					                    $('.msg-content').html(html);
					                }
					            });
					           }
					}	

                }
         
            }

        



        
      
        $('#sendMsg').on('click',function(){
           
           SendMsg();
           $("input[type='file']").val('');
           $("input[type='text']").val('');

        });

          window.onkeydown=function(event){
           
           if(event.keyCode==13){
               SendMsg();
           }
        };
        //check nickName
        function checkUser(name){
			var haveName = false;
			$(".user-content").children('ul').children('li').each(function(){

				if(name == $(this).find('span').text()){
					haveName = true;
				}
			});
			return haveName;
		}
		//
});

define(function (require, exports, module) {
		var $ = require('zepto') //他其实和jquery是一样的
		,Swiper = require('swiper') //轮播插件
		,ua = navigator.userAgent.toLowerCase() //ua
		,isWeixin = ua.indexOf('micromessenger') != -1 //如果是微信浏览器
		,hhref = location.href //整个href值
		,crr=hhref.split("#")[1] //打印机编号
		,wx = require('wx') //需求到微信sdk
		,constant = require("constant") //需求到接口文件
		,UrlJoint1 = constant.EInvoicePrint_PrintApi_15_1//url拼
		,UrlJoint2 = constant.EInvoicePrint_WeiXin_12_1
		,UrlJoint3 = constant.EInvoicePrint_Account_14_1
		,UrlJoint4 = constant.EInvoicePrint_EMail_13_1
		,hash=window.location.hash //hash值
		,cubicBezier = "cubic-bezier(0,.09,0,1)" //贝塞尔动画曲线
		,cubicBezier2 = "cubic-bezier(0,1.37,.44,.95)"
		,cubicBezier3 = "cubic-bezier(0,.65,.12,1.66)"
		,sasb = [] //缓存用
		,Name //用于发票名字
		,SetSpace = sessionStorage.getItem('allSpace') //所有发票
		,lockersval //抽屉控件的变量
		,regAccount = $("#inp1")//这往下是注册框
		,regPassword = $("#inp2")
		,regPassword2 = $("#inp3")
		,regVscode = $("#inp4")
		,accSwitch = false //注册账号通行许可
		,pwdSwitch = false //注册密码通行许可
		,isURI = /(https?|ftp|file|http):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
		,uas = navigator.userAgent //也是ua的意思
		,ipad = uas.match(/(iPad).*OS\s([\d_]+)/) //如果是ipad
		,isIphone =!ipad && uas.match(/(iPhone\sOS)\s([\d_]+)/) //如果是iphone
		,isAndroid = uas.match(/(Android)\s+([\d.]+)/) //如果是安卓
		,isMobile = isIphone || isAndroid //是否手机
		,vscode //验证码
		,off = false //开关
		,printNumber = sessionStorage.getItem("printNumber")//打印机编号
		,space_list = []//发票列表
		,intervalLoading//loading的动画定时器
		,intervalLoading2
		,one = true
		,clarity = 0.8 //好像1不行了，太大了，缓存不够用！这里调节打印发票的压缩清晰度 （调整值为1~0.6 && 1是原图，大小大概400~600kb--最低值0.6  往下会出现大量毛刺）
		
		//自动登陆回跳链接
		,wxlocation = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4943f6480a79a436&redirect_uri=https://yun.dascomyun.cn/test/z-new-ide-h/html/index.html&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
		
		,credentials = true //前后端转换开关  true是给后端转 false 是给后端转
		
		
		window.URL = window.URL || window.webkitURL;
		//所有的全局变量

		
		
		
		
		
		
		
		
		
		
		
		
/* 
		快速定位搜索   双击 > 复制 > ctrl+f > 粘贴 > 搜索  || 定位完成
		
		
		bug在这里   （这是出现bug的mark）
		
		
		之后需要做切换开关的时候刷新界面，吧所有发票缓存清空
		
		url拼接
		pdf转换组件
		URL上传
		轮询打印机
		自动登录开始
		自动登录跳转链接
		渲染模板  渲染模块
		错误代码赋值
		上传限制
		转2进制文件
		缓存盒子
		打印按钮
		后端打印模块
		前端打印模块
		抽屉弹窗控件
		弹窗控件
		
		微信发票
		上传发票
		勾选发票
		发票上传事件
		短信打印
		本地上传事件
		票夹
		
		重新加载页面或者刷新时
		各种页面弹出的方法
		懒加载banner图片
		loading动画
		清除动画 loading动画
		遮罩层控件
		
		消息事件
		个人消息
		邮箱打印事件
		删除打印发票事件
		按钮开关与事件
		
		预览图片的大小
		点击阈值调节事件
		阈值界面设置
		
		登录状态
		修改密码开始
		登陆组件
		注册按钮
		修改密码按钮
		阅读隐私条款
*/











		//url拼接

	var constants = {
			OpenId: function () {
				return UrlJoint2+"/openid?code="
				//短信打印
			},
			urlstatus: function () {
				return UrlJoint1+"/v2.0/judge"
				//短信打印
			},
			urlPrint: function () {
				return UrlJoint1+'/v1.0/urlPrint/'
				//url 打印
			},
			uploadFile: function () {
				return UrlJoint1+'/v1.0/print/'
				//PDF打印
			},
			preview: function () {
				return UrlJoint1+'/v1.0/preview/'
				//预览打印
			},
			config: function () {
				return UrlJoint2+'/configSign'
				//获取 wx配置
			},
			ticketSign: function () {
				return UrlJoint2+'/cardSign'
				//拉取发票签名
			},
			fetchTicket: function () {
				return UrlJoint2+'/cardInfo'
				//拉取
			},
			wechat: function () {
				return UrlJoint3+'/v1.0/common/session/wechat'
				//微信
			},
			uploader: function () {
				return UrlJoint1+'/v2.0/uploadFile/'
				//上传发票
			},
			login: function () {
				return UrlJoint3+'/v1.0/common/session/'
				//登陆
			},
			register: function () {
				return UrlJoint3+'/v1.0/common/users'
				//注册
			},
			password: function () {
				return UrlJoint3+'/v1.0/common/userPwd/'
				//密码
			},
			checkPrinter: function () {
				return UrlJoint1+'/v1.0/CheckPrinter/'
				// [number] 验证设备号是否合法
			},
			space: function () {
				return UrlJoint1+'/v2.0/userInvoiceData'
				//用户发票
			},
			Delete: function () {
				return UrlJoint1+'/v2.0/deleteUserInvoice'
				//删除发票
			},
			notice: function () {
				return UrlJoint1+'/v2.0/getMessage'
				//消息
			},
			isRead: function () {
				return UrlJoint1+'/v2.0/setRead'
				//阅读接口
			},
			email: function () {
				return UrlJoint4+'/v1.0/mail/emailAccount/'
				//邮箱
			},
			userInfo: function () {
				return UrlJoint3+'/v1.0/common/user/'
				//阅读接口
			},
			UserOperationData: function () {
				return UrlJoint1+'/v2.0/userOperationData'
				 // 用户打印日志
			}
		}
		
		//alert(constants.UserOperationData()+"123")

//根据路由跳转页面

	window.onhashchange = function(){ //监听hash值变化，实现页面变换
		var hash=window.location.hash;	
		console.log(hash)
		changePage(hash); 		//监听hash值然后传进这个方法里面，他会根据hash值去弹出相对应的页面，
	}
	
	function changePage(hash){
		$(".msm_print_box").animate({transform:"scale(0)"},200)
		$(".space_upload").css("display","block")
		$(".lodin_box").css("transform","rotate(0)")
		msmH()
		if(hash != "#index"){
			//$(".return").animate({transform:"translateY(0rem)"},400)
			$(".index").css("z-index","1")
			$(".index").animate({
				"opacity":"0"
				,"transform":"scale(0.9) "
			},140,cubicBezier)
			$(".index_icon_in").css({
				"opacity":"0"
				,"transform":"scale(1)"
				})
			$(".index_txt").css("color","black")
		}else{
			indexalert()

		}
		
		if(hash != "#space"){
			$(".msm_prin_btn").children("div").attr("class","msm_true")
			uploadReturn()
			$(".space_del").animate({transform:"scale(0)"},10,cubicBezier3)
			$(".space").css({"z-index":"1","transform":" translateX(130%)"})
			$(".space").animate({
				"opacity":"0"
				,"transform":"scale(0.9) translateX(130%)"
			},140,cubicBezier)
			imgNone()
			$(".space_upload").animate({transform:"scale(0)"},10,cubicBezier3)
			$(".space_choose_go").animate({transform:"scale(0)"},140)
			$(".footer").animate({transform:"translateY(0%)"},140)
			$(".ticket_icon_in").css({
				"opacity":"0"
				,"transform":"scale(1)"
				})
			$(".space_txt").css("color","black")
		}else{
			$(".msm_prin_btn").children("div").attr("class","url_btn")
			spacealert()
		}
//		if(hash == "#ticket"){
//			ticketalert()
//		}
		
		if(hash == "#space"){
			spacealert()
		}
		
		if(hash != "#center"){
			$(".center").css("z-index","1")
			$(".center").animate({
				"opacity":"0"
				,"transform":"scale(0)"
			},540,cubicBezier)
			$(".center_icon_in").css({
				"opacity":"0"
				,"transform":"scale(1)"
				})
			$(".center_txt").css("color","black")
		}else{
			
			centeralert()
		}
		
		if(hash != "#upload"){
			$(".upload").css({"z-index":"1","transform":" translateY(130%)"})
			$(".upload").animate({
				"opacity":"1"
				,"transform":"scale(1) translateY(130%)"
			},140,cubicBezier)
		}else{
			uploadalert()
		}
		
		if(hash != "#print"){
			$(".print").css({"z-index":"1","transform":" translateX(130%)"})
			$(".print").animate({
				"opacity":"0"
				,"transform":"scale(0.9) translateX(130%)"
			},140,cubicBezier)
			$(".aj_input").animate({transform:" translateY(3.5rem)"},600)
			hidBtn()
			previewH()
			$(".aj_input").animate({transform:" translateY(3.5rem)"},140)
		}else{
			printalert()
		}

		
		if(hash != "#register"){
			$(".register").css("z-index","1")
			$(".register").animate({
				"opacity":"0"
				,"transform":"scale(0)"
			},140,cubicBezier)
		}else{
			registeralert()
		}
		
		if(hash != "#login"){
			$(".login").css("z-index","1")
			$(".login").animate({
				"opacity":"0"
				,"transform":"scale(0)"
			},140,cubicBezier)
		}else{
			loginalert()
		}
	
		if(hash != "#keep"){
			$(".keep").css("z-index","1")
			$(".keep").animate({
				"opacity":"0"
				,"transform":"scale(0)"
			},140,cubicBezier)
		}else{
			keepalert()
		}
	
		if(hash != "#printLog"){
			$(".print_log").css("z-index","1")
			$(".print_log").animate({
				"opacity":"0"
				,"transform":"scale(0)"
			},140,cubicBezier)
		}else{
			printLogalert()
		}
		
		if(hash != "#notice"){
			$(".notice").css("z-index","1")
			$(".notice").animate({
				"opacity":"0"
				,"transform":"scale(0)"
			},140,cubicBezier)
		}else{
			noticealert()
		}

	}
	
	
	
	
	
	
	
	//清除动画 loading动画
	//使用他时，传个参数1进去的话，就会往#index哪里跳转，
	//hash是index的话自动登录不会生效，一般调用不传1
	function clearanimate(val){
		var b = 1
		if(val == 1){
			sessionStorage.setItem("b",b)
			window.location.href = '#index';
			//alert("执行")
		}
		setTimeout(function(){
			$(".header").animate({"opacity":"0"},500,function(){
				$(this).css("display","none")	
			})
		},600)
	}
	
	
	//自动登录开始
		//进入的时候如果有number号的话就存起来
		if(crr!=undefined ||  crr!=null){
			if(crr.length > 9){//#后面的长度大于9的时候
				sessionStorage.setItem("printNumber", crr);
			}
		}
		function getLoginData() {
			var data = sessionStorage.getItem('loginData');
			data ? data = JSON.parse(data) : data = null;
			console.log('用户登录信息：' + data)
			return data;
		}

	
		
		
		
		//alert(constants.OpenId())
	function getWxUserInfo(){
		//alert("我开始了")

		if(crr == "index") return false;
		//如果加载进来的时候路由是#index的话就不执行下面拿openId的骚操作了
		//并且在这之后会执行indexalert，里面会限制到不会执行这个方法
		
		//获取Location对象的search属性值
			var searchStr = location.search;
			//由于searchStr属性值包括“?”，所以除去该字符
			searchStr = searchStr.substr(1);
			//将searchStr字符串分割成数组，数组中的每一个元素为一个参数和参数值
			var searchs = searchStr.split("&");
			//获得第一个参数和值
			var address = searchs[0].split("=");
			if (address[0] == 'code') {
					//("获取用户基本信息，并缓存open id和昵称在本地")
					//获取用户基本信息，并缓存open id和昵称在本地
					
					$.ajax({
							url:constants.OpenId() + address[1], //静默获取opend ID 用这条连接
							//url: "https://yun.dascomyun.cn/weixinds/openid"+'?code=' + address[1], //静默获取opend ID 用这条连接
							type: 'GET',
							async:false,
							success: function(res) {
								if(res.openid!=undefined){
									sessionStorage.setItem("wxUser", JSON.stringify(res));
									var imghead = JSON.parse(sessionStorage.getItem("wxUser")).headimgurl
									var obj = new Object();
									obj.weChatOpenId=res.openid;					
									var loginData = getLoginData()
									if (!loginData) {
										$.ajax({
											type: 'POST',
											async:false,
											url: constants.wechat(), 
											//url: 'https://yun.dascomyun.cn/autoservice_user/v1.0/common/session/wechat', 
											data: JSON.stringify(obj),//{"user":"limo","pwd":"fOmh515"}
											dataType: 'json',
											headers: {
												"Content-Type": "application/json"
											},
											complete: function (xhr) {
												var status = xhr.status
													, res = xhr.responseText
													, tip
													, target
													;
												if (status == 200) {
													//有返回值就自动登录成功，否则失败，并且不告诉用户
													sessionStorage.setItem('loginData', res);
													var val = 1
													clearanimate(val)
												}else{
													//lockers("自动登录失败")
													var val = 1
													clearanimate(val)
												}
		
											}
										})
									}						
									var number = sessionStorage.getItem("printNumber")
									if(number.length !=16){
										var val = 1
										clearanimate(val)
										lockers("请确认您的打印机编号是否正确")
									}
							   			
						   			}else{
						   				var val = 1
										clearanimate(val)
									}
				   		
					}
			})
		}else{
										//整的用户openid和用户信息 需要点确认	 location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4943f6480a79a436&redirect_uri=https://yun.dascomyun.cn/test/z-new-ide/html/index.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
										//location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4943f6480a79a436&redirect_uri=https://yun.dascomyun.cn/test/index.html&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
										//location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4943f6480a79a436&redirect_uri=https://yun.dascomyun.cn/test/indextest.html&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
										//仅openid和token  不需要点确认	 //
				
				
				
				//自动登录跳转链接
				location.href= wxlocation

		}
	}	

	//自动登录结束
	if(sessionStorage.getItem("b")){
		clearanimate()
	}else{
		if(isWeixin){
			getWxUserInfo()
		}else{
			var val = 1
			clearanimate(val)
		}

	
	}


//自动登录结束
	//开始
//阅读隐私条款 
$(".ramake").on("tap",function(){
	$(".read_txt").css({
		"transform":"scale(1)"
		,"opacity":"1"
	})
	$(".shade").css("display","block")
})
$(".return_read").on("tap",function(){
	$(".read_txt").css({
		"transform":"scale(0)"
		,"opacity":"0"
	})
	$(".shade").css("display","none")
})
//阅读隐私条款结束



	//登录状态
	function login(){
		console.log("运行了登录状态")
		//微信登陆存的也是 loginData，不要方
		var i = sessionStorage.getItem("loginData");
		if(i){
	 		$(".register_btn").css("display","none")
			$(".login_btn").css("display","none")
			$(".space_tit").css("display","none")
			$(".reg_inpt").css("display","none")
			
			$(".spacef_len").css("display","block")
			$(".user_mane").css("display","block")
			$(".uanvb").css("display","block")		
			$(".login_out").css("display","block")
			$(".pwdalter").css("display","block")
			$(".print_log_btn").css("display","block")
			$(".notice_btn").css("display","block")
		}else{
			$(".register_btn").css("display","block")
			$(".login_btn").css("display","block")
			$(".space_tit").css("display","block")
			$(".reg_inpt").css("display","block")
			
			
			$(".spacef_len").css("display","none")
			$(".user_mane").css("display","none")
			$(".uanvb").css("display","none")
			$(".login_out").css("display","none")
			$(".pwdalter").css("display","none")
			$(".print_log_btn").css("display","none")
			$(".notice_btn").css("display","none")
		}
	}
	login()
	//登录状态结束
	
	
	function spaceLenAlert(len){
		var spaceT = sessionStorage.getItem("spaceT")
		if(len == 0) return false;
		if(!spaceT){
			alertWarp({
				title:"提示"
				,con:"票夹中有"+len+"张发票，是否前往打印"
				//,btn:false
				,fn:"toSpace"
			})
			sessionStorage.setItem("spaceT","1")
		}
	}

//修改密码开始
$(".pwdalter").on("tap",function(){
	$(".alter_pwd").animate({transform:"translateY(0%)"},400,"cubic-bezier(0,1.37,.44,.95)")
})
$(".pwdReturn").on("tap",function(){
	$(".alter_tip").html("")
	$(".alter_pwd").css("transform","translateY(100%)")
})
//修改密码结束

 
//重新加载页面或者刷新时，监听路由事件不好使了，得用这个判断
	if(hash == "#index"){
		indexalert()
	}else if(hash == "#space"){
		spacealert()
	}else if(hash == "#ticket"){
		ticketalert()
	}else if(hash == "#upload"){
		uploadalert()
	}else if(hash == "#center"){
		centeralert()
	}else if(hash == "#register"){
		registeralert()
	}else if(hash == "#login"){
		loginalert()
	}else if(hash == "#keep"){
		keepalert()
	}else if(hash == "#printLog"){
		printLogalert()
	}else if(hash == "#notice"){
		noticealert()
	}else if(hash == "#print"){
		printalert()
	}
	
	

	
	//各种页面弹出的方法
	function indexalert(){
		$(".msm_prin_btn").children("div").attr("class","msm_true")
		entrance = ""
		AllSpaceRem()//回到主页就要清空票夹
		//$(".return").animate({transform:"translateY(-100%)"},400)
		clearanimate(1)
		//hashReturn($(".index"))
		UpdateInvoice()
		$(".index").css("z-index","10")
		$(".index").animate({
			"opacity":"1"
			,"transform":"scale(1) "
		},600,cubicBezier)
		
		$(".index_txt").css("color","#fb4e7a")
		$(".index_icon_in").css({
			"opacity":"1"
			,"transform":"scale(1.3)"
			})	
			
		$(".title").html("主页")
	}

	
	function spaceLens(len){
		$(".spacef_len").html(len)
		if(len !=0){
			$(".spacef_len").css("opacity","1")
		}else{
			$(".spacef_len").css("opacity","0")
		}
	}
	
	
	
	
	
//	function ticketalert(){
//		$(".space_choose").css("display","block")
//		$(".space_delete").css("display","none")
//		$(".space_upload").css("transform","scale(0)")
//		//.animate({transform:"scale(0)"},144)
//		$(".space_info").css("transform","translateX(0rem)")
//		//.animate({transform:"translateX(0rem)"},140)
//		$(".footer").css("transform","translateY(100%)")
//		//.animate({transform:"translateY(100%)"},140)
//		
//
//		
//		$(".space").css({"z-index":"10","transform":" translateX(130%)"})
//		$(".space").animate({
//			"opacity":"1"
//			,"transform":"scale(1) translateX(0%)"
//		},600,cubicBezier)
//		$(".title").html("票夹管理")
//		UpdateInvoice()
//		var logindata = JSON.parse(sessionStorage.getItem("loginData"))
//		if(logindata){
//			$(".space_btn").css("display","block")
//		}else{
//			$(".space_btn").css("transform","none")
//		}
//		
//	}
//	
//	
	
	
	
	function spacealert(){
		$(".msm_prin_btn").children("div").attr("class","url_btn")
		UpdateInvoice()
//		setTimeout(function(){
//			$(".space_delete").css("display","block")
//			$(".space_choose").css("display","none")
//			$(".space_upload").animate({transform:"scale(1)"},144)
//			$(".space_list").children("li").attr("id","")
//			$(".space_choose_go").animate({transform:"scale(0)"},140)
//			$(".space_info").animate({transform:"translateX(-1.3rem)"},140)
//			
//		},140)
		$(".space_txt").css("color","#fb4e7a")
		$(".ticket_icon_in").css({
			"opacity":"1"
			,"transform":"scale(1.3)"
			})
		
		

		$(".space").css({"z-index":"10","transform":" translateX(130%)"})
		$(".space").animate({
			"opacity":"1"
			,"transform":"scale(1) translateX(0%)"
		},600,cubicBezier)
		$(".title").html("选择打印")
		
		var logindata = JSON.parse(sessionStorage.getItem("loginData"))
		if(logindata){
			$(".space_btn").css("display","block")
		}else{
			$(".space_btn").css("transform","none")
		}
		
		

	
		
	}
	function uploadalert(){
		//hashReturn($(".upload"))
		
		$(".upload").css({"z-index":"10","transform":" translateY(130%)"})
		$(".upload").animate({
			"opacity":"1"
			,"transform":"scale(1) translateY(0%)"
		},600,cubicBezier)
		
		$(".title").html("上传发票")
	}
	
	function printalert(){           
		$(".msm_prin_btn").children("div").attr("class","msm_true")
		template()
		$(".aj_input").animate({transform:" translateY(0rem)"},600,cubicBezier)
		//hashReturn($(".print"))
		
		$(".print").css({"z-index":"10","transform":" translateX(130%)"})
		$(".print").animate({
			"opacity":"1"
			,"transform":"scale(1) translateX(0%)"
		},600,cubicBezier)
		
		$(".title").html("打印发票")
	}
	function centeralert(){
		login()
		var logindata = JSON.parse(sessionStorage.getItem("loginData"))
		if(logindata){
			information()
			$(".center_nav").css("transform",'translateY(35%)')
		}else{
			$(".center_nav").css("transform",'translateY(0%)')
		}
		$(".center_icon_in").css({
				"opacity":"1"
				,"transform":"scale(1.3)"
				})
		$(".center_txt").css("color","#fb4e7a")
		var src = $(".login_head").attr("src")
		$(".bg_img").attr("src",src).animate({opacity:"0.05"},1000)
		//hashReturn($(".center"))
		$(".center").css("z-index","10")
		$(".center").animate({
			"opacity":"1"
			,"transform":"scale(1)"
		},600,cubicBezier)
	
		$(".title").html("个人中心")
	}
	function registeralert(){
		
		//hashReturn($(".register"))
		$(".register").css("z-index","10")
		$(".register").animate({
			"opacity":"1"
			,"transform":"scale(1)"
		},600,cubicBezier)
		
	
		login()
		$(".title").html("注册")
	}
	function loginalert(){
		$("#log1").val("")
		$("#log2").val("")
		
		//hashReturn($(".login"))
		$(".login").css("z-index","10")
		$(".login").animate({
			"opacity":"1"
			,"transform":"scale(1)"
		},600,cubicBezier)
		login()
	
		$(".title").html("登陆")
	}
	function keepalert(){
		$(".keep").css("z-index","10")
		$(".keep").animate({
			"opacity":"1"
			,"transform":"scale(1)"
		},600,cubicBezier)
	
	
		$(".title").html("联系我们")
	}
	
	function printLogalert(){
		$(".print_log").css("z-index","10")
		$(".print_log").animate({
			"opacity":"1"
			,"transform":"scale(1)"
		},600,cubicBezier)
		printLog()
		//hashReturn($(".print_log"))
		
	
		$(".title").html("打印记录")
	}
	function noticealert(){
		
		//hashReturn($(".notice"))
		$(".notice").css("z-index","10")
		$(".notice").animate({
			"opacity":"1"
			,"transform":"scale(1)"
		},600,cubicBezier)
	
		$(".title").html("消息")
		information()
	}
		//各种页面弹出的方法结束
		
		
		
		//懒加载banner图片
	setTimeout(function(){
			var img_len = $(".swiper-slide").children("img").length
		for(var i = 0 ; i <img_len; i++){
			var srcc =  $(".swiper-slide").children("img").eq(i).attr("src-data")
			$(".swiper-slide").children("img").eq(i).attr("src",srcc)
			setTimeout(function(){
				$(".swiper-slide").children("img").css('opacity','1')
			},400)
		}
	},800)

	//loading动画
	function scale(){
		$(".loading_img").animate({transform:"scale(0.7)"},500,cubicBezier,function(){
			$(this).animate({transform:"scale(1)"},100,cubicBezier3,function(){
				setTimeout(rotateY,1500)
			})
			
		})
	}
	
		function rotateY(){
			$(".loading_img").animate({transform:"rotateY(180deg)"},600,cubicBezier,function(){
				$(this).css("transform","rotateY(0deg)")
				setTimeout(scale,100)
			})
		}
		rotateY()
	
	

	function loadings(){
			
			clearTimeout(intervalLoading)
			clearTimeout(intervalLoading2)
			$(".loading_txt").html('稍等片刻')
		$(".loading").animate({display:"block"},10,function(){
			$(this).css("opacity","1")
			$(".loading_txt").html('稍等片刻')
			intervalLoading = setTimeout(function(){
				$(".loading_txt").html('网络速度较慢')
			},10000)
			intervalLoading2 = setTimeout(function(){
				$(".loading").on("tap",function(){
					loadingh()
					window.location.reload()  //15秒后可以刷新该页面
				})
			},15000)
		})
	}
	//隐藏loading动画
	function loadingh(){
		$(".loading_txt").html('稍等片刻')
		$(".loading").animate({display:"none"},10,function(){
			$(this).css("opacity","0")
	
		})
	}

//遮罩层控件
function maskS(){
	$(".maskLayer").animate({display:"block"},14,function(){
		$(this).animate({opacity:"1"},300)
	})
}
function maskH(){
	$(".maskLayer").animate({display:"none"},14,function(){
		$(this).animate({opacity:"0"},300)
	})
}





	//抽屉弹窗控件
	//弹窗控件
		function lockers(lockersval){

			var  html =( `
				<section class="locker_warp">
				    <section class="locker">
					    <section class="locker_con">
					    </section>
					    <section id="locker_btn" class="locker_btn">确定</section>
				    </section>
				    <section class="locker_blur"></section>
				</section>
			`)
			$("body").append(html)
			$(".locker").css("transform","translateY(-150%)")
			$(".locker_con").html(lockersval)
			$(".locker").animate({transform:"translateY(0%)"},300,cubicBezier)
			var parents = $(".locker").length	
			if(parents == 2){
				$(".locker_warp").eq(0).remove()
			}
		}
		$("body").on('tap','.locker_blur',function(){
			lockerh()
		})
//		$("body").on('touchmove','.locker_blur',function(){
//			lockerh()
//		})
		function lockerh(){
			$(".locker").eq(0).animate({transform:"translateY(-150%)"},300,cubicBezier,function(){
					$(".locker_warp").eq(0).remove()
			})
		}
		$("body").on("touchmove",'.locker',function(){
			lockerh()
		})
		$("body").on("tap",".locker_btn",function(){
			lockerh()
		})
	$(".alert_false").on("touchend",function(){
		setTimeout(function(){
			alertWarpH()
		},300)
		
	})
	$(".alert_true").on("tap",function(){
		var data = $(this).attr("data-fn")
		
		//这里注册
		//理论就是遍历$(".alert_true")的data-fn值来判断执行哪一个方法
		switch(data)
		{
		case "delel":
		  //alert("删除")
		  spaceRem()
		  break;
		  
		  case "toSpace":
		  //alert("删除")
		  location.href = "#space"
		  break;
		  
		case "":
		  //alert("事件获取失败")
		  break;
		  
		  
		default:
		  
		}
		alertWarpH()
		
	})



//			用法
//			btn是取消按钮，不要就传false
//			fn是注册事件  要在   //这里注册 里面注册并且放入方法才会生效
//			alertWarp({
//						title:"警告"
//						,con:"你妈"
//						,btn:false
//						,fn:"delel"
//					})
		function alertWarp(configuration){
			if(configuration){
				if(configuration.btn != ""){
					var btnstyle = "block"
				}else{
					var btnstyle = "none"
				}
				$(".alert_true").attr("data-fn",configuration.fn)
				$(".alert_title").html(configuration.title)
				$(".alert_con").html(configuration.con)
				$(".alert_false").css("display",btnstyle)
			}
			
			maskS()
			$(".alert_warp").animate({display:"block"},14,function(){
				
				$(this).animate({transform:"scale(1)"},200,cubicBezier) 
			})
//				var height = $(".alert_main").height()
				if(configuration.top){
					$(".alert_main").css("transform","translateY(-"+configuration.top+"rem)")
				}else{
					$(".alert_main").css("transform","translateY(0rem)")
				}
				
		

			
			
		}
		$(".alert_title").on("tap",function(){
			alert($(".alert_main").height())
		})
		function alertWarpH(){
			$(this).attr("data-fn","")
			$(".alert_warp").animate({display:"none"},14,function(){
				$(this).animate({transform:"scale(0)"},20)
			})
			maskH()
		}












	
	
/**
 *************************************************************
 * 上传发票
 *************************************************************
 */	





	
	//发票上传事件
	$("#uploaderInput").on('change', function (e) {
		
			var formData = new FormData()
			var user = JSON.parse(sessionStorage.getItem("loginData"))
			if(!user) {
				var lockersval = '请先<a class = "locker_btn blue" href = "#login">登陆</a>'
	       		lockers(lockersval)
				return false
			}
			var files = this.files;
			var fileSize =  document.getElementById('uploaderInput').files[0]; //获得文件；
			if ( !Suffix( files[0]) ) return;
			formData.append('file', fileSize);
			formData.append('type', "pdf");
			formData.append('username', user.user);
		$.ajax({
			url: constants.uploader()  ,
			type: 'POST',
			cache: false, //cache设置为false，上传文件不需要缓存
			processData: false, //data值是FormData对象，不需要对数据做处理
			contentType: false, //已经声明了属性enctype='multipart/form-data'，所以这里设置为false
			data: formData, //FormData对象
			headers: {
				'Authorization': 'Bearer ' + user.user
			},
			success: function success(res) {
				console.log(res);
				formData.delete('file');
				$(".upload_btn").animate({transform:"translateX(-100%)"},300)
				UpdateInvoice()
				
				lockers(res.data)
			},
			error: function error(xhr) {
				
				formData.delete('file');
				UpdateInvoice()
				$(".upload_btn").animate({transform:"translateX(-100%)"},300)
				var res = JSON.parse(xhr.responseText)
				lockers(res.data)
			},
			complete: function complete(xhr) {
				setTimeout(function(){
					$("#uploaderInput").val("")
				},140)
				console.log('上传文件：', xhr);
			}
		});
	});


	//URL上传

	$(".msm_prin_btn").on("tap",".url_btn",function(){
		$(".blurs").css("display","block")
		setTimeout(function(){
			$(".blurs").css("display","none")
		},3000)
		var user = JSON.parse(sessionStorage.getItem("loginData"))
		if(!user){
			 
			lockers("请先登录")
			return false;
		}
		
		var val = $(".msm_print_val").val()
		if(val == ""){
			lockers("url不能为空")
			return false;
		}
			var Url
				,ap
				,bba
				,we
				,be
				,be2
				,ap
				,https = 'https://' 
				
				
				
		var content = val
		var content=content.replace(/(^\s*)|(\s*$)/g, "");
		//if (isURI.test(content)) {
			
				var url = JSON.stringify(val)
				var nn = url.substr(url.length-3,2)
				if(nn == "\\n"){
					 url = url.split('\\n')[0] +'"';
				}
				be = url.split('http')[1];
				be2 = url.split('nnfp')[1];
				if(be){
					Url = "http";
					we = url.split('http')[1];
					ap = Url + we;
				}else	if(be2){
					Url = "nnfp";
					we = url.split('nnfp')[1];
					ap =https + Url + we;
				}else{
					$(".msm_prin_ttitle").html('请输入正确的URL').css("color","red")
					setTimeout(function(){
						$(".msm_prin_ttitle").html("请输入短信链接").css("color","black")
					},3000)
					return false;
				}
				
				if (ap.indexOf('"') != -1) {
					bba = ap.split('"')[0];
				}
				if (ap.indexOf("，") != -1) {
					bba = ap.split("，")[0];
				} 
				if (ap.indexOf(',') != -1) {
					bba = ap.split(',')[0];
				} 
				if (ap.indexOf('  ') != -1) {
					bba = ap.split('  ')[0];
				}  
				if (ap.indexOf(" ") != -1) {
					bba = ap.split(" ")[0];
				}  
				if (ap.indexOf('[') != -1) {
					bba = ap.split('[')[0];
				} 
				if (ap.indexOf('\\n') != -1) {
					bba = ap.split('\\n')[0];
				} 
					console.log("url上传的链接："+bba)
					
		
		
		
		
		
		
		
		
		
			
			msmH()
			var Data = new FormData();
			Data.append('url', bba);
			Data.append('username', user.user);
			Data.append('type', "url");
			$.ajax({
				url: constants.uploader() ,
				type: 'POST',
				cache: false,//cache设置为false，上传文件不需要缓存
				processData: false,//data值是FormData对象，不需要对数据做处理
				contentType: false,//已经声明了属性enctype='multipart/form-data'，所以这里设置为false
				data: Data,//FormData对象
				headers: {
				'Authorization': 'Bearer ' + user.token,
				},
				success: function success(res) {
					UpdateInvoice()
					$(".url_inp").val("")

					lockers("上传成功")
					$(".upload_btn").animate({transform:"translateX(-100%)"},300)
				},
				error: function error(xhr) {
					 var res=JSON.parse(xhr.responseText)
							lockers(res.data)
							val = ""

				},
				complete: function complete(xhr){
					
					console.log('上传文件：', xhr);
					val = ""
				}
			})
			
			
			
			
		//}else{
		//	lockers("上传失败,请输入正确的URL")
		//}
		
	})


/**
 *************************************************************
 * 票夹
 *************************************************************
 */	



	function uploadReturn(){
		$(".url_box").css({"opacity":"0","transform":"scaleX(0)"})
		$(".upload_btn").animate({transform:"translateX(-100%)"},300)
		$(".url_inp").val('')
		var hash = window.location.hash
		if(hash !="#space"){
			$(".space_upload").animate({transform:"scale(0)"},300,cubicBezier2)
		}else{
			var len = $(".space_list").children("li").length
			if(len<=5){
				$(".space_upload").animate({transform:"scale(1)"},300,cubicBezier2)
			}
			
		}
		
	}
	
//	$(".space_img_btn").on("tap",function(){
//		setTimeout(function(){
//			$(".space_upload").css("display","none")
//		},70)

//	})
	var spacePage = $(".space")
	spacePage.on("tap",function(){
		btnLesten()
	})
	$(".space_upload").on("tap",function(){
		$(".msm_prin_ttitle").html("请输入URL链接")
		$(this).animate({transform:"scale(0)"},300,cubicBezier2)
		var logindata = JSON.parse(sessionStorage.getItem("loginData"))
		if(logindata){
			$(".upload_btn").animate({transform:"translateX(0%)"},400,cubicBezier2)
		}else{
			 
			lockers("请先登录")
		}
	})

	//登录状态存在才发送
	UpdateInvoice()
	function UpdateInvoice(){
		var logindata = JSON.parse(sessionStorage.getItem("loginData"))

		console.log("拉取发票")
		if(logindata){
			loadings()
			$.ajax({
					type: 'GET',
					url: constants.space() +"?username="+ logindata.user,
					dataType: 'json',
					headers: {
						"Authorization": 'Bearer ' + logindata.token//注意格式：有空格
					},
	
					complete:function (xhr){
						var status = xhr.status
							, res = xhr.responseText
							;
						//console.log(xhr.response.length)
	
	
						if (status == 200) {
							!/invoice/.test(res) ? res = [] : res = JSON.parse(res).data;
							console.log(res)
							
							console.log('发票张数'+res.length)
							spaceLenAlert(res.length)
							spaceLens(res.length)
							for (var i = 0;i<res.length;i++) {
								var pUrl =res[i].path.toString().replace("http","https");
								var prUrl =res[i].printUrl.toString().replace("http","https");

								res[ i ].path = pUrl
								res[i].printUrl = prUrl
								res[i].uploadParameter="ticket";
								res[i].url= res[i].printUrl
								
							}
							sessionStorage.setItem("ticket",JSON.stringify(res))
							
							var html = ''
							var len = res.length
							listLength(len)
							
							if(res.length != 0){

								for (var i = 0;i<res.length;i++) {
									//console.log(res[i])
									html += (`
										<li class = "space_list_li" id="" data_src = "${res[i].id}">
				            				<dl class="space_info">
					            				<dt><strong>${res[i].invoiceSales}</strong></dt>
					            				<dd class=""><span class="space_timer">时间:${res[i].invoiceDate}</span> <span class="space_money">金额:${res[i].invoiceAmount}</span></dd>
					            				<dd class=""><div class="space_name">抬头:${res[i].invoiceBuyers}</div></dd>
				            				</dl>
				            				<div data_src = "${res[i].path}" class="space_img_info"></div>
				            				<div data_src = "${res[i].printUrl}" class="space_choose"><div class="space_choose_btn"></div></div>
				            			</li>
									`)
									
								}
							}else{
								
								html += (`
										<li class = "space_none">
											<div class = 'space_none_txt'>还没有发票</div>
				            			</li>
									`)
							}

								
							//渲染页面
							$(".space_list").html(html)
							loadingh()

	
						} else {
							lockersval = '拉取失败：' + res
							lockers(lockersval)
							loadingh()
						}
					}
				})
		}
	}



//选择发票按钮事件
		$('.space_choose_go').on("touchstart",function(){
				var status = $(".munber_status").html()
				
				if(status != "正常"){
					lockers("打印机状态错误")
					return false;
				}
				
				
		})
		$('.space_choose_go').on("tap",function(){
				var printStatus = $("#printmian").html()
				var fun = []
				var listLen = $(".space_list").children("#space_in")
				var choose = JSON.parse(sessionStorage.getItem("ticket"))
				var over = $("#printover").html()
				if( printStatus == "false"){
					location.href = "#print"
					lockers("正在发送打印中，暂时无法添加发票")
					return false;
				}
				if(over != "true"){

					AllSpaceRem()
					setTimeout(function(){
						$("#printover").html("true")
					},130)
				}
//				if(listLen.length > 1){
//					lockers("每次仅能选择一张发票")
//				}else 
				if(listLen.length == 0){
					lockers("选择一张发票")
					return false;
				}
					
					var len = listLen.length
					//每次只能选择一张啊，滚球兽，不然手机解不过来压
					
					var spaceSelect = []
				
					
					if(credentials == true){
						for (var i = 0;i<len;i++) {
							var Index = listLen.eq(i).index()
							fun.push(choose[Index])
							SpaceBox({
							  		Url:choose[Index].printUrl
							  		,name:choose[Index].invoiceSales
							  		,title:choose[Index].invoiceBuyers
							  		,money:choose[Index].invoiceAmount
							  		,timer:choose[Index].invoiceDate
							  		,uploadParameter: "ticket"
							  		,id:choose[Index].id
						  	})
						}
						
						template()
						location.href = "#print"
					}else{
						for (var i = 0;i<len;i++) {
							var Index = listLen.eq(i).index()
							
							fun.push(choose[Index])
								spaceSelect.push({
							  		Url:choose[Index].printUrl
							  		,name:choose[Index].invoiceSales
							  		,tit:choose[Index].invoiceBuyers
							  		,money:choose[Index].invoiceAmount
							  		,timer:choose[Index].invoiceDate
							  		,uploadParameter: "ticket"
							  		,id:choose[Index].id
						  	})
						}
						sessionStorage.setItem("spacChoose",JSON.stringify(spaceSelect))
						var num = 0
						loadings()
						addPush(num)
					}
					
			})
		
			function addPush(num){
				
				var spacChoose = JSON.parse(sessionStorage.getItem('spacChoose'))
				var len = spacChoose.length
				var spaceInfo;
			
		

				if(num!=len){
					 spaceInfo = {
				  		Url:spacChoose[num].Url
				  		,name:spacChoose[num].name
				  		,tit:spacChoose[num].tit
				  		,money:spacChoose[num].money
				  		,timer:spacChoose[num].timer
				  		,id:spacChoose[num].id
				  		,uploadParameter: "ticket"
					}
				}
				//信息
				var timerss = setInterval(function(){
					console.log("我在执行")
					var result=$("#domian").html()
					if(result == "true"){
						$("#domian").html("false")
						if(num == len){
							num = 0
							console.log("停止")
							$("#printToImage").html("true")
							clearInterval(timerss)
						}else{
							$("#printToImage").html("false")
							clearInterval(timerss)
							pdfToImage(spaceInfo)
							num++
							console.log(num+"次")
							addPush(num)
						}
					}
				},500)
			
			}


	function listLength( len ){
		//console.log("监听发票长度"+len)
		var hash = location.hash
		if(hash != "#space") return false;
		if(len == 0){
			$(".space_upload").animate({transform:"scale(1)"},340,cubicBezier3)
		}else{
			if(len >= 5){
				$(".space_upload").animate({transform:"scale(0)"},340,cubicBezier3)
			}else{
				$(".space_upload").animate({transform:"scale(1)"},340,cubicBezier3)
			}
		}
	}
	//点击事件
	//删除
	$(".space_del").on("tap",function(){
		alertWarp({
						title:"提示"
						,con:"是否删除选中的发票"
						//,btn:false
						,fn:"delel"
					})
		
	})
	function spaceRem(){
		var cdn = $(".space_list").children("#space_in")
			,loginData = JSON.parse(sessionStorage.getItem("loginData"))
			,id
		for(var i=0;i<cdn.length;i++){
			id = cdn.eq(i).attr("data_src")
			cdn.eq(i).animate({transform:"translateX(-140%)"},300*i,function(){
				$(this).animate({height:"0rem"},550,"cubic-bezier(0,.09,0,1)",function(){
					$(this).remove()
					btnLesten()
					var len = $(".space_list").children("li").length
					listLength( len )
				})
			})
			var Json = {
				"username":loginData.user
				,"invoiceId":id
			}
	        $.ajax({
	            url: constants.Delete(),
	            type: "DELETE",
	            dataType: "json",
	            data:JSON.stringify(Json),
	            headers: {
	                "Content-Type": "application/json;charset=UTF-8",
	                "Authorization": "Bearer "
	            },
	            complete: function ( xhr ) {
	                var status = xhr.status;
	               	btnLesten()
	                lockers("删除成功")
	                
	                //UpdateInvoice()
	            }
	        });
			
			
			
		}
	}
	
		
	//详情
	$(".space_list").on("tap"," li .space_img_info",function(){
		var val = $(this).attr("data_src")
		$(".bva_img").attr("src",val)
		$(".aj_img").css("display","block")
	})
	
	//勾选发票
	$(".space_list").on("tap"," li .space_choose",function(){
		$("#domian").html("true")
		var val = $(this).attr("data_src")
		var byId = $(this).parent().attr("id")
		setTimeout(btnLesten,14)
		//$(this).parent().siblings("li").attr("id","")
		//$(".space_choose").children("div").html("选择打印")
		if(byId == ""){
			$(this).parent().attr("id","space_in")
			//$(this).children("div").html("已选择")
		}else{
			$(this).parent().attr("id","")
			//$(this).children("div").html("选择打印")
		}
	})
	function btnLesten(){
			var idlen = $("#space_in").length
			,lens = $(".space_list").children("li").length
			,logindata = sessionStorage.getItem("loginData")
		if(!logindata) return false;

			if(idlen == 0){
				if(lens >= 5){
					$(".space_upload").css("display","none")
				}else{
					$(".space_upload").css("display","block")
					uploadReturn()
				}
				$(".space_choose_go").animate({transform:"scale(0)"},240)
				$(".space_del").animate({transform:"scale(0)"},240)
				$(".space_upload").animate({transform:"scale(1)"},240,cubicBezier3)
			}else{
				$(".space_choose_go").animate({transform:"scale(1)"},240,cubicBezier3)
				$(".space_upload").animate({transform:"scale(0)"},240,cubicBezier2)
				$(".upload_btn").animate({transform:"translateX(-100%)"},300)
				$(".msm_print_box").animate({transform:"scale(0)"},200)
				$(".msm_print_val").val("")
				setTimeout(function(){
					$(".space_del").animate({transform:"scale(1)"},240,cubicBezier3)
				},140)
			}
		}
	//选择打印按钮

	
	
	

	
	
	
	
	$(".aj_img").on("tap",function(){
		imgNone()
	})
	function imgNone(){
		$(".aj_img").css("display","none")
		$(".bva_img").attr("src","")
		
	}
	
//	$(".print_log_con").on("tap","li",function(){
//		var src = $(this).attr("data_src")
//		$(".bva_img").attr("src",src)
//		$(".aj_img").css("display","block")
//	})
	
	
	
//打印记录
	function printLog(){
		var logindata = JSON.parse(sessionStorage.getItem("loginData"))
		//alert(JSON.stringify(logindata))
		if(!logindata){
			
			lockers('请先登录')
			return false;
		}
		loadings()
		//alert('用户名'+logindata.user)
		//alert('用户token'+logindata.token)
		$.ajax({
            url: constants.UserOperationData() +"?username="+logindata.user,
            type: "GET",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + logindata.token
            },
            complete: function( xhr ){
            	loadingh()
            	var html = ""
                var status = xhr.status;
                var res = JSON.parse(xhr.responseText).data
                console.log(res)
                if ( status == 200 ) {
                	//alert("返回值"+JSON.stringify(res))
                	console.log(res)
					for (var i = 0 ;i<res.length;i++) {

						res[ i ].path = res[i].path.toString().replace("http","https");
						html+=(
							`
								<li data_src = "${res[i].path}">
			            			<dl>
			            				<dt>${res[i].operation}</dt>
			            				<dd>打印时间:<span>${res[i].operation_time}</span></dd>
			            			</dl>
			            		</li>							
							`
						)
					}
					
					$(".print_log_con").html(html)
					loadingh()

                }else{
                	lockers(res)
                }
            }
        })
	}
	
	
	
	
	
	
	
	
	
	

/**
 *************************************************************
 * 消息事件
 *************************************************************
 */

		//消息事件
		$(".notice_list").on("tap","li",function(){
			var logindata = JSON.parse(sessionStorage.getItem("loginData"))
			$(this).children("dl").children(".dd_0").attr("class","dd_1")
			var id = $(this).attr("data-id")
			var data = {
				pushId: id
			}
			$.ajax({
				type: 'POST',
				url:constants.isRead(),
				data: JSON.stringify(data),
				dataType: 'json',
				headers: {
					'Content-Type': 'application/json',
				},
				
				success: function (res) {
					console.log('读取成功：', res);
					
				}
			});
		})
		
		
		
		
		
		
	information()
			//个人消息
	function information(){
		var logindata = JSON.parse(sessionStorage.getItem("loginData"))

		if(logindata){
			
			
			
			$.ajax({
					url: constants.notice() +"?username="+ logindata.user,
					dataType: 'json',
					type: 'get',
					headers: {
						"Authorization": 'Bearer ' + logindata.token//注意格式：有空格
					},

					success: function (res) {
						var html = ""
						var readnumber
						console.log(res.data)
						var res = res.data
						//console.log(res.length)
						for (var i=0;i<res.length;i++) {//遍历res的长度
							if(res[i].messageType == null) res[i].messageType = ""
							html+=(
								`
								<li data-id = "${res[i].id}">
			            			<dl class="notice_list_dl">
			            				<dt>${res[i].messageTheme}</dt>
			            				<dd>${res[i].messageContent}</dd>
			            				<dd>删除时间:${res[i].messagePushTime}</dd>
			            				<dd>消息来源:${res[i].messageFrom}</dd>
			            				<dd>${res[i].messageType}</dd>
			            				<dd class="dd_${res[i].isRead}"></dd>
			            			</dl>
			            		</li>
								`
							)
							$(".notice_list").html(html)
						}
						
						var ins = $(".dd_0").length
						if(ins>1){
							$(".notice_len").css("display","block")
						}else{
							$(".notice_len").css("display","none")
						}
						
						
						
					},
					error: function (xhr, errorType, error) {
						console.log('失败系统消息：', xhr)
					}
			});
				
		}else{
			
		}
		

	}



//轮询打印机

	function printPlliing(val){
		
		var printNumber = sessionStorage.getItem("printNumber")
		if(!printNumber) {
			if(val == 1){
				lockers("未获取到打印机编号")
			}
			$(".munber_status").html("编号为空").css("color","red")
			return false;
		}
		$(".munber").html(printNumber)
		if(printNumber.length != 16){
			$(".munber_status").html("打印机编号错误")
			printStateTxt()
			return false;
		}
		//alert(1212)
		$.ajax({
			url: constants.checkPrinter() + printNumber,
			complete: function (xhr){
				var res = JSON.parse(xhr.response)
					,txtState

				if(res.code == 0){
					txtState = res.data.main
				}else{
					txtState = res.data
				}
				
				$(".munber_status").html(txtState)
				//.html(printStatus(res.code))
				 printStateTxt()
				
				if(res.code != "0"){
					if(one == true){
						lockers(txtState)
						one = false
					}
					
				}
				
				console.log("打印机状态："+res.data.main)
			}
		})
	}
		
		$(function(){
			printPlliing()
		})
		setInterval(printPlliing,5000)
		setInterval(printStateTxt,3000)
		function printStateTxt(){
			var statu = $(".munber_status").html()
			if(statu != "正常"){
				$(".munber_status").css("color","red")
				$(".status_img").attr("src","../img/public/printx.png")
				$(".status_icon").css("background-color","red")
			}else if(statu != ""){
				$(".status_img").attr("src","../img/public/printy.png")
				$(".munber_status").css("color","black")
				$(".status_icon").css("background-color","#3399cc")
			}else{
				$(".status_img").attr("src","../img/public/printy.png")
				$(".munber_status").css("color","black")
				$(".status_icon").css("background-color","#3399cc")
			}
		}







		
		//邮箱打印事件
		$(".Email").on("tap",function(){
			$(".boxEmailBlur").css("display","block")
			setTimeout(function(){
				$(".boxEmailBlur").css("display","none")
			},1400)
			var printNumber = sessionStorage.getItem("printNumber")
			,status = $(".munber_status").html()
			if(!printNumber){
				lockers("打印机编号不存在")
				return false;
			}
			if(status != "正常"){
				lockers("打印机状态错误")
				return false;
			}
			$.ajax({
				url: constants.email() +printNumber,
				type: 'GET',
				success: function(res) {
					console.log(res.length)
					if(res.length == 0){
						alertWarp({
							title:"警告"
							,con:`<ul class = 'mail_box'><li class = 'h5'>该打印机未绑定邮箱</li><li class = 'h8'>此邮箱尚未经绑定打印机，绑定后可通过发送邮件的形式进行打印。</li><li><span class = 'yu'>注意事项：</span></li><li class = "darkgray">1.电子发票以添加附件形式发送邮件</li><li class = "darkgray">2.只支持PDF格式文件发送，只能一次发送一张发票打印，不能发送大于1MB的PDF文件</li><li class = "darkgray">3.邮件发送成功后会返回相应的提示，请注意查收您的邮件<span class = 'yu'>(返回的提示邮件可能会被识别为垃圾邮件，请留意)</span></li></ul>`
							,btn:false
						})
//						lockers(
//							`
//							<ul class = 'mail_box'><li class = 'h5'>该打印机未绑定邮箱</li><li>此邮箱尚未经绑定打印机，绑定后可。通过发送邮件的形式进行打印</li><li><span class = 'yu'>注意事项：</span></li><li class = "darkgray">1.电子发票以添加附件形式发送邮件</li><li class = "darkgray">2.只支持PDF格式文件发送，只能一次发送一张发票打印，不能发送大于1MB的PDF文件</li><li class = "darkgray">3.邮件发送成功后会返回相应的提示，请注意查收您的邮件<span class = 'yu'>(返回的提示邮件可能会被识别为垃圾邮件，请留意)</span></li></ul>
//							`
//						)
					}else{
						alertWarp({
							title:"提示"
							,con:`<ul class = 'mail_box'><li class = 'h4'>绑定的邮箱号</li><li class = 'h5'>${res}</li><li class = 'h8'>此邮箱号已经绑定打印机，您可通过发送邮件的形式进行打印。</li><li><span class = 'yu'>注意事项：</span></li><li class = "darkgray">1.电子发票以添加附件形式发送邮件</li><li class = "darkgray">2.只支持PDF格式文件发送，只能一次发送一张发票打印，不能发送大于1MB的PDF文件</li><li class = "darkgray">3.邮件发送成功后会返回相应的提示，请注意查收您的邮件<span class = 'yu'>(返回的提示邮件可能会被识别为垃圾邮件，请留意)</span></li></ul>`
							,btn:false
							,top:"2"
						})
//						lockers(
//							`
//							<ul class = 'mail_box'><li class = 'h4'>绑定的邮箱号</li><li class = 'h5'>${res}</li><li>此邮箱号已经绑定打印机，您可通过发送邮件的形式进行打印</li><li><span class = 'yu'>注意事项：</span></li><li class = "darkgray">1.电子发票以添加附件形式发送邮件</li><li class = "darkgray">2.只支持PDF格式文件发送，只能一次发送一张发票打印，不能发送大于1MB的PDF文件</li><li class = "darkgray">3.邮件发送成功后会返回相应的提示，请注意查收您的邮件<span class = 'yu'>(返回的提示邮件可能会被识别为垃圾邮件，请留意)</span></li></ul>
//							`
//						)
					}
					
				}
			});
			
})

		
		
		
		
		
		
		
		
		
		
		//错误代码赋值
		//调用的时候传值进就有赋值输出
		//例如 var 2012 = 2012
		//$(".abc").html(polling.printStatus(2012)) 输出：打印机状态异常
		//这里会越来越多，希望你们也会这样子做
		function printStatus(val){
			var status
			if(val == "0"){
					status = "正常"
				}else if(val == "2000"){
					status = "服务器解析错误"
				}else if(val == "2001"){
					status = "文档类型错误"
				}else if(val == "2002"){
					status = "缺少请求头"
				}else if(val == "2003"){
					status = "请求头错误"
				}else if(val == "2004"){
					status = "源文件为空"
				}else if(val == "2005"){
					status = "缺少请求参数"
				}else if(val == "2006"){
					status = "打印类型错误"
				}else if(val == "2007"){
					status = "错误代码2007"
				}else if(val == "2008"){
					status = "错误代码2008"
				}else if(val == "2009"){
					status = "错误代码2009"
				}else if(val == "2010"){
					status = "打印机不存在"
				}else if(val == "2011"){
					status = "打印机离线"
				}else if(val == "2012"){
					status = "打印机状态异常"
				}else if(val == "2013"){
					status = "暂停打印"
				}else if(val == "2014"){
					status = "打印机型号错误"
				}else if(val == "2015"){
					status = "不支持改仿真类型"
				}else if(val == "2016"){
					status = "设备被占用"
				}else if(val == "2017"){
					status = "wifi未连接打印机"
				}else if(val == "2018"){
					status = "不在工作时间内"
				}else if(val == "2019"){
					status = "url下载文档过大"
				}else if(val == "2020"){
					status = "错误代码2020"
				}else if(val == "2021"){
					status = "提取服务失败"
				}else if(val == "2022"){
					status = "转换服务失败"
				}else if(val == "2023"){
					status = "tcp请求错误"
				}else if(val == "2024"){
					status = "发票下载出错"
				}else	if (val == '2102') {
					status="不是PDF"
				} else if (val == '2103') {
					status="发票存在"
				} else if (val == '2104') {
					status="不是可用的URL链接"
				} else if (val == '2105') {
					status="发票提取服务异常"
				} else if (val == '2106') {
					status="转换服务异常"
				} else if (val == '2107') {
					status="文件上传失败"
				} else if (val == '2101') {
					status="空文件"
				}else{
					status = '错误代码'+ val
				}
			return status
		}
		
/**
 *************************************************************
 * 打印
 *************************************************************
 */
 


		

		
	//打印界面的小电池
	function battery(){
		var len = $(".print_space_list").children("li").length
		var battery = $(".print_len").children("i")
		if(len == 0) battery.attr("class","level0")
		if(len == 1) battery.attr("class","level1")
		if(len == 2) battery.attr("class","level2")
		if(len == 3) battery.attr("class","level3")
		if(len == 4) battery.attr("class","level4")
		if(len == 5) battery.attr("class","level5")
	}

			//上传限制
	function Suffix( fileType ){
		if(fileType == undefined) return false;
		var size = fileType.size
		var type = fileType.type
		if ( type != "application/pdf" ) {

			lockers("只能上传pdf文件类型")
			return false;
		}else if(size>1048576){
	        
	        lockers('请上传不超过1M的文件')
	        return false;
	    }else{
			return true;
		}
	}

	//转2进制文件
	function dataURItoBlob(base64Data) {
		var byteString;
		if(base64Data.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(base64Data.split(',')[1]);
		else
			byteString = unescape(base64Data.split(',')[1]);
			var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
			var ia = new Uint8Array(byteString.length);
		for(var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], {
			type: mimeString
		});
	}
		
		
		
	//渲染模板  渲染模块
	//渲染模块，拿缓存里面的数据出来渲染，而不是直接渲染
	//当缓存更新的时候调用一次这个方法，就可以不刷新页面进行渲染
	function template(){
		var allSpace = sessionStorage.getItem('allSpace')
		
		//缓存存在的时候自做这些事
		if(allSpace){
			sasb = JSON.parse(allSpace)
			var htmlPrint="";
			for (var i=0;i<sasb.length;i++) {	
				
				//发票的uploadParameter值标示他是从哪里传进来的发票
				//分有wecat、 msm、 file、 ticket 四种，每种的渲染方式不同
				//console.log(sasb[i].url[0])
				if(sasb[i].uploadParameter == "file"){
					 htmlPrint+=(`
						<li class="print_space_list_loca"   data-type = "${sasb[i].uploadParameter}"  >
	            			<div class="print_space_name">${sasb[i].name}</div>
	            			<div class="">
	            				<span class="print_space_money">大小：${sasb[i].size}</span>
	            			</div>
	            			<div class="sta">状态：</div>
	            			<i class="print_space_delete"></i>
	            			<i class="print_space_preview"></i>
	            			<i class="print_space_blur"></i>
	            		</li>	
					`)
					$(".print_space_list").html(htmlPrint)
				}
				
				
				//云票夹
				if(sasb[i].uploadParameter == "ticket"){
					htmlPrint+=(`
						<li data-id = "${sasb[i].id}" class="print_space_list_ticket" data-type = "${sasb[i].uploadParameter}" >
	            			<div class="print_space_name">${sasb[i].name}</div>
	            			<div class="">
	            				<span class="print_space_money">金额：${sasb[i].money}</span>
	            				<span class="print_space_dateTime">时间：${sasb[i].timer}</span>
	            			</div>
	            			<div class="print_space_buyName">抬头：${sasb[i].title}</div>
	            			<div class="sta">状态：</div>
	            			<i class="print_space_delete"></i>
	            			<i class="print_space_preview"></i>
	            			<i class="print_space_blur"></i>
	            		</li>	
					`)
					$(".print_space_list").html(htmlPrint)
				}
				//短信链接
				if(sasb[i].uploadParameter == "msm"){
					var urls
					if(sasb[i].url){
						urls = sasb[i].url
					}else{
						urls = sasb[i].Url
					}
					htmlPrint+=(`
						<li class="print_space_list_msm" data-type = "${sasb[i].uploadParameter}" data-src = "${sasb[i].url}" >
	            			<div class="print_space_name">${sasb[i].buyName}</div>
	            			<div class="print_space_money_msm">
	            				<span class="print_space_money_msm">链接地址：${urls}</span>
	            			</div>
	            			<div class="sta">状态：</div>
	            			<i class="print_space_delete"></i>
	            			<i class="print_space_preview"></i>
	            			<i class="print_space_blur"></i>
	            		</li>	
					`)
					$(".print_space_list").html(htmlPrint)
				}
				//微信票夹
				if(sasb[i].uploadParameter == "wecat"){
					//在这里解时间戳
					var timer = sasb[i].timer
			        var date = new Date(timer * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			        var Y = date.getFullYear() + '年';
			        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
			        var D = date.getDate() + '日';
					var timers = Y+M+D
					htmlPrint+=(`
						<li data-id = "${sasb[i].id}" class="print_space_list_wx" data-type = "${sasb[i].uploadParameter}" data-src = "${sasb[i].url}" >
	            			<div class="print_space_name">${sasb[i].name}</div>
	            			<div class="">
	            				<span class="print_space_money">金额：${sasb[i].money}</span>
	            				<span class="print_space_dateTime">时间：${timers}</span>
	            			</div>
	            			<div class="print_space_buyName">抬头：${sasb[i].title}</div>
	            			<div class="sta">状态：</div>
	            			<i class="print_space_delete"></i>
	            			<i class="print_space_preview"></i>
	            			<i class="print_space_blur"></i>
	            		</li>	
					`)
					$(".print_space_list").html(htmlPrint)
				}
			}
		}
		//在这里执行一次电池，
		battery()
	}
	template()	


	//删除打印发票事件
	$(".print_space_list ").on("tap","li .print_space_delete",function(){
		$(".print_space_blur").css("display","block")
		var Index = $(this).parent().index()
		sasb.splice(Index,1);
		sessionStorage.setItem("allSpace",JSON.stringify(sasb));
		$(this).parent().animate({transform:"translateX(-140%)"},300,function(){
			$(this).animate({height:"0rem"},640,cubicBezier,function(){
				$(this).remove()
				$(".print_space_blur").css("display","none")
				battery()
			})
		})
	})
		//本地上传事件
	$(".main").on("touchstart",function(){
		var status = $(".munber_status").html()
		if(status != "正常"){
			lockers(status)
			return false;
		}
	})

	$(".loca_space").on("change",function(e){

		var file = e.target.files[0]  //拿到change的文件
		if ( !Suffix( file ) ) return;
		
		var len = $(".print_space_list").children("li").length
		if(len== 5) {
			lockers("发票最大数为5")
			return false;
		}
		var reader = new FileReader();
		
		
		
		if(credentials == true){
			reader.onload = function(e) {
			  	SpaceBox({
			  		Url:e.target.result
			  		,name:file.name
			  		,size:Math.round(file.size/1024) + "kb"
			  		,uploadParameter: "file"
			  	})
			  	template()
			}
		}else{
			reader.onload = function(e) {
			  	//alert(e.target.result)
			  	var spaceInfo = {
			  		Url:e.target.result
			  		,name:file.name
			  		,size:Math.round(file.size/1024) + "kb"
			  		,uploadParameter: "file"
			  		}
			  	loadings()
			  	pdfToImage(spaceInfo)  //传进这个方法里面去
			}
		}
		
		reader.readAsDataURL(file);
		location.href ="#print"
		setTimeout(function(){
			$(".loca_space").val("")
		},300)
	})
	
//按钮开关与事件

function hidBtn(){
	if(off == true){
		$('.input_blur_img').animate({transform: " rotate(0deg)"},550,cubicBezier,function(){
			off = false
		})
		$('.input_msm').animate({"transform": "translate(0rem,0rem) scale(0.5)"},250)
		$('.input_ticket').animate({"transform": "translate(0rem,0rem) scale(0.5)"},200)
		$('.input_wx').animate({"transform": "translate(0rem,0rem) scale(0.5)"},180)
		$('.input_loca').animate({"transform": "translate(0rem,0rem) scale(0.5)"},140)
	}
}
function alertBtn(){
	if(off == false){
		$('.input_blur_img').animate({transform: " rotate(225deg)"},550,cubicBezier,function(){
			off = true
		})
		$('.input_msm').animate({"transform": "translate(0,-8.3rem) scale(1)"},500,cubicBezier)
		$('.input_ticket').animate({"transform": "translate(0,-6.3rem) scale(1)"},400,cubicBezier)
		$('.input_wx').animate({"transform": "translate(0,-4.3rem) scale(1)"},300,cubicBezier)
		$('.input_loca').animate({"transform": "translate(0,-2.3rem) scale(1)"},200,cubicBezier)
	}
}

		$('.push_btn').on("touchstart",function(){
				var status = $(".munber_status").html()
				if(status != "正常"){
					lockers("打印机状态错误")
					return false;
				}
		})
		$('.push_btn').on("tap",function(){
			var len = $(".print_space_list").children("li").length
			if(len == 5){
				lockers('最多选择5张发票' );
				return false;
			}
			hidBtn()
			alertBtn()
			return false;
		})
		
		$("body").on("tap",function(){
			hidBtn()
		})
	//按钮开关结束



	
//微信发票
//!!!!!!  	注意！！拉微信发票的时候只会弹一次框，你没有错，错的是这个世界
//!!!!!!  	注意！！拉微信发票的时候只会弹一次框，你没有错，错的是这个世界
//!!!!!!  	注意！！拉微信发票的时候只会弹一次框，你没有错，错的是这个世界
//!!!!!!  	注意！！拉微信发票的时候只会弹一次框，你没有错，错的是这个世界
	$(".input_wx_function").on("tap",function(){
		loadings()
		$.ajax({
			url: constants.config(),
			type: 'GET',
			data: {
				url: location.href.split('#')[0],//@todo 重要：后台需要获取签名使用
			},
			timeout:10000,
			dataType: 'json',
			success: function (res) {
				wx.config({
					beta: true,
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: res.appid, // 必填，公众号的唯一标识
					timestamp: res.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.nonceStr, // 必填，生成签名的随机串
					signature: res.signature,// 必填，签名，见附录1
					jsApiList: ['chooseInvoice','scanQRCode'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			},
			complete: function (xhr) {
				console.log('微信配置：', xhr);
				var status = xhr.status;
				if (status != 200) {
					loadingh()
					if(status == 0){
						
						lockers('配置失败：' );
					}
//					failModal({
//						data: '配置失败:是否重新配置？',
//						cancelText: '否',
//						confirmText: '是',
//					});
				}else{
					$.ajax({
						url: constants.ticketSign(),
						dataType: 'json',
						type: 'GET',
						success: function (res) {
							///拉取发票列表
							////////
							//alert("第一次配置请求成功");
							!function () {
								wx.invoke('chooseInvoice', {
										timestamp: res.timestamp, //卡券签名时间戳
										nonceStr: res.nonceStr, //卡券签名随机串
										signType: 'SHA1', //签名方式，默认'SHA1'
										cardSign: res.cardSign, //卡券签名
									},
									function (res) {
										var msg = res.err_msg
											, invoiceInfo = res.choose_invoice_info
											;
										//alert('拉取发票的信息：' + JSON.stringify(res))
										//alert(JSON.parse(invoiceInfo).length === 0)
											$.ajax({
												url: constants.fetchTicket(),
												data: invoiceInfo,
												type: 'POST',
												dataType: 'json',
												//拉取回来的 choose_invoice_info
												headers: {
													'Content-Type': 'application/json',
												},
												success: function (res) {
													loadingh()
													var wecatSpace = []
													var sec =[]
													for(var i = 0;i<res.length;i++){
														//alert(i);
														var res1 = JSON.parse(res[i])
														//alert(JSON.stringify(res1))
														var  wecatList=[];
														wecatList.push(res1.user_info.pdf_url);
														
														if(credentials == true ){
															wecatSpace.push({
																name:res1.payee,
																timer:res1.user_info.billing_time,
																id:res1.card_id,
																Url:res1.user_info.pdf_url,
																title:res1.user_info.title,
																money:res1.user_info.fee/100,
																openid:res1.openid,
																uploadParameter:"wecat"
															})															
														}else{
															wecatSpace.push({
																name:res1.payee,
																timer:res1.user_info.billing_time,
																id:res1.card_id,
																url:wecatList,
																title:res1.user_info.title,
																money:res1.user_info.fee/100,
																openid:res1.openid,
																uploadParameter:"wecat"
															})
														}
														
														//alert(JSON.stringify(wecatSpace))
														
														SpaceBox(wecatSpace[i])
														template()
														location.href = "#print"
//														var aaa = JSON.stringify(sessionStorage.getItem("allSpace"))
//														lockers(aaa)
													}
													
													console.log('请求发票列表数据成功');
													//渲染发票数据
													/////
													//不存在，返回不操作
													if (0 == res.length) {
														//
														lockers('拉取数据为空!');
														return false;
													}
													//alert(res)
									
									
									
									
												},
												complete: function (xhr) {
													console.log('请求发票列表数据complete: ', xhr);
													var status = xhr.status;
													if (200 != status) {
														loadingh()
														lockers('拉取数据失败！');
													}
												},
											});
										if (!/ok/.test(msg)) {
											//console.warn('拉取发票失败或是取消,choose_invoice_info 为空');
											location.href = "#print"//用户操作 上一页按钮
											// 手机返回键
											return false;
										}
										//一定要 解析为 JSON 对象
										//
										//数据为空
										//alert("微信发票信息"+invoiceInfo);
										if (0 === JSON.parse(invoiceInfo).length) {
										}
										//点击"确定"
										// 先不用管 数据是否为空
										//拉取发票起效
			
									});
			
			
							}();
			
						},
						complete: function (xhr) {
							console.log('发票签名！', xhr);
							var status = xhr.status;		
							if (status != 200) {
								lockers('发票签名失败，无法拉取！');
							}
						},
					});
				}

			},
		});
	})


	//短信打印
	$(".input_msm_function").on("tap",function(){
		$(".msm_print_box").animate({transform:"scale(1)"},200,cubicBezier)
		maskS()
	})
	$(".msm_false").on("tap",function(){
		msmH()
	})
	function msmH(){
		$(".msm_print_box").animate({transform:"scale(0)"},200,cubicBezier)
		$(".msm_print_val").val("")
		maskH()
	}
	
	

	$(".msm_prin_btn").on("tap",".msm_true",function(){
		$(".blurs").css("display","block")
		setTimeout(function(){
			$(".blurs").css("display","none")
		},3000)
		var values = $(".msm_print_val").val()
		if(values == ""){
			$(".msm_prin_ttitle").html("链接不能为空").css("color","red")
			setTimeout(function(){
				$(".msm_prin_ttitle").html("请输入短信链接").css("color","black")
			},3000)
		}else{
				//截取短信里的url
				var Url
				,ap
				,bba
				,we
				,be
				,be2
				,ap
				,https = 'https://' 
				var url = JSON.stringify(values)
				var nn = url.substr(url.length-3,2)
				if(nn == "\\n"){
					 url = url.split('\\n')[0] +'"';
				}
				be = url.split('http')[1];
				be2 = url.split('nnfp')[1];
				if(be){
					Url = "http";
					we = url.split('http')[1];
					ap = Url + we;
				}else	if(be2){
					Url = "nnfp";
					we = url.split('nnfp')[1];
					ap =https + Url + we;
				}else{
					$(".msm_prin_ttitle").html('请输入正确的URL').css("color","red")
					setTimeout(function(){
						$(".msm_prin_ttitle").html("请输入短信链接").css("color","black")
					},3000)
					return false;
				}
				
				if (ap.indexOf('"') != -1) {
					bba = ap.split('"')[0];
				}
				if (ap.indexOf("，") != -1) {
					bba = ap.split("，")[0];
				} 
				if (ap.indexOf(',') != -1) {
					bba = ap.split(',')[0];
				} 
				if (ap.indexOf('  ') != -1) {
					bba = ap.split('  ')[0];
				}  
				if (ap.indexOf(" ") != -1) {
					bba = ap.split(" ")[0];
				}  
				if (ap.indexOf('[') != -1) {
					bba = ap.split('[')[0];
				} 
				if (ap.indexOf('\\n') != -1) {
					bba = ap.split('\\n')[0];
				} 
				
	
			
	//			if (we == undefined) {
	//				$('.mask-loading-wrap').css('display', 'none');
	//				alertModal('请输入正确的URL');
	//				return false;
	//			} else {
					var obj = {};
					obj.url = bba;
					//alert(bba)
					//return false;
					loadings()
					$.ajax({
						type: "post",
						url: constants.urlstatus(),
						async: true,
						data: JSON.stringify(obj),
						headers: {
							'Content-Type': 'application/json'
						},
						complete: function complete(xhr) {
							loadingh()
							var res = xhr.responseText;
							console.log(res)
							var code = JSON.parse(res).code
							var fun = []
							var bbalist=[];
							bbalist.push(bba);
							if (code == 0) {
								//0是成功
								if(credentials == true){
									fun.push({
										Url:bba,
										buyName: "短信链接发票",
										uploadParameter: "msm",
									})
									//把url装进缓存盒子里面去，然后在调用模板方法
									SpaceBox(fun[0])
								}else{
									fun.push({
										url:bbalist,
										buyName: "短信链接发票",
										uploadParameter: "msm",
									})
									//把url装进缓存盒子里面去，然后在调用模板方法
									SpaceBox(fun[0])
								}
								
								template() 
								
								msmH()
								location.href = "#print"
							} else {
								$(".msm_prin_ttitle").html('该url无法解析').css("color","red")
								setTimeout(function(){
									$(".msm_prin_ttitle").html("请输入短信链接").css("color","black")
								},3000)
								return false;
							}
						}
					});
			}
		
		
	})












	//点击打印 时触发
	function printReturn(){
		$(".print_blur_txt").html("发送打印中，请稍等")
		$(".print_blur").animate({transform:"scale(1)"},200,cubicBezier)		
	}
	//打印成功吼掉这个
	function printbtn(){
		$(".print_blur_txt").html("打印完成")
		$(".aj_print_btn").animate({transform:"scale(1)"},600,cubicBezier)
		$("#printmian").html("true")
		$("#printover").html("false")
	}
	//这里要写删除发票的代码
	$(".aj_print_btn").on("tap",function(){
		
		AllSpaceRem()
		$("#printover").html("true")
	})
	function AllSpaceRem(){
		//删除不清空sasb,所以做个空的传进去
		sasb = []
		sessionStorage.setItem("allSpace",JSON.stringify(sasb));
		$(".print_space_list").children("li").animate({transform:"translateX(-140%)"},300,function(){
				$(this).remove()
				battery()
		})
		//$(".aj_input").animate({transform:"translateY(0rem)"},400,cubicBezier)
		$(".print_blur").animate({transform:"scale(0)"},200,cubicBezier)
		$(".aj_print_btn").animate({transform:"scale(0)"},600,cubicBezier)
	}


//打印按钮
$("#print_btn").on("touchstart",function(){
	var val = $("#printToImage").html()
	if(val !="true"){
		lockers("拉取发票中，请稍等")
		return false
	}
})
	$(".print_btn").on("tap",function(){

		var len = $(".print_space_list").children("li").length
		if(len == 0){
			lockers("请先点击底部 + 号添加发票")
			return false;
		}else{
			var spac = JSON.parse(sessionStorage.getItem("allSpace"))

			if(spac.length == 0){
				lockers("请先点击底部 + 号添加发票")
				return false;
			}else{
				var num = 0
				printPlliing() //调这个方法的时候穿个1进去，会启动抽屉插件，不然不会
				if($(".munber_status").html() != "正常"){
					lockers($(".munber_status").html())
					return false;
				}else{
					
					var number = sessionStorage.getItem("printNumber")
					if( !number) return false;
					$(".sta").html("状态：等待中...")
					printReturn()
					if(credentials == true){
						setTimeout(function(){
							$("#printmian").html("false")
							$("#printover").html("false")
							PrintService(num)
						},140)					
					}else{
						setTimeout(function(){
							$("#printmian").html("false")
							$("#printover").html("false")
							Print(num)
						},140)
					}
					
				}
				
			}
			
		}
	})
	
	
	//后端打印模块
	function PrintService(num){
		var len =JSON.parse(sessionStorage.getItem("allSpace")).length
		,space = JSON.parse(sessionStorage.getItem("allSpace"))
		,number = sessionStorage.getItem("printNumber")
		,thr = sessionStorage.getItem('threshold')
		,formData = new FormData()
		,printUrl
		,spaceUrl = space[num].Url
		,spaceType
		if(!thr){
			thr = "178"
		}
		
		formData.append('threshold', thr)
		formData.append('number', number)
		console.log("第"+num+"张开始打印")
		$(".sta").eq(num).html("状态：打印中...")
		//本地文件之外都是调url的接口
		//printUrl是ajax发送数据的url，根据文件类型来确定应该用哪个链接
//		if(space[num].uploadParameter =="file"){
//			spaceUrl = dataURItoBlob(space[num].url)
//			printUrl = constant.uploadFile
//			formData.append('file', spaceUrl)
//			spaceType = "application/pdf"
//		}else{
//			printUrl = constant.urlPrint
//			formData.append('url', spaceUrl)
//			spaceType = "application/url"
//		}		
	var types = space[num].uploadParameter
	
			if( types =="file"){
				printUrl = constants.uploadFile()
				formData.append('file', dataURItoBlob(spaceUrl))
				formData.append('imageAlgorithm', "binarization")
				spaceType = "application/pdf"
			}else{
				printUrl = constants.urlPrint()
				formData.append('url', spaceUrl)
				formData.append('imageAlgorithm', "binarization")
				spaceType = "application/url"
			}

			$.ajax({
				url: printUrl + number,
				type: 'POST',
				dataType: 'json',
				cache: false,//cache设置为false，上传文件不需要缓存
				processData: false,//data值是FormData对象，不需要对数据做处理
				contentType: false,//已经声明了属性enctype="multipart/form-data"，所以这里设置为false
				data: formData,//FormData对象
				headers: {
					'File-Type': spaceType,
					//File-Type：application/jpg(仅支持jpg,png) 或 application/pdf
				},
				complete: function (xhr) {
					var res = JSON.parse(xhr.response)
				//设置信息res.data
					var bs = []
						,info
					for (var i in res.data) {
						bs+= i+":" + res.data[i]+","
						info = bs.substring(0,bs.length-1)
					}
					var html = "";
						$(".sta").eq(num).html('状态：' + info)
						PrintLogSet(num,info)
						var green = $(".sta").eq(num).html()
						if(green == "状态：打印成功") {
							$(".sta").eq(num).css("color", "limegreen")
						} else {
							$(".sta").eq(num).css("color", "red")
						}
					num++
					if(num>len-1){
						num = 0
						printbtn()
						return false;
					}
					PrintService(num) //这个是自己调自己，小心！
				}
			})
		
	}
	
	
	//前端打印模块
	
	function Print(num){
		$(".sta").eq(num).html("状态：打印中...")
		var len =JSON.parse(sessionStorage.getItem("allSpace")).length
		,space = JSON.parse(sessionStorage.getItem("allSpace"))
		,number = sessionStorage.getItem("printNumber")
		,thr = sessionStorage.getItem('threshold')
		,printUrl
		,spaceUrl 
		,spaceType
		if(!thr){
			thr = "178"
		}
		
		
		console.log("第"+num+"张开始打印")
		
		//本地文件之外都是调url的接口
		//printUrl是ajax发送数据的url，根据文件类型来确定应该用哪个链接
		var page=space[num].url.length;
		for(var i=0;i<page;i++){
			var formData = new FormData()
			
			formData.append('threshold', thr)
			formData.append('number', number)
			if(thr!=178){
				//
			}
			
			var types = space[num].uploadParameter
	
			if( types == "msm" || types == "wecat"){
				printUrl = constants.urlPrint()
				formData.append('url', space[num].url)
				formData.append('imageAlgorithm', "binarization")
				spaceType = "application/url"
			}else{
				spaceUrl = dataURItoBlob(space[num].url[i])
				printUrl = constants.uploadFile()
				formData.append('file', spaceUrl)
				formData.append('imageAlgorithm', "binarization")
				spaceType = "application/jpg"
			}
			$.ajax({
				url: printUrl + number,
				type: 'POST',
				dataType: 'json',
				cache: false,//cache设置为false，上传文件不需要缓存
				processData: false,//data值是FormData对象，不需要对数据做处理
				contentType: false,//已经声明了属性enctype="multipart/form-data"，所以这里设置为false
				data: formData,//FormData对象
				async:false,
				headers: {
					'File-Type': spaceType,
					//File-Type：application/jpg(仅支持jpg,png) 或 application/pdf
				},
				complete: function (xhr) {
					var res = JSON.parse(xhr.response)
					//设置信息res.data
						var jsona= JSON.stringify(res.data)
						var jsons=jsona.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,""); 
						var html = "";
						if(i == page - 1) {
							//for(var item in jsona) {
						
							//}
							$(".sta").eq(num).html('状态：' + jsons)
							PrintLogSet(num,jsons)
							var green = $(".sta").eq(num).html()
							if(green == "状态：打印成功") {
								$(".sta").eq(num).css("color", "limegreen")
							} else {
								$(".sta").eq(num).css("color", "red")
							}
							num++
							if(num > len - 1) {
								num = 0
								//printLog()
								printbtn()
								
								return false;
							}else{
								//完了
								
								Print(num) //这个是自己调自己，小心！
							}
								
					}
				
						
				}
			})
		}	
	}

	
	
	//添加打印记录
	
	function PrintLogSet(num,html){
		var userData = JSON.parse(sessionStorage.getItem("loginData"))
		if(!userData) return false;
		var obj = new Object();
		var list = $(".print_space_list").children("li")
		
		var id = list.eq(num).attr("data-id")
		if(id == undefined) return false;
		obj.printResult=html
		obj.invoiceId=id;
		obj.username=userData.user
		console.log(html)
		console.log(id)
		$.ajax({
			url: constants.UserOperationData() ,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj),
			headers: {
				"Content-Type": "application/json",
			},
			success: res => {
			//提示成功
			console.log('发送打印数据成功');
			},
			error: xhr=> {
				console.log(xhr);
			},

		})
	}
	
	
	
	
	
	
	
	
	
	
	//pdf转换组件






	PDFJS.useOnlyCssZoom = true;
	PDFJS.canvasTextContentShow=true;
	PDFJS.disableTextLayer = true;
	PDFJS.cMapUrl = "../js/vendor/cmaps/";
	PDFJS.workerSrc = '../js/vendor/pdf.worker.js';
	PDFJS.cMapPacked = true;


//			这样子传
//			var spaceInfo = {
//		  		Url:e.target.result
//		  		,name:file.name
//		  		,size:Math.round(file.size/1024) + "kb"
//		  		,uploadParameter: "file"
//		  	}

        function pdfToImage(spaceInfo) {
            var url = spaceInfo.Url
            
            PDFJS.getDocument(url).then(function pdfToImgEco(pdf) {
            	var pdfnumlod = pdf.pdfInfo.numPages
            	
            	var acr=[];
            	var Url = []
            	RecursiveCache(1)
            	function RecursiveCache(pdfnum){
            		if(isMobile){
	            		if(pdfnumlod >= 10){
	            			alert('打印发票的页数限制在10页之内')
	            			return false;
	            		}
            		}
              		pdf.getPage(pdfnum).then( function ( page ) {
              			//如果需要解内容的话就释放下面
    	 		//page.getTextContent().then( function ( textContent ) {
        		//	acr.push( JSON.stringify(textContent))
        		//})
	                   var scale = 4;
	                    var viewport = page.getViewport(scale);
	                    var canvas = document.getElementById('the-canvas');
	                    var context = canvas.getContext('2d');
	                    canvas.height = viewport.height;
	                    canvas.width = viewport.width;
	                    var renderContext = {
	                        canvasContext: context,
	                        viewport: viewport
	                    };


	                    page.render(renderContext).promise.then( function () {
							var newSrc= canvas.toDataURL("image/jpeg",clarity)
			            		pdfnum ++
			            		Url.push(newSrc)
			            		console.log('第'+pdfnum+'页')
	       						if(pdfnum == pdfnumlod+1) {
	       							//除了本地文件，其他的都没size
	       							if(spaceInfo.size){
	       								var size = spaceInfo.size
	       							}else{
	       								var size = 0
	       							}
									var info = spaceInfo.uploadParameter
									if(info == "file"){
										SpaceBox({
			       							url:Url
			       							,name:spaceInfo.name
			       							,size:size
			       							,uploadParameter:"file"
			       							,txt:acr
			       						})
									}else if(info == "ticket"){
										SpaceBox({
			       							url:Url
			       							,name:spaceInfo.name
			       							,title:spaceInfo.tit
			       							,uploadParameter:"ticket"
			       							,txt:acr
			       							,money:spaceInfo.money
			       							,timer:spaceInfo.timer
			       							,id:spaceInfo.id
			       						})
										location.href = "#print"
									}
		       			//完成了的标志
		       						setTimeout(function(){
		       							$("#domian").html("true")
		       						},300)
       								loadingh()
									template()
									battery()
	       							//sessionStorage.setItem("allSpace",JSON.stringify(allSpace))
	       							return false;
	       						}
		            			RecursiveCache(pdfnum)
	                    	
						})
	                    




            		})
            	}	
            		
            });
        }
	
	
	
	
	
	
	
	
	
	
	
	
		
//缓存盒子，把发票信息丢进去，他就会存起来，
//多放进去也没关系，里面有限制，自然会收他
//他和模板方法要关联在一起，
	function SpaceBox( fun ){
		var lens = sasb.length
		if(lens<5){
			sasb.push(fun)
		}else{
			 
			lockers("最多只能添加5张")
		}
		
		//console.log(JSON.stringify(sasb))
		sessionStorage.setItem('allSpace',JSON.stringify(sasb))
	}
		








		
/**
 *************************************************************
 * 登陆组件
 *************************************************************
 */




	//拿用户名的
	function userInfo(){
		var user = JSON.parse(sessionStorage.getItem("loginData"))
		if(user){
			$(".user_mane").html(user.user)
		}
	}
	userInfo()
	
	
	//退出登录的
	$(".login_out").on("tap",function(){
		var user = JSON.parse(sessionStorage.getItem("loginData"))
			,userSpace = JSON.parse(sessionStorage.getItem("allSpace"))
			,userThr = JSON.parse(sessionStorage.getItem("threshold"))
			,userTicket = JSON.parse(sessionStorage.getItem("ticket"))
			,userSpaceAlert = JSON.parse(sessionStorage.getItem("spaceT"))
			,userChoose = JSON.parse(sessionStorage.getItem("spacChoose"))
		if(user){
			sessionStorage.removeItem("loginData")
			if(userSpace){
				sessionStorage.removeItem("allSpace")
			}
			if(userChoose){
				sessionStorage.removeItem("spacChoose")
			}
			if(userSpaceAlert){
				sessionStorage.removeItem("spaceT")
			}
			if(userThr){
				sessionStorage.removeItem("threshold")
			}
			if(userTicket){
				sessionStorage.removeItem("ticket")
			}
			window.location.reload()
		}
	})

	
	
	
//输入框的聚焦和失焦事件
		regAccount.on("focus",function(){
			$(".tip_txt").html("请输入以字母开头，6~16位字母与数字的名称")
		}).on("blur",function(){
			var value = $(this).val()
			isUsername(value)
		})
		
		regPassword.on("focus",function(){
			$(".tip_txt").html("请输入以8~20字母与数字组合的密码")
		}).on("blur",function(){
			var pwd = $(this).val()
			isPassword(pwd)
		})
//输入框的聚焦和失焦事件结束

//用户名判断和密码判断
	function isUsername(value) {
		var p = /^[a-zA-Z][a-zA-Z0-9]{5,15}$/;
		if(p.test(value) != true){
			$(".tip_txt").html("账号格式不符合要求")
			$(".acc").css("color","red")
		}else{
			$(".tip_txt").html("")
			$(".acc").css("color","black")
			accSwitch = true
		}
	}
	function isPassword( pwd ){
		var p = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
		if(p.test(pwd) != true){
			$(".tip_txt").html("密码格式错误")
			$(".pwd").css("color","red")
		}else{
			$(".tip_txt").html("")
			$(".pwd").css("color","black")
			pwdSwitch = true
		}
	}
//用户名判断和密码判断结束


//注册按钮
	$(".btn_reg").on("tap",function(){
		if($("#inp1").val() == ""){
			lockers('账号不能为空！')
		}else if($("#inp2").val() == ""){
			lockers('密码不能为空！')
		}else if($("#inp3").val() == ""){
			lockers('确认密码不能为空！')
		}else if($(".checkbox").prop('checked') === false) {
			lockers('请勾选同意注册协议！')
			return false;
		}

		if(accSwitch != true) return false;
		if(pwdSwitch != true) return false;
		if(regPassword.val() != regPassword2.val()){
			 $(".tip_txt").html("两次密码不一致")
			 return false;
		}else{
			$(".tip_txt").html(" ")
		}
		loadings()
		var Password = btoa(regPassword.val())
		var d = sessionStorage.getItem("wxUser");
		var o="";
		if ( d ) o = JSON.parse( d ).openid;
		var data = {
			user: regAccount.val(),
			pwd: Password,
			// email: field.email.val(),
			// mobile: field.mobile.val(),
			// validateCode: field.code.val(),
			// skey: skey,
			weChatOpenId: o
		}
		console.log(data)
	//	return false;
		$.ajax({
				url: constants.register(),
				type: 'POST',
				data: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				},
				complete: function ( xhr ) {
					console.log('注册：', xhr);
					var status = xhr.status;
					loadingh()
					if( status == 201 ){
						//login( { user: data.user, pwd: data.pwd } );
						//注册成功后会自动登录
						var val = {user:data.user, pwd:data.pwd}
						loginF(val)
						
						//location.href = "#center"

					}else if( status == 406 ){
						lockers('参数错误')
					}
					else if( status == 404 ){	
						lockers('密码错误')
					}
					else if( status == 403 ){	
						lockers('用户已存在')
					}
					

				}

			});

	})


		//登陆按钮
	$(".btn_log").on("tap",function(){
		loginF()
	})
	//登录方法
	function loginF(val){
		var logdata
		//带参走if不然走正常登陆
		if(val){
			loadings()
			logdata = {
				user: val.user,
				pwd: val.pwd
			};
		}else{
			var User = $("#log1").val()
			var Pwda = $("#log2").val()
			if(User == "") {
				lockersval="账号不能为空"
				lockers(lockersval)
				return false;
			}
			if(Pwda == ""){
				lockersval ="密码不能为空"
				lockers(lockersval)
				return false;
			}
			loadings()
			var Pwd = btoa(Pwda)
			logdata = {
				user: User,
				pwd: Pwd
			};
	}

			

			$.ajax({
				type: 'POST',
				url: constants.login(),
				data: JSON.stringify(logdata),//{"user":"limo","pwd":"fOmh515"}
				dataType: 'json',
				headers: {
					"Content-Type": "application/json"
				},
	
				complete: function (xhr) {
					var status = xhr.status
						, res = JSON.parse( xhr.responseText )
						, tip
						,user = logdata.user;
						;
						loadingh()
	
					if (status == 201) {
					
						var LoginData = {
							user:user,
							id:res.id,
							token:res.token
						}
						sessionStorage.setItem('loginData', JSON.stringify(LoginData));
						userInfo()
						UpdateInvoice()
						location.href = "#center"
	
					}else if( status == 500 ){
						lockers("登录失败")
					}else{
						if( res.code == 2010 ){
							lockers("用户名不存在")
						}else if( res.code == 2005 ){
							lockers("密码输入错误")
						}else {
							lockers("系统错误")
						}
					}
	
	
				}
			})
	
	}
	//修改密码按钮
	if(isAndroid){
		$(".alter_pwd_inp").on("focus",function(){
			$(".alter_pwd").css("transform","translateY(-30%)")
		}).on("blur",function(){
			$(".alter_pwd").css("transform","translateY(0%)")
		})
	}
 
  
   
   
	$(".btn_alter").on("tap",function(){
		var confirmpwd = $("#alter_new2").val()
			,newPwd = $("#alter_new1").val()
			,oldPwd = $("#alter_lod").val()
			
			 
		var p = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
		if(p.test(newPwd) != true){
			$(".alter_tip").css("color","red")
			$(".alter_tip").html("密码格式错误")
			return false;
		}else{
			$(".tip_txt").html("")
			
		}
	
			if(newPwd == confirmpwd){
				if(confirmpwd == oldPwd){
					$(".alter_tip").css("color","red")
					$(".alter_tip").html("新密码不能与旧密码相同")
					
					return false;
				}else{
					$(".alter_tip").html(" ")
				}
			}else{
				$(".alter_tip").html("两次密码不一致")
				$(".alter_tip").css("color","red")
				return false;
			}
			
			var obj = {
				conFirmPwd: btoa(confirmpwd),
				newPwd: btoa(newPwd),
				oldPwd: btoa(oldPwd),
				validateCode: vscode
			}
			console.log(obj)
			var userInfo = window.sessionStorage.getItem( "loginData" );
        	userInfo ? userInfo = JSON.parse( userInfo ) : userInfo = null;
        	console.log(userInfo.user)
        	console.log(userInfo.token)
            $.ajax({
                    url: constants.password() + userInfo.user,
                    type: "PATCH",
                    dataType: "json",
                    data: JSON.stringify( obj ),
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
//                      "Authorization": "Bearer " + userInfo.token
                    },
                    complete: function( xhr ){
                        var status = xhr.status;
                        // JSON.parse会解析错误 JSON.parse格式 '{ "val": "val" }'
                            // res = JSON.parse( xhr.responseText );
                        if( status == 200 ){
                            $(".alter_tip").html("修改密码成功")
                            $(".alter_tip").css("color","limegreen")
                            $("#alter_new2").val("")
                            $("#alter_new1").val("")
							$("#alter_lod").val("")
                        }else{
 							$(".alter_tip").css("color","red")
                            if( status == 404/* && res.code == 2005*/ ){
                              $(".alter_tip").html("输入旧密码错误")
                            }else if( status == 401 ){
                                console.log( "token值过期或在其他地方登陆" );
                                // token值过期或在其他地方登陆
                                // checkLogin();
                            }else if( status == 500 ){
                                console.log( status );
                            }else{
                            	console.log(status)
                            	$(".alter_tip").html("修改密码错误")
                            }
                        }

                    },
                });
                
                
                
	})

	function previewH(){
		$(".preview_img").attr("src","")
		$(".print_img_preview").animate({"opacity":"0","transform":"rotate(90deg) translateY(100%);"},600,cubicBezier)
	}


//预览图片的大小
	$(function(){
		var height = document.body.clientHeight
		var width = document.body.clientWidth
		$(".print_img_preview").css({
			"width":height,
			"height":width
		})
		$(".preview_img").css("height",$(window).height()*0.88)
		setTimeout(function(){
			var img_h = $(".preview_img").height()/2
			$(".preview_img").css("margin-left","-"+img_h+"px")
		},10)
	})


	//点击阈值调节事件
	$(".click_data_try").children("li").on("touchstart",function(){
		$(".lodin_box").css("transform","rotate(90deg)")
		var threshold = $(this).attr("data-try")
			,index = sessionStorage.getItem("index")
			,spacePreview = JSON.parse(sessionStorage.getItem("allSpace"))
			,formData
			,pdfType
			,src = $(".print_space_list").children("li").eq(index).attr("data-src")
			
			
    	$(this).attr("class","try_in").siblings("li").attr('class',"")
    			
    			//alert(spacePreview[index].uploadParameter == "wecat")
    			if(credentials == true){
    				if(spacePreview[index].uploadParameter != "file"){
						formData= new FormData()
						pdfType = "application/url"
						formData.append('url',spacePreview[index].Url)
						formData.append('threshold',threshold)
						formData.append('imageAlgorithm', "binarization")

					}else{
						formData= new FormData()
						pdfType = "application/pdf"
						formData.append('file', dataURItoBlob(spacePreview[index].Url))
						formData.append('threshold',threshold)
						formData.append('imageAlgorithm', "binarization")

					}
    				
    			}else{
    				if(spacePreview[index].uploadParameter == "wecat"||spacePreview[index].uploadParameter == "msm"){
						formData= new FormData()
						pdfType = "application/url"
						formData.append('url',spacePreview[index].url[0])
						formData.append('threshold',threshold)
						formData.append('imageAlgorithm', "binarization")
	//					if(threshold!=178){
	//						formData.append('imageAlgorithm', "binarization")
	//					}
					}else{
						formData= new FormData()
						pdfType = "application/jpg"
						formData.append('file', dataURItoBlob(spacePreview[index].url[0]))
						formData.append('threshold',threshold)
						formData.append('imageAlgorithm', "binarization")
	//					if(threshold!=178){
	//						formData.append('imageAlgorithm', "binarization")
	//					}
					}
    			}
    			

    	preview( formData,pdfType )
    	
	})

	//阈值界面的保存与取消
	$(".img_save").on("tap",function(){
		var Index = $(".try_in").attr("data-try")
		sessionStorage.setItem("threshold",Index)
		$(".click_data_try").children("li").eq(Index).attr("class","try_in").siblings("li").attr('class',"")
		previewH()
	})
	$(".img_cancel").on("tap",function(){
		previewH()
	})
	$(".method").children("div").on("touchstart",function(){
		$(".lodin_box").css("transform","rotate(0deg)")
	})
	
	//阈值界面设置
	function previewS(){
		setTimeout(function(){
			var img_w = $(".preview_img").width()/2
			$(".preview_img").css("margin-bottom","-"+img_w+"px")
		},10)
		$(".print_img_preview").animate({"opacity":"1","transform":"rotate(90deg) translateY(0%)"},600,cubicBezier)
	}


//阈值调整结束



//阈值预览
	function preview(formData,pdfType){

		var number = sessionStorage.getItem("printNumber")
		if(formData == ""){
			lockers("url发生错误")
			return false;
		}
		loadings()
		$.ajax({
			url: constants.preview() + number,
			type: 'POST',
			dataType: 'json',

			cache: false,//cache设置为false，上传文件不需要缓存
			processData: false,//data值是FormData对象，不需要对数据做处理
			contentType: false,//已经声明了属性enctype='multipart/form-data'，所以这里设置为false
			data: formData,//FormData对象
			headers: {
				'File-Type': pdfType,//item.headerFileType,	//url预览还是pdf预览
			},
			complete: function (xhr) {
				var code = JSON.parse(xhr.response).code
					, base64Image = JSON.parse(xhr.responseText).data
					
				if (0 === code){
					$(".preview_img").attr("src",base64Image)
					previewS()
				}else{
					lockers( JSON.stringify(xhr.response) )
					
				}
				loadingh()
			},

		});
	}

	$(".print_space_list ").on("tap","li .print_space_preview",function(){
		var Index = $(this).parent().index()
		var src = $(this).parent().attr("data-src")
		var type = $(this).parent().attr("data-type")
		var thr = sessionStorage.getItem("threshold")
		var space = JSON.parse(sessionStorage.getItem("allSpace"))
		sessionStorage.setItem("index",Index)
		if(!thr) thr = 178
		
		//用thr来调整谁是in
		if(thr == 98) $(".click_data_try").children("li").eq(0).attr("class","try_in").siblings("li").attr('class',"")
		if(thr == 125) $(".click_data_try").children("li").eq(1).attr("class","try_in").siblings("li").attr('class',"")
		if(thr == 152) $(".click_data_try").children("li").eq(2).attr("class","try_in").siblings("li").attr('class',"")
		if(thr == 178) $(".click_data_try").children("li").eq(3).attr("class","try_in").siblings("li").attr('class',"")
		if(thr == 203) $(".click_data_try").children("li").eq(4).attr("class","try_in").siblings("li").attr('class',"")
		if(thr == 228) $(".click_data_try").children("li").eq(5).attr("class","try_in").siblings("li").attr('class',"")
		if(thr == 250) $(".click_data_try").children("li").eq(6).attr("class","try_in").siblings("li").attr('class',"")
		
		
		
		
		
		
		if(credentials == true){
			if(space[Index].uploadParameter != "file"){
				var formData= new FormData()
				var pdfType = "application/url"
				var Url = space[Index].Url
				formData.append('url',Url)
				formData.append('threshold',thr)
				//if(thr!=178){
					formData.append('imageAlgorithm', "binarization")
				//}
			}else{
				var formData= new FormData()
				var pdfType = "application/pdf"
				var Url = dataURItoBlob(space[Index].Url)
				formData.append('file',Url)
				formData.append('threshold',thr)
				//if(thr!=178){
					formData.append('imageAlgorithm', "binarization")
				//}
			}
		}else{
			if(space[Index].uploadParameter == "wecat"||space[Index].uploadParameter == "msm"){
				var formData= new FormData()
				var pdfType = "application/url"
				var Url = space[Index].url[0]
				formData.append('url',Url)
				formData.append('threshold',thr)
				//if(thr!=178){
					formData.append('imageAlgorithm', "binarization")
				//}
			}else{
				var formData= new FormData()
				var pdfType = "application/jpg"
				var Url = dataURItoBlob(space[Index].url[0])
				formData.append('file',Url)
				formData.append('threshold',thr)
				//if(thr!=178){
					formData.append('imageAlgorithm', "binarization")
				//}
			}
		}
		
		
		
		
		
		
		
		preview( formData,pdfType )

	})

	
});

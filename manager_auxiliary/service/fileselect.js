define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	require("breeze/framework/js/tools/formatJS")(FW);
	FW.register(
		{
			name:"fileselect",			
			param:{
				viewid:"view_fileSelect"
			},
			/**
			*默认的数据结构如下：
			*{
			   dir:xxxx,
			   fileList:[
				<fileName>:{
					type:F文件类型,D目录类型
					selected:true选中，false非选中
				}
			   ],
			   selectedFile:xxxx
			*/
			onCreate:function(){
				this.MY.data = {
					dir :""
				}
				//显示最终视图
				if (this.param.viewid && this.param.viewid != "--"){
					this.API.show(this.param.viewid,this.MY.data);
				}
			},
			public:{
				moveFile:function(fileName,midFilePath,midFileName){
					var param = {
						baseDir : this.MY.data.dir,
						fileName : fileName,
						midFilePath : midFilePath,
						midFileName : midFileName,
						operType  : "DELETE"
					};
					return this.API.doServer("fileOper","",param);
				},
				copyFile:function(fileName,midFilePath,midFileName){
					var param = {
						baseDir : this.MY.data.dir,
						fileName : fileName,
						midFilePath : midFilePath,
						midFileName : midFileName,
						operType  : "copy"
					};
					return this.API.doServer("fileOper","",param);
				},
				showInit:function(){
					this.API.show(this.param.viewid,this.MY.data);
				},
				showQueryDir:function(donotShow){
					//发送业务请求，回调函数{serviceName:参数:{dir,file(为空)
					var param = {
						baseDir:this.MY.data.dir,
						fileName:"",
						content:""
					};
					//数据封装
					var _data = this.API.doServer("fileOper","",param);
					//	获取文件列表
					if(_data.code==0){
						//	将文件列表存入全局变量中
						this.MY.data.fileList = _data.data;
						this.MY.data.selectedFile = null;
						if(donotShow){
							var pics = [];
							for(var i in this.MY.data.fileList){
								pics.push({
									picUrl : i,
									alt : i
								});
							}

							return pics;
						}else{
							//	show，将文件列表一起show到页面上
							this.API.private("showDir",this.MY.data);
						}
					}
					//}
				},
				queryDir : function(){
					//发送业务请求，回调函数{serviceName:参数:{dir,file(为空)
					var param = {
						baseDir:this.MY.data.dir,
						fileName:"",
						content:""
					};
					//数据封装
					var _data = this.API.doServer("fileOper","",param);
					if(_data.code==0){
						if (this.MY.data == null){
							this.MY.data = {};
						}
						this.MY.data.fileList = _data.data;
						return _data.data;
					}
					return null;
				},
				queryFileContent :function(){
					var param = {
						baseDir:this.MY.data.dir,
						fileName:this.MY.data.selectedFile,
						content:""
					};
					var _data = this.API.doServer("fileOper","",param);
					if (_data.code ==0){
						return _data.data;
					}
					else{
						return null;
					}
				},
				showQueryFile:function(){
					var _data = this.queryFileContent();
					this.API.trigerOtherEvent("getFile",_data);
				},
				saveFile:function(file){
					var param = {
						baseDir:this.MY.data.dir,
						fileName:this.MY.data.selectedFile,
						content:file
					};	
					var code = this.API.doServer("fileOper","",param).code;
					if(code==0){
						alert("文件保存成功");
						this.API.trigerOtherEvent("svaeFileOk",param);
					}
				},
				deleteFile:function(){
					var param = {
						baseDir:this.MY.data.dir,
						fileName:this.MY.data.selectedFile,
						operType:'DELETE'
					};	
					var code = this.API.doServer("fileOper","",param).code;
					if(code==0){
						alert("文件删除成功");
						this.API.trigerOtherEvent("deleteFileOk",param);
					}
					return code;
				},
				getPath:function(){
					return this.MY.data.dir;
				},
				setPath:function(dir){ 
					if(this.MY.data == null){
						this.MY.data = {};
					}
					
					this.MY.data.dir = dir;
				},
				getFile : function(){
					return this.MY.data.selectedFile;
				},
				setFile : function(f){
					if(this.MY.data == null){
						this.MY.data = {};
					}
					this.MY.data.selectedFile = f;
				},
				setFileName :function(fName){
				    if (!this.MY.data){
						this.MY.data = {};
					}
					this.MY.data.selectedFile = fName;
				},
				getFileName:function(){
					return this.MY.data.selectedFile;
				}
			},
			private:{
				showDir:function(data){
					this.API.show(this.param.viewid,data);
				}
			},
			FireEvent:{
				selectDir:function(inputId){
					var _this = this;
					var dom =_this.API.find("#"+inputId);
					//获取节点id名称和值
					var inputValue = dom.val();
					//将该数据存入全局变量中
					_this.MY.data.dir = inputValue;
					this.showQueryDir();
				},
				selectFile:function(inputId){
					//获取当前选中的那个文件节点
					this.MY.data.selectedFile = this.API.find("#"+inputId).val();
					var selectObj = this.MY.data.fileList[this.MY.data.selectedFile];
					//合并城全路径
					if (selectObj.type == "D"){
						this.MY.data.dir = this.MY.data.dir.replace(/[\\\/]\s*$/,"") + ("/" + this.MY.data.selectedFile);
						this.showQueryDir();
						return;
					}
					this.showQueryFile();
				}
			},
			TrigerEvent:{
				saveFile:function(file){
					this.saveFile(file);
				}
			}
		}
	);
	return FW;
});
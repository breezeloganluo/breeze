<%--
	使用模拟数据完成请求响应。
	接收参数：
	basedir：基本文件目录路径，
	filename：文件名，不传缺省是testdata.js
	如果请求在模拟文件中存在，则将文件中的响应结果返回。
	如果请求的数据在文件中不存在，那么就将该请求存入文件中，并返回对应的结果。
 --%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.databus.*"%>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@ page import="com.breeze.support.tools.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.breeze.support.cfg.Cfg"%>
<%
	String basedir = session.getServletContext().getRealPath("/");
	//+[读入模拟数据]
	//从参数中读入路径
	String file = request.getParameter("file");
	String dir = request.getParameter("dir");
	//从参数中读入文件，没有则用默认值
	if (dir == null){
		dir = "manager_auxiliary/data/";
	}
	if (file == null){
		file = "testdata.js";
	}
	//合并文件路径
	String allDir = basedir + dir + file;
	//读入文件内容
	String content = FileTools.readFile(allDir,"utf-8");
	//转成breezeContext结构
	BreezeContext rootCtx = new BreezeContext();
	if (content != null){
		rootCtx = ContextTools.getBreezeContext4Json(content);
	}
	//-[读入模拟数据]
	
	//+[处理请求参数]
	String paramData = request.getParameter("data");
	if (paramData == null){
		return;
	}
	BreezeContext paramContext = ContextTools.getBreezeContext4Json(paramData);
	if (paramContext == null){
		//向屏幕输出对应调试信息
		System.out.println("paramContext == null");
		return;
	}

	if (paramContext.getType()!= BreezeContext.TYPE_ARRAY){
		//向屏幕输出调试信息
		System.out.println("paramContext.getType()!= BreezeContext.TYPE_ARRAY");
		return;
	}
	//-[处理请求参数]
	BreezeContext result = new BreezeContext();	
	boolean fileChange = false;
	//下面开始循环，处理每一个服务。
	//定义文件变化标识
	for (int i=0;i<paramContext.getArraySize();i++){
		BreezeContext sObj = paramContext.getContext(i);
		String packageName = sObj.getContext("package").getData().toString();
		String serviceName = sObj.getContext("name").getData().toString();	
	    //获取单个请求的参数：root.setContext("_R", sObj.getContext("param"));    
	   	BreezeContext paramCtx = sObj.getContext("param");
	   	if (paramCtx!=null && paramCtx.isNull()){
	   		paramCtx = null;
	   	}

	    //获取模拟数据package下的对象
	    BreezeContext smPackage = rootCtx.getContext(packageName);
	    //设置符合标识
	    boolean hasResult = false;
	    BreezeContext oneResult = new BreezeContext();
	    //if (是否存在：是){
	    if (smPackage != null){

	    	//获取模拟数据pageage下面的serviceName
	    	BreezeContext smService = smPackage.getContext(serviceName);
	    	//if(service是否存在:是){
	    	if (smService != null){
	    		//for (service下的参数){
	    		for (String smPName:smService.getMapSet()){
	    			//获取单个参数信息并转化
	    			BreezeContext smOne = smService.getContext(smPName);
	    			//if (三个参数信息和实际请求参数是否相同:是){
	    			BreezeContext smParam = null;
	    			if (smOne.getContext("param") != null){
	    				String smParamStr = smOne.getContext("param").toString();
	    				smParam = ContextTools.getBreezeContext4Json(smParamStr);
	    			}

					if ((smParam != null && smParam.equals(paramCtx))||(smParam == paramCtx)){
						//设置符合标识
	    				hasResult = true;
	    				//读入对应的结果
	    				oneResult.setContext("code", smOne.getContext("code"));
	    				BreezeContext dataResult = ContextTools.getBreezeContext4Json(smOne.getContext("data").toString());
	    				oneResult.setContext("data", dataResult);
	    				//将结果赋值
	    				result.pushContext(oneResult);
	    				//break;
	    				break;
					}
	    			//}else{
	    			else{
	    				//continue;
	    				continue;
	    			}
	    			//}
	    		}
	    		//)
	    	}
	    	//}
	    }
	    //}
	    //if(符合标识不存在){
	    if (!hasResult){
	    	//设置文件变化标识
	    	fileChange = true;
	    	//+[将重新写入一个结果]
	    	//加入package的BreezeContext
	    	if (smPackage == null){
	    		smPackage = new BreezeContext();
	    		rootCtx.setContext(packageName, smPackage);
	    	}
	    	//加入serviceName的BreezeContext
	    	BreezeContext smService = smPackage.getContext(serviceName);
	    	if (smService == null){
	    		smService = new BreezeContext();
	    		smPackage.setContext(serviceName, smService);
	    	}	    	
	    	//随机产生一个名称
	    	String smPName = "p"+System.currentTimeMillis();
	    	BreezeContext smPObj = new BreezeContext();
	    	//处理参数的json字符串
	    	if (paramCtx == null){
	    		smPObj.setContext("param", paramCtx);
	    	}else{
	    		smPObj.setContext("param", new BreezeContext(ContextTools.getJsonString(paramCtx,null)));
	    	}
	    	//处理code的json字符串
	    	smPObj.setContext("code", new BreezeContext("-100"));
	    	//处理data的json字符串
	    	smPObj.setContext("data", new BreezeContext("\"no data in file\""));
	    	//将结果写入BreezeContext
	    	smService.setContext(smPName, smPObj);
	    	//设置返回结果
	    	oneResult = new BreezeContext();
	    	oneResult.setContext("code", new BreezeContext("-1000"));
			oneResult.setContext("data", new BreezeContext("no data in file"));
			//将结果赋值
			result.pushContext(oneResult);
	    	//-[将重新写入一个结果]
	    }
	    //}
	}
	//if (文件变化标识：是){
	if (fileChange){
		//重新生成文件字符串
		String fileContnt = ContextTools.getJsonString(rootCtx, null);
		//将文件写入磁盘
		FileTools.writeFile(allDir, fileContnt, "utf-8");
	}
	//}
	response.getWriter().write(ContextTools.getJsonString(result, null));
%>
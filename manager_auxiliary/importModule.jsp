<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.util.regex.*"%>
<%@page import="java.sql.*"%>
<%@page import="com.breeze.framwork.databus.*"%>
<%@page import="com.breezefw.framework.init.service.Log4jInit"%>
<%@page import="com.breeze.support.tools.*"%>
<%@page import="com.breeze.support.cfg.*"%>
<%@page import="com.breeze.framwork.netserver.*"%>
<%@page import="com.breeze.base.db.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@include file="./hHead.jsp"%>
<%
	//所有的cms方法都加入了session校验，所以要加一个假的session才能通过
	BreezeContext sessionManagerCtx = new BreezeContext();
	sessionManagerCtx.setContext("role",new BreezeContext());
	session.setAttribute("manager",sessionManagerCtx);
%>
<%
    String[] isGo = request.getParameterValues("isGo");
    String impData = request.getParameter("impData");
	if (isGo == null || 0==isGo.length){
		//先选择要导入到文件
		String dir = Cfg.getCfg().getRootDir()+"WEB-INF/classes/module/";
		DirManager dMgr = new DirManager(dir);
		ArrayList<File> files = dMgr.getAllFile(null);
%>
	<html>
		<head>
			<link rel="shortcut icon" href="./img/icon/importmodule.jpg" >
			<script src="../breeze/lib/js/jquery.js" type="text/javascript"></script>
			<title>导入CMS模型</title>
		</head>
	
	<body>
		<form action="importModule.jsp" method="post">
		是否要导入数据(只在新曾模型时有效):<input type='checkbox' name='impData' value="true"/><br/>
		-------------------------------------------------------------------<br/>
		请选择要导入到文件：<br/>
			<div class="all">
			<%for(File f:files){%>
				<%if(!f.getName().equals("channel.mod")&&!f.getName().equals("channelClass.mod")){%>
			  		<input type='checkbox' name='isGo' value="<%=f.getName()%>"/><%=f.getName()%><br>
			  	<%}%>
			<%}%>
			</div>
			<input type="submit" value="ok"/>
			<input type="button" value="Select All" id="SelectAll"/>
		</form>
	</body>
	<script>
			$("#SelectAll").click(function () {
                var _leg = $(".all").find("input:checkbox").length;
                var _leg1 = $(".all").find("input:checked").length;
                if (_leg == _leg1) {
                    $(".all").find("input:checkbox").attr("checked", false)
                }
                else {
                    $(".all").find("input:checkbox").attr("checked", true)
                }
            })
		</script>
	</html>
<%
	}else{
		String sql = null;
		try{
		//+ 开始导入
		//将文件名字信息加入hashSet中
		HashSet<String> fileNameSet = new HashSet<String>();
		for (int i=0;i<isGo.length;i++){
			fileNameSet.add(isGo[i]);
		}
		//  查询所有的cmsmetadata表信息
		sql = "select * from cmsmetadata";
		ResultSet rs = COMMDB.executeSql(sql);
		BreezeContext metadataCtx = new BreezeContext();
		HashSet<String>aliasSet = new HashSet<String>();
		//  while(结果集){
		while(rs.next()){
		//    将cmsmetadata信息记录到breezeContext中，alias为key
			BreezeContext oneCtx = new BreezeContext();
			for (int i = 0; i < rs.getMetaData().getColumnCount(); i++) {
				// 得到结果集中的列名
				String culomnName = rs.getMetaData().getColumnName(
						i + 1);								
				// 得到每个列名的值，并把值放入BreezeContext
				oneCtx.setContext(culomnName, new BreezeContext(
						rs.getString(culomnName)));
			}
			metadataCtx.setContext(oneCtx.getContext("alias").toString(), oneCtx);
			aliasSet.add(oneCtx.getContext("alias").toString());
		//  }
		}		
		//  关闭连接
		rs.close();
		//  查询所有wg_channelclass表信息
		sql = "select * from wg_channelclass";
		rs = COMMDB.executeSql(sql);
		BreezeContext nodeCtx = new BreezeContext();
		//  while(结果集){
		while(rs.next()){
		//    将wg_channelclass信息记录到breezeContext中，displayName为key
			BreezeContext oneCtx = new BreezeContext();
			for (int i = 0; i < rs.getMetaData().getColumnCount(); i++) {
				// 得到结果集中的列名
				String culomnName = rs.getMetaData().getColumnName(
						i + 1);								
				// 得到每个列名的值，并把值放入BreezeContext
				oneCtx.setContext(culomnName, new BreezeContext(
						rs.getString(culomnName)));
			}
			nodeCtx.setContext(oneCtx.getContext("displayName").toString(), oneCtx);
		}
		//  }
		//  关闭连接
		rs.close();
		
		
		//合并文件路径
		String dir = Cfg.getCfg().getRootDir()+"WEB-INF/classes/module/";
		DirManager dMgr = new DirManager(dir);
		ArrayList<File> files = dMgr.getAllFile(null);
		//罗光瑜修改，是否要修改CMS视图，要另外做一个标识
		boolean hasChangeCMSView = false;
		out.println("倒入表结构 :<br/>");
		
		//处理alias依赖的问题，采用预判重复导入法，即，每轮如果前置alias未导入就跳过，下一轮继续
		HashSet<String> importedAlias = new HashSet<String>();
		int lastImportCount = -1;
		while(true){
			//if (上次数量没有变化或者一定满了，且不是第一次){结束了
			if (lastImportCount!=-1 &&(importedAlias.size() == lastImportCount || importedAlias.size() == fileNameSet.size())){
				break;
			}
			//}
			lastImportCount = importedAlias.size();
			//while(便利所有文件){第一次仅仅倒入表结构，其他什么都不做
			for (File f:files){			
				//  读入其中一个文件
				String oneFileStr = FileTools.readFile(f, "UTF-8");
				//  if (判断文件内容是否是存储过程：是){
					Pattern p = Pattern.compile("^CREATE\\s+PROCEDURE\\s+`(\\w+)`");
					Matcher m = p.matcher(oneFileStr);
					if (m.find()){
						//存储过程不做任何操作
						continue;
					}
				//  }
				
				//如果没有选择，则不读取
				if (!fileNameSet.contains(f.getName())){
					continue;
				}
				BreezeContext oneFileCtx = ContextTools.getBreezeContext4Json(oneFileStr);
				String alias = oneFileCtx.getContext("alias").toString();
				if (importedAlias.contains(alias)){
					continue;
				}
				out.println("importing :"+f.getName() +"<br/>");
				//  if (当前文件中的alias是否已经加入到cmsmetadata中:是){	
				if (aliasSet.contains(alias)){
					  //组合一个外部调用breeze的上下文结构
					BreezeContext cidCtx = metadataCtx.getContext(alias).getContext("cid");
					oneFileCtx.setContext("cid", cidCtx);
					  //用call方法调用修改模型的brz
					BreezeContext result = FunctionInvokePoint.getInc().breezeInvokeUsedCtxAsParam("cms", "modifyCMSType", oneFileCtx,request,response);
					if (result == null || result.getContext("code") == null){
						out.println("no result come back from addCMSType");
						return;
					}
					if (!"0".equals(result.getContext("code").toString())){
						out.println("result code from addCMSType is:"+result.getContext("code"));
						return;
					}
					importedAlias.add(alias);
				}
				//  }else{
				else{
					//if (先查询出对应的挂接父节点是否存在:存在){
					String nodeDisplayName = oneFileCtx.getContext("nodeName").toString();
					if (nodeCtx.getContext(nodeDisplayName)!=null){
						//找出对应nodeid，并记录赋值，供下面创建消息用
						BreezeContext nodeidCtx = nodeCtx.getContext(nodeDisplayName).getContext("cid");
						oneFileCtx.setContext("nodeid", nodeidCtx);
					}
				  	//}else{
				  	else{
					  	//先插入wg_channelclass，并记录返回的nodeid
					  	sql = "insert into wg_channelclass(displayName,alias)values('"+nodeDisplayName+"','channelClass')";
					  	int[] res = COMMDB.executeUpdateGetGenrateKey(sql);				  	
					  	//将nodeid记录并赋值，供下面创建消息用
					  	oneFileCtx.setContext("nodeid", new BreezeContext(res[1]));
					  	//2014-04-29罗光瑜修改，插入的信息要重新插入到nodeCtx中，否则会被重复插入节点
					  	BreezeContext oneNode = new BreezeContext();
					  	oneNode.setContext("cid", new BreezeContext(res[1]));
					  	oneNode.setContext("displayName",new BreezeContext(nodeDisplayName));
					  	nodeCtx.setContext(nodeDisplayName, oneNode);
				  	}
				  	//}
				  	//判断该加入对象是否有前置的其他模型
				  	String dataDescStr = oneFileCtx.getContext("dataDesc").toString();
				  	BreezeContext dataDescCtx = ContextTools.getBreezeContext4Json(dataDescStr);
				  	boolean prifixOk = true;
				  	for (String fieldName:dataDescCtx.getMapSet()){
				  		BreezeContext ourterLinkCtx = dataDescCtx.getContext(fieldName).getContext("ourterLink");
				  		String outLinkStr = ourterLinkCtx.toString();
				  		if ("".equals (outLinkStr)){
				  			continue;
				  		}
				  		String prealias = outLinkStr.split("\\.")[0];
				  System.out.println("--found preAlias:"+prealias);
				  		if (!importedAlias.contains(prealias)){
				  			prifixOk = false;
				  System.out.println("--alias "+alias + " prealias "+prealias + "not found!");
				  			break;
				  		}
				  	}
				  System.out.println("prifixOk:"+prifixOk);
				  	if (!prifixOk){
				  		continue;
				  	}
				  	//*/
				  	
				  	//用call方法调用增加模型的brz
					BreezeContext result = FunctionInvokePoint.getInc().breezeInvokeUsedCtxAsParam("cms", "addCMSType", oneFileCtx,request,response);
					if (result == null || result.getContext("code") == null){
						out.println("no result come back from addCMSType");
						return;
					}
					if (!"0".equals(result.getContext("code").toString())){
						out.println("result code from addCMSType is:"+result.getContext("code"));
						return;
					}
					importedAlias.add(alias);
				}			
			}
			//}
		}
		//}
		out.println("表导入结束，导入："+fileNameSet.size() +"个，实际导入："+importedAlias.size()+"<br/>");
		
		out.println("倒入数据和触发器 :<br/>");
		//while(便利所有文件){下面进行倒入数据和操作存储过程以及触发器的处理
		for (File f:files){
			
			//  读入其中一个文件
			String oneFileStr = FileTools.readFile(f, "UTF-8");
			//  if (判断文件内容是否是存储过程：是){
				Pattern p = Pattern.compile("^CREATE\\s+PROCEDURE\\s+`(\\w+)`");
				Matcher m = p.matcher(oneFileStr);
				if (m.find()){
			//		删除原来的存储过程
					String pName = m.group(1);
					sql = "DROP PROCEDURE IF EXISTS "+pName;
					COMMDB.executeUpdate(sql);
			//      创建新的存储过程
					sql = oneFileStr;
					COMMDB.executeUpdate(sql);
			//		结束当前循环;
					continue;
				}
			//  }
			
			//如果没有选择，则不读取
			if (!fileNameSet.contains(f.getName())){
				continue;
			}
			out.println("importing data:"+f.getName() +"<br/>");
			//  if (当前文件中的alias是否已经加入到cmsmetadata中:是){
			BreezeContext oneFileCtx = ContextTools.getBreezeContext4Json(oneFileStr);
			String alias = oneFileCtx.getContext("alias").toString();
			//下面进行数据导入操作
			if ("true".equals(impData)){
				if ("cmsview".equals(alias)){
					hasChangeCMSView  = true;
				}
				BreezeContext impDataCtx = oneFileCtx.getContext("data");
				if (impDataCtx != null && !impDataCtx.isNull() && !impDataCtx.isEmpty()){
					//先清除原来表数据
					sql = "delete from "+oneFileCtx.getContext("tableName");
					boolean tableNoExist = false;
					try{
						COMMDB.executeUpdate(sql);
					}catch(SQLException dbe){
						if (dbe.getErrorCode() != 1146){
							out.println("数据库错误"+(dbe.getErrorCode() != 1146));
							dbe.printStackTrace();
							return;
						}
						tableNoExist = true;
					}
					for (int i=0;!tableNoExist && impDataCtx.getType()==BreezeContext.TYPE_ARRAY && i<impDataCtx.getArraySize();i++){
						BreezeContext oneCtxData = impDataCtx.getContext(i);
						String impSql = "insert into "+oneFileCtx.getContext("tableName");
						boolean isFirst = true;
						String fName = "";
						String v = "";
						ArrayList valueList = new ArrayList();
						for (String ffN:oneCtxData.getMapSet()){
							if (isFirst){
								isFirst = false;
							}else{
								fName+=',';
								v+=',';
							}
							fName += ffN;
							v+='?';
							valueList.add(oneCtxData.getContext(ffN).getData());
						}
						impSql = impSql+"("+fName+")values("+v+")";
						sql = impSql;
						COMMDB.executeUpdate(impSql,valueList);
					}						
				}
			}
			
			
			//+下面处理触发器
			//if(存在触发器){
			BreezeContext trigerCtx = oneFileCtx.getContext("triger");
			if (trigerCtx!=null){
				String table = 	oneFileCtx.getContext("tableName").toString();
				String tAlias = oneFileCtx.getContext("alias").toString();
				//如果这个alias实际是导入失败的，就不要加载它的触发器
				if (!importedAlias.contains(tAlias)){
					out.println("alas "+tAlias + "没有导入，将被忽略!<br/>");
					continue;
				}
			//	for (遍历这个表的每个触发器){
				for (String tKey:trigerCtx.getMapSet()){
			//    针对每个触发器
					String[] names = tKey.split(":");
					String trigerName = names[0];
					String event = names[1];
					String time = names[2];
			//    先删除原来的
					sql = "drop trigger "+trigerName;
					try{
						COMMDB.executeUpdate(sql);
					}catch(Exception e){}
			//    合并新sql并创建新的sql语句 create trigger t_trigger before insert on t  for each row
					sql = "create trigger "+ trigerName + ' '+ time +' '+ event +" on "+ table +"  for each row\n"+trigerCtx.getContext(tKey).toString();
					COMMDB.executeUpdate(sql);
				}
			//  }
			}
			//}			
		}
		//}
	
		//2014-07-31日罗光瑜修改
		if (hasChangeCMSView){
			COMMDB.executeUpdate("update cmsmetadata c,wg_cmsview v set v.nodeid=c.cid ,v.alias='cmsview' where  v.alias = c.alias");
		}
%>
		<html>
		<body>
			操作成功！
		</body>
		</html>
<%
	}catch(Exception e){
		out.println("异常了<br/>sql:"+sql);
		e.printStackTrace();
	}
	}
%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="com.breeze.framwork.databus.BreezeContext" %>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@ page import="com.breeze.framwork.databus.*"%>
<%@ page import="java.util.*" %>
<%@ page import="java.io.*"%>
<%@ page import="com.breeze.support.cfg.*"%>
<%@ page import="com.breeze.framwork.servicerg.*"%>
<%@ page import="com.breeze.support.tools.*"%>
<%@ page import="com.google.gson.*" %>
<%@ page import="java.text.*" %>

<%
	request.setCharacterEncoding("UTF-8");
	//+接受参数有两个baseDir,fileName,content(内容)，当只有baseDir时，返回baseDir对应的文件列表，当fileName存在时返回fileName内容，当content存在时，写入文件
	//读入baseDir,fileName,content三个参数
	BreezeContext root = ContextMgr.getRootContext();
	String baseDirC = root.getContext("_R").getContext("baseDir").toString();
	String baseDir = ("".equals(baseDirC) ? "" : baseDirC);

	String fileNameC = root.getContext("_R").getContext("fileName").toString();
	String fileName = ("".equals(fileNameC) ? "" : fileNameC);

	BreezeContext contentC = root.getContext("_R").getContext("content");
	String contentCK = (contentC!=null)?contentC.toString():null;

	//下面两个是目标文件路径和目标文件名
	BreezeContext _contentP = root.getContext("_R").getContext("midFilePath");
	String midFilePath = (_contentP == null || _contentP.isNull()) ? null : _contentP.toString();

	BreezeContext _contentN = root.getContext("_R").getContext("midFileName");
	String midFileName = (_contentN == null || _contentN.isNull()) ? null : _contentN.toString();

    //下面参数说明，是否删除原文件operType=DELETE
    BreezeContext _operType= root.getContext("_R").getContext("operType");
	String operType = (_operType == null || _operType.isNull()) ? null : _operType.toString();
	
	BreezeContext content = new BreezeContext();
	if(!(null == contentCK|| "".equals(contentCK))){
		content = contentC;
	}

	//if (baseDir不存在){
		//返回错误
	//}
	if(baseDir==null||baseDir.equals("")){
		String error = "{\"code\":999}";
		out.println(error);
		return;
	}
	//合成实际目录
	String dir = session.getServletContext().getRealPath("/") + baseDir;
	String backupBase = session.getServletContext().getRealPath("/backup/") + baseDir;
	baseDir = dir;
	//用baseDir创建目录
	File base = new File(baseDir);
	base.mkdirs();
	//if (fileName不存在){
	if(fileName==null||fileName.equals("") && operType==null){
		//读入目录列表，
		BreezeContext brzList = new BreezeContext();
		File[] fs = base.listFiles();
		//for(目录下的列表文件){
		for(int i=0;i<fs.length;i++){
			//if (.开头){
			if(fs[i].getName().startsWith(".")==true){
				//continue;
				continue;
			//}
			}
			//读入文件类型
			String fileType = fs[i].isFile()?"F":"D";
			BreezeContext fileContext = new BreezeContext();
			fileContext.setContext("type",new BreezeContext(fileType));
			//将内容写入到breezeContext中
			brzList.setContext(fs[i].getName(),fileContext);
		//}
		}
		//合成结果字符串，
		BreezeContext outStr = new BreezeContext();
		outStr.setContext("code",new BreezeContext("0"));
		outStr.setContext("data",brzList);
		//向外输出
		String str = ContextTools.getJsonString(outStr, null);
		out.print(str);
		//return
		return;
	//}
	}

	//合成文件名
	//if (content不存在){
	if((contentCK==null||contentCK.equals("")) && operType==null){
	    //2014-08-10号 罗光瑜修改，先增加对文件的存在性判断
		File rdf = new File(baseDir+"/"+fileName);
		BreezeContext brz = new BreezeContext();
		if (!rdf.exists()){
			brz.setContext("code",new BreezeContext("30"));
		}else{
			//读入文件内容
			String fileStr = FileTools.readFile(rdf, "UTF-8");
			//写入到BreezeContext中
			brz.setContext("code",new BreezeContext("0"));
			brz.setContext("data",new BreezeContext(fileStr));
		}
		//合成结果字符串
		String str = ContextTools.getJsonString(brz, null);
		//向外输出
		out.print(str);
		//return
		return;
	//}
	}
	//+剩下的就是写入情况
	//用content和合成的文件名，写入文件
	String saveDir = baseDir + "/" + fileName;
	//合成合法的结果breezeContext
	String fileString = null;
	if (contentCK!=null && contentCK != "" && !contentCK.equals("move") && content.getType() == BreezeContext.TYPE_DATA){
		fileString = contentCK;
	}

	//若存在目标路径 则剪切过去
	if(midFilePath != null){
		try { 
			String oldFileStr = saveDir;
           	File oldfile = new File(oldFileStr); 
       		String newPath = session.getServletContext().getRealPath("/") + midFilePath + "/" + midFileName;
       		if (oldfile.exists()) { //文件存在时 
       			int bytesum = 0; 
           		int byteread = 0; 
               	InputStream inStream = new FileInputStream(oldfile); //读入原文件 
               	FileOutputStream fs = new FileOutputStream(newPath); 
               	byte[] buffer = new byte[1444]; 
               	int length; 
               	while ( (byteread = inStream.read(buffer)) != -1) { 
                   	bytesum += byteread; //字节数 文件大小 
                   	fs.write(buffer, 0, byteread); 
               	} 
               inStream.close(); 
           	} 
       } catch (Exception e) { 
           System.out.println("移动单个文件操作出错"); 
           e.printStackTrace();
       }
	}
	//如果文件内容存在就写入内容
    if(fileString!=null && !"".equals(fileString)){
	    //写入备份
		//转换成结果字符串
		FileTools.writeFile(saveDir,fileString, "utf-8");
		//2015-06-17写入备份文件，备份文件就是目录保持原来，在前面加一个backup，后面以文件名为目录，以时间戳为文件名
		String backDir = backupBase+'/' + fileName;
	    base = new File(backDir);
		base.mkdirs();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String datefn  = sdf.format(new Date());
		backDir += ("/"+datefn+".bak");
		FileTools.writeFile(backDir,fileString, "utf-8");
	}

	//如果操作类型不为空，且为DELETE则把源文件删除掉
	if (operType!=null && "DELETE".equals(operType)){
		String oldFileStr = saveDir;
       	File oldfile = new File(oldFileStr); 
       	oldfile.delete();
	}

	//向外输出
	String success = "{\"code\":0}";
	out.println(success);
	return;
%>
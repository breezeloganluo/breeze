<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.breeze.framwork.databus.*"%>
<%@page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@page import="com.breezefw.service.cms.module.CMSMetadata"%>
<%@page import="com.breezefw.service.cms.*"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Map"%>
<%@page import="com.breeze.support.cfg.Cfg"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="java.io.File"%>
<%!
	private List<String> getGadget(String basePath,String template,File ... files){
		List<String> list = new ArrayList<String>();
		for(File file : files){
			if(file.isDirectory()){
				list.addAll(getGadget(basePath,template,file.listFiles()));
			}else if(file.isFile()){
				if(file.getName().indexOf("js")!=-1){
					String _path = file.getPath().replace(basePath, "");
					_path = _path.substring(0,_path.length()).replace("\\","/");
					if(_path.startsWith("/")){
						_path = _path.replaceFirst("/", "");
					}
					if(_path.indexOf("CMSMgrResource") != -1 || _path.indexOf("resource") != -1){
						if(_path.indexOf(template) == -1){
							continue;
						}
					}
					list.add("'"+_path+"'");
				}
			}
		}
		return list;
	}
%>
<%
String baseUrl = this.getServletContext().getContextPath();
String configUrlPrefix = Cfg.getCfg().getString("siteprefix");
if (configUrlPrefix !=null && !configUrlPrefix.equals("--")){
	baseUrl = configUrlPrefix;
}
if ("/".equals(baseUrl)){
	request.setAttribute("B","/");
	baseUrl = "";
}else{
	request.setAttribute("B",baseUrl+'/');
}

request.setAttribute("S",baseUrl+"/breeze.brz");
request.setAttribute("_","$");

//2014-06-17罗光瑜修改，增加对cms ·metadata的处理
String alias = request.getParameter("alias");
String path = CmsIniter.COMSPATHPRIFIX + "."+alias;
BreezeContext aliasContext = ContextMgr.global.getContextByPath(path) ;
BreezeContext allContext = ContextMgr.global.getContextByPath(CmsIniter.COMSPATHPRIFIX);

BreezeContext bc = new BreezeContext();
for(String key:allContext.getMapSet()){
	CMSMetadata cmsMd = (CMSMetadata)allContext.getContext(key).getData();
	BreezeContext dataMemo = cmsMd.getDataMemo();
	if (dataMemo != null && !dataMemo.isEmpty()){
		BreezeContext aliasCfg = dataMemo.getContext("aliasCfg");
		BreezeContext _bc = new BreezeContext();
		//遍历并读取里面所有的配置
		if (aliasCfg!=null && !aliasCfg.isEmpty()){
			for (String keyName:aliasCfg.getMapSet()){
				_bc.setContext(keyName, aliasCfg.getContext(keyName));
			}
		}
		bc.setContext(key, _bc);
	}
}
if(bc!=null&&!bc.isNull()){
	request.setAttribute("customized", ContextTools.getJsonString(bc, null));
}

if (aliasContext != null && !aliasContext.isNull()){
	CMSMetadata cmsMd = (CMSMetadata)aliasContext.getData();
	//设置cmsmetadata相关的内容到attribute中
	request.setAttribute("cms.cid",cmsMd.getCid());
	request.setAttribute("cms.alias",cmsMd.getAlias());
	request.setAttribute("cms.parentAlias",cmsMd.getParentAlias());
	request.setAttribute("cms.showName",cmsMd.getShowName());

	//设置扩展信息到系统中
	BreezeContext dataMemo = cmsMd.getDataMemo();
	if (dataMemo != null && !dataMemo.isEmpty()){
		BreezeContext aliasCfg = dataMemo.getContext("aliasCfg");
		//遍历并读取里面所有的配置
		if (aliasCfg!=null && !aliasCfg.isEmpty()){
			for (String keyName:aliasCfg.getMapSet()){
				if (request.getAttribute(keyName)==null){
					request.setAttribute(keyName,aliasCfg.getContext(keyName).getData());
				}				
			}
		}		
	}
}

path = CmsIniter.CMSPARAMPRIFIX;
//获取所有的系统配置
BreezeContext tmpObjCtx = ContextMgr.global.getContextByPath(path);
request.setAttribute("skin","defalut");
if (tmpObjCtx != null && !tmpObjCtx.isNull()){
	//把系统配置设置到request里面
	BreezeContext _bc = new BreezeContext();
	for (String key : tmpObjCtx.getMapSet()) {
		String val = tmpObjCtx.getContext(key).getData() == null ? null : tmpObjCtx.getContext(key).getData().toString();
		//2014-06-15罗光瑜修改，如果key值不存在才进行赋值
		if (request.getAttribute(key)==null){
			request.setAttribute(key,val);
			_bc.setContext(key, new BreezeContext(val));
		}
	}
	request.setAttribute("systemCtx", ContextTools.getJsonString(_bc, null));
}

String _path = session.getServletContext().getRealPath("/");
List<String> allGadget = new ArrayList<String>();
//读取gadget目录下所有文件
File[] gadgetFiles = new File(_path+"/gadget").listFiles();
if(request.getAttribute("Template")!=null){
	allGadget.addAll(getGadget(_path,request.getAttribute("Template").toString(),gadgetFiles));
}

//读取privategadget下所有文件
File[] privategadgetFiles = new File(_path+"/privategadget").listFiles();
if(request.getAttribute("Template")!=null){
	allGadget.addAll(getGadget(_path,request.getAttribute("Template").toString(),privategadgetFiles));
}

request.setAttribute("allGadget", allGadget.toString());
%>
<script>
	window.systemCtx = ${systemCtx};
	window.customized = ${customized};
</script>
<div class="dd" style="max-width:100%;">
    <h3 class="header smaller lighter grey">
        <i class="icon-th-large blue"></i>
        ${p:('changeDisplayDir',data.dir)}/${p:('changeDisplayName',data.name)}
        
       <!--$if (data.selected){-->
       <a class="pull-right bigger-130 icon-reply-all orange" href="#none"  onclick="FireEvent.showFileHistory('${data.selected}');"  title="历史文件"></a>
       <!--$}else{-->
       <i class="pull-right bigger-130 icon-reply-all"  title="历史文件"></i>
       <!--$}-->
       
       <!--$if (data.selected){-->
       <a class="pull-right bigger-130 icon-trash orange" href="#none"  onclick="FireEvent.deleteFile('${data.selected}')"  title="删除"></a>
       <!--$}else{-->
       <i class="pull-right bigger-130 icon-trash"  title="删除"></i>
       <!--$}-->
        
        
       
       <!--$if (data.copycut != null){-->
       <a class="pull-right bigger-130 icon-paperclip orange" href="#none"  onclick="FireEvent.parse();"   title="粘贴"></a>
       <!--$}else{-->
       <i class="pull-right bigger-130 icon-paperclip"  title="粘贴"></i>
       <!--$}-->
       
       
        <!--$if (data.selected){-->
        <a class="pull-right bigger-130 icon-cut orange"  href="#none"  onclick="FireEvent.cut('${data.selected}');"  title="剪切"></a>
        <a class="pull-right bigger-130 icon-copy orange" href="#none"  onclick="FireEvent.copy('${data.selected}')"  title="复制"></a>
        <!--$}else{-->
        <i class="pull-right bigger-130 icon-cut " title="剪切"></i>
        <i class="pull-right bigger-130 icon-copy "  title="复制"></i>
        <!--$}-->
        
        <!--$if (data.dir == ""){-->
        <i class="pull-right bigger-130 icon-level-up"  title="返回上层"></i>
        <!--$}else{-->
        <a class="pull-right bigger-130 icon-level-up orange" href="#none" onclick="FireEvent.go2dir('${data.dir}/')" title="返回上层"></a>
        <!--$}-->
        <a class="pull-right bigger-130 icon-plus-sign-alt orange" href="#none" onclick="FireEvent.openNewDir()"   title="创建新目录"></a>
        
        <!--$if (fileGlobleSetting != null){-->
        <a class="pull-right bigger-130 icon-plus orange" href="javascript:void(0);" onclick="FireEvent.openNewFile();return false;"  title="添加新文件"></a>
        <!--$}else{-->
        <i class="pull-right bigger-130 icon-plus"  title="添加新文件"></i>
        <!--$}-->
        
          
    </h3>
	<ol class="dd-list">
    	<!--$for(var n in data){-->
        <!--$if (data[n] && data[n].name != null){-->
        <li class="dd-item">
            <!--$if (data[n].type == "folder"){-->
              <div class="dd-handle">
                  <i class="icon-folder-close-alt orange"></i><a href="#none" onclick="FireEvent.go2dir('${data.dir}/${data.name}/${data[n].name}')">${p:('changeDisplayName',data[n].name)}</a>
                  <i class="pull-right bigger-130 icon-warning-sign red"></i>
              </div>
            <!--$}else{-->
                  <!--$if (data[n].selected){-->
                      <div class="dd-handle btn-info">
                          <a href="${Cfg.baseUrl}/${data.dir}/${data.name}/${data[n].realName}" target="_blank">${p:('changeDisplayName',data[n].name)}</a>

                  <!--$}else{-->
                      <div class="dd-handle" style="cursor: pointer;" onclick="FireEvent.selectFile('${n}');">
                          ${p:('changeDisplayName',data[n].name)}

                  <!--$}-->
                  
                  <!--$for (var i=0;curGlobleSetting&&i<curGlobleSetting.length;i++ ){-->
                     
                      <!--$if (curGlobleSetting[i].icon ){-->
                          <a class="pull-right" href="#none" onclick="FireEvent.goEdit('${data[n].realName}','${i}')" style="margin-right: 3px;" title="${curGlobleSetting[i].name}">
                              <img src="${curGlobleSetting[i].icon}" widht="17" height="17"></img>
                          </a>
                      <!--$}else{-->
                          <a class="pull-right bigger-130 icon-edit orange2" href="#none" onclick="FireEvent.goEdit('${data[n].realName}','${i}')"  style="margin-right: 3px;" title="${curGlobleSetting[i]}"></a>
                      <!--$}-->
                  <!--$}-->
                  </div>
            <!--$}-->
                
				
				
			
		</li>
        <!--$}-->
        <!--$}-->
	</ol>
</div>
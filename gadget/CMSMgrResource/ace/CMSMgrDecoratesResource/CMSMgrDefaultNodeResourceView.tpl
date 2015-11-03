<!--$if(data){-->
	<div class="col-lg-3">
		<div class="widget-box widget-color-blue2">
			<div class="widget-header">
				<h4 class="widget-title lighter smaller">栏目目录</h4>
			</div>	
			<div id="aliasNodeTree" class="btn-group" style="margin:5px 10px;">
				<button class="btn btn-xs btn-success" onClick="FireEvent.treeTopAdd();">
					<i class="icon-plus"></i>
					添加顶节点
				</button>
				<button class="btn btn-xs btn-primary" onClick="FireEvent.treeAdd();">
					<i class="icon-plus"></i>
					增加
				</button>
				<button class="btn btn-xs btn-warning" onClick="FireEvent.treeMod();">
					<i class="icon-cog"></i>
					编辑
				</button>
				<button class="btn btn-xs btn-danger" onClick="FireEvent.treeDel();">
					<i class="icon-trash"></i>
					删除
				</button>
			</div>
			<div class="widget-body">
				<div class="widget-main padding-8 tree tree-selectable" id="nodeTree">
					<!--$for(var i in data.treeData){-->
						<!--$if(data.treeData[i].type=="item"){-->
							<!--$if(data.select&&data.select==data.treeData[i].cid.trim()){-->
								<li class="tree-item tree-selected" tree-cid="${data.treeData[i].cid.trim()}">
									<span class="tree-item-name">
										<i class="icon-item ace-icon fa fa-check"></i>
										<span class="tree-label">${data.treeData[i].name}</span>
									</span>
								</li>
							<!--$}else{-->
								<li class="tree-item" onClick="FireEvent.treeSelect('${data.treeData[i].cid.trim()}');">
									<span class="tree-item-name">
										<i class="icon-item ace-icon fa fa-times"></i>
										<span class="tree-label">${data.treeData[i].name}</span>
									</span>
								</li>
							<!--$}-->
						<!--$}else{-->
							<!--$var checkChildrenSelect = false;-->
							<!--$for(var j in data.treeData[i].additionalParameters.children){-->
								<!--$var child = data.treeData[i].additionalParameters.children[j];-->
								<!--$if(child.cid.trim()==data.select){checkChildrenSelect=true;}-->
							<!--$}-->
							<!--$if(data.treeData[i].cid.trim()==data.select || checkChildrenSelect){-->
								<li class="tree-branch tree-open">
									<div class="tree-branch-header" onclick="FireEvent.treeSelect('${data.treeData[i].cid.trim()}');">
										<span class="tree-branch-name">
											<i class="icon-folder ace-icon tree-minus"></i>
											<span class="tree-label">${data.treeData[i].name}</span>
										</span>
									</div>
									<ul class="tree-branch-children">
										<!--$for(var j in data.treeData[i].additionalParameters.children){-->
											<!--$var child = data.treeData[i].additionalParameters.children[j];-->
											<!--$if(child.cid.trim()==data.select){-->
												<li class="tree-item tree-selected">
													<span class="tree-item-name">
														<i class="icon-item ace-icon fa fa-check"></i>
														<span class="tree-label">${child.name}</span>
													</span>
												</li>
											<!--$}else{-->
												<li class="tree-item" onclick="FireEvent.treeSelect('${child.cid.trim()}');">
													<span class="tree-item-name">
														<i class="icon-item ace-icon fa fa-times"></i>
														<span class="tree-label">${child.name}</span>
													</span>
												</li>
											<!--$}-->
										<!--$}-->
									</ul>
								</li>
							<!--$}else{-->
								<li class="tree-branch tree-open" onclick="FireEvent.treeSelect('${data.treeData[i].cid.trim()}');">
									<div class="tree-branch-header">
										<span class="tree-branch-name">
											<i class="icon-folder ace-icon tree-plus"></i>
											<span class="tree-label">${data.treeData[i].name}</span>
										</span>
									</div>
								</li>
							<!--$}-->
						<!--$}-->
					<!--$}-->		
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg-9">
		${p:("childrenData",0)}
	</div>
<!--$}else{-->
	<div class="col-lg-12">
		${p:("childrenData",0)}
	</div>
<!--$}-->
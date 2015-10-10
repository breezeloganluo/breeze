<div id="viewNodeTree">
	<div class="panel panel-default">
		<div class="widget-header header-color-blue2 clearfix" style="margin:5px 10px;">
				<h4 class="lighter smaller pull-left">栏目目录</h4>
				<button id="aliasNodeTreeBtn" onclick="FW.trigerEvent('trigerChangeClass','-1')" type="button" class="btn btn-xs  btn-info pull-right" style="margin:6px 2px;">
					<i class="icon-group"></i>
					未分类
				</button>
		</div>	
		<div id="aliasNodeTree" class="btn-group" style="margin:5px 10px;">
			<button class="btn btn-xs btn-primary" onclick="FW.getAPP('appWithButton').openAddNode();">
				<i class="icon-plus"></i>
				顶节点
			</button>
			<button class="btn btn-xs btn-success" onclick="FW.getAPP('appWithButton').openAddSubNode();">
				<i class="icon-plus"></i>
				子节点
			</button>
			
			<button class="btn btn-xs btn-warning" onclick="FW.getAPP('appWithButton').openModNode();">
				<i class="icon-cog"></i>
				编辑
			</button>
			<button class="btn btn-xs btn-danger" onclick="FW.getAPP('appWithButton').openDelNode();">
				<i class="icon-trash"></i>
				删除
			</button>
		</div>
		<div style="margin:5px 10px;" class="">
			<div class="tree tree-selectable" id="nodeTree">
				<!--$for(var i in data){-->
					<!--$if(data[i].type=="item"){-->
						<div style="display: block;" class="tree-item tree-item-item">				
							<i class="icon-remove~"></i>
							<div class="tree-item-name" cid="${data[i].cid}" onclick="FW.trigerEvent('trigerChangeClass','${data[i].cid}',null,this)">${data[i].name}</div>			
						</div>
					<!--$}else{-->
						<div style="display:block;" class="tree-folder">
							<div class="tree-folder-header">					
								<i class="icon-plus"></i>
								<span class="tree-item">
									<i class="icon-remove~"></i>
									<div class="tree-folder-name" cid="${data[i].cid}" onclick="FW.trigerEvent('trigerChangeClass','${data[i].cid}',null,this)">${data[i].name}</div>
								</span>
							</div>
							<div class="tree-folder-content" style="display: none;">
								<!--$for(var j in data[i].additionalParameters.children){-->
									<!--$var child = data[i].additionalParameters.children[j];-->
									<div style="display: block;" class="tree-item tree-item-item">				
										<i class="icon-remove~"></i>				
										<div onclick="FW.trigerEvent('trigerChangeClass','${child.cid}',null,this)" class="tree-item-name" cid="${child.cid}">${child.name}</div>			
									</div>
								<!--$}-->
							</div>
						</div>
					<!--$}-->
				<!--$}-->
			</div>			
		</div>
	</div>
</div>

<style type="text/css">

/*树菜单*/
.lighter{ 
	color: #2679b5;
    font-size: 18px;
    font-weight: lighter;
    width:60%;
}

.tree {
  	padding-top:10px;
    padding-left: 9px;
    position: relative;
}
.tree:before {
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    -moz-border-right-colors: none;
    -moz-border-top-colors: none;
    border-color: #67b2dd;
    border-image: none;
    border-style: dotted;
    border-width: 0 0 0 1px;
    bottom: 16px;
    content: "";
    display: inline-block;
    left: 0;
    position: absolute;
    top: 0px;/*-20px*/
    z-index: 1;
}
.tree .tree-folder {
    cursor: pointer;
    min-height: 20px;
    width: auto;
}
.tree .tree-folder .tree-folder-header {
    height: 30px;
    line-height: 30px;
    position: relative;
}
.tree .tree-folder .tree-folder-header:hover {
    background-color: #f0f7fc;
}
.tree .tree-folder .tree-folder-header .tree-folder-name, .tree .tree-item .tree-item-name {
    display: inline;
    z-index: 2;
}
.tree .tree-folder .tree-folder-header > [class*="icon-"]:first-child, .tree .tree-item > [class*="icon-"]:first-child {
    display: inline-block;
    position: relative;
    top: -1px;
    z-index: 2;
}
.tree .tree-folder .tree-folder-header .tree-folder-name {
    margin-left: 2px;
}
.tree .tree-folder .tree-folder-header > [class*="icon-"]:first-child {
    margin: -2px 0 0 -2px;
}
.tree .tree-folder:last-child:after {
    border-left: 1px solid #fff;
    bottom: 0;
    content: "";
    display: inline-block;
    left: -15px;
    position: absolute;
    top: 15px;
    z-index: 1;
}
.tree .tree-folder .tree-folder-content {
    margin-left: 23px;
    position: relative;
}
.tree .tree-folder .tree-folder-content:before {
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    -moz-border-right-colors: none;
    -moz-border-top-colors: none;
    border-color: #67b2dd;
    border-image: none;
    border-style: dotted;
    border-width: 0 0 0 1px;
    bottom: 16px;
    content: "";
    display: inline-block;
    left: -14px;
    position: absolute;
    top: -14px;
    z-index: 1;
}
.tree .tree-item {
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    position: relative;
}
.tree .tree-item:hover {
    background-color: #f0f7fc;
}
.tree .tree-item .tree-item-name {
    margin-left: 3px;
}
.tree .tree-item .tree-item-name > [class*="icon-"]:first-child {
    margin-right: 3px;
}
.tree .tree-item > [class*="icon-"]:first-child {
    margin-top: -1px;
}
.tree .tree-folder, .tree .tree-item {
    position: relative;
}
.tree .tree-folder:before, .tree .tree-item:before {
    border-top: 1px dotted #67b2dd;
    content: "";
    display: inline-block;
    height: 0;
    left: -10px;
    position: absolute;
    top: 14px;
    width: 18px;
    z-index: 1;
}
.tree .tree-selected {
    background-color: rgba(98, 168, 209, 0.1);
    color: #6398b0;
}
.tree .tree-selected:hover {
    background-color: rgba(98, 168, 209, 0.1);
}
.tree .tree-item, .tree .tree-folder {
    border: 1px solid #fff;
}
.tree .tree-folder .tree-folder-header {
    border-radius: 0;
}
.tree .tree-item, .tree .tree-folder .tree-folder-header {
    color: #4d6878;
    margin: 0;
    padding: 5px;
}
.tree .tree-item > [class*="icon-"]:first-child {
    background-color: #fafafa;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    color: #f9e8ce;
    font-size: 11px;
    height: 13px;
    line-height: 13px;
    text-align: center;
    width: 13px;
}
.tree .tree-selected > [class*="icon-"]:first-child {
    background-color: #f9a021;
    border-color: #f9a021;
    color: #fff;
}
.tree .icon-plus[class*="icon-"]:first-child, .tree .icon-minus[class*="icon-"]:first-child {
    background-color: #fff;
    border: 1px solid #8baebf;
    height: 12px;
    line-height: 10px;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 12px;
    z-index: 1;
}
.tree .icon-plus[class*="icon-"]:first-child:before {
    content: "+";
    display: block;
    font-family: "Open Sans";
    font-size: 16px;
    position: relative;
    z-index: 1;
}
.tree .icon-minus[class*="icon-"]:first-child:before {
    border-top: 1px solid #4d6878;
    content: "";
    display: block;
    height: 0;
    left: 2px;
    position: absolute;
    top: 5px;
    width: 7px;
}
.tree .tree-unselectable .tree-item > [class*="icon-"]:first-child {
    background-color: transparent;
    border: 0 none;
    border-radius: 0;
    box-shadow: none;
    color: #5084a0;
    font-size: 10px;
    height: 13px;
    line-height: 13px;
    text-align: center;
    width: 13px;
}
.tree [class*="icon-"][class*="-down"] {
    transform: rotate(-45deg);
}
.tree .icon-spin {
    height: auto;
}
.tree .tree-loading {
    margin-left: 36px;
}
.tree img {
    display: inline;
}


</style>
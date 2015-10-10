define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	var resource = {
		"CMSMgrDefaultListControl":{
			"CMSMgrControl":require("./CMSMgrControlResource/CMSMgrControl.tpl")
		},
		"CMSMgrDefaultNodeDecorate":{
			"CMSMgrDefaultNodeResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultNodeResourceView.tpl")
		},
		"CMSMgrDefaultTagDecorate":{
			"CMSMgrDefaultTagResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultTagResourceView.tpl")
		},
		"CMSMgrDefaultListSearchDecorate":{
			"CMSMgrDefaultListSearchResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultListSearchResourceView.tpl")
		},
		"CMSMgrDefaultListFilterDecorate":{
			"CMSMgrDefaultListFilterResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultListFilterResourceView.tpl"),
			"configView":require("./CMSMgrDecoratesResource/CMSMgrDefaultListFilterConfigView.tpl")
		},
		"CMSMgrDefaultListViewDecorate":{
			"CMSMgrDefaultListViewResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultListViewResourceView.tpl"),
			"CMSMgrDefaultMaskListViewResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultMaskListViewResourceView.tpl"),
			"configView":require("./CMSMgrDecoratesResource/CMSMgrDefaultListConfigView.tpl")
		},
		"CMSMgrDefaultListPaginationDecorate":{
			"CMSMgrDefaultListPaginationResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultListPaginationResourceView.tpl")
		},
		"CheckBox_Decorate":{
			"CheckBox_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/CheckBox_Decorate.tpl")
		},
		"DatePicker_Decorate":{
			"DatePicker_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/DatePicker_Decorate.tpl")
		},
		"DateTimePicker_Decorate":{
			"DateTimePicker_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/DateTimePicker_Decorate.tpl")
		},
		"Hidden_Decorate":{
			"Hidden_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/Hidden_Decorate.tpl")
		},
		"Html_Decorate":{
			"Html_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/Html_Decorate.tpl")
		},
		"Pics_Decorate":{
			"Pics_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/Pics_Decorate.tpl")
		},
		"Pic_Decorate":{
			"Pic_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/Pic_Decorate.tpl")
		},
		"File_Decorate":{
			"File_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/File_Decorate.tpl")
		},
		"Radio_Decorate":{
			"Radio_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/Radio_Decorate.tpl")
		},
		"ReadOnly_Decorate":{
			"ReadOnly_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/ReadOnly_Decorate.tpl")
		},
		"Select_Decorate":{
			"Select_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/Select_Decorate.tpl")
		},
		"TextArea_Decorate":{
			"TextArea_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/TextArea_Decorate.tpl")
		},
		"Text_Decorate":{
			"Text_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/Text_Decorate.tpl")
		},
		"TimePicker_Decorate":{
			"TimePicker_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/TimePicker_Decorate.tpl")
		},
		"List_Decorate":{
			"List_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/List_Decorate.tpl")
		},
		"OuterLink_Decorate":{
			"OuterLink_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/OuterLink_Decorate.tpl")
		},
		"CMSMgrDefaultMaskControl":{
			"appMainView":require("./CMSMgrControlResource/CMSMgrMaskControl.tpl")
		},

		"CMSMgrDefaultSingleControl":{
			"appMainView":require("./CMSMgrControlResource/CMSMgrControl.tpl")
		},

		"CMSMgrDefaultSingleViewDecorate":{
			"CMSMgrDefaultSingleViewResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultSingleViewResourceView.tpl"),
			"listShow":require("./CMSMgrControlResource/CMSMgrList.tpl"),
			"configView":require("./CMSMgrDecoratesResource/CMSMgrDefaultSingleConfigView.tpl")
		},
		"CMSMgrDefaultHeaderDecorate":{
			"configView":require("./CMSMgrDecoratesResource/CMSMgrDefaultHeaderConfigView.tpl"),
			"CMSMgrDefaultHeaderResourceView":require("./CMSMgrDecoratesResource/CMSMgrDefaultHeaderResourceView.tpl")
		},

		"CMSMgrModSingleControl":{
			"appMainView":require("./CMSMgrControlResource/CMSMgrControl.tpl"),
			"modListMaskView":require("./CMSMgrControlResource/CMSMgrModListMaskView.tpl")
		},
		
		
		
		
		"Info_Decorate":{
			"Info_Decorate":require("../../CMSMgrTypeDecorate/resource/ace/Info_Decorate.tpl")			
		},

	
		"roleactiongroup_Control":{
			"groupView":require("./CMSMgrControlResource/roleactiongroup.tpl")
		}


	}
	FW.regResource(resource);
	return FW;
});

{
	"servicename":"sname",
	"package":"package",
	"tables":[
		"alias1",
		"alias2"
	],
	"testcase":[
		{
			caseName:"case1",
			globel:{
				key1:"keyvalue1"
			},
			session:{
				s1:"{anme:1}"
			},
			initData:{
				"alias1":[
					{
						cid:0
					}
				],
				"alias2":[
					{
						cid:1
					}
				]
			},
			"expDBResult":{
				"alias1":[
					{
						cid:0
					}
				],
				"alias2":[
					{
						cid:1
					}
				]
			},
            
			"expMsgResult":{
				code:0,
                data:[
                   {
                   c1:0
                   }
                ]
			}
		}
	]
}

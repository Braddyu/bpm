FORMAT: 1A
HOST: http://192.168.9.66:30002/gdgl/api

# 流程引擎-API 说明文档 v1.0.2
本文档为流程引擎相关api说明，用于第三方应用进行调用



# Group 规范
公共规范定义
+ 返回结果

| 类别          | 名称          | 状态  | 编码  |
| ------------- |:-------------:| -----:| -----:|
| 返回状态      | 成功          | true  | 0000  |
| 返回状态      | 失败          | false | 1000  |
| 返回状态      | 异常          | false | 1000  |
| 返回状态      | 错误          | false | 1001  |
| 返回状态      | 为空          | false | 2001  |


## 返回结果 [/result]

定义所有请求的返回结果

***

流程管理属性如下：

+ return_code 返回处理结果
+ return_msg 返回消息


+ Model (application/json)

    + Body

            {
                "return_code": "0000",
                "return_msg": "操作完成",
            }


# Group 流程管理
流程管理相关接口





## 流程列表 [/process/list]


### 获取流程列表 [POST]

+ Request
    + Body

            {
              "page": 1,
              "rows": 50
            }

+ Response 200
    {success:true, code:'0000', msg:'查询成功。',rows:[data],total:2}

## 未创建实例，获取下一节点处理人 [/process/getNodeUser]


### 未创建实例，获取下一节点处理人 [POST]

+ Request
    + Body

            {
                proc_code:'p_33',
                user_no:'zhangyi001',
				params:{money:101}
            }

+ Response 200
		{
		  "data": [
			{
			  "user_no": "gongbenping",
			  "user_name": "龚本平",
			  "node_name": "部门审批",
			  "node_code": "processDefineDiv_node_4"
			},
			{
			  "user_no": "zhangping",
			  "user_name": "张萍",
			  "node_name": "部门审批",
			  "node_code": "processDefineDiv_node_4"
			}
		  ],
		  "msg": "查询用户org",
		  "error": null,
		  "success": true,
		  "next_node": "processDefineDiv_node_4"
		}

## 获取当前节点信息 [/process/nodeDetail]


### 获取当前节点是否存在拒绝，归档节点 [POST]

+ Request
    + Body

            {
                proc_code:'p_33',
                node_code:'processDefineDiv_node_7'
            }

+ Response 200
  {
    "success": true,
    "code": "1000",
    "msg": "查询节点成功",
    "data": {
        "haveRefuse": true,（是否存在拒绝节点）
        "isEnd": true（是否存在归档节点）
    }
}
## 获取下下节点处理人信息 [/process/skip/node/user/info]


### 获取下下节点处理人节点信息 [POST]

+ Request
    + Body

            {
                node_code:processDefineDiv_node_3,//跳过的节点编号
				proc_code:p-999,//流程编号
				params:"asd",
				user_no:songfei3,//当前节点处理人
            }

+ Response 200
  {
    {
  "success": true,
  "code": "0000",
  "msg": "查询用户org",
  "data": [
    {
      "user_no": "wangke1",
      "user_name": "王可",
      "node_name": "部门副总审批",
      "node_code": "processDefineDiv_node_4"
    }
  ]
}
}
## 跳过节点的创建实例指派任务的接口慧眼系统 [/process/exampleAndTask]


### 跳过节点的创建实例指派任务的接口 [POST]

+ Request
    + Body

            {
              "proc_code": "p-999流程编码",
              "proc_ver": 4,(可选)
              "title": "流程实例测试",
              "user_no": "lixun",(操作人)
			  "user_name": "李询",(操作人)
			  "node_code": "processDefineDiv_node_4",(下一节点编号)
			  "assign_user_no": "luolisha",(下一节点处理人编号)
			  "memo": "处理内容",
			  "proc_vars": "",(json字符串格式-流程实例从开始到归档都不需要变动的工单参数)
			  "biz_vars":""(json字符串格式-业务工单需要的参数)
			  "params":{"flag":false}(flag为线上的参数，线上有就必须传没有可以传"")
			  "joinup_sys":"warnSys_node";//所属系统编号(warnSys_node-预警工单系统编号:errorSys_node-差错工单系统编号:auditorSys_node-稽核工单系统编号:syesightSys_node-慧眼工单系统编号)
            }

+ Response 200
  {
   {
  "success": true,
  "code": "1000",
  "msg": "流程流转新增任务信息正常82222。",
  "data": [
    {
      "__v": 0,
      "proc_inst_id": "5a5cacae0d9e72015c0d88f3",
      "proc_inst_task_code": "processDefineDiv_node_4",
      "proc_inst_task_name": "部门副总审批",
      "proc_inst_task_type": "部门副总审批",
      "proc_inst_task_arrive_time": "2018-01-15T13:29:19.046Z",
      "proc_inst_task_handle_time": "2018-01-15T13:29:19.046Z",
      "proc_inst_task_complete_time": null,
      "proc_inst_task_status": 0,
      "proc_inst_task_assignee_name": "骆莉莎",
      "proc_inst_task_title": "\"assas\"",
      "proc_inst_biz_vars": "“ss”",
      "proc_inst_prev_node_code": "processDefineDiv_node_2",
      "proc_inst_prev_node_handler_user": "lixun",
      "proc_inst_node_vars": "",
      "proc_code": "p-999",
      "proc_name": "测试跳级",
      "proc_vars": "“sss”",
      "proc_inst_task_params": "flag",
      "proc_inst_task_claim": null,
      "proc_inst_task_sign": 1,
      "proc_inst_task_sms": 0,
      "proc_inst_task_remark": "",
      "proc_inst_task_assignee": "luolisha",
      "proc_task_start_user_role_names": "普通员工",
      "proc_task_start_name": "代维",
      "joinup_sys": "\"syesightSys_node\"",
      "skip": 1,
      "_id": "5a5cacaf0d9e72015c0d88f6",
      "proc_task_start_user_role_code": [
        "5a264057c819ed2118539070"
      ],
      "proc_inst_task_user_org": [
        "5a275c0677ec2e1e8448799a"
      ],
      "proc_inst_task_user_role": [
        "5a264057c819ed2118539070"
      ]
    }
  ]
}
}

## 获取当前节点信息 [/process/data/info]

### 各系统通用的用户数据同步接口 [POST]

+ Request
    + Body

            {
                role_type:sales(限定为 sales(营业员),hall_manager(厅经理) ,grid_manager(网格经理)),如果不传任何参数则分别返回用户 机构 角色 所有信息,格式为json)
            }

+ Response 200  
  {
    "success": true,
    "code": "0000",
    "msg": "(传入参数)查询用户数据正常",
    "data": {[
            {
      "_id": "5a264379a66ed11cf4553c86",
      "login_account": "13984126789",
      "user_status": 1,
      "user_id": "1",
      "user_no": "13984126789",
      "user_name": "梁峻珲",
      "user_gender": "",
      "user_phone": "13984126789",
      "user_tel": " 13984126789",
      "user_email": "",
      "login_password": "e10adc3949ba59abbe56e057f20f883e",
      "user_sys": "56f20ec0c2b4db9c2a7dfe7a",
      "user_org_desc": "10000000",
      "theme_name": "themes/beyond/",
      "theme_skin": "deepblue",
      "user_photo": "",
      "boss_id": "",
      "smart_visual_sys_user_id": "",
      "athena_sys_user_id": "",
      "athena_app_sys_user_id": "",
      "inspect_sys_user_id": "",
      "token": "",
      "special_sign": "",
      "__v": 0,
      "sys_roles": [],
      "user_roles": [
        "5a26418c5eb3fe1068448753",
        "5a26418c5eb3fe1068448753"
      ],
      "user_org": [
        "5a2760eaa93224084c86e209"
      ]
    }
	]
    }
}
+ Response 200 
{
  "success": true,
  "code": "0000",
  "msg": "(没传参数)查询所有的用户数据正常。",
  "data": {
    "users": [
      {
        "_id": "5a263f76afa2c122149b813f",
        "login_account": "gongguimin@gz.cmcc",
        "user_status": 1,
        "user_id": "CN=龚贵民/OU=市场经营部/OU=黔东南分公司/O=gzcmcc",
        "user_no": "13908559010",
        "user_name": "龚贵民",
        "user_gender": "1",
        "user_phone": "13908559010",
        "user_tel": "13908559010",
        "user_email": "gongguimin@gz.cmcc.com",
        "login_password": "8d1adbce017a77bb297f1c4bf54732e9",
        "user_sys": "56f20ec0c2b4db9c2a7dfe7a",
        "user_org_desc": "CN=经理室/O=天柱公司",
        "theme_name": "themes/beyond/",
        "theme_skin": "deepblue",
        "user_photo": "1",
        "boss_id": "",
        "smart_visual_sys_user_id": "",
        "athena_sys_user_id": "",
        "athena_app_sys_user_id": "",
        "inspect_sys_user_id": "",
        "token": "",
        "special_sign": "",
        "__v": 0,
        "user_duties": [
          null
        ],
        "sys_roles": [
          [
            "591e5f1b583f4615c4271570",
            "595857482170d500108236f9"
          ]
        ],
        "user_roles": [
          null
        ],
        "user_org": [
          "5a275c0377ec2e1e844878db"
        ]
      }
    }
}

# Group 流程实例 -修改
流程实例管理相关接口

## 流程实例 [/process_instance]

定义实例管理对象操作API

***

流程实例管理属性如下：

+ _id 实例ID
+ proc_id 流程ID
+ proc_define_id 流程定义ID
+ proc_code 流程编码
+ parent_id 父节点，0为父流程，非0为子流程，数字为父流程节点
+ proc_name 流程名
+ proc_ver 流程版本号
+ catalog 流程类别
+ proce_reject_params  是否驳回
+ proc_instance_code 实例编码
+ proc_title 流程标题
+ proc_cur_task 流程当前节点编码
+ proc_cur_task_name 流程当前节点名称
+ proc_cur_user 当前流程处理人编号
+ proc_cur_user_name 当前流程处理人名
+ proc_cur_arrive_time 当前流程到达时间
+ proc_cur_task_item_conf 当前流程节点配置信息(当前配置阶段编码)
+ proc_start_user 流程发起人(开始用户)
+ proc_start_user_name 流程发起人名(开始用户姓名)
+ proc_start_time 流程发起时间(开始时间)
+ proc_params 流转参数
+ proc_inst_status 流程流转状态 1 已启用  0 已禁用,2 流转中，3 归档
+ proc_attached_type 流程附加类型(1:待办业务联系函;2:待办工单;3:待办考核;4:其他待办)
+ proce_attached_params 流程附加属性
+ proce_reject_params 流程驳回附加参数
+ proc_cur_task_code_num 节点编号
+ proc_task_overtime 超时时间设置
+ proc_cur_task_overtime 当前节点的超时时间
+ proc_cur_task_remark 节点备注
+ proc_city 地市
+ proc_county 区县
+ proc_org 组织
+ proc_cur_task_overtime_sms 流程当前节点超时短信标记(1:待处理，2:已处理，3:不需要处理)
+ proc_cur_task_overtime_sms_count 流程当前节点超时短信发送次数
+ proc_pending_users 当前流程的待处理人信息
+ proc_task_history 处理任务历史记录
+ proc_define 流程描述文件
+ item_config 流程节点配置信息


+ Model (application/json)

    + Body

            {
                proc_task_overtime: [
                    ""
                ],
                proc_pending_users: [
                    "56f4f15c08d4ef302d0a15c1"
                ],
                __v: 0,
                item_config: '[
                    {
                        "_id": "593d0bbc58b60c0748e8d0f6",
                        "item_code": "processDefineDiv_line_5",
                        "item_type": "sl",
                        "item_el": "",
                        "item_remark": "",
                        "proc_code": "p_101"
                    },
                    {
                        "item_code": "processDefineDiv_node_2",
                        "item_type": "task",
                        "item_sms_warn": 0,
                        "item_assignee_user": "56f4f15c08d4ef302d0a15c1",
                        "item_assignee_user_code": "gongli",
                        "item_step_code": "",
                        "item_code_num": "",
                        "item_overtime": null,
                        "item_overtime_afterAction_type": null,
                        "item_overtime_afterAction_info": "",
                        "item_touchEvent_type": null,
                        "item_touchEvent_info": "",
                        "item_filePath": "",
                        "item_funName": "",
                        "item_remark": "",
                        "_id": "593d0bd258b60c0748e8d0f7",
                        "item_assignee_role": "",
                        "item_assignee_role_code": "",
                        "item_assignee_role_tag": "",
                        "item_assignee_role_level": "",
                        "item_assignee_ref_task": "",
                        "item_assignee_type": 1,
                        "item_show_text": "龚利",
                        "proc_code": "p_101"
                    },
                    {
                        "item_code": "processDefineDiv_node_3",
                        "item_type": "chat",
                        "item_sms_warn": 0,
                        "item_assignee_role": "59391795316b851be48e0149",
                        "item_assignee_role_code": "r_004",
                        "item_assignee_role_tag": "1",
                        "item_assignee_role_level": "2",
                        "item_step_code": "",
                        "item_code_num": "",
                        "item_overtime": null,
                        "item_overtime_afterAction_type": null,
                        "item_overtime_afterAction_info": "",
                        "item_touchEvent_type": null,
                        "item_touchEvent_info": "",
                        "item_filePath": "",
                        "item_funName": "",
                        "item_remark": "",
                        "_id": "593d100d99446e00b899c2b1",
                        "item_assignee_user": "",
                        "item_assignee_user_code": "",
                        "item_assignee_ref_task": "",
                        "item_assignee_type": 2,
                        "item_show_text": "总经办",
                        "proc_code": "p_101"
                    }
                ]',
                proc_define: '{
                    "title": "iflow1",
                    "nodes": {
                        "processDefineDiv_node_1": {
                            "name": "开始",
                            "left": 86,
                            "top": 121,
                            "type": "start  round",
                            "width": 24,
                            "height": 24,
                            "alt": true
                        },
                        "processDefineDiv_node_2": {
                            "name": "采购申请",
                            "left": 179,
                            "top": 122,
                            "type": "task",
                            "width": 102,
                            "height": 30,
                            "alt": true
                        },
                        "processDefineDiv_node_3": {
                            "name": "总经办审核",
                            "left": 337,
                            "top": 123,
                            "type": "chat",
                            "width": 102,
                            "height": 30,
                            "alt": true
                        },
                        "processDefineDiv_node_4": {
                            "name": "结束",
                            "left": 517,
                            "top": 127,
                            "type": "end  round",
                            "width": 24,
                            "height": 24,
                            "alt": true
                        }
                    },
                    "lines": {
                        "processDefineDiv_line_5": {
                            "from": "processDefineDiv_node_1",
                            "to": "processDefineDiv_node_2",
                            "name": "",
                            "type": "sl",
                            "alt": true
                        },
                        "processDefineDiv_line_6": {
                            "from": "processDefineDiv_node_2",
                            "to": "processDefineDiv_node_3",
                            "name": "",
                            "type": "sl",
                            "alt": true
                        },
                        "processDefineDiv_line_7": {
                            "from": "processDefineDiv_node_3",
                            "to": "processDefineDiv_node_4",
                            "name": "",
                            "type": "sl",
                            "alt": true
                        }
                    },
                    "areas": {},
                    "initNum": 9
                }',
                proc_cur_task_overtime_sms_count: null,
                proc_cur_task_overtime_sms: null,
                proc_org: '',
                proc_county: '',
                proc_city: '',
                proc_cur_task_remark: '',
                proc_cur_task_overtime: null,
                proc_cur_task_code_num: '',
                proce_attached_params: '',
                proc_attached_type: null,
                proc_inst_status: 2,
                proc_params: '',
                proc_start_time: MonJun19201710: 40: 10GMT+0800(中国标准时间),
                proc_start_user_name: '',
                proc_start_user: 'gongli',
                proc_cur_task_item_conf: '',
                proc_cur_arrive_time: MonJun19201710: 40: 10GMT+0800(中国标准时间),
                proc_cur_user_name: '',
                proc_cur_user: '56f4f15c08d4ef302d0a15c1',
                proc_cur_task_name: '采购申请',
                proc_cur_task: 'processDefineDiv_node_2',
                proc_title: '流程实例测试用例',
                proc_instance_code: '',
                proce_reject_params: '',
                catalog: null,
                proc_ver: 4,
                proc_name: '采购测试流程',
                parent_id: '0',
                proc_code: 'p_101',
                proc_define_id: 593d0a3c58b60c0748e8d0f5,
                proc_id: 59393f698f62b703ac8b1777,
                _id: 5947398aba36650788eaa89a
            }



## 创建流程实例 [/process_instance/createInstance]
### 创建流程实例 [POST]

+ Request
    + Body

            {
              "proc_code": "p_101流程编码",
              "proc_ver": 4,(可选)
              "title": "流程实例测试",
              "user_no": "wenganguo",
			  "proc_vars": "",(json字符串格式-流程实例从开始到归档都不需要变动的工单参数)
			  "biz_vars":"",(json字符串格式-业务工单需要的参数)
			  "joinup_sys":"warnSys_node";//所属系统编号(warnSys_node-预警工单系统编号:errorSys_node-差错工单系统编号:auditorSys_node-稽核工单系统编号:syesightSys_node-慧眼工单系统编号)
			  "next_name":"王浩"
            }
    
+ Response 200

    {success:true, code:'0000', msg:'流程实例创建启动成功。',data:[
    {
      "__v": 0,
      "proc_inst_id": "5a69442228f98a04b42f46e7",
      "proc_inst_task_code": "processDefineDiv_node_2",
      "proc_inst_task_name": "普通员工起草",
      "proc_inst_task_type": "task",
      "proc_inst_task_title": "普通员工起草",
      "proc_inst_task_arrive_time": "2018-01-25T02:42:43.002Z",
      "proc_inst_task_handle_time": "2018-01-25T02:42:43.002Z",
      "proc_inst_task_complete_time": "2018-01-25T02:42:43.002Z",
      "proc_inst_task_status": 0,
      "proc_inst_task_assignee": "zhuhuimin",
      "proc_inst_task_assignee_name": "朱慧敏",
      "proc_inst_task_user_role_name": "分公司主任",
      "proc_inst_task_user_org_name": "",
      "proc_inst_task_params": "",
      "proc_inst_task_claim": 0,
      "proc_inst_task_sign": 1,
      "proc_inst_task_sms": 0,
      "proc_inst_task_remark": "",
      "proc_inst_node_vars": "",
      "proc_name": "",
      "proc_code": "p-999",
      "proc_inst_prev_node_code": "",
      "proc_inst_prev_node_handler_user": "",
      "proc_task_start_user_role_names": "5a264057c819ed211853906f",
      "proc_task_start_name": "朱慧敏",
      "proc_task_ver": 1,
      "proc_task_content": "",
      "proc_start_time": "2018-01-25T02:42:43.002Z",
      "joinup_sys": "\"syesightSys_node\"",
      "next_name": "王浩",
      "proc_back": 0,
      "previous_step": "",
      "_id": "5a69442328f98a04b42f46e8",
      "proc_task_start_user_role_code": [
        "zhuhuimin"
      ],
      "proc_inst_task_user_org": [],
      "proc_inst_task_user_role": [
        "5a264057c819ed211853906f"
      ]
    }
  ]}

## 流程实例取消 [/process_instance/cancleInstance]
### 流程实例取消 [POST]

+ Request
    + Body

            {
              "inst_id": "597087f043232f228890fdd4"
            }
    
+ Response 200 

    {success:true, code:'0000', msg:'取消成功。'} 
	
	
## 流程实例启用 [/process_instance/enableInstance]
### 流程实例启用 [POST]

+ Request
    + Body

            {
              "inst_id": "597087f043232f228890fdd4"
            }
    
+ Response 200 

    {success:true, code:'0000', msg:'取消成功。'} 

## 流程实例当前节点名称编号 [/process_instance/get/current_users/info]
### 流程实例当前节点处理信息 [POST]

+ Request
    + Body

            {
              "node_code": "当前处理节点编号",
			  "proc_task_id": "当前任务ID"
            }
    
+ Response 200 

    {success:true, code:'0000', msg:'获取下一节点信息成功。',data:[data]} 


## 流程实例下一节点名称和处理人信息 [/process_instance/next/nodeAnduser]
### 流程实例下一节点名称和处理人信息 [POST]

+ Request
    + Body

            {
              "node_code": "当前处理节点编号",
              "proc_task_id": "当前任务ID",
			  "proc_inst_id": "当前实例ID",
			  "user_no": "当前登录人",
			  "params": ""(json格式如果有两条流转线路，如：flag=true或false)
            }
    
+ Response 200 

    {success:true, code:'0000', msg:'获取下一节点处理人信息成功。',data:[data]} 
	

## 流程实例列表 [/process_instance/list]
### 流程实例列表信息 [POST]

+ Request
    + Body

            {
              "proc_code": "流程编号(不能为空)",
              "user_no": "用户编号(可以为空)",
			  "page": 1,
			  "rows": 10
            }
    
+ Response 200 

    {success:true, code:'0000', msg:'查询成功。',rows:[data],total:2}   

## 创建流程实例直接流转到下一节点 [/process_instance/createAndAcceptAssign]
### 创建流程实例直接流转到下一节点 [POST]

+ Request
    + Body

            {
              "proc_code": "p_101流程编码",
              "proc_ver": 4,(可选)
              "title": "流程实例测试",
              "user_no": "wenganguo",(操作人)
			  "user_name": "文安国",(操作人)
			  "node_code": "processDefineDiv_node_3",(发送任务节点编号)
			  "assign_user_no": "lisi",(处理人编号)
			  "memo": "处理内容",
			  "proc_vars": "",(json字符串格式-流程实例从开始到归档都不需要变动的工单参数)
			  "biz_vars":""(json字符串格式-业务工单需要的参数)
			  "params":{"flag":false}(flag为线上的参数，线上有就必须传没有可以传"")
			  "joinup_sys":"warnSys_node";//所属系统编号(warnSys_node-预警工单系统编号:errorSys_node-差错工单系统编号:auditorSys_node-稽核工单系统编号:syesightSys_node-慧眼工单系统编号)
			  "next_name":"王浩"
            }
    
+ Response 200

    {success:true, code:'0000', msg:'流程实例创建启动成功。',data:[
    {
      "pay_task_id": "5a671ae9a0aa8715e0458d26",
      "_id": "5a671ae9a0aa8715e0458d23",
      "proc_id": "5a56fb0ec7647515e48eb573",
      "proc_define_id": "5a56fc16c7647515e48eb574",
      "proc_code": "p-999",
      "parent_id": "0",
      "parent_proc_inst_id": "",
      "proc_name": "测试跳级",
      "proc_ver": 1,
      "catalog": null,
      "proce_reject_params": "",
      "proc_instance_code": "",
      "proc_title": "测试流程转秘书",
      "work_order_number": "GDBH2018123578322",
      "proc_cur_task": "processDefineDiv_node_2",
      "proc_cur_task_name": "普通员工起草",
      "proc_cur_user_name": "",
      "proc_cur_arrive_time": "2018-01-23T11:22:17.545Z",
      "proc_cur_task_item_conf": "",
      "proc_start_user": "zhuhuimin",
      "proc_start_user_name": "朱慧敏",
      "proc_start_time": "2018-01-23T11:22:17.545Z",
      "proc_params": "",
      "proc_inst_status": 2,
      "proc_attached_type": null,
      "proce_attached_params": "",
      "proc_cur_task_code_num": "",
      "proc_cur_task_overtime": null,
      "proc_cur_task_remark": "",
      "proc_city": "",
      "proc_county": "",
      "proc_org": "",
      "proc_cur_task_overtime_sms": null,
      "proc_cur_task_overtime_sms_count": null,
      "proc_start_user_role_names": "分公司主任",
      "proc_define": "{\"title\":\"iflow1\",\"nodes\":{\"processDefineDiv_node_1\":{\"name\":\"开始\",\"left\":110,\"top\":167,\"type\":\"start  round\",\"width\":24,\"height\":24,\"alt\":true},\"processDefineDiv_node_2\":{\"name\":\"普通员工起草\",\"left\":233,\"top\":175,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_3\":{\"name\":\"科室领导审批\",\"left\":482,\"top\":176,\"type\":\"chat\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_12\":{\"name\":\"结束\",\"left\":538,\"top\":467,\"type\":\"end  round\",\"width\":24,\"height\":24,\"alt\":true}},\"lines\":{\"processDefineDiv_line_6\":{\"from\":\"processDefineDiv_node_2\",\"to\":\"processDefineDiv_node_3\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_13\":{\"from\":\"processDefineDiv_node_1\",\"to\":\"processDefineDiv_node_2\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_26\":{\"from\":\"processDefineDiv_node_3\",\"to\":\"processDefineDiv_node_12\",\"name\":\"\",\"type\":\"sl\",\"alt\":true}},\"areas\":{},\"initNum\":27}",
      "item_config": "[{\"_id\":\"5a56fc69be30350e8459eb9b\",\"item_code\":\"processDefineDiv_line_14\",\"item_type\":\"sl\",\"item_el\":\"flag==true\",\"item_remark\":\"\"},{\"_id\":\"5a58676c20e51f2830a7ae19\",\"item_code\":\"processDefineDiv_line_8\",\"item_type\":\"sl\",\"item_el\":\"flag==true\",\"item_remark\":\"\"},{\"_id\":\"5a58676c20e51f2830a7ae1a\",\"item_code\":\"processDefineDiv_line_10\",\"item_type\":\"sl\",\"item_el\":\"flag\",\"item_remark\":\"\"},{\"_id\":\"5a5f4cb93ee91d2690e6e023\",\"item_code\":\"processDefineDiv_line_22\",\"item_type\":\"sl\",\"item_el\":\"flag==false\",\"item_remark\":\"\"},{\"_id\":\"5a56fc69be30350e8459eb9c\",\"item_code\":\"processDefineDiv_node_2\",\"item_type\":\"task\",\"item_sms_warn\":0,\"item_jump\":0,\"item_assignee_role\":\"5a264057c819ed211853906f\",\"item_assignee_role_code\":\"branch_director\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_assignee_role_name\":\"分公司主任\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_node_var\":\"\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_ref_task\":\"\",\"item_assignee_ref_cur_org\":\"\",\"item_assignee_type\":2,\"item_show_text\":\"角色：分公司主任;\"},{\"item_code\":\"processDefineDiv_node_3\",\"item_type\":\"chat\",\"item_sms_warn\":0,\"item_jump\":1,\"item_assignee_ref_task\":\"processDefineDiv_node_2\",\"item_assignee_role\":\"5a65888749b7680fb4187c83\",\"item_assignee_role_code\":\"city_meetingSecretary\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_name\":\"分公司专题会秘书\",\"item_assignee_role_level\":\"2\",\"item_assignee_ref_cur_org\":\"2\",\"item_assignee_ref_type\":\"2\",\"item_node_var\":\"\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"_id\":\"5a56fc69be30350e8459eb9d\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_assignee_type\":3,\"item_show_text\":\"参照节点：普通员工起草;\\n\\n参照类型：当前机构;\\n\\n当前机构：上级;\\n\\n角色：分公司专题会秘书;\"},{\"_id\":\"5a56fc69be30350e8459eb9e\",\"item_code\":\"processDefineDiv_node_4\",\"item_type\":\"chat\",\"item_sms_warn\":0,\"item_jump\":1,\"item_assignee_ref_task\":\"processDefineDiv_node_2\",\"item_assignee_role\":\"5a264057c819ed211853906b\",\"item_assignee_role_code\":\"branch_manager\",\"item_assignee_role_tag\":\"\",\"item_assignee_role_level\":\"\",\"item_assignee_role_name\":\"分公司总经理\",\"item_assignee_ref_cur_org\":\"2\",\"item_assignee_ref_type\":\"2\",\"item_node_var\":\"\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_assignee_type\":3,\"item_show_text\":\"参照节点：普通员工起草;\\n\\n参照类型：当前机构;\\n\\n当前机构：上级;\\n\\n角色：分公司总经理;\"},{\"_id\":\"5a56fc69be30350e8459eb9f\",\"item_code\":\"processDefineDiv_node_5\",\"item_type\":\"chat\",\"item_sms_warn\":0,\"item_assignee_ref_task\":\"processDefineDiv_node_4\",\"item_assignee_role\":\"5a264057c819ed211853906d\",\"item_assignee_role_code\":\"general_director\",\"item_assignee_role_tag\":\"\",\"item_assignee_role_level\":\"\",\"item_assignee_role_name\":\"省公司主任\",\"item_assignee_ref_cur_org\":\"1\",\"item_assignee_ref_type\":\"2\",\"item_node_var\":\"\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_assignee_type\":3,\"item_show_text\":\"参照节点：部门副总审批;\\n\\n参照类型：当前机构;\\n\\n当前机构：同级;\\n\\n角色：省公司主任;\"},{\"_id\":\"5a5f4cb93ee91d2690e6e024\",\"item_code\":\"processDefineDiv_node_21\",\"item_type\":\"chat\",\"item_sms_warn\":0,\"item_jump\":0,\"item_assignee_ref_task\":\"processDefineDiv_node_2\",\"item_assignee_role\":\"5a264057c819ed211853906d\",\"item_assignee_role_code\":\"general_director\",\"item_assignee_role_tag\":\"\",\"item_assignee_role_level\":\"\",\"item_assignee_role_name\":\"省公司主任\",\"item_assignee_ref_cur_org\":\"2\",\"item_assignee_ref_type\":\"2\",\"item_node_var\":\"\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_assignee_type\":3,\"item_show_text\":\"参照节点：普通员工起草;\\n\\n参照类型：当前机构;\\n\\n当前机构：上级;\\n\\n角色：省公司主任;\"}]",
      "joinup_sys": "\"syesightSys_node\"",
      "__v": 0,
      "proc_start_user_role_code": [
        "5a264057c819ed211853906f"
      ],
      "proc_pending_users": [],
      "proc_task_overtime": [
        ""
      ]
    }
  ]}
	


# Group 流程任务-修改
任务相关接口

***

流程任务属性如下：

+ _id 任务ID
+ proc_inst_id  流程流转当前信息ID
+ proc_inst_task_code 流程当前节点编码(流程任务编号)
+ proc_inst_task_name 流程当前节点名称(任务名称)
+ proc_inst_task_type 流程当前节点类型(任务类型)
+ proc_inst_task_arrive_time 流程到达时间
+ proc_inst_task_handle_time 流程认领时间
+ proc_inst_task_complete_time 流程完成时间
+ proc_inst_task_status 流程当前状态 0-未处理，1-已完成，2-驳回
+ proc_inst_task_assignee 流程处理人code
+ proc_inst_task_assignee_name 流程处理人名
+ proc_inst_task_user_role 流程处理用户角色ID
+ proc_inst_task_user_role_name 流程处理用户角色名
+ proc_inst_task_params 流程参数(任务参数)
+ proc_inst_task_claim 流程会签
+ proc_inst_task_sign 流程签收(0-未认领，1-已认领)
+ proc_inst_task_sms 流程是否短信提醒
+ proc_inst_task_remark 流程处理意见
+ proc_inst_prev_node_code 流程实例上一处理节点编号
+ proc_inst_prev_node_handler_user 流程实例上一节点处理人编号
+ proc_task_start_user_role_names 流程发起人角色
+ proc_task_start_user_role_code 流程发起人id
+ proc_task_start_name 流程发起人姓名
+ proc_task_work_day 天数
+ proc_task_ver 版本号
+ proc_task_name 流程名
+ proc_task_content 流程派单内容
+ proc_task_code 流程编码
+ proc_start_time 流程发起时间(开始时间)
+ proc_vars 流程变量
+ joinup_sys 所属系统编号
+ skip 是否为跳过节点任务
+ next_name 下一节点处理人姓名
+ proc_back 判断为回退任务 1-为回退任务 0-为正常流转
+ previous_step 上一节点任务id




+ Model (application/json)

    + Body

            {
			  "_id": "5a67e41ec840f8144ca5fa91",
			  "proc_inst_id": "5a67e41dc840f8144ca5fa90",
			  "proc_inst_task_code": "processDefineDiv_node_2",
			  "proc_inst_task_name": "普通员工起草",
			  "proc_inst_task_type": "task",
			  "proc_inst_task_title": "普通员工起草",
			  "proc_inst_task_arrive_time": "2018-01-24T01:40:46.035Z",
			  "proc_inst_task_handle_time": "2018-01-24T01:40:46.035Z",
			  "proc_inst_task_complete_time": "2018-01-24T01:40:46.035Z",
			  "proc_inst_task_status": 0,
			  "proc_inst_task_assignee": "zhuhuimin",
			  "proc_inst_task_assignee_name": "朱慧敏",
			  "proc_inst_task_user_role_name": "分公司主任",
			  "proc_inst_task_user_org_name": "",
			  "proc_inst_task_params": "",
			  "proc_inst_task_claim": 0,
			  "proc_inst_task_sign": 1,
			  "proc_inst_task_sms": 0,
			  "proc_inst_task_remark": "",
			  "proc_inst_node_vars": "",
			  "proc_name": "",
			  "proc_code": "p-999",
			  "proc_inst_prev_node_code": "",
			  "proc_inst_prev_node_handler_user": "",
			  "proc_task_start_user_role_names": "5a264057c819ed211853906f",
			  "proc_task_start_name": "朱慧敏",
			  "proc_task_ver": 1,
			  "proc_task_content": "",
			  "proc_start_time": "2018-01-24T01:40:46.035Z",
			  "joinup_sys": "\"syesightSys_node\"",
			  "next_name": "王浩",
			  "proc_back": 0,
			  "previous_step": "",
			  "__v": 0,
			  "proc_task_start_user_role_code": [
				"zhuhuimin"
			  ],
			  "proc_inst_task_user_org": [],
			  "proc_inst_task_user_role": [
				"5a264057c819ed211853906f"
			  ]
			}
		  ]
            }




定义流程任务对象操作API

## 我的待办任务集合 [/task/todo]
### 获取我的待办任务集合 [POST]

+ Request
    + Body

            {
              "user_no": "gongli",
              "page": 1,
              "rows": 50,
			  "joinup_sys":"warnSys_node";//所属系统编号(warnSys_node-预警工单系统编号:errorSys_node-差错工单系统编号:auditorSys_node-稽核工单系统编号:syesightSys_node-慧眼工单系统编号)
            }

+ Response 200

    {success:true, code:'0000', msg:'查询成功。',rows:[data],total:2} 

## 查询某一条待办的详细信息 [/process/single/todo]
###  查询某一条待办的详细信息[POST]

+ Request
    + Body

            {
              "user_no":"luolisha",//当前任务处理人编号
              "inst_id":"5a5cacae0d9e72015c0d88f3"//当前流程实例id
            }

+ Response 200

    {success:true, code:'0000', msg:'查询成功。',
  "data": {
    "proc_inst_task_user_role": [
      "5a264057c819ed2118539070"
    ],
    "proc_inst_task_user_org": [
      "5a275c0677ec2e1e8448799a"
    ],
    "proc_task_start_user_role_code": [
      "5a264057c819ed2118539070"
    ],
    "__v": 0,
    "skip": 1,
    "joinup_sys": "\"syesightSys_node\"",
    "proc_task_start_name": "代维",
    "proc_task_start_user_role_names": "普通员工",
    "proc_inst_task_assignee": "luolisha",
    "proc_inst_task_remark": "",
    "proc_inst_task_sms": 0,
    "proc_inst_task_sign": 1,
    "proc_inst_task_claim": null,
    "proc_inst_task_params": "flag",
    "proc_vars": "“sss”",
    "proc_name": "测试跳级",
    "proc_code": "p-999",
    "proc_inst_node_vars": "",
    "proc_inst_prev_node_handler_user": "lixun",
    "proc_inst_prev_node_code": "processDefineDiv_node_2",
    "proc_inst_biz_vars": "“ss”",
    "proc_inst_task_title": "\"assas\"",
    "proc_inst_task_assignee_name": "骆莉莎",
    "proc_inst_task_status": 0,
    "proc_inst_task_complete_time": null,
    "proc_inst_task_handle_time": "2018-01-15T13:29:19.046Z",
    "proc_inst_task_arrive_time": "2018-01-15T13:29:19.046Z",
    "proc_inst_task_type": "部门副总审批",
    "proc_inst_task_name": "部门副总审批",
    "proc_inst_task_code": "processDefineDiv_node_4",
    "proc_inst_id": "5a5cacae0d9e72015c0d88f3",
    "_id": "5a5cacaf0d9e72015c0d88f6"
  }}  
	
	
## 我的已办任务集合 [/task/havetodo]
### 获取我的已办任务集合 [POST]

+ Request
    + Body

            {
              "user_no": "gongli",
              "page": 1,
              "rows": 50,
			  "joinup_sys":"warnSys_node";//所属系统编号(warnSys_node-预警工单系统编号:errorSys_node-差错工单系统编号:auditorSys_node-稽核工单系统编号:syesightSys_node-慧眼工单系统编号)
            }

+ Response 200

    {success:true, code:'0000', msg:'查询成功。',rows:[data],total:2}  
	
## 任务管理-获取指定任务 [/task/query]
### 获取指定任务 [POST]

+ Request
    + Body

            {
              "taskId": "5969c7d45526391fe0fc2e8b"
            }

+ Response 200

    {success:true, code:'0000', msg:'查询成功。',data:data}


## 任务管理-认领 [/task/accept]
### 认领任务 [POST]

+ Request
    + Body

            {
              "id": "5947398aba36650788eaa89b",
              "user_no": "gongli"
            }
    
+ Response 200

    {success:true, code:'0000', msg:'认领成功。'}  


## 任务管理-完成 [/task/complete]
### 完成任务 [POST]

+ Request
    + Body

            {
              "id": "5947398aba36650788eaa89b",
              "user_no": "gongli",
              "memo": "处理意见",
              "params":"{money:30,flag:true}",
			  "proc_vars": "",(可以为空，json字符串格式-不需变动的工单参数)
			  "biz_vars":""(json字符串格式-业务工单需要的参数)
            }

+ Response 200

    {success:true, code:'0000', msg:'任务完成成功。'} 

## 指派任务给人 [/task/assign/task]
### 指派任务给人 [POST]

+ Request
    + Body

            {
              "task_id": "5947398aba36650788eaa89b",//当前任务id
              "user_no": "70001",//当前节点处理人
			  "memo": "处理意见",
              "assign_user_no": "zhuhuimin",//下一节点处理人
              "node_code":"processDefineDiv_node_3",//要指派到的节点编号
			  "proc_title":"预警工单处理",
			  "proc_vars": "",(可以为空，json字符串格式-不需变动的工单参数)
			  "biz_vars":""(json字符串格式-业务工单需要的参数)
			  "next_name":"朱慧敏",//下一节点处理人姓名
			  "proc_back":0,//是否为回退任务(1-回退,0正常流转)
            }

+ Response 200

    {success:true, code:'0000', msg:'任务完成成功。'} 
	
	
## 分公司稽核指派任务 [/assign/interim_task]
### 分公司稽核指派任务 [POST]

+ Request
    + Body

            {
              proc_inst_id:5a42f6687168ba0e98594b12,(流程实例ID)
			  task_id:5a42f6687168ba0e98594b15,(当前任务ID)
			  node_code:processDefineDiv_node_2,(下一节点编号)
			  user_no:13984126789,(当前处理人编号)
			  user_name:"梁峻珲",(当前处理人姓名)
			  assign_user_no:admin1,(下一节点处理人编号)
			  proc_title:"分公司稽核测试",(标题)
			  biz_vars:"",(json字符串格式-业务工单需要的参数)
			  proc_vars:"",(可以为空，json字符串格式-不需变动的工单参数)
			  memo:"处理意见",(审批意见)
            }

+ Response 200

    {
  "success": true,
  "code": "1000",
  "msg": "流程流转新增任务信息正常82222。",
  "data": [
    {
      "__v": 0,
      "proc_inst_id": "5a42f6687168ba0e98594b12",
      "proc_inst_task_code": "processDefineDiv_node_2",
      "proc_inst_task_name": "省公司稽核",
      "proc_inst_task_type": "省公司稽核",
      "proc_inst_task_arrive_time": "2017-12-27T01:29:40.538Z",
      "proc_inst_task_handle_time": "2017-12-27T01:29:40.538Z",
      "proc_inst_task_complete_time": null,
      "proc_inst_task_status": 0,
      "proc_inst_task_assignee_name": "admin",
      "proc_inst_task_title": "\"分公司稽核测试\"",
      "proc_inst_biz_vars": "\"\"",
      "proc_inst_prev_node_code": "processDefineDiv_node_3",
      "proc_inst_prev_node_handler_user": "13984126789",
      "proc_inst_node_vars": "5734140b920170f892249b23",
      "proc_code": "p-108",
      "proc_name": "深度稽核派单",
      "proc_vars": "\"\"",
      "proc_inst_task_params": "flag",
      "proc_inst_task_claim": null,
      "proc_inst_task_sign": 1,
      "proc_inst_task_sms": 0,
      "proc_inst_task_remark": "",
      "proc_inst_task_assignee": "admin1",
      "_id": "5a42f7847168ba0e98594b19",
      "proc_task_start_user_role_code": [],
      "proc_inst_task_user_org": [
        "5a275c0377ec2e1e844878dd"
      ],
      "proc_inst_task_user_role": [
        "5a24aab506255330b47e45e1"
      ]
    }
  ],
  "finish": 1
}	



## 处理日志 [/task/logs]
### 获取任务处理日志 [POST]

+ Request
    + Body

            {
              "inst_id": "5987fc84810a7700110fda26",
              "user_no": ""(参数可为空),
			  "page": 1,
			  "rows": 10
            }

+ Response 200

    {success:true, code:'0000', msg:'查询成功。',rows:[data],total:2}  
	
## 处理日志集合 [/task/log/list]
### 获取处理日志集合 [POST]

+ Request
    + Body

            {
              "status": "0",(0-未处理，1-已处理)
              "user_no": ""(参数可为空),
			  "begin_date": "2017-09-19"(参数可为空),
			  "end_date": "2017-09-20"(参数可为空),
			  "page": 1,
			  "rows": 10
            }

+ Response 200

    {success:true, code:'0000', msg:'查询成功。',rows:[data],total:2}

## 获取已完成的节点编号信息 [/task/complete/node/codes]
### 获取已完成的节点编号信息 [POST]

+ Request
    + Body

            {
              "proc_inst_id": "流程实例ID"
            }
    
+ Response 200

    {success:true, code:'0000', msg:'获取任务数据成功',data:[data]}
	
	

## 区县公司调账营业员非销户归档 [/task/pigeonhole]
### 区县公司调账营业员非销户归档 [POST]

+ Request
    + Body

            {
              "proc_inst_id": "流程实例ID"
            }
    
+ Response 200

    {success:true, code:'0000', msg:'归档成功',data:[data]}
	
## 完成任务慧眼系统添加 [/task/finish/task]
### 完成任务慧眼系统添加 [POST]

+ Request
    + Body

			{
			  "user_no":"zhuhuimin",//当前任务处理人编号
			  "task_id":"5a67ea50c840f8144ca5fa94"//当前任务id
			}
    
+ Response 200

    {success:true, code:'0000', msg:'update the task',data:[data]}
	
## 任务回退接口 [/task/back]
### 任务回退接口 [POST]

+ Request
    + Body

            {
              "task_id": "5a67e41ec840f8144ca5fa91",//当前任务ID
			  "user_no":"zhuhuimin", //当前处理人编号
			  "memo":"处理意见",
			  "node_code":"processDefineDiv_node_3",//当前处理节点编号
			  "node_name":"分公司主任审批",//当前节点名
            }
    
+ Response 200

			{
		  "success": true,
		  "code": "0000",
		  "msg": "回退成功",
		  "data": {
			"__v": 0,
			"proc_inst_id": "5a67e41dc840f8144ca5fa90",
			"proc_inst_task_code": "processDefineDiv_node_2",
			"proc_inst_task_name": "普通员工起草",
			"proc_inst_task_type": "task",
			"proc_inst_task_arrive_time": "2018-01-24T02:07:12.555Z",
			"proc_inst_task_handle_time": "2018-01-24T02:07:12.555Z",
			"proc_inst_task_complete_time": null,
			"proc_inst_task_status": 0,
			"proc_inst_task_assignee_name": "朱慧敏",
			"proc_inst_task_title": "普通员工起草",
			"proc_inst_prev_node_code": "processDefineDiv_node_3",
			"proc_inst_prev_node_handler_user": "qiling",
			"proc_inst_node_vars": "",
			"proc_inst_task_claim": null,
			"proc_inst_task_sign": 1,
			"proc_inst_task_sms": 0,
			"proc_inst_task_remark": "\"处理意见\"",
			"proc_inst_task_assignee": "zhuhuimin",
			"proc_task_start_user_role_names": "5a264057c819ed211853906f",
			"proc_task_start_name": "朱慧敏",
			"proc_name": "",
			"proc_code": "p-999",
			"joinup_sys": "\"syesightSys_node\"",
			"next_name": "",
			"proc_back": 1,
			"previous_step": "",
			"_id": "5a67ea50c840f8144ca5fa94",
			"proc_task_start_user_role_code": [
			  "zhuhuimin"
			],
			"proc_inst_task_user_org": [],
			"proc_inst_task_user_role": [
			  "5a264057c819ed211853906f"
			]
		  }
		}
	

# Group 流程历史-修改

## 流程历史 [/process_instance/history]

### 获取我的流程历史列表 [POST]

+ Request (application/json)
    + Body

            {
              "user_no": "gongli",
              "page": 1,
              "rows": 50
            }

+ Response 200

     {success:true, code:'0000', msg:'查询成功。',rows:[data],total:2}



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
    "success": true,
    "code": "0000",
    "msg": "查询用户org",
    "data": [
        {
            "user_no": "zhangwu001",
            "user_name": "张五",
            "node_name": "县经理",
            "node_code": "processDefineDiv_node_4"
        }
    ]
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

## 获取当前节点信息 [/process/data/info]

### 各系统通用的用户数据同步接口 [POST]

+ Request
    + Body

            {
                role_type:sales
            }

+ Response 200
  {
    "success": true,
    "code": "1000",
    "msg": "查询到流程实例数据正常",
    "data": {
        (返回的数据格式为JSON)
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



## 流程实例启动 [/process_instance/createInstance]
### 流程实例启动 [POST]

+ Request
    + Body

            {
              "proc_code": "p_101流程编码",
              "proc_ver": 4,(可选)
              "title": "流程实例测试",
              "user_no": "wenganguo",
			  "proc_vars": "",(json字符串格式-流程实例从开始到归档都不需要变动的工单参数)
			  "biz_vars":""(json字符串格式-业务工单需要的参数)
            }
    
+ Response 200

    {success:true, code:'0000', msg:'流程实例创建启动成功。',data:taskEntity}

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
            }
    
+ Response 200

    {success:true, code:'0000', msg:'流程实例创建启动成功。',data:taskEntity}
	


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




+ Model (application/json)

    + Body

            {
                __v: 0,
                proc_inst_task_remark: '',
                proc_inst_task_sms: null,
                proc_inst_task_sign: 0,
                proc_inst_task_claim: null,
                proc_inst_task_params: '',
                proc_inst_task_user_role_name: '',
                proc_inst_task_user_role: '',
                proc_inst_task_assignee_name: '龚利',
                proc_inst_task_assignee: 'gongli',
                proc_inst_task_status: 0,
                proc_inst_task_complete_time: null,
                proc_inst_task_handle_time: null,
                proc_inst_task_arrive_time: MonJun19201710: 40: 10GMT+0800(中国标准时间),
                proc_inst_task_name: '采购申请',
                proc_inst_task_code: 'processDefineDiv_node_2',
                proc_inst_id: 5947398aba36650788eaa89a,
                _id: 5947398aba36650788eaa89b
            }




定义流程任务对象操作API

## 我的待办任务集合 [/task/todo]
### 获取我的待办任务集合 [POST]

+ Request
    + Body

            {
              "user_no": "gongli",
              "page": 1,
              "rows": 50
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
              "task_id": "5947398aba36650788eaa89b",
              "user_no": "70001",
			  "memo": "处理意见",
              "assign_user_no": "70001",
              "node_code":"processDefineDiv_node_3",
			  "proc_title":"预警工单处理",
			  "proc_vars": "",(可以为空，json字符串格式-不需变动的工单参数)
			  "biz_vars":""(json字符串格式-业务工单需要的参数)
            }

+ Response 200

    {success:true, code:'0000', msg:'任务完成成功。'} 
	



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



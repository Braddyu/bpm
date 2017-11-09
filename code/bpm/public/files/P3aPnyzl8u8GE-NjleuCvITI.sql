/*
Navicat MySQL Data Transfer

Source Server         : ywcj
Source Server Version : 50614
Source Host           : 10.201.253.111:3307
Source Database       : ywcj

Target Server Type    : MYSQL
Target Server Version : 50614
File Encoding         : 65001

Date: 2017-10-10 12:01:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ywcj_workbench_audits
-- ----------------------------
DROP TABLE IF EXISTS `ywcj_workbench_audits`;
CREATE TABLE `ywcj_workbench_audits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `warning_type` varchar(255) DEFAULT NULL COMMENT '预警类型',
  `describes` varchar(255) DEFAULT NULL COMMENT '说明',
  `remarks` text COMMENT '预警内容',
  `category` int(11) DEFAULT NULL COMMENT '类别：1、重点业务稽核，2、常态抽查稽核，3、异动监控,4. 重点工作',
  `pro_status` int(11) DEFAULT NULL COMMENT '处理状态：0/未处理;1/处理中;2/已回单;3/不通过;4/已通过',
  `warning_time` date NOT NULL DEFAULT '0000-00-00' COMMENT '预警时间',
  `processing_time` datetime DEFAULT NULL COMMENT '处理时间',
  `reason` varchar(255) DEFAULT NULL COMMENT '告警原因分类',
  `provincial_audit` text COMMENT '省级稽核情况',
  `audit_explain` text COMMENT '稽核说明',
  `role_id` varchar(255) DEFAULT NULL COMMENT '角色ID',
  `proc_inst_id` varchar(255) DEFAULT NULL COMMENT '任务ID',
  `task_id` varchar(255) DEFAULT NULL COMMENT '流程ID',
  `operator_no` varchar(255) DEFAULT NULL COMMENT '操作员编号',
  PRIMARY KEY (`id`,`warning_time`),
  KEY `warning_type_index` (`warning_type`),
  KEY `pro_status_index` (`pro_status`),
  KEY `idx_ywcj_workbench_audit_view` (`warning_type`,`pro_status`,`warning_time`),
  KEY `category_index` (`category`),
  KEY `iex_w_p_w` (`warning_type`,`category`,`pro_status`)
) ENGINE=InnoDB AUTO_INCREMENT=21512248 DEFAULT CHARSET=utf8 COMMENT='稽核告警表'
/*!50100 PARTITION BY RANGE (TO_DAYS(warning_time))
(PARTITION p2015 VALUES LESS THAN (736329) ENGINE = InnoDB,
 PARTITION p201601 VALUES LESS THAN (736360) ENGINE = InnoDB,
 PARTITION p201602 VALUES LESS THAN (736389) ENGINE = InnoDB,
 PARTITION p201603 VALUES LESS THAN (736420) ENGINE = InnoDB,
 PARTITION p201604 VALUES LESS THAN (736450) ENGINE = InnoDB,
 PARTITION p201605 VALUES LESS THAN (736481) ENGINE = InnoDB,
 PARTITION p201606 VALUES LESS THAN (736511) ENGINE = InnoDB,
 PARTITION p201607 VALUES LESS THAN (736542) ENGINE = InnoDB,
 PARTITION p201608 VALUES LESS THAN (736573) ENGINE = InnoDB,
 PARTITION p201609 VALUES LESS THAN (736603) ENGINE = InnoDB,
 PARTITION p201610 VALUES LESS THAN (736634) ENGINE = InnoDB,
 PARTITION p201611 VALUES LESS THAN (736664) ENGINE = InnoDB,
 PARTITION p201612 VALUES LESS THAN (736695) ENGINE = InnoDB,
 PARTITION p201701 VALUES LESS THAN (736726) ENGINE = InnoDB,
 PARTITION p201702 VALUES LESS THAN (736754) ENGINE = InnoDB,
 PARTITION p201703 VALUES LESS THAN (736785) ENGINE = InnoDB,
 PARTITION p201704 VALUES LESS THAN (736815) ENGINE = InnoDB,
 PARTITION p201705 VALUES LESS THAN (736846) ENGINE = InnoDB,
 PARTITION p201706 VALUES LESS THAN (736876) ENGINE = InnoDB,
 PARTITION p201707 VALUES LESS THAN (736907) ENGINE = InnoDB,
 PARTITION p201708 VALUES LESS THAN (736938) ENGINE = InnoDB,
 PARTITION p201709 VALUES LESS THAN (736968) ENGINE = InnoDB) */;

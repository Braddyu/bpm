/*
Navicat MySQL Data Transfer

Source Server         : ywcj
Source Server Version : 50614
Source Host           : 10.201.253.111:3307
Source Database       : ywcj

Target Server Type    : MYSQL
Target Server Version : 50614
File Encoding         : 65001

Date: 2017-10-10 13:47:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for common_dict_attr_info
-- ----------------------------
DROP TABLE IF EXISTS `common_dict_attr_info`;
CREATE TABLE `common_dict_attr_info` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `dict_id` varchar(32) NOT NULL COMMENT '所属字典ID',
  `field_name` varchar(50) NOT NULL COMMENT '字典属性名',
  `field_value` varchar(50) NOT NULL COMMENT '字典属性值',
  `field_checked` int(1) NOT NULL DEFAULT '1' COMMENT '默认选中标志；1--是，0--否',
  `field_order` int(1) NOT NULL DEFAULT '1' COMMENT '排序号',
  `field_status` int(1) NOT NULL DEFAULT '1' COMMENT '属性状态；1--正常，0--禁用',
  `field_parent_id` varchar(50) DEFAULT NULL COMMENT '上级属性ID',
  `field_parent_value` varchar(50) DEFAULT NULL COMMENT '上级属性值',
  `field_remark` varchar(500) DEFAULT NULL COMMENT '字典属性说明',
  `create_time` date NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `fk_dict_attr` (`dict_id`) USING BTREE,
  KEY `idx_dict_attr_field_val` (`field_value`),
  CONSTRAINT `common_dict_attr_info_ibfk_1` FOREIGN KEY (`dict_id`) REFERENCES `common_dict_info` (`dict_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for common_dict_info
-- ----------------------------
DROP TABLE IF EXISTS `common_dict_info`;
CREATE TABLE `common_dict_info` (
  `dict_id` varchar(32) NOT NULL COMMENT 'ID',
  `dict_name` varchar(50) NOT NULL COMMENT '字典名称',
  `dict_code` varchar(50) NOT NULL COMMENT '字典编码',
  `dict_status` int(1) NOT NULL DEFAULT '1' COMMENT '有效标志；1--有效，0--无效',
  `dict_remark` varchar(100) DEFAULT NULL COMMENT '字典说明',
  `create_time` date NOT NULL COMMENT '创建时间',
  `area` varchar(50) DEFAULT NULL,
  `version` char(2) DEFAULT NULL COMMENT '版本',
  `parent_id` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`dict_id`),
  KEY `idx_dict_code` (`dict_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for common_region_info
-- ----------------------------
DROP TABLE IF EXISTS `common_region_info`;
CREATE TABLE `common_region_info` (
  `area_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `areacode` varchar(50) NOT NULL COMMENT '区域编码',
  `areadesc` varchar(100) DEFAULT NULL COMMENT '区域名称',
  `areatype` int(1) DEFAULT NULL COMMENT '区域级别：1地市；2区县；3网格； 4乡镇 ；5村',
  `parentarea` varchar(50) DEFAULT NULL COMMENT '父节点',
  `status` int(1) DEFAULT NULL COMMENT '状态：0禁用；1启用',
  `fullname` varchar(200) DEFAULT NULL,
  `short_name` varchar(50) DEFAULT NULL COMMENT '短名称',
  `orderid` int(11) DEFAULT NULL,
  `is_regular_area` int(1) DEFAULT NULL COMMENT '是否正规区域 1是，0否',
  `grid_type` int(1) DEFAULT NULL COMMENT '网格类型（1常规网格 ；2虚拟网格）',
  PRIMARY KEY (`area_id`),
  KEY `areacode` (`areacode`),
  KEY `area_id` (`area_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2900 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for common_region_info_bak
-- ----------------------------
DROP TABLE IF EXISTS `common_region_info_bak`;
CREATE TABLE `common_region_info_bak` (
  `area_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `areacode` varchar(50) NOT NULL COMMENT '区域编码',
  `areadesc` varchar(100) DEFAULT NULL COMMENT '区域名称',
  `areatype` int(1) DEFAULT NULL COMMENT '区域级别：1地市；2区县；3网格； 4乡镇 ；5村',
  `parentarea` varchar(50) DEFAULT NULL COMMENT '父节点',
  `status` int(1) DEFAULT NULL COMMENT '状态：0禁用；1启用',
  `fullname` varchar(200) DEFAULT NULL COMMENT '全称',
  `short_name` varchar(50) DEFAULT NULL COMMENT '短名称',
  `orderid` int(11) DEFAULT NULL,
  `is_regular_area` int(1) DEFAULT NULL COMMENT '是否正规区域 1是，0否',
  `grid_type` int(1) DEFAULT NULL COMMENT '网格类型（1常规网格 ；2虚拟网格）',
  PRIMARY KEY (`area_id`),
  KEY `area_id` (`area_id`),
  KEY `areacode` (`areacode`)
) ENGINE=InnoDB AUTO_INCREMENT=3799 DEFAULT CHARSET=utf8 COMMENT='地市表';

-- ----------------------------
-- Table structure for common_user_info
-- ----------------------------
DROP TABLE IF EXISTS `common_user_info`;
CREATE TABLE `common_user_info` (
  `userid` int(16) NOT NULL AUTO_INCREMENT,
  `loginname` varchar(20) NOT NULL DEFAULT ' ' COMMENT '账号',
  `password` varchar(32) NOT NULL DEFAULT ' ',
  `password4A` varchar(32) DEFAULT NULL COMMENT '4A端密码',
  `empid` int(16) NOT NULL,
  `createdt` datetime NOT NULL,
  `updatedt` datetime DEFAULT NULL,
  `status` int(1) NOT NULL COMMENT '1启用，2禁用，3已解锁,4注销,5锁定',
  PRIMARY KEY (`userid`),
  KEY `userid` (`userid`) USING HASH,
  KEY `empid` (`empid`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=8625 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for common_user_login_log
-- ----------------------------
DROP TABLE IF EXISTS `common_user_login_log`;
CREATE TABLE `common_user_login_log` (
  `id` varchar(50) NOT NULL COMMENT '主键ID',
  `login_account` varchar(30) DEFAULT NULL COMMENT '登录账号',
  `user_id` varchar(50) DEFAULT NULL COMMENT '登录用户id',
  `name` varchar(50) DEFAULT NULL COMMENT '登录用户姓名',
  `user_tag` int(2) DEFAULT NULL COMMENT '用户标识：1-内部，2-外部',
  `phone_info` text COMMENT '手机信息',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `login_port` int(2) DEFAULT NULL COMMENT '用户登录端口：1--app端，2--web端',
  `org_id` varchar(50) DEFAULT NULL,
  `org_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `create_time_tag_userid` (`create_time`,`user_tag`,`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

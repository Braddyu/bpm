var express = require("express"), router = express.Router(), captchapng = require("captchapng"), config = require("../../../../config"), utils = require("../utils/app_utils"), tree = require("../utils/tree_utils"), coreService = require("../services/core_service.js"), memcached_utils = require("../utils/memcached_utils"), userModel = require('../models/user_model');
var process_util = require("../../../../../../app/utils/process_util");
router.route("/portal").get(function (a, c) {
    var d = utils.getCurrentUser(a), b = utils.getCurrentUserRole(a);
    if (d) {
        var e = d.user_sys._id;
        coreService.getPortalPage(e, function (g) {
            if (g.success) {
                var n = g.data.page_body, p = g.data.page_layout, k = g.data.page_layout_col_type;
                k || (k = "1:1:1");
                var k = k.split(":"), q = [], h = 0;
                k.forEach(function (a) {
                    h += parseInt(a)
                });
                k.forEach(function (a) {
                    q.push(parseInt(a) / h * 100)
                });
                coreService.getPortalModuleList(e, b._id, function (b) {
                    c.render(config.project.appviewurl + n, {
                        layout_id: g.data._id,
                        layout: p,
                        layout_cols: q,
                        layout_modules: g.data.page_layout_modules,
                        layout_all_modules: b.data,
                        currentUser: d,
                        currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                        currentUserRole: utils.getCurrentUserRole(a),
                        sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a))
                    })
                })
            } else c.render(config.project.appviewurl + "common/portal/template/tpl_default", {
                layout: "themes/portal_eui/layout",
                layout_cols: q,
                layout_modules: g.data.page_layout_modules,
                currentUser: d,
                currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                currentUserRole: utils.getCurrentUserRole(a),
                sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a))
            })
        })
    } else c.render(config.project.appviewurl + "common/portal/template/tpl_default", {layout: "themes/portal_eui/layout"})
});

router.route("/admin/api/portal/layout/:id").put(function (a, c) {
    var d = a.params.id, b = a.body.mids;
    if (d) {
        var e = utils.getCurrentUser(a);
        coreService.updatePortalPageHasModules(e._id, d, b, function (a) {
            utils.respJsonData(c, a)
        })
    } else utils.respMsg(c, !1, "2001", "\u9875\u9762id\u4e0d\u80fd\u4e3a\u7a7a\u3002", null, null)
});
router.route("/portal/module/:id").get(function (a, c) {
    var d = a.params.id;
    if (d) {
        var b = utils.getCurrentUser(a), e = utils.getCurrentUserRole(a);
        b ? coreService.getPortalModule(b.user_sys._id, d, e._id, function (a) {
            a.success ? /^http:\/\/+/.test(a.data.module_url) ? c.render(config.project.appviewurl + "common/portal/modules/module_frame", {
                url: a.data.module_url + (a.data.module_params ? "?" + a.data.module_params : ""),
                id: a.data._id,
                exid: utils.getUUID(),
                layout: !1
            }) : c.render(config.project.appviewurl + a.data.module_url, {
                id: a.data._id,
                exid: utils.getUUID(), params: a.data.module_params ? a.data.module_params : "", layout: !1
            }) : c.render(config.project.appviewurl + "common/portal/modules/module_error", {
                layout: !1,
                msg: "\u6a21\u5757\u5df2\u88ab\u505c\u7528\u6216\u65e0\u6743\u8bbf\u95ee"
            })
        }) : c.render(config.project.appviewurl + "common/portal/modules/module_error", {
            layout: !1,
            msg: "\u767b\u9646\u8d85\u65f6\uff0c\u8bf7\u91cd\u65b0\u767b\u9646"
        })
    } else c.render(config.project.appviewurl + "common/portal/modules/module_error", {
        layout: !1,
        msg: "\u6a21\u5757\u4e0d\u5b58\u5728"
    })
});

router.route("/profile").get(function (a, c) {
    var d = utils.getCurrentUser(a), b = utils.getCurrentUserRole(a);
    if (d) {
        var e = d.user_sys._id;
        var m = {};
        m.menu_nav = '个人中心 > 个人信息';
        c.render(config.project.appviewurl + "project/profile", {
            layout: "themes/beyond/layout",
            layout_cols: [],
            layout_modules: [],
            currentUser: d,
            menu:m,
            currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
            currentUserRole: utils.getCurrentUserRole(a),
            sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a))
        })
    } else c.render(config.project.appviewurl + "error", {layout: "themes/beyond/layout"})
});

router.route("/setting").get(function (a, c) {
    var d = utils.getCurrentUser(a), b = utils.getCurrentUserRole(a);
    if (d) {
        var e = d.user_sys._id;
        var m = {};
        m.menu_nav = '个人中心 > 设置';
        c.render(config.project.appviewurl + "project/setting", {
            layout: "themes/beyond/layout",
            layout_cols: [],
            layout_modules: [],
            menu: m,
            currentUser: d,
            currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
            currentUserRole: utils.getCurrentUserRole(a),
            sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a))
        })
    } else c.render(config.project.appviewurl + "error", {layout: "themes/beyond/layout"})
});

//获取验证码
router.route("/getVerificationcode").post(function (req, res) {
  console.log("获取验证码方法-------------------。");
   var phonename = req.body.phonename;
    userModel.$.find({user_phone:phonename}) .exec(function(error, result){
        console.log("查询用户表:",result);
        if(error){
                utils.respJsonData(res, utils.returnMsg(false, '1001', '根据账号名获取用户信息时出现异常', null, error));
        } else {
            if(result.length==0){
                utils.respJsonData(res, utils.returnMsg(false, '1000', '手机号不存在!', null, null));
            }else {
                var randomNumber = parseInt(((Math.random()*9+1)*100000));
                req.session['verificationcode']={randomNumber:randomNumber,time:new Date().getTime()};
                console.log("获取验证码时：",req.session.verificationcode.randomNumber);
                var params={
                    randomNumber:randomNumber
                }
                process_util.sendSMS(phonename,params,'VALIDATION');
                res.end();

            }

        }
    });
});
function toLogin(a, c,flag) {
    if(flag==1){
        console.log("进入toLogin1方法");
        a.render(config.project.theme + "layout_login", {
            key_1: config.auth.password.key_1,
            key_2: config.auth.password.key_2,
            key_3: utils.encryptDataByMD5(config.auth.password.key_3_prefix + utils.formatTime("yyyyMMdd")),
            message1: c,
            flag:flag
        })
    }else if(flag==2){
        console.log("进入toLogin2方法");
        a.render(config.project.theme + "layout_login", {
            key_1: config.auth.password.key_1,
            key_2: config.auth.password.key_2,
            key_3: utils.encryptDataByMD5(config.auth.password.key_3_prefix + utils.formatTime("yyyyMMdd")),
            message2: c,
            flag:flag
        })
    }else {
        console.log("进入toLogin3方法");
        a.render(config.project.theme + "layout_login", {
            key_1: config.auth.password.key_1,
            key_2: config.auth.password.key_2,
            key_3: utils.encryptDataByMD5(config.auth.password.key_3_prefix + utils.formatTime("yyyyMMdd")),
            message2: c,
            flag:flag
        })

    }

}
router.route("/login").get(function (a, c) {
    "cas" == config.auth.auth_type ? c.redirect(config.project.appurl) : toLogin(c, "")
}).post(function (a, c) {
    if(a.body.flag==1){
        console.log("登陆密码",a.body.password);
        var d = a.body.username, b = a.body.password, e = a.body.captcha ;
        console.log(d);
        console.log("name:%s ; pwd: %s", d, b);
        if (d)if (b)if (config.project.captcha_login_enable && !e) toLogin(c, "\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a\u3002",1); else {
            if (config.project.captcha_login_enable) {
                if (a.session[config.project.captcha_session_key] != e) {
                    toLogin(c, "\u9a8c\u8bc1\u7801\u4e0d\u6b63\u786e\u3002",1);
                    return
                }
                a.session[config.project.captcha_session_key] = null
            }
            b = utils.decryptData(b, config.auth.password.key_1, config.auth.password.key_2, utils.encryptDataByMD5(config.auth.password.key_3_prefix + utils.formatTime("yyyyMMdd")));
            console.log("decrypt pwd:" + b);
            coreService.userLogin(d, b, function (b) {
                if (b.success) {
                    var d = b.data, e = b.data.user_roles[0];
                    var roles_codes = new Array();
                    for (var i = 0; i < b.data.user_roles.length; i++) {
                        roles_codes.push(b.data.user_roles[i].role_code);
                    }
                    coreService.getMenusAndOptsByRoles(b.data.user_roles, function (b) {
                        if (b.success) {
                            var g = {}, h = {};
                            b = b.data;
                            for (var l = 0; l < b.length; l++) {
                                var f = b[l];
                                f.menu_id && (g[f.menu_id.menu_code] =
                                    f.menu_id);
                                for (var f = f.menu_opts, u = 0; u < f.length; u++) {
                                    var t = f[u];
                                    h.hasOwnProperty(t.opt_method) ? h[t.opt_method].push(t) : h[t.opt_method] = [t]
                                }
                            }
                            coreService.getSysMenu(function (b) {
                                b.success ? (a.session.current_user_roles = roles_codes.join(','), a.session.current_user = d, a.session.current_user_role_menus = g, a.session.current_user_role_menus_opts = h, a.session.current_user_role = e, a.session.current_sys_menus = b.data, a.session.save(function (a) {
                                    //console.log("\u767b\u9646\uff1a" + a);
                                    d.user_sys.sys_main_url ? c.redirect(d.user_sys.sys_main_url) : c.status(500).send("\u9519\u8bef\uff1a\u672a\u5b9a\u4e49\u7cfb\u7edf" +
                                        d.user_sys.sys_name + "\u7684\u4e3b\u9875\u5c5e\u6027[sys_main_url]")
                                })) : toLogin(c, "\u52a0\u8f7d\u7cfb\u7edf\u83dc\u5355\u51fa\u73b0\u5f02\u5e38\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458",1)
                            })
                        } else toLogin(c, "\u672a\u7ed9\u8d26\u53f7\u5206\u914d\u6743\u9650\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458",1)
                    })
                } else{
                    //console.log(b.code + ":" + b.msg),
                    "1008" == b.code ? toLogin(c, b.msg) : toLogin(c, "\u8d26\u53f7\u6216\u5bc6\u7801\u9519\u8bef",1)
                }

            })
        } else toLogin(c, "\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a",1); else toLogin(c, "\u8d26\u53f7\u4e0d\u80fd\u4e3a\u7a7a\u3002",1)//账号不能为空。

    } else {
        var d = a.body.username, b = a.body.password,y=a.body.verificationCode, e = a.body.captcha;
        var timeDifference = new Date().getTime()-a.session.verificationcode.time;
        y = utils.decryption(y, config.AES_KEY,"");
        console.log('解密后的验证码：',y);
        if(a.session.verificationcode.randomNumber==y&&(timeDifference/1000)>60){
            toLogin(c,"\u9a8c\u8bc1\u7801\u5df2\u5931\u6548",2);
            return;
        }
        if(a.session.verificationcode.randomNumber!=y){
            toLogin(c,"\u9a8c\u8bc1\u7801\u9519\u8bef",2);
            return;
        }

        console.log(d);
        console.log("name:%s ; pwd: %s", d, b);
        if (d)if (config.project.captcha_login_enable && !e) toLogin(c, "\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a\u3002",2); else {
            if (config.project.captcha_login_enable) {
                if (a.session[config.project.captcha_session_key] != e) {
                    toLogin(c, "\u9a8c\u8bc1\u7801\u4e0d\u6b63\u786e\u3002",2);
                    return
                }
                a.session[config.project.captcha_session_key] = null
            }
            //b = utils.decryptData(b, config.auth.password.key_1, config.auth.password.key_2, utils.encryptDataByMD5(config.auth.password.key_3_prefix + utils.formatTime("yyyyMMdd")));
            console.log("decrypt pwd:" + b);
            coreService.phoneLogin(d, b, function (b) {
                if (b.success) {
                    var d = b.data, e = b.data.user_roles[0];
                    var roles_codes = new Array();
                    for (var i = 0; i < b.data.user_roles.length; i++) {
                        roles_codes.push(b.data.user_roles[i].role_code);
                    }
                    coreService.getMenusAndOptsByRoles(b.data.user_roles, function (b) {
                        if (b.success) {
                            var g = {}, h = {};
                            b = b.data;
                            for (var l = 0; l < b.length; l++) {
                                var f = b[l];
                                f.menu_id && (g[f.menu_id.menu_code] =
                                    f.menu_id);
                                for (var f = f.menu_opts, u = 0; u < f.length; u++) {
                                    var t = f[u];
                                    h.hasOwnProperty(t.opt_method) ? h[t.opt_method].push(t) : h[t.opt_method] = [t]
                                }
                            }
                            coreService.getSysMenu(function (b) {
                                b.success ? (a.session.current_user_roles = roles_codes.join(','), a.session.current_user = d, a.session.current_user_role_menus = g, a.session.current_user_role_menus_opts = h, a.session.current_user_role = e, a.session.current_sys_menus = b.data, a.session.save(function (a) {
                                    //console.log("\u767b\u9646\uff1a" + a);
                                    d.user_sys.sys_main_url ? c.redirect(d.user_sys.sys_main_url) : c.status(500).send("\u9519\u8bef\uff1a\u672a\u5b9a\u4e49\u7cfb\u7edf" +
                                        d.user_sys.sys_name + "\u7684\u4e3b\u9875\u5c5e\u6027[sys_main_url]")
                                })) : toLogin(c, "\u52a0\u8f7d\u7cfb\u7edf\u83dc\u5355\u51fa\u73b0\u5f02\u5e38\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458",2)
                            })
                        } else toLogin(c, "\u672a\u7ed9\u8d26\u53f7\u5206\u914d\u6743\u9650\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458",2)
                    })
                } else {
                    //console.log(b.code + ":" + b.msg),
                    "1008" == b.code ? toLogin(c, b.msg) : toLogin(c, "\u624b\u673a\u53f7\u9519\u8bef", 2)
                }
            })
        }else toLogin(c, "\u624b\u673a\u53f7\u4e0d\u80fd\u4e3a\u7a7a",2)
    }


});

function sleep(a) {
    for (var c = Date.now(); Date.now() - c <= a;);
}
router.route("/logout").get(function (a, c) {
    utils.clearSession(a);
    "cas" == config.auth.auth_type ? utils.respMsg(c, !0, "0000", "\u6ce8\u9500\u767b\u9646\u6210\u529f", {url: config.auth.cas_server_url + "/logout?service=" + config.auth.cas_client_service_url + config.project.appurl}, null) : utils.respMsg(c, !0, "0000", "\u6ce8\u9500\u767b\u9646\u6210\u529f", {url: config.project.appurl + "/login"}, null)
});
router.route("/public/sysData").get(function (a, c) {
    coreService.getSysData(function (a) {
        utils.respJsonData(c, a)
    })
});
router.route("/public/orgTreeData").get(function (a, c) {
    coreService.getOrgTreeData(function (a) {
        utils.respJsonData(c, a)
    })
});
router.route("/public/orgRootTreeData").get(function (a, c) {
    coreService.getOrgTreeData(function (a) {
        utils.respJsonData(c, [{
            id: "0",
            text: config.datas.tree_org.root_node_name ? config.datas.tree_org.root_node_name : "\u8d35\u5dde\u79fb\u52a8",
            children: a
        }])
    })
});
router.route("/public/orgRootTreeDataAsyn").get(function (a, c) {
    var org_id = a.query.id;
    if(org_id == null){
        org_id = "1";
    }
    coreService.getOrgRootTreeDataAsyn(org_id,function (a) {
        if(a && a.length){
            utils.respJsonData(c, a);
        }else{
            utils.respJsonData(c,[]);
        }

    })
});
router.route("/public/sysUser").get(function (a, c) {
    var conditionMap = {};
    conditionMap.user_status = '1';
    conditionMap.user_org = a.query.user_org;
    conditionMap.user_sys = '57ff3789b641270aa4533089';
    coreService.getUserData(conditionMap,function (a) {
        utils.respJsonData(c, a)
    })
});
router.route("/public/dict/:code").get(function (a, c) {
    var d = a.params.code;
    d ? memcached_utils.getDict(function (a, e) {
        utils.respJsonData(c, tree.transData(e[d], "id", "pid", "children"))
    }) : utils.respJsonData(c, [])
});
router.route("/captcha").get(function (a, c) {
    var d = Math.pow(10, Math.floor(4 + 3 * Math.random()) - 1), b = parseInt(9 * Math.random() * d + d);
    a.session.save(function (d) {
        console.log("captcha:" + b);
        a.session[config.project.captcha_session_key] = b;
        d = new captchapng(86, 34, b);
        d.color(Math.floor(160 + 40 * Math.random()), Math.floor(160 + 40 * Math.random()), Math.floor(160 + 40 * Math.random()), 140);
        d.color(Math.floor(20 * Math.random() + 110), Math.floor(20 * Math.random() + 110), Math.floor(20 * Math.random() + 110), 255);
        d = d.getBase64();
        d = new Buffer(d,
            "base64");
        c.writeHead(200, {"Content-Type": "image/png"});
        c.end(d)
    })
});
router.route("/switchRole/:roleid").get(function (a, c) {
    var d = a.params.roleid, b = a.session.req.session.current_user_role;
    //console.log(d + "," + b._id);
    d == b._id ? utils.respMsg(c, !0, "0001", "\u5f53\u524d\u5df2\u663e\u793a\u8be5\u89d2\u8272\u6743\u9650", null, null) : coreService.hasRoleByUser(a.session.current_user._id, d, function (b) {
        if (b.success) {
            var d = b.data;
            coreService.getMenusAndOptsByRole(d._id, function (b) {
                if (b.success) {
                    var e = {}, k = {};
                    b = b.data;
                    for (var q = 0; q < b.length; q++) {
                        var h = b[q];
                        e[h.menu_id.menu_code] = h.menu_id;
                        for (var h = h.menu_opts, l = 0; l < h.length; l++) {
                            var f = h[l];
                            k.hasOwnProperty(f.opt_method) ? k[f.opt_method].push(f) : k[f.opt_method] = [f]
                        }
                    }
                    a.session.current_user_role_menus = e;
                    a.session.current_user_role_menus_opts = k;
                    a.session.current_user_role = d;
                    utils.respMsg(c, !0, "0000", "\u5207\u6362\u89d2\u8272\u6210\u529f", null, null)
                } else utils.respMsg(c, !1, "1005", "\u5207\u6362\u89d2\u8272\u5931\u8d25[\u672a\u7ed9\u8d26\u53f7\u5206\u914d\u6743\u9650\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458]", null, null)
            })
        } else utils.respJsonData(c,
            b)
    })
});
router.route("/:code").get(function (a, c) {
    var d = a.params.code;
    //console.log("menu_code:" + d);
    var b = getMenuInfo(a, d), e = tree.buildSysTree(utils.getCurrentSysMenus(a)), g = utils.getCurrentUser(a), n = g.user_sys.sys_theme_layout;
    //console.log("\u5e03\u5c40\u6587\u4ef6\uff1a" + n);
    var p = utils.getCurrentUserRole(a), k = a.param("reqparams");
    //console.log("reqparams:" + k);
    memcached_utils.getSysParam(a, function (d) {
        memcached_utils.getDict(function (h, l) {
            if (b && 0 == b.menu_type)coreService.getPortalPageByCode(b.menu_sysid, p._id,
                b.menu_url, function (f) {
                    if (f.success) {
                        var h = f.data.page_body, m = f.data.page_layout_col_type;
                        m || (m = "1:1:1");
                        var m = m.split(":"), v = [], r = 0;
                        m.forEach(function (a) {
                            r += parseInt(a)
                        });
                        m.forEach(function (a) {
                            v.push(parseInt(a) / r * 100)
                        });
                        0 == f.data.page_is_customize ? coreService.getPortalModuleList(b.menu_sysid, p._id, function (m) {
                            c.render(config.project.appviewurl + h, {
                                layout_id: f.data._id,
                                layout: 0 == b.menu_use_sys_layout ? !1 : n,
                                layout_cols: v,
                                layout_modules: f.data.page_layout_modules,
                                layout_all_modules: m.data,
                                currentUser: g,
                                currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                                currentUserRole: p,
                                currentUserRoles:a.session.current_user_roles,
                                sysmenus: e,
                                root_menu: getChildMenus(b, e),
                                can_customize: 0 == b.menu_type && 1 == f.data.page_is_customize && utils.hasOptRole(a, "put", "custom_portal_layout"),
                                menu: b,
                                layout_module_types: l.common_portal_module_type,
                                commonDictData: l,
                                commonSysParamData: d,
                                reqparams: k
                            })
                        }) : coreService.getPortalPagePersonal(g._id, p._id, f.data._id, function (m) {
                            var r = null, r = m.success ? m.data.page_layout_modules : f.data.page_layout_modules;
                            coreService.getPortalModuleList(b.menu_sysid,
                                p._id, function (m) {
                                    c.render(config.project.appviewurl + h, {
                                        layout_id: f.data._id,
                                        layout: 0 == b.menu_use_sys_layout ? !1 : n,
                                        layout_cols: v,
                                        layout_modules: r,
                                        layout_all_modules: m.data,
                                        currentUser: g,
                                        currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                                        currentUserRole: p,
                                        currentUserRoles:a.session.current_user_roles,
                                        sysmenus: e,
                                        root_menu: getChildMenus(b, e),
                                        can_customize: 0 == b.menu_type && 1 == f.data.page_is_customize && utils.hasOptRole(a, "put", "custom_portal_layout"),
                                        menu: b,
                                        layout_module_types: l.common_portal_module_type,
                                        commonDictData: l,
                                        commonSysParamData: d,
                                        reqparams: k
                                    })
                                })
                        })
                    } else c.render(config.project.appviewurl +
                        "common/portal/template/tpl_default", {
                        message: "\u52a0\u8f7dportal\u9875\u9762\u51fa\u73b0\u5f02\u5e38",
                        layout: 0 == b.menu_use_sys_layout ? !1 : n,
                        currentUser: g,
                        currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                        currentUserRole: utils.getCurrentUserRole(a),
                        currentUserRoles:a.session.current_user_roles,
                        sysmenus: e,
                        root_menu: getChildMenus(b, e),
                        menu: b,
                        commonDictData: l,
                        commonSysParamData: d
                    })
                }); else if (b)c.render(config.project.appviewurl + b.menu_url, {
                layout: 0 == b.menu_use_sys_layout ? !1 : n,
                currentUser: g,
                currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                currentUserRole: utils.getCurrentUserRole(a),
                currentUserRoles:a.session.current_user_roles,
                sysmenus: e,
                root_menu: getChildMenus(b, e),
                menu: b,
                commonDictData: l,
                commonSysParamData: d,
                reqparams: k
            }); else {
                var f = getMenuInfo(a, "home");
                c.render(config.project.appviewurl + f.menu_url, {
                    layout: 0 == f.menu_use_sys_layout ? !1 : n,
                    currentUser: g,
                    currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                    currentUserRole: utils.getCurrentUserRole(a),
                    currentUserRoles:a.session.current_user_roles,
                    sysmenus: e,
                    root_menu: getChildMenus(f, e),
                    menu: f,
                    commonDictData: l,
                    commonSysParamData: d,
                    reqparams: k
                })
            }
        })
    })
});
function getMenuInfo(a, c) {
    var d = utils.getCurrentSysMenus(a), b = {};
    if (d && d != [])for (var e = 0; e < d.length; e++) {
        var g = d[e];
        b[g.menu_code] = g
    }
    return b[c]
}
function getChildMenus(a, c) {
    //console.log(JSON.stringify(a));
    var d = a.menu_sysid, b = a.menu_root_id, e = {}, g = c[d];
    if (g)for (var n = 0; n < g.length; n++) {
        var p = g[n];
        if (p._id == b) {
            e[d] = p.children;
            break
        }
    }
    return e
}
router.route("/public/shortcutMenu").get(function (a, c) {
    var d = utils.getCurrentUser(a);
    coreService.getShortcutMenuByUser(d._id, function (a) {
        utils.respJsonData(c, a)
    })
}).post(function (a, c) {
    var d = utils.getCurrentUser(a);
    coreService.addShortcutMenu(d._id, a.body.menu_id, function (a) {
        utils.respJsonData(c, a)
    })
});

//验证码加密
router.route("/encverfcode").post(function (req, res) {
    console.log("加密验证码方法-------------------");
    var verfcode = req.body.verfcode;
    var ecncode='';
    try{
        ecncode =  utils.encryption(verfcode,config.AES_KEY,"");
    }catch(e){
        console.log("验证码加密异常：",e);
        utils.respJsonData(res, utils.returnMsg(false, '1000', '验证码加密异常!', null, e));
        return;
    }
    if(ecncode){
        utils.respJsonData(res, utils.returnMsg(true, '0000', '验证码加密成功!', ecncode, null));
    }else{
        utils.respJsonData(res, utils.returnMsg(false, '1000', '验证码加密失败!', null, null));
    }

});

module.exports = router;
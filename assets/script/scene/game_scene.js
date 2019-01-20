let constant = require("constant");
let ui = require("ui");
let res = require("res");
let download = require("download");
let utils = require("utils");
let net = require("net");

cc.Class({
    extends: cc.Component,

    properties: {
        waiting_node: cc.Node,
        touch_node: cc.Node,
        loading_node: cc.Node,

        ui_prefabs: {
            default: [],
            type: cc.Class({
                name: "prefab_map",
                properties: {
                    name: "",
                    prefab: cc.Prefab,
                },
            }),
        },

        texture_atlas: [cc.SpriteAtlas],
    },

    // use this for initialization
    onLoad: function () {
        window.bindUI.init(this.node);

        //  把ui_prefabs数组中的所有prefab和它的名字组成map
        utils.screen_fix();
        let prefab_map = {};
        this.ui_prefabs.forEach((info) => {
            if (info.name && info.prefab) {
                prefab_map[info.name] = info;
            }
        });
        this.prefab_map = prefab_map;
        this.node.getChildByName("touch_node").active = false
        //  把所有的sprite atlas 中的sprite frame 都添加到 download 中
        download.load_atlas_to_frame(this.texture_atlas);
        this._register_handler();
        this.init_ui();
        net.emit("enter_game");
    },

    init_ui: function () {
        this.base_nodes = {};

        this._status_bar = cc.instantiate(this.prefab_map["ui_status_bar"].prefab);
        this.node.getChildByName("bar_node").addChild(this._status_bar, constant.WINDOW_ZINDEX.STATUS_BAR);

        ui.open("ui_main");
        ///this.start_cd_schedule();
    },

    _register_handler: function () {
        ui.on("open", function (window_name, ...args) {
            let ui_args = [];
            for (let i = 0; i < args.length - 1; i++) {
                ui_args.push(args[i]);
            }

            let do_open_ui = (prefab) => {
                if (this.base_nodes[window_name]) {
                    this._switch_to_base_node(window_name);
                    return;
                }
                let prefab_node = cc.instantiate(prefab);
                if (!prefab_node) {
                    cc.log("创建prefab失败");
                    return;
                }
                let controller = prefab_node.getComponent(window_name);
                if (!controller) {
                    cc.log("找不到prefab挂载的同名脚本");
                    return;
                }
                controller.args = ui_args;
                let window_type = controller.window_type;
                switch (window_type) {
                    case constant.WINDOW_TYPE.INVALID:
                        cc.log("错误的窗口类型");
                        break;
                    case constant.WINDOW_TYPE.BASE:
                        prefab_node.parent = this.node.getChildByName("base_node");
                        prefab_node.zIndex = constant.WINDOW_ZINDEX.BASE;
                        this.base_nodes[window_name] = prefab_node;
                        this._switch_to_base_node(window_name);
                        break;
                    case constant.WINDOW_TYPE.UI:
                        prefab_node.parent = this.node.getChildByName("ui_node");
                        prefab_node.zIndex = constant.WINDOW_ZINDEX.UI;
                        this._close_last_popup_ui();
                        this._inactive_last_ui();
                        ui.push({
                            window_name: window_name,
                            prefab_node: prefab_node,
                            window_type: window_type
                        });
                        if (prefab_node.getComponent(window_name) && prefab_node.getComponent(window_name).components) {
                            proxy(prefab_node.getComponent(window_name).components)
                        }
                        break;
                    case constant.WINDOW_TYPE.POPUP:
                        prefab_node.parent = this.node.getChildByName("popup_node");
                        prefab_node.zIndex = constant.WINDOW_ZINDEX.POPUP;
                        this._close_last_popup_ui();
                        ui.push({
                            window_name: window_name,
                            prefab_node: prefab_node,
                            window_type: window_type
                        });
                        break;
                    case constant.WINDOW_TYPE.TIP:
                        prefab_node.parent = this.node.getChildByName("tips_node");
                        prefab_node.zIndex = constant.WINDOW_ZINDEX.TIP;
                        break;
                    default:
                        break;
                }
            };

            let prefab_info = this.prefab_map[window_name];
            if (prefab_info) {
                if (prefab_info.prefab) {
                    do_open_ui(prefab_info.prefab);
                } else {
                    cc.log("找不到prefab，请注册到game_scene.js", window_name);
                }
                return;
            }
            //  从resources/prefab目录中下载
            let uri = res.prefab[window_name + "_prefab"];
            uri = uri && uri.split(".prefab")[0];
            if (!uri) {
                cc.log("resources/prefab目录下找不到prefab", window_name);
                return;
            }
            cc.loader.loadRes(uri, (error, prefab) => {
                if (error) {
                    cc.log("下载prefab失败：", uri);
                    return;
                }
                this.prefab_map[window_name] = {
                    name: window_name,
                    prefab: prefab,
                };
                do_open_ui(prefab);
            });
        }.bind(this), this.node);

        ui.on("close", function () {
            let last_window_info = ui.get_last_window_info();
            let ui_amount = ui.get_ui_amount();
            if (!last_window_info) {
                cc.log("场景中没有ui window了");
                return;
            }
            switch (last_window_info.window_type) {
                case constant.WINDOW_TYPE.INVALID:
                    cc.log("错误的窗口类型");
                    break;
                case constant.WINDOW_TYPE.BASE:
                    cc.log("should not close base node");
                    break;
                case constant.WINDOW_TYPE.UI:
                    last_window_info.prefab_node.parent = null;
                    ui.pop();
                    this._active_last_ui();
                    break;
                case constant.WINDOW_TYPE.POPUP:
                    last_window_info.prefab_node.parent = null;
                    ui.pop();
                    break;
                case constant.WINDOW_TYPE.TIP:
                    cc.log("tip类型窗口无close事件");
                    break;
                default:
                    break;
            }

        }.bind(this), this.node);


        net.on("enter_game_ret",(_msg) =>{
            cc.log(_msg);

        });
        ui.on("touch_enable", (_val) => {
            this.touch_node.active = _val;
        }, this.node);
    },


    _switch_to_base_node: function (window_name) {
        for (let key in this.base_nodes) {
            if (this.base_nodes.hasOwnProperty(key)) {
                this.base_nodes[key].active = key === window_name;
            }
        }
        //ui.close_all();

    },

    _inactive_last_ui: function () {
        return;
        let last_window_info = ui.get_last_window_info();
        if (!last_window_info) {
            return;
        }
        switch (last_window_info.window_type) {
            case constant.WINDOW_TYPE.INVALID:
                break;
            case constant.WINDOW_TYPE.BASE:
                break;
            case constant.WINDOW_TYPE.UI:
                last_window_info.prefab_node.active = false;
                break;
            case constant.WINDOW_TYPE.POPUP:
                break;
            default:
                break;
        }
    }
    ,

    _active_last_ui: function () {
        return;
        let last_window_info = ui.get_last_window_info();
        if (!last_window_info) {
            return;
        }
        switch (last_window_info.window_type) {
            case constant.WINDOW_TYPE.INVALID:
                break;
            case constant.WINDOW_TYPE.BASE:
                break;
            case constant.WINDOW_TYPE.UI:
                last_window_info.prefab_node.active = true;
                break;
            case constant.WINDOW_TYPE.POPUP:
                break;
            default:
                break;
        }
    }
    ,

    _close_last_popup_ui: function () {
        let last_window_info = ui.get_last_window_info();
        if (!last_window_info) {
            return;
        }
        if (last_window_info.window_type === constant.WINDOW_TYPE.POPUP) {
            last_window_info.prefab_node.parent = null;
            ui.pop();
        }
    },

    //主界面轮询
    start_cd_schedule:function () {
        if(this.update_cd){
            return;
        }
        this.update_cd = function () {

        }.bind(this);
        this.schedule(this.update_cd, 10, cc.macro.REPEAT_FOREVER, 10);
    }

});


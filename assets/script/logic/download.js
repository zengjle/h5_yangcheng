/**
 * Created by xianbei on 18/5/5.
 * */

let res = null;

let res_map = {};

module.exports = new(cc.Class({

    extends: require("logic"),

    properties: {
        json_loaded: false,
        res_map: null,
        sprite_map: null,
    },

    ctor: function () {
        this.res_map = res_map;
        this.sprite_map = {};
        this.atlas_map = {};
    },

    init: function () {

    },

    init_modules: function () {
        res = require("res");
    },

    //  把map形式的json表中的所有行都添加到config上，id做为key
    load_json: function (progress_cb, cb) {
        if (this.json_loaded) {
            cb && cb();
            return;
        }
        let json_array = Object.keys(res.data).map((key) => {
            return res.data[key];
        });
        this._download(json_array, (percent) => {
            progress_cb(percent)
        }, (_retObj) => {
            this.json_loaded = true;
            cb && cb(_retObj);
        });
    },

    //  把输入的参数重现整理成合法的一维数组
    _regroup: function (group) {
        let new_array = [];
        if (!Array.isArray(group)) {
            new_array = [group];
        } else {
            for (let i in group) { //融合各个数组整合成一个
                let item = group[i];
                if (Array.isArray(item)) {
                    new_array = new_array.concat(item);
                } else {
                    new_array.push(item);
                }
            }
        }
        return new_array;
    },

    load_atlas_to_frame: function (atlas_array) {
        atlas_array.forEach((atlas) => {
            atlas && atlas.getSpriteFrames().forEach((frame) => {
                this.sprite_map[frame.name] = frame;
            });
        });
    },

    load_atlas: function (res, cb) {
        if (this.atlas_map[res]) {
            cb && cb();
        } else {
            cc.loader.loadRes(res, cc.SpriteAtlas, (err, atlas) => {
                if (!err) {
                    this.atlas_map[res] = atlas;
                }
                cb && cb(err);
            });
        }
    },

    get_sprite_frame(_path, cb, _err_cb) {
        return cc.loader.loadRes(_path, cc.SpriteFrame, (_err, _sf) => {
            if (_err) {
                cc.error(_err.message || _err);
                _err_cb && _err_cb();
                return;
            }
            _sf && cb(_sf);
        });
    },

    get_atlas: function (_res) {
        return this.atlas_map[_res];
    },


    //  下载一个需要下载的文件列表
    _download: function (group, progress_callback, finish_callback) {
        if (!finish_callback) {
            finish_callback = progress_callback;
            progress_callback = null;
        }
        let progress = 0;

        let plistArray = [];
        for (let i = 0; i < group.length; ++i) {
            let item = group[i];
            // cc.log("_download item:", item);
            if (item.indexOf(".plist") != -1) {
                plistArray.push(item.split(".plist")[0]);
            }
        }

        for (let i = 0; i < plistArray.length; ++i) {
            let png = plistArray[i] + ".png";
            for (let j = 0; j < group.length; ++j) {
                let item = group[j];
                if (item.indexOf(png) != -1) {
                    group.splice(j, 1);
                }
            }
        }

        let total = Array.isArray(group) ? group.length : 1;

        let ret_obj = {};

        let loadFunc = function (res) {
            let type = null;
            if (res.indexOf(".json") !== -1) {

            } else if (res.indexOf(".plist") !== -1) {
                type = cc.SpriteAtlas;
                res = res.split(".")[0];
            } else {
                res = res.split(".")[0];
            }

            cc.loader.loadRes(res, type, function (err, data) {
                if (err) {
                    cc.log("load " + res + " failed");
                } else {
                    //根据类型存储资源
                    let config = require("config");
                    cc.log("------------", data);
                    if (res.indexOf("static_") !== -1) {
                        ret_obj[data[0]] = data;
                    } else {
                        let key = res.substring(5, res.length - 5);
                        config[key] = data;
                    }
                    switch (type) {
                        case cc.SpriteAtlas:
                            let frames = data.getSpriteFrames();
                            for (let i = 0; i < frames.length; ++i) {
                                let frame = frames[i];
                                this.sprite_map[frame.name] = frame;
                            }
                            break;
                    }
                }

                if (progress_callback) {
                    progress_callback((progress + 1) / total, data);
                }
                progress++;
                if (progress < total) {
                    // loadFunc(group[progress]);
                } else {
                    if (finish_callback) {
                        finish_callback(ret_obj);
                    }
                }

            });
        };
        for (let i = 0; i < group.length; ++i) {
            loadFunc(group[i]);
        }
    },

    download_frame:function (file_name, cb) {
        if (this.sprite_map[file_name]) {
            cb && cb(null,this.sprite_map[file_name]);
        }
        else {
            cc.loader.loadRes(file_name, cc.SpriteFrame, function (err, frame) {
                if (!err) {
                    this.sprite_map[file_name] = frame;
                }
                cb && cb(err,this.sprite_map[file_name]);
            }.bind(this));
        }

    },

    download_servant_half_frame:function (_id,_cb) {
        let file_name = res.texture.servant_role.half["servant_half_"+_id+"_png"];
        if(file_name){
            this.download_frame(res.texture.servant_role.half["servant_half_"+_id+"_png"],_cb);
        }
        else{
            _cb && _cb("未找到相应资源"+_id);
        }
    },
    download_player_body_frame:function (_id,_cb) {
        let file_name = res.texture.player_body["player_body_"+_id+"_png"];
        if(file_name){
            this.download_frame(res.texture.player_body["player_body_"+_id+"_png"],_cb);
        }
        else{
            _cb && _cb("未找到相应资源"+_id);
        }
    },


    register_handler: function () {

    },

}))();

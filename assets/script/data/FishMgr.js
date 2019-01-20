/**鱼
 *
 */
const Fish = (function () {
    'use strict';
    function Fish(data, uid) {
        this._init_fish_data(data, uid);
        this._init_fish_getset();
    };
    const _p = Fish.prototype;

    /**初始化鱼的信息
     *
     */
    _p._init_fish_data = function (data, uid) {
        if (data) {
            this.data = data;
            return;
        }
        this.data = config.data['fish_init_data'];
        this.data.uid = uid;
    };

    /**初始化鱼的getset事件
     *
     */
    _p._init_fish_getset = function () {
        //get
        cc.js.get(this, 'uid', function () {
            return this.data.uid;
        });
        cc.js.get(this, 'name', function () {
            return this.data.name;
        });

        //getset
        cc.js.get(this, 'lv', this.get_lv, this.set_lv);
        cc.js.get(this, 'exp', this.get_exp, this.set_exp);
        cc.js.get(this, 'max_exp', this.get_max_exp, this.set_max_exp);
    };

    _p.get_lv = function () {
        return this.data.lv;
    };

    _p.set_lv = function (val) {
        this.data.lv = val;
        Global.FishMgr.update_fish_data(this);
    };

    _p.get_exp = function () {
        return this.data.exp;
    };

    _p.set_exp = function (val) {
        this.data.exp = val;
        Global.FishMgr.update_fish_data(this);
    };

    _p.get_max_exp = function () {
        return this.data.max_exp;
    };

    _p.set_max_exp = function (val) {
        this.data.max_exp = val;
        Global.FishMgr.update_fish_data(this);
    };

    return Fish;
}());

/**管理鱼
 *
 */
const FishMgr = (function () {
    'use strict';
    function FishMgr() {
    };

    const _p = FishMgr.prototype;

    /**初始化
     *
     */
    _p.init = function () {
        Global.Observer.on('DataMgr_init_data_ok', this._on_DataMgr_init_data_ok, this);
    };

    /**监听数据初始化完毕
     *
     */
    _p._on_DataMgr_init_data_ok = function () {
        this.fish = Global.DataMgr.fish;
        Global.Observer.emit('FishMgr_init_data_ok', this.fish);
    };

    /**新建鱼信息
     *
     * @param fish
     */
    _p.create_fish_data = function (data) {
        var fish = new Fish(data, this._get_uid());
        this.fish[fish.uid] = fish.data;
        return fish;
    };

    /**更新鱼信息
     *
     */
    _p.update_fish_data = function (fish) {
        this.fish[fish.uid] = fish.data;
    };

    _p._get_uid = function () {
        var count = 1;
        while (true) {
            if (!this.fish[count]) {
                return count;
            }
        }
    };

    return FishMgr;
}());
module.exports = FishMgr;
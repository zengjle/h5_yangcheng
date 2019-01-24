/**管理用户
 *
 */
const UserMgr = (function () {
    'use strict';
    function UserMgr() {
    };

    var _p = UserMgr.prototype;

    /**登入
     *
     * @param tel       手机号
     * @param code      验证码
     */
    _p.login = function (tel, code) {
        if (Global.DEBUG) {
            // Global.DEBUG = false;
            cc.js.get(this, 'id', function () { return '1'; });
            Global.Observer.emit('login', '1');
            return;
        }
        if (!this.verification_param(tel, code))                  //验证参数是否有正确
            return;
        Global.HTTP.send("GET", '', {
            module: 'UserService.webLogin',
            tel: tel,
            code: code
        }, function (res) {
            cc.js.get(this, 'id', function () { return tel; });
            Global.Observer.emit('login', tel);
        }.bind(this), function (res) {
            tips.show(res.msg || '登入失败');
        });
    };

    /**获取好友信息
     * 
     */
    _p.get_friend_info = function (cb) {
        Global.HTTP.send("GET", '', {
            module: 'CodeService.sendCode',
            id: this.id
        }, function (res) {
            cb && cb(res.data);
        }, function () {
            tips.show('获取失败');
        });
    };

    /**发送手机验证码
     *
     * @param tel       手机号
     */
    _p.send_code = function (tel) {
        if (!this.verification_param(tel, true))                                    //验证参数是否有正确
            return;
        Global.HTTP.send("GET", '', {
            module: 'CodeService.sendCode',
            tel: tel
        }, function () {
            tips.show('发送成功');
        }, function () {
            tips.show('发送失败');
        });
        return true;
    };

    /**验证参数是否正确
     *
     * @param tel           账号
     * @param code          密码
     */
    _p.verification_param = function (tel, code) {
        if (!tel) {
            tips.show('没有输入账号');
            return
        }
        if (isNaN(parseInt(tel))) {
            tips.show('账号是乱码');
            return
        }
        if (!code) {
            tips.show('没有输入密码');
            return
        }
        return true;
    };

    /**获取好友信息
     * 
     */
    _p.get_all_friend = function () {
        Global.HTTP.send('GET', '', {
            module: 'StorageService.getFriend',
            from: this.id
        }, function (res) {
            var data = res.data;
        }, function () {
            tips.show('获取好友信息失败');
        });
    };

    /**添加好友
     * 
     */
    _p.add_friend = function (to, to_info) {
        /**
         {
             id:'',
             name:'',
             avatar:''
         }
         */
        Global.HTTP.send('GET', '', {
            module: 'StorageService.updateFriend',
            from: this.id,
            to: to,
            frominfo: '',
            toinf: to_info
        }, function (res) {
            var data = res.data;
        }, function () {
            tips.show('添加好友信息失败');
        });
    };

    return UserMgr;
} ());
module.exports = UserMgr;
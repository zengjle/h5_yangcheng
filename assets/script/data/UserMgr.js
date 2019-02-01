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
            module: 'UserService.loginBytel',
            tel: tel,
            code: code
        }, function (res, xhr) {
            var id = res.data.id;
            var token = this.get_token_by_string(xhr.responseText);
            this.init_storage_data(id, token);
        }.bind(this), function (res) {
            tips.show(res.msg || '登入失败');
            Global.Observer.emit('login_fail');
        });
    };

    _p.init_storage_data = function (id, token) {
        Global.setData('14325', id);
        Global.setData('136533', token);
        cc.js.get(this, 'id', function () { return id; });
        document.cookie = `token=${token}`;
        Global.Observer.emit('login', id);
    };

    /**从json字符串中获取token
     * 
     */
    _p.get_token_by_string = function (string) {
        var index = "\"token\":";
        var token_index = string.indexOf(index);
        token_index += index.length;
        var str = string.substring(token_index, string.length);
        var i = str.indexOf('}');
        var token = str.substring(0, i);
        i = token.indexOf(',');
        if (i !== -1) {
            token = token.substring(0, i);
        }
        return token;
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
        }, function (res) {
            tips.show('发送成功');
            Global.Observer.emit('send_code_success');
        }, function (res) {
            tips.show(res.msg || '发送失败');
            Global.Observer.emit('send_code_fail');
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
            tips.show('没有输入手机号码');
            return
        }
        if (isNaN(parseInt(tel))) {
            tips.show('账号是需要是正整数');
            return
        }
        if (String(tel).length !== 11) {
            tips.show('请输入正确手机号码');
            return
        }
        if (!code) {
            tips.show('没有输入验证码');
            return
        }
        return true;
    };

    /**获取好友信息
     * 
     * @param cb 回调
     */
    _p.get_all_friend = function (cb) {
        Global.HTTP.send('GET', '', {
            module: 'StorageService.getFriend',
            from: this.id
        }, function (res) {
            cb && cb(res.data);
        }, function () {
            tips.show('获取好友信息失败');
        });
    };

    /**获取好友信息
     * 
     * @param cb 回调
     */
    _p.get_all_friend_info = function (cb) {
        this.get_all_friend(function (data) {
            var len = data.length;
            var friend_info = [];
            var fn = function (info) {
                if (info) {
                    friend_info.push(info);
                } else {
                    len--;
                }
                if (friend_info.length === len) {
                    cb && cb(friend_info);
                    fn = null;
                    len = null;
                    data = null;
                    friend_info = null;
                }
            }
            data.forEach(info => {
                Global.DataMgr.get_user_info(info.to, fn);
            });
        });
    };

    /**添加好友
     * 
     * @param to 要添加的好友id
     */
    _p.add_friend = function (to) {
        Global.HTTP.send('GET', '', {
            module: 'StorageService.updateFriend',
            from: this.id,
            to: to,
            frominfo: '',
            toinfo: ''
        }, null, function () {
            tips.show('添加好友失败');
        });
    };

    return UserMgr;
}());
module.exports = UserMgr;
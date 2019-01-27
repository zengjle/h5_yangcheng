/**音乐类
 *
 */
const AudioMgr = (function () {
    'use strict';
    function AudioMgr() {
    };

    var _p = AudioMgr.prototype;

    _p.init = function(){
        this.music = {};                                    //存储音乐
        this.music_ID = {};                                 //存储音乐实例或id
        this.musicGroup = {};                               //音乐分组
        this.musicGroup['default'] = {};                    //默认存在一个分组
        this.volume = Global.getData('gameVolume', 1);      //音量
    };

    /**播放音乐
     *
     * @param name   音乐的名字
     * @param volume 音量,没有则跟随全局音量
     * @param loop   是否循环播放
     * @param group  音乐分组,没有则默认default分组
     */
    _p.play = function (name, volume, loop, group) {
        if (!this.music[name]) {
            return this.loadMusic(name, volume, loop, group);
        }

        volume = volume || volume === 0 ? volume : this.volume;
        if (volume <= 0)
            return;

        this.stop(name);                                                                //防止出错持续播放
        this.addMusic(name, group);                                                     //把音乐添加到分组

        if (CC_WECHATGAME && this.music_ID[name]) {                                     //在微信有音乐实例的时候直接播放
            this.music_ID[name].play();                                                 //播放音乐
        } else if (CC_WECHATGAME && !this[name]) {                                      //在微信没有音乐实例的时候创建一个
            var audio = this.music_ID[name] = wx.createInnerAudioContext();             //创建音乐实例
            audio.src = Global.resStorePath + this.music[name];                         //音乐的地址
            audio.loop = loop;                                                          //是否循环播放
            audio.volume = volume;                                                      //设置音量
            audio.play();                                                               //播放音乐
        } else {
            this.music_ID[name] = cc.audioEngine.play(this.music[name], loop, volume);  //不在微信的时候用cc接口播放
        }
    };

    /**添加音乐
     *
     */
    _p.addMusic = function (name, group) {
        var group_obj = this.isGroup(group);
        group_obj[name] = this.music[name];
    };

    /**是否存在分组,没有则创建一个分组
     *
     * @param group 分组名字
     */
    _p.isGroup = function (group) {
        group = group || 'default';
        if (!this.musicGroup[group])
            this.musicGroup[group] = {};
        return this.musicGroup[group];
    };

    /**关闭音乐
     *
     * @param name  音乐的名字
     */
    _p.stop = function (name) {
        if (CC_WECHATGAME && this.music_ID[name]) {
            this.music_ID[name].stop();
        } else {
            cc.audioEngine.stop(this.music_ID[name]);
        }
    };

    /**停止一个分组所有音乐
     *
     * @param group 分组
     */
    _p.stopGroupMusic = function (group) {
        var obj = this.musicGroup[group];
        if (!obj)
            return;
        for (let i in obj) {
            this.stop(i);
        }
    };

    /**停止所有音乐
     *
     */
    _p.stopAllMusic = function () {
        var obj = this.music_ID;
        for (let i in obj) {
            this.stop(i);
        }
    };

    /**暂停音乐
     *
     * @param name  名字
     */
    _p.pause = function (name) {
        if (CC_WECHATGAME && this.music_ID[name]) {
            this.music_ID[name].pause();
        } else {
            cc.audioEngine.pause(this.music_ID[name]);
        }
    };

    /**暂停一个分组的音乐
     *
     * @param group 分组名称
     */
    _p.pauseGroupMusic = function (group) {
        var obj = this.musicGroup[group];
        if (!obj)
            return;
        for (let i in obj) {
            this.pause(i);
        }
    };

    /**暂停所有音乐
     *
     */
    _p.pauseAllMusic = function () {
        var obj = this.music_ID;
        for (let i in obj) {
            this.pause(i);
        }
    };

    /**恢复音乐
     *
     * @param name  名字
     */
    _p.resume = function (name) {
        if (CC_WECHATGAME && this.music_ID[name]) {
            this.music_ID[name].play();
        } else {
            cc.audioEngine.resume(this.music_ID[name]);
        }
    };

    /**恢复一个分组的音乐
     *
     * @param group 分组名称
     */
    _p.resumeGroupMusic = function (group) {
        var obj = this.musicGroup[group];
        if (!obj)
            return;
        for (let i in obj) {
            this.resume(i);
        }
    };

    /**恢复所有音乐
     *
     */
    _p.resumeAllMusic = function () {
        var obj = this.music_ID;
        for (let i in obj) {
            this.resume(i);
        }
    };

    /**调节单个音乐的音量
     *
     * @param name      音乐名字
     * @param volume    音量
     */
    _p.setVolume = function (name, volume) {
        if (CC_WECHATGAME)
            this.music_ID[name].volume = volume;        
        else
            cc.audioEngine.setVolume(this.music_ID[name], volume);
    
    };

    /**设置分组音量
     *
     * @param group     分组名称
     * @param volume    音量
     */
    _p.setGroupVolume = function (group, volume) {
        var obj = this.musicGroup[group];
        if (!obj)
            return;
        for (let i in obj) {
            this.setVolume(i, volume);
        }
    };

    /**调节全部音乐的音量
     *
     * @param volume    音量
     */
    _p.setAllVolume = function (volume) {
        this.volume = volume = parseInt(volume);
        var obj = this.music_ID;
        for (let i in obj) {
            this.setVolume(i, volume);
        }
    };

    /**加载音乐
     *
     * @param name      音乐名字
     * @param volume    音量
     * @param loop      是否循环
     * @param group     分组
     */
    _p.loadMusic = function (name, volume, loop, group) {
        if (CC_WECHATGAME) {
            this.music[name] = cc.url.raw('resources/music/' + name) + '.mp3';
            this.play(name, volume, loop, group);
            return;
        }
        Global.Loader.loadMusic(name, function (audio) {
            this.music[name] = audio;
            this.play(name, volume, loop, group);
        }.bind(this));
    };

    /**释放音乐
     *
     * @param name  音乐名字
     */
    _p.releaseMnsic = function (name) {
        if (!this.music[name] || typeof this.music[name] === 'string')
            return this.music[name] = null;
        Global.Loader.release(this.music[name], true);
        this.music[name] = null;
    };

    return AudioMgr;
} ());
module.exports = AudioMgr;
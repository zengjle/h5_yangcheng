'use strict';
let data = null;
let net  = cc.Class( {
    extends : require( "logic" ),

    ctor : function () {
        data = require( "data" );
    },

    init : function () {
        this.read_query = [];
        this._register_handler();
    },

    init_modules : function () {

    },

    _register_handler : function () {
        var self = this;
        self.on( "enter_game", self.enter_game.bind( self ) );
        self.on( "enter_mission_page", self.enter_mission_page.bind( self ) );
        self.on( "enter_mission", self.enter_mission.bind( self ) );
        self.on( "enter_bag", self.enter_bag.bind( self ) );
        self.on( "get_mission_reward", self.get_mission_reward.bind( self ) );
        // self.on("start_mission_game", self.start_mission_game.bind(self));

        self.on( "enter_old_town", self.enter_old_town.bind( self ) );
        self.on( "get_old_town_food", self.get_old_town_food.bind( self ) );

        self.on( "feed_fish", self.feed_fish.bind( self ) );
        self.on( "create_fish_data", self.create_fish_data.bind( self ) );
        self.on( "add_props", self.add_props.bind( self ) );
        self.on( "use_props", self.use_props.bind( self ) );

        self.on( "get_daily_reward", self.get_daily_reward.bind( self ) );
        self.on( "daily_question_answer", self.daily_question_answer.bind( self ) );
        self.on( "get_daily_question_answer_reward", self.get_daily_question_answer_reward.bind( self ) );

        self.on( "change_score", self.change_score.bind( self ) );
        self.on( "get_daily_mission_reward", self.get_daily_mission_reward.bind( self ) );

        self.on( "enter_shop", self.enter_shop.bind( self ) );
        self.on( "buy_commodity", self.buy_commodity.bind( self ) );

        self.on( "enter_user_info", self.enter_user_info.bind( self ) );
        self.on( "save_user_info", self.save_user_info.bind( self ) );

        self.on( "add_chengche_integral", self.add_chengche_integral.bind( self ) );

        self.on( "enter_friend", self.enter_friend.bind( self ) );
        self.on( "add_friend", self.add_friend.bind( self ) );
        self.on( "search_friend", self.search_friend.bind( self ) );
        self.on( "get_friend_food", self.get_friend_food.bind( self ) );
        self.on( "enter_friend_home", self.enter_friend_home.bind( self ) );

        self.on( "wen_temple_pray", self.wen_temple_pray.bind( self ) );
        self.on( "wen_divination", self.wen_divination.bind( self ) );
    },

    // 进入任务界面
    enter_mission : function ( _msg, _event_name ) {
        var emit_msg = _event_name.type + "_ret";
        this.emit( emit_msg, { mission_info : Global.DataMgr.get_mission_data() } );
    },

    // 背包数据
    enter_bag : function ( _msg, _event_name ) {
        var emit_msg = _event_name.type + "_ret";
        this.emit( emit_msg, Global.DataMgr.prop );
    },

    // 进入文昌门
    enter_mission_page : function ( msg, _event_name ) {
        var emit_msg = _event_name.type + "_ret";
        var index    = 'wen_chang_men_max_source',
            title    = '文昌门';

        this.emit( emit_msg, {
            title             : title,
            max_mission_score : Global.DataMgr[ index ],
            action_num        : Global.DataMgr.wen_chang_men_action_num
        } );
    },

    // 开始文昌阁活动
    start_mission_game : function ( msg, _event_name ) {
        this.enter_mission_page( _event_name, msg );
    },

    // 进入古镇
    enter_old_town : function ( _msg, _event_name ) {
        var data        = Global.DataMgr.get_cur_receive_data(),
            emit_msg    = _event_name.type + "_ret",
            level       = Global.DataMgr.get_lv(),
            is_question = Global.DataMgr.is_question ? 1 : 0;
        this.emit( emit_msg, {
            shop_info : Global.DataMgr.get_all_is_receive(),
            level     : level,
            question  : is_question
        } );
    },

    // 领取古镇福利
    get_old_town_food : function ( msg, _event_name ) {
        var prop_data    = data.prop[ msg.shop_id ],
            receive_data = Global.DataMgr.get_cur_receive_data(),
            num          = receive_data[ msg.shop_id ];

        Global.DataMgr.update_receive_time( msg.shop_id );
        Global.DataMgr.add_prop( msg.shop_id, num );

        Global.DataMgr.mission[ 3 ].num++;

        this.emit( _event_name.type + "_ret", {
            info      : [ msg.shop_id, prop_data.type, prop_data.addition, num ],
            shop_info : Global.DataMgr.get_is_receive( msg.shop_id )
        } );
    },

    // 文昌阁活动结束领取奖励
    get_mission_reward : function ( msg, _event_name ) {
        Global.DataMgr.wen_chang_men_max_source = msg.mission_score;
        Global.DataMgr.wen_chang_men_action_num--;

        var reward_prop = Global.DataMgr.get_wen_chang_men_reward( msg.mission_score );
        var data        = { reward_prop : reward_prop, action_num : Global.DataMgr.wen_chang_men_action_num };

        if ( Global.DataMgr.wen_chang_men_max_source === msg.mission_score ) {
            data.max_mission_score = msg.mission_score;
        }

        Global.DataMgr.mission[ 2 ].num++;

        Global.DataMgr.add_prop( reward_prop[ 0 ][ 0 ], reward_prop[ 0 ][ 3 ] );
        this.emit( _event_name.type + "_ret", data );
    },

    enter_game : function ( _, _event_name ) {

    },

    // 初始化鱼信息
    create_fish_data : function ( _msg, _event_name ) {
        var fn = function () {
            var fish = Global.FishMgr.create_fish_data( Global.DataMgr.fish[ 1 ] );
            this.emit( _event_name.type + "_ret", {
                fish               : fish,
                integral           : Global.DataMgr.integration_num,
                daily_reward_state : !!Global.DataMgr.is_sign_in,
                user_info          : Global.DataMgr.user_info
            } );
        }.bind( this );

        if ( Global.DataMgr.fish/* && Object.keys(Global.DataMgr.fish)*/ ) {
            fn.call( this );
        } else {
            Global.Observer.once( 'DataMgr_init_data_ok', fn, this );
        }
    },

    // 喂鱼
    feed_fish : function ( _msg, _event_name ) {
        var add_exp = _msg.food[ 2 ];
        var fish    = Global.FishMgr.fish[ 1 ];

        fish.exp += add_exp;

        var level_up = 0;
        while ( fish.exp >= fish.max_exp ) {
            fish.lv += 1;
            fish.exp -= fish.max_exp;
            fish.max_exp = Math.floor( 200 * Math.pow( fish.lv, 1.5 ) );
            level_up++;
        }

        Global.DataMgr.use_prop( _msg.food[ 0 ], 1 );

        Global.DataMgr.mission[ 6 ].num++;

        Global.DataMgr.integration_num += add_exp / 10;

        this.emit( _event_name.type + "_ret", {
            fish     : Global.FishMgr.fish[ 1 ],
            level_up : level_up,
            integral : Global.DataMgr.integration_num,
        } );
    },

    // 更改福缘
    change_score : function ( msg, _event_name ) {
        Global.DataMgr.integration_num += msg.score;
        this.emit( _event_name.type + "_ret", { integral : Global.DataMgr.integration_num } );
    },

    // 使用道具
    use_props : function ( _msg, _event_name ) {
        var info = [];
        var prop = _msg.prop;
        if ( prop[ 0 ] == 6 || prop[ 0 ] == 7 ) {
            info          = Global.DataMgr.opne_prop( prop[ 0 ] );
            var prop_info = data.prop[ info[ 0 ] ];
            info.splice( 1, 0, prop_info.type );
            info.splice( 2, 0, prop_info.addition );
        }
        Global.DataMgr.use_prop( prop[ 0 ], 1 );
        Global.DataMgr.add_prop( info[ 0 ], info[ 3 ] );
        this.emit( _event_name.type + "_ret", { info : info } );
    },

    // 添加道具
    add_props : function ( _msg, _event_name ) {
        Global.DataMgr.add_prop( _msg.id, _msg.num );
        ui.open( "popup_reward_layer", [ _msg.id,
            data.prop[ _msg.id ].type,
            data.prop[ _msg.id ].addition,
            _msg.num ] );
        this.emit( _event_name.type + "_ret" );
    },

    // 每日领取食袋
    get_daily_reward : function ( _msg, _event_name ) {
        var prop                  = Global.DataMgr.is_sign_in ? [] : [ 6, 2, 0, 1 ];
        Global.DataMgr.is_sign_in = true;

        Global.DataMgr.mission[ 1 ].num++;
        Global.DataMgr.add_prop( 6, 1 );
        this.emit( _event_name.type + "_ret", { prop : prop } );
    },

    // 每日问答
    daily_question_answer : function ( _msg, _event_name ) {
        var _question_id = Math.floor( Math.random() * data.question.answer.length );
        Global.DataMgr.mission[ 5 ].num++;
        this.emit( _event_name.type + "_ret", { question_answer_id : _question_id } );
    },

    // 领取每日问答奖励
    get_daily_question_answer_reward : function ( _msg, _event_name ) {
        var prop                   = _msg.answer ? [ 7, 2, 0, 1 ] : [ 6, 2, 0, 1 ];
        Global.DataMgr.is_question = true;
        Global.DataMgr.add_prop( prop[ 0 ], prop[ 3 ] );
        this.emit( _event_name.type + "_ret", { prop : prop } );
    },

    // 领取任务奖励
    get_daily_mission_reward : function ( _msg, _event_name ) {
        var prop = Global.DataMgr.get_daily_mission_reward( _msg.mission_id );
        Global.DataMgr.add_prop( prop[ 0 ], prop[ 3 ] );
        this.emit( _event_name.type + "_ret", { prop : prop } );
    },

    // 进入商店
    enter_shop : function ( _msg, _event_name ) {
        this.emit( _event_name.type + "_ret", {
            integral  : Global.DataMgr.integration_num,
            commodity : Global.DataMgr.get_shop_all_info()
        } );
    },

    // 购买物品
    buy_commodity : function ( _msg, _event_name ) {
        Global.DataMgr.buy_commodity( _msg.info );
        this.emit( _event_name.type + "_ret", {
            integral  : Global.DataMgr.integration_num,
            commodity : Global.DataMgr.get_info_by_id( _msg.info.prop_id )
        } );
    },

    // 保存用户信息
    save_user_info : function ( _msg, _event_name ) {
        Global.DataMgr.user_info = _msg.user_info;

        this.emit( _event_name.type + "_ret", _msg.user_info );
    },

    // 进入用户信息
    enter_user_info : function ( _msg, _event_name ) {
        this.emit( _event_name.type + "_ret", Global.DataMgr.user_info );
    },

    // 添加积分
    add_chengche_integral : function ( _msg, _event_name ) {
        var fn = null;
        fn     = function ( _msg ) {
            Global.Observer.off( 'add_chengche_integral_ok', fn, this );
            Global.Observer.off( 'add_chengche_integral_no', fn, this );
            this.emit( "add_chengche_integral_ret", _msg );
        }.bind( this );
        Global.Observer.on( 'add_chengche_integral_ok', fn, this );
        Global.Observer.on( 'add_chengche_integral_no', fn, this );
        Global.DataMgr.add_chengche_integral( _msg.info.add_num );
    },

    // 进入好友
    enter_friend : function ( _msg, _event_name ) {
        var event_name = _event_name.type + "_ret";
        Global.UserMgr.get_all_friend_info( function ( info ) {
            info.forEach( data => {
                data.tag  = 0;
                data.fish = data.fish[ 1 ];
            } );
            this.emit( event_name, {
                title       : '好友',
                friend_info : info
            } );
        }.bind( this ) );
    },

    // 添加好友
    add_friend : function ( _msg, _event_name ) {
        Global.UserMgr.add_friend( _msg.friend_id );
        Global.DataMgr.all_friend_id.push( _msg.friend_id );
        this.emit( _event_name.type + "_ret", _msg );
    },

    // 搜索好友
    search_friend : function ( _msg, _event_name ) {
        var id         = _msg.friend_id;
        var event_name = _event_name.type + "_ret";
        Global.DataMgr.get_user_info( id, function ( info ) {
            if ( !info ) {
                tips.show( '没有该玩家' );
                return;
            }
            info.fish          = info.fish[ 1 ];
            info.user_info.tag = Global.DataMgr.all_friend_id.indexOf( id ) !== -1 ? 0 : 1;
            this.emit( event_name, {
                friend_id   : id,
                friend_info : info
            } );
        }.bind( this ) );
    },

    // 获取好友食物
    get_friend_food : function ( _msg, _event_name ) {
        var info = Global.DataMgr.get_friend_food( Global.all_user_game_data[ _msg.friend_id ].prop );
        this.emit( _event_name.type + "_ret", { info : info } );
    },

    // 进入好友家
    enter_friend_home : function ( _msg, _event_name ) {
        var friend_id  = _msg.friend_id;
        var event_name = _event_name.type + "_ret";
        Global.DataMgr.get_user_info( friend_id, function ( data ) {
            data.fish          = data.fish[ 1 ];
            var get_prop_state = Global.DataMgr.get_prop_state( friend_id, data );
            var get_num        = get_prop_state ? Global.DataMgr.get_prop_state_num( friend_id ) : 0;
            this.emit( event_name, {
                friend_id      : friend_id,
                friend_info    : data,
                get_num        : config.data.prop_state_num_max - get_num,
                get_prop_state : get_prop_state
            } );
        }.bind( this ) );
    },

    // 文庙祈福
    wen_temple_pray : function ( _msg, _event_name ) {
        var pray_reward = Global.DataMgr.play_wen_temple_pray();
        if ( !pray_reward ) {
            return;
        }
        this.emit( _event_name.type + "_ret", { pray_reward : pray_reward } );
    },

    // 文庙掷珓
    wen_divination : function ( _msg, _event_name ) {
        var divination_result = Global.DataMgr.play_wen_divination();
        if ( !divination_result ) {
            return;
        }
        this.emit( _event_name.type + "_ret", { divination_result : divination_result } );
    }
} );

module.exports = window.net = new net();
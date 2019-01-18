// {
//     "fish" :{
//         "name" :"锦鲤",
//         "lv" : 1,
//         "exp" : 0,
//         "max_exp" : 100
//     },
//     "mission": {
//         "title" : "任务",
//         "info":["接食物","人们在文昌门前送上了食物,快去接受漳州人民的食物吧!"]

//     }
// }
module.exports = {
    "fish_init_data": {
        "name": "锦鲤",
        "lv": 1,
        "exp": 0,
        "max_exp": Math.floor(200*Math.pow(1, 2))
    },
    "prop": {
        "1": {
            "name": "麻糍",
            "type": 1,
            "addition": 100,
            "introduce": "香糯可口的麻糍,Q中带脆",
            "protect_time": 15
        },
        "2": {
            "name": "五香",
            "type": 1,
            "addition": 200,
            "introduce": "",
            "protect_time": 30
        },
        "3": {
            "name": "四果汤",
            "type": 1,
            "addition": 400,
            "introduce": "",
            "protect_time": 45
        },
        "4": {
            "name": "豆花粉丝",
            "type": 1,
            "addition": 800,
            "introduce": "",
            "protect_time": 60
        },
        "5": {
            "name": "漳州卤面",
            "type": 1,
            "addition": 1600,
            "introduce": "",
            "protect_time": 90
        },
        "6": {
            "name": "小食盒",
            "type": 2,
            "addition": 0,
            "introduce": "有概率开出麻糍,五香,四果汤",
            "openNumMin": 1,
            "openNumMax": 3,
            "open": [
                { "id": 1, "probability": 50 },
                { "id": 2, "probability": 30 },
                { "id": 3, "probability": 20 }
            ]
        },
        "7": {
            "name": "大食盒",
            "type": 2,
            "addition": 0,
            "introduce": "有概率开出豆花粉丝,漳州卤面",
            "openNumMin": 1,
            "openNumMax": 3,
            "open": [
                { "id": 4, "probability": 80 },
                { "id": 5, "probability": 20 }
            ]
        }
    },
    "mission": {
        "1": {
            "title": "文昌门",
            "info": ["任务名", "任务内容", 3]
        },
        "2": {
            "title": "古镇",
            "info": ["任务名", "任务内容", 3]
        },
        "3": {
            "title": "购买商品",
            "info": ["任务名", "任务内容", 3]
        },
        "4": {
            "title": "古城问答",
            "info": ["任务名", "任务内容", 3]
        },
        "5": {
            "title": "喂养锦鲤",
            "info": ["任务名", "任务内容", 3]
        },
        "6": {
            "title": "添加好友",
            "info": ["任务名", "任务内容", 3]
        }
    },
    "shop": {
        "1": {
            "name": "麻糍店"
        },
        "2": {
            "name": "五香店"
        },
        "3": {
            "name": "四果汤店"
        },
        "4": {
            "name": "豆花粉丝店"
        },
        "5": {
            "name": "漳州卤面店"
        }
    },
    "receive": {
        "1": {
            "1": 1,
            "2": 1
        },
        "10": {
            "1": 2,
            "2": 2,
            "3": 1
        },
        "20": {
            "1": 3,
            "2": 3,
            "3": 1
        },
        "30": {
            "1": 5,
            "2": 5,
            "3": 2,
            "4": 1
        },
        "40": {
            "1": 7,
            "2": 7,
            "3": 2,
            "4": 1
        },
        "50": {
            "1": 10,
            "2": 10,
            "3": 3,
            "4": 2
        },
        "60": {
            "1": 15,
            "2": 15,
            "3": 4,
            "4": 2,
            "5": 1
        },
        "70": {
            "1": 20,
            "2": 20,
            "3": 8,
            "4": 5,
            "5": 3
        },
        "80": {
            "1": 25,
            "2": 25,
            "3": 12,
            "4": 10,
            "5": 5
        },
        "90": {
            "1": 30,
            "2": 30,
            "3": 20,
            "4": 15,
            "5": 10
        }
    },
    "ui_mission": {
        "1": {
            "name": "麻糍",
            "speed": 5,
            "score": 5,
        },
        "2": {
            "name": "五香",
            "speed": 4.5,
            "score": 10,
        },
        "3": {
            "name": "四果汤",
            "speed": 4,
            "score": 12,
        },
        "4": {
            "name": "豆花粉丝",
            "speed": 3.5,
            "score": 20,
        },
        "5": {
            "name": "漳州卤面",
            "speed": 3,
            "score": 25,
        },
    },
};
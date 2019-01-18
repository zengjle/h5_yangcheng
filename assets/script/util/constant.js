//存放枚举
let constant = {};

constant.DESIGN_RESOLUTION = {
    width: 720,
    height: 1280
};

constant.WINDOW_TYPE = {
    INVALID: -1,
    BASE: 0,
    UI: 1,
    POPUP: 2,
    TIP: 3,
};

constant.WINDOW_ZINDEX = {
    INVALID: -1,
    BASE: 0,
    UI: 1,
    MENUS: 2,
    STATUS_BAR: 3,
    POPUP: 4,
    TIP: 5,
    NOVICE: 6,
};

constant.SHOP_ID = {
    MACI:1,
    WUXIANG:2,
    SIGUOTANG:3,
    DOUHUA:4,
    LUMIAN:5
};

constant.BAR_ID = {
    1: "friend",
    2: "mission",
    3: "bag",
}
constant.SCENE_ID = {
    1: "ui_mission",
    2: "ui_old_town",   
}
module.exports = constant;
/**
 * !#en TabContainer is not a visiable UI component but a way to modify the behavior of a set of Tabs. </br>
 * Tabs that belong to the same group could only have one of them to be switched on at a time.</br>
 * Note: All the first layer child node containing the tab component will auto be added to the container
 * !#zh TabContainer 不是一个可见的 UI 组件，它可以用来修改一组 Tab 组件的行为。</br>
 * 当一组 Tab 属于同一个 TabContainer 的时候，任何时候只能有一个 Tab 处于选中状态。</br>
 * 注意：所有包含 Tab 组件的一级子节点都会自动被添加到该容器中
 * @class TabContainer
 * @extends Component
 */
var TabContainer = cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/TabContainer',
        executeInEditMode: true,
    },
    properties: {
        initial: 0
    },

    updateTabs: function (tab) {
        this.tabItems.forEach(function (item) {
            if (tab.isChecked && item !== tab) {
                item.isChecked = false;
            } else {
                this.node.emit("tab", (item.node.name.split("tab_")[1]));
            }
        }.bind(this));
    },

    _update_stat() {
        this.tabItems.forEach(function (item) {
            if (item.isChecked) {
                this.node.emit("tab", (item.node.name.split("tab_")[1]));
            }
        }.bind(this));
    },

    _uncheck_all() {
        this.tabItems.forEach(function (item) {
            item.isChecked = false;
        });
    },

    _allowOnlyOneTabChecked: function () {
        var isChecked = false;
        this.tabItems.forEach(function (item) {
            if (isChecked) {
                item.isChecked = false;
            } else if (item.isChecked) {
                isChecked = true;
            }
        });

        return isChecked;
    },

    _makeAtLeastOneTabChecked: function () {

        this._uncheck_all();
        var tabItems = this.tabItems;
        if (tabItems.length > 0) {
            tabItems[this.initial].check();
        }
    },

    get_tab_by_name(_tab_name) {

        for (let _tab of this.tabItems) {
            if (_tab.node.name === "tab_{0}".format(_tab_name)) return _tab;
        }
    },

    onEnable: function () {

        this.node.on('child-added', this._allowOnlyOneTabChecked, this);
        this.node.on('child-removed', this._makeAtLeastOneTabChecked, this);
        this.node.on('update', this._update_stat, this);
        // this._makeAtLeastOneTabChecked();
    },

    onDisable: function () {

        this.node.off('child-added', this._allowOnlyOneTabChecked, this);
        this.node.off('child-removed', this._makeAtLeastOneTabChecked, this);
    },

    start: function () {

        if (CC_EDITOR) return;
        this._makeAtLeastOneTabChecked();
    }
});

/**
 * !#en Read only property, return the tab items array reference managed by TabContainer.
 * !#zh 只读属性，返回 TabContainer 管理的 tab 数组引用
 * @property {Tab[]} tabItems
 */
cc.js.get(TabContainer.prototype, 'tabItems',
    function () {
        return this.node.getComponentsInChildren(cc.Tab);
    }
);

cc.TabContainer = module.exports = TabContainer;

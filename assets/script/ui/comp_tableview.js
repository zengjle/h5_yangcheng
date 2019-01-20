cc.tableview = cc.Class({
        extends: cc.Component,

        properties: {
            node_template: cc.Node,
            prefab_template: cc.Prefab,

            paddingX: {
                default: 0,
                tooltip: "容器内x轴边距及间距，只会在一个布局方向上生效。",
            },
            paddingY: {
                default: 0,
                tooltip: '容器内Y轴边距及间距，只会在一个布局方向上生效。',
            },
        },

        onLoad () {
            this.prefabArr = [];
            this.usePrefabArr = [];
            this.unUsePrefabArr = [];
            this.view = cc.find("view", this.node);
            this.scroll_view = this.node.getComponent(cc.ScrollView);
            this.content = this.scroll_view.content;//cc.find("view/content", this.node);
            let layout = this.content.addComponent(cc.Layout);
            let box;
            if (this.node_template) {
                box = this.node_template;
                this.box = this.node_template;
            } else {
                box = this.prefab_template.data;
                this.box = this.prefab_template.data;
            }
            if(this.scroll_view.vertical){
                if ( box.width + this.paddingX / 2 < this.content.width / 2 ){
                    layout.type = 3;
                    layout.startAxis = 0;
                    let num = 0;
                    if (box.width < 150) {
                        num = Math.floor((this.content.width - 50) / box.width);
                    } else {
                        num = Math.floor(this.content.width / box.width);
                    }
                    let space = Math.floor(this.content.width - box.width * num);
                    let littleSpace = Math.floor(space / (num + 1));
                    // cc.log(num, space, littleSpace);
                    layout.paddingLeft = littleSpace;
                    layout.paddingRight = littleSpace;
                    layout.paddingTop = littleSpace;
                    layout.paddingBottom = littleSpace;
                    layout.spacingY = littleSpace;
                    layout.spacingX = littleSpace;
                }else{
                    layout.type = 2;
                    layout.paddingTop = this.paddingY;
                    layout.paddingBottom = this.paddingY;
                    layout.spacingY = this.paddingY;
                }
            }else if(this.scroll_view.horizontal){
                if(box.height + this.paddingY / 2 < this.content.height / 2) {
                    layout.type = 3;
                    layout.startAxis = 1;
                    let num = 0;
                    if (box.width < 150) {
                        num = Math.floor((this.content.width - 50) / box.width);
                    } else {
                        num = Math.floor(this.content.width / box.width);
                    }
                    let space = Math.floor(this.content.width - box.width * num);
                    let littleSpace = Math.floor(space / (num + 1));
                    cc.log(num, space, littleSpace);
                    layout.paddingLeft = littleSpace;
                    layout.paddingRight = littleSpace;
                    layout.spacingX = littleSpace;
                } else{
                    layout.type = 1;
                    layout.paddingLeft = this.paddingX;
                    layout.paddingRight = this.paddingX;
                    layout.spacingX = this.paddingX;
                }
            }
            layout.resizeMode = 1;

        },

        start () {
            // let Standby = new Promise((resolve, reject) => {
            //     this.boxWight = template.width;
            //     this.boxHeight = template.height;
            //     cc.log(this.boxWight)
            //     resolve()
            // });
            // this.node.on('scrolling', () => {
            //     //处理超出view的节点放回节点池
            //     if (this.is_use_pool) {
            //         this.show_item();
            //     }
            // },this.node);

            this.distance = this.view.height/2 + this.box.height/2
        },

        // scroll(event) {
        //     this.show_item();
        //     cc.log(this.prefab_arr[0].children[0])
        // },

        init(info_length = 0, fn) {
            this.fn = fn;
            if (!this.box) {
                this.onLoad();
            }
            this.boxWight = this.box.width;
            this.boxHeight = this.box.height;
            this.getuse_prefab_arr(info_length);
                for (let i = 0;this.use_prefab_arr.length > i ;i++) {
                    this.prefab_arr[i].active = true;
                    fn(i,this.prefab_arr[i]);
                }

        },

        show_item() {
            let offset;
            if(this.scroll_view.vertical){
                offset = this.scroll_view.getScrollOffset().y;
            }else{
                offset =  this.scroll_view.getScrollOffset().x;
            }
            for (let [index, item] of Object.entries(this.prefab_arr)) {
                let centerP;
                if(this.scroll_view.vertical){
                    centerP = -this.view.height/2 - item.y;
                }else{
                    centerP = -this.view.width/2 - item.x;
                }
                let nowDis = Math.abs(offset - centerP);
                if (nowDis >= this.distance) {
                    if (item.children.length !== 0) {
                        try {
                            node_pool.put_node(this.box.name, item.children[0]);
                        } catch (e) {
                            node_pool.put_node(this.prefab_template._name, item.children[0]);
                        }
                    }
                } else {
                    if (item.children.length === 0) {
                        let box;
                        try {
                            box = node_pool.get_node(this.box.name);
                        } catch (e) {
                            box = node_pool.get_node(this.prefab_template._name);
                        }
                        this.fn(index, box);
                        // box.getComponent("view_cell").init(this.dataArr[index], index);
                        box.parent = item
                    }else if(item.children.length === 1){
                        let box = item.children[0];
                        this.fn(index, box);
                    }

                }
            }
        },

        getuse_prefab_arr(info_length) {
            if (!this.content) {
                this.onLoad()
            }
            this.prefab_arr = [...this.content.children];
            let num = info_length - this.prefab_arr.length;

            if (this.prefab_arr.length < +info_length) {
                for (let i = 0; i < num; i++) {
                    let item = cc.instantiate(this.box);
                    item.width = this.boxWight;
                    item.height = this.boxHeight;
                    item.parent = this.content;
                    this.prefab_arr.push(item);
                }
                this.use_prefab_arr = [...this.prefab_arr];
                this.un_use_prefab_arr = [];
            } else if (this.prefab_arr.length === +info_length) {
                this.use_prefab_arr = [...this.prefab_arr];
                this.un_use_prefab_arr = [];
            } else if (this.prefab_arr.length > +info_length) {
                let useArr = [];
                let unUseArr = [];
                for (let idx in this.prefab_arr) {
                    if (idx < +info_length) {
                        useArr.push(this.prefab_arr[idx]);
                    }else {
                        unUseArr.push(this.prefab_arr[idx]);
                    }
                }
                this.use_prefab_arr = [...useArr];
                this.un_use_prefab_arr = [...unUseArr];
            }
            for (let item in this.un_use_prefab_arr) {
                // this.un_use_prefab_arr[item].active = false;
                    this.un_use_prefab_arr[item].parent = null;
            }
            this.prefab_arr = this.use_prefab_arr;
        },


        scroll_to_top() {
            this.node.getComponent(cc.ScrollView).scrollToTop(0.3);
        },


        onDisable() {

        }

        // update (dt) {},
    });

/*
 * 系统主页
 */

Ext.ns("App");

App.initMain = function() {
	Ext.QuickTips.init();
	Ext.Msg.minWidth = 300;
	App.createViewport();
};

Ext.onReady(App.initMain);

//初始化布局
App.createViewport = function() {
	var viewport = new Ext.Viewport({
		layout: "border",
		items: [
			App.createNorth(),
			App.createWest(),
			App.createCenter(),
			App.createSouth()
		]
	});
};

App.createNorth = function() {
	return {
		region: "north",
		xtype: "container",
		//contentEl: "header",
		height: 40,
		border: false,
		layout: "auto",
		items: [{
			xtype: "box",
			autoEl: {
				tag: "img",
				src: "img/logo.png",
				cls: "main-logo"
			}
		}, {
			xtype: "splitbutton",
			cls: "main-btn",
			iconCls: "x-btn-user",
			minWidth: 104,
			enabelToggle: true,
			pressed: true,
			text: "Neo",
			menu: new Ext.menu.Menu({
				items: [{
					text: "修改密码",
					iconCls: "x-btn-lock"
				}, {
					text: "退出系统",
					iconCls: "x-btn-exit",
					handler: function() {
						window.location.href = "index.html";
					}
				}]
			})
		}]
	};
};

App.createWest = function() {
	//动态获取菜单
	Ext.Ajax.request({
		url: "data/nav.json",
		success: function(resp, opts) {
			var data = Ext.decode(resp.responseText);
			Ext.getCmp("Nav").add(data); //添加到items
			Ext.getCmp("Nav").doLayout(); //重新布局
		},
		failure: function() {
			Ext.Msg.alert("错误", "加载菜单失败！");
		}
	});
	
	return {
		region: "west",
		id: "Nav",
		title: "导航菜单",
		collapsible: true,
		split: true,
		autoScroll: true,
		margins: "0 0 5 5",
		width: 225,
		maxSize: 225,
		minSize: 225,
		layout: {
			type: "accordion"
			//fill: false
		},
//		layoutConfig: {
//			fill: false,
//			animate: true
//		},
		defaults: {
			xtype: "treepanel",
			rootVisible: false,
			lines: true,
			autoScroll: true,
			border: false,
			listeners: {
				click: function(node, ev) {
					//console.log(node.attributes.text);
					App.MainPanel.openTab(node);
				}
			}
		}
		/*
		items: [{
			title: "个人中心",
			root: {
				children: [{
					text: "我的资料",
					leaf: true
				}]
			}
		}]
		*/
	};
};

App.createCenter = function() {
	var MainPanel = new Ext.TabPanel({
		region: "center",
		id: "MainPanel",
		activeTab: 0,
		margins: "0 5 5 0",
		enableTabScroll: true,
		items: [{
			id: "Desktop",
			layout: "fit",
			title: "首页",
			closable: false,
			autoScroll: true,
			listeners: {
				afterrender: function(t) {
					if(App.Desktop) {
						App.Desktop.render(t);
						this.doLayout();
					}else {
						Ext.Ajax.request({
							url: "js/modules/Desktop.js",
							success: function(resp, opts) {
								var o = eval(resp.responseText); //执行返回的js代码
								if(o) {
									App.Desktop.render(t);
									this.doLayout();
								}
							},
							failure: function() {
								Ext.Msg.alert("错误", "加载首页失败！");
							},
							scope: this
						});
					}
				}
			}
		}]
	});
	
	//打开新Tab页
	MainPanel.openTab = function(node) {
		var id = node.attributes.url;
		var isNewTab = false;
		var tab = this.getItem(id);
		
		if(id) {
			//判断当前Tab是否已存在
			if(!tab) {
				tab = new Ext.Panel({
					id: id,
					title: node.attributes.text,
					layout: "fit",
					closable: true,
					autoScroll: true,
					html: "正在加载 ..."
				});
				this.add(tab);
				isNewTab = true;
			}
			this.setActiveTab(tab);
			
			//如果是新Tab，则加载其内容
			if(isNewTab) {
				if(App[id]) {
					App[id].render(id);
					this.doLayout();
				}else {
					Ext.Ajax.request({
						panelId: id,
						url: "js/modules/" + id + ".js",
						success: function(resp, opts) {
							var o = eval(resp.responseText); //执行返回的js代码
							if(o) {
								App[id].render(opts.panelId);
								this.doLayout();
							}
						},
						failure: function() {
							Ext.Msg.alert("错误", "加载模块失败！");
						},
						scope: this
					});
				}
			}
		}else {
			Ext.Msg.alert("错误", "该模块不存在！");
		}
	};
	
	App.MainPanel = MainPanel;
	return MainPanel;
};

App.createSouth = function() {
	return {
		region: "south",
		xtype: "box",	//box 没有items属性
		contentEl: "footer",
		height: 25
	};
};






















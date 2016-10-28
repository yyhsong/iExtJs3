/*
 * 用户管理
 */

App.User = function() {
	return {
		//定义变量
		currentFormValues: {},
		
		//初始化
		render: function(id) {
			if(!this.store) {
				this.store = this.getStore();
			}
			if(!this.form) {
				this.form = this.getForm();
			}
			if(!this.win) {
				this.win = this.getWin();
			}
			this.createGrid(id);
		},
		
		//获取store
		getStore: function() {
//			var store = new Ext.data.ArrayStore({
//				fields: ["id", "name", "desc"],
//				data: [
//					["1", "超级管理员", "拥有系统的所有权限"],
//					["2", "管理员", "拥有系统的部分管理权限"],
//					["3", "网站编辑", "拥有文章的创建、发布、修改、删除权限"]
//				]
//			});
			var store = new Ext.data.JsonStore({
				//store configs
				storeId: "userStore",
				autoLoad: true, //自动加载
				fields: [
					{name: "id"},
					{name: "name"},
					{name: "role"},
					{name: "state"},
					{name: "remark"}
				],
				url: "data/user.json",
				
				//reader configs
				totalProperty: "total",
				root: "rows"
			});
			//store.load();
			return store;
		},
		
		//创建表单
		getForm: function() {
			var form = new Ext.form.FormPanel({
				labelWidth: 40,
				buttonAlign: "center",
				bodyStyle: "padding:10px;",
				frame: true,
				layout: "hbox",
				defaults: {
					layout: "form"
				},
				items: [{
					flex: 1,
					items: [{
						xtype: "hidden",
						name: "id",
						value: ""
					}, {
						xtype: "textfield",
						name: "name",
						fieldLabel: "姓名",
						tabIndex: 1,
						anchor: "98%",
						allowBlank: false
					}, {
						xtype: "combo",
						name: "state",
						fieldLabel: "状态",
						tabIndex: 3,
						anchor: "98%",
						allowBlank: false,
						mode: "local",
						store: new Ext.data.ArrayStore({	//本地数据源
							autoLoad: true,
							fields: ["val", "txt"],
							data: [
								["0", "启用"],
								["1", "禁用"]
							]
						}),
						valueField: "val",
						displayField: "txt",
						editable : false,
						selectOnFocus: true,
						triggerAction : 'all'
					}]
				}, {
					flex: 1,
					margins: "0 0 0 10",
					items: [{
						xtype: "combo",
						name: "role",
						fieldLabel: "角色",
						tabIndex: 2,
						anchor: "98%",
						allowBlank: false,
						emptyText: "选择角色",
						mode: "local", //以GET方式加载
						store: new Ext.data.JsonStore({	//远程数据源
							autoLoad: true,
							url: "data/role.json",
							root: "rows",
							fields: ["name"]
						}),
						valueField: "name",
						displayField: "name",
						editable : false,
						selectOnFocus: true,
						triggerAction : 'all'
					}, {
						xtype: "textarea",
						name: "remark",
						fieldLabel: "备注",
						tabIndex: 4,
						anchor: "98%"
					}]
				}],
				buttons: [{
					text: "确定",
					scope: this,
					handler: function() {
						this.submit();
					}
				}, {
					text: "重置",
					scope: this,
					handler: function() {
						this.form.getForm().reset();
						this.form.getForm().setValues(this.currentFormValues);
						this.form.getForm().clearInvalid();
					}
				}]
			});
			return form;
		},
		
		//提交表单
		submit: function() {
			var fr = this.form.getForm();	//获取BasicForm对象
			if(fr.isValid()) {
				var id = fr.findField("id").getValue();
				
				if(id) { //编辑
					var rec = this.store.getById(id);
					rec.set("name", fr.findField("name").getValue());
					rec.set("role", fr.findField("role").getValue());
					rec.set("state", fr.findField("state").getValue());
					rec.set("remark", fr.findField("remark").getValue());
//					this.store.rejectChanges();	//取消所有修改
					this.store.commitChanges();	//提交修改数据
				}else {	//新增
					var UserRecord = Ext.data.Record.create([
						{name: "id"},
						{name: "name"},
						{name: "role"},
						{name: "state"},
						{name: "remark"}
					]);
//					var rec = new RoleRecord({
//						id: "4",
//						name: "新增角色",
//						desc: "这是测试用的新增角色"
//					}, id);
					var obj = fr.getValues();
					obj.id = this.store.data.length+1;
					var rec = new UserRecord(obj, obj.id);
					this.store.add(rec);
				}
				
				this.win.hide();
//				this.store.reload();
			}
		},
		
	    //创建窗口
	    getWin: function() {
	    	var win = new Ext.Window({
	    		width: 600,
	    		height: 250,
	    		title: "",
	    		plain: true,
	    		resizable: false,
	    		frame: true,
	    		closeAction: "hide",
	    		border: false,
	    		modal: true,
	    		layout: "fit",
	    		items: [this.form],
	    		listeners: {
	    			scope: this,
	    			render: function(fp) {
	    				this.form.form.waitMsgTarget = fp.getEl();
	    			},
	    			show: function() {
	    				this.form.form.setValues(this.currentFormValues);
	    				this.form.form.clearInvalid();
	    			}
	    		}
	    	});
	    	return win;
	    },
		
		//创建Grid
		createGrid: function(id) {
			var panel = Ext.getCmp(id);
			panel.body.dom.innerHTML = "";
			var sm = new Ext.grid.CheckboxSelectionModel();
			
			this.grid = new Ext.grid.GridPanel({
				tbar: [{
					text: "新增",
					iconCls: "x-btn-add",
					scope: this,
					handler: this.add
				}, "-", {
					text: "编辑",
					iconCls: "x-btn-edit",
					scope: this,
					handler: this.edit
				}, "-", {
					text: "删除",
					iconCls: "x-btn-del",
					scope: this,
					handler: this.del
				}, "->", {
					xtype: "textfield",
					emptyText: "请输入关键字"
				}, {
					xtype: "button",
					text: "查询",
					iconCls: "x-btn-search",
					scope: this,
					handler: this.search
				}],
				bbar: new Ext.PagingToolbar({
					store: this.store,
					pageSize: 20,
					displayInfo: true
				}),
				
				store: this.store,
				sm: sm,
				columns: [sm, {
					header: "姓名",
					width: 100,
					sortable: true,
					dataIndex: "name"
				}, {
					header: "角色",
					width: 100,
					sortable: true,
					dataIndex: "role"
				}, {
					header: "状态",
					width: 100,
					sortable: true,
					dataIndex: "state",
					renderer: function(val) {
						if(val=="0" || val=="启用") {
							return "<span style='color:green;'>启用</span>";
						}else if(val=="1" || val=="禁用") {
							return "<span style='color:red;'>禁用</span>";
						}
						return val;
					}
				}, {
					header: "备注",
					width: 300,
					sortable: false,
					dataIndex: "remark"
				}],
				
				border: false,
				viewConfig: {
					forceFit: true
				}
			});
			panel.add(this.grid);
		},
		
		//查询
		search: function() {
			//console.log("Search ...");
			this.store.reload();
		},
		
		//新增
		add: function() {
			this.win.setTitle("新增用户");
			Ext.apply(this.currentFormValues, {
				id: "",
				name: "",
				role: "",
				state: "0",
				remark: ""
			});
			this.win.show();
		},
		
		//编辑
		edit: function() {
			if(this.grid.getSelectionModel().hasSelection()) {
				this.win.setTitle("编辑用户");
				var rec = this.grid.getSelectionModel().getSelected();
				Ext.apply(this.currentFormValues, {
					id: rec.data.id,
					name: rec.data.name,
					role: rec.data.role,
					state: rec.data.state,
					remark: rec.data.remark
				});
//				this.form.getForm().loadRecord(rec);
				this.win.show();
			}else {
				Ext.Msg.alert("信息", "请选择要编辑的用户！");
			}
		},
		
		//删除
		del: function() {
			if(this.grid.getSelectionModel().hasSelection()) {
				var st = this.store;
				var recs = this.grid.getSelectionModel().getSelections();
				var names = "";
				for(var i=0;i<recs.length;i++) {
					names += recs[i].data.name+"<br />";
				}
				Ext.Msg.confirm("确认", "确认删除以下用户？<br />"+names, function(btn) {
					if(btn=="yes") {
						st.remove(recs); //前台删除
						//st.reload();
					}
				});
			}else {
				Ext.Msg.alert("信息", "请选择要删除的用户！");
			}
		}
	}
}();












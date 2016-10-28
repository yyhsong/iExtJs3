/*
 * 部门管理
 */

App.Department = function() {
	return {
		//初始化
		render: function(id) {
			if(!this.departmentWin) {
				this.departmentWin = this.getDepartmentWin();
			}
			if(!this.employeeStore) {
				this.employeeStore = this.getEmployeeStore();
			}
			if(!this.employeeGrid) {
				this.employeeGrid = this.getEmployeeGrid();
			}
			if(!this.employeeWin) {
				this.employeeWin = this.getEmployeeWin();
			}
			this.createTree(id);
		}, 
		
		//创建TreePanel
		createTree: function(id) {
			var panel = Ext.getCmp(id);
			panel.body.dom.innerHTML = "";
			
			this.tree = new Ext.tree.TreePanel({
				border: false,
				useArrows: true,
				autoScroll: true,
//				enableDD: true,
//				dropConfig: {
//					ddGroup: "TreeDD" 
//				},
				
				//auto create TreeLoader
				root: {
					nodeType: "async",
					draggable: false,
					id: "topicRoot"
				},
				rootVisible: false,
				requestMethod: "GET",
				dataUrl: "data/department.json",
				tbar: ["->", {
					iconCls: "x-btn-refresh",
					tooltip: "刷新",
					scope: this,
					handler: this.refresh
				}],
				bbar: [{
					text: "保存",
					iconCls: "x-btn-save",
					scope: this
				}, "-", {
					text: "取消",
					iconCls: "x-btn-warning",
					scope: this
				}],
				contextMenu: new Ext.menu.Menu({
					minWidth: 120,
					items: [{
						text: "添加部门",
						itemId: "addBtn",
						iconCls: "x-btn-add",
						scope: this,
						handler: this.addDepartment
					}, {
						text: "添加员工",
						itemId: "selBtn",
						iconCls: "x-btn-file-search",
						scope: this,
						handler: this.addEmployee
					}, "-", {
						text: "上移",
						iconCls: "x-btn-up",
						scope: this,
						handler: this.moveUp
					}, {
						text: "下移",
						iconCls: "x-btn-down",
						scope: this,
						handler: this.moveDown
					}, "-", {
						text: "编辑",
						itemId: "editBtn",
						iconCls: "x-btn-edit"
					}, {
						text: "删除",
						iconCls: "x-btn-del",
						scope: this,
						handler: this.delNode
					}]
				}),
				listeners: {
					click: function(n) {
//						n.select();
//						console.log(n.attributes.text);
					},
					contextmenu: function(node, ev) {
						node.select();
						var t = node.attributes.type;
						var cm = node.getOwnerTree().contextMenu;
						var addBtn = cm.getComponent("addBtn");
						var selBtn = cm.getComponent("selBtn");
						var editBtn = cm.getComponent("editBtn");
						if(node.isLeaf()) {
							addBtn.hide();
							selBtn.hide();
							editBtn.hide();
						}else {
							if(t=="1") {
								addBtn.show();
								selBtn.hide();
								editBtn.show();
							}else if(t=="2") {
								addBtn.hide();
								selBtn.show();
								editBtn.show();
							}
						}
						cm.contextNode = node;
						cm.showAt(ev.getXY());
					}
				}
			});
			this.tree.expandAll();
			panel.add(this.tree);
		},
		
		//刷新整个树
		refresh: function() {
			this.tree.root.reload();
			this.tree.expandAll();
		},
		
		//添加部门
		addDepartment: function() {
			this.departmentWin.show();
		},
		
		//添加员工
		addEmployee: function() {
			this.employeeWin.show();
		},
		
		//获取departmentWin
		getDepartmentWin: function() {
			var win = new Ext.Window({
				width: 600,
	    		height: 250,
	    		title: "添加部门",
	    		plain: true,
	    		resizable: false,
	    		frame: true,
	    		closeAction: "hide",
	    		border: false,
	    		modal: true,
	    		layout: "fit",
	    		items: [{
					xtype: "form",
					labelWidth: 60,
					bodyStyle: "padding:10px;",
    				tbar: ["->", {
    					xtype: "button",
    					text: "保存",
    					iconCls: "x-btn-save"
    				}],
					items: [{
						xtype: "textfield",
						name: "topicName",
						fieldLabel: "部门名称",
						tabIndex: 1,
						anchor: "99%",
						allowBlank: false
					}]
				}]
			});
			return win;
		},
		
		//获取employeeGrid
		getEmployeeGrid: function() {
			var sm = new Ext.grid.CheckboxSelectionModel();
			var grid = new Ext.grid.GridPanel({
				tbar: [{
					xtype: "textfield",
					emptyText: "英文名称"
				}, {
					xtype: "textfield",
					emptyText: "中文名称",
					style: "margin-left:5px;"
				}, {
					text: "查询",
					iconCls: "x-btn-search",
					scope: this
				}, "->", {
					text: "保存",
					iconCls: "x-btn-save",
					scope: this
				}],
				bbar: new Ext.PagingToolbar({
					store: this.employeeStore,
					pageSize: 20,
					displayInfo: true
				}),
				store: this.employeeStore,
				sm: sm,
				columns: [sm, {
					header: "员工工号",
					width: 100,
					sortable: true,
					dataIndex: "code"
				}, {
					header: "英文名",
					width: 100,
					sortable: true,
					dataIndex: "nameEn"
				}, {
					header: "中文名",
					width: 100,
					sortable: true,
					dataIndex: "nameZh"
				}],
				viewConfig: {
					forceFit: true
				}
			});
			return grid;
		},
	
		//获取employeeStore
		getEmployeeStore: function() {
			var store = new Ext.data.ArrayStore({
				fields: ["code", "nameEn", "nameZh"],
				data: [
					["001", "Jacky", "张三"],
					["002", "Paul", "李四"],
					["003", "Tom", "王五"]
				]
			});
			return store;
		},
	
		//获取employeeWin
		getEmployeeWin: function() {
			var win = new Ext.Window({
				width: 600,
	    		height: 400,
	    		title: "添加员工",
	    		plain: true,
	    		resizable: false,
	    		frame: true,
	    		closeAction: "hide",
	    		border: false,
	    		modal: true,
	    		layout: "fit",
	    		items: [this.employeeGrid]
			});
			return win;
		},
	
		//上移
		moveUp: function(item) {
			var ctNode = item.parentMenu.contextNode;
			if(!ctNode.isFirst()) {
				var parNode = ctNode.parentNode;
				var prevNode = ctNode.previousSibling;
				parNode.insertBefore(ctNode, prevNode);
			}
		},
		
		//下移
		moveDown: function(item) {
			var ctNode = item.parentMenu.contextNode;
			if(!ctNode.isLast()) {
				var parNode = ctNode.parentNode;
				var nextNode = ctNode.nextSibling;
				parNode.insertBefore(nextNode, ctNode);
			}
		},
		
		//删除节点
		delNode: function(item) {
			var ctNode = item.parentMenu.contextNode;
			if(ctNode.isLeaf()) {
				Ext.Msg.confirm("确认", "确认删除该子节点？<br />"+ctNode.attributes.text, function(btn) {
					if(btn=="yes") {
						ctNode.remove();
					}
				});
			}else {
				Ext.Msg.confirm("确认", "确认删除该父节点（包括其子节点）？<br />"+ctNode.attributes.text, function(btn) {
					if(btn=="yes") {
						ctNode.remove();
					}
				});
			}
		}
	};
}();























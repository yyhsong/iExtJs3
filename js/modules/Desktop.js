/*
 * 首页
 */

App.Desktop = function() {
	
	//日期格式化
	function formatDate(val) {
        return Ext.isDate(val) ? val.dateFormat('Y-m-d') : val;
    }
	
	return {
		render: function(t) {
			if(!this.sm) {
				this.sm = new Ext.grid.CheckboxSelectionModel();
			}
			if(!this.store) {
				this.store = this.getStore();
			}
		
			this.createDesktop(t);
		},
		
		getStore: function() {
			var store = new Ext.data.ArrayStore({
				fields: ["link", "start", "end", "a1", "a2", "a3", "b1", "b2"],
				data: [
					["Link Text", "2016-01-01", "2016-12-31", "", "", "", "", ""]
				]
			});
			return store;
		},
		
		createDesktop: function(t) {
			var desktop = new Ext.Panel({
				border: false,
				layout: "border",
				items: [
					this.createNorth(),
					this.createCenter(),
					this.createSouth()
				]
			});
			t.add(desktop);
		},
		
		createNorth: function() {
			return {
				region: "north",
				margins: {top:6, right:6, bottom:6, left:6},
				height: 120,
				border: false,
				layout: "column",
				items: [
					this.createNorthLeft(),
					this.createNorthRight()
				]
			};
		},
		
		createNorthLeft: function() {
			return {
				columnWidth: 0.5,
				style: "margin-right:3px;",
				height: 120,
				title: "Panel A",
				tools: [{
					id: "help",
					qtip: "帮助",
					handler: function(ev, toolEl, panel) {}
				}]
			};
		},
		
		createNorthRight: function() {
			return {
				columnWidth: 0.5,
				style: "margin-left:3px;",
				height: 120,
				title: "Panel B"
			};
		},
		
		createCenter: function() {
			return {
				region: "center",
				xtype: "editorgrid",
				cls: "col-grid",
				margins: {top:0, right:6, bottom:0, left:6},
				title: "插件使用示例 (ColumnHeaderGroup + DatePickerPlus)",
				store: this.store,
				sm: this.sm,
				clicksToEdit: 1,
				columns: [this.sm, {
					header: "&nbsp;",
					dataIndex: "link",
					align: "center",
					sortable: true,
					renderer: function(val) {
						return "<a href='#'>"+val+"</a>";
					}
				}, {
					header: "开始",
					align: "center",
					sortable: true,
					dataIndex: "start",
					editor: new Ext.ux.form.DateFieldPlus({
						allowBlank: false,
						format: "Y-m-d",
						showWeekNumber: true
					}),
					renderer: formatDate
				}, {
					header: "结束",
					align: "center",
					sortable: true,
					dataIndex: "end",
					editor: new Ext.ux.form.DateFieldPlus({
						allowBlank: false,
						format: "Y-m-d",
						showWeekNumber: true
					}),
					renderer: formatDate
				}, {
					header: "A1",
					align: "center",
					sortable: true,
					dataIndex: "a1",
					editor: new Ext.form.TextField()
				}, {
					header: "A2",
					align: "center",
					dataIndex: "a2",
					editor: new Ext.form.TextField()
				}, {
					header: "A3",
					align: "center",
					dataIndex: "a3",
					editor: new Ext.form.TextField()
				}, {
					header: "B1",
					align: "center",
					dataIndex: "b1",
					editor: new Ext.form.TextField()
				}, {
					header: "B2",
					align: "center",
					dataIndex: "b2",
					editor: new Ext.form.TextField()
				}, {
					xtype: "actioncolumn",
					header: "&nbsp;",
					align: "center",
					menuDisabled: true,
					iconCls: "x-btn-del",
					tooltip: "删除",
					handler: function(grid, rowIndex, colIndex) {
//						var rec = grid.getStore().getAt(rowIndex);
//						console.log(rec.get(""));
					}
				}],
				viewConfig: {
					forceFit: true
				},
				plugins: new Ext.ux.grid.ColumnHeaderGroup({
					rows: [
						[{
							header: "",
							align: "center",
							colspan: 1
						}, {
							header: "链接",
							align: "center",
							colspan: 1
						}, {
							header: "日期",
							align: "center",
							colspan: 2
						}, {
							header: "列A",
							align: "center",
							colspan: 3
						}, {
							header: "列B",
							align: "center",
							colspan: 2
						}, {
							header: "操作",
							align: "center",
							colspan: 1
						}]
					]
				})
			};
		},
		
		createSouth: function() {
			return {
				region: "south",
				border: false,
				margins: {top:6, right:6, bottom:6, left:6},
				height: 120,
				layout: "column",
				items: [
					this.createSouthLeft(),
					this.createSouthRight()
				]
			};
		},
		
		createSouthLeft: function() {
			return {
				columnWidth: 0.5,
				style: "margin-right:3px;",
				xtype: "panel",
				height: 120,
				title: "Panel C"
			};
		},
		
		createSouthRight: function() {
			return {
				columnWidth: 0.5,
				style: "margin-left:3px;",
				xtype: "panel",
				height: 120,
				title: "Panel D"
			};
		}
	};
}();
























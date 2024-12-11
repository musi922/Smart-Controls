sap.ui.define([
	"./BaseController",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (BaseController, ODataModel, MessageBox, JSONModel) {
	"use strict";

	return BaseController.extend("lazyloading.controller.Main", {
		onInit: function () {
			let oModel = new ODataModel("http://localhost:5000/odata", {
				defaultBindingMode: "TwoWay",
				useBatch: false,
				headers: {
					"Content-Type": "application/atom+xml",
				},
				json: false,
				maxDataServiceVersion: "3.0"
			});
			this.getView().setModel(oModel);

			let oViewModel = new JSONModel({
				selectedTabKey: "Products"
			});
			this.getView().setModel(oViewModel, "view");

			this._mViews = {};
		},

		onTabSelect: function(oEvent) {
			const sSelectedKey = oEvent.getParameter("key");
			const oTabBar = oEvent.getSource();
			const oSelectedTab = oEvent.getParameter("item");

			this._loadTabView(sSelectedKey, oSelectedTab);
		},

		_loadTabView: function(sKey, oTab) {
			if (this._mViews[sKey]) {
				return;
			}

			const oViewMap = {
				"Customers": "lazyloading.view.Cards",
				"Suppliers": "lazyloading.view.Suppliers",
				"Categories": "lazyloading.view.Categories"
			};
			if (sKey === "Products") {
				return;
			}

			if (oViewMap[sKey]) {
				sap.ui.core.mvc.XMLView.create({
					viewName: oViewMap[sKey]
				}).then((oView) => {
					this._mViews[sKey] = oView;
					oTab.removeAllContent();
					oTab.addContent(oView);
				}).catch((error) => {
					MessageBox.error(`Failed to load ${sKey} view: ${error}`);
				});
			}
		},

		handleSelectionChange(oEvent){
			let oContext = oEvent.getParameter("listItem").getBindingContext().getObject()
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this)
			oRouter.navTo("detail",{
				productID: oContext.ProductID
			})
		},

		onAvatarPress(){
			let oDialog = this.byId("logoutDialog")
			oDialog.open()
		},

		onCloseDialog(){
			let oDialog = this.byId("logoutDialog")
			oDialog.close()
		},

		onLogoutConfirmed(){
			localStorage.removeItem("loggedIn")
			MessageBox.success("You have logged Out")
			this.getOwnerComponent().getRouter().navTo("login")
		}
	});
});
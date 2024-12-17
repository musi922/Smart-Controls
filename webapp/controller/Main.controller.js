sap.ui.define(
	[
		"./BaseController",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
	],
	function (BaseController, ODataModel, MessageBox, JSONModel) {
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
					maxDataServiceVersion: "3.0",
				});
				this.getView().setModel(oModel);

				let oViewModel = new JSONModel({
					selectedTabKey: "Products",
				});
				this.getView().setModel(oViewModel, "view");

				//time picker time
				let oTimeModel = new JSONModel({
					currentTime: this._getFormattedTime(),
				});
				this.getView().setModel(oTimeModel, "time");
			},
			onCreateProductPress(){
				let oDialog = this.byId("createProduct");
				oDialog.open();
			},
			onCloseProductDialog(){
				this.byId("createProductDialog").close();
			},
			_getFormattedTime() {
				let oDate = new Date();
				return oDate.toLocaleTimeString();
			},
			onTabSelect: function (oEvent) {
				const sSelectedKey = oEvent.getParameter("key");
				this.getView()
					.getModel("view")
					.setProperty("/selectedTabKey", sSelectedKey);
			},
			onOrdersPres(){
				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("orders");
			},

			handleSelectionChange: function (oEvent) {
				let oContext = oEvent
					.getParameter("listItem")
					.getBindingContext()
					.getObject();
				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("detail", { productID: oContext.ProductID });
			},

			onAvatarPress: function () {
				let oDialog = this.byId("logoutDialog");
				oDialog.open();
			},

			onCloseDialog: function () {
				let oDialog = this.byId("logoutDialog");
				oDialog.close();
			},

			onLogoutConfirmed: function () {
				localStorage.removeItem("loggedIn");
				MessageBox.success("You have logged Out");
				this.getOwnerComponent().getRouter().navTo("login");
			},
			onCreateProduct(){
				let productID = this.getView().byId("productIdInput").getValue();
				let productName = this.getView().byId("productNameInput").getValue();
				let unitPrice = this.getView().byId("productPriceInput").getValue();
				let quantity = this.getView().byId("productQuantityInput").getValue();
			}
		});
	}
);

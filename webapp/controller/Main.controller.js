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
				console.log(oViewModel.getData());
				

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
				oRouter.navTo("detail", { productID: oContext.ID });
			},

			onAvatarPress: function () {
				let oDialog = this.byId("logoutDialog");
				oDialog.open();
			},

			onCloseDialog: function () {
				let oDialog = this.byId("logoutDialog");
				oDialog.close();
			},
			onCloseProductDialog: function () {
				let oDialog = this.byId("createProduct");
				oDialog.close();
			},

			onLogoutConfirmed: function () {
				localStorage.removeItem("loggedIn");
				MessageBox.success("You have logged Out");
				this.getOwnerComponent().getRouter().navTo("login");
			},
			onCreateProduct(){
				let ID = this.getView().byId("productIdInput").getValue();
				let Name = this.getView().byId("productNameInput").getValue();
				let Description = this.getView().byId("productPriceInput").getValue();
				let Price = this.getView().byId("productQuantityInput").getValue();

				let oModel = this.getView().getModel();
				let newProduct = {
					ID: ID,
					Name: Name,
					Description: Description,
					Price: Price
				}
				oModel.create("/Products", newProduct, {
					success: (data) => {
						console.log(data);
						this.byId("productIdInput").setValue("");
						this.byId("productNameInput").setValue("");
						this.byId("productPriceInput").setValue("");
						this.byId("productQuantityInput").setValue("");
						
						this.byId("createProduct").close();
					},
					error: (error) => {
						console.error(error);
					}
				});
				MessageBox.success("Product Created Successfully");
			}
		});
	}
);

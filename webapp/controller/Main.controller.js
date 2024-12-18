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
			onEditPress: function (oEvent) {
				const oContext = oEvent.getSource().getBindingContext().getObject();
			
				// Open the dialog and populate fields with the selected product's data
				const oDialog = this.byId("createProduct");
				this.byId("productIdInput").setValue(oContext.ID);
				this.byId("productNameInput").setValue(oContext.Name);
				this.byId("productPriceInput").setValue(oContext.Description); // Adjust as needed for your fields
				this.byId("productQuantityInput").setValue(oContext.Price);
			
				// Store the context for update operation
				this._editContextPath = oEvent.getSource().getBindingContext().getPath();
				oDialog.open();
			},
			
			onCreateProduct: function () {
				const oModel = this.getView().getModel();
				const ID = this.byId("productIdInput").getValue();
				const Name = this.byId("productNameInput").getValue();
				const Description = this.byId("productPriceInput").getValue();
				const Price = this.byId("productQuantityInput").getValue();
			
				const newProduct = { ID, Name, Description, Price };
			
				// Check if we're in "edit" mode or "create" mode
				if (this._editContextPath) {
					// Update existing product
					oModel.update(this._editContextPath, newProduct, {
						success: () => {
							MessageBox.success("Product updated successfully");
							this.byId("createProduct").close();
							this._editContextPath = null;
						},
						error: (error) => {
							MessageBox.error("Error updating product");
							console.error(error);
						}
					});
				} else {
					// Create new product
					oModel.create("/Products", newProduct, {
						success: () => {
							MessageBox.success("Product created successfully");
							this.byId("createProduct").close();
						},
						error: (error) => {
							MessageBox.error("Error creating product");
							console.error(error);
						}
					});
				}
			},
			onDeletePress: function (oEvent) {
				const oContextPath = oEvent.getSource().getBindingContext().getPath();
				const oModel = this.getView().getModel();
			
				MessageBox.confirm("Are you sure you want to delete this product?", {
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: (sAction) => {
						if (sAction === MessageBox.Action.YES) {
							oModel.remove(oContextPath, {
								success: () => MessageBox.success("Product deleted successfully"),
								error: (error) => {
									MessageBox.error("Error deleting product");
									console.error(error);
								}
							});
						}
					}
				});
			},
			
			
		});
	}
);

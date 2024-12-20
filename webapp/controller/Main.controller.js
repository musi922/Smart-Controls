sap.ui.define(
	[
		"./BaseController",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/FilterType",
	],
	function (BaseController, ODataModel, MessageBox, JSONModel,Filter, FilterOperator, FilterType) {
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
			
			onLiveSearch: function(oEvent) {
				let query = oEvent.getParameter("newValue");
				let list = this.byId("idTable");
				let binding = list.getBinding("items");
				
				let aFilters = [];
				
				if (query) {
					let queryNumber = parseInt(query);
					
					if (!isNaN(queryNumber)) {
						aFilters.push(
							new Filter({
								filters: [
									new Filter("ID", FilterOperator.EQ, queryNumber),
									new Filter("Price", FilterOperator.EQ, queryNumber),
								],
								and: false
							})
						);
					} else {
						aFilters.push(
							new Filter({
								filters: [
									new Filter("Name", FilterOperator.Contains, query),
									new Filter("Description", FilterOperator.Contains, query),
								],
								and: false
							})
						);
					}
				}
				
				binding.filter(aFilters);
			},

			onLogoutConfirmed: function () {
				localStorage.removeItem("loggedIn");
				MessageBox.success("You have logged Out");
				this.getOwnerComponent().getRouter().navTo("login");
			},
			onEditPress: function (oEvent) {
				const oContext = oEvent.getSource().getBindingContext().getObject();
			
				const oDialog = this.byId("createProduct");
				this.byId("productIdInput").setValue(oContext.ID);
				this.byId("productNameInput").setValue(oContext.Name);
				this.byId("productDescriptionInput").setValue(oContext.Description);
				this.byId("productPriceInput").setValue(oContext.Price);
			
				this._editContextPath = oEvent.getSource().getBindingContext().getPath();
				oDialog.open();
			},

			
			onCreateProduct: function () {
				const oView = this.getView();
				const inputs = [
					oView.byId("productIdInput"),
					oView.byId("productNameInput"),
					oView.byId("productDescriptionInput"),
					oView.byId("productPriceInput"),
				];

				let isValid = true;

				inputs.forEach((oInput) => {
					const value = oInput.getValue();
					const id = oInput.getId();

					if (!value) {
						isValid = false;
						oInput.setValueState("Error");
						oInput.setValueStateText("This field is required.");
					} else if (id === "productNameInput" && (!/^[a-zA-Z\s]*$/.test(value) || value.length > 20)) {
						isValid = false;
						oInput.setValueState("Error");
						oInput.setValueStateText("Name must be alphabetic and not exceed 20 characters.");
					} else if (id === "productPriceInput" && isNaN(parseFloat(value))) {
						isValid = false;
						oInput.setValueState("Error");
						oInput.setValueStateText("Please enter a valid price.");
					} else {
						oInput.setValueState("None");
					}
				});
				if (!isValid) {
					MessageBox.error("Please fill in all required fields with valid values.");
					return;
				}

				const oModel = this.getView().getModel();
				const ID = this.byId("productIdInput").getValue();
				const Name = this.byId("productNameInput").getValue();
				const Description = this.byId("productDescriptionInput").getValue();
				const Price = this.byId("productPriceInput").getValue();

				
			
				const newProduct = { ID, Name, Description, Price };
			
				if (this._editContextPath) {
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

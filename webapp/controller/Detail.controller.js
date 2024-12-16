sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (BaseController, ODataModel, JSONModel, MessageToast,UIComponent) {
    "use strict";

    return BaseController.extend("lazyloading.controller.Detail", {
        onInit: function () {
            let oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatch, this);
            let oModel = new ODataModel("http://localhost:5000/odata", {
                maxDataServiceVersion: "3.0"
            });
            this.getView().setModel(oModel)
            
        },
        
        _onRouteMatch(oEvent) {
            const oArguments = oEvent.getParameter("arguments");
            const productId = oArguments.productID;
            const oModel = this.getView().getModel();
        
            if (!productId) {
                MessageToast.show("No Product ID provided");
                return;
            }
        
            oModel.read(`/Products(${productId})`, {
                success: (data) => {
                    let oProductModel = new JSONModel(data);
                    this.getView().setModel(oProductModel, "product");
                    console.log(data);
                    
        
                    this.byId("productId").setText(`Product ID: ${data.ProductID}`);
                    this.byId("productName").setText(`Name: ${data.ProductName}`);
                    this.byId("productPrice").setText(`Price: ${data.UnitPrice}`);
                },
                error: (error) => {
                    console.error("Error fetching product:", error);
                    MessageToast.show("Failed to load product details");
                }
            });
        }
    });
});
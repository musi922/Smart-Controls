sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType"
], function (Controller, ODataModel, Filter, FilterOperator, FilterType) {
    "use strict";
    return Controller.extend("lazyloading.controller.Orders", {

        onInit: function () {
            var oModel = new ODataModel("http://localhost:5000/odata", {
                defaultBindingMode: "TwoWay",
                useBatch: false,
                maxDataServiceVersion: "3.0",
            });
            this.getView().setModel(oModel);
        },
        onListPress(oEvent){
            let orderID = oEvent.getParameter("listItem").getBindingContext().getProperty("OrderID");
            let oFilter = new Filter("OrderID", FilterOperator.EQ, orderID,false, FilterType.Application);
            this.getView().byId("orderTable").getBinding("items").filter(oFilter);

        }



    });

});
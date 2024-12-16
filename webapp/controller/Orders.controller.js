sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/MessageBox"
], function (Controller, ODataModel, Filter, FilterOperator, FilterType,MessageBox) {
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

        },
        onLiveSearch: function(oEvent) {
            let query = oEvent.getParameter("newValue");
            let list = this.byId("orderTable");
            let binding = list.getBinding("items");
            
            let aFilters = [];
            
            if (query) {
                let queryNumber = parseInt(query);
                
                if (!isNaN(queryNumber)) {
                    aFilters.push(
                        new Filter({
                            filters: [
                                new Filter("OrderID", FilterOperator.EQ, queryNumber),
                                new Filter("ProductID", FilterOperator.EQ, queryNumber),
                                new Filter("UnitPrice", FilterOperator.EQ, queryNumber),
                                new Filter("Quantity", FilterOperator.EQ, queryNumber),
                                new Filter("Discount", FilterOperator.EQ, queryNumber)
                            ],
                            and: false
                        })
                    );
                }
            }
            
            binding.filter(aFilters);
        }
        
        , 
        onDelete: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getBindingContext();
            var oData = oItem.getObject();
            var oModel = this.getView().getModel();

            MessageBox.confirm("Are you sure you want to delete Order " + oData.ProductID + "?", {
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        oModel.remove("/Orders(" + oData.ProductID + ")", {
                            success: function () {
                                MessageBox.success("Order deleted successfully!");
                            },
                            error: function () {
                                MessageBox.error("Error deleting the order.");
                            }
                        });
                    }
                }
            });
        }



    });

});
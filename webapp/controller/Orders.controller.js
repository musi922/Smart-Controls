sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/ODataModel",
], function (Controller, ODataModel) {
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



    });

});
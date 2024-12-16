sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("lazyloading.controller.Orders", {

        onInit: function () {
            var oModel = new JSONModel({
                items: []
            });
            this.getView().setModel(oModel);
        },

        onBeforeRendering: function () {
        },

        onAfterRendering: function () {
        },

        onExit: function () {
        },

    });

});
sap.ui.define(["./BaseController",
	"sap/ui/model/odata/v2/ODataModel"
], function (BaseController, ODataModel) {
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
		},

			handleSelectionChange(oEvent){
				let oContext = oEvent.getParameter("listItem").getBindingContext().getObject()
				let oRouter = sap.ui.core.UIComponent.getRouterFor(this)
				oRouter.navTo("detail",{
					productID: oContext.ProductID
				})
			}
	});
});

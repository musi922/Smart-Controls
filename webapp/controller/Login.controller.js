sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel,MessageBox) {
    "use strict";
    return Controller.extend("lazyloading.Login.controller", {

        onInit: function () {
            var oModel = new JSONModel();
            oModel.loadData("model/login.json")
            this.getView().setModel(oModel,"loginModel");
        },
        onLogin(){
            let oView = this.getView()
            let userName = oView.byId("username").getValue()
            let password = oView.byId("password").getValue()

            let oModel = this.getView().getModel("loginModel")
            let users = oModel.getProperty("/users")

            let validUser = users.some((user)=>{
                return user.username === userName && user.password === password
            })
            if(validUser){
                localStorage.setItem("loggedIn", true)
                MessageBox.success("Login Successful")
                this.getOwnerComponent().getRouter().navTo("home")
            }
            else{
                MessageBox.error("Invalid Credentials")
            }
        }

    });

});
sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: lazyloading",
		defaults: {
			page: "ui5://test-resources/lazyloading/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "lazyloading/",
				never: "test-resources/lazyloading/"
			},
			loader: {
				paths: {
					"lazyloading": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for lazyloading"
			},
			"integration/opaTests": {
				title: "Integration tests for lazyloading"
			}
		}
	};
});

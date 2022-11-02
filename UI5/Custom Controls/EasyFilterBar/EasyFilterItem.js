sap.ui.define([
    "sap/ui/core/Element"
], function (Element) {
    let EasyFilterItem = Element.extend("at.clouddna.analytics.libs.controls.filterbar.EasyFilterItem", {
        metadata: {
            properties: {
                label: {
                    type: "string",
                    defaultValue: null
                },
                controlType: {
                    type: "string",//"at.clouddna.analytics.libs.controls.filterbar.EasyFilterItemControlType",
                    defaultValue: "sap.m.Input"
                },
                filterName: {
                    type: "string",
                    defaultvalue: ""
                },
                filterPath: {
                    type: "string",
                    defaultValue: ""
                },
                valueHelpRequest: {
                    type: "function",
                    defaultValue: ""
                },
                valueHelpKeyProperty: {
                    type: "string",
                    defaultValue: ""
                },
                showValueHelp: {
                    type: "boolean",
                    defaultValue: false
                },
                valueHelpOnly: {
                    type: "boolean",
                    defaultValue: false
                },
                filterOperator: {
                    type: "sap.ui.model.FilterOperator",
                    defaultValue: "EQ"
                },
                visibleInFilterBar: {
                    type: "boolean",
                    defaultValue: true
                },
                editable: {
                    type: "boolean",
                    defaultValue: "true"
                },
                fireSearchOnChange: {
                    type: "boolean",
                    defaultValue: false
                }
            },
            events: {
                valueHelpRequest: {}
            }
        }
    });

    EasyFilterItem.prototype.setControlType = function (sControlType) {
        if (sControlType === "" || !sControlType) {
            throw new Error("Property 'controlType' for EasyFilterItem cannot be null or emptry");
        }
        this.setProperty("controlType", sControlType);
    };

    EasyFilterItem.prototype.setFilterPath = function (sFilterPath) {
        if (sFilterPath === "" || !sFilterPath) {
            throw new Error("Property 'filterPath' for EasyFilterItem cannot be null or empty");
        }

        this.setProperty("filterPath", sFilterPath);
    };

    EasyFilterItem.prototype.setFilterName = function (sFilterName) {
        if (sFilterName === "" || !sFilterName) {
            throw new Error("Property 'filterName' for EasyFilterItem cannot be null or empty");
        }

        this.setProperty("filterName", sFilterName);
    };

    EasyFilterItem.prototype.setFilterOperator = function (sFilterOperator) {
        if (sFilterOperator === "" || !sFilterOperator) {
            throw new Error("Property 'FilterOperator' for EasyFilterItem cannot be null or empty");
        }

        this.setProperty("filterOperator", sFilterOperator);
    };

    return EasyFilterItem;
});
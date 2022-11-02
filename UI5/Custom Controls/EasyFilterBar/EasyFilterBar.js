sap.ui.define([
    "sap/ui/comp/filterbar/FilterBar",
    "sap/ui/comp/filterbar/FilterGroupItem",
    "sap/ui/comp/filterbar/FilterItem",
], function (FilterBar, FilterGroupItem, FilterItem) {
    let EasyFilterBar = FilterBar.extend("at.clouddna.analytics.libs.controls.filterbar.EasyFilterBar", {
        metadata: {
            properties: {
                useBasicSearch: {
                    type: "boolean",
                    defaultValue: true
                },
                basicSearchPaths: {
                    type: "string",
                    defaultValue: ""
                },
                basicSearchOperator: {
                    type: "sap.ui.model.FilterOperator",
                    defaultValue: "EQ"
                }
            },
            aggregations: {
                filterControls: {
                    type: "at.clouddna.analytics.libs.controls.filterbar.EasyFilterItem",
                    multiple: true,
                    singularName: "filterControl"
                }
            },
            defaultAggregation: "filterControls",
            events: {
                filterSearch: {
                    parameters: {
                        "filters": {
                            type: "array"
                        }
                    }
                }
            }
        },
        renderer(oRm, oControl) {
            FilterBar.getMetadata().getRenderer().render(oRm, oControl);
            oControl.getAggregation("filterControls").forEach((oFilterControl) => {
                oControl._renderFilterControl(oFilterControl);
            });
        }

    });

    EasyFilterBar.prototype.init = function () {
        FilterBar.prototype.init.apply(this, arguments);

        let oBasicSearch;

        this.attachSearch(this.onFilterSearch);

        debugger;
        if (this.getUseBasicSearch()) {
            debugger;
            oBasicSearch = new sap.m.SearchField({
                showSearchButton: false
            })

            
            oBasicSearch.attachBrowserEvent("keyup", function (e) {
                if (e.which === 13) {
                    this.onFilterSearch();
                }
            }.bind(this));
            this.setBasicSearch(oBasicSearch);
        }
    };

    EasyFilterBar.prototype._renderFilterControl = function (oFilterControl) {
        let sControlType = oFilterControl.getControlType(),
            sFilterName = oFilterControl.getFilterName(),
            sValueHelpKeyProperty = oFilterControl.getValueHelpKeyProperty(),
            bShowValueHelp = oFilterControl.getShowValueHelp(),
            bValueHelpOnly = oFilterControl.getValueHelpOnly(),
            sLabel = oFilterControl.getLabel(),
            bVisibleInFilterBar = oFilterControl.getVisibleInFilterBar(),
            bFireSearchOnChange = oFilterControl.getFireSearchOnChange(),
            oControl, oFilterGroupItem;

        if (!oFilterControl) {
            throw new Error("Expected argument 'oFilterControl' may not be null or empty");
        }

        switch (sControlType) {
            case "sap.m.Input":
                oControl = this._initInput(sFilterName, () => { oFilterControl.fireValueHelpRequest() }, sValueHelpKeyProperty, bShowValueHelp, bValueHelpOnly)
                break;
            case "sap.m.ComboBox":
                oControl = new sap.m.ComboBox()
                break;
            case "sap.m.DateRangeSelection":
                oControl = new sap.m.DateRangeSelection();
                break;
            case "sap.m.Select":
                oControl = new sap.m.Select();
                break;
            default:
                throw new Error(`Control Type ${sControlType} not valid for EasyFilterItem. Please use enum 'EasyFilterItemControlType'`);
        }

        if (bFireSearchOnChange) {
            oControl.attachChange(this.onFilterSearch);
        }

        oFilterGroupItem = new sap.ui.comp.filterbar.FilterGroupItem({
            groupName: "__$INTERNALS$",
            name: sFilterName,
            label: sLabel,
            visibleInFilterBar: bVisibleInFilterBar,
            control: oControl
        })
        this.addFilterGroupItem(oFilterGroupItem);

    }

    EasyFilterBar.prototype._processFilterFromBasicSearch = function () {
        if(!this.getUseBasicSearch()) {
            return [];
        }

            let sBasicSearchValue = this.getBasicSearchValue(),
            sBasicSearchOperator = this.getBasicSearchOperator(),
            aBasicSearchPaths = this.getBasicSearchPaths(),
            aFilters = [];
            
            if (sBasicSearchValue !== "") {
                
                aBasicSearchPaths = aBasicSearchPaths.replace("[", "").replace("]", "").replaceAll("'", "").split(",");
                
                aBasicSearchPaths.forEach((sPath) => {
                    aFilters = [...aFilters, new sap.ui.model.Filter({
                        path: sPath,
                        operator: sBasicSearchOperator,
                        value1: sBasicSearchValue
                    })];
                });
                
                aFilters = [new sap.ui.model.Filter({
                    filters: aFilters
                })];
            }
            
            return aFilters;
    };

    EasyFilterBar.prototype._initInput = function (sFilterName, fnValueHelpRequest, sValueHelpKeyProperty, bShowValueHelp, bValueHelpOnly) {
        let oInput = new sap.m.Input({
            name: sFilterName
        });

        oInput.attachValueHelpRequest(fnValueHelpRequest);

        return oInput;
    };

    EasyFilterBar._processFilterFromInput = function (oFilterControl, oFilterInput) {

    }

    EasyFilterBar.prototype._initComboBox = function () {

    };

    EasyFilterBar.prototype._initDateRangeSelection = function () {
        let oSelection = new sap.m.DateRangeSelection();

        return oSelection;
    };

    EasyFilterBar.prototype._initSelect = function (oControl, oFilterInput) {

    };

    EasyFilterBar.prototype.onFilterSearch = function () {

        let aFilterItems = this.getAggregation("filterControls"),
            aFilterGroupItems = this.getFilterGroupItems(),
            aFilters = [];

        if (this.getUseBasicSearch()) {
            aFilters = [...aFilters, this._processFilterFromBasicSearch()];
        }

        for (let oFilterItem of aFilterItems) {
            let sFilterName = oFilterItem.getFilterName(),
                sFilterPath = oFilterItem.getFilterPath(),
                sFilterOperator = oFilterItem.getFilterOperator(),
                oFilterControl = aFilterGroupItems.find(oGroupItem => oGroupItem.getName() === sFilterName).getControl(),
                oFilter;

            if (oFilterControl) {
                switch (oFilterControl.getMetadata().getName()) {
                    case "sap.m.Input":
                        oFilter = new sap.ui.model.Filter({
                            path: sFilterPath,
                            value1: oFilterControl.getValue(),
                            operator: sFilterOperator
                        });
                        break;
                    default: 
                        throw new Error("Missing filter-parsing implementation of controlType: " + oFilterControl.getMetadata().getName());
                }
            }

            if (oFilter.getValue1() !== "") 
                aFilters = [...aFilters, oFilter];
            
        }

        this.fireFilterSearch({ filters: aFilters });
    };

    EasyFilterBar.prototype.setBasicSearchPaths = function (sBasicSearchPaths) {
        if (this.getUseBasicSearch) {
            if (!sBasicSearchPaths || sBasicSearchPaths === "") {
                throw new Error("Property 'basicSearchPaths' can not be null or empty");
            }
        }

        this.setProperty("basicSearchPaths", sBasicSearchPaths);
    };

    EasyFilterBar.prototype.setBasicSearchOperator = function (sBasicSearchOperator) {
        if (this.getUseBasicSearch) {
            if (!sBasicSearchOperator || sBasicSearchOperator === "") {
                throw new Error("Property 'basicSearchOperator' can not be null or empty");
            }
            if (sBasicSearchOperator === "BT") {
                throw new Error("Value 'BT' not valid for property 'basicSearchOperator' - Search field is single value only")
            }
        }

        this.setProperty("basicSearchOperator", sBasicSearchOperator);
    };



    return EasyFilterBar;
});
sap.ui.define([
    "sap/ui/core/UIComponent",
],
    function (UIComponent) {
        "use strict";

        return UIComponent.extend("molzi.Component", {
            metadata: {
                manifest: "json"
            },

            oEventBus: {
                handlers: [],
                subscribe: function (sComponentName, sEventType, fnEventHandler) {
                    this.handlers.push({
                        sComponentName: sComponentName,
                        sEventType: sEventType,
                        fnEventHandler: fnEventHandler
                    });
                },

                unsubscribe: function (sComponentName, sEventType, fnEventHandler) {
                    this.handlers = this.handlers.filter(
                        function (oItem) {
                            if (oItem.sComponentName !== sComponentName && oItem.sEventType != sEventType && oItem.fnEventHandler != fnEventHandler) {
                                return oItem;
                            }
                        }
                    );
                },

                publish: function (sToComponent, sEventType, oParams) {
                    this.handlers.forEach(function (oItem) {
                        if (oItem.sEventType === sEventType) {
                            oItem.fnEventHandler(sToComponent, sEventType, oParams);
                        }
                    });
                }
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
            },

        });
    }
);

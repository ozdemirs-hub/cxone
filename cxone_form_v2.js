
(function () {
    "use strict";

    var JSON_URL =
        "https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json";

    var ALLOWED_STATES = ["NSW", "QLD", "SA"];

    var approvedPostcodes = [];
    var postcodesLoaded = false;
    var initialised = false;

    function getFields() {
        return {
            state: document.getElementById("3"),
            postcode: document.getElementById("4"),

            health: document.getElementById("product_health"),
            ovc: document.getElementById("product_ovc"),
            utilities: document.getElementById("product_utilities"),

            healthDelivery: document.getElementById("health_delivery_group"),
            healthLive: document.getElementById("health_live_transfer"),

            ovcDelivery: document.getElementById("ovc_delivery_group"),
            ovcLiveOption: document.getElementById("ovc_live_transfer_option"),
            ovcLive: document.getElementById("ovc_live_transfer"),
            ovcCallback: document.getElementById("ovc_callback"),
            ovcDateGroup: document.getElementById("callback_datetime_ovc_group"),
            ovcDate: document.getElementById("callback_datetime_ovc"),

            utilitiesDelivery: document.getElementById("utilities_delivery_group"),
            utilitiesLiveOption: document.getElementById("utilities_live_transfer_option"),
            utilitiesLive: document.getElementById("utilities_live_transfer"),
            utilitiesCallback: document.getElementById("utilities_callback"),
            utilitiesDateGroup: document.getElementById("callback_datetime_utilities_group"),
            utilitiesDate: document.getElementById("callback_datetime_utilities")
        };
    }

    function studioBoolean(id) {
        var element = document.getElementById(id);

        if (!element) {
            return false;
        }

        var value = String(element.value || "")
            .trim()
            .toLowerCase();

        return value === "true" || value === "1";
    }

    function normaliseState(value) {
        var state = String(value || "")
            .trim()
            .toUpperCase();

        var map = {
            "NEW SOUTH WALES": "NSW",
            "AUSTRALIAN CAPITAL TERRITORY": "ACT",
            "QUEENSLAND": "QLD",
            "SOUTH AUSTRALIA": "SA",
            "VICTORIA": "VIC",
            "NORTHERN TERRITORY": "NT",
            "TASMANIA": "TAS",
            "WESTERN AUSTRALIA": "WA"
        };

        return map[state] || state;
    }

    function clearCallbackDate(field) {
        if (!field) return;

        if (field._flatpickr) {
            field._flatpickr.clear();
        } else {
            field.value = "";
        }
    }

    function updateLiveTransferAvailability() {
        var f = getFields();

        var ovcEnabled = studioBoolean(
            "config_ovc_live_transfer"
        );

        var utilitiesEnabled = studioBoolean(
            "config_util_live_transfer"
        );

        if (f.ovcLiveOption) {
            f.ovcLiveOption.style.display =
                ovcEnabled ? "block" : "none";
        }

        if (f.ovcLive) {
            f.ovcLive.disabled = !ovcEnabled;

            if (!ovcEnabled && f.ovcLive.checked) {
                f.ovcLive.checked = false;

                if (f.ovcCallback) {
                    f.ovcCallback.checked = true;
                }
            }
        }

        if (f.utilitiesLiveOption) {
            f.utilitiesLiveOption.style.display =
                utilitiesEnabled ? "block" : "none";
        }

        if (f.utilitiesLive) {
            f.utilitiesLive.disabled = !utilitiesEnabled;

            if (!utilitiesEnabled && f.utilitiesLive.checked) {
                f.utilitiesLive.checked = false;

                if (f.utilitiesCallback) {
                    f.utilitiesCallback.checked = true;
                }
            }
        }

        console.log("CXone Live Transfer configuration:", {
            ovcLiveTransfer: ovcEnabled,
            utilLiveTransfer: utilitiesEnabled
        });
    }

    function refreshDelivery() {
        var f = getFields();

        var healthSelected =
            !!(f.health && f.health.checked);

        var ovcSelected =
            !!(f.ovc && f.ovc.checked);

        var utilitiesSelected =
            !!(f.utilities &&
               f.utilities.checked &&
               !f.utilities.disabled);

        var healthUtilities =
            healthSelected && utilitiesSelected;

        // Health delivery
        if (f.healthDelivery) {
            f.healthDelivery.style.display =
                healthUtilities ? "block" : "none";
        }

        if (f.healthLive) {
            f.healthLive.checked = healthUtilities;
        }

        // OVC delivery
        if (f.ovcDelivery) {
            f.ovcDelivery.style.display =
                ovcSelected ? "block" : "none";
        }

        if (ovcSelected &&
            f.ovcCallback &&
            !f.ovcCallback.checked &&
            !(f.ovcLive &&
              f.ovcLive.checked &&
              !f.ovcLive.disabled)) {

            f.ovcCallback.checked = true;
        }

        var showOvcCallback =
            ovcSelected &&
            !!(f.ovcCallback && f.ovcCallback.checked);

        if (f.ovcDateGroup) {
            f.ovcDateGroup.style.display =
                showOvcCallback ? "block" : "none";
        }

        if (!showOvcCallback) {
            clearCallbackDate(f.ovcDate);
        }

        // Utilities delivery
        if (f.utilitiesDelivery) {
            f.utilitiesDelivery.style.display =
                utilitiesSelected ? "block" : "none";
        }

        if (utilitiesSelected &&
            f.utilitiesCallback &&
            !f.utilitiesCallback.checked &&
            !(f.utilitiesLive &&
              f.utilitiesLive.checked &&
              !f.utilitiesLive.disabled)) {

            f.utilitiesCallback.checked = true;
        }

        var showUtilitiesCallback =
            utilitiesSelected &&
            !!(f.utilitiesCallback &&
               f.utilitiesCallback.checked);

        if (f.utilitiesDateGroup) {
            f.utilitiesDateGroup.style.display =
                showUtilitiesCallback ? "block" : "none";
        }

        if (!showUtilitiesCallback) {
            clearCallbackDate(f.utilitiesDate);
        }

        console.log("CXone delivery selection:", {
            healthLiveTransfer: healthUtilities,
            ovcLiveTransfer: ovcSelected &&
                !!(f.ovcLive && f.ovcLive.checked),
            ovcCallback: showOvcCallback,
            utilitiesLiveTransfer: utilitiesSelected &&
                !!(f.utilitiesLive && f.utilitiesLive.checked),
            utilitiesCallback: showUtilitiesCallback
        });
    }

    function updateUtilities() {
        var f = getFields();

        if (!f.state || !f.postcode || !f.utilities) {
            return;
        }

        var state = normaliseState(f.state.value);

        var postcode = String(f.postcode.value || "")
            .trim();

        var eligible =
            ALLOWED_STATES.indexOf(state) !== -1 &&
            postcodesLoaded &&
            /^[0-9]{4}$/.test(postcode) &&
            approvedPostcodes.indexOf(postcode) !== -1;

        f.utilities.disabled = !eligible;

        if (!eligible) {
            f.utilities.checked = false;
        }

        refreshDelivery();

        console.log("Utilities eligibility:", {
            state: state,
            postcode: postcode,
            eligible: eligible
        });
    }

    function loadPostcodes() {
        fetch(JSON_URL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(
                        "Postcode JSON HTTP " + response.status
                    );
                }

                return response.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) {
                    throw new Error(
                        "Postcode JSON must be an array"
                    );
                }

                approvedPostcodes = data.map(function (value) {
                    return String(value).trim();
                });

                postcodesLoaded = true;
                updateUtilities();
            })
            .catch(function (error) {
                console.error(
                    "CXone postcode loading error:",
                    error
                );

                approvedPostcodes = [];
                postcodesLoaded = false;
                updateUtilities();
            });
    }

    function productChanged(changed) {
        var f = getFields();

        if (changed === f.health &&
            f.health.checked &&
            f.ovc) {

            f.ovc.checked = false;
        }

        if (changed === f.ovc &&
            f.ovc.checked &&
            f.health) {

            f.health.checked = false;
        }

        refreshDelivery();
    }

    function initialise() {
        if (initialised) return;

        var f = getFields();

        if (!f.health ||
            !f.ovc ||
            !f.utilities ||
            !f.state ||
            !f.postcode) {

            console.warn(
                "CXone: Waiting for form elements"
            );

            setTimeout(initialise, 500);
            return;
        }

        initialised = true;

        // Initial product selection
        f.health.checked = true;
        f.ovc.checked = false;
        f.utilities.checked = false;
        f.utilities.disabled = true;

        // Default delivery selections
        if (f.ovcCallback) {
            f.ovcCallback.checked = true;
        }

        if (f.utilitiesCallback) {
            f.utilitiesCallback.checked = true;
        }

        // Read Studio configuration
        updateLiveTransferAvailability();

        // Product listeners
        f.health.addEventListener("change", function () {
            productChanged(f.health);
        });

        f.ovc.addEventListener("change", function () {
            productChanged(f.ovc);
        });

        f.utilities.addEventListener(
            "change",
            refreshDelivery
        );

        // OVC delivery listeners
        if (f.ovcLive) {
            f.ovcLive.addEventListener(
                "change",
                refreshDelivery
            );
        }

        if (f.ovcCallback) {
            f.ovcCallback.addEventListener(
                "change",
                refreshDelivery
            );
        }

        // Utilities delivery listeners
        if (f.utilitiesLive) {
            f.utilitiesLive.addEventListener(
                "change",
                refreshDelivery
            );
        }

        if (f.utilitiesCallback) {
            f.utilitiesCallback.addEventListener(
                "change",
                refreshDelivery
            );
        }

        // State/postcode listeners
        f.state.addEventListener(
            "input",
            updateUtilities
        );

        f.state.addEventListener(
            "change",
            updateUtilities
        );

        f.postcode.addEventListener(
            "input",
            updateUtilities
        );

        f.postcode.addEventListener(
            "change",
            updateUtilities
        );

        // Initial visibility
        refreshDelivery();
        updateUtilities();

        // Load approved postcode list
        loadPostcodes();

        console.log(
            "CXone configurable delivery form initialised"
        );
    }

    setTimeout(initialise, 500);

})();

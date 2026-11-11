
(function () {
    "use strict";

    // ========================================================
    // NICE CXone - OVC and Utilities Callback Only
    // ========================================================

    var JSON_URL =
        "https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json";

    var ALLOWED_STATES = ["NSW", "QLD", "SA"];

    var approvedPostcodes = [];
    var postcodesLoaded = false;
    var initialised = false;

    // ========================================================
    // FIELD REFERENCES
    // ========================================================

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
            ovcLive: document.getElementById("ovc_live_transfer"),
            ovcCallback: document.getElementById("ovc_callback"),
            ovcDateGroup: document.getElementById("callback_datetime_ovc_group"),
            ovcDate: document.getElementById("callback_datetime_ovc"),

            utilitiesDelivery: document.getElementById("utilities_delivery_group"),
            utilitiesLive: document.getElementById("utilities_live_transfer"),
            utilitiesCallback: document.getElementById("utilities_callback"),
            utilitiesDateGroup: document.getElementById("callback_datetime_utilities_group"),
            utilitiesDate: document.getElementById("callback_datetime_utilities")
        };
    }

    // ========================================================
    // STATE NORMALISATION
    // ========================================================

    function normaliseState(value) {
        var state = String(value || "").trim().toUpperCase();

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

    // ========================================================
    // CALLBACK DATE HANDLING
    // ========================================================

    function clearCallbackDate(field) {
        if (!field) return;

        if (field._flatpickr) {
            field._flatpickr.clear();
        } else {
            field.value = "";
        }
    }

    // ========================================================
    // DELIVERY SELECTIONS
    // ========================================================

    function refreshDelivery() {
        var f = getFields();

        var ovcSelected = f.ovc && f.ovc.checked;

        var utilitiesSelected =
            f.utilities &&
            f.utilities.checked &&
            !f.utilities.disabled;

        var healthUtilities =
            f.health &&
            f.health.checked &&
            utilitiesSelected;

        // Health + Utilities: Health Live Transfer.
        if (f.healthDelivery) {
            f.healthDelivery.style.display =
                healthUtilities ? "block" : "none";
        }

        if (f.healthLive) {
            f.healthLive.checked = healthUtilities;
        }

        // OVC: Callback only.
        if (f.ovcDelivery) {
            f.ovcDelivery.style.display =
                ovcSelected ? "block" : "none";
        }

        if (f.ovcLive) {
            f.ovcLive.checked = false;
            var ovcLiveLabel = f.ovcLive.closest("label");
            if (ovcLiveLabel) {
                ovcLiveLabel.style.display = "none";
            } else {
                f.ovcLive.style.display = "none";
            }
        }

        if (f.ovcCallback) {
            f.ovcCallback.checked = ovcSelected;
        }

        if (f.ovcDateGroup) {
            f.ovcDateGroup.style.display =
                ovcSelected ? "block" : "none";
        }

        if (!ovcSelected) {
            clearCallbackDate(f.ovcDate);
        }

        // Utilities: Callback only.
        if (f.utilitiesDelivery) {
            f.utilitiesDelivery.style.display =
                utilitiesSelected ? "block" : "none";
        }

        if (f.utilitiesLive) {
            f.utilitiesLive.checked = false;
            var utilitiesLiveLabel =
                f.utilitiesLive.closest("label");

            if (utilitiesLiveLabel) {
                utilitiesLiveLabel.style.display = "none";
            } else {
                f.utilitiesLive.style.display = "none";
            }
        }

        if (f.utilitiesCallback) {
            f.utilitiesCallback.checked = utilitiesSelected;
        }

        if (f.utilitiesDateGroup) {
            f.utilitiesDateGroup.style.display =
                utilitiesSelected ? "block" : "none";
        }

        if (!utilitiesSelected) {
            clearCallbackDate(f.utilitiesDate);
        }

        console.log("CXone delivery selection:", {
            healthLiveTransfer: healthUtilities,
            ovcCallback: ovcSelected,
            utilitiesCallback: utilitiesSelected
        });
    }

    // ========================================================
    // UTILITIES ELIGIBILITY
    // ========================================================

    function updateUtilities() {
        var f = getFields();

        if (!f.state || !f.postcode || !f.utilities) {
            return;
        }

        var state = normaliseState(f.state.value);
        var postcode = String(f.postcode.value || "").trim();

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

    // ========================================================
    // LOAD POSTCODES
    // ========================================================

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
                    throw new Error("Postcode JSON must be an array");
                }

                approvedPostcodes = data.map(function (value) {
                    return String(value).trim();
                });

                postcodesLoaded = true;
                updateUtilities();
            })
            .catch(function (error) {
                console.error("Postcode loading error:", error);
                approvedPostcodes = [];
                postcodesLoaded = false;
                updateUtilities();
            });
    }

    // ========================================================
    // PRODUCT SELECTION
    // ========================================================

    function productChanged(changedCheckbox) {
        var f = getFields();

        if (
            changedCheckbox === f.health &&
            f.health.checked &&
            f.ovc
        ) {
            f.ovc.checked = false;
        }

        if (
            changedCheckbox === f.ovc &&
            f.ovc.checked &&
            f.health
        ) {
            f.health.checked = false;
        }

        refreshDelivery();
    }

    // ========================================================
    // INITIALISATION
    // ========================================================

    function initialise() {
        var f = getFields();

        // Only core product checkboxes are mandatory.
        if (!f.health || !f.ovc || !f.utilities) {
            console.warn(
                "CXone: Waiting for product checkboxes"
            );
            setTimeout(initialise, 500);
            return;
        }

        if (initialised) return;
        initialised = true;

        f.health.checked = true;
        f.ovc.checked = false;
        f.utilities.checked = false;
        f.utilities.disabled = true;

        // Product listeners.
        f.health.addEventListener("change", function () {
            productChanged(f.health);
        });

        f.ovc.addEventListener("change", function () {
            productChanged(f.ovc);
        });

        f.utilities.addEventListener(
            "change", refreshDelivery
        );

        // Prevent Callback-only options from being
        // deselected while the product is selected.
        if (f.ovcCallback) {
            f.ovcCallback.addEventListener(
                "change", refreshDelivery
            );
        }

        if (f.utilitiesCallback) {
            f.utilitiesCallback.addEventListener(
                "change", refreshDelivery
            );
        }

        // Postcode validation listeners.
        if (f.state && f.postcode) {
            f.state.addEventListener(
                "input", updateUtilities
            );
            f.state.addEventListener(
                "change", updateUtilities
            );

            f.postcode.addEventListener(
                "input", updateUtilities
            );
            f.postcode.addEventListener(
                "change", updateUtilities
            );

            loadPostcodes();
        } else {
            console.error(
                "CXone: State or postcode field missing"
            );
        }

        // Report missing callback fields.
        [
            "ovc_delivery_group",
            "ovc_callback",
            "callback_datetime_ovc_group",
            "callback_datetime_ovc",
            "utilities_delivery_group",
            "utilities_callback",
            "callback_datetime_utilities_group",
            "callback_datetime_utilities"
        ].forEach(function (id) {
            if (!document.getElementById(id)) {
                console.error(
                    "CXone missing HTML element:", id
                );
            }
        });

        refreshDelivery();
        updateUtilities();

        console.log(
            "CXone OVC + Utilities Callback-only initialised"
        );
    }

    setTimeout(initialise, 500);

})();

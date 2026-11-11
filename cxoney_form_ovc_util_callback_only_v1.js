
(function () {
    "use strict";

    // ========================================================
    // CONFIGURATION
    // ========================================================

    var JSON_URL =
        "https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json";

    var ALLOWED_STATES = ["NSW", "QLD", "SA"];

    var approvedPostcodes = [];
    var postcodesLoaded = false;
    var initialised = false;
    var previousCombination = null;

    // ========================================================
    // FORM FIELDS
    // ========================================================

    function getFields() {
        return {
            state: document.getElementById("3"),
            postcode: document.getElementById("4"),

            health: document.getElementById("product_health"),
            ovc: document.getElementById("product_ovc"),
            utilities: document.getElementById("product_utilities"),

            healthDelivery: document.getElementById(
                "health_delivery_group"
            ),
            healthLive: document.getElementById(
                "health_live_transfer"
            ),

            ovcDelivery: document.getElementById(
                "ovc_delivery_group"
            ),
            ovcCallback: document.getElementById(
                "ovc_callback"
            ),
            ovcDateGroup: document.getElementById(
                "callback_datetime_ovc_group"
            ),
            ovcDate: document.getElementById(
                "callback_datetime_ovc"
            ),

            utilitiesDelivery: document.getElementById(
                "utilities_delivery_group"
            ),
            utilitiesLive: document.getElementById(
                "utilities_live_transfer"
            ),
            utilitiesCallback: document.getElementById(
                "utilities_callback"
            ),
            utilitiesDateGroup: document.getElementById(
                "callback_datetime_utilities_group"
            ),
            utilitiesDate: document.getElementById(
                "callback_datetime_utilities"
            )
        };
    }

    // ========================================================
    // STATE NORMALISATION
    // ========================================================

    function normaliseState(value) {
        var state = String(value || "").trim().toUpperCase();

        var map = {
            "NSW": "NSW",
            "NEW SOUTH WALES": "NSW",
            "ACT": "ACT",
            "AUSTRALIAN CAPITAL TERRITORY": "ACT",
            "QLD": "QLD",
            "QUEENSLAND": "QLD",
            "SA": "SA",
            "SOUTH AUSTRALIA": "SA",
            "VIC": "VIC",
            "VICTORIA": "VIC",
            "NT": "NT",
            "NORTHERN TERRITORY": "NT",
            "TAS": "TAS",
            "TASMANIA": "TAS",
            "WA": "WA",
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

    function updateCallbackVisibility() {
        var f = getFields();

        var showOVC = f.ovc.checked;

        f.ovcDateGroup.style.display =
            showOVC ? "block" : "none";

        if (!showOVC) {
            clearCallbackDate(f.ovcDate);
        }

        var showUtilities =
            f.utilities.checked &&
            !f.utilities.disabled &&
            f.utilitiesCallback.checked;

        f.utilitiesDateGroup.style.display =
            showUtilities ? "block" : "none";

        if (!showUtilities) {
            clearCallbackDate(f.utilitiesDate);
        }
    }

    // ========================================================
    // PRODUCT COMBINATION
    // ========================================================

    function getCombination(f) {
        var utilitiesSelected =
            f.utilities.checked && !f.utilities.disabled;

        if (f.ovc.checked && utilitiesSelected) {
            return "OVC_UTILITIES";
        }

        if (f.health.checked && utilitiesSelected) {
            return "HEALTH_UTILITIES";
        }

        if (f.ovc.checked) return "OVC";
        if (utilitiesSelected) return "UTILITIES";
        if (f.health.checked) return "HEALTH";

        return "NONE";
    }

    // ========================================================
    // DEFAULT DELIVERY SELECTIONS
    // ========================================================

    function applyDefaults(f, combination) {
        f.healthLive.checked = false;
        f.ovcCallback.checked = false;
        f.utilitiesLive.checked = false;
        f.utilitiesCallback.checked = false;

        switch (combination) {

            case "OVC_UTILITIES":
                f.ovcCallback.checked = true;
                f.utilitiesLive.checked = true;
                break;

            case "HEALTH_UTILITIES":
                f.healthLive.checked = true;
                f.utilitiesCallback.checked = true;
                break;

            case "UTILITIES":
                f.utilitiesLive.checked = true;
                break;

            case "OVC":
                f.ovcCallback.checked = true;
                break;

            case "HEALTH":
            case "NONE":
                break;
        }
    }

    // ========================================================
    // DELIVERY CONTROLS
    // ========================================================

    function refreshDelivery() {
        var f = getFields();
        var combination = getCombination(f);

        if (combination !== previousCombination) {
            applyDefaults(f, combination);
            previousCombination = combination;
        }

        // Health delivery only for Health + Utilities
        f.healthDelivery.style.display =
            combination === "HEALTH_UTILITIES"
                ? "block"
                : "none";

        f.healthLive.checked =
            combination === "HEALTH_UTILITIES";

        // OVC always uses Callback
        f.ovcDelivery.style.display =
            f.ovc.checked ? "block" : "none";

        f.ovcCallback.checked = f.ovc.checked;

        // Utilities delivery
        var utilitiesSelected =
            f.utilities.checked && !f.utilities.disabled;

        f.utilitiesDelivery.style.display =
            utilitiesSelected ? "block" : "none";

        updateCallbackVisibility();

        console.log(
            "Current product combination:",
            combination
        );
    }

    // ========================================================
    // UTILITIES ELIGIBILITY
    // ========================================================

    function postcodeIsApproved(postcode) {
        return approvedPostcodes.indexOf(postcode) !== -1;
    }

    function updateUtilities() {
        var f = getFields();

        var state = normaliseState(f.state.value);
        var postcode = String(f.postcode.value || "").trim();

        var stateAllowed =
            ALLOWED_STATES.indexOf(state) !== -1;

        var eligible =
            stateAllowed &&
            postcodesLoaded &&
            /^[0-9]{4}$/.test(postcode) &&
            postcodeIsApproved(postcode);

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
                        "utilities-postcodes.json must contain an array"
                    );
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

    function updateProductSelection(changedCheckbox) {
        var f = getFields();

        // Health and OVC are mutually exclusive
        if (changedCheckbox === f.health && f.health.checked) {
            f.ovc.checked = false;
        }

        if (changedCheckbox === f.ovc && f.ovc.checked) {
            f.health.checked = false;
        }

        refreshDelivery();
    }

    // ========================================================
    // INITIALISATION
    // ========================================================

    function initialise() {
        var f = getFields();

        var required = [
            f.state,
            f.postcode,
            f.health,
            f.ovc,
            f.utilities,
            f.healthDelivery,
            f.healthLive,
            f.ovcDelivery,
            f.ovcCallback,
            f.ovcDateGroup,
            f.ovcDate,
            f.utilitiesDelivery,
            f.utilitiesLive,
            f.utilitiesCallback,
            f.utilitiesDateGroup,
            f.utilitiesDate
        ];

        if (required.some(function (field) {
            return !field;
        })) {
            setTimeout(initialise, 500);
            return;
        }

        if (initialised) return;
        initialised = true;

        f.health.checked = true;
        f.ovc.checked = false;
        f.utilities.checked = false;
        f.utilities.disabled = true;

        f.healthLive.checked = false;
        f.ovcCallback.checked = false;
        f.utilitiesLive.checked = false;
        f.utilitiesCallback.checked = false;

        f.state.addEventListener("input", updateUtilities);
        f.state.addEventListener("change", updateUtilities);

        f.postcode.addEventListener("input", updateUtilities);
        f.postcode.addEventListener("change", updateUtilities);

        f.health.addEventListener("change", function () {
            updateProductSelection(f.health);
        });

        f.ovc.addEventListener("change", function () {
            updateProductSelection(f.ovc);
        });

        f.utilities.addEventListener(
            "change", refreshDelivery
        );

        // OVC Callback cannot be deselected
        // while OVC is selected.
        f.ovcCallback.addEventListener("change", function () {
            f.ovcCallback.checked = f.ovc.checked;
            updateCallbackVisibility();
        });

        f.utilitiesLive.addEventListener(
            "change", updateCallbackVisibility
        );

        f.utilitiesCallback.addEventListener(
            "change", updateCallbackVisibility
        );

        refreshDelivery();
        updateUtilities();
        loadPostcodes();

        console.log(
            "CXone Callback-only OVC form initialised"
        );
    }

    setTimeout(initialise, 500);

})();

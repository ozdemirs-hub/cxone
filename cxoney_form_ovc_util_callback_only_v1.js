
(function () {
    "use strict";

    // ========================================================
    // NICE CXone - OVC + Utilities Callback Only
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

    // ========================================================
    // CALLBACK DATE HANDLING
    // ========================================================

    function clearCallbackDate(field) {
        if (!field) {
            return;
        }

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
            !f.utilities.disabled;

        f.utilitiesDateGroup.style.display =
            showUtilities ? "block" : "none";

        if (!showUtilities) {
            clearCallbackDate(f.utilitiesDate);
        }
    }

    // ========================================================
    // DELIVERY SELECTIONS
    // ========================================================

    function refreshDelivery() {
        var f = getFields();

        var ovcSelected = f.ovc.checked;

        var utilitiesSelected =
            f.utilities.checked &&
            !f.utilities.disabled;

        var healthUtilities =
            f.health.checked &&
            utilitiesSelected;

        // Health Live Transfer is available
        // only for Health + Utilities.
        f.healthDelivery.style.display =
            healthUtilities ? "block" : "none";

        f.healthLive.checked = healthUtilities;

        // OVC: Callback only.
        f.ovcDelivery.style.display =
            ovcSelected ? "block" : "none";

        f.ovcCallback.checked = ovcSelected;

        // Utilities: Callback only.
        f.utilitiesDelivery.style.display =
            utilitiesSelected ? "block" : "none";

        f.utilitiesCallback.checked =
            utilitiesSelected;

        // Display callback calendars.
        updateCallbackVisibility();

        console.log("Delivery selection:", {
            healthLiveTransfer: healthUtilities,
            ovcCallback: ovcSelected,
            utilitiesCallback: utilitiesSelected
        });
    }

    // ========================================================
    // UTILITIES POSTCODE ELIGIBILITY
    // ========================================================

    function postcodeIsApproved(postcode) {
        return approvedPostcodes.indexOf(postcode) !== -1;
    }

    function updateUtilities() {
        var f = getFields();

        var state = normaliseState(f.state.value);

        var postcode = String(
            f.postcode.value || ""
        ).trim();

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

    // ========================================================
    // LOAD POSTCODES
    // ========================================================

    function loadPostcodes() {
        fetch(JSON_URL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(
                        "Postcode JSON HTTP " +
                        response.status
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

                approvedPostcodes = data.map(
                    function (value) {
                        return String(value).trim();
                    }
                );

                postcodesLoaded = true;

                console.log(
                    "Approved postcodes loaded:",
                    approvedPostcodes.length
                );

                updateUtilities();
            })
            .catch(function (error) {
                console.error(
                    "Postcode loading error:",
                    error
                );

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

        // Health and OVC are mutually exclusive.
        if (
            changedCheckbox === f.health &&
            f.health.checked
        ) {
            f.ovc.checked = false;
        }

        if (
            changedCheckbox === f.ovc &&
            f.ovc.checked
        ) {
            f.health.checked = false;
        }

        // Utilities is independent.
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

        if (initialised) {
            return;
        }

        initialised = true;

        // Initial product state.
        f.health.checked = true;
        f.ovc.checked = false;

        f.utilities.checked = false;
        f.utilities.disabled = true;

        // Initial delivery state.
        f.healthLive.checked = false;
        f.ovcCallback.checked = false;
        f.utilitiesCallback.checked = false;

        // State and postcode listeners.
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

        // Product selection listeners.
        f.health.addEventListener(
            "change",
            function () {
                updateProductSelection(f.health);
            }
        );

        f.ovc.addEventListener(
            "change",
            function () {
                updateProductSelection(f.ovc);
            }
        );

        f.utilities.addEventListener(
            "change", refreshDelivery
        );

        // Callback selections cannot be removed
        // while their products are selected.
        f.ovcCallback.addEventListener(
            "change", refreshDelivery
        );

        f.utilitiesCallback.addEventListener(
            "change", refreshDelivery
        );

        // Initial display and eligibility.
        refreshDelivery();
        updateUtilities();
        loadPostcodes();

        console.log(
            "CXone OVC + Utilities Callback-only form initialised"
        );
    }

    setTimeout(initialise, 500);

})();

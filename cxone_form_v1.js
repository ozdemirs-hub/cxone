
(function () {
    "use strict";
    alert("CXone NEW delivery rules script loaded");

    // ========================================================
    // CONFIGURATION
    // ========================================================

    var JSON_URL =
        "https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json";

    var ALLOWED_STATES = ["NSW", "ACT", "QLD", "SA", "VIC"];

    var approvedPostcodes = [];
    var postcodesLoaded = false;
    var initialised = false;

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

            ovcDelivery: document.getElementById(
                "ovc_delivery_group"
            ),
            ovcLive: document.getElementById(
                "ovc_live_transfer"
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
    // POSTCODE VALIDATION
    // ========================================================

    function postcodeIsApproved(postcode) {
        return approvedPostcodes.indexOf(postcode) !== -1;
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

                console.log(
                    "Loaded approved postcodes:",
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
    // UTILITIES ELIGIBILITY
    // ========================================================

    function updateUtilities() {
        var f = getFields();

        if (!f.state || !f.postcode || !f.utilities) {
            return;
        }

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

        updateUtilitiesDelivery();

        console.log("Utilities eligibility:", {
            state: state,
            postcode: postcode,
            stateAllowed: stateAllowed,
            postcodeApproved: postcodeIsApproved(postcode),
            eligible: eligible
        });
    }

    // ========================================================
    // CLEAR CALLBACK DATE
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

    // ========================================================
    // OVC DELIVERY CONTROLS
    // ========================================================

    
function updateOVCDelivery() {
    var f = getFields();

    if (!f.ovc || !f.ovcDelivery ||
        !f.ovcLive || !f.ovcCallback ||
        !f.utilities) {
        return;
    }

    var ovcSelected = f.ovc.checked;
    var utilitiesSelected =
        f.utilities.checked && !f.utilities.disabled;

    f.ovcDelivery.style.display =
        ovcSelected ? "block" : "none";

    // Hide OVC Live Transfer when Utilities is selected.
    // Otherwise, show it.
    var liveLabel = f.ovcLive.closest("label");

    if (liveLabel) {
        liveLabel.style.display =
            utilitiesSelected ? "none" : "";
    }

    // Clear an existing OVC Live Transfer selection
    // if Utilities is also selected.
    if (utilitiesSelected) {
        f.ovcLive.checked = false;
    }

    if (!ovcSelected) {
        f.ovcLive.checked = false;
        f.ovcCallback.checked = false;
    }

    updateOVCCallback();
}


    function updateOVCCallback() {
        var f = getFields();

        if (!f.ovcDateGroup || !f.ovcCallback) {
            return;
        }

        var show =
            f.ovc.checked &&
            f.ovcCallback.checked;

        f.ovcDateGroup.style.display =
            show ? "block" : "none";

        if (!show) {
            clearCallbackDate(f.ovcDate);
        }
    }

    
function selectOVCLive() {
    var f = getFields();

    if (f.utilities.checked && !f.utilities.disabled) {
        f.ovcLive.checked = false;
        updateOVCCallback();
        return;
    }

    if (f.ovcLive.checked) {
        f.ovcCallback.checked = false;
    }

    updateOVCCallback();
}


    function selectOVCCallback() {
        var f = getFields();

        if (f.ovcCallback.checked) {
            f.ovcLive.checked = false;
        }

        updateOVCCallback();
    }

    // ========================================================
    // UTILITIES DELIVERY CONTROLS
    // ========================================================

    
function updateUtilitiesDelivery() {
    var f = getFields();

    if (!f.utilities || !f.utilitiesDelivery) {
        return;
    }

    var selected =
        f.utilities.checked && !f.utilities.disabled;

    f.utilitiesDelivery.style.display =
        selected ? "block" : "none";

    if (!selected) {
        f.utilitiesLive.checked = false;
        f.utilitiesCallback.checked = false;
    }

    updateUtilitiesCallback();

    // Refresh OVC delivery options.
    updateOVCDelivery();
}


    function updateUtilitiesCallback() {
        var f = getFields();

        if (!f.utilitiesDateGroup || !f.utilitiesCallback) {
            return;
        }

        var show =
            f.utilities.checked &&
            !f.utilities.disabled &&
            f.utilitiesCallback.checked;

        f.utilitiesDateGroup.style.display =
            show ? "block" : "none";

        if (!show) {
            clearCallbackDate(f.utilitiesDate);
        }
    }

    function selectUtilitiesLive() {
        var f = getFields();

        if (f.utilitiesLive.checked) {
            f.utilitiesCallback.checked = false;
        }

        updateUtilitiesCallback();
    }

    function selectUtilitiesCallback() {
        var f = getFields();

        if (f.utilitiesCallback.checked) {
            f.utilitiesLive.checked = false;
        }

        updateUtilitiesCallback();
    }

    // ========================================================
    // PRODUCT SELECTION
    // ========================================================

    

function updateProductSelection(changedCheckbox) {
    var f = getFields();

    // Health and OVC cannot be selected together.
    if (changedCheckbox === f.health && f.health.checked) {
        f.ovc.checked = false;
    }

    if (changedCheckbox === f.ovc && f.ovc.checked) {
        f.health.checked = false;
    }

    // Utilities remains independent.
    // Refresh delivery options after product changes.
    updateOVCDelivery();
    updateUtilitiesDelivery();
}



    // ========================================================
    // INITIALISATION
    // ========================================================

    function initialise() {
        var f = getFields();

        if (
            !f.state ||
            !f.postcode ||
            !f.health ||
            !f.ovc ||
            !f.utilities ||
            !f.ovcDelivery ||
            !f.ovcLive ||
            !f.ovcCallback ||
            !f.ovcDateGroup ||
            !f.ovcDate ||
            !f.utilitiesDelivery ||
            !f.utilitiesLive ||
            !f.utilitiesCallback ||
            !f.utilitiesDateGroup ||
            !f.utilitiesDate
        ) {
            setTimeout(initialise, 500);
            return;
        }

        if (initialised) {
            return;
        }

        initialised = true;

        // Initial product state
        f.health.checked = true;
        f.ovc.checked = false;

        f.utilities.checked = false;
        f.utilities.disabled = true;

        // Initial delivery state
        f.ovcLive.checked = false;
        f.ovcCallback.checked = false;

        f.utilitiesLive.checked = false;
        f.utilitiesCallback.checked = false;

        // Hide delivery groups
        f.ovcDelivery.style.display = "none";
        f.utilitiesDelivery.style.display = "none";

        // Hide callback date groups
        f.ovcDateGroup.style.display = "none";
        f.utilitiesDateGroup.style.display = "none";

        // State and postcode validation
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

        // Product selection
        f.health.addEventListener("change", function () {
            updateProductSelection(f.health);
        });

        f.ovc.addEventListener("change", function () {
            updateProductSelection(f.ovc);
        });

        f.utilities.addEventListener(
            "change", updateUtilitiesDelivery
        );

        // OVC delivery method
        f.ovcLive.addEventListener(
            "change", selectOVCLive
        );

        f.ovcCallback.addEventListener(
            "change", selectOVCCallback
        );

        // Utilities delivery method
        f.utilitiesLive.addEventListener(
            "change", selectUtilitiesLive
        );

        f.utilitiesCallback.addEventListener(
            "change", selectUtilitiesCallback
        );

        // Apply initial eligibility
        updateUtilities();

        // Load approved postcodes
        loadPostcodes();

        console.log(
            "CXone product and delivery controls initialised"
        );
    }

    setTimeout(initialise, 500);

})();


```javascript
(function () {
    "use strict";

    // ========================================================
    // CONFIGURATION
    // ========================================================

    var BASE_URL = "https://ozdemirs-hub.github.io/cxone/";

    //var STATE_FILES = {
    //    NSW: "nsw-postcodes.json",
    //    ACT: "act-postcodes.json",
    //    QLD: "qld-postcodes.json",
    //    SA: "sa-postcodes.json",
    //    VIC: "vic-postcodes.json"
    //};

    var JSON_URL =
    "https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json";

    var ALLOWED_STATES = ["NSW", "ACT", "QLD", "SA", "VIC"];

    var postcodeData = {};
    var loadingStates = {};
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
        var state = String(value || "")
            .trim()
            .toUpperCase();

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

    function postcodeIsApproved(state, postcode) {
        var list = postcodeData[state];

        if (!list) {
            return false;
        }

        for (var i = 0; i < list.length; i++) {
            if (String(list[i]).trim() === postcode) {
                return true;
            }
        }

        return false;
    }

    function loadStatePostcodes(state) {
        if (!STATE_FILES[state]) {
            return;
        }

        if (postcodeData[state] || loadingStates[state]) {
            return;
        }

        loadingStates[state] = true;

        var filename = STATE_FILES[state];

        fetch(BASE_URL + filename)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(
                        filename + " HTTP " + response.status
                    );
                }

                return response.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) {
                    throw new Error(
                        filename + " must contain an array"
                    );
                }

                postcodeData[state] = data;

                console.log(
                    "Loaded " + filename +
                    " - " + data.length + " postcodes"
                );
            })
            .catch(function (error) {
                console.error(
                    "Postcode loading error:",
                    error.message
                );
            })
            .then(function () {
                delete loadingStates[state];
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

        var eligible = false;

        // NT, TAS and WA are always prohibited.
        // Unknown states are also prohibited.
        if (STATE_FILES[state]) {

            if (!postcodeData[state]) {
                loadStatePostcodes(state);
            } else if (
                postcodeIsApproved(state, postcode)
            ) {
                eligible = true;
            }
        }

        f.utilities.disabled = !eligible;

        if (!eligible) {
            f.utilities.checked = false;
        }

        updateUtilitiesDelivery();
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

        if (!f.ovcDelivery || !f.ovc) {
            return;
        }

        if (f.ovc.checked) {
            f.ovcDelivery.style.display = "block";
        } else {
            f.ovcDelivery.style.display = "none";

            f.ovcLive.checked = false;
            f.ovcCallback.checked = false;
        }

        updateOVCCallback();
    }

    function updateOVCCallback() {
        var f = getFields();

        var show = f.ovc.checked &&
                   f.ovcCallback.checked;

        f.ovcDateGroup.style.display =
            show ? "block" : "none";

        if (!show) {
            clearCallbackDate(f.ovcDate);
        }
    }

    function selectOVCLive() {
        var f = getFields();

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

        if (!f.utilitiesDelivery || !f.utilities) {
            return;
        }

        var selected =
            f.utilities.checked &&
            !f.utilities.disabled;

        if (selected) {
            f.utilitiesDelivery.style.display = "block";
        } else {
            f.utilitiesDelivery.style.display = "none";

            f.utilitiesLive.checked = false;
            f.utilitiesCallback.checked = false;
        }

        updateUtilitiesCallback();
    }

    function updateUtilitiesCallback() {
        var f = getFields();

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

        // Health and OVC cannot both be selected.
        if (
            changedCheckbox === f.ovc &&
            f.ovc.checked
        ) {
            f.health.checked = false;
        }

        if (
            changedCheckbox === f.health &&
            f.health.checked
        ) {
            f.ovc.checked = false;
        }

        updateOVCDelivery();
        updateUtilities();
    }

    // ========================================================
    // FLATPICKR INITIALISATION
    // ========================================================

    function initialiseCalendar(field) {
        if (!field || field._flatpickr) {
            return;
        }

        flatpickr(field, {
            enableTime: true,
            dateFormat: "Y-m-d H:i:S",
            altInput: true,
            altFormat: "d/m/Y h:i K",
            minuteIncrement: 30,
            time_24hr: false,
            minDate: "today",
            minTime: "08:00",
            maxTime: "18:00",
            allowInput: false
        });
    }

    function initialiseCalendars() {
        var f = getFields();

        if (typeof flatpickr === "undefined") {
            setTimeout(initialiseCalendars, 300);
            return;
        }

        initialiseCalendar(f.ovcDate);
        initialiseCalendar(f.utilitiesDate);
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

        // Calendars
        initialiseCalendars();

        // Apply initial eligibility
        updateUtilities();

        console.log(
            "CXone postcode and delivery controls initialised"
        );
    }

    setTimeout(initialise, 500);

})();
```

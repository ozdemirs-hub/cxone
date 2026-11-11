
(function () {
    "use strict";

    // Separate form: Utilities Callback only; OVC Live Transfer or Callback.
    var JSON_URL = "https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json";
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
            ovcLive: document.getElementById("ovc_live_transfer"),
            ovcCallback: document.getElementById("ovc_callback"),
            ovcDateGroup: document.getElementById("callback_datetime_ovc_group"),
            ovcDate: document.getElementById("callback_datetime_ovc"),
            utilitiesDelivery: document.getElementById("utilities_delivery_group"),
            utilitiesCallback: document.getElementById("utilities_callback"),
            utilitiesDateGroup: document.getElementById("callback_datetime_utilities_group"),
            utilitiesDate: document.getElementById("callback_datetime_utilities")
        };
    }

    function normaliseState(value) {
        var state = String(value || "").trim().toUpperCase();
        var map = {
            "NEW SOUTH WALES": "NSW", "AUSTRALIAN CAPITAL TERRITORY": "ACT",
            "QUEENSLAND": "QLD", "SOUTH AUSTRALIA": "SA",
            "VICTORIA": "VIC", "NORTHERN TERRITORY": "NT",
            "TASMANIA": "TAS", "WESTERN AUSTRALIA": "WA"
        };
        return map[state] || state;
    }

    function clearCallbackDate(field) {
        if (!field) return;
        if (field._flatpickr) field._flatpickr.clear();
        else field.value = "";
    }

    function refreshDelivery() {
        var f = getFields();
        var utilitiesSelected = f.utilities.checked && !f.utilities.disabled;
        var ovcSelected = f.ovc.checked;
        var healthUtilities = f.health.checked && utilitiesSelected;

        f.healthDelivery.style.display = healthUtilities ? "block" : "none";
        f.healthLive.checked = healthUtilities;

        f.ovcDelivery.style.display = ovcSelected ? "block" : "none";
        if (!ovcSelected) {
            f.ovcLive.checked = false;
            f.ovcCallback.checked = false;
        } else if (!f.ovcLive.checked && !f.ovcCallback.checked) {
            f.ovcCallback.checked = true;
        }

        // Both OVC options remain available, including with Utilities.
        var showOVCDate = ovcSelected && f.ovcCallback.checked;
        f.ovcDateGroup.style.display = showOVCDate ? "block" : "none";
        if (!showOVCDate) clearCallbackDate(f.ovcDate);

        f.utilitiesDelivery.style.display = utilitiesSelected ? "block" : "none";

        // Utilities Callback is its only delivery method.
        f.utilitiesCallback.checked = utilitiesSelected;

        var showUtilitiesDate = utilitiesSelected;
        f.utilitiesDateGroup.style.display = showUtilitiesDate ? "block" : "none";
        if (!showUtilitiesDate) clearCallbackDate(f.utilitiesDate);
    }

    function updateUtilities() {
        var f = getFields();
        var state = normaliseState(f.state.value);
        var postcode = String(f.postcode.value || "").trim();

        var eligible = ALLOWED_STATES.indexOf(state) !== -1 &&
            postcodesLoaded && /^[0-9]{4}$/.test(postcode) &&
            approvedPostcodes.indexOf(postcode) !== -1;

        f.utilities.disabled = !eligible;

        if (!eligible) f.utilities.checked = false;

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
                    throw new Error("Postcode JSON HTTP " + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) {
                    throw new Error("Postcode JSON must be an array");
                }

                approvedPostcodes = data.map(function (item) {
                    return String(item).trim();
                });

                postcodesLoaded = true;
                updateUtilities();
            })
            .catch(function (error) {
                console.error("Postcode loading error:", error);
                postcodesLoaded = false;
                approvedPostcodes = [];
                updateUtilities();
            });
    }

    function productChanged(changed) {
        var f = getFields();

        if (changed === f.health && f.health.checked) {
            f.ovc.checked = false;
        }

        if (changed === f.ovc && f.ovc.checked) {
            f.health.checked = false;
        }

        refreshDelivery();
    }

    function initialise() {
        var f = getFields();

        var required = [
            f.state, f.postcode, f.health, f.ovc, f.utilities,
            f.healthDelivery, f.healthLive,
            f.ovcDelivery, f.ovcLive, f.ovcCallback,
            f.ovcDateGroup, f.ovcDate,
            f.utilitiesDelivery, f.utilitiesCallback,
            f.utilitiesDateGroup, f.utilitiesDate
        ];

        if (required.some(function (element) {
            return !element;
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
        f.ovcLive.checked = false;
        f.ovcCallback.checked = false;
        f.utilitiesCallback.checked = false;

        f.state.addEventListener("input", updateUtilities);
        f.state.addEventListener("change", updateUtilities);
        f.postcode.addEventListener("input", updateUtilities);
        f.postcode.addEventListener("change", updateUtilities);

        f.health.addEventListener("change", function () {
            productChanged(f.health);
        });

        f.ovc.addEventListener("change", function () {
            productChanged(f.ovc);
        });

        f.utilities.addEventListener("change", refreshDelivery);
        f.ovcLive.addEventListener("change", refreshDelivery);
        f.ovcCallback.addEventListener("change", refreshDelivery);
        f.utilitiesCallback.addEventListener("change", refreshDelivery);

        refreshDelivery();
        updateUtilities();
        loadPostcodes();

        console.log("CXone Utilities Callback-only form initialised");
    }

    setTimeout(initialise, 500);
})();

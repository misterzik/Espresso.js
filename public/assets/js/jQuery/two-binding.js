/*
 * Vimedev.com Labs
 * ----------------
 * jQuery Placebo Effect of 2 Way Binding
 * Functionality.
 */

$(document).ready(function() {
    const _fName = "Two";
    const _lName = "Way";

    function updateFullName() {
        const fullName = $("#firstName").val() + " " + $("#lastName").val();
        $("#fullName").text(fullName);
    }

    $("#firstName").val(_fName);
    $("#lastName").val(_lName);

    $("#firstName, #lastName").keyup(() => {
        updateFullName();
    });

    updateFullName();
});
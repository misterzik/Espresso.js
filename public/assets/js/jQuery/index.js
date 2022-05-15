/*
 * Vimedev.com Labs
 * ----------------
 * jQuery Unminified File
 */

$(document).ready(function () {
  console.log("EspressoJS is ready to be modified!");
  /*
   * Vimedev.com Labs
   * ----------------
   *  Placeholder Code
   *  /\/\isterzik
   */
  const _firstName = "Two";
  const _lastName = "Way";

  function updateFullName() {
    const fullName = $("#firstName").val() + " " + $("#lastName").val();
    $("#fullName").text(fullName);
  }

  $("#firstName").val(_firstName);
  $("#lastName").val(_lastName);

  $("#firstName, #lastName").keyup(() => {
    updateFullName();
  });

  updateFullName();
});

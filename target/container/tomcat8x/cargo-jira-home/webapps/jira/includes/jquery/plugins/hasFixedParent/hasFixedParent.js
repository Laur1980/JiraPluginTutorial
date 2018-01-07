(function (jQuery) {
    /**
     * Utility method to see if any of the elements parents are fixed positioned
     * @returns {boolean}
     */
    jQuery.fn.hasFixedParent = function () {
        var hasFixedParent = false;
        this.parents().each(function () {
            if (jQuery(this).css("position") === "fixed") {
                hasFixedParent = this;
                return false;
            }
        });
        return hasFixedParent;
    };
})(jQuery);
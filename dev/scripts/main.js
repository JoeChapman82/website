(function() {
    "use strict";
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    if(document.getElementById('openMobileMenuButton')) {
        document.getElementById('openMobileMenuButton').addEventListener('click', openIngameMenu);
        document.getElementById('mobileMenuCloseButton').addEventListener('click', closeIngameMenu);
        document.addEventListener('click', shouldCloseIngameMenu, true);
    }

    function openIngameMenu() {
        document.getElementById('mobileMenu').classList.add('mobile-menu-visible');
        document.getElementById('mobileMenu').setAttribute("aria-expanded", "true");
    }

    function closeIngameMenu() {
        document.getElementById('mobileMenu').classList.remove('mobile-menu-visible');
        document.getElementById('mobileMenu').setAttribute("aria-expanded", "false");
    }

    function shouldCloseIngameMenu(e) {
        return !document.getElementById('mobileMenu').contains(e.target) ? closeIngameMenu() : false;
    }

    function isInPage(node) {
        return document.getElementById('mobileMenu').contains(node);
    }

})();

(function() {
    "use strict";

    if(document.getElementById('aboutToggle')) {
        document.getElementById('aboutToggle').addEventListener('change', toggleTheme);
    }

    function toggleTheme() {
        if(this.checked) {
            document.getElementById('mainWrapper').classList.add('about-dark');
            document.getElementById('mainWrapper').classList.remove('about-light');
            document.getElementById('body').classList.remove('about-light-body');
        } else {
            document.getElementById('mainWrapper').classList.remove('about-dark');
            document.getElementById('mainWrapper').classList.add('about-light');
            document.getElementById('body').classList.add('about-light-body');
        }
    }

    if(document.getElementById('printButton')) {
        document.getElementById('printButton').addEventListener('click', print);
    }

    function print() {
        window.print();
    }


}());

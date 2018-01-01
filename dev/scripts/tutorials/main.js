(function() {
document.querySelectorAll('.full-code-selector').forEach(function(button) {
    button.addEventListener('click', changeDisplayedCode);
});

function changeDisplayedCode() {
    document.querySelectorAll('.full-code-selector').forEach(function(button) {
        button.classList.remove('active-code-selector');
        document.getElementById(button.dataset.display).classList.add('js-hidden');
    });
    document.getElementById(this.dataset.display).classList.remove('js-hidden');
    this.classList.add('active-code-selector');
}

}());

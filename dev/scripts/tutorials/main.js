document.querySelectorAll('.full-code-selector').forEach(function(button) {
    button.addEventListener('click', changeDisplayedCode);
});

function changeDisplayedCode() {
    document.querySelectorAll('.full-code-selector').forEach(function(button) {
        document.getElementById(button.dataset.display).classList.add('js-hidden');
    });
    document.getElementById(this.dataset.display).classList.remove('js-hidden');
}

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.services-dropdown')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var dropdown = dropdowns[i];
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }
    });
});

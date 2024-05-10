let inputs = document.querySelectorAll('.name_input');
if (inputs.length > 0) {
    inputs.forEach(function(input) {
        let altText = input.getAttribute('alt');

        if (altText === 'name') {
            input.value = 'John';
        } else if (altText === 'surname') {
            input.value = 'Doe';
        }
    });
}

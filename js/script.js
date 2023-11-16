$('.select-country').click(() => {
    $('.fa-caret-down').toggleClass('rotateArrow');
    $('.dropDown').slideToggle(300);
})

$.ajax({
    type: "GET",
    url: "https://flagcdn.com/en/codes.json",
    success: function (response) {
        let keys = Object.keys(response);
        keys.forEach(singleCountry => {
            let createOption = document.createElement('li')
            let img = document.createElement('img');
            singleCountry = singleCountry.split('-');

            if(singleCountry.length === 2 ||singleCountry[0] === "eu" || singleCountry[0] === 'un'){
                return
            }else{
                $(createOption).html(`${response[singleCountry[0]]}`);
                $(img).attr('src', `https://countryflagsapi.netlify.app/flag/${singleCountry[0]}.svg`)
                        .addClass('country-flag')        
                        .appendTo(createOption);

                $('.dropDown ol').append(createOption)
            }

        })
        $("#all-contry").change(function (e) { 
            let contry = $(this).val()
                                .split("-")  
            $('.country-flag').attr('src', `https://flagsapi.com/${contry[1].toUpperCase()}/flat/64.png`)           
        });
    }
});
$('.dropDown ol').click(function(event) {
    let thisElemnet = event.target;
    
    if($(thisElemnet).hasClass('country-flag')){
        thisElemnet = thisElemnet.closest('li');
    };

    let clone = $(thisElemnet).clone();
    $('.select-country').html(`<i class="fa-solid fa-caret-down"></i>`)
                        .prepend(clone);
    $('.dropDown').slideToggle();
    
    $.ajax({
        type: 'GET',
        url: 'https://countriesnow.space/api/v0.1/countries',
        success: (response) => {
            let data = response.data;

            let contryValue = $('.select-country li').text();
            let findCountry = data.find(singleElement => singleElement['country'] === contryValue);
            let citys = findCountry.cities
            $('#searchLocation').val("");
                $('.search-list').html("")
    
                $('#searchLocation').on('input', function(){
                    let inputValue = $(this).val().split(' ')
                    inputValue = inputValue.map(singleElemnet => singleElemnet[0].toUpperCase() + singleElemnet.slice(1).toLowerCase()).join(" ")
    
                    let filterCity = citys.filter(singleCity => singleCity.includes(inputValue))
                    if(filterCity.length > 0){
                        filterCity = filterCity.slice(0, 5);
                        $('.search-list').html("")
                        filterCity.forEach(singleElement => {
                            let listItem = `<li>${singleElement}</li>`;
                            $('.search-list').append(listItem)
                        })
    
                    }
                })
        }
    })
});

$('.search-list').click((event) => {
    let city = event.target;
    $('#searchLocation').val($(city).text());
    $('.search-list').text("")
})



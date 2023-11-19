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
        setTimeout(() => {
            $.busyLoadFull("hide");
        }, 2000)
    }
})
$("body").busyLoad("show", { spinner: "circles", background: 'var(--blue-light)'});
$('.dropDown ol').click(function(event) {
    if($('.search-bar > p').length === 1){
        $('.search-bar > p').remove();
    }
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
            
            $('.searchLocation').val("");
            $('.search-list').html("")

                $('.searchLocation').on('input', function(){
                    let inputValue = $(this).val();

                    inputValue.length === 0 ? $('.search-list').hide() : $('.search-list').show();

                    inputValue = inputValue.split(' ')
                                            .map(singleElemnet => singleElemnet[0].toUpperCase() + singleElemnet.slice(1).toLowerCase())
                                            .join(" ")
                                            
    
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


$('.search-list').click(eventAndreturnCityName)

function eventAndreturnCityName(event){
    let city = event.target;
    $('.searchLocation').val($(city).text());
    $('.search-list').text("");

}


$('.submitBtn').click(() => {
    // Validation
    if($('.select-country').text().includes('Select Country')){
        if($('.input').prev().length !== 1){
            $('.search-bar').prepend('<p>must select a country</p>');
            $('.search-bar > p').addClass('animate__animated animate__shakeX');
        }
    }else if($('.searchLocation').val().length === 0){
        $('.search-bar').prepend('<p>must write the name of city</p>');
            $('.search-bar > p').addClass('animate__animated animate__shakeX');
    }else{
        if($('.search-bar > p').length === 1){
            $('.search-bar > p').remove();
        }
        let searchCity = $('.searchLocation').val()
        searchCity = searchCity.split(' ')
                                .map(singleElemnet => singleElemnet[0].toUpperCase() + singleElemnet.slice(1).toLowerCase())
                                .join(" ")

        
        $.ajax({
            type: 'GET',
            url: 'http://api.weatherapi.com/v1/forecast.json',
            data: {
                key: '78b424624d9c4ee2a9f75055231211',
                q: searchCity,
                days: '5',
                aqi: 'no',
                alerts: 'no'
            },
            success: (response) => {

                // add flag
                $.ajax({
                    type: "GET",
                    url: "https://flagcdn.com/en/codes.json",
                    success: function (allcountrys) {
                        let countryCode = Object.keys(allcountrys);
                        countryCode.forEach(singleCountry => {
                            if(response.location.country.includes(allcountrys[singleCountry])){
                                // add flag
                                $('.nameCuntryAndCity img').attr({
                                    src: `https://countryflagsapi.netlify.app/flag/${singleCountry.toUpperCase()}.svg`, 
                                    title: $('.select-country li').text()
                                })
                                                            
                            }

                        })
                    }
                });
                let prognoseAllDay = response.forecast.forecastday;                    
                
                let allDayInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let allMounth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                
                prognoseAllDay.forEach((singleDay, index) => {
                    let date = new Date(singleDay.date);
                    if(index === 0){
                        $('.date p').text(`${allDayInWeek[date.getDay()]}, ${allMounth[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`)
                    }
                    console.log($('.day-name').eq(index).text(allDayInWeek[date.getDay()]))
                })

                // add time
                let localTime = response.location.localtime;
                localTime = localTime.split(' ');
                $('.time').text(localTime[1]);

                // add courrend forcast
                let currentForecast = response.current.condition.text;
                $('.MaxAndMinTemp p:last').text(currentForecast)


                // add Temperature
                let temperature = response.current.temp_c;  
                $('.temp h3').html(`${Math.round(temperature)}&deg;c`);

                // add max and min temp
                let maxTemp = prognoseAllDay[0].day.maxtemp_c;
                let minTemp = prognoseAllDay[0].day.mintemp_c;

                $('.MaxAndMinTemp p:first').html(`${Math.round(maxTemp)}&deg;c / ${Math.round(minTemp)}&deg;c`);
                

                // add name city and county
                $('.nameCuntryAndCity p').text(`${response.location.name}/${response.location.country}`);
               

                $('.busca').hide()
                $('body').css('background', 'var(--gray-900)')
                $('.Dash').css({display: 'flex'})

                $('.Card').addClass('fadeInRight')
                $('.detals, .days').addClass(" animate__fadeIn")
            }
        })
    }
});

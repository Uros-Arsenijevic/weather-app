$.ajax({
    type: "GET",
    url: "https://flagcdn.com/en/codes.json",
    success: function (response) {
        let keys = Object.keys(response);
        keys.forEach(singleCountry => {
            let createOption = document.createElement("option");
            $(createOption).attr("value", `${response[singleCountry]}-${singleCountry}`)
                            .html(`${response[singleCountry]}`)
                            .appendTo('#all-contry');
        })
        $("#all-contry").change(function (e) { 
            let contry = $(this).val()
                                .split("-")  
            $('.country-flag').attr('src', `https://flagsapi.com/${contry[1].toUpperCase()}/flat/64.png`)           
        });
    }
});
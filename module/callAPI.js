export function callApi(method, URL){
  return new Promise((resolve, reject) => {
    $.ajax({
      type: `${method}`,
      url: `${URL}`,
      success: function (response) {
        response
        resolve(response);
      },
      error: (error) => {
        reject('desila se greska')
      }
    });
  })
}

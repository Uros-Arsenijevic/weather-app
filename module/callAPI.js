export function callApi(method, URL, data = null){
  return new Promise((resolve, reject) => {
    $.ajax({
      type: `${method}`,
      url: `${URL}`,
      data: data,
      success: function (response) {
        resolve(response);
      },
      error: (error) => {
        reject('Error')
      }
    });
  })
}

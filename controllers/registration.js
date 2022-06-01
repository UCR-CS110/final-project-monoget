// Controller handler to handle functionality in home page

// Example for handle a get request at '/' endpoint.


function getRegistration(request, response){
  // do any work you need to do, then
  response.render('registration', {title: 'Registration'});

}

module.exports = {
    getRegistration
};
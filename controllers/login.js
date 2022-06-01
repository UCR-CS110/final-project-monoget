// Controller handler to handle functionality in home page

// Example for handle a get request at '/' endpoint.


function getLogin(request, response){
    // do any work you need to do, then
    response.render('login', {title: 'Login'});
  
  }
  
  module.exports = {
      getLogin
  };
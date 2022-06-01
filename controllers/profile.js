// Controller handler to handle functionality in home page

// Example for handle a get request at '/' endpoint.


function getProfile(request, response){
    // do any work you need to do, then
    response.render('profile', {title: 'Profile Page'});
  
  }
  
  module.exports = {
      getProfile
  };
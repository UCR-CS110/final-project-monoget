// Controller handler to handle functionality in home page

// Example for handle a get request at '/' endpoint.


function getProfile(request, response){
    // do any work you need to do, then
    let username = request.params.user;
    let view = false;
    
    if (username) {
        view = true;
    }
    response.render('profile', {title: 'Profile Page', username: username, view: view});
  
  }
  
  module.exports = {
      getProfile
  };
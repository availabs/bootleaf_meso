/**
 * MesomapController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    

  allStations: function (req,res) {
    var current_user = req.param('currentUser');
    User.find()
    .where({ accessLevel: { '<': 2 }})
    .done(function(err, users){
      if (err) console.log(err);
      var output=[];
    users.forEach(function(d){
      if(d.stations && d.id != current_user){
       // console.log(d.username);
        var info = {stations:d.stations,username:d.username}
        output.push(info);
      }
    })
    res.json(output);
    }); 
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MesomapController)
   */
  _config: {}

  
};

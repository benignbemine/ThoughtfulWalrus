HomeCtrl.$inject = ['$scope', '$http', 'DistressButton', 'DataFetcher', 'GeoLocation', 'Auth']
angular.module('distress').controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, $http, DistressButton, DataFetcher, GeoLocation, Auth){
  $scope.emergencyNumber = DataFetcher.savedNumber || '';
  $scope.locationData = {};
  $scope.isLoggedIn = Auth.isAuthenticated();
  console.log($scope.isLoggedIn)

  $scope.spinner = true;
  $scope.homeContent   = false;

  //assumes that getLocation has already been run.
  //passes location and callback to DataFetcher method, sets emergencyNumber on the DOM
  //using $apply (since it's asynchronous)
  //store it to Datafetcher.savedNumber so that it persists.
  
  $scope.spinner = true;
  $scope.homeContent   = false;


  $scope.getEmergencyNumber = function(){
    var self = this;
    var location = {longitude: GeoLocation.longitude, latitude: GeoLocation.latitude};

    DataFetcher.getEmergencyNumber(location, function(emergencyNumber){
      self.$apply(function(){
        self.emergencyNumber = emergencyNumber;
        DataFetcher.savedNumber = emergencyNumber;
      });
    });

    $scope.spinner = false;
    $scope.homeContent = true;

  };

  //function which uses the GeoLocation object to grab the geolocation
  //passes lat lon and callback, sets locationData on the DOM using $apply (since it's asynchronous)
  //calls getEmergencyNumber after the location has been found
  $scope.getLocation = function(){
    var self = this;

    GeoLocation.getLocation(function(lat, lon){
      self.$apply(function(){
        self.locationData = {latitude: lat, longitude: lon};
      });
      //once we get location data, we get emergency number
      self.getEmergencyNumber();
    });
  };

  //sends distress signal when the button is clicked
  $scope.distress = function(){
    DistressButton.sendDistress();
  };

  //gets police station map
  $scope.police = function(){
    var location = {longitude: GeoLocation.longitude, latitude: GeoLocation.latitude};
    DataFetcher.getPoliceMap(location);
  };

  // initializes location and emergency number
  $scope.init = function(){
    $scope.getLocation();
  };
  $scope.init();
}

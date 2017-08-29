/**
 * Created by margdan on 23.6.2017.
 */



var mainApp=angular.module('mainApp',['ngResource','ngDialog','ui.router','ngRoute','angular.filter','ngStorage']);
mainApp.constant("baseURL", "https://ec2-34-224-218-137.compute-1.amazonaws.com:3443/");
mainApp.config(function($routeProvider) {
    $routeProvider

        .when("/", {templateUrl : "views/login.html",controller  :  "loginCtrl"})
        .when("/main", {templateUrl : "views/main.html",controller  :  "tableCtrl"})
        .when("/register", {templateUrl : "views/register.html",controller  :  "registerCtrl"})

        .when("/:client", {templateUrl : "views/client.html",controller  : "clientCtrl"})
        .when("/:client/:location", {templateUrl : "views/location.html",controller  : "locCtrl"})
        .when("/:client/:location/:serial", {templateUrl : "views/serial.html",controller  : "sNCtrl"})
        .otherwise({redirect:'/login'});
});

mainApp.controller('tableCtrl',function ($scope,$http,$interval,$location,baseURL) {
    $interval(function () {
        var url=baseURL+"home";
        console.log(url)
        $http.get(url).then( function(response) { $scope.data = response.data;},function (err) {console.log(err)});
        $scope.deleteClients=function () {
            $http.delete("https://localhost:3443/home").success(function() {console.log('Data Deleted');
            })};

       
    },500
    )});

mainApp.controller('clientCtrl',function (AuthFactory,$routeParams,$scope,$http,$interval,baseURL) {

        console.log("in client")

       var url=baseURL+"client/"+$routeParams.client;
       $http.get(url).then( function(response) {$scope.data = response.data;console.log("response",response.data)},function (err) {console.log(err)});
       $scope.deleteOneClient=function () {
           $http.delete(url).success(function() {console.log('Single Client Data Deleted');})};
       var a=$scope.data
        if($routeParams.client) {$scope.location=$routeParams.client; $scope.main='main';}
       else {$scope.location=a.client; $scope.main= ':client'}

       });

mainApp.controller('locCtrl',function ($routeParams,$scope,$http,$interval,baseURL) {
        $interval(function () {

        $scope.clientName=$routeParams.client;
        $scope.location=$routeParams.location;
        $http.get(baseURL+"client/" +$routeParams.client+"/"+$routeParams.location).then( function(response) {$scope.data = response.data;},function (err) {console.log(err)});
        $http.get(baseURL+"location/maintainance/" +$routeParams.client+"/"+$routeParams.location).then( function(response) {$scope.maint = response.data;},function (err) {console.log(err)});
            $scope.deleteClientLocation=function () {
                $http.delete(baseURL+"client/" +$routeParams.client+"/"+$routeParams.location).success(function() {console.log('Location Data Deleted');
                })};

        var nD=[];
            var dateNextNow1 =new Date();
            var dateNextNow =new Date(); var dateNow=dateNextNow.setDate(dateNextNow.getDate()+7);

           for (var i=0;i<Object.keys($scope.maint).length;i++){
            var dateNextHistory = new Date($scope.maint[i].updatedAt); var dateHistory=dateNextHistory.setDate(dateNextHistory.getDate()+90);
             if (dateNow>=dateHistory){var name=$scope.maint[i].name;var serial=$scope.maint[i].serial;var NewDate={'date':dateHistory,'name':name,'serial':serial};nD.push(NewDate)}
        }

            $scope.dd=nD;
    },500)});

mainApp.controller('sNCtrl',function ($routeParams,$scope,$http,$interval,baseURL) {
    $interval(function () {

        $scope.clientName=$routeParams.client;
        $scope.location=$routeParams.location;
        $scope.serial=$routeParams.serial;

        $http.get(baseURL+"serial/historyMaintainance/"+$routeParams.client+"/"+$routeParams.serial).then( function(response) {$scope.history = response.data; },function (err) {console.log(err)});
        $http.get(baseURL+"serial/lastUpdatedCounterValue/"+$routeParams.client+"/"+$routeParams.serial).then( function(response){$scope.counter = response.data; },function (err) {console.log(err)});
        $http.get(baseURL+"serial/lastMaintainance/"+$routeParams.client+"/"+$routeParams.serial).then( function(response) {$scope.last = response.data;},function (err) {console.log(err)});
        $scope.deleteSerial=function () {
            $http.delete(baseURL+"client/" +$routeParams.client+"/"+$routeParams.location+"/"+$routeParams.serial).success(function() {console.log('Serial Data Deleted');
            })};
        $scope.reset=function(){console.log("button pressed");console.log("in function"); var data= {'client': $routeParams.client,'location': $routeParams.location,'serial': $routeParams.serial,'name': $scope.counter.name,'counter': 0,'serviceInterval': 1000,'status':'changed'};
            $http.post(baseURL+"home", data).success(function(data, status) {console.log('Data posted successfully');
            });location.reload()};

        if($scope.counter.serviceInterval*0.8<=($scope.counter.counter || $scope.counter.counter)){$scope.warning='RED'}else{$scope.warning='GREEN'}

       var dateNext = new Date($scope.last.updatedAt);$scope.next=dateNext.setDate(dateNext.getDate()+90);
       var datePredict=new Date($scope.last.updatedAt);
        $scope.predict=datePredict.setSeconds(datePredict.getSeconds()+((($scope.counter.serviceInterval*0.8))*5));
       },500)});

mainApp.controller('timeCtrl', function($scope, $interval) {
    $scope.theTime = new Date().toLocaleTimeString();
    $interval(function () {
        $scope.theTime = new Date().toLocaleTimeString();
       }, 1000)
    });

mainApp.controller('logoutCtrl', function($scope, AuthFactory,$location) {

    $scope.logout=function () {
        AuthFactory.logout();
        $location.path('/');
    }


});

mainApp.controller('loginCtrl', ['$scope','ngDialog', '$localStorage', 'AuthFactory','$location', function ($scope, ngDialog, $localStorage, AuthFactory,$location) {
    console.log("login controller");
    $scope.loginData = $localStorage.getObject('userinfo','{}');

    var data =$localStorage.getObject('Token','{}');
    if(data.username) location.reload();

    $scope.doLogin = function() {
        if($scope.rememberMe)
            $localStorage.storeObject('userinfo',$scope.loginData);
            AuthFactory.login($scope.loginData);
                  };



}]);

mainApp.controller('registerCtrl', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory','$location', function ($scope, ngDialog, $localStorage, AuthFactory,$location) {
    console.log("EEEEEEE")
    $scope.register={};
    $scope.loginData={};

    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);
        AuthFactory.register($scope.registration);
        $location.path('/')
    };}]);

mainApp.factory('$localStorage', ['$window', function ($window) {
    return {

        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}]);

  mainApp  .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog','$location', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog,$location){

        var authFac = {};
        var TOKEN_KEY = 'Token';
        var isAuthenticated = false;
        var username = '';
        var authToken = undefined;


        function loadUserCredentials() {
            var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
            if (credentials.username !== undefined) {
                useCredentials(credentials);
            }
        }

        function storeUserCredentials(credentials) {
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }

        function useCredentials(credentials) {
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.token;

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
            if (username=="jotautomation1"){if ($location.url()==='/')  $location.path('/main'); else $location.path($location.url()); }
             else {if ($location.url()==='/')  $location.path('/:client');else $location.path($location.url());}}

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        }

        authFac.login = function(loginData) {

            $resource(baseURL + "users/login")
                .save(loginData,
                    function(response) {
                        storeUserCredentials({username:loginData.username, token: response.token});
                        $rootScope.$broadcast('login:Successful');  } );};

        authFac.logout = function() {
            $resource(baseURL + "users/logout").get(function(response){
            });
            destroyUserCredentials();
        };

        authFac.register = function(registerData) {

            $resource(baseURL + "users/register")
                .save(registerData,
                    function(response) {
                        $localStorage.storeObject('userinfo',{username:registerData.username, password:registerData.password});
                        $rootScope.$broadcast('registration:Successful');
                    });};

        authFac.isAuthenticated = function() {
            return isAuthenticated;
        };

        authFac.getUsername = function() {
            return username;
        };

        loadUserCredentials();

        return authFac;

    }])
;



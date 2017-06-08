var githubCardsApp = angular.module('githubCards', []);

githubCardsApp.controller('githubCardsController', ['$scope', '$http', function($scope, $http) {
	$scope.githubLoginName = '';
	$scope.userList = [];
	$scope.errorMsg = '';
	$scope.sortFilter = 'name';
	$scope.activeFilter = 'name';
	$scope.orderToggle = false;		//false = descending
	$scope.orderFilters = ['name', 'location', 'followers'];
	if(typeof(Storage) !== "undefined") {
		if (localStorage.userList) {
		    $scope.userList = JSON.parse(localStorage.userList);
		}
		if (localStorage.sortFilter) {
		    $scope.sortFilter = localStorage.sortFilter;
		}
		if (localStorage.activeFilter) {
			$scope.activeFilter = localStorage.activeFilter;
		}
		if (localStorage.orderToggle) {
		    $scope.orderToggle = JSON.parse(localStorage.orderToggle);
		}
	}

	$scope.removeUser = function (user, event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		var indexToBeRemoved = $scope.userList.indexOf(user);
		$scope.userList.splice(indexToBeRemoved, 1);
		if(typeof(Storage) !== "undefined") {
		    localStorage.setItem("userList", JSON.stringify($scope.userList));
		}
	};

	$scope.changeOrder = function (filter) {
		if (filter === $scope.activeFilter) {
			$scope.orderToggle = !$scope.orderToggle;
		}
		else {
			$scope.activeFilter = filter;
		}
		
		if (!$scope.orderToggle) {
			$scope.sortFilter = '-' + filter;
		}
		else {
			$scope.sortFilter = filter;
		}

		if(typeof(Storage) !== "undefined") {
			localStorage.setItem("sortFilter", $scope.sortFilter);
			localStorage.setItem("activeFilter", $scope.activeFilter);
			localStorage.setItem("orderToggle", $scope.orderToggle);
		}
	};

	$scope.getUserInfo = function () {
		if ($scope.githubLoginName) {
			var getUserData = true;
			for (var i = 0; i < $scope.userList.length; i++) {
				if ($scope.userList[i].login === $scope.githubLoginName) {
					$scope.errorMsg = 'User already exists';
					getUserData = false;
					break;
				}
			}
			if (getUserData) {
				$http({
				    method: 'GET',
				    url: 'https://api.github.com/users/' + $scope.githubLoginName
				})
				.then(function successCallback(response) {
					    $scope.userList.push(response.data);
					    if(typeof(Storage) !== "undefined") {
						    localStorage.setItem("userList", JSON.stringify($scope.userList));
						}
					    $scope.errorMsg = '';
					    $scope.githubLoginName = '';
				    },
				    function errorCallback(response) {
				  	    $scope.errorMsg = response.data.message;
			  	});
			}
		}
	};
}]);
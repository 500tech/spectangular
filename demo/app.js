angular.module('spectangularDemo', ['ngRoute', '500tech.spectangular'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/page1', {
				templateUrl: 'page1',
				controller: 'page1Ctrl',
				controllerAs: 'page1Vm'
			})
			.when('/page2', {
				templateUrl: 'page2',
				controller: 'page2Ctrl',
				controllerAs: 'page2Vm'
			});
	})
	.controller('headerCtrl', function() {
		this.title = "Shift + click on any element to view its scope"
		this.subtitle = "Tip: Click on things inside the opened window to console.log it"
	})
	.controller('page1Ctrl', function () {
		this.title = "I live in page1Vm";
		this.onClick = function () {
			alert("I'm a function");
		}
	})
	.controller('page2Ctrl', function () {
		this.title = "I live in page2Vm";
	})
	.directive('demoDirective', function () {
		return {
			template: '<div>{{directiveVm.title}}</div>',
			controllerAs: 'directiveVm',
			scope: {},
			controller: function() {
				this.title = "I live in a directive with an isolated scope";
			}
		};
	})		
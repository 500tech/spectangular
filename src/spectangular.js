/* globals angular */
'use strict';
(function () {
var body = document.body;
var windowElement;
var borderElement;
var targetElement;
var createdWindow;
var domain;
var allowedDomains = ['localhost', '127.0.0.1', 'lvh.me'];
var enabled = false;
function getDomain() {
    return window.location.host;
}

function destroyWindow() {
    if (windowElement) {
        body.removeChild(windowElement[0]);
        windowElement = null;
    }
    if (borderElement) {
        body.removeChild(borderElement[0]);
        borderElement = null
    }
}

function createStyle(css) {
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}

angular.module('500tech.spectangular', ['500tech.spectangular/views'])
// The window directive:
.directive('spectangularWindow', function ($compile) {
    return {
        templateUrl: '500tech.spectangular/spectangularWindow.html',
        scope: true,
        controllerAs: 'vm',
        link: function ($scope, element) {
            $scope.element = element;
        },
        controller: function ($scope) {
            this.fillScope = function (scope) {
                this.curScope = scope;
                this.title = "Scope " + this.curScope.$id;
                if (this.curScope.controllerName) {
                    this.curScope.title += " Controller: " + this.curScope.controllerName;
                } 
                
                this.parent = scope.$parent;
                // fill keys
                this.keys = [];
                for (var key in this.curScope) {
                    if (key.indexOf('$') === -1) {
                        this.keys.push(key);    
                    }
                }
                // fill children
                this.children = [];
                var curChild = scope.$$childHead;
                while(curChild) {
                    if (curChild !== $scope) {
                        this.children.push(curChild);
                    }
                    curChild = curChild.$$nextSibling;
                }
            };
            this.consoleLog = function (key, value) {
                console.log(key, value);
                window[key] = value;
            };
            this.showScope = function (name, scope) {
                this.consoleLog(name, scope);
                this.fillScope(scope);
            };
            this.destroyWindow = destroyWindow;
            this.fillScope($scope.$parent);
            this.consoleLog('scope', $scope.$parent);
        }
    };
})
.provider('spectangular', function () {
    this.enable = function () {
        enabled = true;
    };
    this.disable = function () {
        enabled = false;
    };
    this.domain = function (domain) {
        allowedDomains.push(domain);
    };
})
.run(function ($compile, $provide) {
    domain = getDomain();
    if (allowedDomains.indexOf(domain) !== -1) {
        enabled = true;
    }
    // Create style:
    createStyle('\
        .spectangular-window {background: rgba(0,0,0,0.8);position: fixed;left: 20%; right: 20%; top: 10%; bottom: 10%; color: white;z-index: 10000;border-radius: 7px;margin: 5px;padding: 8px 15px;; font-size: 16px}\n \
        .spectangular-window button {transition: background-color 300ms ease-out;background: none;border-radius: 7px;margin: 5px; padding: 8px 15px;border: 1px solid #DDD; font-size: 16px}\n \
        .spectangular-window button:hover {background: rgba(0,100,100,0.5);}\n \
        .spectangular-window div {color: white;; font-size: 16px}\n \
        .spectangular-window h1 {text-align: center;color: white; font-size: 24px}\n \
        .spectangular-window h2 {color: white; font-size: 20px; padding: 10px 0}\n \
        .spectangular-window section {margin-top: 10px}\n \
        .spectangular-window a {transition: color 300ms ease-out;color: white;margin: 5px;padding: 8px 15px;cursor:pointer; font-size: 16px}\n \
        .spectangular-window a:hover {color: #9FF;}\n \
        .spectangular-window .spectangular-main {overflow:auto;position: absolute; top: 80px; bottom: 20px; left: 20px; right: 20px}\n \
        .spectangular-border {position: fixed;z-index: 9999;border-radius: 2px;border: 3px solid red}\n \
    ');
        
    // add event listener to body:
    function createWindow($scope) {
        windowElement = '<div spectangular-window class="spectangular-window"></div>';
        windowElement = $compile(windowElement)($scope);
        body.appendChild(windowElement[0]);
        if (!$scope.$$phase) $scope.$apply();
    }
    function createBorderElement(targetElement) {
        var left = targetElement.offset().left;
        var top = targetElement.offset().top;
        var width = targetElement.width();
        var height = targetElement.height();
        borderElement = angular.element('<div class="spectangular-border" style="width:' + width + 'px;height:' + height + 'px;top:' + top + 'px;left:' + left + 'px;"></div>');
        body.appendChild(borderElement[0]);
    }

    body.addEventListener('click', function (e) {
        if (!e.shiftKey) {return true};
        e.preventDefault();e.stopPropagation();
        destroyWindow();
        targetElement = angular.element(e.target);
        createWindow(targetElement.scope());
        createBorderElement(targetElement);
    }, true);

    // decorate $controller:
    $provide.decorator('$controller', [
        '$delegate',
        function ($delegate) {
            return function (expression, locals, later, ident) {
                if (typeof expression == "string" && locals.$scope) {
                    locals.$scope.controllerName = expression;
                }
                return $delegate(expression, locals, later, ident);
            }
        }]);
}]);
// Views module:
  angular.module("500tech.spectangular/views", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("500tech.spectangular/spectangularWindow.html",
        '<div class="spectangularWindow">\n \
            <a ng-click="vm.consoleLog(\'scope\', vm.curScope)"><h1>{{vm.title}}</h1></a>\n \
            <a style="position:absolute;top:0;right:0" ng-click="vm.destroyWindow()">X</a>\n \
            <div class="spectangular-main">\n \
                <button ng-click="vm.showScope(\'parent\', vm.parent)" ng-if="vm.parent">Parent {{vm.parent.$id}} <span ng-if="vm.parent.controllerName"> Controller: {{vm.parent.controllerName}}</span></button>\n \
                <section ng-if="vm.keys"><h2>Keys</h2>\n \
                    <a ng-repeat="key in vm.keys" ng-click="vm.consoleLog(key, vm.curScope[key])" style="margin: 4px 10px">{{key}}</a>\n \
                </section>\n \
                <section ng-if="vm.children"><h2>Children</h2>\n \
                    <button ng-repeat="child in vm.children track by child.$id" ng-click="vm.showScope(\'child\', child)">Child ({{child.controllerName}})</button>\n \
                </section>\n \
            </div>\n \
        </div>\n '
      );

  }]);

})(angular);



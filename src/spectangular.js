/* globals angular */
'use strict';
(function () {
var body;
var windowElement;
var borderElement;
var targetElement;
var createdWindow;
var domain;
var allowedDomains = ['localhost', '127.0.0.1', 'lvh.me'];
var enabled = false;
var curScope;
var $compile;
function getDomain() {
    return window.location.hostname;
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

function init() {
    body = document.body;
    // Create style:
    createStyle('\
        .spectangular-window {background: rgba(0,150,200,0.95);box-shadow: 1px 2px 2px 2px rgba(0,0,0,0.5);position: fixed;left: 10%; right: 10%; top: 10%; bottom: 10%; color: lavenderblush;z-index: 10000;border-radius: 7px;margin: 5px;padding: 8px 15px; font-size: 16px}\n \
        .spectangular-window button {cursor: pointer; color: lavenderblush;transition: background-color 300ms ease-out;background: none;border-radius: 7px;margin: 5px; border: 1px solid #DDD; font-size: 16px}\n \
        .spectangular-window button:hover {background: rgba(0,100,100,0.5);}\n \
        .spectangular-window div {color: lavenderblush;; font-size: 16px}\n \
        .spectangular-window h1 {text-align: center;color: lavenderblush; font-size: 24px}\n \
        .spectangular-window h2 {color: lavenderblush; font-size: 20px; margin: 10px 0 10px 0;padding: 0}\n \
        .spectangular-window section {border-top: 1px solid white;padding-bottom: 15px}\n \
        .spectangular-window a {display: inline-block;white-space: nowrap;transition: color 300ms ease-out;color: lavenderblush;cursor:pointer; font-size: 16px}\n \
        .spectangular-window a:hover {color: #F72;}\n \
        .spectangular-window .spectangular-main {overflow:auto;position: absolute; top: 44px; bottom: 20px; left: 16px; right: 20px}\n \
        .spectangular-border {position: fixed;z-index: 9999;border-radius: 2px;border: 3px solid red}\n \
    ');

    createStyle('\
        .spectangular-show {\n \
            cursor: pointer;\n \
            width:            15px;\n \
            height:           15px;\n \
            background-image: url(\'data:image/png;base64,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\');\n \
            background-size: cover;\n \
            display: inline-block;\n \
        }\n \
    ');
        
    // add event listener to body:
    function createWindow() {
        var curScope = angular.element(targetElement).scope();
        windowElement = '<div spectangular-window class="spectangular-window"></div>';
        windowElement = $compile(windowElement)(curScope);
        body.appendChild(windowElement[0]);
        if (!curScope.$$phase) curScope.$apply();
    }
    function createBorderElement() {
        var bounds = targetElement.getBoundingClientRect();
        var left = bounds.left - 5;
        var top = bounds.top - 5;
        var width = bounds.width + 10;
        var height = bounds.height + 10;
        borderElement = angular.element('<div class="spectangular-border" style="width:' + width + 'px;height:' + height + 'px;top:' + top + 'px;left:' + left + 'px;"></div>');
        body.appendChild(borderElement[0]);
    }

    body.addEventListener('click', function (e) {
        if (!e.shiftKey) {return true};
        e.preventDefault();e.stopPropagation();
        destroyWindow();
        targetElement = e.target;
        createWindow();
        createBorderElement();
    }, true);
}

angular.module('500tech.spectangular', ['500tech.spectangular/views'])
// The window directive:
.directive('spectangularWindow', function ($compile, $rootScope) {
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
                this.title = this.getScopeTitle(this.curScope);

                this.parent = scope.$parent;
                // fill keys
                this.keys = [];
                for (var key in this.curScope) {
                    if (key.indexOf('$') === -1 &&
                        key !== "__spectangular_controllerName_" &&
                        key !== "constructor") {
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
            this.getScopeTitle = function (scope) {
                if ($rootScope === scope) {
                    return "$rootScope";
                }
                var result = "$scope " + scope.$id;
                if (scope.__spectangular_controllerName_) {
                    result += " Controller: " + scope.__spectangular_controllerName_;
                } 
                return result;
            };

            this.consoleLog = function (key, value) {
                console.log("---------------------------------------\n",
                    key, ":\n", value, "\n");
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
        if (getDomain() === domain) {
            init();
        }
    };
    this.$get = function () {

    }
})
.run(function (_$compile_) {
    $compile = _$compile_;
    if (!enabled) return;
    init();
})
.config(function ($provide) {
    domain = getDomain();
    if (allowedDomains.indexOf(domain) === -1) {
        return;
    }
    enabled = true;
    // decorate $controller:
    $provide.decorator('$controller', [
        '$delegate',
        function ($delegate) {
            return function (expression, locals, later, ident) {
                if (typeof expression == "string" && locals.$scope) {
                    locals.$scope.__spectangular_controllerName_ = expression;
                }
                if (typeof expression == "function" && ident) {
                    locals.$scope.__spectangular_controllerName_ = ident;
                }
                return $delegate(expression, locals, later, ident);
            }
        }
    ]);
});

// Views module:
  angular.module("500tech.spectangular/views", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("500tech.spectangular/spectangularWindow.html",
        '<div class="spectangularWindow">\n \
            <h2><a ng-click="vm.consoleLog(\'scope\', vm.curScope)">{{vm.title}}</a></h2>\n \
            <a style="position:absolute;top:4px;right:6px" ng-click="vm.destroyWindow()">X</a>\n \
            <div class="spectangular-main">\n \
                <h2 ng-if="vm.parent">\n \
                    <a ng-click="vm.consoleLog(\'parent\', vm.parent)">Parent: {{vm.getScopeTitle(vm.parent)}}</a>\n \
                    <a class="spectangular-show" ng-click="vm.showScope(\'parent\', vm.parent)"></a>\n \
                </h2>\n \
                <section ng-if="vm.keys"><h2>Attributes:</h2>\n \
                    <a  ng-repeat="key in vm.keys"\n \
                        ng-click="vm.consoleLog(key, vm.curScope[key])"\n \
                        style="display: inline-block; min-width: 50%;margin: 4px 0">{{key}}\n \
                    </a>\n \
                </section>\n \
                <section ng-if="vm.children"><h2>Children</h2>\n \
                    <div ng-repeat="child in vm.children track by child.$id" style="display: inline-block; min-width: 50%">\n \
                        <a ng-click="vm.consoleLog(\'child\', child)">{{vm.getScopeTitle(child)}}</a>\n \
                        <a class="spectangular-show" ng-click="vm.showScope(\'child\', child)"></a>\n \
                    </div>\n \
                </section>\n \
            </div>\n \
        </div>\n '
      );

  }]);

})(angular);



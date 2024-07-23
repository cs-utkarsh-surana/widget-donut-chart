/* Copyright start
  Copyright (C) 2008 - 2024 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
  'use strict';
  (function () {
      angular
          .module('cybersponse')
          .controller('editD3Library100Ctrl', editD3Library100Ctrl);
  
      editD3Library100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout', 'appModulesService', 'Entity'];
  
      function editD3Library100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout, appModulesService, Entity) {
          $scope.cancel = cancel;
          $scope.save = save;
          $scope.config = config;
          $scope.loadAttributes = loadAttributes;
  
          function loadAttributes() {
            $scope.fields = [];
            $scope.fieldsArray = [];
            $scope.pickListFields = [];
            var entity = new Entity($scope.config.module);
            entity.loadFields().then(function () {
              for (var key in entity.fields) {
                if (entity.fields[key].type === "picklist") {
                  $scope.pickListFields.push(entity.fields[key]);
                }
              }
              $scope.fields = entity.getFormFields();
              angular.extend($scope.fields, entity.getRelationshipFields());
              $scope.fieldsArray = entity.getFormFieldsArray();
            });
          }
  
          function _handleTranslations() {
            let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);
            
            if (widgetNameVersion) {
              widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
                $scope.viewWidgetVars = {
                  // Create your translating static string variables here
                };
              });
            } else {
              $timeout(function() {
                $scope.cancel();
              });
            }
          }
  
          function init() {
              // To handle backward compatibility for widget
              _handleTranslations();
              $scope.query = { direction: 'ASC' };
              $scope.config = {};
              angular.extend($scope.config, config);
              $scope.pageConfig = {
                maxRecordSize: [5, 10, 15, 20],
              };
              appModulesService.load(true).then(function (modules) {
                $scope.modules = modules;
                if ($scope.config.module) {
                  loadAttributes();
                }
              });
          }
  
          init();
  
          function cancel() {
              $uibModalInstance.dismiss('cancel');
          }
  
          function save() {
            if ($scope.editWidgetForm.$invalid) {
              $scope.editWidgetForm.$setTouched();
              $scope.editWidgetForm.$focusOnFirstError();
              return;
            }
              $uibModalInstance.close($scope.config);
          }
  
      }
  })();

  
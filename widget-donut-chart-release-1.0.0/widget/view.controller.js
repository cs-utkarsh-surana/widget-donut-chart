/* Copyright start
Copyright (C) 2008 - 2024 Fortinet Inc.
All rights reserved.
FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('d3Library100Ctrl', d3Library100Ctrl);

  d3Library100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$q', '$resource', 'API', 'Query', '$http'];

  function d3Library100Ctrl($scope, widgetUtilityService, $q, $resource, API, Query, $http) {
    var data = [];
    // Load External JS Files
    function loadJs(filePath) {
      var fileLoadDefer = $q.defer();
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = filePath;
      document.getElementsByTagName('head')[0].appendChild(script);
      script.onload = function () {
        fileLoadDefer.resolve();
      }
      return fileLoadDefer.promise;
    }

    loadJs('https://cdnjs.cloudflare.com/ajax/libs/d3-sankey/0.12.3/d3-sankey.min.js').then(function () {
      createD3Charts();
    });

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {

        };
      });

    }

    function setdata() {
      const width = 400,
        height = 400,
        radius = Math.min(width, height) / 2;

      const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(d3.schemeCategory10);

      const pie = d3.pie()
        .value(d => d.value);

      const arc = d3.arc()
        .innerRadius(radius * 0.5)  // Setting inner radius to create the donut chart
        .outerRadius(radius);

      svg.selectAll('pieces')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", function(event, d) {
          const percentage = (d.data.value / d3.sum(data, d => d.value) * 100).toFixed(2) + '%';
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(percentage)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });

      svg.selectAll('labels')
        .data(pie(data))
        .enter()
        .append('text')
        .text(d => d.data.label)
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 15);
    }

    function createD3Charts() {
      
      var query = new Query();
      var lowcount = 0;
      var mediumcount = 0;
      var highcount = 0;
      var criticalcount = 0;

      
      var queryObject = {
        sort: [{
            field: 'total',
            direction: 'DESC'
        }],
        aggregates: [
            {
                'operator': 'countdistinct',
                'field': '*',
                'alias': 'total'
            },
            {
                'operator': 'groupby',
                'alias': $scope.config.moduleTitle,
                'field': $scope.config.moduleTitle+'.itemValue'
            }
        ]
    };
      var _queryObj = new Query(queryObject);
      $http.post(API.QUERY + $scope.config.module, _queryObj.getQuery(true)).then(function (response) {
        let result = response.data['hydra:member'];
        let moduleTitle = $scope.config.moduleTitle
        angular.forEach(result, function (record) {
          let data_dict = {
            label: record[moduleTitle], value: record['total']
          }
          data.push(data_dict)
         
          
        });
        console.log(data);
        setdata();

    }, function (error) {
        defer.reject(error);
    });



    }

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    init();
  }
})();

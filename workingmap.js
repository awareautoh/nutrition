 /*
        TODO:
        - Check data labels after drilling. Label rank? New positions?
        */

        let data = Highcharts.geojson(Highcharts.maps['countries/la/la-all']);
        const separators = Highcharts.geojson(Highcharts.maps['countries/la/la-all'], 'mapline');

        const getJSON = async url => {
          const response = await fetch(url);
          return response.json(); // get JSON from the response 
     }

     getJSON("https://raw.githubusercontent.com/awareautoh/nutrition/main/pdata.json")
     .then(data12 => { 
         pvdata1 = data12; 


         data.forEach((d, i) => {
             d.drilldown = d.properties['ADM1_EN'];
          	      // d.value = pvdata['value'] // Non-random bogus data
          	      // console.log(d.value);
             });


         function getScript(url, cb) {
             const script = document.createElement('script');
             script.src = url;
             script.onload = cb;
             document.head.appendChild(script);
        }

          	  // Instantiate the map
          	  Highcharts.mapChart('container', {
                  chart: {
                   events: {
                    drilldown: function (e) {
                     if (!e.seriesOptions) {
                      const chart = this,
                      mapKey = e.point.drilldown + '-all';

          	                      // Handle error, the timeout is cleared on success
          	                      let fail = setTimeout(() => {
                                      if (!Highcharts.maps[mapKey]) {
                                       chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);
                                       fail = setTimeout(() => {
                                        chart.hideLoading();
                                   }, 1000);
                                  }
                             }, 3000);
          	                      console.log(mapKey);
          	                      // Show the spinner
          	                      chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

          	                      // Load the drilldown map
          	                      getScript('mapjs/'+mapKey + '.js', () => {
                                      mdata = Highcharts.geojson(Highcharts.maps[mapKey]);

                                      var url = 'https://raw.githubusercontent.com/awareautoh/nutrition/main/datafinal.json';
                                      Highcharts.getJSON(url,function(data2){
                                          dvalue = data2;
          	                          	//console.log(data2);
          	                          	//Hide loading and add series
          	                          	chart.hideLoading();
          	                          	clearTimeout(fail);
          	                          	chart.addSeriesAsDrilldown(e.point, {
                                                name: e.point.properties.ADM1_EN,
                                                data: data2,
                                                joinBy:['ADM2_PCODE','ADM2_PCODE'],
                                                mapData:mdata,
                                                dataLabels: {
                                                 enabled: true,
                                                 format: '{point.properties.ADM2_EN}'
                                            },
          	                          	    //  tooltip: {
          	                          	    //   formatter: function() {
          	                          	    //     return 'Province: <b>' + this.point.properties.ADM1_EN + '</b><br/>' +
          	                          	    //       'District: <b>' + this.point.properties.ADM2_EN + '</b><br/>' +
          	                          	    //       'Number of interventions: <b>' + this.point.value + '</b><br/>';
                                               

          	                          	    //   }
          	                          	    // },
          	                          	});
          	                          });
                                      
                                      
                                 });
                            }


                            this.setTitle(null, { text: e.point.properties.ADM1_EN });
                       },
                       drillup: function () {
                          this.setTitle(null, { text: '' });
                     }
                }
           },

           title: {
              text: null
         },

         subtitle: {
              text: '',
              floating: true,
              align: 'right',
              y: 50,
              style: {
               fontSize: '16px'
          }
     },

     colorAxis: {
         min: 0,
         minColor: '#E6E7E8',
         maxColor: '#005645'
    },
    tooltip: {
      pointFormatter:function() {
          	          // return 'Province: <b>' + this.properties.ADM1_EN + '</b><br/>' +
          	          //   'Number of interventions: <b>' + this.value + '</b><br/>';
                       if(this.hasOwnProperty("drilldown")) {
                         return 'Province: <b>' + this.properties.ADM1_EN + '</b><br/>' +
                         'Number of interventions: <b>' + this.value + '</b><br/>'+
                         'Click for more information';
                    } else {
                         return 'District: <b>' + this.properties.ADM2_EN + '</b><br/>' +
                         'Number of interventions: <b>' + this.value + '</b><br/>';
                    }

               }
          },

          mapNavigation: {
              enabled: true,
              buttonOptions: {
               verticalAlign: 'bottom'
          }
     },

     plotOptions: {
         map: {
          states: {
           hover: {
            color: '#EEDD66'
       }
  }
}
},

series: [{
     animation: {
          duration: 1000
     },
     data: pvdata1,
     mapData:data,
     joinBy:['ADM1_PCODE','ADM1_PCODE'],
     name: 'Lao',
     dataLabels: {
          enabled: true,
          format: '{point.properties.ADM1_EN}'
     }

}, {
    type: 'mapline',
    data: separators,
    color: 'silver',
    enableMouseTracking: false,
    animation: {
     duration: 500
}
}],

drilldown: {
    activeDataLabelStyle: {
     color: '#FFFFFF',
     textDecoration: 'none',
     textOutline: '1px #000000'
},
drillUpButton: {
     relativeTo: 'spacingBox',
     position: {
      x: -6,
      y: 70
 }
}
}
});

});



var mexico = [19.299457657390825 ,-99.239129627306966] ; 

var map = L.map('map').
setView(   
    [19.299457657390825 ,-99.239129627306966] ,
    14,);         //Es la primera vista que se vera al momento de abrir el mapa   -99.239129627306966, 19.299457657390825    * 19.37278,-99.14772

var urlstreemaps = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

var carto = L.tileLayer(urlstreemaps, {
attribution: 'Map data &copy; <a href="http://openstreetmap.org">RH</a>',
maxZoom: 20,
})

carto.addTo(map);


L.easyButton('fa-globe',  function () {
  map.flyTo(mexico, 18); } ).addTo(map );

// Imagenes de mapas satelital

var urlmaps1 = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'

googlesatelital = L.tileLayer(urlmaps1,{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">RH</a>',
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3']
});

googlesatelital.addTo(map);










  /*

var baseLayers = {
  'street maps':  carto,
  "satelital": googlesatelital,
 
};


var vectores = {
  'Estados':  geoJsonLayer,
  'baldios':  geoJsonLayerbal,
 
};


L.control.layers(baseLayers, vectores,{collapsed:true}).addTo(map);


*/



// Agregar mapa base para el Mini Mapa
var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {attribution: '©OpenStreetMap, ©CartoDB',subdomains: 'abcd',maxZoom: 24});

// Agregar plugin MiniMap
var minimap = new L.Control.MiniMap(carto_light,
    {
        toggleDisplay: true,
        minimized: false,
        position: "bottomleft"
    }).addTo(map);

// Agregar escala
 new L.control.scale({imperial: false}).addTo(map);

// Configurar PopUp
function popup(feature,layer){
    if(feature.properties && feature.properties.BARRIO){
        layer.bindPopup("<strong>Barrio: </strong>" + feature.properties.BARRIO + "<br/>" + "<strong>Localidad: </strong>" + feature.properties.LOCALIDAD);
    }
}




// Agregar control para ver los datos al pasar el puntero

var info = L.control();

// Crear un div con una clase info
info.onAdd = function(map){
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};

// Agregar el metodo que actualiza el control segun el puntero vaya pasando
info.update = function(props){
    this._div.innerHTML = '<h4>Cuenta catastral</h4>' + 
                            (props ? '<b>' + props.CUENTA + '</b><br/>' + ' tipo cuenta: </sup>'+props.CLAVE_CUEN  
                            : 'Pase el puntero por un predio');
};

info.addTo(map);

// Generar rangos de colores de acuerdo con el atributo o campo CLAVE_CUEN
function getColor(d) {
  switch(d) {
      case 'FIS_CARTO':
          return  'rgba(89,233,97,1.0)'
          break;
        case 'FIS_SIIP':
          return '#e2ff03'
          break;
        case 'FIS_SIIP (SﾓLO SIIP)':
          return '#ffc400'
          break;
        case 'FIS_SIIP (UBIC CART)':
          return '#ffc02c'
          break;
        case 'NOFIS (PROMOCA)':
          return '#ff0000'
  
  
}
}
// Crear la funcion para mostrar la simbologia de acuerdo al campo CLAVE_CUEN

function style(feature){
    return {
        fillColor: getColor(feature.properties.CLAVE_CUEN),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.2
    };
}

// AGregar interaccion del puntero con la capa para resaltar el objeto
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.4
    });

    info.update(layer.feature.properties);
}

// Configurar los cambios de resaltado y zoom de la capa

var barriosJS;

function resetHighlight(e){
    barriosJS.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e){
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}



// Agregar capa en formato GeoJson
barriosJS = L.geoJson(pred,{
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
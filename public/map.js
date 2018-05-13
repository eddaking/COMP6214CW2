var map = null;
function createMap(){
    var map = L.map('mapid', {
        center: [50.93414, -1.39550],
        zoom: 14,
        maxZoom:16,
        zoomControl: false
    });
    zc = new L.control.zoom({position: 'bottomleft'});
    zc.addTo(map);
    return map;

}

function loadMapTiles(){
    return L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    });
}

function loadHousePrice(){
    return L.tileLayer("http://www.zoopla.co.uk/static/images/maps/heatmaps/{z}/{x}_{y}.png", {
        opacity: 0.7,
        attribution: "Heatmap from <a href='http://www.zoopla.co.uk/heatmaps/'>Zoopla</a>"
    });
}   
//load the crime data into the heat map and the cluster
function loadCrimes(){
    var data;
    var heat;
    //load csv of crimes
    var latlonArr = [];
    var layers = []
    $.ajax({
        url: "data/police/2017-02-hampshire-street.csv",
        async: false,
        success: function (csvd) {
            temp = $.csv.toArrays(csvd);
            temp.forEach(function(elem){
                lat = elem[6];
                lng = elem[7];
                //cut out data from not in southampton, due to volume of data casuing perfomance issues
                if (lng > -2 & lng < -1 & lat < 51.5){
                    data.push(lat, lng, elem[0]);
                }
            });
            console.log("Crime:");
            onsole.log(data.length);
       },
        dataType: "text"
    });

    layers = [createCrimeHeatmapLayer(data), createCrimeClusterMapLayer(data)];
    return(layers);
}

//create crime clusterMap layer for map
function createCrimeClusterMapLayer(data){
    var crimeMarkers = L.markerClusterGroup();
    var icon = L.icon({
        iconUrl: 'img/mapIcons/crime.png',
        iconSize: [32, 32]
    });
    crimeMarkers.bringToFront();
    //get lat long corods
    for (i = 1; i < data.length; i++) {
        var marker = L.marker(new L.LatLng(data[i][0], data[i][1]), { icon: icon, title: data[i][2] });
        marker.bindPopup(data[i][2]);
        crimeMarkers.addLayer(marker);
    }

    return crimeMarkers
}

//create crime heatmap layer for map
function createCrimeHeatmapLayer(data){
    var latlonArr = [];
    for (i = 1; i < data.length; i++) {
        //get lat long corods
        latlonArr.push([data[i][0], data[i][1]]);
    }
    //add coords to heatmap
    heat = L.heatLayer(latlonArr);

    return heat;
}

//schools
function loadSchools(){
    var dataSchool;
    $.ajax({
        url: "data/UKSchools.csv",
        async: false,
        success: function (csvd) {
            temp = $.csv.toArrays(csvd);
            temp.forEach(function(elem){
                lat = elem[6];
                lng = elem[7];
                //cut out data from not in southampton, due to volume of data casuing perfomance issues
                if (lng > -2 & lng < -1 & lat < 51.5){
                    dataSchool.push(lat, lng, elem[0]);
                }
            });
            console.log("Schools: ")
            console.log(dataSchool.length);
        },
        dataType: "text"
    });
    return createSchoolLayer(dataSchool);
}

//create schools layer for map
function createSchoolLayer(data){
    var schoolMarkers = L.layerGroup();
    var icon = L.icon({
        iconUrl: 'img/mapIcons/school.png',
        iconSize: [32, 32]
    });
    for (i = 1; i < data.length; i++) {
        //get lat long corods
        lat = data[i][0];
        lng = data[i][1];
        var markerS = L.marker(new L.LatLng(lat, lng), { icon: icon });
        markerS.bindPopup(data[i][2]);
        schoolMarkers.addLayer(markerS);
    }
    return schoolMarkers;
}

//pharmacies
function loadPharmacies(){
    var dataPharm = [];
    $.ajax({
        url: "data/Pharmacy.csv",
        async: false,
        success: function (csvd) {
            temp = $.csv.toArrays(csvd);
            temp.forEach(function(elem){
                lat = elem[1];
                lng = elem[2];
                //cut out data from not in southampton, due to volume of data casuing perfomance issues
                if (lng > -2 & lng < -1 & lat < 51.5){
                    dataPharm.push(elem[1], elem[2], elem[0]);
                }
            });
            console.log("Pharms: ")
            console.log(dataPharm.length);
        },
        dataType: "text"
    });
    return createPharmacyLayer(dataPharm);
}

//create pharmacies layer for map
function createPharmacyLayer(data){
    var pharmacyMarkers = L.layerGroup();
    var icon = L.icon({
        iconUrl: 'img/mapIcons/pharmacy.png',
        iconSize: [32, 32]
    });
    //get lat long corods
    for (i = 1; i < data.length; i++) {
        lat = data[i][0];
        lng = data[i][1];
        var markerP = L.marker(new L.LatLng(lat, lng), { icon: icon });
        markerP.bindPopup(data[i][2]);
        pharmacyMarkers.addLayer(markerP);
    }
    return pharmacyMarkers;
}

//food
function loadFood(){
    var dataFood;
    $.ajax({
        url: "data/foodRatings.csv",
        async: false,
        success: function (csvd) {
            temp = $.csv.toArrays(csvd);
            temp.forEach(function(elem){
                lat = elem[21];
                lng = elem[20];
                dataFood.push(lat, lng, elem[2]);
            });
            console.log("Foods: ")
            console.log(dataFood.length);
        },
        dataType: "text",
    });
    return createFoodLayer(dataFood);
}

//create food retailer layer for map
function createFoodLayer(data){
    var foodMarkers = L.layerGroup();
    var icon = L.icon({
        iconUrl: 'img/mapIcons/restaurant.png',
        iconSize: [32, 32]
    });
    //get lat long corods
    for (i = 1; i < data.length; i++) {
        lat = data[i][0];
        lng = data[i][1];
        var markerF = L.marker(new L.LatLng(lat, lng), { icon: icon });
        markerF.bindPopup(data[i][2]);
        foodMarkers.addLayer(markerF);
    }
    return foodMarkers;
}

//properties
function loadProperties(){
    var dataProps;
    $.ajax({
        url: "data/propertylisting.csv",
        async: false,
        success: function (csvd) {
            temp = $.csv.toArrays(csvd);
            temp.forEach(function(elem){
                lat = elem[0];
                lng = elem[1];
                dataProps.push(lat, lng, elem[3]);
            });
            console.log("properties: ")
            console.log(dataProps.length);
        },
        dataType: "text"
    });
    return createPropertyLayer(dataProps);
}

//create property layer for map
function createPropertyLayer(data){
    var propertyMarkers = L.layerGroup();
    var icon = L.icon({
        iconUrl: 'img/mapIcons/house.png',
        iconSize: [32, 32]
    });
    //get lat long corods
    for (i = 1; i < data.length; i++) {
        lat = data[i][0];
        lng = data[i][1];
        var markerP = L.marker(new L.LatLng(lat, lng), { icon: icon });
        markerP.bindPopup("£" + data[i][2]);
        propertyMarkers.addLayer(markerP);
    }
    return propertyMarkers;
}

//Railways
function loadRails(){
    var dataRails;
    $.ajax({
        url: "data/UKRailStations.csv",
        async: false,
        success: function (csvd) {
            temp = $.csv.toArrays(csvd);
            temp.forEach(function(elem){
                lat = elem[4];
                lng = elem[5];
                dataRails.push(lat, lng, elem[2]);
            });
            console.log("Railways: ")
            console.log(dataRails.length);
        },
        dataType: "text"
    });
    return createRailLayer(dataRails);
}

//create railway station layer for map
function createRailLayer(data){
    var railMarkers = L.layerGroup();
    var icon = L.icon({
        iconUrl: 'img/mapIcons/railway.png',
        iconSize: [32, 32]
    });
    //get lat long corods
    for (i = 1; i < data.length; i++) {
        lat = data[i][0];
        lng = data[i][1];
        var markerR = L.marker(new L.LatLng(lat, lng), { icon: icon });
        markerR.bindPopup(data[i][2]);
        railMarkers.addLayer(markerR);
    }
    return railMarkers;
}

function genericLoad(dataLoc, parentLayer, getLatLngNameFunc, limitArea){
    return new Promise( (resolve, reject) =>
    {
        var data;
        $.ajax({
            url: dataLoc,
            async: false,
            success: function (csvd) {
                data = $.csv.toArrays(csvd);
            },
            dataType: "text",
            complete: function () {
                //get lat long corods
                for (i = 1; i < data.length; i++) {
                    //genLatLngname func return lat, lng and Name in an array in that order
                    row = getLatLngNameFunc(data[i])
                    lat = row[0];
                    lng = row[1];
                    var marker = L.marker(new L.LatLng(lat, lng));
                    marker.bindPopup(row[2]);
                    parentLayer.addLayer(marker);
                }
                resolve(parentLayer);
            }
        });
    });
}

//method to load all resources to the map (and the map)
function load(){
    var useOldMethod = false;
    var baselayer, housepriceTiles, crimeHeat,crimeClusters,schools, pharms;
    var overlays = {};
    var tiles = null;
    map = createMap();
    loadMapTiles().addTo(map);
    if (useOldMethod){
        var temp = loadCrimes();
        overlays["Crime Heatmap"] = temp[0];
        overlays["Crime Clustermap"] = temp[1];
        overlays["House Price"] = loadHousePrice();
        overlays["Schools"] = loadSchools();
        overlays["Pharmacies"] = loadPharmacies();
        overlays["Food Retailers"] = loadFood();
        overlays["Railways"] = loadRails();
        overlays["Properties"] = loadProperties();
    }else{
        var centre = map.getCenter();
        var data = {};
        $.ajax({
        url: "getPoints?lat=" + centre.lng + "&long="+ centre.lat +"&dist=0.01",
        async: false,
        success: function (jsonArray) {
            console.log(jsonArray);
            jsonArray.forEach(function(elem) {
                dataType = elem.type;
                console.log(dataType);
                console.log(elem);
                console.log(data);
                if (data[dataType] == null){
                    data[dataType] = [elem];
                }else{
                    data[dataType].push(elem);
                }
            }, this);
            console.log(data);
        },
        dataType: "json",
        complete: function () {
           console.log("TODO: finsih adding json to map")
        }
    });
    }
    L.control.layers(tiles, overlays).addTo(map);
    //bind the searchbox text input of enter to the search function
    $('#LocationSearch').keyup(function (e) {
        if (e.keyCode === 13) {
            var input = $('#LocationSearch').val();
            if(input){
                search(input);
            }
        }
    });
    $('#SearchButton').click(function(){
        var input = $('#LocationSearch').val();
        if(input){
            search(input);
        }
    });
}

function search(serachString){
    address = "https://maps.googleapis.com/maps/api/geocode/json?address=" + serachString + "&region=uk&key=AIzaSyCEbtTgwwturF3tp_qDMdMkGEOHcwqzy_8";
    response = null;
    $.ajax({
        url: address,
        async: false,
        success: function (res) {
            response = JSON.parse(res);            
        },
        dataType: "text",
        complete: function () {
            loc = response["results"][0]["geometry"]["location"]
            lat = loc["lat"];
            lng = loc["lng"];
            map.panTo(new L.LatLng(lat, lng));
        }
    });
}

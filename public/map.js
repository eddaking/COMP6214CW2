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
    var crimeMarkers = L.markerClusterGroup();
    crimeMarkers.bringToFront();

    var data;
    var heat;
    //load csv of crimes
    var latlonArr = [];
    var layers = []
    $.ajax({
        url: "data/police/2017-02-hampshire-street.csv",
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
            console.log("Crime:");
            console.log(data.length);
        },
        dataType: "text",
        complete: function () {
            //get lat long corods
            for (i = 1; i < data.length; i++) {
                latlonArr.push([data[i][5], data[i][4]]);
                var marker = L.marker(new L.LatLng(data[i][5], data[i][4]), { title: data[i][9] });
                marker.bindPopup(data[i][9]);
                crimeMarkers.addLayer(marker);
            }
            //add coords to heatmap
            heat = L.heatLayer(latlonArr);
            layers = [heat, crimeMarkers];
        }
    });

    return(layers);
}

//schools
function loadSchools(){
    var schoolMarkers = L.layerGroup();
    var dataSchool;
    $.ajax({
        url: "data/UKSchools.csv",
        async: false,
        success: function (csvd) {
            dataSchool = $.csv.toArrays(csvd);
            console.log("Schools: ")
            console.log(dataSchool.length);
        },
        dataType: "text",
        complete: function () {
            //get lat long corods
            for (i = 1; i < dataSchool.length; i++) {
                lat = dataSchool[i][6];
                lng = dataSchool[i][7];
                //cut out data from not in southampton, due to sheer volume of data casuing perfomance issues
                if (lng > -2 & lng < -1 & lat < 51.5){
                    var markerS = L.marker(new L.LatLng(lat, lng));
                    markerS.bindPopup(dataSchool[i][0]);
                    schoolMarkers.addLayer(markerS);
                }
            }
        }
    });
    return schoolMarkers;
}

// function loadPharmacies(){
//     var pharmacyMarkers = L.layerGroup();
//     var dataPharm;
//     $.ajax({
//         url: "http://localhost:8080/getPoints/?BusinessType=pharmacy",
//         async: false,
//         success: function (data) {
//             dataPharm = data;
//             console.log(dataPharm);
//             // console.log("Pharms: ")
//             // console.log(dataPharm.length);
//         },
//         dataType: "text",
//         complete: function () {
//           // for( var key in dataPharm){
//           //   console.log(dataPharm.name);
//           // }
//           console.log(dataPharm.length)
//             //get lat long corods
//             // for (i = 1; i < dataPharm.length; i++) {
//             //   console.log(dataPharm[i].geocode);
//             //     // lat = dataPharm[i][1];
//             //     // lng = dataPharm[i][2];
//             //     //cut out data from not in southampton, due to volume of data casuing perfomance issues
//             //     // if (lng > -2 & lng < -1 & lat < 51.5){
//             //     //     var markerP = L.marker(new L.LatLng(lat, lng));
//             //     //     markerP.bindPopup(dataPharm[i][0]);
//             //     //     pharmacyMarkers.addLayer(markerP);
//             //     // }
//             // }
//         }
//     });
//     return pharmacyMarkers;
// }

//pharmacies
function loadPharmacies(){
    var pharmacyMarkers = L.layerGroup();
    var dataPharm;
    $.ajax({
        url: "data/Pharmacy.csv",
        async: false,
        success: function (csvd) {
            dataPharm = $.csv.toArrays(csvd);
            console.log("Pharms: ")
            console.log(dataPharm.length);
        },
        dataType: "text",
        complete: function () {
            //get lat long corods
            for (i = 1; i < dataPharm.length; i++) {
                lat = dataPharm[i][1];
                lng = dataPharm[i][2];
                //cut out data from not in southampton, due to volume of data casuing perfomance issues
                if (lng > -2 & lng < -1 & lat < 51.5){
                    var markerP = L.marker(new L.LatLng(lat, lng));
                    markerP.bindPopup(dataPharm[i][0]);
                    pharmacyMarkers.addLayer(markerP);
                }
            }
        }
    });
    return pharmacyMarkers;
}

//food
function loadFood(){
    var foodMarkers = L.layerGroup();
    var dataFood;
    $.ajax({
        url: "data/foodRatings.csv",
        async: false,
        success: function (csvd) {
            dataFood = $.csv.toArrays(csvd);
            console.log("Foods: ")
            console.log(dataFood.length);
        },
        dataType: "text",
        complete: function () {
            //get lat long corods
            for (i = 1; i < dataFood.length; i++) {
                if (dataFood[i][3] != "Hospitals/Childcare/Caring Premises" && dataFood[i][3] != "School/college/university"){
                    lat = dataFood[i][21];
                    lng = dataFood[i][20];
                    var markerF = L.marker(new L.LatLng(lat, lng));
                    markerF.bindPopup(dataFood[i][2]);
                    foodMarkers.addLayer(markerF);
                }
            }
        }
    });
    return foodMarkers;
}

//properties
function loadProperties(){
    var propertyMarkers = L.layerGroup();
    var dataProps;
    $.ajax({
        url: "data/propertylisting.csv",
        async: false,
        success: function (csvd) {
            dataProps = $.csv.toArrays(csvd);
            console.log("properties: ")
            console.log(dataProps.length);
        },
        dataType: "text",
        complete: function () {
            //get lat long corods
            for (i = 1; i < dataProps.length; i++) {
                lat = dataProps[i][0];
                lng = dataProps[i][1];
                var markerP = L.marker(new L.LatLng(lat, lng));
                markerP.bindPopup("£" + dataProps[i][3]);
                propertyMarkers.addLayer(markerP);
            }
        }
    });
    return propertyMarkers;
}

//Railways
function loadRails(){
    var railMarkers = L.layerGroup();
    var dataRails;
    $.ajax({
        url: "data/UKRailStations.csv",
        async: false,
        success: function (csvd) {
            dataRails = $.csv.toArrays(csvd);
            console.log("Railways: ")
            console.log(dataRails.length);
        },
        dataType: "text",
        complete: function () {
            //get lat long corods
            for (i = 1; i < dataRails.length; i++) {
                lat = dataRails[i][4];
                lng = dataRails[i][5];
                var markerR = L.marker(new L.LatLng(lat, lng));
                markerR.bindPopup(dataRails[i][2]);
                railMarkers.addLayer(markerR);
            }
        }
    });
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

function addSearchBar(){
    var searchboxControl=createSearchboxControl();
    var control = new searchboxControl({
        sidebarMenuItems: {
            Items: []}
    });
    control._searchfunctionCallBack = function (input)
    {
        if (input) {
            search(input)
        }
    }
    map.addControl(control);
}

//method to load all resources to the map (and the map)
function load(){
    var baselayer, housepriceTiles, crimeHeat,crimeClusters,schools, pharms;
    var overlays = {};
    var tiles = null;
    map = createMap();
    loadMapTiles().addTo(map);
    var temp = loadCrimes();
    overlays["Crime Heatmap"] = temp[0];
    overlays["Crime Clustermap"] = temp[1];
    overlays["House Price"] = loadHousePrice();
    overlays["Schools"] = loadSchools();
    overlays["Pharmacies"] = loadPharmacies();
    overlays["Food"] = loadFood();
    overlays["Railways"] = loadRails();
    overlays["Properties"] = loadProperties();

    L.control.layers(tiles, overlays).addTo(map);
    addSearchBar();
    //bind the searchbox text input of enter to the search function
    $('#searchboxinput').keyup(function (e) {
        if (e.keyCode === 13) {
            var input = $('#searchboxinput').val();
            if(input){
                search(input);
            }
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

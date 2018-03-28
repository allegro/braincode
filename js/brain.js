    /* global google, smoothScroll */
    (function() {
        function initialize() {
            var mapOptions = {
                center: {
                    lat: 52.173931692568,
                    lng: 18.8525390625
                },
                zoom: 6,
                scrollwheel: false,
                draggable: false,
                disableDefaultUI: true,
                backgroundColor: '#ffffff'
            };
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            var citiesInfo = [{
                city: "poznan",
                position: new google.maps.LatLng(52.3915253, 16.8557257),
                title: "BrainCode 2018 @ Poznań",
                place: "Pixel",
                street: "ul. Grunwaldzka 182",
                start: "20.04.2087 17:00"
            }, {
                city: "torun",
                position: new google.maps.LatLng(53.0250238, 18.6235562),
                title: "BrainCode 2018 @ Toruń",
                place: "Kościuszko Point",
                street: "Kościuszki 71",
                start: "20.04.2087 17:00"
            }, {
                city: "warszawa",
                title: "BrainCode 2018 @ Warszawa",
                position: new google.maps.LatLng(52.2356231, 20.9958813, 17),
                place: "Q22",
                street: "Al Jana Pawła II 22",
                start: "20.04.2087 17:00"
            }];
            var cities = citiesInfo.map(function(city) {
                var url = "http://maps.google.com/maps?ll=" + city.position.k + "," + city.position.D + "&z=14&t=m&hl=pl&gl=US&q=" + city.place;
                var content = "<strong>Gdzie: </strong>" + city.place + "<br/><strong>Ulica: </strong>" + city.street + "<br/><strong>Start: </strong>" + city.start + "<br/><a href=" + encodeURI(url) + ">Zobacz w Mapach Google.</a>";
                return {
                    marker: new google.maps.Marker({
                        position: city.position,
                        map: map,
                        title: city.title,
                        animation: google.maps.Animation.DROP
                    }),
                    infoWindow: new google.maps.InfoWindow({
                        content: content,
                        maxWidth: 300
                    }),
                    city: city.city
                };
            });
            var closeOther = function(selected) {
                cities.forEach(function(city) {
                    if (city.city !== selected) {
                        city.infoWindow.close();
                    }
                });
            };
            var centerOnCity = function(city) {
                var cityCenter = cities.filter(function(item) {
                    return item.city === city;
                })[0];
                cityCenter.infoWindow.open(map, cityCenter.marker);
                closeOther(city);
                map.setZoom(15);
                map.panTo(cityCenter.marker.getPosition());
                return false;
            };
            cities.forEach(function(city) {
                google.maps.event.addListener(city.marker, 'click', function() {
                    centerOnCity(city.city);
                });
                google.maps.event.addListener(city.infoWindow, 'closeclick', function() {
                    map.setZoom(6);
                    map.setCenter(new google.maps.LatLng(52.173931692568, 18.8525390625));
                    closeOther(null);
                });
            });
            document.getElementById('cities').addEventListener('click', function(e) {

                var el = e.target;
                console.log(el.tagName);
                if (el.tagName === 'LI' || el.tagName === 'IMG') {
                    var city = el.getAttribute('data-city') || el.parentNode.getAttribute('data-city');
                    centerOnCity(city);
                }
            }, true);
        }
        google.maps.event.addDomListener(window, 'load', initialize);

        var peopleList = document.querySelector('.people-list');
        var peopleNode = [].slice.call(document.querySelectorAll('.people-list-item'));
        var rememberCity = function(city) {
            localStorage.city = city;
        };
        var forgetCity = function() {
            localStorage.clear();
        };
        var getCity = function() {
            return localStorage.city ? localStorage.city : '';
        };
        var showPeopleContainer = function(arr, index) {
            if (index === arr.length - 1) {
                setTimeout(function() {
                    peopleList.classList.remove('hide');
                }, 400);
            }
        };
        var showAllPeople = function(city) {
            peopleList.classList.add('hide');
            peopleNode.forEach(function(item, index, arr) {
                item.classList.remove('remove');
                showPeopleContainer(arr, index);
            });
            forgetCity();
        };
        var showPeopleFromCity = function(city) {
            peopleList.classList.add('hide');
            peopleNode.forEach(function(item, index, arr) {
                var itemMeta = item.getAttribute('data-meta').split(',');
                if (itemMeta[itemMeta.length - 1] === city) {
                    item.classList.remove('remove');
                } else {
                    item.classList.add('remove');
                }
                showPeopleContainer(arr, index);
            });
            rememberCity(city);
        };

        var faqInit = function() {
            var questions = document.querySelectorAll('#faq dt');

            var hideAll = function() {
                var desc = document.querySelectorAll('#faq dd');
                desc.forEach(function(item) {
                    item.style.maxHeight = 0;
                })
            }

            hideAll();
            document.querySelector('#faq dl').addEventListener('click', function(e) {

                if (e.target.tagName === 'DT') {
                    var el = e.target.nextSibling.nextSibling;
                    if (el.tagName == 'DD') {
                        el.style.maxHeight = '300px';
                    }
                }
            })

        }

        var peopleInit = function() {
            var cities = ["Poznań", "Warszawa", "Toruń"];
            var city = getCity();
            if (city !== '' && cities.indexOf(city) > -1) {
                showPeopleFromCity(city);
                document.querySelector('input[value=' + city + ']').checked = true;
            }

            document.getElementById('city-list').addEventListener('change', function(e) {
                var el = e.target;
                if (el.tagName === 'INPUT') {
                    var city = el.value;
                    if (city !== '') {
                        showPeopleFromCity(city);
                    } else {
                        showAllPeople();
                    }
                }
            });
        };
        // peopleInit();
        faqInit();
        smoothScroll.init({
            speed: 500,
            easing: 'easeInOutCubic',
            callbackBefore: function() {
                document.body.style.backgroundAttachment = 'scroll';
            },
            callbackAfter: function() {
                document.body.style.backgroundAttachment = 'fixed';
            }
        });
    })();

angular.module("open_sid", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","open_sid.controllers", "open_sid.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Open SID" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "open_sid",
				storeName : "open_sid",
				description : "The offline datastore for Open SID app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("open_sid.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("open_sid",{
		url: "/open_sid",
			abstract: true,
			templateUrl: "templates/open_sid-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("open_sid.about_us", {
		url: "/about_us",
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.agenda", {
		url: "/agenda",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-agenda.html",
						controller: "agendaCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.agenda_singles", {
		url: "/agenda_singles/:id",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-agenda_singles.html",
						controller: "agenda_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.berita", {
		url: "/berita",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-berita.html",
						controller: "beritaCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.berita_singles", {
		url: "/berita_singles/:id",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-berita_singles.html",
						controller: "berita_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.daftar", {
		url: "/daftar",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-daftar.html",
						controller: "daftarCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.lapor", {
		url: "/lapor",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-lapor.html",
						controller: "laporCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.login", {
		url: "/login",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-login.html",
						controller: "loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.logout", {
		url: "/logout",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-logout.html",
						controller: "logoutCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.pemerintah", {
		url: "/pemerintah",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-pemerintah.html",
						controller: "pemerintahCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.peraturan", {
		url: "/peraturan",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-peraturan.html",
						controller: "peraturanCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.peraturan_singles", {
		url: "/peraturan_singles/:id",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-peraturan_singles.html",
						controller: "peraturan_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.sejarah", {
		url: "/sejarah",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-sejarah.html",
						controller: "sejarahCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("open_sid.visimisi", {
		url: "/visimisi",
		cache:false,
		views: {
			"open_sid-side_menus" : {
						templateUrl:"templates/open_sid-visimisi.html",
						controller: "visimisiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/open_sid/dashboard");
});

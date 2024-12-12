sap.ui.define(
	["./BaseController", "sap/ui/model/json/JSONModel"],
	(BaseController, JSONModel) => {
		return BaseController.extend("lazyloading.controller.Suppliers", {
			onInit: function () {
				const oMap = this.byId("geoMap");

				oMap.setMapConfiguration({
					MapProvider: [
						{
							name: "OSM",
							type: "",
							description: "OpenStreetMap",
							tileX: "256",
							tileY: "256",
							minLOD: "3",
							maxLOD: "20",
							Source: [
								{
									id: "s1",
									url: "https://tile.openstreetmap.org/{LOD}/{X}/{Y}.png",
								},
							],
						},
					],
					MapLayerStacks: [
						{
							name: "DEFAULT",
							MapLayer: { name: "layer1", refMapProvider: "OSM" },
						},
					],
				});
				oMap.setRefMapLayerStack("DEFAULT");

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							const { latitude, longitude } = position.coords;

							oMap.setCenterPosition(`${longitude};${latitude}`);
							oMap.setZoomlevel(15);

							oMap.addVo(
								new sap.ui.vbm.Spots({
									items: [
										new sap.ui.vbm.Spot({
											position: `${longitude};${latitude}`,
											tooltip: "You are here",
										}),
									],
								})
							);
						},
						(error) => {
							console.error("Geolocation error:", error.message);
							alert("Unable to retrieve your location.");
						}
					);
				} else {
					alert("Geolocation is not supported by your browser.");
				}
			},

			onSearch: function () {
				const sQuery = this.byId("searchField").getValue();
				if (!sQuery) return;
				const sUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
					sQuery
				)}&format=json&addressdetails=1`;

				fetch(sUrl)
					.then((response) => response.json())
					.then((data) => {
						if (data && data.length > 0) {
							const oFirstResult = data[0];
							const oMap = this.byId("geoMap");

							oMap.setCenterPosition(`${oFirstResult.lon};${oFirstResult.lat}`);
							oMap.setZoomlevel(15);
						} else {
							alert("Place not found.");
						}
					})
					.catch((err) => console.error("Error fetching location data:", err));
			},
		});
	}
);

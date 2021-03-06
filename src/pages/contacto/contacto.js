module.exports = function(options, config, context) {
	return {
		name: context.lang.CONTACTO,
		enabled: true,
		context: {
			init: function init() {

				Vue.component('embed-map', {
					template: `<div id="osm-map"></div>`,
					methods: {
						mount() {
							console.log('RENDER!')
							if (!window.L) {
								return setTimeout(this.render, 100);
							}
							// Where you want to render the map.
							var element = document.getElementById('osm-map');

							// Height has to be set. You can do this in CSS too.
							element.style = 'height:300px;';

							// Create Leaflet map on map element.
							var map = L.map(element);

							// Add OSM tile leayer to the Leaflet map.
							L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
								attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							}).addTo(map);

							// Target's GPS coordinates.
							//-12.1182907,-77.04236
							var target = L.latLng('-12.1182907', '-77.04236');

							// Set map's center to target with zoom 14.
							map.setView(target, 14);

							// Place a marker on the same location.
							L.marker(target).addTo(map);
						}
					},
					created() {
						console.log('map CREATED')
					},
					mounted() {
						console.log('map mounted')
						this.mount();
					}
				});

				window.vues = window.vues || {};
				window.vues['main'] = new Vue({
					el: '.appScope',
					name: 'contact',
					data() {
						return {
							sending: false,
							form: {
								name: '',
								email: '',
								message: ''
							}
						}
					},
					methods: {
						send(e) {

							

							e.stopPropagation();
							if (!this.form.name || !this.form.email) {
								if (!this.form.name) {
									this.$refs.name.focus()
								}
								if (!this.form.email) {
									this.$refs.email.focus()
								}
								return;
							}
							this.sending = false;

							fetch('https://cms.misitioba.com/api/forms/submit/strawhatsContactForm?token=c0645e386821af8fbc2c7f4eb4a014', {
									method: 'post',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										form: Object.assign({}, this.form)
									})
								})
								.then(entry => entry.json())
								.then(entry => console.log(entry));

							this.form.name='';
							this.form.email='';
							this.form.message='';

							new Noty({
								layout: 'bottomRight',
								text: window.SERVER.lang.CONTACT_MESSAGE_SEND_SUCCESS,
								type: 'info',
								killer: true,
								timeout:5000
							}).show();

							return;// just send to cms for now

							$.ajax({
								url: `${SERVER.API_URL}/api/formularioContacto/save`,
								data: JSON.stringify(Object.assign({}, this.form)),
								contentType: "application/json; charset=utf-8",
								type: 'POST',
								error: () => {
									this.sending = false;
								},
								success: (data) => {
									this.sending = false;
									if (!data.result) {
										new Noty({
											layout: 'bottomRight',
											text: window.SERVER.lang.VOLUNTARIADO_ENVIAR_SOLICITUD_ERROR,
											type: 'error',
											killer: true,
											delay: false
										}).show();
									} else {
										new Noty({
											layout: 'bottomRight',
											text: window.SERVER.lang.VOLUNTARIADO_ENVIAR_SOLICITUD_SUCCESS,
											type: 'success',
											killer: true
										}).show();
									}
								}
							});

						}
					}
				});
			}
		}
	}
}
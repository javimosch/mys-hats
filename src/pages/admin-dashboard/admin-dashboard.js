module.exports = function() {
	return {
		name: 'dashboard',
		path: 'admin',
		context: {
			type: 'admin',
			init: function init() {

				Vue.component('parameters', {
					template: `<div  class="parameters-component">
						<codemirror v-model="data"></codemirror>
						<button @click="saveParameters" v-html="progress?'Saving...':'Save'">Deploy</button>
					</div>`,
					data() {
						return {
							data: '',
							progress: false
						}
					},
					created() {
						fetch(`${SERVER.API_URL}/api/config/fetch`).then(r => r.json().then(response => {
							this.data = response.result;
						}));
					},
					mounted() {

					},
					methods: {
						saveParameters() {
							this.progress = true;
							$.ajax({
								url: `${SERVER.API_URL}/api/deploy/path`,
								data: JSON.stringify({
									files: [{
										contents: this.data,
										path: 'config/data.js'
									}],
									path: 'config/data.js'
								}),
								contentType: "application/json; charset=utf-8",
								type: 'POST',
								error: () => {
									this.progress = false;
									console.warn('NOT SAVED')
								},
								success: (data) => {
									this.progress = false;
									console.log('SAVED')
								}
							});
						}

					}
				});

				Vue.component('codemirror', {
					props: ['value'],
					template: `<div  class="codemirror-component">
						<div ref="editor" style="width: -webkit-fill-available;height: 300px;"></div>
					</div>`,
					data() {
						return {
							editor: null,
							init:false
						}
					},
					watch: {
						value() {
							if (!!this.editor && !this.init) {
								this.editor.setValue(this.value);
								this.init = true;
							}
						}
					},
					mounted() {
						var editor = ace.edit(this.$refs.editor);
						editor.setTheme("ace/theme/monokai");
						editor.session.setMode("ace/mode/javascript");
						this.editor = editor;
						this.editor.on('change', () => {
							var value = this.editor.getValue();
							console.log('change', value);
							this.$emit('input', value);
						});
					}
				});

				new Vue({
					el: '.admin',
					name: 'admin_dashboard',
					data() {
						return {
							uploading: false,
							single_image: null,
							images: [],
							deployedAt: '',
							collapsables: {
								upload_image: false,
								view_images: false,
								parameters: true,
								deploy: true
							}
						}
					},
					created() {
						fetch(`/manifest.json`).then(r => r.json().then(response => {
							this.deployedAt = moment(response.created_at, 'x').format('DD-MM-YY HH:mm');
						}));
					},
					mounted() {
						this.browseImages();
					},
					methods: {

						deploy,
						uploadImage,
						browseImages
					}
				})

				function deploy() {
					this.uploading = true;
					setTimeout(() => this.uploading = false, 5000)
					fetch(`${SERVER.API_URL}/api/deploy`).then(r => r.json().then(response => {

					}));
				}

				function browseImages() {
					fetch(`${SERVER.API_URL}/api/images/browse`).then(r => r.json().then(response => {
						this.images = response.images;
					}));
				}

				function uploadImage() {
					var data = new FormData();
					var file = $('#image')[0].files[0];
					data.append('image', file);
					this.uploading = true;
					$.ajax({
						url: `${SERVER.API_URL}/api/upload/images/single`,
						data: data,
						cache: false,
						contentType: false,
						processData: false,
						type: 'POST',
						error: () => {
							this.uploading = false;
							$('#image').val('');
						},
						success: (data) => {
							this.uploading = false;
							$('#image').val('');
							alert('Image uploaded!')
						}
					});
				}
			}
		}
	}
}
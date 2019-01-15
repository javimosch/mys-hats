module.exports = function(options, config, context) {
	return {
		name: context.lang.MENU_SOMBREROS,
		enabled: true,
		context: {
			pageLinks: ["/libs/imageviewer.css"],
			pageScripts: ["/libs/imageviewer.min.js", "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"],
			init: function init() {

				let images = [];
				try {
					images = SERVER.globals.hatsImages;
				} catch (err) {
				}

				window.vues['main'] = Vue.component('gallery', {
					data() {
						return {
							grid: null,
							items: images
						}
					},
					template: `
					<div class="grid gallery">
						
						<div class="grid-item" v-for="item in items">
								<img :src="item" @click="viewImage($event)"/>
						</div>
						
					  
					</div>
					`,
					watch: {
						images() {
							if (!!this.grid) {
								//this.grid.masonry('layout');
							}
						}
					},
					mounted() {
						this.mount();
					},
					methods: {
						viewImage(evt) {
							var el = evt.target;
							var viewer = window.ImageViewer();
							var imgSrc = $(el).attr('src'),
								highResolutionImage = imgSrc;
							viewer.show(imgSrc, highResolutionImage);

							$(window).on('keyup',function(event){
								if(event.which===27){
									viewer.hide();
									$(window).off('keyup')
								}
							})
						},
						mount() {
							if (!window.ImageViewer || $('.grid.gallery').length === 0 || !$('.grid').masonry) {
								return setTimeout(this.mount, 100);
							}
							this.grid = $('.grid.gallery').masonry({
								gutter: 10
								//itemSelector: '.grid-item',
								//columnWidth:200,
								//fitWidth: true,
								//percentPosition: true
							});
							//this.grid.masonry('layout');

						}
					}

				})

				new Vue({
					el: '.appScope'

				});
			}
		}
	}
}
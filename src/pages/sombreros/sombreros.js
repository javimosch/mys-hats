module.exports = function(options, config, context) {
	return {
		name: context.lang.MENU_SOMBREROS,
		enabled: true,
		context: {
			globals: {
				images: [
					'http://ignitersworld.com/lab/assets/images/image_viewer/2.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/1.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/4.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/3.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/2.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/1.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/4.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/2.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/1.jpg',
					'http://ignitersworld.com/lab/assets/images/image_viewer/4.jpg'
				]
			},
			pageLinks: ["/libs/imageviewer.css"],
			pageScripts: ["/libs/imageviewer.min.js", "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"],
			init: function init() {

				let images = [];
				try {
					images = SERVER.globals.hats.images;
				} catch (err) {
					images = window.SERVER.globals.images;
				}

				Vue.component('gallery', {
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
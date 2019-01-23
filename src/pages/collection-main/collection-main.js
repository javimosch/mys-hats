module.exports = function(options, config, context) {
	return {
		name: 'collection-main',
		enabled: true,
		context: {
			pageLinks: ["/libs/imageviewer.css"],
			pageScripts: ["/libs/imageviewer.min.js", "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"],
			init: function init() {
				window.vues['main'] = new Vue({
					el: '.appScope',
					data() {
						return {
							main: SERVER.globals.collections.main,
							womenCategories:SERVER.globals.collections.womenCategories,
							men:{
								main:
								this.buildCategories(SERVER.globals.collections.men.main)
							}
						};
					},
					mounted(){
						this.initGallery();
					},
					methods: {
						buildCategories(urls){
							return [{
									cat:"Finos"
								},{
									cat:"Coloridos"
								},{
									cat:"Con cinta"
								},{
									cat:"Varios"
								}].map((v,i)=>{
									v.url = urls[i];
									return v;
								});
						},
						viewImage(evt) {
							var el = evt.target;
							var viewer = window.ImageViewer();
							var imgSrc = $(el).attr('src'),
								highResolutionImage = imgSrc;
							viewer.show(imgSrc, highResolutionImage);
							$(window).on('keyup', function(event) {
								if (event.which === 27) {
									viewer.hide();
									$(window).off('keyup')
								}
							});
						},
						initGallery(){
							if (!window.ImageViewer || !$('.image-list').masonry) {
								return setTimeout(this.initGallery, 100);
							}
							this.grid = $('.image-list').masonry({
								gutter: 10
							});
							$(window).on('resize',this.onResize);
						},
						onResize(){
							$('.image-list').masonry('layout');
						}
					},
					destroyed(){
						$(window).off('resize', this.onResize);
					}
				});
			}
		}
	};
}
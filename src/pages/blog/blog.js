module.exports = function(options, config, context) {
	return {
		name: context.lang.MENU_BLOG,
		enabled: true,
		context: {
			init: function init() {
				window.vues['main'] = new Vue({
					el: '.appScope',
					data() {
						return {
							entries: [],
							isDetail: false,
							entry: {}
						}
					},
					methods:{
						entryDate(e){
							let created = e._created
							if(!!created){
							created = created.toString().length<13 ? parseInt(created.toString()+'000') : created;
							}
							var date = moment && moment(new Date(created)).format('dddd DD [de] MMMM YYYY [a] HH:mm') || ''
							return date.length>0 ? (date.charAt(0).toUpperCase() + date.substring(1)) : date
						},
						readMore(e){
							Object.assign(this.entry, e);
							this.isDetail=true
							console.warn(this.entry)
							$ && $(window).scrollTop(0)
						},
						goBack(){
							this.isDetail=false
							this.entry = {}
						}
					},
					async mounted() {

						if(!!window.localStorage.getItem('entries')){
							try{
								this.entries = JSON.parse(window.localStorage.getItem('entries'));
								console.log('FROM CACHE',this.entries)
							}catch(err){}
						}
						let res = await fetch('https://cms.misitioba.com/api/collections/get/strawhats_blog_articles?token=c0645e386821af8fbc2c7f4eb4a014', {
							method: 'post',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								filter: {
									published: true
								},
								sort: {
									_created: -1
								},
								populate: 1,
								lang: window.SERVER.globals.currentLanguageCode
							})
						});
						res = await res.json();
						this.entries = res.entries;
						window.localStorage.setItem('entries',JSON.stringify(this.entries));
					}
				})
			}
		}
	};
};
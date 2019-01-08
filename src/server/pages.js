const path = require('path');
const sander = require('sander');
const Handlebars = require('handlebars');
const dJSON = require('dirty-json');
const reload = require('require-reload')(require);

module.exports = {
	getPageConfig: (name, options, config, context) => {
		var srcPath = path.join(process.cwd(), 'src');
		var srcFile = name => path.join(srcPath, name);
		name = name.split('page_').join('');
		name = name.split('_').join('-');
		var pageConfig = '';
		var pageConfigPath = srcFile(`pages/${name}/${name}.js`);
		try {
			pageConfig = sander.readFileSync(pageConfigPath).toString('utf-8');
			if (pageConfig.indexOf('module.exports') !== -1) {
				pageConfig = reload(pageConfigPath)(options, config, context);
			} else {
				pageConfig = dJSON.parse(pageConfig);
			}
		} catch (err) {
			return console.error('pages: config file missing at', pageConfigPath, {
				details: err.stack
			});
		}
		return pageConfig.context;
	},
	compile: (options, config) => {
		var srcPath = path.join(process.cwd(), 'src');
		var srcFile = name => path.join(srcPath, name);

		var outputFolder = options.outputFolder || config.defaultOutputFolder;
		var basePath = path.join(process.cwd(), outputFolder);
		var srcPath = path.join(process.cwd(), 'src');

		var delayedFns = [];
		var writeFns = [];

		var pages = sander.readdirSync(srcFile('pages'));
		pages.forEach(name => {

			var source = '';
			var pageSourcePath = srcFile(`pages/${name}/${name}.html`);
			try {
				source = sander.readFileSync(pageSourcePath).toString('utf-8');
			} catch (err) {
				return console.error('pages: source file missing at', pageSourcePath)
			}

			//Context for handlebars
			var context = config.getContext(options.language);

			var pageConfig = '';
			var pageConfigPath = srcFile(`pages/${name}/${name}.js`);
			//Parse config
			try {
				pageConfig = sander.readFileSync(pageConfigPath).toString('utf-8');
				if (pageConfig.indexOf('module.exports') !== -1) {
					pageConfig = reload(pageConfigPath)(options, config, context);
				} else {
					pageConfig = dJSON.parse(pageConfig);
				}
			} catch (err) {
				return console.error('pages: config file missing at', pageConfigPath, {
					details: err.stack
				});
			}

			if (pageConfig.enabled === false) {
				return;
			}

			if (pageConfig.name.toLowerCase().indexOf('admin') !== -1) {
				return;
			}

			var normalizeName = (name, isPageFile = false) => {
				if (!isPageFile) {
					name = name.split('-').join('_')
					name = name.split(' ').join('_')
				} else {
					name = name.split(' ').join('-')
					name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
				}
				return name.toLowerCase();
			}

			//Register partial
			var pageName = 'page_' + normalizeName(name);

			pageConfig.name = normalizeName(pageConfig.name, true)

			Handlebars.registerPartial(pageName, source);
			Handlebars.registerPartial(`page_${pageConfig.name}`, source);

			console.log(`pages: ${pageName} registered (${options.language} ${pageConfig.name.toLowerCase()})`)

			writeFns.push(createPage(true));

			function createPage(delay) {
				return () => {
					//Write file
					source = sander.readFileSync(srcFile('index.html')).toString('utf-8');
					var template = null;
					try {
						template = Handlebars.compile(source);
					} catch (err) {
						if (delay) {
							delayedFns.push(createPage(false));
						} else {
							throw err;
						}
					}
					context.currentLanguage = context.lang[options.language];
					context.currentPage = pageName;
					console.log('APPLY', pageConfig.context)
					context.langPath = options.language != config.defaultLanguage ? `${options.language}/` : ``;
					var html = template(Object.assign({}, context, pageConfig.context || {}));
					var writePath = path.join(basePath, pageConfig.path || '', pageConfig.name.toLowerCase(), 'index.html');
					sander.writeFileSync(writePath, html);

				}
			}
		});


		writeFns.forEach(fn => fn());
		delayedFns.forEach(fn => fn());



	}
};
import Plugin from '@swup/plugin';

const arrayify = (list) => Array.prototype.slice.call(list);

export default class ScriptsPlugin extends Plugin {
	name = 'ScriptsPlugin';

	constructor(options) {
		super();

		const defaultOptions = {
			head: true,
			body: true,
			optin: false
		};

		this.options = {
			...defaultOptions,
			...options
		};
	}

	mount() {
		this.swup.on('contentReplaced', this.runScripts);
	}

	unmount() {
		this.swup.off('contentReplaced', this.runScripts);
	}

	runScripts = () => {
		const scope =
			this.options.head && this.options.body
				? document
				: this.options.head
				? document.head
				: document.body;

		const selector = this.options.optin ? 'script[data-swup-reload-script]' : 'script:not([data-swup-ignore-script])';
		const scripts = arrayify(scope.querySelectorAll(selector));

		scripts.forEach((script) => this.runScript(script));

		this.swup.log(`Executed ${scripts.length} scripts.`);
	};

	runScript = (originalElement) => {
		const element = document.createElement('script');

		for (const { name, value } of arrayify(originalElement.attributes)) {
			element.setAttribute(name, value);
		}
		element.textContent = originalElement.textContent;
		element.setAttribute('async', 'false');

		originalElement.replaceWith(element);
		return element;
	};
}

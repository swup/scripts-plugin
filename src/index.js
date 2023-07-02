import Plugin from '@swup/plugin';

export default class SwupScriptsPlugin extends Plugin {
	name = 'SwupScriptsPlugin';

	defaults = {
		head: true,
		body: true,
		optin: false
	};

	constructor(options = {}) {
		super();
		this.options = { ...this.defaults, ...options };
	}

	mount() {
		this.swup.hooks.on('replaceContent', this.runScripts);
	}

	unmount() {
		this.swup.hooks.off('replaceContent', this.runScripts);
	}

	getScope({ head, body }) {
		if (head && body) {
			return document;
		}
		if (head) {
			return document.head;
		}
		if (body) {
			return document.body;
		}
		return null;
	}

	runScripts = () => {
		const { head, body, optin } = this.options;
		const scope = this.getScope({ head, body });
		if (!scope) {
			return;
		}

		const selector = optin ? 'script[data-swup-reload-script]' : 'script:not([data-swup-ignore-script])';
		const scripts = Array.from(scope.querySelectorAll(selector));
		scripts.forEach((script) => this.runScript(script));

		this.swup.log(`Executed ${scripts.length} scripts.`);
	};

	runScript = (originalElement) => {
		const element = document.createElement('script');

		for (const { name, value } of originalElement.attributes) {
			element.setAttribute(name, value);
		}
		element.setAttribute('async', 'false');
		element.textContent = originalElement.textContent;

		originalElement.replaceWith(element);
		return element;
	};
}

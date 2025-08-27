import Pdf from './pdf';
import { Icon, LabelTemplate } from '../../../../common/_interface';
import { Templates } from '../../../../common';

export default class App {
	#pdf: Pdf;
	#accounts: string[] = [];
	#field1Text = 'Company';
	#field2Text = 'Name';
	#selectedTemplate: LabelTemplate | undefined = undefined;

	constructor() {
		document.documentElement.classList.add('hellooo-installed');
		this.#pdf = new Pdf();
		//
		window.addEventListener('message', (event: MessageEvent) => {
			document.documentElement.classList.add('hellooo-installed');
			if (event.data.type == 'selectTemplate' && event.data.selectedTemplateId) {
				this.#selectedTemplate = Templates.getById(event.data.selectedTemplateId);
			}
			if (
				event.data.type == 'create' &&
				event.data.accounts &&
				event.data.accounts.length > 0 &&
				event.data.selectedTemplateId
			) {
				this.#selectedTemplate = Templates.getById(event.data.selectedTemplateId);
				this.#accounts = event.data.accounts;
				this.#field1Text = event.data.field1Text || 'Company';
				this.#field2Text = event.data.field2Text || 'Name';
				this.#getIconsAndCreatePdf();
			}
		});
	}
	// PDF生成
	// await this.#getIconsAndCreatePdf();

	#getIconsAndCreatePdf = async () => {
		if (!this.#selectedTemplate) return;
		const icons = await this.#getIcons(this.#accounts);
		if (icons !== false) {
			if (!confirm('PDFをダウンロードします。')) return false;
			window.postMessage({ type: 'startCreatePdf' }, '*');
			await this.#pdf.create(icons, this.#selectedTemplate, this.#field1Text, this.#field2Text);
			window.postMessage({ type: 'endCreatePdf', icons }, '*');
		}
	};

	/**
	 * getIcons
	 * @param accountLists
	 * @returns
	 */
	async #getIcons(accounts: string[]): Promise<Icon[] | false> {
		const accountNames: string[] = [];
		accounts.map((account) => {
			let a = account;
			if (a !== '@') {
				// @のみの場合は空シールとして扱う
				if (a.match(/^@/)) a = a.slice(1);
				if (a.match(/https?:\/\//)) a = a.replace(/https?:\/\/[^/]+\/([^/]+)/, '$1');
				if (a.match(/^ *$/)) return;
			}
			accountNames.push(a);
		});

		if (
			!confirm(
				'X（Twitter）のアイコンを取得するため、リスト内の全アカウントのページをタブで開きます。'
			)
		) {
			return false;
		}
		window.postMessage({ type: 'startGetIcons' }, '*');
		const icons = await new Promise<Icon[]>((resolve) => {
			chrome.runtime.sendMessage({ accounts: accountNames }, (response) => {
				chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
					if (message.sessionId === response.sessionId) resolve(message.icons);
					sendResponse();
				});
			});
		});
		const errorAccounts: string[] = [];
		const filtered = icons.filter((icon) => {
			if (icon.account != '' && icon.data === '') {
				errorAccounts.push(icon.account);
				return false;
			}
			return true;
		});
		window.postMessage({ type: 'endGetIcons' }, '*');
		if (errorAccounts.length > 0) {
			alert('以下のアカウントのアイコンが取得できませんでした。\n' + errorAccounts.join('\n'));
		}
		return filtered;
	}
}

import { getFilesRecursive } from './utils';
import Pdf from './pdf';
import { Icon, LabelTemplate } from '../../../../common/_interface';
import { Templates } from '../../../../common';

export default class App {
	#dropArea: HTMLDivElement;
	#pdf: Pdf;
	#accountLists: File[] = [];
	#step: number = 0;
	#selectedTemplate: LabelTemplate | undefined = undefined;

	constructor() {
		this.#pdf = new Pdf();
		document.documentElement.classList.add('hellooo-installed');
		this.#dropArea = document.querySelector<HTMLDivElement>('#drop-area')!;
		//
		window.addEventListener('message', (event: MessageEvent) => {
			if (event.data.type == 'selectTemplate' && event.data.selectedTemplateId) {
				this.#selectedTemplate = Templates.getById(event.data.selectedTemplateId);
			}
			if (event.data.type == 'step') {
				this.#step = event.data.step;
			}
			if (
				event.data.type == 'step' &&
				event.data.step === 3 &&
				this.#accountLists.length > 0 &&
				this.#selectedTemplate
			) {
				this.#getIconsAndCreatePdf();
			}
		});

		if (this.#dropArea) {
			this.#dropArea.addEventListener('drop', this.#onDrop, false);
			this.#dropArea.addEventListener('dragover', this.#onDragOver, false);
			this.#dropArea.addEventListener('dragend', this.#onDragLeave);
			this.#dropArea.addEventListener('dragleave', this.#onDragLeave);
		}
	}

	/**
	 * onDrop
	 * @param event
	 * @returns
	 */
	#onDrop = async (event: DragEvent) => {
		this.#dropArea.classList.remove('dragover');
		event.preventDefault();
		if (!event.dataTransfer) {
			alert('アカウントリストのテキストファイルをドラッグ＆ドロップしてください。');
			return;
		}
		// アカウントリスト取得
		const items = event.dataTransfer.items;
		this.#accountLists = await this.#getAccountLists(items);

		// 用紙選択されていない場合
		if (this.#step < 2 || !this.#selectedTemplate) {
			alert('用紙を選択してください。');
			window.postMessage({ type: 'openStep', step: 2 }, '*');
			return;
		}

		// PDF生成
		await this.#getIconsAndCreatePdf();
	};

	#getIconsAndCreatePdf = async () => {
		const icons = await this.#getIcons(this.#accountLists);
		if (icons !== false) {
			window.postMessage({ type: 'startCreatePdf' }, '*');
			await this.#pdf.create(icons, this.#selectedTemplate!);
			window.postMessage({ type: 'endCreatePdf', icons }, '*');
		}
	};

	/**
	 * onDragOver
	 * @param event
	 */
	#onDragOver = (event: DragEvent) => {
		event.preventDefault();
		this.#dropArea.classList.add('dragover');
	};

	/**
	 * onDragLeave
	 * @param event
	 */
	#onDragLeave = (event: DragEvent) => {
		this.#dropArea.classList.remove('dragover');
	};

	/**
	 * accountLists
	 * @param items
	 * @returns
	 */
	async #getAccountLists(items: DataTransferItemList) {
		const accountLists: File[] = [];
		const calcFullPathPerItems = Array.from(items).map((item) => {
			return new Promise<void>(async (resolve) => {
				const entry = item.webkitGetAsEntry();
				// nullの時は何もしない
				if (!entry) {
					resolve();
					return;
				}
				const f = (await getFilesRecursive(entry)) as File[];
				f.forEach((file) => accountLists.push(file));
				resolve();
			});
		});
		await Promise.all(calcFullPathPerItems);
		return accountLists;
	}

	/**
	 * getIcons
	 * @param accountLists
	 * @returns
	 */
	async #getIcons(accountLists: File[]): Promise<Icon[] | false> {
		// get account names
		async function read(file: File): Promise<string[]> {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (event) => {
					const result = event.target!.result as string;
					const lines = result.split('\n');
					resolve(lines);
				};
				reader.onerror = (event) => {
					reject(event);
				};
				reader.readAsText(file);
			});
		}
		const accounts: string[] = [];
		for (let i = 0; i < accountLists.length; i++) {
			const t = await read(accountLists[i]);
			t.map((account) => {
				let a = account;
				if (a.match(/^@/)) a = a.slice(1);
				if (a.match(/https?:\/\//)) a = a.replace(/https?:\/\/[^\/]+\/([^\/]+)/, '$1');
				if (a.match(/^ *$/)) return;
				accounts.push(a);
			});
		}

		if (
			!confirm('X（Twitter）のアイコンを取得するため、リスト内のアカウントのページを開きます。')
		) {
			return false;
		}
		window.postMessage({ type: 'startGetIcons' }, '*');
		const icons = await new Promise<Icon[]>((resolve) => {
			chrome.runtime.sendMessage({ accounts }, (response) => {
				chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
					if (message.sessionId === response.sessionId) resolve(message.icons);
					sendResponse();
				});
			});
		});
		const errorAccounts: string[] = [];
		const filtered = icons.filter((icon) => {
			if (icon.data === '') {
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

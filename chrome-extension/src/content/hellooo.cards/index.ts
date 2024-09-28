import { getFilesRecursive } from './utils';
import Pdf from './pdf';
import { Icon } from './interface';
import { kokuyo_KPC_U10_20 } from './templates/kokuyo-KPC-U10-20';
import { LabelTemplate } from './templates/_interface';

export default class App {
	#dropArea: HTMLDivElement;
	#pdf: Pdf;
	#selectedTemplate: LabelTemplate | null = null;

	constructor() {
		this.#pdf = new Pdf();
		document.documentElement.classList.add('hellooo-installed');
		this.#dropArea = document.querySelector<HTMLDivElement>('#drop__area')!;
		console.log(this.#dropArea);
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
		if (!event.dataTransfer) return;
		// filesの初期化
		const items = event.dataTransfer.items;
		const accountLists = await this.#accountLists(items);
		const icons = await this.#getIcons(accountLists);
		console.log(icons);
		this.#pdf.create(icons, kokuyo_KPC_U10_20);
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
	async #accountLists(items: DataTransferItemList) {
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
	async #getIcons(accountLists: File[]): Promise<Icon[]> {
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

		if (confirm('X（Twitter）のアイコンを取得するため、リスト内のアカウントのページを開きます。')) {
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
			if (errorAccounts.length > 0) {
				alert('以下のアカウントのアイコンが取得できませんでした。\n' + errorAccounts.join('\n'));
			}
			return filtered;
		}
		return [];
	}
}

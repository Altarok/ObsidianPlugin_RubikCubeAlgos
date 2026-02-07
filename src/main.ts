import { App, Editor, MarkdownView, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, RubikCubeAlgoSettings, RubikCubeAlgoSettingsTab } from "./RubikCubeAlgoSettings";
import { PLL } from "./RubikCubeAlgoCoordinatesPLL";
import { RCA_RerenderMarkdownRenderChild } from "./RCA_MarkdownPostProcessor";

export default class RubikCubeAlgos extends Plugin {

	settings: RubikCubeAlgoSettings;

	async onload() {
		await this.loadSettings(); 

		this.registerMarkdownCodeBlockProcessor(
			'rubikCubePLL',
			(source:string, el, ctx) => {
				ctx.addChild(new RCA_RerenderMarkdownRenderChild(source, this, el));	
			}
		);

		// Add command: inserts a Rubik Cube codeblock template
		this.addCommand({
			id: 'RubikCubeAlgo-add-codeblock-template-3x3-PLL',	
			name: 'Add codeblock template: 3x3 PLL',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection(PLL.get3by3CodeBlockTemplate());
			}
		});

		// Add settings tab so the user can configure default colors
		this.addSettingTab(
			new RubikCubeAlgoSettingsTab(
				this.app,
				this
			)
		);
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<RubikCubeAlgosSettings>);
		//console.log('load settings: ' + this.settings)
	}

	async saveSettings() {
		//console.log('save settings: ' + this.settings)
		await this.saveData(this.settings);
		
		// Trigger a re-render of markdown code block processors
		this.app.workspace.trigger(
			"rubik:rerender-markdown-code-block-processors"
		);
	}
}

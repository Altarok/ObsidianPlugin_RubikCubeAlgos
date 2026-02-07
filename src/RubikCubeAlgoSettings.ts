import { App, PluginSettingTab, Setting, MarkdownRenderChild } from "obsidian";
import MyPlugin from "./main";

export interface RubikCubeAlgoSettings {
	cubeColor: string;
	arrowColor: string;
}

export const DEFAULT_SETTINGS: RubikCubeAlgoSettings = {
	CUBE_COLOR: '#ff0', /* yellow for cube */
	ARROW_COLOR: '#08f' /* sky blue for arrows */
}

export class RubikCubeAlgoSettingsTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Default cube color')
			.setDesc('Starting value: #ff0 (yellow)')
			.addText(text => text
				.setPlaceholder('3 or 6 digit hex value')
				.setValue(this.plugin.settings.cubeColor)
				.onChange(async (value) => {
					if (value.match('^#([a-f0-9]{3}){1,2}$')){
						this.plugin.settings.cubeColor = value;
						await this.plugin.saveSettings();
					}
				}));
		new Setting(containerEl)
			.setName('Default arrow color')
			.setDesc('Starting value: #08f (sky blue)')
			.addText(text => text
				.setPlaceholder('3 or 6 digit hex value')
				.setValue(this.plugin.settings.arrowColor) 
				.onChange(async (value) => {
					if (value.match('^#([a-f0-9]{3}){1,2}$')){
						this.plugin.settings.arrowColor = value;
						await this.plugin.saveSettings();
					}
				}));
	}
}

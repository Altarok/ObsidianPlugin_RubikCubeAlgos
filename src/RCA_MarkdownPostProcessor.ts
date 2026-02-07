import { MarkdownRenderChild } from "obsidian";
import RubikCubeAlgos from "./main";
//import { DEFAULT_SETTINGS, RubikCubeAlgoSettings, RubikCubeAlgoSettingsTab } from "./RubikCubeAlgoSettings";
import { PLL } from "./RubikCubeAlgoCoordinatesPLL";


export class RCA_RerenderMarkdownRenderChild extends MarkdownRenderChild {
	source: string;
	plugin: RubikCubeAlgos;
	constructor(
		source: string,
		plugin: RubikCubeAlgos,
		element: HTMLElement
	) {
		super(element);
		this.source = source;
		this.plugin = plugin;
		this.element = element;
		this.display();
	}
	
	onload() {
		/*
		 * Register listener which instantly redraws rubik cubes while changing plugin settings.
		 */
		this.registerEvent(
			this.plugin.app.workspace.on(
				"rubik:rerender-markdown-code-block-processors",
				this.display.bind(this)
			)
		);
	}
	
	display() {
		this.element.empty();
		const rows = this.source.split('\n').filter((row) => row.length > 0);
		let pllData = new PLL(this.plugin.settings); 
		pllData.interpretCodeBlock(rows); 
		let widthXheight = pllData.getCubeSize();
		let ARROWS = pllData.getArrowCoordinates();

		if (false === pllData.codeBlockInterpretationSuccessful){
			this.element.createEl('div', { text: "--- Rubik Cube PLL pattern interpretation failed ---" });
			this.element.createEl('div', { text: 'Faulty input:' });
			let explanationDiv = this.element.createEl('div');
			explanationDiv.createEl('b', { text: '"'+pllData.lastNonInterpretableLine+'"', cls:'rubik-cube-warning-text'  });
			if (pllData.reasonForFailure) {
				explanationDiv.createEl('div', { text: 'Reason: '+pllData.reasonForFailure});
			}				
			return; 
		}
		
		let w = widthXheight[0]; 
		let h = widthXheight[1]; 
		let mainSvg = this.element.createSvg('svg', { attr: { viewBox:'0 0 '+w+' '+h, width:w, height:h }, cls: "rubik-cube-pll" });
		let defs = mainSvg.createSvg('defs');
		let marker = defs.createSvg('marker', { attr: {id:"arrowhead"+pllData.arrowColor, markerWidth:"10", markerHeight:"7", refX:"9", refY:"3.5", orient:"auto"}});
		marker.createSvg('polygon', { attr: {points:"0 0, 10 3.5, 0 7" , fill:pllData.arrowColor}});
		
		/* Yellow base rect */
		mainSvg.createSvg('rect', { attr: { fill:pllData.cubeColor }, cls: "rubik-cube-pll-rect" }); 
		
		/*
		 * Background grid; static, unresponsive, black rectangular lines
		 */
		/* Vertical lines */
		for (let x:number = 100; x < w; x+=100) {
			mainSvg.createSvg('line', { attr: { x1:x, x2:x, y1:0, y2:h }, cls: "rubik-cube-pll-line-grid" });
		}
		/* Horizontal lines */ 
		for (let y:number = 100; y < h; y+=100) {
			mainSvg.createSvg('line', { attr: { x1:0, x2:w, y1:y, y2:y }, cls: "rubik-cube-pll-line-grid" });
		}

		for (let i = 0; i < ARROWS.length; i++) {
			let arrow = ARROWS[i];
			let arrowStartCoord = arrow[0];
			let arrowEndCoord = arrow[1];
			//console.log("Arrow goes from "+arrowStartCoord+" to "+arrowEndCoord);
			mainSvg.createSvg('line', { attr: { x1:arrowStartCoord[0], x2:arrowEndCoord[0], y1:arrowStartCoord[1], y2:arrowEndCoord[1],
						'marker-end':'url(#arrowhead'+pllData.arrowColor+')', stroke:pllData.arrowColor,  },
			cls: "rubik-cube-pll-line-arrow" });
		}
		//console.log('<< rubikCubePLL');
	}


}

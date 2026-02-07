import { DEFAULT_SETTINGS, RubikCubeAlgosSettings } from "./RubikCubeAlgoSettings";

const DEFAULT = {
	WIDTH: 3, /* default rubik cube width */
	HEIGHT: 3, /* default rubik cube height */
	CODE_BLOCK_TEMPLATE:
'\n```rubikCubePLL\n'+
'dimension:3,3 // width,height\n'+
'cubeColor:ff0 // yellow cube, optional parameter\n'+
'arrowColor:08f // sky blue arrows, optional parameter\n'+
'arrows:1.1-1.3,7+9\n'+
'```'
} as const; 


export class PLL {
	COORDINATES;
	width:number;
	height:number;
	cubeColor:string;
	arrowColor:string;
	arrows:string;
	codeBlockInterpretationSuccessful:boolean;
	lastNonInterpretableLine:string; 
	reasonForFailure:string;

	constructor(settings:RubikCubeAlgosSettings) {
		this.COORDINATES = new Array();
		this.width = DEFAULT.WIDTH;
		this.height = DEFAULT.HEIGHT;
		
		if (settings.cubeColor){
			this.cubeColor = settings.cubeColor;
		} else {
			this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
		}
		if (settings.arrowColor){
			this.arrowColor = settings.arrowColor;
		} else {
			this.arrowColor = DEFAULT_SETTINGS.ARROW_COLOR;
		}
		
		this.arrows = "";
		this.codeBlockInterpretationSuccessful=true;
	}
	private setDimension(w:number,h:number):void {
		this.width=w;
		this.height=h;
		//console.log("new dimensions: "+w+","+h);
	}
	private setCubeColor(s:string):void {
		this.cubeColor = '#'+s;
		//console.log("new cube color: '"+s+"'");
	}
	private setArrowColor(s:string):void {
		this.arrowColor = '#'+s;
		//console.log("new arrow color: '"+s+"'");
	}
	private setArrows(s:string):void {
		this.arrows = s;
		//console.log("new arrows: '"+s+"'");
	}
	toString():string {
		return "pll[cubeClr'"+this.cubeColor+"',arrowColor'"+this.arrowColor+"',arrows'"+this.arrows+"']"
	}
	interpretCodeBlock(rows:string[]):void {
		if (rows.length ===0){
			return this.fuckThisShitUp("[no input]","at least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'");
		}
		// console.log('pll before: '+this.toString());		
		for (let r = 0; r < rows.length; r++) {
			let row = rows[r];
			if (row.startsWith('dimension:')) {
				if (!row.match('^dimension:\\d+,\\d+( //.*)?')) {
					return this.fuckThisShitUp(row,'invalid dimension, expected "dimension:[2-10],[2-10]" // optional comment goes here');
				}
				let wXh = row.split(' ')[0].trim().replace('dimension:','');
				let wXhSplit = wXh.split(',');
				let w= wXhSplit[0];
				let h= wXhSplit[1];
				if (w<2||h<2||w>10||h>10){
					return this.fuckThisShitUp(row,'invalid dimensions - expected: 2 < width/height < 10');
				}
				this.setDimension(w,h);
			} else if (row.match('^cubeColor:([a-f0-9]{3}){1,2}( //.*)?')) {
				let newCubClr = row.split(' ')[0].trim().replace('cubeColor:','');
				this.setCubeColor(newCubClr);
			} else if (row.match('^arrowColor:([a-f0-9]{3}){1,2}( //.*)?')) {
				let newAroClr = row.split(' ')[0].trim().replace('arrowColor:','')
				this.setArrowColor(newAroClr);
			} else if (row.match('^arrows:\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?(,\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?)*( //.*)?')) {
				let newArrows = row.split(' ')[0].trim().replace('arrows:','')
				this.setArrows(newArrows);
			} else {
				return this.fuckThisShitUp(row, "unexpected input, expected: 'dimension', 'cubeColor', 'arrowColor' or 'arrows'");
			}
		}	
		this.calculateCoordinates();
	}
	private calculateCoordinates(){
		this.COORDINATES[0] = [];
		let index:number=1;
		/* reverse loop order to give x coordinates more priority */
		for (let h = 0; h < this.height; h++) {
			for (let w = 0; w < this.width; w++) {
				this.COORDINATES[index++] = [w*100 + 50, h*100 + 50];
			}
		}
	}
	private fuckThisShitUp(mandatoryLastLineNotInterpretable:string, optionalReasonForFailure:string){
		this.codeBlockInterpretationSuccessful=false;
		this.lastNonInterpretableLine=mandatoryLastLineNotInterpretable;
		if (optionalReasonForFailure) {
			this.reasonForFailure=optionalReasonForFailure;
		}
		console.log('Unexpected input: "'+mandatoryLastLineNotInterpretable+'"');
	}
	getCubeSize(){
		let wXh = [this.width*100, this.height*100];
		return wXh;
	}
	getArrowCoordinates() {
		//console.log('>> getArrowCoordinates, ' + this.COORDINATES);
		let ARROWS = new Array();
		let allArrowCoords = this.arrows.split(',').filter((x) => x.length > 0);
		let index:number = 0;
		//console.log("Arrows to interpret: "+allArrowCoords);
		let isDoubleSided:boolean = false;
		for (let i = 0; i < allArrowCoords.length; i++) {
			isDoubleSided = false;
			let singleArrowCoords:string = allArrowCoords[i];
			let singleArrowCoordsFrom:string; 
			let singleArrowCoordsTo:string;
			
			if (singleArrowCoords.match('\\d-\\d')) {
				let singleArrowCoordsSplit = singleArrowCoords.split('-');
				singleArrowCoordsFrom = singleArrowCoordsSplit[0];
				singleArrowCoordsTo = singleArrowCoordsSplit[1];
			} else {
				let singleArrowCoordsSplit = singleArrowCoords.split('+');
				singleArrowCoordsFrom = singleArrowCoordsSplit[0];
				singleArrowCoordsTo = singleArrowCoordsSplit[1];
				isDoubleSided = true;
			}

			if (singleArrowCoordsFrom===singleArrowCoordsTo){
				// console.log("Skip arrow pointing to itself: "+singleArrowCoordsFrom);
				this.fuckThisShitUp(singleArrowCoords,'arrow is pointing to its starting point');
				continue;
			}

			//console.log("-- Arrow goes from '"+singleArrowCoordsFrom+"' to '"+singleArrowCoordsTo+"'");
			
			let arrowStart;
			let arrowEnd;
			
			if (singleArrowCoordsFrom.match('^[0-9]+$')){
				//console.log('-- d: ' + singleArrowCoordsFrom);
				arrowStart = this.COORDINATES[singleArrowCoordsFrom];
			} else {
				let semanticVersion = singleArrowCoordsFrom.split('.');
				let major:number = +semanticVersion[0];
				let minor:number = +semanticVersion[1];
				let c:number = (major-1)*this.width + minor;
				//console.log('-- c: ' + c);
				arrowStart = this.COORDINATES[c];
			}
			
			if (singleArrowCoordsTo.match('^[0-9]+$')){
				//console.log('-- d: ' + singleArrowCoordsTo);
				arrowEnd = this.COORDINATES[singleArrowCoordsTo];
			} else {
				let semanticVersion = singleArrowCoordsTo.split('.');
				let major:number = +semanticVersion[0];
				let minor:number = +semanticVersion[1];
				let c:number = (major-1)*this.width + minor;
				//console.log('-- c: ' + c);
				arrowEnd = this.COORDINATES[c];
			}
			
			
			ARROWS[index++] = [ arrowStart, arrowEnd ];
			
			if (isDoubleSided) { // add reverse copy
				ARROWS[index++] = [ arrowEnd, arrowStart ];
			}
		}
		//console.log('<< getArrowCoordinates, ' + ARROWS);
		return ARROWS;
	}
	static get3by3CodeBlockTemplate():string {
		return DEFAULT.CODE_BLOCK_TEMPLATE;
	}
};
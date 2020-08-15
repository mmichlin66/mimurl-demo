import * as mim from "mimbl";
import {MainForm} from "./MainForm";



// this function is called from body.onload
globalThis.mimurlDemoMain = function( appRoot: HTMLElement)
{
	mim.mount( new MainForm(), appRoot);
}




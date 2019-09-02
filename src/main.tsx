﻿import * as mim from "mimbl";
import "./main.css";
import {MainForm} from "./MainForm";



// this function is called from body.onload
this.mimurlDemoMain = function( appRoot: HTMLElement)
{
	mim.mount( new MainForm(), appRoot);
}



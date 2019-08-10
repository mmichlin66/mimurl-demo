import * as mim from "mimbl";
import * as mimurl from "mimurl";
import "./MainForm.css";



export class MainForm extends mim.Component
{
	pattern: string;
	patternRuler1: string;
	patternRuler2: string
	url: string;
	urlRuler1: string;
	urlRuler2: string
	patternParsingError: Error;
	parsedPattern: mimurl.IParsedUrlPattern;
	urlParsingError: Error;
	parsedUrl: mimurl.IParsedActualURL;
	matchResult: mimurl.IUrlPatternMatchResult;


	/**
	 * Main render method
	 */
	public render(): any
	{
		return <div style={{margin:"12px"}}>
			<h2>URL Parsing and Matching</h2>

			<p>This page demonstrates the capabilities of the <b>mimurl</b> library
			for URL parsing and matching. Enter URL pattern and URL. Parsing and matching results will
			be displayed below.</p>

			{this.renderForm()}
			{this.renderMatchResult()}
			{this.renderUrlPattern()}
			{this.renderActualUrl()}
		</div>
	}

	/**
	 * Renders input fields fro URL pattern and actual URL
	 */
	private renderForm(): any
	{
		return <table class="layout">
			<colgroup>
				<col style={{textAlign:"right", verticalAlign:"center"}}/>
				<col style={{textAlign:"left", verticalAlign:"middle", width: "100%"}}/>
			</colgroup>
			<tr>
				<td>Pattern:</td>
				<td><input type="text" style={{width:"100%"}} input={this.onPatternChange} /></td>
			</tr>
			<tr>
				<td>URL:</td>
				<td><input type="text" style={{width:"100%"}} input={this.onUrlChange} /></td>
			</tr>
		</table>
	}

	/**
	 * Renders the area with the matching results
	 */
	private renderMatchResult(): any
	{
		let content: any;
		if (!this.parsedPattern || !this.parsedUrl)
		{
			content = <p class="descr">When you type a valid pattern and URL, this area will show the matching results</p>;
		}
		else if (!this.matchResult.success)
		{
			content = <mim.Placeholder>
				<span class="resultIcon" style={{color: "red"}}>{"\u2639"}</span>
				{this.renderMatchResultErrors( this.matchResult.errors)}
			</mim.Placeholder>
		}
		else
		{
			content = <mim.Placeholder>
				<span class="resultIcon" style={{color: "green"}}>{"\u263A"}</span>
				{this.renderMatchResultFields( this.matchResult.fields)}
			</mim.Placeholder>
		}

		return <div class="block">
			<h3>Match Result</h3>
			<div class="matchArea">{content}</div>
		</div>
	}

	/**
	 * Renders information about field values obtained during matching.
	 * @param fields 
	 * @returns array of table rows - one row per field.
	 */
	private renderMatchResultFields( fields: mimurl.FieldBag): any
	{
		let fieldRows: any[] = [];
		for( let fieldName in fields)
		{
			let fieldValue = fields[fieldName];
			let fieldValueAsString = fieldValue === undefined
					? "undefined" : fieldValue === null
					? "null" : isNaN(fieldValue as number)
					? "NaN" : JSON.stringify( fieldValue);
			fieldRows.push( <tr>
				<td><pre>{fieldName}</pre></td>
				<td><pre>{this.renderFieldValue(fields[fieldName])}</pre></td>
			</tr>);
		}

		if (fieldRows.length > 0)
		{
			return <table class="data">
				<tr><th>Field</th><th>Value</th></tr>
				{fieldRows}
			</table>
		}
		else
			return <p>No fields were extracted from the URL</p>
	}

	/**
	 * Renders field value(s) according to its type and with appropriate styles.
	 * @param fieldValue 
	 */
	private renderFieldValue( fieldValue: mimurl.FieldValueType): any
	{
		if (fieldValue === undefined)
			return <span style={{color:"blue"}}>undefined</span>;
		else if (fieldValue === null)
			return <span style={{color:"blue"}}>null</span>;
		else if (typeof fieldValue === "string")
			return <span style={{color:"green"}}>{`\"${fieldValue}\"`}</span>;
		else if (typeof fieldValue === "number")
		{
			if (isNaN(fieldValue as number))
				return <span style={{color:"blue"}}>NaN</span>;
			else
				return <span style={{color:"red"}}>{fieldValue}</span>;
		}
		else if (typeof fieldValue === "boolean")
			return <span style={{color:"blue"}}>{`${fieldValue}`}</span>;
		else if (Array.isArray( fieldValue))
		{
			return <mim.Placeholder>
				<span style={{color:"blue"}}>[</span>
				{
					fieldValue.map( (item, index) =>
						<mim.Placeholder>
							{index > 0 && <span style={{color:"black"}}>, </span>}
							{this.renderFieldValue( item)}
						</mim.Placeholder>
					)
				}
				<span style={{color:"blue"}}>]</span>
			</mim.Placeholder>
		}
	}

	/**
	 * Renders one or more errors received during the matching.
	 * @param errors 
	 */
	private renderMatchResultErrors( errors: string[]): any
	{
		return <div class="matchResultErrors">
			{errors.map( (error: string) => <span>{error}</span>)}
		</div>;
	}

	
	/**
	 * Renders the area with the information about the parsed URL pattern
	 */
	private renderUrlPattern(): any
	{
		let content: any;
		if (!this.pattern || this.pattern.length === 0)
		{
			content = <p class="descr">When you type a pattern, this area will show how it is parsed</p>;
		}
		else
		{
			content = <mim.Placeholder>
				{this.renderStringWithRulers( this.pattern, this.patternRuler1, this.patternRuler2)}
				<hr style={{width: "100%", borderColor: "brown", borderWidth: "0.5px"}}/>
				{this.renderPatternParsingResult()}
			</mim.Placeholder>;
		}

		return <div class="block">
			<h3>URL Pattern</h3>
			<div class="parsingArea">{content}</div>
		</div>;
	}

	/**
	 * Renders the URL pattern parsing result: either the successflly parsed pattern or the
	 * parsing error.
	 */	
	private renderPatternParsingResult(): any
	{
		let iconColor = this.patternParsingError ? "red" : "green";
		let iconCode = this.patternParsingError ? "\u2639" : "\u263A";
		let result = this.patternParsingError
			? <span style={{verticalAlign:"middle", paddingLeft:"8px"}}>{this.patternParsingError.message}</span>
			: this.renderParsedPattern();

		return <div class="parsingResult">
			<span class="resultIcon" style={{color: iconColor}}>{iconCode}</span>
			{result}
		</div>
	}

	/**
	 * Renders the successfully parsed URL pattern.
	 */
	private renderParsedPattern(): any
	{
		return <table class="data">
			<tr><th>Part</th><th>Segment</th><th>Location</th><th>RegExp</th><th>Fields</th></tr>
			{this.parsedPattern.protocol && this.renderParsedPatternSegments( "Protocol", this.parsedPattern.protocol.getSegments())}
			{this.parsedPattern.hostname && this.renderParsedPatternSegments( "Hostname", this.parsedPattern.hostname.getSegments())}
			{this.parsedPattern.port && this.renderParsedPatternSegments( "Port", this.parsedPattern.port.getSegments())}
			{this.parsedPattern.path && this.renderParsedPatternSegments( "Path", this.parsedPattern.path.getSegments())}
			{this.parsedPattern.query && this.renderParsedPatternQuery( this.parsedPattern.query)}
			{this.parsedPattern.hash && this.renderParsedPatternSegments( "Hash", this.parsedPattern.hash.getSegments())}
		</table>
	}

	/**
	 * Renders information about one or more segements from the given named URL part of the URL pattern
	 * @param urlPartName 
	 * @param segments 
	 * @returns array of table rows - one per each segment.
	 */
	private renderParsedPatternSegments( urlPartName: string, segments: mimurl.IParsedSegment[]): any
	{
		if (!segments || segments.length === 0)
			return null;

		let partRows: any[] = [];
		let firstSegment = segments[0];
		partRows.push( <tr>
			<td rowspan={segments.length}>{urlPartName}</td>
			<td>{this.pattern.substr( firstSegment.location.start, firstSegment.location.length)}</td>
			<td>{this.getLocationString( firstSegment.location)}</td>
			<td>{firstSegment.regExp}</td>
			<td>{this.renderParsedSegmentFields( firstSegment)}</td>
		</tr>);

		for( let i = 1; i < segments.length; i++)
		{
			let segment = segments[i];
			partRows.push( <tr>
				<td>{this.pattern.substr( segment.location.start, segment.location.length)}</td>
				<td>{this.getLocationString( segment.location)}</td>
				<td>{segment.regExp}</td>
				<td>{this.renderParsedSegmentFields( segment)}</td>
			</tr>);
		}

		return partRows;
	}

	/**
	 * Renders information about query string parameters parsed from the URL pattern
	 * @param query 
	 * @returns array of rows - one per query string  parameter
	 */
	private renderParsedPatternQuery( query: mimurl.IParsedQueryString): any
	{
		if (!query || Object.keys( query.parsedQSPs).length === 0)
			return null;

		let partRows: any[] = [];
		for( let qspName in query.parsedQSPs)
		{
			let segment = query.parsedQSPs[qspName].segment;
			partRows.push( <tr>
				<td>{`Query [${qspName}]`}</td>
				<td>{this.pattern.substr( segment.location.start, segment.location.length)}</td>
				<td>{this.getLocationString( segment.location)}</td>
				<td>{segment.regExp}</td>
				<td>{this.renderParsedSegmentFields( segment)}</td>
			</tr>);
		}

		return partRows;
	}

	/**
	 * Returns string representation of the given location within the parsed string.
	 * @param location 
	 * @returns String representation of the given location in the format "start - end (length)"
	 */
	private getLocationString( location: mimurl.ParsedLocation): any
	{
		return `${location.start} - ${location.start + location.length - 1} (${location.length})`;
	}

	/**
	 * Renders information about fields in the given segments.
	 * @param segment 
	 * @returns <div> element representing a vertical box with information about each field
	 * on a separate row.
	 */
	private renderParsedSegmentFields( segment: mimurl.IParsedSegment): any
	{
		let fieldSpans: any[] = [];
		for( let field of segment.fields)
		{
			let hasDefaultValue = false;
			if (field.format === mimurl.FieldFormat.String && field.defaultValue !== "")
				hasDefaultValue = true;
			else if (field.format === mimurl.FieldFormat.Integer && !isNaN(field.defaultValue as number))
				hasDefaultValue = true;
			else if (field.format === mimurl.FieldFormat.Float && !isNaN(field.defaultValue as number))
				hasDefaultValue = true;
			else if (field.format === mimurl.FieldFormat.Boolean && field.defaultValue !== undefined)
				hasDefaultValue = true;

			fieldSpans.push( <span>
				{field.name}
				{field.isOptional && "?"}
				{": "}
				{mimurl.FieldFormat[field.format]}
				{hasDefaultValue && " = "}
				{hasDefaultValue && this.renderFieldValue( field.defaultValue)}
			</span>);
		}

		return <div class="parsedSegmentFields">
			{fieldSpans}
		</div>;
	}

	/**
	 * Renders the area with the information about the parsed actual URL
	 */
	private renderActualUrl(): any
	{
		let content: any;
		if (!this.url || this.url.length === 0)
		{
			content = <p class="descr">When you type a URL, this area will show how it is parsed</p>;
		}
		else
		{
			content = <mim.Placeholder>
				{this.renderStringWithRulers( this.url, this.urlRuler1, this.urlRuler2)}
				<hr style={{width: "100%", borderColor: "brown", borderWidth: "0.5px"}}/>
				{this.renderUrlParsingResult()}
			</mim.Placeholder>;
		}

		return <div class="block">
			<h3>Actual URL</h3>
			<div class="parsingArea">{content}</div>
		</div>;
	}

	/**
	 * Renders the actual URL parsing result: either the successflly parsed URL or the parsing error.
	 */	
	private renderUrlParsingResult(): any
	{
		let iconColor = this.urlParsingError ? "red" : "green";
		let iconCode = this.urlParsingError ? "\u2639" : "\u263A";
		let result = this.urlParsingError
			? <span style={{verticalAlign:"middle", paddingLeft:"8px"}}>{this.urlParsingError.message}</span>
			: this.renderParsedUrl();

		return <div class="parsingResult">
			<span class="resultIcon" style={{color: iconColor}}>{iconCode}</span>
			{result}
		</div>
	}

	/**
	 * Renders the successfully parsed URL.
	 */
	private renderParsedUrl(): any
	{
		return <table class="data">
			<tr><th>Part</th><th>Content</th></tr>
			{this.parsedUrl.protocol && <tr><td>Protocol</td><td>{this.parsedUrl.protocol}</td></tr>}
			{this.parsedUrl.hostname && <tr><td>Hostname</td><td>{this.parsedUrl.hostname.join(".")}</td></tr>}
			{this.parsedUrl.port && <tr><td>Port</td><td>{this.parsedUrl.port}</td></tr>}
			{this.parsedUrl.path && <tr><td>Path</td><td>{this.parsedUrl.path.join("/")}</td></tr>}
			{this.parsedUrl.query && this.renderParsedActualQuery( this.parsedUrl.query)}
			{this.parsedUrl.hash && <tr><td>Hash</td><td>{this.parsedUrl.hash}</td></tr>}
		</table>
	}

	/**
	 * Renders information about query string parameters parsed from the URL
	 * @param query 
	 * @returns array of rows - one per query string  parameter
	 */
	private renderParsedActualQuery( query: { [P: string]: string[] }): any
	{
		if (!query || Object.keys( query).length === 0)
			return null;

		let partRows: any[] = [];
		for( let qspName in query)
		{
			let qspValues = query[qspName];
			partRows.push( <tr>
				<td>{`Query [${qspName}]`}</td>
				<td>{qspValues.map( (qspValue) => <div>{qspValue ? qspValue : "<empty>"}</div>)}</td>
			</tr>);
		}

		return partRows;
	}

	private renderStringWithRulers( s: string, ruler1: string, ruler2:string): any
	{
		return <div>
			<pre class="rulers">{ruler1}<br/>{ruler2}</pre>
			<pre class="string">{s}</pre>
		</div>
	}

	private onPatternChange = (e: MouseEvent): void =>
	{
		this.pattern = (e.target as HTMLInputElement).value.trim();
		this.update();
	};

	private onUrlChange = (e: MouseEvent): void =>
	{
		this.url = (e.target as HTMLInputElement).value.trim();
		this.update();
	};

	/**
	 * Parses the URL pattern and the actual URL (if exist) and invokes matching. This method
	 * builds internal structures, which are then represented in the UI.
	 */
	private update()
	{
		// cleanup current data
		this.patternRuler1 = "";
		this.patternRuler2 = "";
		this.patternParsingError = undefined;
		this.parsedPattern = undefined;
		this.urlRuler1 = "";
		this.urlRuler2 = "";
		this.urlParsingError = undefined;
		this.parsedUrl = undefined;
		this.matchResult = undefined;

		if (this.pattern && this.pattern.length > 0)
		{
			// create ruler strings
			for( let i = 0; i < this.pattern.length; i++)
			{
				let iAsString = i.toString();
				let r = i % 10;
				this.patternRuler1 += r === 0 ? iAsString : r >= iAsString.length ? " " : "";
				this.patternRuler2 += r.toString();
			}

			// parse URL pattern
			try
			{
				this.parsedPattern = mimurl.parseUrlPattern( this.pattern);
			}
			catch( err)
			{
				this.patternParsingError = err;
			}
		}

		// parse URL
		if (this.url && this.url.length > 0)
		{
			// create ruler strings
			for( let i = 0; i < this.url.length; i++)
			{
				let iAsString = i.toString();
				let r = i % 10;
				this.urlRuler1 += r === 0 ? iAsString : r >= iAsString.length ? " " : "";
				this.urlRuler2 += r.toString();
			}

			try
			{
				this.parsedUrl = mimurl.parseURL( this.url);
			}
			catch( err)
			{
				this.urlParsingError = err;
			}
		}

		// match URL against pattern
		if (this.parsedPattern && this.parsedUrl)
			this.matchResult = mimurl.match( this.parsedUrl, this.parsedPattern);

		this.updateMe();
	};
}



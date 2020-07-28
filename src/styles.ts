import * as css from "mimcss";



/// #if !DEBUG
css.enableShortNames( true);
/// #endif



class Styles extends css.StyleDefinition
{
	init = [
		css.$style( "*", {
			fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
			fontSize: 12,
			boxSizing: "border-box",
		}),

		css.$style( "html", { height: "100%" }),

		css.$style( "body", { height: "100%", margin: 0 }),

		css.$style( "pre", { fontFamily: "'Courier New', Courier, monospace", margin: 0 }),
	]

	layout = css.$class({})
	data = css.$class({})

	table = css.$style( "table", {
		"&": [
			[this.layout, {	// table.layout
				border: "none", width: "100%",
				"& ": [["tr", {	// table.layout tr
					border: "none",
					"& ": [["td", { border: "none", padding: 4 }]]	// table.layout tr td
				}]]
			}],

			[this.data, {	// table.data
				border: [1, "solid", "grey"], borderCollapse: "collapse",
				"&": [
					["& th, & td", {	// table.data th, table.data td
						border: "1px solid grey",
						textAlign: "left",
						verticalAlign: "center",
						padding: 4
					}],

				]
			}],
		]
	})

	block = css.$class({ marginTop: 8 })

	descr = css.$class({})

	p = css.$style( "p", {
		"&": [
			[this.descr, { marginLeft: "1em", marginRight: "1em" }],
		]
	})

	matchArea = css.$class({
		border: "1px solid brown",
		padding: 2,
		backgroundColor: "beige",
		overflowX: "auto",
		display: "flex",
		flexDirection: "row",
	})

	resultIcon = css.$class({
		fontSize: 48,
		textAlign: "center",
		verticalAlign: "middle",
	})
	
	matchResultErrors = css.$class({
		padding: 4,
		display: "flex",
		flexDirection: "column"
	})

	rulers = css.$class({
		color: "blue",
		margin: 0,
	})
	
	string = css.$class({
		color: "green",
	})
	
	parsingArea = css.$class({
		border: "1px solid brown",
		padding: 2,
		backgroundColor: "beige",
		overflowX: "auto",
		display: "flex",
		flexDirection: "column",
	})
	
	parsingResult = css.$class({
		display: "flex",
		flexDirection: "row",
	})
	
	parsedSegmentFields = css.$class({
		display: "flex",
		flexDirection: "column",
	})
	
	
}



export let styles = css.activate( Styles);
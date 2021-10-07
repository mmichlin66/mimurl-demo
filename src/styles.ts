import * as css from "mimcss";



class Styles extends css.StyleDefinition
{
	init = [
		this.$style( "*", {
			fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
			fontSize: 12,
			boxSizing: "border-box",
		}),

		this.$style( "html", { height: "100%" }),

		this.$style( "body", { height: "100%", margin: 0 }),

		this.$style( "pre", { fontFamily: "'Courier New', Courier, monospace", margin: 0 }),
	]

	layout = this.$class({})
	data = this.$class({})

	table = this.$style( "table", {
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
						border: [1, "solid", "grey"],
						textAlign: "left",
						verticalAlign: "middle",
						padding: 4
					}],

				]
			}],
		]
	})

	block = this.$class({ marginTop: 8 })

	descr = this.$class({})

	p = this.$style( "p", {
		"&": [
			[this.descr, { marginLeft: css.em(1), marginRight: css.em(1) }],
		]
	})

	matchArea = this.$class({
		border: [1, "solid", "brown"],
		padding: 2,
		backgroundColor: "beige",
		overflowX: "auto",
		display: "flex",
		flexDirection: "row",
	})

	resultIcon = this.$class({
		fontSize: 48,
		textAlign: "center",
		verticalAlign: "middle",
	})

	matchResultErrors = this.$class({
		padding: 4,
		display: "flex",
		flexDirection: "column"
	})

	rulers = this.$class({
		color: "blue",
		margin: 0,
	})

	string = this.$class({
		color: "green",
	})

	parsingArea = this.$class({
		border: [1, "solid", "brown"],
		padding: 2,
		backgroundColor: "beige",
		overflowX: "auto",
		display: "flex",
		flexDirection: "column",
	})

	parsingResult = this.$class({
		display: "flex",
		flexDirection: "row",
	})

	parsedSegmentFields = this.$class({
		display: "flex",
		flexDirection: "column",
	})


}



export let styles = css.activate( Styles);
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

// Summarises the session and lets a chart selection filter-prioritise its URL entries.
export default function HistoryAnalysisChart({ data = [] }) {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const chartSize = isSmallScreen ? 220 : 260;
	const [hoveredResult, setHoveredResult] = useState(null);
	const [selectedResult, setSelectedResult] = useState(null);

	// Count only known verdicts. The initial values ensure every chart category
	// remains present even when the session has no entries for that verdict.
	const counts = data.reduce(
		(totals, entry) => {
			if (Object.hasOwn(totals, entry.result)) {
				totals[entry.result]++;
			}
			return totals;
		},
		{ safe: 0, caution: 0, unsafe: 0 }
	);

	// Keep labels and colours in one place so the cards, chart, and URL list agree.
	const results = [
		{ id: "safe", label: "Safe", color: theme.palette.confidenceRing.safe.ring },
		{ id: "caution", label: "Caution", color: theme.palette.confidenceRing.caution.ring },
		{ id: "unsafe", label: "Not Safe", color: theme.palette.confidenceRing.unsafe.ring },
	];

	// Build the summary cards from the shared verdict definitions; the spread
	// adds one card for each verdict after the total-URL card.
	const metrics = [
		{ label: "Unique URLs analysed", value: data.length },
		...results.map(({ id, label, color }) => ({
			label,
			value: counts[id],
			color,
		})),
	];

	// The selection to highlight when the user clicks or hovers over a section of the pie.
	// The ?? operator will return hoveredResult, unless it is null (nothing hovered), when it will
	// return selectedResult. This means hovering takes priority over selection.
	const activeResult = hoveredResult ?? selectedResult;

	// Attach each original position so matching entries can be moved to the top
	// without changing the order of entries within either group.
	const orderedEntries = data
		.map((entry, index) => ({ entry, index }))
		.sort((a, b) => {
			if (!activeResult) return a.index - b.index;
			return Number(b.entry.result === activeResult) - Number(a.entry.result === activeResult)
				|| a.index - b.index;
		});

	// Confidence may arrive as a number or a one-element array. Convert either
	// shape to a readable percentage, and use a dash for missing/invalid values.
	const formatConfidence = (certainty) => {
		const value = Array.isArray(certainty) ? certainty[0] : certainty;
		const percentage = Number(value);
		return Number.isFinite(percentage)
			? `${Math.round(percentage * 100) / 100}%`
			: "—";
	};

	// These helpers provide a consistent fallback for unexpected verdict values.
	const getResult = (result) => results.find((item) => item.id === result);
	const getResultColor = (result) => getResult(result)?.color ?? theme.palette.text.primary;
	const isEntryFaded = (result) => activeResult && result !== activeResult;

	return (
		<Paper
			className="page-section"
			sx={{
				width: "100%",
				maxWidth: 960,
				mx: "auto",
				my: 2,
				p: "clamp(1.25rem, 4vw, 2.5rem)",
				gap: 2,
				borderRadius: "20px",
				border: `1px solid ${theme.palette.divider}`,
				boxShadow: theme.palette.mode === "dark"
					? "0 20px 60px rgba(0,0,0,0.2)"
					: "0 20px 60px rgba(31,42,71,0.06)",
			}}
		>
			<Typography variant="h5" component="h2" sx={{ textAlign: "center" }}>
				Session Results
			</Typography>

			<Box
				sx={{
					display: "flex",
					flexDirection: isSmallScreen ? "column" : "row",
					alignItems: "center",
					gap: 2,
				}}
			>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 1.5,
						width: isSmallScreen ? "100%" : "50%"
					}}
				>
					{metrics.map(({ label, value, color }) => (
						<Box
							key={label}
							sx={{
								minWidth: 0,
								p: 2,
								textAlign: "center",
								borderRadius: "14px",
								backgroundColor: theme.palette.mode === "dark"
									? "rgba(255,255,255,0.045)"
									: "#e2e2e2",
							}}
						>
							<Typography variant="h4" sx={{ color: color ?? "text.primary" }}>
								{value}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{label}
							</Typography>
						</Box>
					))}
				</Box>

				<Box sx={{
					display: "flex",
					justifyContent: "center",
					width: isSmallScreen ? "100%" : "50%",
					minWidth: 0,
				}}>
					<PieChart
						className="url-checker-confidence-chart"
						width={chartSize}
						height={chartSize}
						series={[{
							data: results.map(({ id, label }) => ({
								id,
								value: counts[id],
								label,
							})),
							innerRadius: 0,
							startAngle: 0,
							endAngle: 360,
							cornerRadius: 8,
							paddingAngle: 0,
							sortingValues: "none",
							highlightScope: { fade: 'global', highlight: 'item' },
      						faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
						}]}
						colors={results.map(({ color }) => color)}
						margin={0}
						hideLegend
						onHighlightChange={(highlightedItem) => {
							// The pie callback identifies a slice by its index. Translate
							// that index to a verdict, or clear hover when no slice is active.
							setHoveredResult(
								highlightedItem?.type === "pie"
									? results[highlightedItem.dataIndex]?.id ?? null
									: null
							);
						}}
						onItemClick={(_, itemIdentifier) => {
							// Clicking toggles a persistent selection; clicking it again clears it.
							const result = results[itemIdentifier.dataIndex]?.id;
							if (result) {
								setSelectedResult((currentResult) =>
									currentResult === result ? null : result
								);
							}
						}}
					/>
				</Box>
			</Box>

			<Typography variant="body2" color="text.secondary">
				Hover over or select a chart slice to bring matching URLs to the top.
				Select the same slice again to clear the selection.
			</Typography>

			{/* Use compact cards on phones and a table when there is enough width. */}
			{isSmallScreen ? (
				<Box role="list" aria-label="URLs analysed this session" sx={{ display: "grid", gap: 1 }}>
					{orderedEntries.map(({ entry, index }) => (
						<Box
							key={`${entry.url}-${index}`}
							role="listitem"
							sx={{
								minWidth: 0,
								p: 1.5,
								borderRadius: 2,
								borderLeft: `4px solid ${getResultColor(entry.result)}`,
								backgroundColor: activeResult === entry.result
									? alpha(getResultColor(entry.result), 0.12)
									: theme.palette.action.hover,
								opacity: isEntryFaded(entry.result) ? 0.48 : 1,
								overflowWrap: "anywhere",
								transition: "opacity 150ms ease, background-color 150ms ease",
							}}
						>
							<Typography variant="body2" sx={{ overflowWrap: "anywhere", mb: 1 }}>
								{entry.url}
							</Typography>
							<Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
								<Typography variant="body2" sx={{ color: getResultColor(entry.result), fontWeight: 700 }}>
									{getResult(entry.result)?.label ?? "Unknown"}
								</Typography>
								<Typography variant="body2" sx={{ color: getResultColor(entry.result), fontWeight: 600 }}>
									AI confidence: {formatConfidence(entry.certainty)}
								</Typography>
							</Box>
						</Box>
					))}
				</Box>
			) : (
				<TableContainer sx={{ width: "100%", borderRadius: 2 }}>
					<Table aria-label="URLs analysed this session">
						<TableHead>
							<TableRow>
								<TableCell>URL</TableCell>
								<TableCell>Verdict</TableCell>
								<TableCell align="right">Model Confidence</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orderedEntries.map(({ entry, index }) => {
								const color = getResultColor(entry.result);
								return (
									<TableRow
										key={`${entry.url}-${index}`}
										sx={{
											backgroundColor: activeResult === entry.result
												? alpha(color, 0.12)
												: "transparent",
											opacity: isEntryFaded(entry.result) ? 0.48 : 1,
											transition: "opacity 150ms ease, background-color 150ms ease",
											"&:last-child td, &:last-child th": { border: 0 },
										}}
									>
										<TableCell
											component="th"
											scope="row"
											sx={{ maxWidth: 0, overflowWrap: "anywhere" }}
										>
											{entry.url}
										</TableCell>
										<TableCell sx={{ color, fontWeight: 700, whiteSpace: "nowrap" }}>
											{getResult(entry.result)?.label ?? "Unknown"}
										</TableCell>
										<TableCell align="right" sx={{ color, fontWeight: 600, whiteSpace: "nowrap" }}>
											{formatConfidence(entry.certainty)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Paper>
	);
}

import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts/PieChart";

export default function HistoryAnalysisChart({ data = [] }) {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const chartSize = isSmallScreen ? 220 : 260;
	const counts = data.reduce(
		(totals, entry) => {
			if (entry.result in totals) {
				totals[entry.result]++;
			}
			return totals;
		},
		{ safe: 0, caution: 0, unsafe: 0 }
	);

	const metrics = [
		{ label: "Unique URLs analysed", value: data.length },
		{ label: "Safe", value: counts.safe, color: theme.palette.confidenceRing.safe.ring },
		{ label: "Caution", value: counts.caution, color: theme.palette.confidenceRing.caution.ring },
		{ label: "Unsafe", value: counts.unsafe, color: theme.palette.confidenceRing.unsafe.ring },
	];

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
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))",
					gap: 1.5,
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
								: "#f4f6fb",
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

			<Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
				<PieChart
					className="url-checker-confidence-chart"
					width={chartSize}
					height={chartSize}
					series={[{
						data: [
							{ id: "safe", value: counts.safe },
							{ id: "caution", value: counts.caution },
							{ id: "unsafe", value: counts.unsafe },
						],
						innerRadius: 70,
						outerRadius: 92,
						startAngle: 0,
						endAngle: 360,
						cornerRadius: 8,
						paddingAngle: 0,
						sortingValues: "none",
					}]}
					colors={[
						theme.palette.confidenceRing.safe.ring,
						theme.palette.confidenceRing.caution.ring,
						theme.palette.confidenceRing.unsafe.ring,
					]}
					margin={0}
					hideLegend
				/>
			</Box>
		</Paper>
	);
}

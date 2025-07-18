# KPI Component

The KPI (Key Performance Indicator) component displays important metrics and statistics in a visually appealing and easy-to-understand format. It's designed to highlight key business metrics, performance data, or any numerical information that requires prominence.

## Description

The KPI component provides a standardized way to display important numerical information with supporting context. Each KPI includes a descriptive label, a prominent count or value, and optional elements like icons and rate indicators to show trends or changes over time.

KPIs are typically used in dashboards, reports, and analytics interfaces to:
- Highlight the most important metrics at a glance
- Show progress toward goals or targets
- Indicate performance trends with rate changes
- Group related metrics for comparison

The component's clean, focused design draws attention to critical numbers while providing just enough context to make the data meaningful and actionable.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| Icon | string | FontAwesome icon class to visually represent the KPI category |
| Label | string | Descriptive text explaining what the metric represents |
| Count | number | The primary numeric value or measurement being displayed |
| Rate | number | Percentage change or growth rate (positive or negative) |

## AUML Example

```auml
<Application>
	<Application.Imports>
		<Import Namespace="e" Source="/static/" />
	</Application.Imports>


	<e:Label Value="KPI Basics" />
	<!-- Basic KPI with icon -->
	<e:KPI Icon="fa-users" Label="Total Users" Count="12458" />

	<!-- KPI with positive growth rate -->
	<e:KPI Icon="fa-shopping-cart" Label="Monthly Sales" Count="8675" Rate="12.5" />

	<!-- KPI with negative rate -->
	<e:KPI Icon="fa-chart-line" Label="Conversion Rate" Count="3.2" Rate="-2.1" />

	<!-- KPI with large number -->
	<e:KPI Icon="fa-dollar-sign" Label="Revenue" Count="1245689" Rate="8.3" />

	<!-- KPIs for website analytics -->
	<e:Label Value="Website Analytics" />
	<e:KPI Icon="fa-eye" Label="Page Views" Count="34521" Rate="5.7" />

	<e:KPI Icon="fa-clock" Label="Avg. Time on Site" Count="2.4" Rate="-1.3" />

	<e:KPI Icon="fa-exchange-alt" Label="Bounce Rate" Count="42.8" Rate="-3.2" />

</Application>
```
# Icon Component

The Icon component allows you to display vector icons with customizable size, color, and animation effects. Icons provide visual cues that help users quickly understand functionality or concepts within your user interface.

## Description

The Icon component renders scalable vector icons with consistent styling options. Icons enhance the user interface by providing visual indicators that complement text or stand alone as informational elements.

This component is typically used to:
- Add visual indicators to UI elements
- Provide status indicators or informational symbols
- Create visual emphasis for important information
- Enhance the visual appeal and usability of your interface

Icons can be customized with different sizes, colors, and animation effects to match your application's design language and create the appropriate visual hierarchy.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| Value | string | The icon identifier (usually a FontAwesome class like "fa-user") |
| Size | enum | The size of the icon: ExtraSmall, Small, Normal, Large, ExtraLarge |
| Color | enum | The color theme for the icon: Primary, Success, Warning, Info, Error |
| Animate | enum | Optional animation effect: None, Beat, Fade, Spin |

## AUML Example

```auml
<Application>
	<Application.Imports>
		<Import Namespace="e" Source="/static/" />
	</Application.Imports>

	<!-- Basic icons with different sizes -->
	<e:Label Value="Icon Basics" />

	<e:Icon Value="fa-user" Size="ExtraSmall" />
	<e:Icon Value="fa-user" Size="Small" />
	<e:Icon Value="fa-user" Size="Normal" />
	<e:Icon Value="fa-user" Size="Large" />
	<e:Icon Value="fa-user" Size="ExtraLarge" />

	<!-- Icons with different colors -->
	<e:Label Value="Icon Colors" />
	<e:Icon Value="fa-check-circle" Color="Primary" />
	<e:Icon Value="fa-check-circle" Color="Success" />
	<e:Icon Value="fa-exclamation-triangle" Color="Warning" />
	<e:Icon Value="fa-info-circle" Color="Info" />
	<e:Icon Value="fa-times-circle" Color="Error" />


	<!-- Icons with animations -->
	<e:Label Value="Icon Animations" />
	<e:Icon Value="fa-heart" Size="Large" Color="Error" Animate="Beat" />
	<e:Icon Value="fa-bell" Size="Large" Color="Warning" Animate="Fade" />
	<e:Icon Value="fa-spinner" Size="Large" Color="Primary" Animate="Spin" />


	<!-- Practical examples -->
	<e:Label Value="Practical Icon Usage" />
	<e:Icon Value="fa-check" Color="Success" />
	<e:Icon Value="fa-exclamation-circle" Color="Warning" />
	<e:Icon Value="fa-sync" Animate="Spin" Color="Info" />
</Application>
```
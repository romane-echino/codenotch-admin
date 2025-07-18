# Application Component

The Application component serves as the main container and layout manager for your application. It provides a consistent structure with navigation, user management, and theming capabilities while handling the overall organization and styling of your application.

## Description

The Application component is the root-level wrapper that establishes the application's framework. It typically handles:

- Primary layout structure (header, sidebar, content area, footer)
- Navigation menu generation and management
- User authentication state and profile display
- Consistent theming and branding across all pages
- Responsive behavior for different screen sizes

This component should be used at the top level of your application to provide a consistent user experience and shared functionality across all pages.

**Important**: Application components can only contain "Page" components as direct children. Each Page component must have at least the `Application.Title` and `Application.Route` properties defined for proper navigation and routing to work.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| LogoUrl | string | URL to the logo image displayed in light mode |
| LogoDarkUrl | string | URL to the logo image displayed in dark mode |
| LogoIcon | string | URL to a compact logo icon for collapsed navigation |
| Tint | string | Primary color tint for theming the application |

## AUML Example

```auml
<Application>
    <Application.Imports>
        <Import Namespace="e" Source="/static/" />
    </Application.Imports>

	<!-- Basic application setup with navigation -->
	<e:Application 
    LogoUrl="https://colorful-cow-6efae0f56a.media.strapiapp.com/logo_light_771175a830.svg" 
    LogoDarkUrl="https://colorful-cow-6efae0f56a.media.strapiapp.com/logo_dark_809512fdb7.svg" 
    LogoIcon="https://colorful-cow-6efae0f56a.media.strapiapp.com/logo_icon_16b635acf7.svg" 
    Tint="#115577">

		<!-- Define application pages - each page must have at least Title and Route -->
		<e:Page Application.Title="Dashboard" Application.Icon="fad fa-home" Application.Route="/" Application.Menu="Main">
			<e:Label Value="My application dashboard" />
		</e:Page>

		<e:Page Application.Title="Analytics" Application.Icon="fa-chart-line" Application.Route="/analytics" Application.Menu="Main">
			<e:Label Value="My application dashboard" />
		</e:Page>

		<e:Page Application.Title="User Management" Application.Icon="fa-users" Application.Route="/users" Application.Menu="Admin">
			<e:Label Value="My application dashboard" />
		</e:Page>

		<e:Page Application.Title="Settings" Application.Icon="fa-cog" Application.Route="/settings" Application.Menu="Admin">
			<e:Label Value="My application dashboard" />
		</e:Page>
	</e:Application>
</Application>
```
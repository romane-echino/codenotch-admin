# Label Component

The Label component displays formatted values with optional icons and styling. It supports various data types including dates, currencies, percentages, and contact information.

## Description

The Label component provides a standardized way to present different types of data with appropriate formatting. It can transform raw values into human-readable formats based on the specified type, and can include icons and visual indicators to improve comprehension and accessibility.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| Value | string | The content to be displayed |
| Title | string | Optional label displayed above the value |
| Type | string | Format type (Date, Time, DateTime, Duration, Currency, Percentage, Phone, Email, Url) |
| Icon | string | FontAwesome icon class to display alongside the value |
| IconColor | string | Color theme for the icon (Primary, Secondary, etc.) |
| IconPlacement | string | Position of the icon (Left or Right) |

## AUML Example

```auml
<Application>
    <Application.Imports>
        <Import Namespace="e" Source="/static/" />
    </Application.Imports>

    <e:Label Value="2025-07-25T13:15:00.000Z" Type="Date" Title="Date" />
    <e:Label Value="2025-07-25T13:15:00.000Z" Type="Time" />
    <e:Label Value="2025-07-25T13:15:00.000Z" Type="DateTime" />
    <e:Label Value="2025-07-14T13:24:56+00:00" Type="Duration" />

    <e:Label Value="1502" Type="Currency" />
    <e:Label Value="0.2" Type="Percentage" />
    <e:Label Value="079 834 13 98" Type="Phone" Icon="fas fa-phone" IconColor="Primary" />
    <e:Label Value="romane@echino.com" Type="Email" Icon="fas fa-envelope" IconPlacement="Right" />
    <e:Label Value="http://www.echino.com" Type="Url" Icon="fas fa-link" />
</Application>
```
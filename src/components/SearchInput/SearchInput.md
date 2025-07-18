# SearchInput Component

The SearchInput component provides an advanced searchable dropdown that allows users to filter and select items from a data source. It combines search functionality with selection capabilities, making it perfect for finding and choosing items from large datasets.

## Description

The SearchInput component renders an input field with autocomplete functionality. As the user types, it filters the provided data source and displays matching options in a dropdown. Users can select an option from the dropdown or continue typing to refine their search. The component supports customization through icons, prefixes, suffixes, and can be styled to match your application's design.

Key features include:
- Real-time filtering of options as the user types
- Support for custom data sources
- Customizable display of search results
- Option to add new items when no results match
- Custom rendering of dropdown items

## Properties

| Property | Type | Description |
|----------|------|-------------|
| Title | string | Label text displayed above the input field |
| Placeholder | string | Placeholder text shown when the input is empty |
| Value | string | Pre-selected value for the input |
| OnSelect | action | Function triggered when an item is selected from the dropdown |
| Icon | string | FontAwesome icon class to display within the input |
| Disabled | boolean | When true, prevents user interaction with the input |
| Prefix | reactNode | Content to display before the input text |
| Suffix | reactNode | Content to display after the input text |
| Source | any | Data source containing the items to search through |
| DisplayField | string | Property name from source items to display in the dropdown |
| ValueField | string | Property name from source items to use as the selection value |
| OnAdd | action | Function triggered when a user wants to add a new item not in the list |
| Renderer | renderer | Custom renderer function for dropdown items |

## AUML Example

```auml
<Application>
    <Application.Imports>
        <Import Namespace="e" Source="/static/" />
    </Application.Imports>

<Application.Declarations>
    <Data Id="users" >
        [
            {"id": 1, "name": "John Smith", "email": "john@example.com"},
            {"id": 2, "name": "Jane Doe", "email": "jane@example.com"},
            {"id": 3, "name": "Robert Johnson", "email": "robert@example.com"},
            {"id": 4, "name": "Emily Davis", "email": "emily@example.com"}
        ]
    </Data>
</Application.Declarations>
    
    <!-- Basic search input -->
    <e:SearchInput 
        Title="Find User" 
        Placeholder="Type to search..." 
        Icon="fas fa-search"
        Source="{_auml.users}"
        DisplayField="name"
        ValueField="id"
        OnSelect="{(selection) => selectedUser = selection.value}"
    />
    
    <!-- Search with add functionality -->
    <e:SearchInput 
        Title="Find or Add User" 
        Placeholder="Search users..."
        Source="{_auml.users}" 
        DisplayField="name"
        ValueField="id"
    >
        <e:SearchInput.OnAdd>
            <Script>
                console.log('Add new user:', _action);
            </Script>
        </e:SearchInput.OnAdd>
    </e:SearchInput>
    
    <!-- Custom rendering of dropdown items -->
    <e:SearchInput 
        Title="User Search with Custom Display" 
        Source="{_auml.users}"
        DisplayField="name"
        ValueField="id"
    >
        <e:SearchInput.Renderer>
            <e:Label Title="{_auml.item.name}" Value="{_auml.item.email}"  />
        </e:SearchInput.Renderer>
    </e:SearchInput>
    
</Application>
```
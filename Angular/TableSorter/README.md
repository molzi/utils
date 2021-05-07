
# TableSorter Directive
Angular Directive for providing a sorting-popover on clicking onto a table header.

## Requirements

 - Angular Application
 - Coreui-Premium
 -- https://coreui.io/

## Usage
Declare the TableSorter-Directive in your depending Angular-Module to enable the directive in the module-included components.
Then choose your HTML-Component-File in which you want to include the TableSorter-Directive.
In your Tableheader, instead of a p- or any other HTML-Element, you must use an anchor-Tag to make this directory work.

    <table>
	    <thead>
		    <tr>
			    <th>
				    <a tabindex="0" tableSorter data-property="age" (onSortingChanged)="this.onSortingChanged($event)">Age</a>
			    </th>
		    </tr>
	    </thead>
    </table>

Following attributes/events must be provided in the anchor-tag:

 - **tabindex** - *Attribute*
	 - must be set to an unique number, e.g. 1
 - **tableSorter** - *Selector*
	 - selector of the Directive
 - **data-property** - *Custom Attribute*
	 - Name of the property to be sorted, e.g. Age
 - **onSortingChanged** - *Event*
	 - returns an event when the user presses the ascending or descending button.

**onSortingChanged-Event**
Gets called when the user clicks either on the ascending or descending button and returns the property name and the sort order.

    {
	    name: string,
	    order: 'asc' | 'desc'| SortOrder
    }: TableSorterObject
This returned Object can be used to trigger a sorting-call.

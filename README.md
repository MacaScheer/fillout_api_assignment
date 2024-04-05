# Context:
This is a takehome assignement for Fillout.com
This API, hosted by railway, will hit a test API endpoint hosted by Fillout.com, getting access to test data and returning a group of form response objects.
Each object contains a groups of questions and answers, as well as other data.
Each group of questions corresponds to a separate form, filled out by a hypothetical user.

# API
The API in this repo will apply a filter to the response data, if entered into the URL.

In Typescript each filter looks like this:
```
type FilterClauseType = {
	id: string;
	condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
	value: number | string;
}
```

To use the endpoint with filters go to https://filloutapiassignment-production.up.railway.app/?filters=FILTERS

adding your own `FILTERS`

## Formatting URL

E.P. to add a filter like:
```
{
  id: fFnyxwWa3KV6nBdfBDCHEA,
  condition: greater_than,
  value: 221
}
```
the `<filters>` would look like `{id:fFnyxwWa3KV6nBdfBDCHEA,condition:greater_than,value:221}`
so the url would look like this:
https://filloutapiassignment-production.up.railway.app/?filters={id:fFnyxwWa3KV6nBdfBDCHEA,condition:greater_than,value:221}

to add another filter, simply add a comma at the end and add another json object, i.e. `{id:...,condition:...,value:...}`

## Filter Functionality / Expected Behavior
The API is intended to return all of a form's questions/responses if their questions/responses pass all of the filters.
So questions/responses of a form may be returned if their IDs are not matched in the filter, but others from the form are.


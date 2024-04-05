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

## Test API Yourself:
Here is some sample test data from the Fillout API, which you can use to test the filters:
```
{
  submissionId: 'ec42f74a-198a-4a8c-a72b-266501d1bce8',
  submissionTime: '2024-03-26T03:05:55.967Z',
  lastUpdatedAt: '2024-03-26T03:05:55.967Z',
  questions: [
    {
      id: 'bE2Bo4cGUv49cjnqZ4UnkW',
      name: 'What is your name?',
      type: 'ShortAnswer',
      value: 'Demo'
    },
    {
      id: 'kc6S6ThWu3cT5PVZkwKUg4',
      name: 'What is your email?',
      type: 'EmailInput',
      value: 'demoRecruiting@fillout.com'
    },
    {
      id: 'jB2qDRcXQ8Pjo1kg3jre2J',
      name: 'Which department do you work in?',
      type: 'MultipleChoice',
      value: 'Recruiting'
    },
    {
      id: 'fFnyxwWa3KV6nBdfBDCHEA',
      name: 'How many employees work under you?',
      type: 'NumberInput',
      value: 525
    },
    {
      id: 'dSRAe3hygqVwTpPK69p5td',
      name: 'Please select a date to schedule your yearly check-in.',
      type: 'DatePicker',
      value: '2024-03-25'
    },
    {
      id: '4KC356y4M6W8jHPKx9QfEy',
      name: "Anything else you'd like to share before your call?",
      type: 'LongAnswer',
      value: null
    }
  ],
  calculations: [],
  urlParameters: [],
  quiz: {},
  documents: []
}
{
  submissionId: 'd9fbf314-8331-4ebf-bb6a-ccbd8c592b16',
  submissionTime: '2024-03-26T03:07:33.815Z',
  lastUpdatedAt: '2024-03-26T03:07:33.815Z',
  questions: [
    {
      id: 'bE2Bo4cGUv49cjnqZ4UnkW',
      name: 'What is your name?',
      type: 'ShortAnswer',
      value: 'Demo'
    },
    {
      id: 'kc6S6ThWu3cT5PVZkwKUg4',
      name: 'What is your email?',
      type: 'EmailInput',
      value: 'demoHR@fillout.com'
    },
    {
      id: 'jB2qDRcXQ8Pjo1kg3jre2J',
      name: 'Which department do you work in?',
      type: 'MultipleChoice',
      value: null
    },
    {
      id: 'fFnyxwWa3KV6nBdfBDCHEA',
      name: 'How many employees work under you?',
      type: 'NumberInput',
      value: 222
    },
    {
      id: 'dSRAe3hygqVwTpPK69p5td',
      name: 'Please select a date to schedule your yearly check-in.',
      type: 'DatePicker',
      value: '2024-03-25'
    },
    {
      id: '4KC356y4M6W8jHPKx9QfEy',
      name: "Anything else you'd like to share before your call?",
      type: 'LongAnswer',
      value: 'N/a'
    }
  ],
  calculations: [],
  urlParameters: [],
  quiz: {},
  documents: []
}
```

import { Component } from '@angular/core';
import AutoSuggest from './auto_suggest/AutoSuggest'

// declare var AutoSuggest: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'intellisense';

  ngOnInit() {
    let instance  = new AutoSuggest({
      caseSensitive: false,
      // An example of on change callback, "this" will be the DOM Element in which this suggestion is appended
      onChange: function(suggestion) {
          console.log('suggestion', suggestion)
          console.log(`"${suggestion.insertHtml || suggestion.insertText}" has been inserted into #${this.id}`);
      },
      suggestions: [
        {
          trigger: '[',
          values: [
              {
                  on: [],
                  show: 'Knock sensor',
                  insertText: '[Knock sensor]',
                  insertHtml: '<a class="sensor-tag">[Knock sensor]</a>'
              },
              {
                  on: [],
                  show: 'Ignition status',
                  insertHtml: '<a class="sensor-tag">[Ignition status]</a>'
              },
              {
                  on: [],
                  show: 'Engine pressure min reading',
                  insertHtml: '<a class="sensor-tag">[Engine pressure min reading]</a>'
              }
          ]
        }, {
            // Example of using multiple characters as a trigger
            trigger: '//',
            // Example of caseSensitive option
            caseSensitive: true,
            // Example of passing values as strings
            values: ['AND', 'OR', 'NOT']
        }
      ]
  }, document.getElementById('test123'));
  }
}

### Things to remember
Some items are not SPAS, when you click on the button it 
navigates to another page, is does not click and go to a section
of the same website. To navigate in this case instead of `page.click()`,
store the url, then use `page.goto(savedUrl)`. 

Another thing to remember is that `eval` is executed in the context of the browser.

# Calendar Form for Date Input

Use this tool to build date-selector for your form-inputs.

![Visual Example](https://i.imgur.com/j3flr7y.jpg)
With this calendar, we use the benefits of `CSS Grid` to create calendar layouts. 

To use this calendar, enclose a `Text input` inside a container `div`. 
```
    <div class="date-input-container">
        <label for="calendar-form"></label>
        <input type="text" id="calendar-form">
    </div>

```

You can initiate the calendar by using the container element as the argument like `date-input-container` for example. 
```
    let calendar = new InputCalendar( document.querySelector('.date-input-container') ); 
```


If there are multiple instances of the calendar, you can use `querySelectorAll`. 
```    
    document.querySelectorAll('.date-input-container').forEach( function( elem ) {
        let calendar = new InputCalendar( elem ); 
    });
```

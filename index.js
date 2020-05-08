function InputCalendar(elem){

    this.generateCalendarShell(elem)

    this.calendarApp = elem; 
    this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
    let today = new Date(); 
    this.month = today.getMonth(); 
    this.year = today.getFullYear(); 
    //Set a counter for the month scroll buttons
    this.monthCounter = today.getMonth();
    this.yearCounter = today.getFullYear(); 
    this.widget = this.calendarApp.querySelector('.calendar') // Calendar Widget below the form
    this.widget.setAttribute("hidden", "");
    this.calendarLabel = this.calendarApp.querySelector('.calendar-header__display'); // Calendar Header displaying Month and Year
    this.formInput = this.calendarApp.querySelector(".date_form"); 
    
    //The ("0" + (today.getMonth() + 1)).slice(-2) gets you date in double digit format like 01, 02, etc
    this.formInputDate = `${("0" + (today.getMonth() + 1)).slice(-2)}/${("0" + today.getDate()).slice(-2)}/${today.getFullYear()}`
    this.formInput.value = this.formInputDate; //Enter Form with today's date

    let that = this;
    this.calendarApp.querySelectorAll('.calendar button')[1].addEventListener('click', function(){ 
        that.incrementMonth()
    });

    this.calendarApp.querySelectorAll('.calendar button')[0].addEventListener('click', function(){ 
        that.decrementMonth()
    });


    // Opens the calendar Widget
    this.formInput.addEventListener('click', function(){
        that.openCalendarWidget()
    });

    // If they user enters the date via keyboard, 
    // this eventlistener triggers a function that will help check the validity of the data
    this.formInput.addEventListener('change', function(){
        that.checkInputDateIsValid()
    });
};

InputCalendar.prototype.generateCalendarShell = function( parentElement ){
    let calenderHTML = `<div class="calendar">
                            <div class="calendar-header">
                                <button type="button" class="btn btn-left"></button>
                                <div class="calendar-header__display"></div>
                                <button type="button" class="btn btn-right"></button>
                            </div>
                            <div class="grid-container">
                                <div class="grid-days">
                                    <div>Sun</div>
                                    <div>Mon</div>
                                    <div>Tue</div>
                                    <div>Wed</div>
                                    <div>Thu</div>
                                    <div>Fri</div>
                                    <div>Sat</div>
                                </div>
                                <div class="grid-dates">
                                </div>
                            </div>

                        </div>
                        `
    parentElement.insertAdjacentHTML('beforeend', calenderHTML);
};


InputCalendar.prototype.renderCalendar = function( month, year ){
    let datesContainer = this.calendarApp.querySelector(".grid-dates")
    datesContainer.innerHTML = ''; //Clear previous rendered month dates.
    let date = (new Date(year, month));
    let firstDay = date.getDay(); //Get when first day falls in the week
    let daysInMonth = (new Date(year, month + 1, 0)).getDate(); // No of days in months

    // Fill the empty cells in the Calendar without dates
    for (let i = 0; i < firstDay; i++) {
        datesContainer.insertAdjacentHTML("beforeend", `<div></div>`);
    }

    // Start filling the dates themselves
    for (let date = 1; date <= daysInMonth; date++){
        let html = `<div data-date=${("0" + (month + 1)).slice(-2)}/${("0" + date).slice(-2)}/${year}>${date}</div>`
        datesContainer.insertAdjacentHTML("beforeend", html);
    }
    
    // Add Click Eventlistener that will trigger a date change in the form
    let that = this;
    this.calendarApp.querySelectorAll('.grid-dates div').forEach( elem => elem.addEventListener('click', function(e){
        that.changeFormDate(e);
    }));

    //Change the calendar Label Text
    this.calendarLabel.innerText = `${this.months[date.getMonth()]}, ${year}`;
};

//For those dates that are directly typed from the keyboard. This is triggered onChange
InputCalendar.prototype.checkInputDateIsValid = function(){

    let checkDate = new Date(event.target.value); 
    /* Running the above returns a date or an Invalid Date Object
        Convert the object to a string to check if it's an invalid date. 
        The parameter following the or(||) checks to see if the year in 
        the input is lesser than 2000

        If the input is invalid, return to the previously valid input date
    */
    if ( checkDate.toString() === 'Invalid Date' ||  checkDate.getFullYear() < 2000 ){
        this.formInput.value = this.formInputDate;
        return;
    }

    /* If the user input is valid, the below code applies a proper 
        MM/DD/YYY formatting to it. 
    */
    let date = event.target.value.split("/");
    date[0] = ('0' + date[0]).slice(-2)
    date[1] = ('0' + date[1]).slice(-2)
    if (date[2].length === 2) {
        // If the input format is 12/12/20 then we will convert it to 12/12/2020
        date[2] = '20' + date[2];
    }
    this.formInput.value = date.join('/');

    // Update the month and year values to the ones entered in the form
    this.month = date[0] - 1;
    this.year = date[2];

    //Update the counter button to reflect the inputted value
    this.monthCounter = this.month;
    this.yearCounter = this.year;
    

    this.renderCalendar(this.monthCounter, this.yearCounter);
};


//  The below two are the buttons for scrolling the calendar. The yearCounter and the monthCounter are variables specifically for these. 
InputCalendar.prototype.openCalendarWidget = function(){
    document.querySelectorAll(`.calendar[hidden]`).forEach( elem => elem.setAttribute("hidden", ""));
    // This is incase the month scroll buttons are pressed and the calendar render has to be set to the dates in the form
    this.monthCounter = this.month;
    this.yearCounter = this.year;
    this.renderCalendar(this.monthCounter, this.yearCounter);
    this.widget.removeAttribute("hidden");

}

// Set the dates via the calendar widget. The widget closes after the update. So, the openCalendarWidget will take care of the counter values
InputCalendar.prototype.changeFormDate = function(e){
    this.formInputDate = e.target.dataset.date;
    let date = new Date( this.formInputDate )
    this.widget.removeAttribute("hidden");
    this.formInput.value = this.formInputDate;
    this.month = date.getMonth();
    this.year = date.getFullYear();
}

InputCalendar.prototype.incrementMonth = function(){
    this.monthCounter = this.monthCounter + 1;
    if ( this.monthCounter > 11 ) {
        this.yearCounter = this.year + 1 ;
        this.monthCounter = 0;
    }
    this.renderCalendar(this.monthCounter, this.yearCounter);
}

InputCalendar.prototype.decrementMonth = function(){
    this.monthCounter = this.monthCounter - 1;
    if ( this.monthCounter < 0 ) {
        this.yearCounter = this.year - 1 ;
        this.monthCounter = 11;
    }
    this.renderCalendar( this.monthCounter, this.yearCounter );
}


document.addEventListener('click', function(){
    // if ( document.querySelectorAll(`.calendar[hidden]`).length === 0 ) { return };
    if( !event.target.parentElement.classList.contains('date-input-container')
     && !event.target.parentElement.classList.contains('calendar-header')
    ){
        document.querySelectorAll(`.calendar`).forEach( elem => elem.setAttribute("hidden", ""));
    };
});

document.querySelectorAll('.date-input-container').forEach( function( elem ) {
    let calendar = new InputCalendar( elem );
});

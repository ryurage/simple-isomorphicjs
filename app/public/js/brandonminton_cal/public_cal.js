var calProto = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    obj: 'body'
};
var QuickCal = function(obj, month, year) {
    var cal = cal = Object.create( calProto ); // our factory function
    
    // public variables
    cal.month = month || cal.month;
    cal.year = year || cal.year;
    cal.html = '';
    
    // private variables
    var daysInMonth = new Date(cal.year, cal.month, 0).getDate(),
        firstDay = new Date(cal.year, cal.month, 1).getDay(),
        tempDays = firstDay + daysInMonth,
        weeksInMonth = Math.ceil(tempDays / 7),
        obj = obj || cal.obj;

    cal.shortMonth = new Date(cal.year + ',' + cal.month + ',' + cal.day).toDateString().substr(4,3);
    
    // private methods
    var calendarArray = function () {
        var month = cal.month,
            year = cal.year,
            day = cal.day,
            week = [],
            // get first day of the month
            fillArray = function () {
                // create a 2-d array
                var counter = 0;
                for(var j = 0; j < weeksInMonth; j++) {
                    week[j] = new Array();
                    for(var i=0;i<7;i++) {
                        counter++;
                        week[j][i] = new Array();
                        week[j][i] = counter; 
                        // offset the days
                        week[j][i] -= firstDay;
                        if ((week[j][i] < 1) || (week[j][i] > daysInMonth)) {	
                            week[j][i] = "";
                        }
                    }
                }	
                return week;
            };
        return fillArray();
    };
    var handleControls = function() {
        var decYear = cal.year - 1,
            incYear = cal.year + 1,
            decMonth = cal.month - 1,
            incMonth = cal.month + 1,
            theMonth = cal.month,
            theYear = cal.year;
		
        $('.prevYear').click( function(e) {
            e.preventDefault();
            QuickCal(obj, cal.month, decYear);
        });
         $('.nextYear').click( function(e) {
            e.preventDefault();
            QuickCal(obj, cal.month, incYear);
        });
         $('.prevMonth').click( function(e) {
            e.preventDefault();
             if (cal.month === 1) {
                theMonth = 12;
                theYear = decYear;
             } else {
                 theMonth = decMonth;
             }
            QuickCal(obj, theMonth, theYear);
        });
        $('.nextMonth').click( function(e) {
            e.preventDefault();
             if (cal.month === 12) {
                 theMonth = 1;
                 theYear = incYear;
             } else {
                 theMonth = incMonth;
             }
             QuickCal(obj, theMonth, theYear);
        });
        
        return false;
    };
    
    // public methods
    cal.createHeader = function() {
        var day = cal.day,
            month = cal.month,
            year = cal.year,
            headerTitle = cal.shortMonth + ' ' + year;
            cal.html = '<table cellspacing="0" cellpadding="0" class="calendar">' +
            '<tr>' +
            '<th class="header">&nbsp;<a href="" class="headerNav prevYear" title="Previous Year"><<</a></th>' +
            '<th class="header">&nbsp;<a href="" class="headerNav prevMonth" title="Previous Month"><</a></th>' +
            '<th colspan="3" class="header">' + headerTitle + '</th>' +
            '<th class="header"><a href="" class="headerNav nextMonth" title="Next Month">></a>&nbsp;</th>' +
            '<th class="header">&nbsp;<a href="" class="headerNav nextYear" title="Next Year">>></a></th>' +
            '</tr>' +
            '';
        return this;
    };
    cal.createBody = function() {
		// start rendering table
        var weekArr = calendarArray(),
            proto = cal.__proto__;
		cal.html += "<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>Th</th><th>F</th><th>S</th></tr>";
		for(var j = 0; j < weeksInMonth; j++) {
            
			cal.html+= "<tr>";
			for (var i = 0; i < 7; i++) {
				// if today
                var cellValue = weekArr[j][i],
                    aclass = (cal.day == cellValue && proto.month == cal.month && proto.year == cal.year) ? ' class="today"' : '';
                //cellValue = (cellValue < 10 && (toString.call(cellValue) == '[object Number]')) ? '0' + cellValue : cellValue;
                cal.html+= '<td' + aclass + '>' + cellValue + '</td>';
                }
            cal.html += '</tr>';
		}

        $('.today').on('click', function() {
            $.ajax({
                url: "/save",
                type: "POST",
                dataType: "json",
                data: {objectData: {blah: 'test'}},
                contentType: "application/json",
                cache: false,
                timeout: 5000,
                complete: function() {
                  //called when complete
                  console.log('process complete');
                },

                success: function(data) {
                  console.log(data);
                  console.log('process sucess');
               },

                error: function() {
                  console.log('process error');
                },
              });
        });
        return this;
	};
    cal.createFooter = function() {
        var proto = cal.__proto__,
            shortMonth = new Date(proto.year + ',' + proto.month + ',' + proto.day).toDateString().substr(4,3);
		cal.html += '<tr><td colspan="7" class="footer"><a href="" class="footerNav">Today is ' + shortMonth + ' ' + proto.day +',  ' + proto.year + '</a></td></tr></table>';
        
        return this;
	};
    cal.render = function() {
        if (obj !== 'window') {
            $('.' + obj).html(cal.html);
        } else {
            $(obj).html(cal.html);
        }
        handleControls();
        return this;
    };
    
    return cal.createHeader().createBody().createFooter().render();
};
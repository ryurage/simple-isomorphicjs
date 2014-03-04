$(function () {

	// Create a Calendar!
    var d = new Date();
    var cali = QuickCal('cal1', d.getMonth()+1, d.getFullYear());
    var jsontest = '{"day":"3","month":"2","year":"2014","link":"www.google.com","descript":"tester","what":"big party","start_time":"9pm","end_time":"1am","start_date":"2-24-2014","end_date":"2-25-2014","location":"my house","repeat_interval":"does not repeat"}';

    $('.today').on('click', function() {
        $.ajax({
            url: "/save",
            type: "POST",
            dataType: "json",
            data: jsontest,
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

});
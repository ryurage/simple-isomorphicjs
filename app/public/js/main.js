$(function () {

    $('.close').click(function () {
        $('.tab-content').hide();
    });

    
    var items = $('.cover-menu li').each(function (index, el) {
    	href = $(el).children().first().attr('href'),
    	url = document.location.pathname.split("/")[1];
    	if (href.charAt(0) == "/") href = href.substr(1);
    	$(el).removeClass('current');
    	if (url === href) {
            console.log(href)
            $(el).addClass('current');
		} else if (href === 'home'){
            $(el).addClass('current');
        }
        

        $(this).click(function (e) {
        	//e.preventDefault();
            //remove previous class and add it to clicked tab
            items.removeClass('current');
            $(this).addClass('current');

            //if (string.charAt(0) == "/") string = string.substr(1);

            //hide all content divs and show current one
           // $('.menu>div.tab-content').hide().eq(items.index($(this))).show('fast');

            window.location.hash = $(this).attr('tab');
        });
    });

    if (location.hash) {
        showTab(location.hash);
    } else {
        showTab("tab1");
    }

    function showTab(tab) {
        //$(".menu li:[tab*=" + tab + "]").click();
    }

    // Bind the event hashchange, using jquery-hashchange-plugin
    /*$(window).on('hashchange', function() {
        showTab(location.hash.replace("#", ""));
    });

    // Trigger the event hashchange on page load, using jquery-hashchange-plugin
    $(window).hashchange();*/

    // Create a Calendar!
    var cali = QuickCal('cal1', 2, 2014);
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
//$(document).ready(myFunction);
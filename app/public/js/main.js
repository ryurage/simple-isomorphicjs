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
    var d = new Date();
    var cali = QuickCal('cal1', d.getMonth()+1, d.getFullYear());
});
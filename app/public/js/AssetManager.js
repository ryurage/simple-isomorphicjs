$(function () {
    var $form_page = $('.form-page'),
        UPLOAD_DIR = '/uploads/',
        asset_obj = {},
        $asset_queue_markup = $('<div class="asset-queue transition"><span class="queue-title">Queue: </span></div>'),
        img_form = ''+
        '<div class="form-container transition"><form class="asset-form" action="">'+
            '<div class="inpDiv">'+
                '<input type="file" class="imgInp" />'+
                '<input type="button" class="rm-img" value="Remove" />'+
            '</div>'+
            '<div class="img-loader-middle">'+
                '<div class="or-spacer-vertical left">'+
                    '<div class="mask"></div>'+
                '</div>'+
                '<img class="img-loader-image" src="#" alt="your image" />'+
                '<div class="or-spacer-vertical right">'+
                    '<div class="mask"></div>'+
                '</div>'+
            '</div>'+
            '<div class="img-loader-right">'+
                '<div class="loader-right-txt">Title</div><input type="text" name="img_title" />'+
                '<div class="loader-right-txt">Caption</div><textarea name="img_caption" />'+
                '<div class="loader-right-txt">Alternative Text</div><input type="text" name="img_alttext" />'+
                '<div class="loader-right-txt">Credit</div><input type="text" name="img_credit" />'+
                '<div class="loader-right-txt">Date Picture Taken</div><input type="text" name="img_datetaken" />'+
                '<div class="loader-right-txt">Classes</div><input type="text" name="img_classes" />'+
                '<div class="loader-right-txt">Tags</div><input type="text" name="img_tags" />'+
                '<input class="img-submit" type="submit" value="Submit">'+
            '</div>'+
        '</form></div>',
        $modal = $(''+
            '<div class="modal transition">'+
                 '<a class="modal-close"></a>'+
                 '<h1></h1>'+
                 '<div class="modal-content"></div>'+
            '</div>'),
        $asset_manager = $(''+
            '<div class="am-type am-images"><a href="#" class="am-images-open">Images</a></div>'+
            '<div class="am-type am-maps">Maps</div>'+
            '<div class="am-type am-video-links">Video Links</div>'),
        AssetQueue = function(){ 
            var asset_array = [],
                asset_queue = Object.create({}),
                $assets_div = $('.assets-queue').length ? $('.assets-queue') : $('.assets-queue').prependTo('modal-content');

            asset_queue.add = function(asset_name, img_url){
                if (asset_array.length === 0) {
                    $asset_queue_markup.prependTo('.modal-content');
                    $('.asset-manager-inp').after($asset_queue_markup.clone());
                }
                if ($.inArray(asset_name, asset_array) === -1) {
                    asset_array.push(asset_name);
                    var new_node = $('<div class="asset-queue-item dragger"><a class="asset-remove"></a><img class="asset-thumb" data-asset-name="'+asset_name+'" src="'+img_url+'" /></div>');
                    $('.asset-queue').append(new_node).fadeIn(500);
                }
            };
            return asset_queue;
        },

        /* Private functions */
        readURL = function(input, $el) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $el.attr('src', e.target.result);
                    $el.parent().fadeIn(1000).next().fadeIn(1000);
                }
                reader.readAsDataURL(input.files[0]);
            }
        },
        rmForm = function($form){
            $form.addClass(function(){
                $(this).css({'opacity': 0, 'margin-top': (-1 * $(this).outerHeight(true))+'px'});
                return 'animate';
            }).postTransition(function() {
                $form.remove(); 
            });
        },
        displayModal = function($el, title, content) {
            $el.css({'opacity': 1, 'margin-top': 0});
            $el.find('h1').text(title);
            $el.find('.modal-content').append(content);
            $el.css({'top':'20px'});
        },
        inputStuff = function($el, $box) {
            var img_link = UPLOAD_DIR + $el.find('img').data('asset-name'),
                img_txt = ' <img src="'+img_link+'" class="asset-left" />';
            $box.val($box.val() + img_txt);
            $el.removeAttr('style').removeClass('dragger');
        },
        removeAsset = function(){
            console.log('asset_obj: ',JSON.stringify(asset_obj));
        };


        /* Create the Asset Queue */
        var asset_queue = asset_queue || AssetQueue();

    /* Dynamic elements appended to the body */
    $('<div class="overlay transition" />').prependTo('body');
    $modal.prependTo($('body')).center(false, -200);
    $('body').on('change', '.imgInp', function (event) {
        var $form = $(this).parent().parent().parent(),
            $clone = $form.clone(),
            $el = $form.find('.img-loader-image'),
            $rm_img_btn = $(this).next();
            inp = this;       
        readURL(inp, $el);
        $rm_img_btn.fadeIn(500);
        $('.asset-container:last').after($clone);
    });

    /* Event handlers */ 
    $('input[name=asset_manager]').on('click', function(e){
        e.preventDefault();
        $('.overlay').addClass('overlay-show');
        displayModal($('.modal'), 'Asset Manager', $asset_manager);
        return false;
    });
    $('.modal-close').on('click', function(){
        $('.modal').css({'opacity': 0, 'margin-top': (-1 * ($(this).parent().outerHeight(true)+20))});
        $('.overlay').removeClass('overlay-show');
    });
    $form_page.on('submit', function(e){
        e.preventDefault();
        $('<input/>',{type:'hidden',name:'asset_obj',value:JSON.stringify(asset_obj, null, 2)}).appendTo($form_page);
        this.submit();
    });

    /* Delegated event handlers */
    $('body').on('click', '.img-submit', function(e){ // handle IMAGES
        e.preventDefault();
        var result_obj = {},
            $right_side = $(this).parent();
            $img_input = $right_side.prev().prev().find('.imgInp'),
            $img_input_clone = $img_input.clone(),
            img_name = $img_input.val().replace("C:\\fakepath\\", ""),
            img_type = img_name.substr( (img_name.lastIndexOf('.') +1) ),
            $this_form = $(this).closest('.form-container'),
            img_url =  $this_form.find('.img-loader-image').attr('src'),
            $elements = $(this).parent().children('input, select, textarea');
        result_obj['img_name'] = img_name;
        result_obj['img_type'] = img_type;
        $img_input.attr('name', img_name.substring(0, img_name.indexOf('.'))); // give the input a name and make it the filename minus the file type
        $.each($elements, function(idx, val){
            if (val.value !== ''){
                result_obj[val.name] = val.value.replace(/(['"])/g, "\\$1"); // escape quotes
            }
        });
        delete result_obj[""];  // remove the submit button key value
        rmForm($this_form);
        asset_queue.add(img_name, img_url);
        asset_obj['images'] = (asset_obj.hasOwnProperty('images')) ? asset_obj['images'] : [];
        asset_obj.images.push(result_obj);
        $img_input.clone().insertAfter($img_input); // put a clone of the file input in the original file input's spot
        $img_input.hide().prependTo($form_page)  // append the real input to the actual form that will be submitted
    });
    $('body').on('click', '.rm-img', function(e){
        e.preventDefault();
        var $this_form = $(this).closest('.form-container');
        rmForm($this_form);
    });
    $('body').on('click', '.am-images-open', function(e){
        e.preventDefault();
        $(img_form).appendTo($(this).parent());
    });
    $('body').on({
        mousedown: function(e) {
            $(this).addClass('draggable').parents().on('mousemove', function(e) {
                $('.draggable').offset({
                    top: e.pageY - $('.draggable').outerHeight() / 2,
                    left: e.pageX - $('.draggable').outerWidth() / 2
                }).on('mouseup', function() {
                    $(this).removeClass('draggable');
                });
            });
            e.preventDefault();
        },
        mouseup: function(e) {
            var dropOffBox = $form_page.find('textarea[name="text"]');
            $(this).dragAction(dropOffBox,inputStuff);
            $('.draggable').removeClass('draggable');
        }
    }, '.dragger');
    $('body').on('click', '.asset-remove', function(){
        removeAsset();
    });
});
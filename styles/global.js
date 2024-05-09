(function ($){

    let hash = window.location.hash;
    if(hash != ''){
        $('#mainNav #navbarNavDropdown .transformative-reactions-contact-link').addClass('active');
        var $target = $('#contact');
        var targetOffset = $target.offset().top-101;
        $('html,body').animate({
            scrollTop: targetOffset
        },
        500);
    }else{
        let pathname = window.location.pathname;
        if(pathname.indexOf('transformative-reactions') !== -1){
            $('#mainNav #navbarNavDropdown .transformative-reactions-link').addClass('active');
        }else if(pathname.indexOf('into-solutions') !== -1){
            $('#mainNav #navbarNavDropdown .into-solutions-link').addClass('active');
        }
    }

    $('.transformative-reactions .transformative-reactions-contact-link').on('click', function(){
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > $('.navbar').height()){
            $('#mainNav').addClass('scrollBg');
        } else {
            $('#mainNav').removeClass('scrollBg');
        }
    });

    $('a[href*=#],area[href*=#]').click(function() {
        // if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        //     var $target = $(this.hash);
        //     // console.log($target);
        //     $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
        //     if ($target.length) {
        //         var targetOffset = $target.offset().top - 101;
        //         $('html,body').animate({
        //             scrollTop: targetOffset
        //         },
        //         500);
        //         return false;
        //     }
        // }
        var $target = $('#contact');
        var targetOffset = $target.offset().top-101;
        $('html,body').animate({
            scrollTop: targetOffset
        },
        500);
    });
    
    $('body').on('click', '.sel-item', function(){
        if(!$(this).hasClass('active')){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    });

    function add_loading( selector ) {
        $( selector ).prop('disabled', true);
        $( selector ).append(' <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
    }

    function remove_loading( selector ) {
        $( selector ).prop('disabled', false);
        $( selector ).find( '.spinner-border' ).remove();
    }

    $('body').on('click', '.send-btn',function(){
        $('.success-msg').css('display','none');
        $('.error-msg').css('display','none');
        add_loading('.send-btn');
        var name = $('#yourname').val();
        var phone_number = $('#phone_number').val();
        var email_address = $('#email_address').val();
        var other = $('#other').val();
        var interested_engaging = [];
        var flag = true;
        if(name == ''){
            $('#your_name_error').css('display', 'block');
            flag = false;
        }
        if(phone_number == ''){
            $('#phone_number_error').css('display', 'block');
            flag = false;
        }
        if(email_address == ''){
            $('#email_error').css('display', 'block');
            flag = false;
        }

        $('.sel-item.active').each(function(){
            interested_engaging.push($(this).attr('data-value'));
        });
        if(interested_engaging.length > 0){
            interested_engaging = interested_engaging.toString();
        }

        if(flag){
            $.post(
                Ajax.ajaxurl,
                {
                    action: 'save_user_detail',
                    data: {
                        name: name,
                        phone_number: phone_number,
                        email_address: email_address,
                        interested_engaging: interested_engaging,
                        other: other
                    },
                    _ajax_nonce: Ajax.nonce,
                },
                function (response) {
                    remove_loading('.send-btn');
                    response = JSON.parse(response);
                    // console.log(response);
                    if(response.status){
                        $('.success-msg').css('display','block');
                    }
                }
            );
        }else{
            remove_loading('.send-btn');
        }
    });

    $('body').on('click', '.chatpanel .close', function(){
        $('.chatpanel').removeClass('active');
    });

    $('body').on('click', '.chaticon', function(){
        if($('.chatpanel').hasClass('active')){
            $('.chatpanel').removeClass('active');
        }else{
            $('.chatpanel').addClass('active');
        }
    });


    var dropArea = $('#drop_area');
    dropArea.on('dragenter', function(e){
        e.stopPropagation();
        e.preventDefault();
        dropArea.addClass('drag-enter');
    })
    .on('dragleave', function(e){
        e.preventDefault();
        dropArea.removeClass('drag-enter');
    })
    .on('dragover', function(e){
        e.stopPropagation();
        e.preventDefault();
    })
    .on('drop', function(e){
        e.stopPropagation();
        e.preventDefault();
        dropArea.removeClass('drag-enter');

        var file = e.originalEvent.dataTransfer.files[0]; // 获取拖拽的文件
        console.log(file.name);
        var formData = new FormData(); // 创建FormData对象
        formData.append('file', file); // 将文件添加到FormData对象中

        console.log(formData);
    });

    $('body').on('click', '.pdfList .delete-btn', function(){
        console.log('delete');
    });

    
})(jQuery)

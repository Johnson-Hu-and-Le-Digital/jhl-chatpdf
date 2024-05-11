(function ($){
    
    // $('body').on('click', '.sel-item', function(){
    //     if(!$(this).hasClass('active')){
    //         $(this).addClass('active');
    //     }else{
    //         $(this).removeClass('active');
    //     }
    // });

    function add_loading( selector ) {
        $( selector ).prop('disabled', true);
        $( selector ).append(' <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
    }

    function remove_loading( selector ) {
        $( selector ).prop('disabled', false);
        $( selector ).find( '.spinner-border' ).remove();
    }

    // $('body').on('click', '.send-btn',function(){
    //     $('.success-msg').css('display','none');
    //     $('.error-msg').css('display','none');
    //     add_loading('.send-btn');
    //     var name = $('#yourname').val();
    //     var phone_number = $('#phone_number').val();
    //     var email_address = $('#email_address').val();
    //     var other = $('#other').val();
    //     var interested_engaging = [];
    //     var flag = true;
    //     if(name == ''){
    //         $('#your_name_error').css('display', 'block');
    //         flag = false;
    //     }
    //     if(phone_number == ''){
    //         $('#phone_number_error').css('display', 'block');
    //         flag = false;
    //     }
    //     if(email_address == ''){
    //         $('#email_error').css('display', 'block');
    //         flag = false;
    //     }

    //     $('.sel-item.active').each(function(){
    //         interested_engaging.push($(this).attr('data-value'));
    //     });
    //     if(interested_engaging.length > 0){
    //         interested_engaging = interested_engaging.toString();
    //     }
    //     console.log(flag);
    //     if(flag){
    //         remove_loading('.send-btn');
    //         var array = {};
    //         array['name'] = name;
    //         array['phone_number'] = phone_number;
    //         array['email_address'] = email_address;
    //         array['other'] = other;
    //         array['interested_engaging'] = interested_engaging;
    //         console.log(array);
    //         // $.post(
    //         //     Ajax.ajaxurl,
    //         //     {
    //         //         action: 'save_user_detail',
    //         //         data: {
    //         //             name: name,
    //         //             phone_number: phone_number,
    //         //             email_address: email_address,
    //         //             interested_engaging: interested_engaging,
    //         //             other: other
    //         //         },
    //         //         _ajax_nonce: Ajax.nonce,
    //         //     },
    //         //     function (response) {
    //         //         remove_loading('.send-btn');
    //         //         response = JSON.parse(response);
    //         //         // console.log(response);
    //         //         if(response.status){
    //         //             $('.success-msg').css('display','block');
    //         //         }
    //         //     }
    //         // );
    //     }else{
    //         remove_loading('.send-btn');
    //     }
    // });


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

        var file = e.originalEvent.dataTransfer.files[0];
        var fileName = file.name;
        // console.log(file.name);
        var formData = new FormData(); 
        formData.append('file', file); 
        // console.log(formData);
        
        var html = '<div class="pdfList" id="'+fileName+'">'+
                '<hr />'+
                '<div class="pdf-file flist"><span class="before"></span> '+fileName+' <span class="after delete-btn"></span></div>'+
            '</div>';
        $('.pdfListBox').append(html);
    });

    $('body').on('click', '.pdfList .delete-btn', function(){
        console.log('delete');
        $(this).parent().parent().remove();
    });

    
})(jQuery)

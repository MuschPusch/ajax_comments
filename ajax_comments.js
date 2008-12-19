commentbox = ".comment";
form_always_opened = false;
rows_in_reply = 2;
rows_default = 5;

// prepare the form when the DOM is ready 
$(document).ready(function() { 
  initAjaxComments();
});


function initForm(action,rows){
  //resizing textarea
  $('#comment-form textarea').attr('rows',rows);
  $('#comment-form textarea').attr('value','');
  
  
  //clearing form
  $('#comment-form-content #comment-preview').empty();
  $('#comment-form .error').removeClass('error');
  
  // if user is not anonimous, getting the proper form token
  if ($('#comment-form #edit-form-token').get(0)) {
    //disabling buttons while loading tokens
    $('.form-submit').attr('disabled','true');

    //specially for Opera browser
    a1 = action.replace('http://','');
    //getting token params
    var arr = a1.split('/');
    if (!arr[4]) arr[4] = '';
    arr = 'comment' + arr[3] + arr[4];
    //sending ajax call to get the token
    var token = 0;
    $.ajax({
      type: "GET",
      url: "/get_token/"+arr,
      success: function(msg){
        // if token received, going to step 2
        token = msg;
        initForm_Step2(token,action,rows);
      }
    });
  }
  else
    initForm_Step2('',action,rows)

  //show after all was done
  $('#comment-form-content').animate({height:'show'});

}

function initForm_Step2(token,action,rows){
    if (token) {
      $('#comment-form #edit-form-token').attr('value',token);
    }
    
    $('#comment-form textarea').focus();

    //setting a new action for form
    $('#comment-form').attr('action',action);
    //reinitializing ajax-submit
    $('#comment-form').removeClass('ajaxsubmit-processed');
    
    $('.form-submit').removeAttr('disabled');
}


function initAjaxComments(){
  if ($('#comment-form')) {
    var options = { 
        beforeSubmit:  showRequest,  // pre-submit callback 
        success:       showResponse,  // post-submit callback 
        dataType:  'json',
        semantic: true
    }; 
    // bind form using 'ajaxForm' 
    $('#comment-form').ajaxForm(options);


    //initializing "Reply" links
    $('a.comment_reply').click(reply_click);
    
    //initializing main form
    action = $('#comment-form').attr('action');
    
    title = $('#comment-form').parents(".box").children("h2,h3").html();
    $('#comment-form').parents(".box").children("h2,h3").html('<a href="'+action+'" id="comment-form-title">'+title+'</a>');
    $('#comment-form').parents(".box").children(".content").attr('id','comment-form-content');
    
    
    page_url = document.location.toString();
    fragment = '';
    if (page_url.match('#'))
      fragment = page_url.split('#')[1];
    
    if ((fragment != 'comment-form')&&(!form_always_opened)) {
      $('#comment-form-content').hide();
    }
    else {
      $('#comment-form-title').addClass('pressed');
    }
    
    $('#comment-form-title').click(reply_click);
  }
}

function reply_click() {
  if ($(this).is('.pressed')){
  }
  else {
    if ($(this).is('#comment-form-title')) {
      $('#comment-form-content').after('<div style="height:' + $('#comment-form-content').height() + 'px;" class="sizer"></div>');
      $('.sizer').slideUp(500,function(){$(this).remove();});

      $(this).parent().after($('#comment-form-content'));

      rows = rows_default;
    }
    else {
      $('#comment-form-content').after('<div style="height:' + $('#comment-form-content').height() + 'px;" class="sizer"></div>');
      $('.sizer').slideUp(500,function(){$(this).remove();});

      $(this).parents(commentbox).after($('#comment-form-content'));
      rows = rows_in_reply;
    }

    $('#comment-form-content').hide();
    initForm($(this).attr('href'),rows);
    $('.pressed').removeClass('pressed');
    $(this).addClass('pressed');
  } 
  return false;
}

// pre-submit callback 
function showRequest(formData, jqForm, options) { 
  $('#comment-preview').fadeTo('fast', 0.1, function(){
    $('#comment-preview').html('<div class="progress"><div class="bar"></div></div>');
    $('#comment-preview').fadeTo('fast',1);
  });

  // here we could return false to prevent the form from being submitted; 
  // returning anything other than false will allow the form submit to continue 
  return true; 
} 

 
// post-submit callback 
function showResponse(responseText, statusText)  {
  if (responseText.data.message)
    text = responseText.data.message;
  else
    text = responseText.data.preview;
  
  if ((responseText.data.captcha)||(responseText.data.token)){
    $('.captcha').html($(responseText.data.captcha).html());
  }
  
  if (responseText.data.destination != ''){
    if ($('#comment-form-title').is('.pressed')){
      $('#comment-form-content').parents('.box').before(text);
    }
    else{
      $('#comment-form-content').before(text);
    }

    //initializing new "Reply" link
    $('a.comment_reply').click(reply_click);

    $('#comment-form-content').animate({height:'hide',opacity:'hide'});
    
    //$('.pressed').removeClass('pressed');
  }
  else {
    $('#comment-preview').fadeTo('fast',0.1,function(){
      $('#comment-preview').html(text);
      $('#comment-preview').fadeTo('fast',1);
    });
  }
}


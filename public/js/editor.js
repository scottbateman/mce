requirejs.config({
   baseUrl: '/js/lib'
   , paths: {
      "ace": "ace/lib/ace"
      , "bcsocket": "/channel/bcsocket"
      , "shareJS": "sharejs/share"
      , "sharejs_ace": "sharejs/ace"
      , "ace_java": "ace/mode/java"
      , "jquery": "jquery/jquery-2.1.1.min"
   }
   , shim: {
      "bcsocket": {
         exports: "BCSocket"
      }
      , "shareJS": {
         exports: "sharejs"
         , deps: ["bcsocket"]
      }
      , "sharejs_ace": {
         deps: ["ace/ace", "shareJS"]
      }
      , "ace_java": {
         deps: ['ace/ace']
      }
   }
});

requirejs(['ace/ace', 'shareJS', 'bcsocket', 'sharejs_ace','jquery'],
   function(ace, sharejs) {
      var editor = ace.edit('editor');
      editor.setTheme('ace/theme/twilight');
      editor.getSession().setMode('ace/mode/java');

      sharejs.open('editor', 'text', function(error, doc) {
          var id;
          xmlhttp = new XMLHttpRequest();
          xmlhttp.open("GET","http://localhost:8950/user", true);
          xmlhttp.onreadystatechange=function(){
              if (xmlhttp.readyState==4 && xmlhttp.status==200){
                  id=xmlhttp.responseText;
              }
          }
          xmlhttp.send();

              doc.on('remoteop', function(op) {
                  console.log(doc.cursor);
                  var pos = editor.getCursorPosition();
                  console.log(pos);
                  console.log(op);
                  //editor.getSession().addMarker(range,"ace_selected_word", "text");
                  $('.ace-twilight .ace_cursor').css("color","white");
                  var cursorSpot = $('.ace_cursor').position();
                  var x = cursorSpot.left + 79;
                  var y = cursorSpot.top + 103;
                  if($('#name-label').length){
                      $('#name-label').css("left",x);
                      $('#name-label').css("top",y);
                  }
                  else{
                      $('body').append('<div id="name-label" style="position: absolute;color: red;background-color: #ffffff;left: '+x+'px;top: '+y+'px;z-index: 100;">'+id+'</div>');
                  }
              });


         doc.attach_ace(editor);
      });
       var dataDoc = {};

       $('#editor').keyup(function(){
           var cursorSpot = $('.ace_cursor').position();
           var x = cursorSpot.left + 79;
           var y = cursorSpot.top + 103;
           dataDoc.x = x;
           dataDoc.y = y;
           console.log(x+"--"+y);
       });
       sharejs.open('dataDoc','text',function(error,doc){
           console.log(doc);

           doc.on('remoteop',function(op){
               console.log("json object update");
               console.log(op)
            });


       });

   }
);

var console_window = null;
var console_init_timer = null;
var random_str = null;
function console_launch(){
  
         function randomstring(){
                  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
                  var ret = '';
                  for (var i=0; i<8; i++) {
                      var rnum = Math.floor(Math.random() * chars.length);
                      ret += chars.charAt(rnum);
                  }
                  return ret;
         }  
  random_str = randomstring();
  if (!console_window){
     console_window = window.open("console.html?id="+random_str,"Console",'width=1000,height=600,resizable,scrollbars=yes');
  }
}
var console_cache = Array();
function console_write(str){

         function write_line(elem,text){
                  var child = console_window.document.createElement('span');
                  child.className = "console-element";
                  var text_elem = console_window.document.createTextNode(text);
                  child.appendChild(text_elem);
                  elem.appendChild(child);
                  var br = console_window.document.createElement('br');
                  elem.appendChild(br);
                  elem.scrollTop = elem.scrollHeight;
         }
         function dump_cache(elem){
           for (var i=0; i<console_cache.length; i++){
               write_line(elem,console_cache[i]);
           }         
           console_cache = Array();
         }
  var timer = null;
  if (console_window && console_window.document){
     elem = console_window.document.getElementById('log-output'+random_str);
     if (elem){
        if (console_cache.length>0){
           dump_cache(elem);
        }
        write_line(elem,str);
        
     } else {
        //the window's not built yet so cache the text
        console_cache.push(str);
        timer = setInterval(
                  function(){
                    elem = console_window.document.getElementById('log-output'+random_str);
                    if (elem){
                       if (console_cache.length>0){
                          dump_cache(elem);
                       } else {
                          clearInterval(timer);
                       }   
                    }
                  },100);
     }
  }
}
  

function console_dump_obj(label,obj){
  var string = label+" "+JSON.stringify(obj);
  console_write(string);
}

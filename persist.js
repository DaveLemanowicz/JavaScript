//-------------------------------------------------------------------
//  persist.js - a client side persistance framework
//              backed by cookies
// 
//  It can store scalars or arrays of scalars
//
//
//  The values are always stored and returned as strings. Usually 
//  that's not a problem as javascript will convert as needed and
//  I find I most often save strings anyway.
//
//-------------------------------------------------------------------
//Client-side cookie manipulation
function createCookie(name,value,days)
{
  if (days)
  {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name)
{
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++)
  {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name)
{
  createCookie(name,"",-1);
}

//-------------------------------------------------------------------
//
function ClientSideStorage(storageName){
  var storage = null;
  var error_string = "";
  var theName = storageName;
  var days = 1000;

  storage = new Object();
  //some javascript libraries add extra properties to objects.  We need to remove
  //them all from the storage object
  for (var i in storage){
      delete storage[i];
  }
  
  try { //You might not be able to trust the values in the cookes so watch for exceptions
      parse(readCookie(theName));
  } catch (errstring){
      error_string = errstring;
  }
  //-------------------------------------------------------
  // clear
  // clears the value from a cookie in memory but does
  // not alter the cookie on disk.  To change the cookie
  // on disk you must save after clearing.
  //-------------------------------------------------------
  this.clear = function(){
    storage = new Object();
    //some javascript libraries add extra properties to objects.  We need to remove
    //them all from the storage object
    for (var i in storage){
        delete storage[i];
    }
  }
  //-------------------------------------------------------
  // contains
  //-------------------------------------------------------
  this.contains = function(name){
    if (name in storage){
       return true;
    } else { //it might be an array
       return  name+"*" in storage;
    }
  }
  //-------------------------------------------------------
  // remove cookie behind the storage.
  //-------------------------------------------------------
  this.eraseCookie = function(){
    eraseCookie(theName);
  }
  //-------------------------------------------------------
  // put
  //-------------------------------------------------------
  this.put = function(name,value){
    storage[name]=value;
    return this;
  }
  //-------------------------------------------------------
  // get
  //-------------------------------------------------------
  this.get = function(name){
    return storage[name];
  }
  //-------------------------------------------------------
  // get default
  //-------------------------------------------------------
  this.getDefault = function(name,def){
    if (storage[name]==undefined){
       return def;
    }
    return storage[name];
  }
  //-------------------------------------------------------
  // putArray
  //
  // We add an asterix to the name of the array so that we
  // know it's an array. JavaScript doesn't provide a
  // reliable way of recognizing arrays
  //-------------------------------------------------------
  this.putArray = function(name,array){
    storage[name+"*"]=array;
    return this;
  }
  //-------------------------------------------------------
  // getArray
  //-------------------------------------------------------
  this.getArray = function(name){
    console_write("getArray: "+name);

    var a = storage[name+"*"];
    if (typeof a != 'undefined'){
       for (var i=0; i<a.length; i++){
           var v = a[i];
           console_write("elem: "+(v===null?'^':v));
       }
    }
    return storage[name+"*"];
  }
  //-------------------------------------------------------
  // remove
  //-------------------------------------------------------
  this.remove = function(name){
    if (name in storage){
       delete storage[name];
    } else { //it might be an array
       if (name+'*' in storage){
          delete storage[name='*'];
       }
    }
  }

  //-------------------------------------------------------
  // save
  //-------------------------------------------------------
  this.save = function(){
    var result = "";
    for (var i in storage){
        var value = storage[i];
        if (i.indexOf("*")==-1){ //Then save a single value
           //alert("value "+value+" encoded: "+encode(value));
           if (value==null){
              result = result + "~" + i + "~=*n";
           } else {   
              result = result + "~" + i + "~=" + ig_cookie_encode(value);
           }
        } else { //then save an array of values

           result = result + "~" + i;
           if (value.length==0){
              result = result + "~0"; //special indicator for empty arrays
           } else {
             for (var i=0; i<value.length; i++){
                 if (value[i]==null){
                    result = result + "~**n";
                 } else {    
                    result += "~*" + ig_cookie_encode(value[i]);
                 }
             }
           }
        }
    }
    console_write("result: "+result);
    createCookie(theName,result,days);
  }
  //-------------------------------------------------------
  // setDays
  //-------------------------------------------------------
  this.setDays = function(d){
    days = d;
  }
  function double_char(mystring,char){
    var encoded = "";
    var rep = char+char;
    var parts = String(mystring).split(char); //split on characters
    //rebuild replacing the tildes with 2 tildes
    var delim = "";
    for (var i=0; i<parts.length; i++){
        encoded += delim + parts[i];
        delim = rep;
    }
    return encoded;
  }
  //tildes become double tildes
  //asterixes become double asterixes
  function ig_cookie_encode(mystring){
    return double_char(double_char(mystring,'~'),'*');
  }
  function remove_double_chars(mystring,char){
    var result = "";
    var target = char+char;
    var parts = String(mystring).split(target); //split on double tildes
    var delim = "";
    for (var i=0; i<parts.length; i++){ //reassemble with single tildes
        result += delim + parts[i];
        delim = char;
    }
    return result;
  }
  //double tildes become single tildes
  //double asterixes become single asterixes
  function ig_cookie_decode(mystring){
    if (mystring=='*n'){ //means null
       return null;
    }
    return remove_double_chars(remove_double_chars(mystring,'~'),'*');
  }
  
  // String format is a repetition of this pattern "~ name ~= value" that is
  // each name value pair starts with a single tilde.  Names are separated from
  // values by a tilde-equals pair.  Tildes that existed in the value strings
  // are replaced by double tildes.
  //
  // So the algorithm is to first break up the string into pairs acording to the
  // single tildes.  Then break the pairs into names and values using the ~=.
  // Then replace any double tildes in the value with single tildes.
  //
  function parse(string){
    var pairs = breakAtSingleTildes(string);
    for (var i=0; i<pairs.length; i++){
        //first determine if this is an array or a singular value
        //the character following the first tilde makes the determination
        //"=" means single "*" means array
        var index = pairs[i].indexOf("~");
        var name = pairs[i].substr(0,index);
        if (pairs[i].charAt(index+1)=="="){     //handle single value
           var value = pairs[i].substr(index+2);
           storage[name] = ig_cookie_decode(value);

        } else if (pairs[i].charAt(index+1)=="*"){ //handles array
           var valuestring = pairs[i].substr(index+2);
           var values = new Array();
           var array_index=0;
           var value_index=0;
           while ((value_index = valuestring.indexOf("~*",value_index)) > -1){   //values are separated by a "~*" so we need to find one
                 //if (value_index==0 || valuestring.charAt(value_index-1)!="~"){   //not preceaded by a tilde
                 if (value_index==0 || preceededByEvenNumberOfTildes(valuestring,value_index)){   //not preceaded by a tilde
                    //we found a value end
                    var value = valuestring.substr(0,value_index);
                    values[array_index++] = ig_cookie_decode(value);
                    valuestring = valuestring.substr(value_index+2);
                    value_index=0;
                 } else { //its a false seperator.  skip it
                   value_index++;
                 }
           }
           values[array_index++]=ig_cookie_decode(valuestring);
           storage[name]=values;
        } else if (pairs[i].charAt(index+1)=="0"){ //handles empty array
           storage[name]= new Array();
        } else {
          throw "error parsing value.  Expeced ~=, ~* or ~0 to separate name from value";
        }

    }

  }

  function preceededByEvenNumberOfTildes(string, index){
    var count=0;
    var back_count = index-1;
    if (index==0){
       return true;
    }
    while (back_count > -1 && string.charAt(back_count--)=="~"){
          count++;
    }
    return ((count%2)==0);
  }

  // Breaks a string up at single tildes and discards the tildes.
  // returns the pieces as an array
  function breakAtSingleTildes(string){
    var results = new Array();
    var remainder = string;
    var results_index = 0;

    if (string==null){
       return results;
    }

    while (true){

          if (remainder.length==0){ //then we're done
             return results;        //return what we have
          }

          if (remainder.charAt(0)!="~"){
             throw "Badly formed storage string.  missing a tilde separator";
          }
          remainder = remainder.substr(1); //remove the initial tilde

          //find the next tilde not followed by an equals or another tilde
          index = remainder.indexOf("~");
          //This one should be followed by an equals
          var nextchar = remainder.charAt(index+1);
          if (nextchar!= "=" && nextchar!="*" && nextchar!="0"){
             throw "Badly formed storage string.  missing an equals, or asterix value separator"
          }
          while (true){
                //Now we're in the value portion.  Keep searching until
                //you find a single tilde
                index = remainder.indexOf("~",index+1);
                if (index==-1){ //we're at the end of the string and we're done
                   results[results_index++] = remainder;
                   return results;
                }
                //if The index is at the end of the string, we have a problem
                if (index+1 == remainder.length) {
                   throw "Badly formed storage string.  missing an equals value separator";
                }
                //if the tilde is not followed by another tilde
                //we've found the end of this pair
                if (remainder.charAt(index+1)=="~"){
                   index++; //skip the 2nd tilde
                } else if (remainder.charAt(index+1)=="*"){
                   index++; //skip the asterix
                } else {
                   results[results_index++] = remainder.substr(0,index);
                   remainder = remainder.substr(index);
                   break;
                }
          }
    }

  }

  return this;
}
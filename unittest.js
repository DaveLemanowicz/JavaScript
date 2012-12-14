//function stuff(){
//         var chars = "~*=n";
//         var ret = '';
//         for (var i=0; i<24; i++) {
//             var rnum = Math.floor(Math.random() * chars.length);
//             ret += chars.charAt(rnum);
//         }
//         return ret;
//}
function randomstring(){
         var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
         var ret = '';
         for (var i=0; i<8; i++) {
             var rnum = Math.floor(Math.random() * chars.length);
             ret += chars.charAt(rnum);
         }
         return ret;
}
function comparearray(arr1,arr2){
  if (arr1.length != arr2.length){
     return false;
  }
  for (var i=0; i<arr1.length; i++){
      if (arr1[i]!=arr2[i]){
         return false;
      }
  }
  return true;
}

test( "Test Empty Persist Object", function() {
  
  var random_str = randomstring(); //used to ensure cookie doesn't exist from previous run
  var p = new ClientSideStorage(random_str); //create a storage box that doesn't already exist
  
  //Verify that you can call methods on the new object without crashing
  p.remove();
  ok(true,'There was nothing to remove but no exception should have been thrown');
  ok(p.contains('some_value')===false,"Calling contains() on brand new storage should return false");
  ok(typeof p.get('some_value')=='undefined',"Calling get() on brand new storage should return undefined ");
  ok(p.getDefault('some_value',10)==10,"Calling getDefault() on brand new storage should return the default ");
  ok(typeof p.getArray('some_value')=='undefined',"Calling getArray() on brand new storage should return undefined ");
  
  p.save();
  ok(true,'There was nothing to save but no exception should have been thrown');
  
  //create new storage object with the same name and repeat tests. Although the object does have an actual 
  //cookie behind it it should still respond to the same tests with the same values
  var p2 = new ClientSideStorage(random_str); //create a storage box that doesn't already exist

  //Verify that you can call methods on the new object without crashing
  p2.remove();
  ok(true,'There was nothing to remove but no exception should have been thrown');
  ok(p2.contains('some_value')===false,"Calling contains() on brand new storage should return false");
  ok(typeof p2.get('some_value')=='undefined',"Calling get() on brand new storage should return undefined ");
  ok(p2.getDefault('some_value',10)==10,"Calling getDefault() on brand new storage should return the default ");
  ok(typeof p2.getArray('some_value')=='undefined',"Calling getArray() on brand new storage should return undefined ");
  
  p2.save();
  ok(true,'There was nothing to save but no exception should have been thrown');
});
test( "Test scalar values", function() {
  var random_str = randomstring(); //used to ensure cookie doesn't exist from previous run
  var p = new ClientSideStorage(random_str); //create a storage box that doesn't already exist
  var my_number = 30;
  var my_string = 'Elephant';
  p.put('a_number',20);
  p.put('a_string','whatever');
  p.put('a_string','hippo'); //overwrite a value
  p.put('var_number',my_number);
  p.put('var_string',my_string);
  p.put('i_am_empty','');
  p.put('i_am_null',null);
  p.put('detele_me','ok');
  p.remove('delete_me');
  
  //see if the expected values are there
  ok(p.contains('a_number')===true,'Calling contains on a numeric value that exists should return true');
  ok(p.get('a_number')==20,'Calling get on a numeric value before storage is saved should return the proper value');
  ok(p.contains('a_string')===true,'Calling contains on a numeric value that exists should return true');
  ok(p.get('a_string')=='hippo','Calling get on a string value before storage is saved should return the proper value');
  ok(p.contains('var_number')===true,'Calling contains on a numeric value that exists should return true');
  ok(p.get('var_number')==my_number,'Calling get on a numeric value from a variable before storage is saved should return the proper value');
  ok(p.contains('var_string')===true,'Calling contains on a numeric value that exists should return true');
  ok(p.get('var_string')==my_string,'Calling get on a string value from a variable before storage is saved should return the proper value');
  ok(p.contains('i_am_empty')===true,'Calling contains on a numeric value that exists should return true');
  ok(p.get('i_am_empty')=='','Calling get on an empty string should return an empty string');
  ok(p.contains('i_am_null')===true,'Calling contains on a numeric value that exists should return true');
  ok(p.get('i_am_null')==null,'Calling get on a value saved as null should return null');
  ok(typeof p.get('delete_me')=='undefined','Calling get on a value that was deleted should return undefined');

  p.save();
  var p2 = new ClientSideStorage(random_str);

  ok(p2.contains('a_number')===true,'Calling contains on a numeric value that exists should return true');
  ok(p2.get('a_number')==20,'Calling get on a numeric value before storage is saved should return the proper value');
  ok(p2.contains('a_string')===true,'Calling contains on a numeric value that exists should return true');
  ok(p2.get('a_string')=='hippo','Calling get on a string value before storage is saved should return the proper value');
  ok(p2.contains('var_number')===true,'Calling contains on a numeric value that exists should return true');
  ok(p2.get('var_number')==my_number,'Calling get on a numeric value from a variable before storage is saved should return the proper value');
  ok(p2.contains('var_string')===true,'Calling contains on a numeric value that exists should return true');
  ok(p2.get('var_string')==my_string,'Calling get on a string value from a variable before storage is saved should return the proper value');
  ok(p2.contains('i_am_empty')===true,'Calling contains on a numeric value that exists should return true');
  ok(p2.get('i_am_empty')=='','Calling get on an empty string should return an empty string');
  ok(p2.contains('i_am_null')===true,'Calling contains on a numeric value that exists should return true');
  ok(p2.get('i_am_null')==null,'Calling get on a value saved as null should return null');
  ok(p2.contains('delete_me')===false,'Calling contains on a value that\'s been deleted should return false');
  ok(typeof p2.get('delete_me')=='undefined','Calling get on a value that was deleted should return undefined');
  
  p2.remove('a_number'); //remove a value that's actually in the cookie
  ok(typeof p2.get('a_number')=='undefined','Calling get on a value that was deleted should return undefined even if the value wasd in the cookie');
  
  p2.save(); //resave after deleting a value
  var p3 = new ClientSideStorage(random_str);
  
  ok(p3.contains('a_number')===false,'Calling contains on a value that\'s been deleted should return false');
  ok(typeof p3.get('a_number')=='undefined','Calling get on a value that used to be in the cookie and then deleted should return undefined');
  ok(p3.contains('a_string')===true,'Calling contains on a numeric value that exists should return true');
  ok(p3.get('a_string')=='hippo','Calling get on a string value before storage is saved should return the proper value');
  ok(p3.contains('var_number')===true,'Calling contains on a numeric value that exists should return true');
  ok(p3.get('var_number')==my_number,'Calling get on a numeric value from a variable before storage is saved should return the proper value');
  ok(p3.contains('var_string')===true,'Calling contains on a numeric value that exists should return true');
  ok(p3.get('var_string')==my_string,'Calling get on a string value from a variable before storage is saved should return the proper value');
  ok(p3.contains('delete_me')===false,'Calling contains on a value that\'s been deleted should return false');
  ok(typeof p3.get('delete_me')=='undefined','Calling get on a value that was deleted should return undefined');

});

test( "Test array values", function() {
  var random_str = randomstring(); //used to ensure cookie doesn't exist from previous run
  var p = new ClientSideStorage(random_str); //create a storage box that doesn't already exist
  var my_num_array = [1,2,3];
  var my_str_array = ['123','456','789'];
  var my_mixed_array = ['x',null,'null','',100,'*'];

  p.putArray('my_num_array',my_num_array);
  p.putArray('my_str_array',my_str_array);
  p.putArray('my_mixed_array',my_mixed_array);
  p.save();
  
  var p2 = new ClientSideStorage(random_str);

  ok(p2.contains('my_num_array')==true,'Contains can be called on arrays');
  ok(comparearray(p2.getArray('my_num_array'),my_num_array),'Scalar arrays can be retrived');
  ok(p2.contains('my_str_array')==true,'Contains can be called on arrays');
  ok(comparearray(p2.getArray('my_str_array'),my_str_array),'String arrays can be retrived');
  
  ok(p2.contains('my_mixed_array')==true,'Contains can be called on arrays');
  ok(comparearray(p2.getArray('my_mixed_array'),my_mixed_array),'Mixed arrays can be retrived');
  
  

});

test( "Test special characters array", function() {
  //Tildes, equals and asterixes are used internally. So this test attempts to confuse the storage
  var random_str = randomstring(); //used to ensure cookie doesn't exist from previous run
  var p = new ClientSideStorage(random_str); //create a storage box that doesn't already exist
  var myarray = ['*n','=','~','~='];
  var randarray = [
        "===~*===~~*~n=*=n=n~*~*=",
        "=n~=*=~nn~n==n~*=n==*~~~",
        "~*~*~*~*==n**nnn~==~nnn~",
        "=~=*=~*~~*=~**n*n~=~~==~",
        "=n**~n~~*n=nnnnn=~=~=n~=",
        "=n**~*~=n~*=n**~nn*nn==*",
        "*n~*n~~n*=~~**===***==*=",
        "*~*~~~*~=n*~*n=~n~*nn~**",
        "~nnnn**~**n*~*===~n=*nn*",
        "~*=n*=*~n~=nn=n~=*n*~*nn",
        "~n*n~*==~***===**~nnn*~n",
        "=n~*=n=**==*n**n==~**n~n",
        "=~~*~~*==***=n~***=~*=*~",
        "~n**~*==~n***=n*n=*===n~",
        "==~*=*==~~=~=nn*=~~*==n=",
        "=n==~*n*~~*==~n*~**=~==*",
        "**=~*n~=n~*~~*n~=*~~nnn*",
        "=n~=n~~**=n=~*n=~=nn*~=n",
        "n*==~n~*~*~~*~nnn~==*~**",
        "n=n~==n~*n~~=*=*n~nn=~=*"];
  
  p.putArray('myarray',myarray);
  p.putArray('randarray',randarray);
  p.save();
  var p2 = new ClientSideStorage(random_str);
  
  ok(p2.contains('myarray')==true,'Calling contains() for a value that looks like the null indicator return true');
  ok(comparearray(p2.getArray('myarray'),myarray) ,'Calling get() for an array with special cgaracters return the proper values');
  ok(p2.contains('randarray')==true,'Calling contains() for a value that looks like the null indicator return true');
  ok(comparearray(p2.getArray('randarray'),randarray) ,'Calling get() for an array with special cgaracters return the proper values');
  
  

});

test( "Test special characters scalar", function() {
  //Tildes, equals and asterixes are used internally. So this test attempts to confuse the storage
  var random_str = randomstring(); //used to ensure cookie doesn't exist from previous run
  var p = new ClientSideStorage(random_str); //create a storage box that doesn't already exist
  var rand01 = '===~*===~~*~n=*=n=n~*~*=';
  var rand02 = '=n~=*=~nn~n==n~*=n==*~~~';
  var rand03 = '~*~*~*~*==n**nnn~==~nnn~';
  var rand04 = '=~=*=~*~~*=~**n*n~=~~==~';
  var rand05 = '=n**~n~~*n=nnnnn=~=~=n~=';
  var rand06 = '=n**~*~=n~*=n**~nn*nn==*';
  var rand07 = '*n~*n~~n*=~~**===***==*=';
  var rand08 = '*~*~~~*~=n*~*n=~n~*nn~**';
  var rand09 = '~nnnn**~**n*~*===~n=*nn*';
  var rand10 = '~*=n*=*~n~=nn=n~=*n*~*nn';
  var rand11 = '~n*n~*==~***===**~nnn*~n';
  var rand12 = '=n~*=n=**==*n**n==~**n~n';
  var rand13 = '=~~*~~*==***=n~***=~*=*~';
  var rand14 = '~n**~*==~n***=n*n=*===n~';
  var rand15 = '==~*=*==~~=~=nn*=~~*==n=';
  var rand16 = '=n==~*n*~~*==~n*~**=~==*';
  var rand17 = '**=~*n~=n~*~~*n~=*~~nnn*';
  var rand18 = '=n~=n~~**=n=~*n=~=nn*~=n';
  var rand19 = 'n*==~n~*~*~~*~nnn~==*~**';
  var rand20 = 'n=n~==n~*n~~=*=*n~nn=~=*';
  
  p.put('like_null','*n');
  p.put('equals','=');
  p.put('tilde','~');
  p.put('tildeEquals','~=');
  p.put('rand01',rand01);
  p.put('rand02',rand02);
  p.put('rand03',rand03);
  p.put('rand04',rand04);
  p.put('rand05',rand05);
  p.put('rand06',rand06);
  p.put('rand07',rand07);
  p.put('rand08',rand08);
  p.put('rand09',rand09);
  p.put('rand10',rand10);
  p.put('rand11',rand11);
  p.put('rand12',rand12);
  p.put('rand13',rand13);
  p.put('rand14',rand14);
  p.put('rand15',rand15);
  p.put('rand16',rand16);
  p.put('rand17',rand17);
  p.put('rand18',rand18);
  p.put('rand19',rand19);
  p.put('rand20',rand20);
  
  p.save();
  
  var p2 = new ClientSideStorage(random_str);
  
  ok(p2.contains('like_null')==true,'Calling contains() for a value that looks like the null indicator return true');
  ok(p2.get('like_null')=='*n','Calling get() for a value that looks like the null indicator return *n');
  ok(p2.contains('equals')==true,'Calling contains() for an equal sign returns true');
  ok(p2.get('equals')=='=','Calling get() for an equal sign works');
  ok(p2.contains('tilde')==true,'Calling contains() for a tilde returns true');
  ok(p2.get('tilde')=='~','Calling get() for a tilde works');
  ok(p2.contains('tildeEquals')==true,'Calling contains() for a tilde returns true');
  ok(p2.get('tildeEquals')=='~=','Calling get() for a tilde works');
  ok(p2.contains('rand01')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand01')==rand01,'Calling get() for a random special characters works');
  ok(p2.contains('rand02')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand02')==rand02,'Calling get() for a random special characters works');
  ok(p2.contains('rand03')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand03')==rand03,'Calling get() for a random special characters works');
  ok(p2.contains('rand04')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand04')==rand04,'Calling get() for a random special characters works');
  ok(p2.contains('rand05')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand05')==rand05,'Calling get() for a random special characters works');
  ok(p2.contains('rand06')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand06')==rand06,'Calling get() for a random special characters works');
  ok(p2.contains('rand07')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand07')==rand07,'Calling get() for a random special characters works');
  ok(p2.contains('rand08')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand08')==rand08,'Calling get() for a random special characters works');
  ok(p2.contains('rand09')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand09')==rand09,'Calling get() for a random special characters works');
  ok(p2.contains('rand10')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand10')==rand10,'Calling get() for a random special characters works');
  ok(p2.contains('rand11')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand11')==rand11,'Calling get() for a random special characters works');
  ok(p2.contains('rand12')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand12')==rand12,'Calling get() for a random special characters works');
  ok(p2.contains('rand13')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand13')==rand13,'Calling get() for a random special characters works');
  ok(p2.contains('rand14')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand14')==rand14,'Calling get() for a random special characters works');
  ok(p2.contains('rand15')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand15')==rand15,'Calling get() for a random special characters works');
  ok(p2.contains('rand16')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand16')==rand16,'Calling get() for a random special characters works');
  ok(p2.contains('rand17')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand17')==rand17,'Calling get() for a random special characters works');
  ok(p2.contains('rand18')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand18')==rand18,'Calling get() for a random special characters works');
  ok(p2.contains('rand19')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand19')==rand19,'Calling get() for a random special characters works');
  ok(p2.contains('rand20')==true,'Calling contains() for a random special characters returns true');
  ok(p2.get('rand20')==rand20,'Calling get() for a random special characters works');

  
});


$( document ).ready(function() {
 
    $( ".rt" ).click(function ( event ) {

        $( this ).toggleClass("rt-pressed");

    });

    $( ".like" ).click(function( event ) {
 
        $( this ).toggleClass("liked");
        $( this ).find("i").toggleClass(["far", "fas"]);
 
    });
 
});
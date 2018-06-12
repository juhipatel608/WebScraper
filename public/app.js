
var currentURL = window.location.origin;

$(document).on("click", ".notes", function() {
  
    $("#notes").empty();
 
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    
    .done(function(data) {
        $("#"+thisId).append("<h5 class='notesArticle'>" + data.title + "</h5>");
        $("#"+thisId).append("<input id='titleInput' name='title' placeholder='enter a note title'>");
        $("#"+thisId).append("<textarea id='bodyInput' name='noteBody' placeholder='enter your notes'></textarea>");
        $("#"+thisId).append("<button data-id='" + data._id + "' id='saveNote'> Save </button>");
        if (data.notes) {
            $("#titleInput").val(data.notes.title);
            $("#bodyInput").val(data.notes.body);
        }
    });
});

$(document).on("click", "#saveNote", function() {
 
    var thisId = $(this).attr("data-id");

    
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
         
            title: $("#titleInput").val(),
            
            body: $("#bodyInput").val()
        }
    })
    .done(function(data) {
        
        console.warn(data);
        if (data.notes) {
            console.log(data.notes)
            for(var note in data.notes){
                $("#"+thisId).append("<p>"+$(this).title + ": " + $(this).body + "</p>")
            }
              
            // $("#titleInput").val(data.notes.title);
            // $("#bodyInput").val(data.notes.body);
        }
        $("#"+thisId).append("<h5 class='notesArticle'>" + data.title + "</h5>");
        $("#"+thisId).append("<input id='titleInput' name='title' placeholder='enter a note title'>");
        $("#"+thisId).append("<textarea id='bodyInput' name='noteBody' placeholder='enter your notes'></textarea>");
        $("#"+thisId).append("<button data-id='" + data._id + "' id='saveNote'> Save </button>");
        
    });
});


$(document).on("click", ".saveArticle", function() {
    var articleId = $(this).attr("data-id");
    var articleToSave = $(this).parent().parent().parent();
    $.post({
        url: currentURL + "/save",
        data: { 
            articleId: articleId
        }
    })
    .done(function(data) {
        console.log(data);
        articleToSave.remove();
    })
    .fail(function(error) { 
        console.log(error);
    })
});


$(document).on("click", ".unsaveArticle", function() {
    var articleId = $(this).attr("data-id");
    var articleToUnsave = $(this).parent().parent().parent();
    $.post({
        url: currentURL + "/unsave",
        data: { 
            articleId: articleId
        }
    })
    .done(function(data) {
        console.log(data);
        articleToUnsave.remove();
    })
    .fail(function(error) { 
        console.log(error);
    })
});
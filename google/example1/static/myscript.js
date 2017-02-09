$( document ).ready(function() {
    function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());


      var id_token = googleUser.getAuthResponse().id_token;
      console.log(id_token);
      token_url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token;
      
      $.get(token_url, function(data) {
        aud = {'aud': data["aud"]};
        $.post("/tokencheck",
            aud,
            function(adata) {
            console.log(adata);
            });
      });

    }
    document.getElementById("signout").addEventListener("click", signOut);

    function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
      }
    var myPoints = 0;
    var next = 1;
    var completed = 0;
    var pctCompleted = 0;
    var dataset = [];
    $(".add-more").click(function(e){
        e.preventDefault();
        if ($("span").length === 0) {
            console.log("none");
            var newIn = '</p><p><span id="set1"><input type="checkbox" class="item1 check form-control" id="check1"> <input class="input form-control" id="description" type="text" placeholder="description" style="width: 200px"> <input type="number" class="item1" points form-control" id="points1" placeholder="points" style="width: 80px"> <button id="remove1" class="btn btn-danger remove-me form-control" style="inline">-</button></span>';
            $("#todolist").prepend(newIn);
        }
        var addto = "#set" + next;
        var addRemove = "#points" + next;
        next++;

        var newIn = '</p><p><span id="set' + next + '"><input type="checkbox" class="item' + next +
        ' check form-control" id="check"' + next +
        '> <input class="input form-control" id="description" type="text" placeholder="description" style="width: 200px"> <input type="number" class="item' + next +
        ' points form-control" id="points' + next +
        ' " placeholder="points" style="width: 80px"> <button id="remove' + next +
        '" class="btn btn-danger remove-me form-control" style="inline">-</button></span>';

        // var removeBtn = '<button id="remove' + (next - 1) + 
        // '" class="btn btn-danger remove-me form-control" style="inline">-</button>';

        $(addto).after(newIn);


        $("#count").val(next);
        
        $('.remove-me').click(function(e){
            e.preventDefault();
            var fieldNum = this.id.charAt(this.id.length-1);
            var fieldID = "#set" + fieldNum;
            $(this).remove();
            $(fieldID).remove();
        });
        setUp();
    });
    function calcGoalPoints() {
        var possiblePoints = 0;
        $(".points").each(function() {
            possiblePoints += +$(this).val();
        });
        return possiblePoints;
    }
    function calcCompletion() {
        completed = $("input[type='checkbox']:checked").length;
        pctCompleted = completed/next;
        console.log(pctCompleted);
        dataset = [completed, next];
        runVisualization(dataset);
    }

    function setUp() {
        $("form").on("change", function() {
            var goal = "Your goal is: " + calcGoalPoints();
            $("#goal").text(goal);
        });
        $(".check").on("change", function() {
            calcCompletion();
        });
        // $("input[type='checkbox']").on("change", function() {
        //     console.log("change");
        //     if ($(this).is(":checked") === true) {
        //         console.log("plus");
        //         myPoints += parseInt($(this).siblings(".points").val());
        //     } else if ($(this).is(":checked") === false) {
        //         console.log("minus");
        //         myPoints -= $(this).siblings(".points").val();
        //     }
        //     console.log(myPoints)
        // });
    }
    setUp();
    function runVisualization(dataset) {
        console.log(dataset);
        $("figure").empty();
        var svg = d3.select("figure").selectAll("div")
                .data(dataset)
                .enter()
                .append("svg")
                .attr("width", 100)
                .attr("height", function(d) {
                    return d*50 + "px";
                });
        var text = svg.selectAll("text")
                .data(dataset)
                .enter()
                .append("text")
                .text(function(d) {
                    return d;
                })
    }
});

$(document).ready(function () {
    var hash = 'b4f06f0d4337c3af720f37ef402c1ad9d6f3058f';
    var skillsUrl;
    var profileUrl;
    var learningInUrl;
    var learningOutUrl;
    if (hash !== undefined) {
        skillsUrl = "https://ax4kqagln6.execute-api.eu-west-1.amazonaws.com/test/gcscc/skills/public/" + hash;
        profileUrl = "https://ax4kqagln6.execute-api.eu-west-1.amazonaws.com/test/gcscc/profile/public/" + hash;
        learningInUrl = "https://ax4kqagln6.execute-api.eu-west-1.amazonaws.com/test/gcscc/learning/byperson/in/" + hash;
        learningOutUrl = "https://ax4kqagln6.execute-api.eu-west-1.amazonaws.com/test/gcscc/learning/byperson/out/" + hash;
    }
    $.ajax({
        url: skillsUrl
    }).then(function (data) {
        if (data.interested) {
            for (var i = 0; i < data.interested.length; i++) {
                if (data.interested[i].valid === true) {
                    $("#interested").append(generateTagLink(data.interested[i].tag));
                }
            }
        }
        if (data.learning) {
            for (var l = 0; l < data.learning.length; l++) {
                if (data.learning[l].valid === true) {
                    $("#learning").append(generateTagLink(data.learning[l].tag));
                }
            }
        }
        if (data.using) {
            for (var u = 0; u < data.using.length; u++) {
                if (data.using[u].valid === true) {
                    $("#using").append(generateTagLink(data.using[u].tag));
                }
            }
        }
        if (data.used) {
            for (var d = 0; d < data.used.length; d++) {
                if (data.used[d].valid === true) {
                    $("#used").append(generateTagLink(data.used[d].tag));
                }
            }
        }
    });
    $.ajax({
        url: profileUrl
    }).then(function (data) {
        if (data != null && data.name) {
            data.name ? $("#name").append(data.name) : $("#name").append(data.email);
            if (data.title) {
                $("#title").append(data.title)
            }
            if (data.imageUrl != null) {
                $("#image").attr("src", data.imageUrl);
                $("#image").attr("alt", data.name);
            }
            else {
                $("#title-div").attr("class", "col-md-12");
                $("#image-div").remove();
            }
        }
        else {
            $("#name").append(email);
            $("#title").remove();
            $("#image-div").remove();
        }
    });
    $.ajax({
        url: learningInUrl
    }).then(function (data) {
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                $("#learning-in").append('<a class="' + (data[i].valid === true ? 'label label-info' : 'label secondary') + '" ' + generateTagLink(data[i].tag) + '>' + data[i].tag + '</a> ');
                var sources = data[i].sources;
                for (var j = 0; j < sources.length; j++) {
                    var name = sources[j].name;
                    var hash = sources[j].hash;
                    if (name !== null)
                        $("#learning-in").append('<a class="label secondary" href="http://profile.gcscc.site?hash=' + hash + '">' + name + '</a> ');
                }
            }
        }
    });
    $.ajax({
        url: learningOutUrl
    }).then(function (data) {
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                $("#learning-out").append('<a class="' + (data[i].valid === true ? 'label label-info' : 'label secondary') + '" ' + generateTagLink(data[i].tag) + '>' + data[i].tag + '</a> ');
                var sources = data[i].sources;
                for (var j = 0; j < sources.length; j++) {
                    var name = sources[j].name;
                    var hash = sources[j].hash;
                    if (name !== null)
                        $("#learning-out").append('<a class="label secondary" href="http://profile.gcscc.site?hash=' + hash + '">' + name + '</a> ');
                }
            }
        }
    });
});

function generateTagLink(tag) {
    return '<a class="label label-info" ' + 'href="http://stackoverflow.com/tags/' + tag + '" target="_blank">' + tag + '</a> '
}
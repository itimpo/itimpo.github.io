
var subtitles1 = [];
var subtitles2 = [];
var id = null;

$(function () {

    $(document).on('submit', '#form-url', function (e) {
        //e.preventDefault();
        var form = $(this);
        var url = form.find('#url').val(); //https://www.youtube.com/watch?v=rIzHUfDB28o
        id = url.split('?v=')[1];
        form.find('#id').val(id);
    });

    $(document).on('click', '#languages .btn', function () {
        var btn = $(this);

        getSubtitles(btn.data('url'));

    });

    id = getUrlParameter('id');

    if (id) {
        loadSubtitles(id);
    }
})

function loadSubtitles(id) {

    getList(id);

}

function getList(id) {

    $.ajax({
        type: "GET",
        url: 'https://www.youtube.com/api/timedtext?v=' + id + '&type=list',
        dataType: "xml",
    }).done(function (xml) {
        $('#languages').html('');


        $(xml).find("track").each(function (ti, tv) {
            var code = $(tv).attr('lang_code');
            var name = $(tv).attr('name');

            var btn = $('<a class="btn btn-default mb-2">' + $(tv).attr('lang_original') + '</a>')
                .data('url', 'https://www.youtube.com/api/timedtext?lang=' + code + '&v=' + id + '&name=' + name + '&fmt=json3');

            $('#languages').append(btn);
        });

        var first = $(xml).find("track")[0];

        var code = $(first).attr('lang_code');
        var name = $(first).attr('name');

        //add translate language
        var btn = $('<a class="btn btn-default mb-2">' + 'Русский' + '</a>') 
            .data('url', 'https://www.youtube.com/api/timedtext?lang=' + code + '&v=' + id + '&name=' + name + '&tlang=ru&fmt=json3');

        $('#languages').append(btn);
    });

    //<transcript_list docid="12433531826008611786" capture-installed="true">
    //    <track id="1" name="" lang_code="en" lang_original="English" lang_translated="English" lang_default="true" />
    //    <track id="0" name="" lang_code="de" lang_original="Deutsch" lang_translated="German" />
    //</transcript_list>
}


function getSubtitles(url) {

    //https://www.youtube.com/api/timedtext?lang=de-DE&v=hxjnotQy4VQ&name=UT&fmt=json3
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
    }).done(function (data) {

        //console.log(data);

        subtitles1 = subtitles2;

        subtitles2 = _.map(data.events, function (ev) { return _.map(ev.segs, function (s) { return s.utf8; }).join("<br/>"); });

        //console.log(subtitles2);

        renderSubtitles();
    });
}


function renderSubtitles() {

    var merged = _.zip(subtitles1, subtitles2);

    //console.log(merged);

    var result = $('#result');

    result.html('');

    _.each(merged, function (s) {
        result.append('<li>' + s[0] + (s.length>1?'<ul><li>'+(s[1]||'-')+'</li></ul>':'') + '</li>');
    });
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

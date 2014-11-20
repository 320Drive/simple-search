skrollr.init(
	{
		smoothScrolling:true,
		smoothScrollingDuration:1000,
		render: function(data) {
	        //Log the current scroll position.
	        //console.log(data.curTop);
	    }
	}
);

$('#search-form').submit(function(e) {
    e.preventDefault();
    $('.search-section').fadeOut('normal', function() {
        $(this).hide();
    });
    $('.content-wrapper').css('padding', '150px 0px 400px');
    $('.common-queries').hide();
    $('.about').hide();
    var query = $('#search-field').val();
    query = parseQuery(query);
    solrSearch(query);
    $('.search-results').show();
});

function parseQuery(query) {
    var parsedQuery = query.split(' ').join('+');
    return parsedQuery;
}

function solrSearch(query) {
    $.ajax({
        async: false,
        type: 'GET',
        url: 'https://128.208.102.114:8443/solr-example/collection1/select',
        dataType: 'JSONP',
        data: {
            'q': 'content:' + query,
            'wt': 'json',
            'indent': false,
            'fl': 'url,title',
            'score': 'score desc'
        },
        jsonp: 'json.wrf',
        success: function (data, textStatus, jqXHR) {
            renderSearchResults(data.response);
        }
    });
}

function renderSearchResults(searchResults) {
    for (var i = 0; i < searchResults.docs.length; i++) {
        var title = searchResults.docs[i].title;
        var url = searchResults.docs[i].url;
        var resultItem = $('<a>', {href: url, text: title});
        $('.search-results .container').append(resultItem).append('<br />');
    }
}
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

var query = '';
var start = 0;
$('#search-form').submit(function(e) {
    e.preventDefault();
    $('.search-section').fadeOut('normal', function() {
        $(this).hide();
    });
    $('.content-wrapper').css('padding', '150px 0px 400px');
    $('.common-queries').hide();
    $('.about').hide();
    query = $('#search-field').val();
    query = parseQuery();
    solrSearch();
    $('.search-results').show();
	$('.search-results .container').on('click', '#next-page', function() {
		solrSearch();
	});
});

function parseQuery() {
    var parsedQuery = query.split(' ').join('+');
    return parsedQuery;
}

function solrSearch() {
	start = start || 0;
    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://128.208.102.114:8080/select',
        dataType: 'JSONP',
        data: {
            'q': 'content:' + query,
            'wt': 'json',
            'indent': false,
            'fl': 'url,title',
            'score': 'score asc',
			'rows': '10',
			'start': start
        },
        jsonp: 'json.wrf',
        success: function (data, textStatus, jqXHR) {
            renderSearchResults(data.response);
        }
    });
}

function renderSearchResults(searchResults) {
	$('.search-results .container').empty();
	start = searchResults.start + 10;
    for (var i = 0; i < searchResults.docs.length; i++) {
        var title = searchResults.docs[i].title;
        var url = searchResults.docs[i].url;
        var resultItem = $('<a>', {href: url, text: title});
        $('.search-results .container').append(resultItem).append('<br />');
    }
	var nextLink = $('<a>', {href: '#', text: 'Next page', id: 'next-page'});
	$('.search-results .container').append(nextLink);
}